document
  .querySelector("form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
      const usuarioResponse = await fetch(
        `https://localhost:7252/api/Usuarios/public-by-email?email=${encodeURIComponent(
          email
        )}`
      );
      if (!usuarioResponse.ok) {
        alert("Usuário não encontrado.");
        return;
      }
      const usuario = await usuarioResponse.json();

      // 2. Autenticar e obter o JWT
      const loginResponse = await fetch(
        "https://localhost:7252/api/Usuarios/authenticate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nomeDeUsuario: usuario.nomeDeUsuario,
            senha: senha,
          }),
        }
      );

      if (loginResponse.ok) {
        const data = await loginResponse.json();
        localStorage.setItem("jwtToken", data.token || data.Token);

        window.location.href = "../index.html";
      } else {
        alert("E-mail ou senha inválidos.");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    }
  });
