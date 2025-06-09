document.addEventListener('DOMContentLoaded', function () {
  const salvarBtn = document.querySelector('.form-box button');

  salvarBtn.addEventListener('click', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const novaSenha = document.getElementById('novaSenha').value.trim();
    const token = localStorage.getItem('jwtToken');

    if (!email || !novaSenha) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    let userId = null;

    if (token) {
      // Decodifica o token para pegar o userId
      try {
        const decoded = jwt_decode(token);
        userId = decoded.nameid || decoded.NameIdentifier || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      } catch (err) {
        // Se o token estiver inválido, segue para buscar pelo e-mail
      }
    }

    if (!userId) {
      try {
        const res = await fetch(`https://localhost:7252/api/Usuarios/public-by-email?email=${email}`);
        if (!res.ok) throw new Error();
        const usuario = await res.json();
        userId = usuario.id;
      } catch {
        alert('Não foi possível localizar o usuário pelo e-mail informado.');
        return;
      }
    }

    if (!userId) {
      alert('Usuário inválido. Verifique o e-mail informado.');
      return;
    }

    salvarBtn.disabled = true;
    salvarBtn.textContent = 'Salvando...';

    try {
      const response = await fetch(`https://localhost:7252/api/Usuarios/${userId}/alterar-senha`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          email: email,
          novaSenha: novaSenha
        })
      });

      if (response.status === 204) { // No Content
        if (confirm('Senha alterada com sucesso! Deseja ir para seu perfil?')) {
          window.location.href = 'perfil-usuario.html';
        }
      } else {
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
