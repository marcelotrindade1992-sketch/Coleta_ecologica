const { Router } = require('express');
const controller = require('../controllers/usuarios.controller');
const routes = Router();
routes.post('/', controller.criar);
module.exports = routes;
