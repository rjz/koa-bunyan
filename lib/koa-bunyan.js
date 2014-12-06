'use strict';

module.exports = function (logger, opts) {
  opts = opts || {};

  var defaultLevel = opts.level || 'info';
  var requestTimeLevel = opts.timeLimit;

  return function * (next) {
    var requestTime, localLevel;
    var startTime = Date.now();
    var ctx = this;

    logger[defaultLevel]({
      method: ctx.method,
      url: ctx.url
    }, '[REQ]');

    yield next;

    requestTime = Date.now() - startTime;
    localLevel = defaultLevel;

    if (requestTimeLevel && requestTime > requestTimeLevel) {
      localLevel = 'warn';
    }
    logger[localLevel]({
      method: ctx.method,
      url: ctx.originalUrl,
      status: ctx.status,
      dt: requestTime
    }, '[RES]');
  };
};

