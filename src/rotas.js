const express = require('express');
const { cadastrarUsuario, login, editarUsuario, detalharUsuario } = require('./controladores/usuarios');
const verificaLogin = require('./intermediarios/verificaLogin')
const listarCategorias = require('./controladores/categorias');
const { listarTransacoes, detalharTransacao, cadastrarTransacao, atualizarTransacao, deletarTransacoes, extratoTransacoes } = require('./controladores/transacoes');

const rotas = express();


// cadastrar usuario
rotas.post('/usuario', cadastrarUsuario);

rotas.post('/login', login);

rotas.use(verificaLogin)

rotas.get('/usuario', detalharUsuario);

rotas.put('/usuario', editarUsuario);

rotas.get('/categoria', listarCategorias);

rotas.get('/transacao', listarTransacoes);

rotas.get('/transacao/extrato', extratoTransacoes);

rotas.get('/transacao/:id', detalharTransacao);

rotas.post('/transacao', cadastrarTransacao);

rotas.put('/transacao/:id', atualizarTransacao);

rotas.delete('/transacao/:id', deletarTransacoes);


module.exports = rotas

