
var Z = (function() {
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
  that.createCallback = function(after, cb) {
    var delay = 0;
    if (typeof after === 'string') {
      delay = convertPlainTextDurationToMS(after);
      if (delay === -1) {
        delay = parseInt(delay);
      }
    } else {
      delay = after;
    }
    setTimeout(cb, delay);
  };
  that.iterative = function(n, func) {
    var cbs = [];
    var i = 0;
    for (i = 0; i < n; i++) {
      var j = i;
      (function(j) {
        cbs.push(function(acb) {
          func.apply(this, [j, acb]); 
        });
      })(i);
    }
    return Z.concurrent.apply(this, cbs);
  };
  that.concurrent = function() {
    var args = arguments;
    var len = args.length;
    return function(cb) {
      var i;
      var j = 0;
      function localCB() {
        j++;
        if (j == len) {
          cb();
        }
      } // TODO: concat args passed in here
      for (i = 0; i < len; i++) {
        args[i](localCB);
      }
    };
  };
  that.enQ = function(cborstr) {
    var queue = {};
    var cbs = [];
    function proceed() {
      if (cbs.length == 0) {
        return;
      }
      var args = Array.prototype.slice.call(arguments);
      var acb = cbs[0];
      args.push(proceed);
      cbs = cbs.slice(1);
      acb.apply(queue, args);
    };
    queue.push = queue.then = function(acb) {
      cbs.push(acb);
    };
    var cb;
    if (typeof cborstr == 'string') {
      cb = function(acb) {
        Z.createCallback(cborstr, acb);
      };
    } else {
      cb = cborstr;
    }
    cb(proceed);
    return queue;
  };
  return that;
})();

