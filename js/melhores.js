const filmes = [
  {
    titulo: "Missão Relâmpago",
    genero: "acao",
    ano: 2023,
    nota: 4.7,
    imagem: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80",
    sinopse: "Um espião aposentado precisa voltar à ativa para salvar sua filha de uma conspiração internacional."
  },
  {
    titulo: "Primavera em Veneza",
    genero: "romance",
    ano: 2022,
    nota: 4.4,
    imagem: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=300&q=80",
    sinopse: "Durante uma viagem à Itália, duas almas solitárias encontram um amor inesperado."
  },
  {
    titulo: "Dia de Louco",
    genero: "comedia",
    ano: 2021,
    nota: 4.1,
    imagem: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=300&q=80",
    sinopse: "Um funcionário público tenta manter a sanidade enquanto tudo dá errado em seu primeiro dia como prefeito."
  },
  {
    titulo: "O Peso da Verdade",
    genero: "drama",
    ano: 2020,
    nota: 4.8,
    imagem: "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=300&q=80",
    sinopse: "Baseado em uma história real, um jovem advogado desafia um sistema corrupto em busca de justiça."
  },
  {
    titulo: "Horizonte Final",
    genero: "ficcao",
    ano: 2024,
    nota: 4.6,
    imagem: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=300&q=80",
    sinopse: "No ano 2098, uma equipe de cientistas descobre um portal para outra galáxia – mas algo os espera do outro lado."
  },
  {
    titulo: "Silêncio Mortal",
    genero: "terror",
    ano: 2021,
    nota: 4.2,
    imagem: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=300&q=80",
    sinopse: "Um grupo de amigos em uma cabana isolada descobre que o silêncio é a única forma de sobreviver."
  }
];

function filtrarGenero(genero) {
  const grid = document.getElementById("grid-genero");
  grid.innerHTML = "";

  const filtrados = filmes.filter(filme => filme.genero === genero);

  if (filtrados.length === 0) {
    grid.innerHTML = "<p>Nenhum filme encontrado para este gênero.</p>";
    return;
  }

  filtrados.forEach(filme => {
    const filmeDiv = document.createElement("div");
    filmeDiv.classList.add("filme");

    filmeDiv.innerHTML = `
      <img src="${filme.imagem}" alt="${filme.titulo}" 
           onclick="abrirModal('${encodeURIComponent(filme.titulo)}')" 
           onerror="this.onerror=null;this.src='https://via.placeholder.com/300x450?text=Imagem+Indisponivel';">
      <div class="info-filme">
        <h3>${filme.titulo}</h3>
        <p>Nota: ${filme.nota.toFixed(1)}</p>
        <div class="estrelas">${gerarEstrelas(filme.nota)}</div>
        <button onclick="abrirModal('${encodeURIComponent(filme.titulo)}')">Ver Detalhes</button>
      </div>
    `;

    grid.appendChild(filmeDiv);
  });
}

function gerarEstrelas(nota) {
  const total = 5;
  const cheias = Math.round(nota);
  let html = "";

  for (let i = 1; i <= total; i++) {
    html += i <= cheias ? "⭐" : "☆";
  }
  return html;
}

function abrirModal(titulo) {
  const filme = filmes.find(f => f.titulo === decodeURIComponent(titulo));
  if (!filme) return;

  alert(`Detalhes do Filme:
Título: ${filme.titulo}
Nota: ${filme.nota}
Gênero: ${filme.genero}
Ano: ${filme.ano}
Sinopse: ${filme.sinopse}`);
}

function mostrarMelhoresAvaliados() {
  const grid = document.getElementById("grid-melhores");
  if (!grid) return;
  grid.innerHTML = "";

  // Ordena por nota decrescente e pega os 6 primeiros
  const melhores = filmes.slice().sort((a, b) => b.nota - a.nota).slice(0, 6);

  melhores.forEach(filme => {
    const filmeDiv = document.createElement("div");
    filmeDiv.classList.add("filme");

    filmeDiv.innerHTML = `
      <img src="${filme.imagem}" alt="${filme.titulo}" 
           onclick="abrirModal('${encodeURIComponent(filme.titulo)}')" 
           onerror="this.onerror=null;this.src='https://via.placeholder.com/300x450?text=Imagem+Indisponivel';">
      <div class="info-filme">
        <h3>${filme.titulo}</h3>
        <p>Nota: ${filme.nota.toFixed(1)}</p>
        <div class="estrelas">${gerarEstrelas(filme.nota)}</div>
        <button onclick="abrirModal('${encodeURIComponent(filme.titulo)}')">Ver Detalhes</button>
      </div>
    `;

    grid.appendChild(filmeDiv);
  });
}

