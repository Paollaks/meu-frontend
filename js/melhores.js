const filmes = [
  { titulo: "Filme A", nota: 9.2, imagem: "link-da-imagem-a.jpg" },
  { titulo: "Filme B", nota: 8.5, imagem: "link-da-imagem-b.jpg" },
  { titulo: "Filme C", nota: 9.8, imagem: "link-da-imagem-c.jpg" },
  // Adicione mais filmes aqui
];

function exibirFilmesMelhores() {
  const grid = document.getElementById("grid-melhores");
  grid.innerHTML = ""; // Limpa a lista de filmes antes de exibir

  
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

function abrirModal(titulo) {
  const filme = filmes.find(f => f.titulo === titulo);
  alert(`Detalhes do filme: ${filme.titulo} - Nota: ${filme.nota}`);
}

  alert(`Detalhes do Filme:
    Título: ${filme.titulo}
    Nota: ${filme.nota}
    Gênero: ${filme.genero}
    Ano: ${filme.ano}
    Sinopse: ${filme.sinopse}
    `);
  }

window.onload = exibirFilmes;