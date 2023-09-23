const pool = require('../conexao')

const listarTransacoes = async (req, res) => {
    try {
        const { rows: transacoes } = await pool.query('select * from transacoes where usuario_id = $1', [req.usuario.id])

        return res.json(transacoes)

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}

const detalharTransacao = async (req, res) => {
    const { id } = req.params

    try {
        const { rows, rowCount } = await pool.query('select * from transacoes where id = $1 and usuario_id = $2', [id, req.usuario.id])
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

    if (!descricao) {
        return res.status(400).json({ mensagem: "O campo descrição é obrigatório" })
    }
    if (!valor) {
        return res.status(400).json({ mensagem: "O campo valor é obrigatório" })
    }
    if (!categoria_id) {
        return res.status(400).json({ mensagem: "O campo id categoria é obrigatório" })
    }
    if (!tipo) {
        return res.status(400).json({ mensagem: "Informe se é uma entrada ou saida" })
    }
    if (!data) {
        return res.status(400).json({ mensagem: "O campo data é obrigatório" })
    }

    try {
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

    if (!descricao) {
        return res.status(400).json({ mensagem: "O campo descrição é obrigatório" })
    }
    if (!valor) {
        return res.status(400).json({ mensagem: "O campo valor é obrigatório" })
    }
    if (!categoria_id) {
        return res.status(400).json({ mensagem: "O campo id categoria é obrigatório" })
    }
    if (!tipo) {
        return res.status(400).json({ mensagem: "O campo tipo é obrigatório" })
    }
    if (!data) {
        return res.status(400).json({ mensagem: "O campo data é obrigatório" })
    }

    try {
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