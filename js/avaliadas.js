const { calcularMedia } = require("../avaliadas");

const grid = document.getElementById('grid-melhores');

window.onload = buscarFilmes;

function buscarFilmes() {
  const termo = document.getElementById('busca')?.value || "";
  let url = 'https://localhost:7252/api/Comentarios/usuario/1/filmes';

  if (termo.trim() !== "") {
    url += `?termo=${encodeURIComponent(termo)}`;
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
        div.className = 'filme-card';

        div.innerHTML = `
          <div class="imagem-filme"></div>
          <p>${filme.titulo || 'Título não disponível'}</p>
          <div class="estrelas">${'⭐'.repeat(Math.round(filme.nota || 0))}</div>
        `;

        grid.appendChild(div);
      });
    })
    .catch(error => {
      grid.innerHTML = '<p>Erro ao buscar filmes.</p>';
      console.error("Erro ao buscar filmes:", error);
    });
}
// Lista de filmes com suas avaliações
export const filmes = [
  { titulo: "Filme A", avaliacoes: [4, 5, 3, 4] },
  { titulo: "Filme B", avaliacoes: [5, 5, 5, 4] },
  { titulo: "Filme C", avaliacoes: [2, 3, 2, 3] },
  { titulo: "Filme D", avaliacoes: [4, 4, 4, 4] }
]; // Função para calcular a média das avaliações
function calcularMedia(avaliacoes) {
  if (!avaliacoes || avaliacoes.length === 0) {
    return 0; // Retorna 0 se não houver avaliações
  }
  const soma = avaliacoes.reduce((total, nota) => total + (Number(nota) || 0), 0);
  return soma / avaliacoes.length;
}
exports.calcularMedia = calcularMedia;
/**
 * @function
 * @throws {Error} Se o elemento com o ID "grid-melhores" não for encontrado no DOM.
 */
function buscarMelhores() {
  const container = document.getElementById("grid-melhores");
  container.innerHTML = "";

  if (!filmes || filmes.length === 0) {
    container.innerHTML = "<p>Nenhum filme disponível no momento.</p>";
    return;
  }

  // Adiciona a média a cada filme
  const filmesComMedia = filmes.map(filme => ({
    titulo: filme.titulo,
    media: calcularMedia(filme.avaliacoes)
  }));

  // Ordena por nota média (decrescente)
  filmesComMedia.sort((a, b) => b.media - a.media);

  // Cria e adiciona os cards
  filmesComMedia.forEach(filme => {
    const card = criarCard(filme);
    container.appendChild(card);
  });
}
exports.buscarMelhores = buscarMelhores;

