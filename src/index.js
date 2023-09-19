const express = require('express');

const app = express();



// cadastrar usuario
app.post('/usuario', (req, res) => { });

// fazer login
app.post('/login', (req, res) => { });

// detalhar perfil do usuario
app.get('/usuario', (req, res) => { });

// editar perfil do usuario
app.put('/usuario', (req, res) => { });

// listar categorias
app.get('/categoria', (req, res) => { });

// listar transações
app.get('/transacao', (req, res) => { });

// detalhar transação
app.get('/transacao/:id', (req, res) => { });

// cadastrar transação
app.post('/transacao', (req, res) => { });

// editar transação
app.put('/transacao/:id', (req, res) => { });

// remover transação
app.delete('/transacao/:id', (req, res) => { });

// obter extrato das transações
app.get('/transacao/extrato', (req, res) => { });


app.listen(3000);