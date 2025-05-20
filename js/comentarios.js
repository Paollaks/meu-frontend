const grid = document.getElementById('grid-filmes');

window.onload = buscarFilmes;

function buscarFilmes() {
  const termo = document.getElementById('busca')?.value || "";
  let url = 'https://localhost:7252/api/Comentarios/usuario/1/filmes';

  if (termo.trim() !== "") {
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
        div.className = 'filme';
        div.onclick = () => abrirModal(filme);

        const img = document.createElement('img');
        img.src = filme.fotoUrl && filme.fotoUrl.includes('/t/p/')
          ? filme.fotoUrl
          : 'https://via.placeholder.com/140x200';
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

// 🔽 Modal - funções no final do arquivo
  function abrirModal(filme, user) {
    document.getElementById('modal-img').src = filme.fotoUrl && filme.fotoUrl.includes('/t/p/')
      ? filme.fotoUrl
      : 'https://via.placeholder.com/250x350';
    document.getElementById('modal-titulo').textContent = filme.titulo;
    document.getElementById('modal-ano').textContent = filme.anoLancamento;
    document.getElementById('modal-genero').textContent = filme.genero;
    document.getElementById('modal-sinopse').textContent = filme.sinopse;
    document.getElementById('modal-nota').textContent = filme.notaMedia?.toFixed(1) || 'N/A';
    document.getElementById('modal-estrelas').innerHTML = gerarEstrelas(filme.notaMedia);

    document.getElementById('modal-filme').style.display = 'block';

        const avaliacoesContainer = document.getElementById('avaliacoesContainer'); // Cria o contêiner principal
        avaliacoesContainer.style.display = 'flex';
        avaliacoesContainer.style.alignItems = 'center';
        avaliacoesContainer.style.gap = '10px';


        // Cria o input para avaliação
        const inputAvaliacao = document.createElement('input');
        inputAvaliacao.type = 'text';
        inputAvaliacao.id = 'avaliacao';
        inputAvaliacao.placeholder = 'Digite sua avaliação';
        inputAvaliacao.style.flex = '1';
        inputAvaliacao.style.padding = '8px';
        inputAvaliacao.style.border = '1px solid #ccc';
        inputAvaliacao.style.borderRadius = '4px';
        /*const comentario = document.getElementById('avaliacao').value;*/
        const url = `https://localhost:7252/api/Comentarios`;

        fetchComToken(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify()
        })
          .then(res => {
            if (!res.ok) {
              throw new Error(`Erro ao processar comentário: ${res.status}`);
            }
            return res.json();
          })
          .then(() => { console.log(body);/* inputAvaliacao.textContent = texto;*/ })
          .catch(err => {
            console.error('Erro ao carregar comentário:', err);
            alert('Sem comentários disponíveis.');
          });


        // Cria o botão de salvar
        const salvarButton = document.createElement('button');
        salvarButton.id = 'salvar-avaliacao';
        salvarButton.textContent = 'Salvar';
        salvarButton.onclick = () => comentar(filme);
        salvarButton.style.padding = '8px 12px';
        salvarButton.style.backgroundColor = '#4CAF50';
        salvarButton.style.color = 'white';
        salvarButton.style.border = 'none';
        salvarButton.style.borderRadius = '4px';
        salvarButton.style.cursor = 'pointer';

        // Cria o botão de excluir
        const excluirButton = document.createElement('button');
        excluirButton.id = 'excluir-avaliacao';
        excluirButton.textContent = '🗑️';
        excluirButton.style.padding = '8px';
        excluirButton.style.backgroundColor = '#f44336';
        excluirButton.style.color = 'white';
        excluirButton.style.border = 'none';
        excluirButton.style.borderRadius = '4px';
        excluirButton.style.cursor = 'pointer';

        // Adiciona os elementos ao contêiner principal
        if (avaliacoesContainer.firstChild === null) {
          avaliacoesContainer.appendChild(inputAvaliacao);
          avaliacoesContainer.appendChild(salvarButton);
          avaliacoesContainer.appendChild(excluirButton);
        }
      }

// Fazendo a requisição para o método GetAll da API
// const url = `https://localhost:7252/api/Comentarios?idUsuario=1`;
// fetchComToken(url, { method: 'GET' })
//   .then(res => {
//     if (!res.ok) {
//       throw new Error(`Erro ao carregar comentários: ${res.status}`);
//     }
//     return res.json();
//   })
//   .then(comentarios => {
//     const comentariosContainer = document.getElementById('modal-avaliacao');
//     if (Array.isArray(comentarios.$values) && comentarios.$values.length > 0) {
//       console.log(comentarios.$values);
//       comentariosContainer.innerHTML = comentarios.$values
//         .map(comentario => `<p>${comentario.comentario}</p>`)
//         .join('');
//     } else {
//       console.log(comentarios);
//       comentariosContainer.innerHTML = '<p>Sem comentários disponíveis.</p>';
//     }
//   })
//   .catch(err => {
//     console.error('Erro ao carregar comentários:', err);
//     document.getElementById('modal-avaliacao').innerHTML = '<p>Erro ao carregar comentários.</p>';
//   });

function comentar(filme) {
  const comentario = document.getElementById('avaliacao').value;
  const url = 'https://localhost:7252/api/Comentarios';
  const data = {
    idUsuario: 1,
    tmdbFilmeId: 254,
    texto: comentario
  };

  fetchComToken(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`Erro ao enviar comentário: ${res.status}`);
      }
      return res.json();
    })
    .then(() => {
      alert('Comentário enviado com sucesso!');
      document.getElementById('avaliacao').value = '';
      window.location.reload();
    })
    .catch(err => {
      console.error('Erro ao enviar comentário:', err);
      alert('Erro ao enviar comentário.');
    });
}

function fecharModal() {
  document.getElementById('modal-filme').style.display = 'none';
}

function gerarEstrelas(nota) {
  if (!nota) return '';
  const estrelasCheias = Math.round(nota / 2);
  return Array.from({ length: 5 }, (_, i) => i < estrelasCheias ? '★' : '☆').join('');
}

document.getElementById('busca').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    buscarFilmes();
  }
});

function toggleMenu() {
  const menu = document.getElementById("dropdown-menu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// Fecha o menu se clicar fora
  document.addEventListener("click", function (event) {
    const userMenu = document.querySelector(".user-menu");
    const dropdown = document.getElementById("dropdown-menu");

    if (!userMenu.contains(event.target)) {
      dropdown.style.display = "none";
    }
  });

function fetchComToken(url, options = {}) {
  const jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IkxhdXJhMDIwMiIsIm5hbWVpZCI6IjEiLCJuYmYiOjE3NDc2OTUxODgsImV4cCI6MTc0NzcwMjM4OCwiaWF0IjoxNzQ3Njk1MTg4fQ.-yC6koHkq09Gp7gZJXSuvwAwy5mQ2tVElNzN_YDkGFY";

  // Adiciona o cabeçalho Authorization com o token
  const headers = {
    'Authorization': `Bearer ${jwtToken}`,
    'Content-Type': 'application/json',
    ...options.headers, // Permite sobrescrever ou adicionar outros cabeçalhos
  };

  return fetch(url, { ...options, headers });
}