const express = require("express");

const router = express.Router();

const animalController = require("../controllers/animalController");

const autenticarToken = require("../middlewares/autenticarToken");

const verificarAdmin = require("../middlewares/verificarAdmin");

const upload = require("../middlewares/upload");

// LISTAR TODOS OS ANIMAIS
router.get("/", animalController.listarAnimais);

// BUSCAR ANIMAL POR ID
router.get("/:id", animalController.buscarAnimalPorId);

// CADASTRAR ANIMAL
router.post(
  "/",
  autenticarToken,
  verificarAdmin,
  upload.single("foto"),
  animalController.cadastrarAnimal,
);

// EDITAR ANIMAL
router.put(
  "/:id",
  autenticarToken,
  verificarAdmin,
  upload.single("foto"),
  animalController.editarAnimal,
);

// EXCLUIR ANIMAL
router.delete(
  "/:id",
  autenticarToken,
  verificarAdmin,
  animalController.excluirAnimal,
);

module.exports = router;
