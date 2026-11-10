const { Router } = require('express');
const controller = require('../controllers/votos.controller');
const routes = Router();
routes.get('/', controller.listar);
routes.post('/', controller.criar);
module.exports = routes;
