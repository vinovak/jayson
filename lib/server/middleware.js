var utils = require('../utils');

/**
 * Creates an Express compatible middleware bound to a Server
 *  @class Jayson JSON-RPC Middleware
 *  @param {Server} server Server instance
 *  @param {Object} [options] Options for this function
 *  @return {Function}
 *  @api public
 */
var Middleware = function(server, options) {
  return function(req, res, next) {
    var options = utils.merge(server.options, options || {});

    //  405 method not allowed if not POST
    if(req.method !== 'POST') {
      res.set('Allow', 'POST');
      res.status(405);
      return next();
    }

    // 415 unsupported media type if Content-Type is not correct
    if(!req.type('json')) {
      res.status(415);
      return next();
    }

    // body does not appear to be parsed, 500 server error
    if(!req.body || typeof(req.body) !== 'object') {
      res.status(400);
      return next();
    }

    server.call(req.body, function(error, success) {
      var response = error || success;

      utils.JSON.stringify(response, options, function(err, body) {
        if(err) return next(err);

        if(body) {

          res.set('Content-Type', 'application/json');
          res.send(body);
        
        } else {

          res.status(204);
        
        }

      });
    });

  };
};

module.exports = Middleware;
