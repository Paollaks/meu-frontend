async function carregarMelhoresAvaliados() {
  try {
    // Faz a requisição para a API de filmes melhores avaliados
    const resposta = await fetch('https://localhost:7252/api/Filmes/genero/filmes-melhores-avaliados');
    const filmes = await resposta.json();

    // Seleciona o container onde os filmes serão exibidos
    const container = document.getElementById('melhores-avaliados');
    container.innerHTML = ''; // Limpa antes de carregar novos filmes

    // Itera sobre os filmes retornados pela API
    filmes.forEach(filme => {
      const card = document.createElement('div');
      card.className = 'filme-card';

      // Definindo a cor de fundo com base na nota média do filme
      let corFundo;
      if (filme.notaMedia >= 8) {
        corFundo = '#28a745'; // Verde para ótimas notas
      } else if (filme.notaMedia >= 5) {
        corFundo = '#ffc107'; // Amarelo para notas médias
      } else {
        corFundo = '#dc3545'; // Vermelho para notas baixas
      }

      // Aplica a cor de fundo ao card do filme
      card.style.backgroundColor = corFundo;

      // Constrói o HTML para o card do filme
      card.innerHTML = `
        <img src="${filme.fotoUrl || 'https://via.placeholder.com/150x220'}" alt="${filme.titulo}">
        <h3>${filme.titulo}</h3>
        <p>Nota: ${filme.notaMedia?.toFixed(1) || 'N/A'}</p>
      `;
      
      // Adiciona um evento de clique no card para abrir o modal
      card.addEventListener('click', () => abrirModal(filme));
      
      // Adiciona o card ao container
      container.appendChild(card);
    });

  } catch (erro) {
    console.error("Erro ao carregar melhores avaliados:", erro);
  }
}

// Chama automaticamente ao carregar a página
window.addEventListener('DOMContentLoaded', carregarMelhoresAvaliados);

