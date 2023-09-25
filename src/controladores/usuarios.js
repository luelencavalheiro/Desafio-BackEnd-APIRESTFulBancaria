const pool = require('../conexao')

const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')

const senhaJwt = require('../senhaJwt')
const { criptografarSenha, buscarUsuarioPorEmail, buscarUsuarioPorId, camposObrigatorios } = require('../utils')

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body
    camposObrigatorios(req, res, ['nome', 'email', 'senha'])

    try {
        const senhaCriptografada = await criptografarSenha(senha)
        const { rowCount } = await buscarUsuarioPorEmail(email);
        if (rowCount === 0) {
            const query = 'insert into usuarios (nome, email, senha) values ($1, $2, $3) returning id, nome, email '
            const { rows } = await pool.query(query, [nome, email, senhaCriptografada])
            return res.status(201).json(rows[0])
        }
        return res.status(400).json({ mensagem: 'Já existe um email igual a esse cadastrado' })
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

const login = async (req, res) => {
    const { email, senha } = req.body

    camposObrigatorios(req, res, ['email', 'senha'])

    try {
        const { rowCount, rows } = await buscarUsuarioPorEmail(email);
        if (rowCount === 0) {
            return res.status(400).json({ mensagem: 'Email ou senha inválido' })
        }

        const { senha: senhaUsuario, ...usuario } = rows[0];
        const senhaCorreta = await bcrypt.compare(senha, senhaUsuario)

        if (!senhaCorreta) {
            return res.status(400).json({ mensagem: 'Senha inválida' })
        }

        const token = jwt.sign({ id: usuario.id }, senhaJwt, { expiresIn: '8h' })
        return res.json({
            usuario,
            token
        })

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

const detalharUsuario = async (req, res) => {
    return res.json(req.usuario)
}

const editarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body
    const { id } = req.usuario

    try {
        const usuario = await buscarUsuarioPorId(id)

        if (!usuario) {
            return res.status(404).json({ mensagem: 'Usuário não existe' })
        }

        const senhaCriptografada = await criptografarSenha(senha)

        const queryEditarUsuario = 'update usuarios set nome = $1, email = $2, senha = $3 where id = $4'

        await pool.query(queryEditarUsuario, [nome, email, senhaCriptografada, id])

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

module.exports = {
    cadastrarUsuario,
    login,
    detalharUsuario,
    editarUsuario
}