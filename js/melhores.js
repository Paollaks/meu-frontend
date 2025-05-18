<<<<<<< HEAD
const filmes = [
  {
    titulo: "Missão Relâmpago",
    genero: "acao",
    ano: 2023,
    nota: 4.7,
    imagem: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80",
    sinopse: "Um espião aposentado precisa voltar à ativa para salvar sua filha de uma conspiração internacional."
  },
  {
    titulo: "Primavera em Veneza",
    genero: "romance",
    ano: 2022,
    nota: 4.4,
    imagem: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=300&q=80",
    sinopse: "Durante uma viagem à Itália, duas almas solitárias encontram um amor inesperado."
  },
  {
    titulo: "Dia de Louco",
    genero: "comedia",
    ano: 2021,
    nota: 4.1,
    imagem: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=300&q=80",
    sinopse: "Um funcionário público tenta manter a sanidade enquanto tudo dá errado em seu primeiro dia como prefeito."
  },
  {
    titulo: "O Peso da Verdade",
    genero: "drama",
    ano: 2020,
    nota: 4.8,
    imagem: "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=300&q=80",
    sinopse: "Baseado em uma história real, um jovem advogado desafia um sistema corrupto em busca de justiça."
  },
  {
    titulo: "Horizonte Final",
    genero: "ficcao",
    ano: 2024,
    nota: 4.6,
    imagem: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=300&q=80",
    sinopse: "No ano 2098, uma equipe de cientistas descobre um portal para outra galáxia – mas algo os espera do outro lado."
  },
  {
    titulo: "Silêncio Mortal",
    genero: "terror",
    ano: 2021,
    nota: 4.2,
    imagem: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=300&q=80",
    sinopse: "Um grupo de amigos em uma cabana isolada descobre que o silêncio é a única forma de sobreviver."
  }
];

function filtrarGenero(genero) {
  const grid = document.getElementById("grid-genero");
  grid.innerHTML = "";

  const filtrados = filmes.filter(filme => filme.genero === genero);

  if (filtrados.length === 0) {
    grid.innerHTML = "<p>Nenhum filme encontrado para este gênero.</p>";
    return;
  }

  filtrados.forEach(filme => {
    const filmeDiv = document.createElement("div");
    filmeDiv.classList.add("filme");

    filmeDiv.innerHTML = `
      <img src="${filme.imagem}" alt="${filme.titulo}" 
           onclick="abrirModal('${encodeURIComponent(filme.titulo)}')" 
           onerror="this.onerror=null;this.src='https://via.placeholder.com/300x450?text=Imagem+Indisponivel';">
      <div class="info-filme">
        <h3>${filme.titulo}</h3>
        <p>Nota: ${filme.nota.toFixed(1)}</p>
        <div class="estrelas">${gerarEstrelas(filme.nota)}</div>
        <button onclick="abrirModal('${encodeURIComponent(filme.titulo)}')">Ver Detalhes</button>
      </div>
    `;
=======
const grid = document.getElementById('grid-filmes');

window.onload = exibirFilmesMelhores;

function exibirFilmesMelhores() {
  const termo = document.getElementById('busca')?.value || "";
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
>>>>>>> 9625171596413308a525343fe3c6c64f5518ea0f

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

        div.appendChild(img);
        grid.appendChild(div);
      });
    })
    .catch(err => {
      console.error('Erro ao buscar filmes:', err);
      grid.innerHTML = '<p>Erro ao carregar filmes.</p>';
    });
}

<<<<<<< HEAD
function gerarEstrelas(nota) {
  const total = 5;
  const cheias = Math.round(nota);
  let html = "";

  for (let i = 1; i <= total; i++) {
    html += i <= cheias ? "⭐" : "☆";
  }
  return html;
}

function abrirModal(titulo) {
  const filme = filmes.find(f => f.titulo === decodeURIComponent(titulo));
  if (!filme) return;

  alert(`Detalhes do Filme:
Título: ${filme.titulo}
Nota: ${filme.nota}
Gênero: ${filme.genero}
Ano: ${filme.ano}
Sinopse: ${filme.sinopse}`);
}

function mostrarMelhoresAvaliados() {
  const grid = document.getElementById("grid-melhores");
  if (!grid) return;
  grid.innerHTML = "";

  // Ordena por nota decrescente e pega os 6 primeiros
  const melhores = filmes.slice().sort((a, b) => b.nota - a.nota).slice(0, 6);

  melhores.forEach(filme => {
    const filmeDiv = document.createElement("div");
    filmeDiv.classList.add("filme");

    filmeDiv.innerHTML = `
      <img src="${filme.imagem}" alt="${filme.titulo}" 
           onclick="abrirModal('${encodeURIComponent(filme.titulo)}')" 
           onerror="this.onerror=null;this.src='https://via.placeholder.com/300x450?text=Imagem+Indisponivel';">
      <div class="info-filme">
        <h3>${filme.titulo}</h3>
        <p>Nota: ${filme.nota.toFixed(1)}</p>
        <div class="estrelas">${gerarEstrelas(filme.nota)}</div>
        <button onclick="abrirModal('${encodeURIComponent(filme.titulo)}')">Ver Detalhes</button>
      </div>
    `;

    grid.appendChild(filmeDiv);
  });
}

=======
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
document.addEventListener("click", function(event) {
  const userMenu = document.querySelector(".user-menu");
  const dropdown = document.getElementById("dropdown-menu");

  if (!userMenu.contains(event.target)) {
    dropdown.style.display = "none";
  }
});


function fetchComToken(url, options = {}) {
  const jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6Ikx1YW5hTGF1cmEiLCJuYW1laWQiOiIxIiwibmJmIjoxNzQ3MDk0NjExLCJleHAiOjE3NDcxMDE4MTEsImlhdCI6MTc0NzA5NDYxMX0.7huak-5OKvJ92XWql3unKFGo4QGEFIE8_mSmUrRJxa0";

  // Adiciona o cabeçalho Authorization com o token
  const headers = {
    'Authorization': `Bearer ${jwtToken}`,
    'Content-Type': 'application/json',
    ...options.headers, // Permite sobrescrever ou adicionar outros cabeçalhos
  };

  return fetch(url, { ...options, headers });
}
>>>>>>> 9625171596413308a525343fe3c6c64f5518ea0f
