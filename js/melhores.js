const { filmes } = require("./filmes");

function exibirFilmesMelhores() {
  const grid = document.getElementById("grid-melhores");
  grid.innerHTML = "";

  const filmesOrdenados = filmes.sort((a, b) => b.nota - a.nota);

  filmesOrdenados.forEach(filme => {
    const filmeDiv = document.createElement("div");
    filmeDiv.classList.add("filme");

    filmeDiv.innerHTML = `
      <img src="${filme.imagem}" alt="${filme.titulo}" onclick="abrirModal('${filme.titulo}')">
      <div class="info-filme">
        <h3>${filme.titulo}</h3>
        <p>Nota: ${filme.nota.toFixed(1)}</p>
        <div class="estrelas">${gerarEstrelas(filme.nota)}</div>
        <button onclick="abrirModal('${filme.titulo}')">Ver Detalhes</button>
      </div>
    `;

    grid.appendChild(filmeDiv);
  });
}

function abrirModal(titulo) {
  const filme = filmes.find(f => f.titulo === titulo);
  if (!filme) return;

  alert(`Detalhes do Filme:
Título: ${filme.titulo}
Nota: ${filme.nota}
Gênero: ${filme.genero}
Ano: ${filme.ano}
Sinopse: ${filme.sinopse}`);
}

function gerarEstrelas(nota) {
  const total = 5;
  const cheias = Math.round(nota);
  let html = "";

  for (let i = 1; i <= total; i++) {
    html += i <= cheias ? "⭐" : "☆";
  }
  return html;
}

function buscarFilmes(grid, termo) {
  const termoLower = termo.toLowerCase();
  grid.innerHTML = "";

  const resultados = filmes
    .filter(filme => filme.titulo.toLowerCase().includes(termoLower))
    .sort((a, b) => b.nota - a.nota);

  resultados.forEach(filme => {
    const filmeDiv = document.createElement("div");
    filmeDiv.classList.add("filme");

    filmeDiv.innerHTML = `
      <img src="${filme.imagem}" alt="${filme.titulo}" onclick="abrirModal('${filme.titulo}')">
      <div class="info-filme">
        <h3>${filme.titulo}</h3>
        <p>Nota: ${filme.nota.toFixed(1)}</p>
        <div class="estrelas">${gerarEstrelas(filme.nota)}</div>
        <button onclick="abrirModal('${filme.titulo}')">Ver Detalhes</button>
      </div>
    `;

    grid.appendChild(filmeDiv);
  });
}

window.onload = exibirFilmesMelhores;
