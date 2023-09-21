const express = require('express');
const { cadastrarUsuario, login, editarUsuario } = require('../controladores/usuarios');
const verificaLogin = require('../intermediarios/verificaLogin')
const listarCategorias = require('../controladores/categorias');
const { listarTransacoes, detalharTransacao, cadastrarTransacao, atualizarTransacao, deletarTransacoes, extratoTransacoes } = require('../controladores/transacoes');

const rotas = express();


// cadastrar usuario
rotas.post('/usuario', cadastrarUsuario);

// fazer login
rotas.post('/login', login);

rotas.use(verificaLogin)

// detalhar perfil do usuario
rotas.get('/usuario', (req, res) => { });

// editar perfil do usuario
rotas.put('/usuario', editarUsuario);

// listar categorias
rotas.get('/categoria', listarCategorias);

// listar transações
rotas.get('/transacao', listarTransacoes);

// detalhar transação
rotas.get('/transacao/:id', detalharTransacao);

// cadastrar transação
rotas.post('/transacao', cadastrarTransacao);

// editar transação
rotas.put('/transacao/:id', atualizarTransacao);

// remover transação
rotas.delete('/transacao/:id', deletarTransacoes);

// obter extrato das transações
rotas.get('/transacao/extrato', extratoTransacoes);


module.exports = rotas

