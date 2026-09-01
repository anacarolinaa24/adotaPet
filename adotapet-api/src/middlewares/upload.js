const multer = require("multer");
const path = require("path");

// CONFIGURAÇÃO DE ARMAZENAMENTO
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },

  filename: (req, file, cb) => {
    const nomeUnico =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, nomeUnico);
  },
});

// VALIDAÇÃO DO TIPO DE ARQUIVO
const fileFilter = (req, file, cb) => {
  const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];

  if (tiposPermitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Formato de imagem inválido. Use JPG, PNG ou WEBP."));
  }
};

// CONFIGURAÇÃO FINAL DO MULTER
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter,
});

module.exports = upload;
