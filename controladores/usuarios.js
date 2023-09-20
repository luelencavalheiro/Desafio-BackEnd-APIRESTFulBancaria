const pool = require('../conexao')

const jwt = require('jsonwebtoken')

const senhaJwt = require('../senhaJwt')

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
        const { rowCount } = await pool.query(' select * from usuarios where email = $1', [email])
        if (rowCount === 0) {
            const query = 'insert into usuarios (nome, email, senha) values ($1, $2, $3) returning (id, nome, email) '
            const { rows } = await pool.query(query, [nome, email, senha])
            return res.status(201).json(rows[0])
        }
        return res.status(400).json({ mensagem: 'Já existe um email igual a esse cadastrado' })
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }

    // FALTA Criptografar a senha antes de persistir no banco de dados
}

const login = async (req, res) => {
    const { email, senha } = req.body

    if (!email) {
        return res.status(400).json({ mensagem: 'O campo email é obrigatório!' })
    }
    if (!senha) {
        return res.status(400).json({ mensagem: 'O campo senha é obrigatório!' })
    }

    try {
        const { rowCount } = await pool.query(' select * from usuarios where email = $1', [email])
        if (rowCount < 0) {
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

const editarUsuario = async (req, res) => {

    const { nome, email, senha } = req.body
    const { authorization } = req.header
    const token = authorization.split(' ')[1]
    const { id } = jwt.verify(token, senhaJwt)

    try {
        const usuario = await pool.query(' select * from usuarios where id = $1 and usuario_id = $2', [id, req.usuario.id])

        if (!usuario) {
            return res.status(404).json({ mensagem: 'Usuário não existe' })
        }
        const queryEditarUsuario = ' update usuarios set nome = $1, email = $2, senha = $3 where id = $4'

        await pool.query(queryEditarUsuario, [nome, email, senha, id])

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }

}


module.exports = {
    cadastrarUsuario,
    login,
    editarUsuario
}