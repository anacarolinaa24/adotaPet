const express = require("express");

const router = express.Router();

const solicitacaoController = require("../controllers/solicitacaoController");

const autenticarToken = require("../middlewares/autenticarToken");
const verificarAdmin = require("../middlewares/verificarAdmin");

//ROTAS//
router.post("/", autenticarToken, solicitacaoController.criarSolicitacao);
router.get(
  "/minhas",
  autenticarToken,
  solicitacaoController.listarMinhasSolicitacoes,
);
router.get(
  "/",
  autenticarToken,
  verificarAdmin,
  solicitacaoController.listarTodasSolicitacoes,
);
router.put(
  "/:id/aprovar",
  autenticarToken,
  verificarAdmin,
  solicitacaoController.aprovarSolicitacao,
);
router.put(
  "/:id/recusar",
  autenticarToken,
  verificarAdmin,
  solicitacaoController.recusarSolicitacao,
);

module.exports = router;
