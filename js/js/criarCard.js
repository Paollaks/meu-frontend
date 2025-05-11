import { calcularMedia } from "../avaliadas";

// Função para criar o HTML de um card de filme
function criarCard(filme) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <h3>${filme.titulo}</h3>
    <p>Nota média: ${calcularMedia(filme.avaliacoes).toFixed(2)}</p>
  `;

  return card;
}
