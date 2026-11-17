const service = require('../services/votos.service');
async function listar(request, response, next) { try { response.status(200).json(await service.listarVotos(request.query.enquete_id)); } catch (error) { next(error); } }
async function criar(request, response, next) { try { response.status(201).json(await service.criarVoto(request.body)); } catch (error) { next(error); } }
async function buscar(request, response, next) { try { response.status(200).json(await service.buscarVoto(request.params.id)); } catch (error) { next(error); } }
async function atualizar(request, response, next) { try { response.status(200).json(await service.atualizarVoto(request.params.id, request.body)); } catch (error) { next(error); } }
async function excluir(request, response, next) { try { await service.excluirVoto(request.params.id); response.status(204).send(); } catch (error) { next(error); } }
module.exports = { listar, buscar, criar, atualizar, excluir };
