const express = require('express');
const { cadastrarUsuario, login, editarUsuario, detalharUsuario } = require('../controladores/usuarios');
const verificaLogin = require('../intermediarios/verificaLogin')

const rotas = express();


// cadastrar usuario
rotas.post('/usuario', cadastrarUsuario);

// fazer login
rotas.post('/login', login);

// validação do token 
rotas.use(verificaLogin)

// detalhar perfil do usuario
rotas.get('/usuario', detalharUsuario);

// editar perfil do usuario
rotas.put('/usuario', editarUsuario);

// listar categorias
rotas.get('/categoria', (req, res) => { });

// listar transações
rotas.get('/transacao', (req, res) => { });

// detalhar transação
rotas.get('/transacao/:id', (req, res) => { });

// cadastrar transação
rotas.post('/transacao', (req, res) => { });

// editar transação
rotas.put('/transacao/:id', (req, res) => { });

// remover transação
rotas.delete('/transacao/:id', (req, res) => { });

// obter extrato das transações
rotas.get('/transacao/extrato', (req, res) => { });


module.exports = rotas

