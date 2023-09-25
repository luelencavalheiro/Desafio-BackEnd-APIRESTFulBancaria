const pool = require('../conexao')
const { camposObrigatorios, idCategoria, verificaTipo } = require('../utils')

const listarTransacoes = async (req, res) => {
    try {
        const { filtro } = req.query

        const query = `select t.*, c.descricao as categoria_nome from transacoes t left join categorias c on t.categoria_id = c.id
        where t.usuario_id = $1 ${filtro ? `and c.descricao = any($2::text[])` : ''}`

        const params = [req.usuario.id]

        if (filtro && filtro.length > 0) {
            const { rows: transacoes } = await pool.query(query, [req.usuario.id, filtro])

            if (transacoes.rowCount === 0) {
                return res.status(404).json({ Mensagem: "Nenhuma transação encontrada" })
            }

            return res.json(transacoes)
        } else {
            const { rows: transacoes } = await pool.query(query, params)
            return res.json(transacoes)
        }



    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}

const detalharTransacao = async (req, res) => {
    const { id } = req.params

    try {
        const query = `select t.*, c.descricao as categoria_nome from transacoes t left join categorias c on t.categoria_id = c.id
        where t.id = $1 and t.usuario_id = $2`
        const { rows, rowCount } = await pool.query(query, [id, req.usuario.id])
        if (rowCount === 0) {
            return res.status(404).json({ Mensagem: "Transação não encontrada." })
        }
        const transacao = rows[0]

        return res.json(transacao)

    } catch (error) {
        return res.status(500).json({ Mensagem: "Erro interno do servidor" })
    }
}

const cadastrarTransacao = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body

    try {
        camposObrigatorios(req, res, ['descricao', 'valor', 'categoria_id', 'tipo', 'data'])
        await idCategoria(res, categoria_id)
        verificaTipo(res, tipo)

        const query = `insert into transacoes (usuario_id, descricao, valor, data, categoria_id, tipo)
        values ($1, $2, $3, $4, $5, $6 ) returning *`

        const params = [req.usuario.id, descricao, valor, data, categoria_id, tipo]
        const { rows } = await pool.query(query, params)

        return res.status(201).json(rows[0])

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

const atualizarTransacao = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body
    const { id } = req.params

    try {

        camposObrigatorios(req, res, ['descricao', 'valor', 'categoria_id', 'tipo', 'data'])
        await idCategoria(res, categoria_id)
        verificaTipo(res, tipo)
        const { rows, rowCount } = await pool.query('select * from transacoes where id = $1 and usuario_id = $2', [id, req.usuario.id])

        if (rowCount === 0) {
            return res.status(404).json({ mensagem: 'Transação não encontrada' })
        }

        const queryAtualizarTransacao = `update transacoes set descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 where id = $6`
        await pool.query(queryAtualizarTransacao, [descricao, valor, data, categoria_id, tipo, id])

        return res.status(204).send()
    } catch (error) {
        return res.status(500).json('Erro interno do servidor')
    }
}

const extratoTransacoes = async (req, res) => {
    try {
        const { rows: transacoes } = await pool.query(`select tipo, coalesce(sum(valor), 0) as total from transacoes where usuario_id = $1 group by tipo`,
            [req.usuario.id])

        const extrato = {
            entrada: 0,
            saida: 0
        }

        for (const row of transacoes) {
            if (row.tipo === 'entrada') {
                extrato.entrada = row.total
            } else if (row.tipo === 'saida') {
                extrato.saida = row.total
            }
        }

        return res.json(extrato)
    } catch (error) {
        return res.status(500).json('Erro interno do servidor')
    }

}

const deletarTransacoes = async (req, res) => {
    const { id } = req.params
    try {
        const { rows, rowCount } = await pool.query('select * from transacoes where id = $1 and usuario_id = $2', [id, req.usuario.id])
        if (rowCount === 0) {
            return res.status(404).json({ Mensagem: "Transação não encontrada." })
        }
        await pool.query('delete from transacoes where id = $1', [id])

        return res.status(204).send()
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}


module.exports = { listarTransacoes, detalharTransacao, cadastrarTransacao, atualizarTransacao, extratoTransacoes, deletarTransacoes }