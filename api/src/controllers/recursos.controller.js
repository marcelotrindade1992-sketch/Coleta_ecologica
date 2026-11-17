const service = require('../services/recursos.service');
function responder(operacao) {
  return async (request, response, next) => {
    try { response.status(200).json(await operacao(request)); } catch (error) { next(error); }
  };
}
module.exports = {
  listarRegioes: responder(() => service.listarRegioes()),
  listarHorarios: responder((request) => service.listarHorarios(request.query.regiao_id)),
  listarEnquetes: responder((request) => service.listarEnquetes(request.query.status)),
  listarOpcoes: responder((request) => service.listarOpcoes(request.params.enqueteId))
};
