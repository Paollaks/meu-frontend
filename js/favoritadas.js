const grid = document.getElementById('grid-filmes');

window.onload = buscarFilmes;

function buscarFilmes() {
    const termo = document.getElementById('busca')?.value || "";
    let url = 'https://localhost:7252/api/Favoritos/usuario/1/filmes';

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

                const img = document.createElement('img');
                img.src = filme.fotoUrl && filme.fotoUrl.includes('/t/p/')
                    ? filme.fotoUrl
                    : 'https://via.placeholder.com/140x200';
                img.alt = filme.titulo;

                // Botão de coração
                const btnFavorito = document.createElement('button');
                btnFavorito.className = 'btn-favorito';
                btnFavorito.innerHTML = '❤️'; // Ícone de coração
                btnFavorito.onclick = (e) => {
                    e.stopPropagation(); // Impede que o clique abra o modal
                    adicionarAosFavoritos(filme.id);
                };

                div.appendChild(img);
                div.appendChild(btnFavorito); // Adiciona o botão ao card do filme
                grid.appendChild(div);
            });
        })
        .catch(err => {
            console.error('Erro ao buscar filmes:', err);
            grid.innerHTML = '<p>Erro ao carregar filmes.</p>';
        });
}

// Função para adicionar o filme aos favoritos
function adicionarAosFavoritos(filmeId) {
  const url = `https://localhost:7252/api/favoritos`;
  const payload = { idFilme, idUsuario: 1 }; // Substitua pelo ID do usuário

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`Erro ao adicionar aos favoritos: ${res.status}`);
      }
      return res.json();
    })
    .then(() => {
      alert('Filme adicionado aos favoritos com sucesso!');
    })
    .catch(err => {
      console.error('Erro ao adicionar aos favoritos:', err);
      alert('Erro ao adicionar o filme aos favoritos.');
    });
}

// 🔽 Modal - funções no final do arquivo
function abrirModal(filme) {
    document.getElementById('modal-img').src = filme.fotoUrl && filme.fotoUrl.includes('/t/p/')
        ? filme.fotoUrl
        : 'https://via.placeholder.com/250x350';
    document.getElementById('modal-titulo').textContent = filme.titulo;
    document.getElementById('modal-ano').textContent = filme.anoLancamento;
    document.getElementById('modal-genero').textContent = filme.genero;
    document.getElementById('modal-sinopse').textContent = filme.sinopse;
    document.getElementById('modal-nota').textContent = filme.notaMedia?.toFixed(1) || 'N/A';
    document.getElementById('modal-estrelas').innerHTML = gerarEstrelas(filme.notaMedia);


    // Adiciona o botão de coração ao modal
    const btnFavorito = document.createElement('button');
    btnFavorito.className = 'btn-favorito-modal';
    btnFavorito.innerHTML = '❤️ Adicionar aos Favoritos';
    btnFavorito.onclick = () => adicionarAosFavoritos(idFilme);

    // Adiciona o botão ao modal
    const modalFooter = document.getElementById('modal-favorito'); 
    modalFooter.innerHTML = ''; // Limpa o conteúdo anterior
    modalFooter.appendChild(btnFavorito);

    document.getElementById('modal-filme').style.display = 'block';
}

function fecharModal() {
    document.getElementById('modal-filme').style.display = 'none';
}

// Fazendo a requisição para o método GetAll da API
const url = `https://localhost:7252/api/Comentarios?idUsuario=1`;
fetchComToken(url, { method: 'GET' })
   .then(res => {
     if (!res.ok) {
       throw new Error(`Erro ao carregar comentários: ${res.status}`);
     }
     return res.json();
   })
   .then(comentarios => {
     const comentariosContainer = document.getElementById('modal-comentario');
     if (Array.isArray(comentarios.$values) && comentarios.$values.length > 0) {
       console.log(comentarios.$values);
       comentariosContainer.innerHTML = comentarios.$values
         .map(comentario => `<p>${comentario.comentario}</p>`)
         .join('');
     } else {
       console.log(comentarios);
       comentariosContainer.innerHTML = '<p>Sem comentários disponíveis.</p>';
     }
   })
   .catch(err => {
     console.error('Erro ao carregar comentários:', err);
     document.getElementById('modal-comentario').innerHTML = '<p>Erro ao carregar comentários.</p>';
   });

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
  const jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6Ikx1YW5hTGF1cmEiLCJuYW1laWQiOiIxIiwibmJmIjoxNzQ2OTg3NTI1LCJleHAiOjE3NDY5OTQ3MjUsImlhdCI6MTc0Njk4NzUyNX0.K8VzoR7OPJfSC--4oTJmem2eh1CCC_VlHS1CvkqFtjs";

  // Adiciona o cabeçalho Authorization com o token
  const headers = {
    'Authorization': `Bearer ${jwtToken}`,
    'Content-Type': 'application/json',
    ...options.headers, // Permite sobrescrever ou adicionar outros cabeçalhos
  };

  return fetch(url, { ...options, headers });
}