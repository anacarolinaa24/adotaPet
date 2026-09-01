const express = require("express");
const cors = require("cors");
require("dotenv").config();

const animalRoutes = require("./src/routes/animalRoutes");
const usuarioRoutes = require("./src/routes/usuarioRoutes");
const solicitacaoRoutes = require("./src/routes/solicitacaoRoutes");
const multer = require("multer");
const path = require("path");
const app = express();

console.log("Pasta de uploads:", path.join(__dirname, "src", "uploads"));

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")));

app.get("/", (req, res) => {
  res.json({
    mensagem: "API AdotaPet funcionando!",
  });
});

app.use("/animais", animalRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/solicitacoes", solicitacaoRoutes);
app.use((erro, req, res, next) => {
  if (erro instanceof multer.MulterError) {
    if (erro.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        mensagem: "Arquivo muito grande. O tamanho máximo permitido é 5 MB.",
      });
    }

    return res.status(400).json({
      mensagem: erro.message,
    });
  }

  if (erro.message === "Formato de imagem inválido. Use JPG, PNG ou WEBP.") {
    return res.status(400).json({
      mensagem: erro.message,
    });
  }

  console.error(erro);

  return res.status(500).json({
    mensagem: "Erro interno do servidor",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor AdotaPet rodando na porta ${PORT}`);
});
