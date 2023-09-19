const express = require('express');
const { cadastrarUsuario, login } = require('../controladores/usuarios');

const rotas = express();


// cadastrar usuario
rotas.post('/usuario', cadastrarUsuario);

// fazer login
rotas.post('/login', login);

// detalhar perfil do usuario
rotas.get('/usuario', (req, res) => { });

// editar perfil do usuario
rotas.put('/usuario', (req, res) => { });

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

