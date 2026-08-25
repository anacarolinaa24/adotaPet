const express = require("express");

const router = express.Router();

const animalController = require("../controllers/animalController");

// LISTAR TODOS OS ANIMAIS
router.get("/", animalController.listarAnimais);

// BUSCAR UM ANIMAL PELO ID
router.get("/:id", animalController.buscarAnimalPorId);

// CADASTRAR UM NOVO ANIMAL
router.post("/", animalController.cadastrarAnimal);

// EDITAR UM ANIMAL
router.put("/:id", animalController.editarAnimal);

// EXCLUIR UM ANIMAL
router.delete("/:id", animalController.excluirAnimal);

module.exports = router;
