const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./adotapet-api/src/config/database");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensagem: "API AdotaPet funcionando!",
  });
});

app.get("/animais", async (req, res) => {
  try {
    const [animais] = await pool.query("SELECT * FROM animal");

    res.json(animais);
  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      mensagem: "Erro ao buscar animais",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor AdotaPet rodando na porta ${PORT}`);
});
