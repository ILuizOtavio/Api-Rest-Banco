const { banco } = require("../bancodedados");

const validarSenhaBanco = (req, res, next) => {
  const { senha_banco } = req.query;

  if (!senha_banco) {
    return res.json("A senha não foi informada");
  }

  if (senha_banco !== banco.senha) {
    return res.json("A senha do banco informada é inválida!");
  }

  next();
};

module.exports = validarSenhaBanco;
