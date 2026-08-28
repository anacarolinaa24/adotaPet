const pool = require("../config/database");

async function criarSolicitacao(req, res) {
  try {
    const id_usuario = req.usuario.id_usuario;
    const { id_animal } = req.body;

    // Verifica se o animal existe
    const [animais] = await pool.query(
      "SELECT * FROM animal WHERE id_animal = ?",
      [id_animal],
    );

    if (animais.length === 0) {
      return res.status(404).json({
        mensagem: "Animal não encontrado",
      });
    }

    const animal = animais[0];

    // Verifica se o animal está disponível para adoção
    if (animal.status !== "DISPONIVEL") {
      return res.status(400).json({
        mensagem: "Animal não está disponível para adoção",
      });
    }

    // Verifica se o usuário já solicitou a adoção desse animal
    const [solicitacoes] = await pool.query(
      `SELECT * FROM solicitacao_adocao
       WHERE id_usuario = ? AND id_animal = ?`,
      [id_usuario, id_animal],
    );

    if (solicitacoes.length > 0) {
      return res.status(400).json({
        mensagem: "Você já possui uma solicitação para este animal",
      });
    }

    // Cria a solicitação com status PENDENTE
    const [resultado] = await pool.query(
      `INSERT INTO solicitacao_adocao
       (id_usuario, id_animal, status)
       VALUES (?, ?, ?)`,
      [id_usuario, id_animal, "PENDENTE"],
    );

    res.status(201).json({
      mensagem: "Solicitação de adoção realizada com sucesso",
      id_solicitacao: resultado.insertId,
    });
  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      mensagem: "Erro ao realizar solicitação de adoção",
    });
  }
}

async function listarMinhasSolicitacoes(req, res) {
  try {
    const id_usuario = req.usuario.id_usuario;

    const [solicitacoes] = await pool.query(
      `SELECT
        s.id_solicitacao,
        s.data_solicitacao,
        s.status,
        a.id_animal,
        a.nome AS nome_animal,
        a.especie,
        a.raca,
        a.foto,
        a.status AS status_animal
      FROM solicitacao_adocao s
      INNER JOIN animal a
        ON s.id_animal = a.id_animal
      WHERE s.id_usuario = ?
      ORDER BY s.data_solicitacao DESC`,
      [id_usuario],
    );

    res.status(200).json(solicitacoes);
  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      mensagem: "Erro ao buscar solicitações",
    });
  }
}

async function listarTodasSolicitacoes(req, res) {
  try {
    const [solicitacoes] = await pool.query(
      `SELECT
        s.id_solicitacao,
        s.data_solicitacao,
        s.status,
        u.id_usuario,
        u.nome AS nome_usuario,
        u.email,
        a.id_animal,
        a.nome AS nome_animal,
        a.especie,
        a.raca,
        a.status AS status_animal
      FROM solicitacao_adocao s
      INNER JOIN usuario u
        ON s.id_usuario = u.id_usuario
      INNER JOIN animal a
        ON s.id_animal = a.id_animal
      ORDER BY s.data_solicitacao DESC`,
    );

    res.status(200).json(solicitacoes);
  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      mensagem: "Erro ao buscar solicitações",
    });
  }
}
async function aprovarSolicitacao(req, res) {
  const conexao = await pool.getConnection();

  try {
    const { id } = req.params;

    await conexao.beginTransaction();

    // Busca a solicitação
    const [solicitacoes] = await conexao.query(
      `SELECT *
       FROM solicitacao_adocao
       WHERE id_solicitacao = ?`,
      [id],
    );

    if (solicitacoes.length === 0) {
      await conexao.rollback();

      return res.status(404).json({
        mensagem: "Solicitação não encontrada",
      });
    }

    const solicitacao = solicitacoes[0];

    // Só permite aprovar solicitação pendente
    if (solicitacao.status !== "PENDENTE") {
      await conexao.rollback();

      return res.status(400).json({
        mensagem: "Esta solicitação já foi analisada",
      });
    }

    // Verifica se o animal ainda está disponível
    const [animais] = await conexao.query(
      `SELECT *
       FROM animal
       WHERE id_animal = ?`,
      [solicitacao.id_animal],
    );

    if (animais.length === 0) {
      await conexao.rollback();

      return res.status(404).json({
        mensagem: "Animal não encontrado",
      });
    }

    const animal = animais[0];

    if (animal.status !== "DISPONIVEL") {
      await conexao.rollback();

      return res.status(400).json({
        mensagem: "Animal não está disponível para adoção",
      });
    }

    // Aprova a solicitação
    await conexao.query(
      `UPDATE solicitacao_adocao
       SET status = 'APROVADA'
       WHERE id_solicitacao = ?`,
      [id],
    );

    // Altera o animal para adotado
    await conexao.query(
      `UPDATE animal
       SET status = 'ADOTADO'
       WHERE id_animal = ?`,
      [solicitacao.id_animal],
    );

    await conexao.commit();

    res.status(200).json({
      mensagem: "Solicitação aprovada com sucesso",
    });
  } catch (erro) {
    await conexao.rollback();

    console.error(erro);

    res.status(500).json({
      mensagem: "Erro ao aprovar solicitação",
    });
  } finally {
    conexao.release();
  }
}
async function recusarSolicitacao(req, res) {
  try {
    const { id } = req.params;

    const [solicitacoes] = await pool.query(
      `SELECT *
       FROM solicitacao_adocao
       WHERE id_solicitacao = ?`,
      [id],
    );

    if (solicitacoes.length === 0) {
      return res.status(404).json({
        mensagem: "Solicitação não encontrada",
      });
    }

    const solicitacao = solicitacoes[0];

    if (solicitacao.status !== "PENDENTE") {
      return res.status(400).json({
        mensagem: "Esta solicitação já foi analisada",
      });
    }

    await pool.query(
      `UPDATE solicitacao_adocao
       SET status = 'RECUSADA'
       WHERE id_solicitacao = ?`,
      [id],
    );

    res.status(200).json({
      mensagem: "Solicitação recusada com sucesso",
    });
  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      mensagem: "Erro ao recusar solicitação",
    });
  }
}

module.exports = {
  criarSolicitacao,
  listarMinhasSolicitacoes,
  listarTodasSolicitacoes,
  aprovarSolicitacao,
  recusarSolicitacao,
};
