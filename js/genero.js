document.addEventListener("DOMContentLoaded", () => {
    carregarFilmesPorGenero('28', 'grid-acao');          // Ação
    carregarFilmesPorGenero('10749', 'grid-romance');    // Romance
    carregarFilmesPorGenero('35', 'grid-comedia');       // Comédia
    carregarFilmesPorGenero('53', 'grid-thriller');      // Thriller (Suspense)
    carregarFilmesPorGenero('18', 'grid-drama');         // Drama
    carregarFilmesPorGenero('12', 'grid-aventura');      // Aventura
    carregarFilmesPorGenero('16', 'grid-animacao');      // Animação
    carregarFilmesPorGenero('80', 'grid-crime');         // Crime
    carregarFilmesPorGenero('99', 'grid-documentario');  // Documentário
    carregarFilmesPorGenero('10751', 'grid-familia');    // Família
    carregarFilmesPorGenero('14', 'grid-fantasia');      // Fantasia
    carregarFilmesPorGenero('36', 'grid-historia');      // História
    carregarFilmesPorGenero('27', 'grid-terror');        // Terror
    carregarFilmesPorGenero('10402', 'grid-musica');     // Música
    carregarFilmesPorGenero('9648', 'grid-misterio');    // Mistério
    carregarFilmesPorGenero('878', 'grid-ficcao');       // Ficção Científica
    carregarFilmesPorGenero('10770', 'grid-cinematv');   // Cinema TV
    carregarFilmesPorGenero('10752', 'grid-guerra');     // Guerra
    carregarFilmesPorGenero('37', 'grid-faroeste');      // Faroeste
  });
  
  function carregarFilmesPorGenero(generoId, containerId) {
    fetch(`https://localhost:7252/api/Filmes/genero/${generoId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Erro ao buscar filmes. Status: ${res.status}`);
        }
        return res.json();
      })
      .then(dados => {
        console.log(`Filmes do gênero ${generoId}:`, dados);
  
        const filmes = Array.isArray(dados) ? dados : dados.$values;
  
        if (!Array.isArray(filmes)) {
          console.error("Formato inválido da resposta para o gênero", generoId);
          document.getElementById(containerId).innerHTML = '<p>Erro ao carregar filmes.</p>';
          return;
        }
  
        const container = document.getElementById(containerId);
        container.innerHTML = '';
  
        filmes.forEach(filme => {
          const div = document.createElement('div');
          div.className = 'filme';
  
          const img = document.createElement('img');
          img.src = filme.fotoUrl || 'https://via.placeholder.com/140x200';
          img.alt = filme.titulo;
  
          div.appendChild(img);
          container.appendChild(div);
        });
      })
      .catch(err => {
        console.error("Erro ao buscar filmes por gênero:", err);
        document.getElementById(containerId).innerHTML = '<p>Erro ao carregar filmes.</p>';
      });
  }
  
  function toggleGenero(id) {
    const section = document.getElementById(id);
    const grid = section.querySelector('.grid');
    const btn = section.querySelector('.toggle-btn');
  
    if (grid.style.display === "none") {
      grid.style.display = "flex";
      btn.textContent = "🢓";
    } else {
      grid.style.display = "none";
      btn.textContent = "🢒";
    }
  }
  
  function buscarPorGenero() {
    const termo = document.getElementById('busca-genero').value.toLowerCase();
    const secoes = document.querySelectorAll('section[id^="genero-"]');
  
    secoes.forEach(secao => {
      const titulo = secao.querySelector('h2')?.textContent.toLowerCase() || "";
      secao.style.display = titulo.includes(termo) || termo === "" ? "block" : "none";
    });

document.getElementById('busca-genero').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      buscarPorGenero();
    }
  });
  
  }
  