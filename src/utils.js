const bcrypt = require('bcrypt')
const pool = require('./conexao')

const camposObrigatorios = (req, res, campos) => {
    for (const i of campos) {
        if (!req.body[i]) {
            return res.status(400).json({ Mensagem: `O campo ${campos} é obrigatório!` })
        }
    }
}

const idCategoria = async (res, categoria_id) => {
    const selecionaId = 'select id from categorias where id = $1'
    const verificaId = await pool.query(selecionaId, [categoria_id])

    if (verificaId.rowCount === 0) {
        return res.status(400).json({ Mensagem: "Informe um ID válido!" })
    }
}

const verificaTipo = (res, tipo) => {
    if (tipo !== 'entrada' && tipo !== 'saida') {
        return res.status(400).json({ Mensagem: "Tipo deve ser 'entrada' ou 'saida'!" })
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
    camposObrigatorios,
    idCategoria,
    verificaTipo,
    criptografarSenha,
    buscarUsuarioPorEmail,
    buscarUsuarioPorId
}