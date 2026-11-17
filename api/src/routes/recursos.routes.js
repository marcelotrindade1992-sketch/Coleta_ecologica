const { Router } = require('express');
const controller = require('../controllers/recursos.controller');
const routes = Router();
routes.get('/regioes', controller.listarRegioes);
routes.get('/horarios-coleta', controller.listarHorarios);
routes.get('/enquetes', controller.listarEnquetes);
routes.get('/enquetes/:enqueteId/opcoes', controller.listarOpcoes);
module.exports = routes;
