// Lista de filmes com notas (pode ser uma API ou banco de dados mais tarde)
const filmes = [
  { titulo: "Filme A", nota: 9.2, imagem: "link-da-imagem-a.jpg" },
  { titulo: "Filme B", nota: 8.5, imagem: "link-da-imagem-b.jpg" },
  { titulo: "Filme C", nota: 9.8, imagem: "link-da-imagem-c.jpg" },
  // Adicione mais filmes aqui
];

async function buscarFilmes() {
  const resposta = await fetch('ttps://localhost:7252/api/avaliacoes/top-rated');
  if (!resposta.ok) {
    throw new Error(`Erro na API: ${resposta.status} - ${resposta.statusText}`);
  }
  const dados = await resposta.json();
  return dados;
}

function exibirFilmes() {
  const grid = document.getElementById("grid-melhores");
  grid.innerHTML = ""; // Limpa a lista de filmes antes de exibir

  const filmesOrdenados = filmes.sort((a, b) => b.nota - a.nota);

  filmesOrdenados.forEach(filme => {
    const filmeDiv = document.createElement("div");
    filmeDiv.classList.add("filme");

    filmeDiv.innerHTML = `
      <img src="${filme.imagem}" alt="${filme.titulo}">
      <div class="info-filme">
        <h3>${filme.titulo}</h3>
        <p>Nota: ${filme.nota}</p>
        <button onclick="abrirModal('${filme.titulo}')">Ver Detalhes</button>
      </div>
    `;
    grid.appendChild(filmeDiv);
  });
}

function abrirModal(titulo) {
  const filme = filmes.find(f => f.titulo === titulo);
  alert(`Detalhes do filme: ${filme.titulo} - Nota: ${filme.nota}`);
}

function criarCardFilme(filme) {
  const card = document.createElement('div');
  card.className = 'filme-card';
  card.innerHTML = `
    <img src="${filme.fotoUrl || 'https://via.placeholder.com/150x220'}" alt="${filme.titulo}">
    <h3>${filme.titulo}</h3>
    <p>Nota: ${filme.notaMedia?.toFixed(1) || 'N/A'}</p>
  `;
  card.addEventListener('click', () => abrirModal(filme));
  return card;
}

window.onload = async () => {
  try {
    const filmesDaApi = await buscarFilmes();
    // Aqui você pode fazer algo com os filmes retornados pela API, se necessário
    exibirFilmes();
  } catch (erro) {
    console.error(erro);
    alert("Ocorreu um erro ao buscar os filmes.");
  }

  const container = document.getElementById('melhoresavaliados');
  if (!container) {
    console.error("Elemento #melhoresavaliados não encontrado.");
    return;
  }

  filmes.forEach(filme => {
    const card = criarCardFilme(filme);
    container.appendChild(card);
  });
};
