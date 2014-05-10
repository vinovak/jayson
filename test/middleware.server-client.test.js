var should = require('should');
var support = require('./support');
var common = support.common;
var jayson = require(__dirname + '/..');
var express = require('express');

describe('jayson middleware', function() {

  var server = express();

  var client = jayson.client.http({
    reviver: support.server.options.reviver,
    replacer: support.server.options.replacer,
    host: 'localhost',
    port: 3000
  });

  before(function(done) {
    server.use(express.json({reviver: support.server.options.reviver}));
    server.use(jayson.server(support.server.methods, support.server.options).middleware());
    server = server.listen(3000, done);
  });

  after(function() {
    server.close();
  });

  describe('common tests', common(client));

});
