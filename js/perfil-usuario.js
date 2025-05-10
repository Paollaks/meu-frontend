const userId = 1; // Exemplo: substituir com ID real do usuário logado

document.addEventListener('DOMContentLoaded', () => {
  carregarDadosUsuario();
  carregarFavoritos();
  carregarAvaliacoes();

  document.getElementById('perfil-form').addEventListener('submit', salvarPerfil);
});

function carregarDadosUsuario() {
  fetch(`https://localhost:7252/api/Usuarios/${userId}`)
    .then(res => res.json())
    .then(usuario => {
      document.getElementById('nome').value = usuario.nome;
      document.getElementById('email').value = usuario.email;
    })
    .catch(err => console.error("Erro ao carregar dados do usuário:", err));
}

function salvarPerfil(event) {
  event.preventDefault();

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;

  fetch(`https://localhost:7252/api/Usuarios/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: userId, nome, email })
  })
    .then(res => {
      if (res.ok) {
        alert("Perfil atualizado com sucesso!");
      } else {
        alert("Erro ao atualizar perfil.");
      }
    })
    .catch(err => console.error("Erro ao salvar perfil:", err));
}

function carregarFavoritos() {
  fetch(`https://localhost:7252/api/Favoritos/usuario/${userId}`)
    .then(res => res.json())
    .then(filmes => {
      const container = document.getElementById('favoritos');
      container.innerHTML = '';
      filmes.forEach(f => {
        const div = document.createElement('div');
        div.className = 'filme';
        div.innerHTML = `<img src="${f.fotoUrl}" alt="${f.titulo}" />`;
        container.appendChild(div);
      });
    })
    .catch(err => console.error("Erro ao carregar favoritos:", err));
}

function carregarAvaliacoes() {
  fetch(`https://localhost:7252/api/Avaliacoes/usuario/${userId}`)
    .then(res => res.json())
    .then(filmes => {
      const container = document.getElementById('avaliacoes');
      container.innerHTML = '';
      filmes.forEach(f => {
        const div = document.createElement('div');
        div.className = 'filme';
        div.innerHTML = `<img src="${f.fotoUrl}" alt="${f.titulo}" />`;
        container.appendChild(div);
      });
    })
    .catch(err => console.error("Erro ao carregar avaliações:", err));
}
