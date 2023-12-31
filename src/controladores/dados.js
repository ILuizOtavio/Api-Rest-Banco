const bancodedados = require("../bancodedados");

let identificadorDaConta = 1;
const hora = new Date();
const { saques, depositos, transferencias } = bancodedados;

let { contas } = bancodedados;

function numeroContaESenha(req, res) {
  const { numero_conta, senha } = req.query;
  const conta = contas.find((conta) => {
    return conta.numero === Number(numero_conta);
  });
  if (!conta) {
    return res.status(404).json({ mensagem: "conta não encontrada" });
  }
  if (conta.usuario.senha !== senha) {
    return res.status(401).json({ mensagem: "senha invalida" });
  }
  if (!senha) {
    return res.status(401).json({ mensagem: "é necessário informar a senha" });
  }
}
function validadorSenhaUsuario(req, res) {
  const { numero_conta, senha, numero_conta_origem } = req.body;
  const conta = contas.find((conta) => {
    return (
      conta.numero === Number(numero_conta_origem) ||
      conta.numero === Number(numero_conta)
    );
  });
  if (!senha) {
    return res.status(401).json({ mensagem: " É necessario informar a senha" });
  }

  if (conta.usuario.senha !== senha) {
    return res.status(401).json({ mensagem: "senha incorreta" });
  }
}
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
  const conta = contas.find((conta) => {
    return conta.numero === Number(numero_conta);
  });
  if (!conta) {
    return res.status(404).json({ mensagem: "A conta não foi encontrada" });
  }

  if (!valor || !numero_conta) {
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

  return res.status(204).send();
};
const deletarConta = (req, res) => {
  const { numeroConta } = req.params;
  const conta = contas.find((conta) => {
    return conta.numero === Number(numeroConta);
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
    return conta.numero !== Number(numeroConta);
  });

  return res.status(204).send();
};
const depositarConta = (req, res) => {
  const { valor, numero_conta } = req.body;
  const conta = contas.find((conta) => {
    return conta.numero === Number(numero_conta);
  });
  validacaoDadosConta(req, res);

  conta.saldo += valor;

  const registroDeposito = {
    data: hora.toLocaleString(),
    numero_conta: conta.numero,
    valor,
  };
  depositos.push(registroDeposito);

  return res.status(204).send();
};
const sacarConta = (req, res) => {
  const { numero_conta, valor, senha } = req.body;
  const conta = contas.find((conta) => {
    return conta.numero === Number(numero_conta);
  });
  validadorSenhaUsuario(req, res);
  if (valor > conta.saldo) {
    return res.status(400).json({ mensagem: "Saldo insuficiente" });
  }

  validacaoDadosConta(req, res);

  conta.saldo -= valor;

  const registroSaque = {
    data: hora.toLocaleString(),
    numero_conta: conta.numero,
    valor,
  };
  saques.push(registroSaque);
  return res.status(204).send();
};
const transferirConta = (req, res) => {
  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;
  const contaUm = contas.find((conta) => {
    return conta.numero === Number(numero_conta_origem);
  });
  const contaDois = contas.find((conta) => {
    return conta.numero === Number(numero_conta_destino);
  });
  if (!contaUm) {
    return res.status(400).json({ mensagem: "conta Origem não encontrada" });
  }
  if (!contaDois) {
    return res.status(400).json({ mensagem: "conta Destino não encontrada" });
  }
  if (valor > contaUm.saldo) {
    return res.status(400).json({ mensagem: "Saldo insuficiente" });
  }
  validadorSenhaUsuario(req, res);

  contaUm.saldo -= valor;
  contaDois.saldo += valor;

  const registroTransferencia = {
    data: hora.toLocaleString(),
    numero_conta_origem,
    numero_conta_destino,
    valor,
  };
  transferencias.push(registroTransferencia);
  return res.status(204).send();
};
const consultarSaldoConta = (req, res) => {
  const { numero_conta } = req.query;
  const conta = contas.find((conta) => {
    return conta.numero === Number(numero_conta);
  });
  numeroContaESenha(req, res);
  const saldo = {
    saldo: conta.saldo,
  };
  return res.json(saldo);
};
const extratoConta = (req, res) => {
  const { numero_conta } = req.query;
  const conta = contas.find((conta) => {
    return conta.numero === Number(numero_conta);
  });

  numeroContaESenha(req, res);

  const depositoConta = depositos.find((deposito) => {
    return deposito.numero_conta === conta.numero;
  });
  const saqueConta = saques.find((saque) => {
    return saque.numero_conta === conta.numero;
  });
  const enviado = transferencias.find((envio) => {
    return envio.numero_conta_origem == conta.numero;
  });
  const recebido = transferencias.find((recebido) => {
    return recebido.numero_conta_destino == conta.numero;
  });

  const extrato = {
    depositos: depositoConta,
    saques: saqueConta,
    transferenciasEnviadas: enviado,
    transferenciasRecebidas: recebido,
  };

  return res.json(extrato);
};

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
