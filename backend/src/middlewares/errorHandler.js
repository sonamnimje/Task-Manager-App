const AppError = require("../utils/AppError");
const { sendError } = require("../utils/apiResponse");

function notFoundHandler(req, res) {
  return sendError(res, 404, "Route not found");
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  // Handles malformed JSON payloads from express.json().
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return sendError(res, 400, "Invalid JSON request body");
  }

  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.message, err.details);
  }

  return sendError(res, 500, "Internal server error");
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
