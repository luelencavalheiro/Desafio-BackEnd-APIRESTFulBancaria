const jwt = require('jsonwebtoken')
const senhaJwt = require('../senhaJwt')
const pool = require('../conexao')


const verificaLogin = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Não autorizado' })
    }

    const token = authorization.split(' ')[1]

    if (!token) {
        return res.status(401).json({ mensagem: 'Você precisa ter o token de autenticação' })
    }

    try {

        const { id } = jwt.verify(token, senhaJwt)

        const { rows, rowCount } = await pool.query('select * from usuarios where id = $1', [id])

        if (rowCount === 0) {
            return res.status(401).json({ mensagem: 'Não autorizado' })
        }

        const { senha, ...usuario } = rows[0]

        req.usuario = usuario

        next()

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }

}

module.exports = verificaLogin