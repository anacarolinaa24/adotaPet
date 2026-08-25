const express = require("express");
const cors = require("cors");
require("dotenv").config();

const animalRoutes = require("./src/routes/animalRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// ROTA DE TESTE
app.get("/", (req, res) => {
  res.json({
    mensagem: "API AdotaPet funcionando!",
  });
});

// ROTAS DE ANIMAIS
app.use("/animais", animalRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor AdotaPet rodando na porta ${PORT}`);
});
