const express = require("express");
const cors = require("cors");
require("dotenv").config();

const animalRoutes = require("./src/routes/animalRoutes");
const usuarioRoutes = require("./src/routes/usuarioRoutes");
const solicitacaoRoutes = require("./src/routes/solicitacaoRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensagem: "API AdotaPet funcionando!",
  });
});

app.use("/animais", animalRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/solicitacoes", solicitacaoRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor AdotaPet rodando na porta ${PORT}`);
});
