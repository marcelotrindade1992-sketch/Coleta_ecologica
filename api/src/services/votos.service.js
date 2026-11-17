const pool = require('../config/database');
const AppError = require('../errors/AppError');
function validarIds(dados) {
  const resultado = {};
  for (const campo of ['enquete_id', 'opcao_enquete_id', 'usuario_id']) {
    const valor = Number(dados[campo]);
    if (!Number.isInteger(valor) || valor <= 0) throw new AppError(campo + ' deve ser um número inteiro positivo.');
    resultado[campo] = valor;
  }
  return resultado;
}
async function listarVotos(enqueteId) {
  const values = []; let filtro = '';
  if (enqueteId !== undefined) {
    const id = Number(enqueteId);
    if (!Number.isInteger(id) || id <= 0) throw new AppError('enquete_id deve ser um número inteiro positivo.');
    values.push(id); filtro = 'WHERE v.enquete_id = $1';
  }
  const sql = 'SELECT v.id, v.enquete_id, e.titulo AS enquete_titulo, v.opcao_enquete_id, oe.descricao AS opcao_descricao, oe.horario_inicio, oe.horario_fim, v.usuario_id, u.nome AS usuario_nome, v.data_criacao FROM votos v INNER JOIN enquetes e ON e.id = v.enquete_id INNER JOIN opcoes_enquete oe ON oe.id = v.opcao_enquete_id INNER JOIN usuarios u ON u.id = v.usuario_id ' + filtro + ' ORDER BY v.data_criacao DESC';
  return (await pool.query(sql, values)).rows;
}
async function criarVoto(dados) {
  const { enquete_id, opcao_enquete_id, usuario_id } = validarIds(dados);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const opcao = await client.query('SELECT oe.id FROM opcoes_enquete oe INNER JOIN enquetes e ON e.id = oe.enquete_id WHERE oe.id = $1 AND oe.enquete_id = $2 AND e.status = $3 AND (e.data_fim IS NULL OR e.data_fim > CURRENT_TIMESTAMP) FOR SHARE', [opcao_enquete_id, enquete_id, 'ativa']);
    if (opcao.rows.length === 0) throw new AppError('A opção não pertence a uma enquete ativa.', 422);
    const usuario = await client.query('SELECT id FROM usuarios WHERE id = $1 FOR SHARE', [usuario_id]);
    if (usuario.rows.length === 0) throw new AppError('Usuário não encontrado.', 404);
    const voto = await client.query('INSERT INTO votos (enquete_id, opcao_enquete_id, usuario_id) VALUES ($1, $2, $3) RETURNING id, enquete_id, opcao_enquete_id, usuario_id, data_criacao', [enquete_id, opcao_enquete_id, usuario_id]);
    await client.query('COMMIT'); return voto.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.code === '23505') throw new AppError('Este usuário já votou nesta enquete.', 409);
    throw error;
  } finally { client.release(); }
}

async function buscarVoto(id) {
  const votoId = Number(id);
  if (!Number.isInteger(votoId) || votoId <= 0) throw new AppError('id deve ser um número inteiro positivo.');
  const { rows } = await pool.query(
    'SELECT id, enquete_id, opcao_enquete_id, usuario_id, data_criacao FROM votos WHERE id = $1',
    [votoId]
  );
  if (rows.length === 0) throw new AppError('Voto não encontrado.', 404);
  return rows[0];
}

async function atualizarVoto(id, dados) {
  const votoAtual = await buscarVoto(id);
  const opcao_enquete_id = Number(dados.opcao_enquete_id);
  if (!Number.isInteger(opcao_enquete_id) || opcao_enquete_id <= 0) {
    throw new AppError('opcao_enquete_id deve ser um número inteiro positivo.');
  }
  const { rows: opcoes } = await pool.query(
    'SELECT oe.id FROM opcoes_enquete oe INNER JOIN enquetes e ON e.id = oe.enquete_id WHERE oe.id = $1 AND oe.enquete_id = $2 AND e.status = $3',
    [opcao_enquete_id, votoAtual.enquete_id, 'ativa']
  );
  if (opcoes.length === 0) throw new AppError('A opção não pertence a uma enquete ativa.', 422);
  const { rows } = await pool.query(
    'UPDATE votos SET opcao_enquete_id = $1 WHERE id = $2 RETURNING id, enquete_id, opcao_enquete_id, usuario_id, data_criacao',
    [opcao_enquete_id, votoAtual.id]
  );
  return rows[0];
}

async function excluirVoto(id) {
  const voto = await buscarVoto(id);
  await pool.query('DELETE FROM votos WHERE id = $1', [voto.id]);
}

module.exports = { listarVotos, buscarVoto, criarVoto, atualizarVoto, excluirVoto };
