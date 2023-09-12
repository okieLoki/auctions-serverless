const middy = require("@middy/core");
const httpJsonBodyParser = require("@middy/http-json-body-parser");
const httpEventNormaliser = require("@middy/http-event-normalizer");
const httpErrorHandler = require("@middy/http-error-handler");

function createMiddlewareWrappedHandler(handlerFunction) {
  return middy(handlerFunction).use([
    httpErrorHandler(),
    httpEventNormaliser(),
    httpJsonBodyParser(),
  ]);
}

module.exports = createMiddlewareWrappedHandler;