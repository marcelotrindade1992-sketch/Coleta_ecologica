const { Router } = require('express');
const controller = require('../controllers/votos.controller');
const routes = Router();
routes.get('/', controller.listar);
routes.post('/', controller.criar);
routes.get('/:id', controller.buscar);
routes.put('/:id', controller.atualizar);
routes.delete('/:id', controller.excluir);
module.exports = routes;
