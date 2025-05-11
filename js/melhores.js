const filmes = [
  {
    titulo: "Ação Implacável",
    genero: "acao",
    ano: 2022,
    nota: 4.5,
    imagem: "https://via.placeholder.com/150",
    sinopse: "Um agente secreto precisa deter uma ameaça mundial."
  },
  {
    titulo: "Amor em Paris",
    genero: "romance",
    ano: 2020,
    nota: 4.2,
    imagem: "https://via.placeholder.com/150",
    sinopse: "Dois estranhos se encontram em Paris e vivem um romance inesquecível."
  },
  {
    titulo: "No Escuro da Noite",
    genero: "thriller",
    ano: 2021,
    nota: 4.6,
    imagem: "https://via.placeholder.com/150",
    sinopse: "Uma detetive investiga um desaparecimento misterioso."
  },
  {
    titulo: "Piadas Infames",
    genero: "comedia",
    ano: 2019,
    nota: 3.8,
    imagem: "https://via.placeholder.com/150",
    sinopse: "Uma sequência de situações engraçadas em uma escola desorganizada."
  }
];

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
    Sinopse: ${filme.sinopse}
    `);
  }

