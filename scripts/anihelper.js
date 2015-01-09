
var ANIHelper = (function() {
  var that = {};
  function convertPlainTextDurationToMS(plain) {
    var matches;
    if ((matches = /([0-9]+)s/.exec(plain)) != null) {
      matches.slice(1);
      return Math.floor(parseFloat(matches[0]) * 1000);
    }
    if ((matches = /([0-9]+)ms/.exec(plain)) != null) {
      matches.slice(1);
      return Math.floor(parseFloat(matches[0]));
    }
    return -1;
  }
  that.createCallback = function(after, cb, thisArg, args) {
    thisArg = thisArg || null;
    args = args || null;
    var delay = 0;
    if (typeof after === 'string') {
      delay = convertPlainTextDurationToMS(after);
      if (delay === -1) {
        delay = parseInt(delay);
      }
    } else {
      delay = after;
    }
    setTimeout(cb, delay, thisArg, args);
  };
  that.enQ = function(cborstr) {
    var queue = {};
    var cbs = [];
    function proceed() {
      if (cbs.length == 0) {
        return;
      }
      arguments[arguments.length] = proceed;
      var cb = cbs[0];
      cbs.slice(1);
      cb.apply(queue, arguments);
    };
    queue.push = queue.then = function(cb) {
      cbs.push(cb);
    };
    var cb;
    if (typeof cborstr == 'string') {
      cb = function(acb) {
        ANIHelper.createCallback(cborstr, acb);
      };
    } else {
      cb = cborstr;
    }
    cb(proceed);
    return queue;
  };
  return that;
})();

