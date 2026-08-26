const express = require("express");

const router = express.Router();

const animalController = require("../controllers/animalController");
const autenticarToken = require("../middlewares/autenticarToken");
const verificarAdmin = require("../middlewares/verificarAdmin");

// LISTAR TODOS OS ANIMAIS
router.get("/", animalController.listarAnimais);

// BUSCAR UM ANIMAL PELO ID
router.get("/:id", animalController.buscarAnimalPorId);

// CADASTRAR UM NOVO ANIMAL
router.post(
  "/",
  autenticarToken,
  verificarAdmin,
  animalController.cadastrarAnimal,
);

// EDITAR UM ANIMAL
router.put(
  "/:id",
  autenticarToken,
  verificarAdmin,
  animalController.editarAnimal,
);

// EXCLUIR UM ANIMAL
router.delete(
  "/:id",
  autenticarToken,
  verificarAdmin,
  animalController.excluirAnimal,
);

module.exports = router;
