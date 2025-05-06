// Lista de filmes fictícios
const filmes = [
    { titulo: "A Origem", nota: 9.3 },
    { titulo: "O Poderoso Chefão", nota: 9.2 },
    { titulo: "Vingadores: Ultimato", nota: 8.9 },
    { titulo: "Avatar", nota: 8.2 },
    { titulo: "Coringa", nota: 9.0 }
  ];
  
  // Ordena por nota (maior para menor)
  const melhores = filmes.sort((a, b) => b.nota - a.nota).slice(0, 5);
  
  const container = document.getElementById("top-filmes");
  
  // Adiciona na tela
  melhores.forEach(filme => {
    const card = document.createElement("div");
    card.className = "filme-card";
    card.innerHTML = `<h3>${filme.titulo}</h3><p>Nota: ${filme.nota}</p>`;
    container.appendChild(card);
  });
  