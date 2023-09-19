const pool = require('../conexao')

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body

    if (!nome) {
        return res.status(400).json({ mensagem: 'O campo nome é obrigatório!' })
    }
    if (!email) {
        return res.status(400).json({ mensagem: 'O campo email é obrigatório!' })
    }
    if (!senha) {
        return res.status(400).json({ mensagem: 'O campo senha é obrigatório!' })
    }

    try {
        const query = 'insert into usuarios (nome, email, senha) values ($1, $2, $3) returning (id, nome, email) '
        const { rows } = await pool.query(query, [nome, email, senha])

        return res.status(201).json(rows[0])
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}





module.exports = { cadastrarUsuario }