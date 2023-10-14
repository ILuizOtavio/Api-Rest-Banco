const { banco } = require("../bancodedados");

const validarSenhaConta = (req, res, next) => {
  const { senha_conta } = req.query;

  if (!senha_conta) {
    return res.json("A senha não foi informada");
  }

  if (senha_conta !== banco.contas.usuario.senha) {
    return res.json("A senha da conta informada é inválida!");
  }

  next();
};

module.exports = validarSenhaConta;
