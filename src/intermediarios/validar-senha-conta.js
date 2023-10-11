const { banco } = require("../bancodedados");

const validarSenhaConta = (req, res, next) => {
  const { senha_banco } = req.query;

  if (!senha_banco) {
    return res.json("A senha não foi informada");
  }

  if (senha_banco !== banco.contas.usuario.senha) {
    return res.json("A senha da conta informada é inválida!");
  }

  next();
};

module.exports = validarSenhaConta;
