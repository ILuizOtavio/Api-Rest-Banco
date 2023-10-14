const bancodedados = require("../bancodedados");

let identificadorDaConta = 1;

const { banco, saques, depositos, transferencias } = bancodedados;

let { contas } = bancodedados;

function validacaoDadosUsuarios(req, res) {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

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
}
function validacaoDadosConta(req, res) {
  const { valor, numero_conta } = req.body;
  if (!conta) {
    return res.status(404).json({ mensagem: "A conta não foi encontrada" });
  }

  if (!valor) {
    return res
      .status(400)
      .json({ mensagem: "O número da conta e o valor são obrigatórios!" });
  }
  if (!numero_conta) {
    return res
      .status(400)
      .json({ mensagem: "O número da conta e o valor são obrigatórios!" });
  }
  if (valor < 0 || valor === 0) {
    return res.status(400).json({ mensagem: "Valor Inválido" });
  }
}
function mesmoCpfOumesmoEmail(req, res) {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  const mesmoCpf = contas.find((contaCpf) => {
    return contaCpf.usuario.cpf === cpf;
  });

  const mesmoEmail = contas.find((contaEmail) => {
    return contaEmail.usuario.email === email;
  });

  if (mesmoCpf || mesmoEmail) {
    return true;
  }
}
const criarConta = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  validacaoDadosUsuarios(req, res);
  const cpfOuEmail = mesmoCpfOumesmoEmail(req, res);

  if (cpfOuEmail) {
    return res.status(400).json({
      mensagem: "Já existe uma conta com o cpf ou e-mail informado!",
    });
  }
  const contaNova = {
    numero: identificadorDaConta,
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
  identificadorDaConta++;

  return res.status(201).json({ mensagem: "Conta criada com sucesso" });
};

const listarContas = (req, res) => {
  return res.json(contas);
};

const atualizarConta = (req, res) => {
  const { numeroConta } = req.params;
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  const conta = contas.find((conta) => {
    return conta.numero === Number(numeroConta);
  });

  if (!conta) {
    return res.status(404).json({ mensagem: "Conta não encontrada" });
  }

  validacaoDadosUsuarios(req, res);
  const cpfOuEmail = mesmoCpfOumesmoEmail(req, res);

  if (cpfOuEmail) {
    return res.status(400).json({
      mensagem: "Já existe uma conta com o cpf ou e-mail informado!",
    });
  }
  conta.usuario.nome = nome;
  conta.usuario.cpf = cpf;
  conta.usuario.data_nascimento = data_nascimento;
  conta.usuario.telefone = telefone;
  conta.usuario.email = email;
  conta.usuario.senha = senha;

  return res.status(200).send();
};

const deletarConta = (req, res) => {
  const { numero } = req.params;
  const conta = contas.find((conta) => {
    return conta.numero === Number(numero);
  });

  if (!conta) {
    return res.status(404).json({ mensagem: "conta não encontrada" });
  }
  if (conta.saldo !== 0) {
    return res
      .status(400)
      .json({ mensagem: "A conta só pode ser removida se o saldo for zero!" });
  }
  contas = contas.filter((conta) => {
    return conta.numero !== Number(numero);
  });

  return res.status(204).send();
};

const depositarConta = (req, res) => {
  const { valor, numero_conta } = req.body;
  const conta = contas.find((conta) => {
    return conta.numero === Number(numero_conta);
  });
  validacaoDadosConta(req, res);
};

const sacarConta = (req, res) => {
  const { numero_conta, valor, senha } = req.body;
  const conta = contas.find((conta) => {
    return conta.numero === Number(numero_conta);
  });

  validacaoDadosConta(req, res);
};

const transferirConta = (req, res) => {};

const consultarSaldoConta = (req, res) => {
  return res.json({ saldo });
};

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
  consultarSaldoConta,
};
