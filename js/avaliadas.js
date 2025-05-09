const grid = document.getElementById('grid-melhores');

window.onload = buscarFilmes;

function buscarFilmes() {
  const termo = document.getElementById('busca-filme')?.value || "";
  let url = 'https://localhost:7252/api/Comentarios/usuario/1/filmes';

  if (termo.trim() !== "") {
    url += `?termo=${encodeURIComponent(termo)}`;
  }

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`Erro na resposta: ${res.status}`);
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
        di
