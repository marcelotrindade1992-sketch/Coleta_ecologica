const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const AppError = require('../errors/AppError');

async function criarUsuario(dados) {
  const nome = String(dados.nome || '').trim();
  const email = String(dados.email || '').trim().toLowerCase();
  const senha = String(dados.senha || '');
  if (!nome || !email || !senha) throw new AppError('nome, email e senha são obrigatórios.');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new AppError('email inválido.');
  if (senha.length < 6) throw new AppError('senha deve ter pelo menos 6 caracteres.');
  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    const { rows } = await pool.query(
      'INSERT INTO usuarios (nome, email, senha_hash, perfil) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, perfil, data_criacao',
      [nome, email, senhaHash, 'morador']
    );
    return rows[0];
  } catch (error) {
    if (error.code === '23505') throw new AppError('Já existe um cadastro com este e-mail.', 409);
    throw error;
  }
}

module.exports = { criarUsuario };
