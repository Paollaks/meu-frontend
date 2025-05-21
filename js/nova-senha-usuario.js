document.addEventListener('DOMContentLoaded', function () {
  const salvarBtn = document.querySelector('.form-box button');

  salvarBtn.addEventListener('click', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senhaAtual = document.getElementById('senhaAtual').value.trim();
    const novaSenha = document.getElementById('novaSenha').value.trim();
    const token = localStorage.getItem('jwtToken');

    if (!email || !senhaAtual || !novaSenha) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    if (!token) {
      alert('Você precisa estar logado para alterar a senha.');
      return;
    }

    // Decodifica o token para pegar o userId
    let userId;
    try {
      const decoded = jwt_decode(token);
      userId = decoded.nameid || decoded.NameIdentifier || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    } catch (err) {
      alert('Token inválido. Faça login novamente.');
      return;
    }

    if (!userId) {
      alert('Usuário inválido. Faça login novamente.');
      return;
    }

    salvarBtn.disabled = true;
    salvarBtn.textContent = 'Salvando...';

    try {
      const response = await fetch(`https://localhost:7252/api/Usuarios/${userId}/alterar-senha`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          senhaAtual: senhaAtual,
          novaSenha: novaSenha
        })
      });

      if (response.status === 204) { // No Content
        if (confirm('Senha alterada com sucesso! Deseja ir para seu perfil?')) {
          window.location.href = 'perfil-usuario.html';
        }
      } else {
        // tenta pegar mensagem de erro do backend
        const erro = await response.json().catch(() => null);
        alert(erro?.title || erro?.message || 'Erro ao alterar senha.');
      }
    } catch (error) {
      alert('Erro ao conectar com o servidor.');
    } finally {
      salvarBtn.disabled = false;
      salvarBtn.textContent = 'Salvar';
    }
  });
});
