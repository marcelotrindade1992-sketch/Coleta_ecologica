const service = require('../services/usuarios.service');
async function criar(request, response, next) {
  try { response.status(201).json(await service.criarUsuario(request.body)); } catch (error) { next(error); }
}
module.exports = { criar };
