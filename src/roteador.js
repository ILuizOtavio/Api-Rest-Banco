const express = require("express");
const {
  criarConta,
  listarContas,
  atualizarConta,
} = require("./controladores/dados");
const validarSenhaBanco = require("./intermediarios/validar-senha-banco");

const rotas = express();

rotas.post("/contas", criarConta);
rotas.get("/contas", validarSenhaBanco, listarContas);
rotas.put("/contas/:numeroConta/usuario", atualizarConta);
module.exports = rotas;
