const express = require("express");
const {
  criarConta,
  listarContas,
  atualizarConta,
  deletarConta,
  depositarConta,
  sacarConta,
  transferirConta,
  consultarSaldoConta,
  extratoConta,
} = require("./controladores/dados");
const validarSenhaBanco = require("./intermediarios/validar-senha-banco");
const validarSenhaConta = require("./intermediarios/validar-senha-conta");

const rotas = express();

rotas.post("/contas", criarConta);
rotas.post("/transacoes/depositar", depositarConta);
rotas.post("/transacoes/sacar", sacarConta);
rotas.post("/transacoes/transferir", transferirConta);
rotas.put("/contas/:numeroConta/usuario", atualizarConta);
rotas.delete("/contas/:numeroConta", deletarConta);
rotas.get("/contas", validarSenhaBanco, listarContas);
rotas.get("/contas/saldo", validarSenhaConta, consultarSaldoConta);
rotas.get("/contas/extrato", validarSenhaConta, extratoConta);
module.exports = rotas;
