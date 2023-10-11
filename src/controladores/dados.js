const bancodedados = require("../bancodedados");
let identificadorDaConta = 1;
const { banco, contas, saques, depositos, transferencias } = bancodedados;

const criarConta = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  if (!req.body) {
    return res.status(400).json({
      mensagem: "É necessario informar os dados da conta a ser criada",
    });
  }

  if (!nome) {
    return res.status(400).json({
      mensagem: "O nome é obrigatório",
    });
  }

  if (!cpf) {
    return res.status(400).json({
      mensagem: "O CPF é obrigatório",
    });
  }

  if (!email) {
    return res.status(400).json({
      mensagem: "O E-mail é obrigatório",
    });
  }
  if (!telefone) {
    return res.status(400).json({
      mensagem: "O telefone é obrigatório",
    });
  }
  if (!data_nascimento) {
    return res.status(400).json({
      mensagem: "A data de nascimento é obrigatória",
    });
  }
  if (!senha) {
    return res.status(400).json({
      mensagem: "A senha é obrigatória",
    });
  }

  const contaNova = {
    numero: identificadorDaConta++,
    saldo: 0,
    usuario: {
      nome,
      cpf,
      data_nascimento,
      telefone,
      email,
      senha,
    },
  };

  contas.push(contaNova);

  return res.status(201).json({ mensagem: "Conta criada com sucesso" });
};

const listarContas = (req, res) => {
  return res.json(contas);
};

const atualizarConta = (req, res) => {};

const deletarConta = (req, res) => {};

const depositarConta = (req, res) => {};

const sacarConta = (req, res) => {};

const transferirConta = (req, res) => {};

const consultarConta = (req, res) => {};

const extratoConta = (req, res) => {};

module.exports = {
  criarConta,
  atualizarConta,
  listarContas,
  deletarConta,
  depositarConta,
  extratoConta,
  sacarConta,
  transferirConta,
  consultarConta,
};
