document.addEventListener("DOMContentLoaded", exibirFilmesMelhores);

function exibirFilmesMelhores() {
  const grid = document.getElementById('grid-melhores');
  const termo = document.getElementById('busca-filme')?.value || "";
  let url = 'https://localhost:7252/api/Avaliacoes/top-rated';

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
        img.src = filme.fotoUrl || 'https://via.placeholder.com/140x200';
        img.alt = filme.titulo;

        div.appendChild(img);
        grid.appendChild(div);
      });
    })
    .catch(err => {
      console.error('Erro ao buscar filmes:', err);
      grid.innerHTML = '<p>Erro ao carregar filmes.</p>';
    });
}

function buscarFilmes(container, termo) {
  if (!container) return;
  let url = 'https://localhost:7252/api/Avaliacoes/top-rated';

  if (termo.trim() !== "") {
    url += `?termo=${encodeURIComponent(termo)}`;
  }

  fetchComToken(url, { method: 'GET' })
    .then(res => res.json())
    .then(filmes => {
      container.innerHTML = '';

      filmes.forEach(filme => {
        const div = document.createElement('div');
        div.className = 'filme';
        div.onclick = () => abrirModal(filme);

        const img = document.createElement('img');
        img.src = filme.fotoUrl || 'https://via.placeholder.com/140x200';
        img.alt = filme.titulo;

        div.appendChild(img);
        container.appendChild(div);
      });
    })
    .catch(error => {
      console.error('Erro ao buscar filmes:', error);
      container.innerHTML = '<p>Erro ao carregar filmes.</p>';
    });
}

// 🔽 Modal
function abrirModal(filme) {
  document.getElementById('modal-img').src = filme.fotoUrl || 'https://via.placeholder.com/250x350';
  document.getElementById('modal-titulo').textContent = filme.titulo;
  document.getElementById('modal-ano').textContent = filme.anoLancamento;
  document.getElementById('modal-genero').textContent = filme.genero;
  document.getElementById('modal-sinopse').textContent = filme.sinopse;
  document.getElementById('modal-nota').textContent = filme.notaMedia?.toFixed(1) || 'N/A';
  document.getElementById('modal-estrelas').innerHTML = gerarEstrelas(filme.notaMedia);

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

// Busca ao pressionar Enter
document.getElementById('busca-filme').addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && e.target.value.trim() !== "") {
    buscarFilmes(
      document.getElementById('grid-melhores'),
      e.target.value
    );
  }
});

function toggleMenu() {
  const menu = document.getElementById("dropdown-menu");
  if (menu) {
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  }
}

document.addEventListener("click", function (event) {
  const userMenu = document.querySelector(".user-menu");
  const dropdown = document.getElementById("dropdown-menu");

  if (!userMenu?.contains(event.target)) {
    if (dropdown) dropdown.style.display = "none";
  }
});

function fetchComToken(url, options = {}) {
  const jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6Ikx1YW5hTGF1cmEiLCJuYW1laWQiOiIxIiwibmJmIjoxNzQ3MDk0NjExLCJleHAiOjE3NDcxMDE4MTEsImlhdCI6MTc0NzA5NDYxMX0.7huak-5OKvJ92XWql3unKFGo4QGEFIE8_mSmUrRJxa0";

  const headers = {
    'Authorization': `Bearer ${jwtToken}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  return fetch(url, { ...options, headers });
}