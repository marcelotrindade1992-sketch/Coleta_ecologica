const service = require('../services/votos.service');
async function listar(request, response, next) { try { response.status(200).json(await service.listarVotos(request.query.enquete_id)); } catch (error) { next(error); } }
async function criar(request, response, next) { try { response.status(201).json(await service.criarVoto(request.body)); } catch (error) { next(error); } }
module.exports = { listar, criar };
