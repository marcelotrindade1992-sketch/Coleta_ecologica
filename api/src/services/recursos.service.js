const pool = require('../config/database');
const AppError = require('../errors/AppError');

function idOpcional(valor, campo) {
  if (valor === undefined) return undefined;
  const id = Number(valor);
  if (!Number.isInteger(id) || id <= 0) throw new AppError(campo + ' deve ser um número inteiro positivo.');
  return id;
}

async function listarRegioes() {
  return (await pool.query('SELECT id, nome, cidade, estado FROM regioes WHERE ativo = TRUE ORDER BY cidade, nome')).rows;
}

async function listarHorarios(regiaoId) {
  const id = idOpcional(regiaoId, 'regiao_id');
  const resultado = await pool.query(
    'SELECT h.id, h.regiao_id, r.nome AS regiao_nome, h.tipo_coleta, h.dia_semana, h.horario_inicio FROM horarios_coleta h INNER JOIN regioes r ON r.id = h.regiao_id WHERE h.ativo = TRUE ' + (id ? 'AND h.regiao_id = $1 ' : '') + 'ORDER BY h.dia_semana, h.horario_inicio',
    id ? [id] : []
  );
  return resultado.rows;
}

async function listarEnquetes(status) {
  const permitido = ['rascunho', 'ativa', 'encerrada'];
  if (status !== undefined && !permitido.includes(status)) throw new AppError('status inválido.');
  const resultado = await pool.query(
    'SELECT e.id, e.regiao_id, r.nome AS regiao_nome, e.titulo, e.descricao, e.data_inicio, e.data_fim, e.status FROM enquetes e INNER JOIN regioes r ON r.id = e.regiao_id ' + (status ? 'WHERE e.status = $1 ' : '') + 'ORDER BY e.data_inicio DESC',
    status ? [status] : []
  );
  return resultado.rows;
}

async function listarOpcoes(enqueteId) {
  const id = idOpcional(enqueteId, 'enquete_id');
  return (await pool.query('SELECT id, enquete_id, descricao, horario_inicio, horario_fim, ordem_exibicao FROM opcoes_enquete WHERE enquete_id = $1 ORDER BY ordem_exibicao', [id])).rows;
}

module.exports = { listarRegioes, listarHorarios, listarEnquetes, listarOpcoes };
