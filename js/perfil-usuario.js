function getUserIdFromToken() {
  const token = localStorage.getItem('jwtToken');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.nameid || payload.sub || payload.id || null;
  } catch (e) {
    return null;
  }
}

const userId = getUserIdFromToken();

document.addEventListener('DOMContentLoaded', () => {
  if (!userId) {
    alert('Usuário não conectado. Redirecionando para a página de login!');
    window.location.href = 'login-usuario.html';
    return;
  }
  carregarDadosUsuario();
  carregarFavoritos();
  carregarAvaliacoes();

  document.getElementById('alterar-dados').onclick = alterarDadosUsuario;
  document.getElementById('excluir-conta').onclick = excluirContaUsuario;
});

function carregarDadosUsuario() {
  fetch(`https://localhost:7252/api/Usuarios/${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
    }
  })
    .then(res => res.json())
    .then(usuario => {
      console.log(usuario);
      document.getElementById('nome').value = usuario.nomeCompleto;
      document.getElementById('nomeUsuario').textContent = '@' + usuario.nomeDeUsuario;
      document.getElementById('email').value = usuario.email;
    })
    .catch(err => console.error("Erro ao carregar dados do usuário:", err));
}

// Função para atualizar dados do usuário (PUT)
function alterarDadosUsuario() {
  const nomeCompleto = document.getElementById('nome').value;
  const email = document.getElementById('email').value;

  fetch(`https://localhost:7252/api/usuarios/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
    },
    body: JSON.stringify({ id: userId, nomeCompleto, email })
  })
    .then(res => {
      if (res.ok) {
        alert("Dados alterados com sucesso!");
      } else {
        alert("Erro ao alterar dados.");
      }
    })
    .catch(err => alert("Erro ao alterar dados: " + err));
}

// Função para excluir conta (DELETE)
function excluirContaUsuario() {
  if (!confirm("Tem certeza que deseja excluir sua conta? Esta ação não poderá ser desfeita.")) return;

  fetch(`https://localhost:7252/api/usuarios/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
    }
  })
    .then(res => {
      if (res.ok) {
        alert("Conta excluída com sucesso!");
        localStorage.removeItem('jwtToken');
        window.location.href = 'login-usuario.html';
      } else {
        alert("Erro ao excluir conta.");
      }
    })
    .catch(err => alert("Erro ao excluir conta: " + err));
}

function carregarFavoritos() {
  fetch(`https://localhost:7252/api/Favoritos/usuario/${userId}/filmes`, {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
    }
  })
    .then(res => res.json())
    .then(dados => {
      // Garante que filmes seja sempre um array
      const filmes =
        Array.isArray(dados) ? dados :
          Array.isArray(dados.$values) ? dados.$values :
            Array.isArray(dados.value) ? dados.value :
              [];
      const container = document.getElementById('favoritos');
      container.innerHTML = '';
      // Exibe apenas os 3 primeiros
      filmes.slice(0, 4).forEach(f => {
        const div = document.createElement('div');
        div.className = 'filme';
        div.innerHTML = `<img src="${f.fotoUrl}" alt="${f.titulo}" />`;
        container.appendChild(div);
      });
      // Redireciona ao clicar no campo de favoritos
      container.onclick = () => {
        window.location.href = 'favoritadas.html';
      };
    })
    .catch(err => console.error("Erro ao carregar favoritos:", err));
}

function carregarAvaliacoes() {
  fetch(`https://localhost:7252/api/Comentarios/usuario/${userId}/filmes`, {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
    }
  })
    .then(res => res.json())
    .then(dados => {
      // Garante que filmes seja sempre um array
      const filmes =
        Array.isArray(dados) ? dados :
          Array.isArray(dados.$values) ? dados.$values :
            Array.isArray(dados.value) ? dados.value :
              [];
      const container = document.getElementById('avaliacoes');
      container.innerHTML = '';
      filmes.slice(0, 4).forEach(f => {
        const div = document.createElement('div');
        div.className = 'filme';
        div.innerHTML = `<img src="${f.fotoUrl}" alt="${f.titulo}" />`;
        container.appendChild(div);
      });
    })
    .catch(err => console.error("Erro ao carregar avaliações:", err));
}
