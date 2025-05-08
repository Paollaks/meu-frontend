// Função para carregar os filmes melhores avaliados
async function carregarMelhoresAvaliados() {
  try {
    const resposta = await fetch('https://sua-api.com/filmes/melhores-avaliados');
    const filmes = await resposta.json();

    const container = document.getElementById('melhores-avaliados');
    container.innerHTML = ''; // Limpa antes de carregar os filmes

    filmes.forEach(filme => {
      const card = document.createElement('div');
      card.className = 'filme-card';

      // Definindo a cor de fundo com base na nota
      let corFundo;
      if (filme.notaMedia >= 8) {
        corFundo = '#28a745'; // verde para boas notas
      } else if (filme.notaMedia >= 5) {
        corFundo = '#ffc107'; // amarelo para notas médias
      } else {
        corFundo = '#dc3545'; // vermelho para notas baixas
      }

      card.style.backgroundColor = corFundo;

      card.innerHTML = `
        <img src="${filme.fotoUrl || 'https://via.placeholder.com/150x220'}" alt="${filme.titulo}">
        <h3>${filme.titulo}</h3>
        <p>Nota: ${filme.notaMedia?.toFixed(1) || 'N/A'}</p>
      `;
      
      // Adiciona evento de clique no card para abrir o modal
      card.addEventListener('click', () => abrirModal(filme));
      
      // Adiciona o card ao container
      container.appendChild(card);
    });

  } catch (erro) {
    console.error("Erro ao carregar melhores avaliados:", erro);
  }
}

// Função para abrir o modal e preencher com os detalhes do filme
function abrirModal(filme) {
  document.getElementById('modal-img').src = filme.fotoUrl || 'https://via.placeholder.com/250x350';
  document.getElementById('modal-titulo').textContent = filme.titulo;
  document.getElementById('modal-ano').textContent = `Ano de lançamento: ${filme.anoLancamento}`;
  document.getElementById('modal-genero').textContent = `Gênero: ${filme.genero}`;
  document.getElementById('modal-sinopse').textContent = `Sinopse: ${filme.sinopse}`;
  document.getElementById('modal-nota').textContent = `Nota média: ${filme.notaMedia?.toFixed(1) || 'N/A'}`;
  document.getElementById('modal-estrelas').innerHTML = gerarEstrelas(filme.notaMedia);

  // Exibe o modal
  document.getElementById('modal-filme').style.display = 'block';
}

// Função para gerar as estrelas com base na nota
function gerarEstrelas(nota) {
  if (!nota) return '';
  const estrelasCheias = Math.round(nota / 2);
  return Array.from({ length: 5 }, (_, i) => i < estrelasCheias ? '★' : '☆').join('');
}

// Fechar o modal ao clicar no 'x'
document.getElementById('modal-fechar').addEventListener('click', function() {
  document.getElementById('modal-filme').style.display = 'none';
});

// Fechar o modal ao clicar fora da área do modal
window.addEventListener('click', function(event) {
  const modal = document.getElementById('modal-filme');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

// Chama automaticamente ao carregar a página
window.addEventListener('DOMContentLoaded', carregarMelhoresAvaliados);
