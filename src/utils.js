const bcrypt = require('bcrypt')

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

module.exports = {
    verificaEmailSenha,
    criptografarSenha
}