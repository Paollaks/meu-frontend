document.addEventListener('DOMContentLoaded', function () {
    const cadastrarBtn = document.querySelector('.form-box button');

    cadastrarBtn.addEventListener('click', async function (e) {
        e.preventDefault();

        const usuario = {
            NomeCompleto: document.getElementById('nome').value,
            NomeDeUsuario: document.querySelector('.form-box input[placeholder="Nome de Usuário"]').value,
            Email: document.getElementById('email').value,
            Senha: document.getElementById('senha').value
        };

        if (!usuario.NomeCompleto || !usuario.NomeDeUsuario || !usuario.Email || !usuario.Senha) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        if (!usuario.Email.includes('@') || !usuario.Email.includes('.')) {
            alert('Por favor, insira um email válido!');
            return;
        }

        cadastrarBtn.disabled = true;
        cadastrarBtn.textContent = 'Cadastrando...';

        try {
            // 1. Cadastrar o usuário
            const response = await fetch('https://localhost:7252/api/Usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuario)
            });

            if (response.ok) {
                const data = await response.json();
                alert('Cadastro realizado com sucesso!');

                // 2. Login automático após cadastro
                const loginResponse = await fetch('https://localhost:7252/api/Usuarios/authenticate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nomeDeUsuario: usuario.NomeDeUsuario,
                        senha: usuario.Senha
                    })
                });

                if (loginResponse.ok) {
                    const loginData = await loginResponse.json();
                    localStorage.setItem('jwtToken', loginData.token || loginData.Token);

                    // Redirecionar para index.html
                    window.location.href = '../index.html';
                } else {
                    alert('Erro ao autenticar após o cadastro.');
                }
            } else {
                const error = await response.json();
                alert(error.title || 'Erro ao cadastrar usuário');
            }
        } catch (error) {
            alert('Erro de conexão com o servidor.');
        } finally {
            cadastrarBtn.disabled = false;
            cadastrarBtn.textContent = 'Cadastrar';
        }
    });
});
