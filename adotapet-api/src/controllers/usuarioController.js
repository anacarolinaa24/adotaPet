const pool = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// CADASTRAR USUÁRIO
async function cadastrarUsuario(req, res) {
  try {
    const { nome, email, senha } = req.body;

    // Verifica se o e-mail já existe
    const [usuariosExistentes] = await pool.query(
      "SELECT * FROM usuario WHERE email = ?",
      [email],
    );

    if (usuariosExistentes.length > 0) {
      return res.status(400).json({
        mensagem: "E-mail já cadastrado",
      });
    }

    // Cria o hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Todo cadastro público será USUARIO
    const tipoUsuario = "USUARIO";

    const [resultado] = await pool.query(
      `INSERT INTO usuario
            (nome, email, senha, tipo_usuario)
            VALUES (?, ?, ?, ?)`,
      [nome, email, senhaHash, tipoUsuario],
    );

    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso",
      id_usuario: resultado.insertId,
    });
  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      mensagem: "Erro ao cadastrar usuário",
    });
  }
}
async function loginUsuario(req, res) {
  try {
    const { email, senha } = req.body;

    const [usuarios] = await pool.query(
      "SELECT * FROM usuario WHERE email = ?",
      [email],
    );

    if (usuarios.length === 0) {
      return res.status(401).json({
        mensagem: "E-mail ou senha inválidos",
      });
    }

    const usuario = usuarios[0];

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({
        mensagem: "E-mail ou senha inválidos",
      });
    }
    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        tipo_usuario: usuario.tipo_usuario,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      },
    );

    res.status(200).json({
      mensagem: "Login realizado com sucesso",
      token: token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario,
      },
    });
  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      mensagem: "Erro ao realizar login",
    });
  }
}

module.exports = {
  cadastrarUsuario,
  loginUsuario,
};
