const bcrypt = require('bcrypt')
const pool = require('./conexao')

const verificaEmailSenha = (email, senha, res) => {

    if (!email) {
        return res.status(400).json({ mensagem: 'O campo email é obrigatório!' })
    }
    if (!senha) {
        return res.status(400).json({ mensagem: 'O campo senha é obrigatório!' })
    }
}

const criptografarSenha = (senha) => {
    return bcrypt.hash(senha, 10)
}

const buscarUsuarioPorEmail = (email) => {
    return pool.query('select * from usuarios where email = $1', [email])

}

const buscarUsuarioPorId = (id) => {
    return pool.query('select * from usuarios where id = $1', [id])

}

module.exports = {
    verificaEmailSenha,
    criptografarSenha,
    buscarUsuarioPorEmail,
    buscarUsuarioPorId
}