function errorHandler(error, request, response, next) {
  const status = error.statusCode || 500;
  if (status === 500) console.error(error);
  response.status(status).json({ error: error.statusCode ? error.message : 'Erro interno do servidor.' });
}
module.exports = errorHandler;
