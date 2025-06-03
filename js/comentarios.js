const grid = document.getElementById('grid-filmes');

window.onload = buscarFilmes;

function getUserIdFromToken() {
  const token = localStorage.getItem('jwtToken');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // O campo pode ser nameid, sub ou id, dependendo do backend
    return payload.nameid || payload.sub || payload.id || null;
  } catch (e) {
    return null;
  }
}

const userId = getUserIdFromToken();
const btnFavoritar = document.getElementById('btn-favoritar');
const iconeFavorito = document.getElementById('icone-favorito');

function buscarFilmes() {
  const termo = document.getElementById('busca')?.value || "";
  const userId = getUserIdFromToken();
  if (!userId) {
    grid.innerHTML = '<p>Usuário não conectado.</p>';
    return;
  }
  let url = `https://localhost:7252/api/Comentarios/usuario/${userId}/filmes`;

  if (termo.trim() !== "") {
    url += `?termo=${encodeURIComponent(termo)}`;
  }

  fetchComToken(url, { method: 'GET' })
    .then(res => {
      if (!res.ok) {
        throw new Error(`Erro na resposta: ${res.status}`);
      }
      return res.json();
    })
    .then(dados => {
      const filmes =
        Array.isArray(dados) ? dados :
          Array.isArray(dados.$values) ? dados.$values :
            Array.isArray(dados.value) ? dados.value :
              null;

      if (!Array.isArray(filmes)) {
        grid.innerHTML = '<p>Erro: formato de resposta inválido.</p>';
        console.error("Resposta inesperada da API:", dados);
        return;
      }

      grid.innerHTML = '';

      if (filmes.length === 0) {
        grid.innerHTML = '<p>Nenhum filme encontrado.</p>';
        return;
      }

      filmes.forEach(filme => {
        const div = document.createElement('div');
        div.className = 'filme';
        div.onclick = () => abrirModal(filme);

        // Container para imagem e botão de favoritar
        const imgContainer = document.createElement('div');
        imgContainer.className = 'img-container';

        const img = document.createElement('img');
        img.src = filme.fotoUrl && filme.fotoUrl.includes('/t/p/')
          ? filme.fotoUrl
          : 'https://via.placeholder.com/140x200';
        img.alt = filme.titulo;

        // Botão de favoritar
        const btnFavoritar = document.createElement('button');
        btnFavoritar.className = 'btn-favoritar-grid';
        btnFavoritar.setAttribute('aria-label', 'Favoritar');
        btnFavoritar.innerHTML = `<img src="../assets/CoraçãoVazio.svg" alt="Favoritar" width="40" height="40">`;

        // Verifica se já está favoritado
        fetchComToken(`https://localhost:7252/api/Favoritos?idUsuario=${userId}`)
          .then(res => res.json())
          .then(data => {
            const jaFavoritado = data.$values?.some(fav => fav.idFilme === filme.id);
            btnFavoritar.querySelector('img').src = jaFavoritado ? '../assets/CoraçãoPrenchido.svg' : '../assets/CoraçãoVazio.svg';
            btnFavoritar.setAttribute('data-favoritado', jaFavoritado ? 'true' : 'false');
          });

        // Evento de clique no botão de favoritar
        btnFavoritar.onclick = function (e) {
          e.stopPropagation(); // Evita abrir o modal ao clicar no botão
          const favoritado = btnFavoritar.getAttribute('data-favoritado') === 'true';
          if (!favoritado) {
            fetchComToken('https://localhost:7252/api/Favoritos', {
              method: 'POST',
              body: JSON.stringify({
                idUsuario: userId,
                idFilme: filme.id
              }),
            }).then(res => {
              if (res.ok) {
                btnFavoritar.querySelector('img').src = '../assets/CoraçãoPrenchido.svg';
                btnFavoritar.setAttribute('data-favoritado', 'true');
              }
            });
          } else {
            fetchComToken(`https://localhost:7252/api/Favoritos/${userId}/${filme.id}`, {
              method: 'DELETE'
            }).then(res => {
              if (res.ok) {
                btnFavoritar.querySelector('img').src = '../assets/CoraçãoVazio.svg';
                btnFavoritar.setAttribute('data-favoritado', 'false');
              }
            });
          }
        };

        imgContainer.appendChild(img);
        imgContainer.appendChild(btnFavoritar);
        div.appendChild(imgContainer);

        grid.appendChild(div);
      });
    })
    .catch(err => {
      console.error('Erro ao buscar filmes:', err);
      grid.innerHTML = '<p>Erro ao carregar filmes.</p>';
    });
}

// 🔽 Modal - funções no final do arquivo
function abrirModal(filme) {
  const userId = getUserIdFromToken();
  document.getElementById('modal-img').src = filme.fotoUrl && filme.fotoUrl.includes('/t/p/')
    ? filme.fotoUrl
    : 'https://via.placeholder.com/250x350';
  document.getElementById('modal-titulo').textContent = filme.titulo;
  document.getElementById('modal-ano').textContent = filme.anoLancamento;
  document.getElementById('modal-genero').textContent = filme.genero;
  document.getElementById('modal-sinopse').textContent = filme.sinopse;
  document.getElementById('modal-nota').textContent = filme.notaMedia?.toFixed(1) || 'N/A';
  document.getElementById('modal-estrelas').innerHTML = gerarEstrelas(filme.notaMedia);

  // Buscar comentário do usuário logado via API
  if (!userId) {
    alert('Usuário não conectado.');
    return;
  }
  const url = `https://localhost:7252/api/Comentarios?idUsuario=${userId}`;
  const comentarioDiv = document.getElementById('modal-comentario');
  comentarioDiv.textContent = 'Carregando comentário...';

  fetchComToken(url, { method: 'GET' })
    .then(res => res.json())
    .then(data => {
      // Filtra todos os comentários do usuário para o filme atual
      const comentariosFilme = (data && Array.isArray(data.$values))
        ? data.$values.filter(c => c.idFilme === filme.id)
        : [];

      if (comentariosFilme.length === 0) {
        comentarioDiv.innerHTML = `<div id="comentario-texto">Nenhum comentário encontrado.</div>`;
      } else {
        comentarioDiv.innerHTML = comentariosFilme.map(comentarioObj => `
        <div class="comentario-item" style="margin-bottom: 10px;">
          <div id="comentario-texto-${comentarioObj.id}">${comentarioObj.comentario}</div>
          <div class="comentario-botoes">
            <button class="btn-editar-comentario" data-id="${comentarioObj.id}">Editar</button>
            <button class="btn-deletar-comentario" data-id="${comentarioObj.id}">Excluir</button>
          </div>
        </div>
      `).join('');

        // Adiciona eventos para todos os botões de editar
        comentariosFilme.forEach(comentarioObj => {
          console.log(comentarioObj);
          const comentarioId = comentarioObj.id;

          document.querySelector(`.btn-editar-comentario[data-id="${comentarioId}"]`).onclick = function () {
            const novoComentario = prompt('Editar comentário:', comentarioObj.comentario || comentarioObj.texto);
            if (novoComentario !== null) {
              fetchComToken(`https://localhost:7252/api/Comentarios/${comentarioId}`, {
                method: 'PUT',
                body: JSON.stringify({
                  id: comentarioId,
                  texto: novoComentario,
                  idUsuario: comentarioObj.idUsuario,
                  tmdbFilmeId: comentarioObj.tmdbFilmeId ?? comentarioObj.idFilme
                }),
              })
                .then(res => {
                  if (res.ok) {
                    document.getElementById(`comentario-texto-${comentarioId}`).textContent = novoComentario;
                    alert('Comentário atualizado!');
                  } else {
                    alert('Erro ao atualizar comentário.');
                  }
                });
            }
          };

          // Adiciona eventos para todos os botões de deletar
          document.querySelector(`.btn-deletar-comentario[data-id="${comentarioId}"]`).onclick = function () {
            if (confirm('Deseja realmente excluir o comentário?')) {
              fetchComToken(`https://localhost:7252/api/Comentarios/${comentarioId}`, {
                method: 'DELETE'
              })
                .then(res => {
                  if (res.ok) {
                    document.getElementById(`comentario-texto-${comentarioId}`).textContent = 'Comentário excluído!';
                    alert('Comentário excluído!');
                  } else {
                    alert('Erro ao excluir comentário.');
                  }
                });
            }
          };
        });
      }
    })
    .catch(() => {
      comentarioDiv.textContent = 'Erro ao carregar comentário.';
    });

  // Função para verificar se o filme já está favoritado
  function verificarFavorito() {
    fetchComToken(`https://localhost:7252/api/Favoritos?idUsuario=${userId}`)
      .then(res => res.json())
      .then(data => {
        // Supondo que data.$values é um array de favoritos
        const jaFavoritado = data.$values?.some(fav => fav.idFilme === filme.id);
        iconeFavorito.src = jaFavoritado ? '../assets/CoraçãoPrenchido.svg' : '../assets/CoraçãoVazio.svg';
        btnFavoritar.setAttribute('data-favoritado', jaFavoritado ? 'true' : 'false');
      });
  }

  verificarFavorito();

  // Evento de clique
  btnFavoritar.onclick = function () {
    const favoritado = btnFavoritar.getAttribute('data-favoritado') === 'true';
    if (!favoritado) {
      // POST para favoritar
      fetchComToken('https://localhost:7252/api/Favoritos', {
        method: 'POST',
        body: JSON.stringify({
          idUsuario: userId,
          idFilme: filme.id
        }),
      }).then(res => {
        if (res.ok) {
          iconeFavorito.src = '../assets/CoraçãoPrenchido.svg';
          btnFavoritar.setAttribute('data-favoritado', 'true');
        }
      });
    } else {
      // DELETE para desfavoritar
      fetchComToken(`https://localhost:7252/api/Favoritos/${userId}/${filme.id}`, {
        method: 'DELETE'
      }).then(res => {
        if (res.ok) {
          iconeFavorito.src = '../assets/CoraçãoVazio.svg';
          btnFavoritar.setAttribute('data-favoritado', 'false');
          location.reload(); // Recarrega a página para atualizar a lista
        }
      });
    }
  };

  document.getElementById('modal-filme').style.display = 'block';
}
function fecharModal() {
  document.getElementById('modal-filme').style.display = 'none';
}

function gerarEstrelas(nota) {
  if (!nota) return '';
  const estrelasCheias = Math.round(nota / 2);
  return Array.from({ length: 5 }, (_, i) => i < estrelasCheias ? '★' : '☆').join('');
}

document.getElementById('busca').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    buscarFilmes();
  }
});

function toggleMenu() {
  const menu = document.getElementById("dropdown-menu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// Fecha o menu se clicar fora
document.addEventListener("click", function (event) {
  const userMenu = document.querySelector(".user-menu");
  const dropdown = document.getElementById("dropdown-menu");

  if (!userMenu.contains(event.target)) {
    dropdown.style.display = "none";
  }
});

function fetchComToken(url, options = {}) {
  const jwtToken = localStorage.getItem('jwtToken');
  const headers = {
    'Authorization': `Bearer ${jwtToken}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };
  return fetch(url, { ...options, headers });
}