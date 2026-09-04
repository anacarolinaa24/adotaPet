const pool = require("../config/database");

// LISTAR TODOS OS ANIMAIS
async function listarAnimais(req, res) {
  try {
    const [animais] = await pool.query("SELECT * FROM animal");

    res.status(200).json(animais);
  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      mensagem: "Erro ao buscar animais",
    });
  }
}

// BUSCAR ANIMAL POR ID
async function buscarAnimalPorId(req, res) {
  try {
    const { id } = req.params;

    const [animais] = await pool.query(
      "SELECT * FROM animal WHERE id_animal = ?",
      [id],
    );

    if (animais.length === 0) {
      return res.status(404).json({
        mensagem: "Animal não encontrado",
      });
    }

    res.status(200).json(animais[0]);
  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      mensagem: "Erro ao buscar animal",
    });
  }
}

// CADASTRAR ANIMAL
async function cadastrarAnimal(req, res) {
  try {
    const { nome, especie, raca, sexo, idade, descricao, status } = req.body;

    const foto = req.file ? req.file.filename : null;

    const [resultado] = await pool.query(
      `INSERT INTO animal
      (
        nome,
        especie,
        raca,
        sexo,
        idade,
        descricao,
        foto,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nome,
        especie,
        raca,
        sexo,
        idade,
        descricao,
        foto,
        status || "DISPONIVEL",
      ],
    );

    res.status(201).json({
      mensagem: "Animal cadastrado com sucesso",
      id_animal: resultado.insertId,
      foto: foto,
    });
  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      mensagem: "Erro ao cadastrar animal",
    });
  }
}

// EDITAR ANIMAL
async function editarAnimal(req, res) {
  try {
    const { id } = req.params;

    const { nome, especie, raca, sexo, idade, descricao, status } = req.body;

    // Busca a foto que já está salva no banco
    const [animais] = await pool.query(
      "SELECT foto FROM animal WHERE id_animal = ?",
      [id],
    );

    if (animais.length === 0) {
      return res.status(404).json({
        mensagem: "Animal não encontrado",
      });
    }

    const fotoAtual = animais[0].foto;

    // Se uma nova foto foi enviada, usa ela.
    // Caso contrário, mantém a foto antiga.
    const novaFoto = req.file ? req.file.filename : fotoAtual;

    const [resultado] = await pool.query(
      `UPDATE animal
       SET nome = ?,
           especie = ?,
           raca = ?,
           sexo = ?,
           idade = ?,
           descricao = ?,
           foto = ?,
           status = ?
       WHERE id_animal = ?`,
      [nome, especie, raca, sexo, idade, descricao, novaFoto, status, id],
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Animal não encontrado",
      });
    }

    res.status(200).json({
      mensagem: "Animal atualizado com sucesso",
      foto: novaFoto,
    });
  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      mensagem: "Erro ao atualizar animal",
    });
  }
}

// EXCLUIR ANIMAL
async function excluirAnimal(req, res) {
  try {
    const { id } = req.params;

    const [resultado] = await pool.query(
      "DELETE FROM animal WHERE id_animal = ?",
      [id],
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Animal não encontrado",
      });
    }

    res.status(200).json({
      mensagem: "Animal excluído com sucesso",
    });
  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      mensagem: "Erro ao excluir animal",
    });
  }
}

module.exports = {
  listarAnimais,
  buscarAnimalPorId,
  cadastrarAnimal,
  editarAnimal,
  excluirAnimal,
};
