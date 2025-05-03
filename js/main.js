const grid = document.getElementById('grid-filmes');

// Executa automaticamente quando a página é carregada
window.onload = buscarFilmes;

function buscarFilmes() {
  const termo = document.getElementById('busca')?.value || "";
  let url = 'https://localhost:7252/api/Filmes/tmdb';

  if (termo.trim() !== "") {
    url += `?termo=${encodeURIComponent(termo)}`;
  }

  fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Erro na resposta: ${res.status}`);
      }
      return res.json();
    })
    .then(dados => {
      console.log("Resposta da API (home):", dados);

      // Tenta acessar filmes direto, ou em .value, ou .$values
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
