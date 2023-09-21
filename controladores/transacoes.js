const pool = require('../conexao')

const listarTransacoes = async (req, res) => {
    try {
        const { rows } = await pool.query('select * from transacoes where usuario_id = $1', [req.usuario_id])
        return res.json(rows)
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}

const detalharTransacao = async (req, res) => {
    const { id } = req.params

    try {
        const { rows, rowCount } = await pool.query('select * from transacoes where id = $1 and usuario_id = $2', [id, req.usuario_id])
        if (rowCount === 0) {
            return res.status(404).json({ Mensagem: "Transação não encontrada." })
        }
        const transacao = rows[0]
        return res.json(transacao)
    } catch (error) {
        return res.status(500).json({ Mensagem: "Erro interno do servidor" })
    }
}


module.exports = { listarTransacoes, detalharTransacao }