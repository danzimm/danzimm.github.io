
var Z = (function() {
  var that = {};
  function convertPlainTextDurationToMS(plain) {
    var matches;
    if ((matches = /([0-9]+(?:\.[0-9]*)?)ms/.exec(plain)) != null) {
      matches.slice(1);
      return Math.floor(parseFloat(matches[0]));
    }
    if ((matches = /([0-9]+(?:\.[0-9]*)?)s?/.exec(plain)) != null) {
      matches.slice(1);
      return Math.floor(parseFloat(matches[0]) * 1000);
    }
    return 0;
  }
  that.convertPlainTextDurationToMS = convertPlainTextDurationToMS;
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
    var takesOneToTango = func.length === 1;
    var argFor, len;
    if (typeof n === "number") {
      len = n;
      argFor = takesOneToTango ? function(j, c) { return [j]; } : function(j, c) { return [j, c]; };
    } else { // assuming you're an array or smth
      len = n.length;
      argFor = takesOneToTango ? function(j, c) { return [n[j]]; } : function(j, c) { return [n[j], c]; };
    }
    var cbs = [];
    var i = 0;
    for (i = 0; i < len; i++) {
      (function(j) { // ahhhh i need es6
        cbs.push(function(acb) {
          func.apply(this, argFor(j, acb));
          if (takesOneToTango) {
            acb();
          }
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
        if (j === len) {
          cb();
        }
      } // TODO: concat args passed in here
      for (i = 0; i < len; i++) {
        setTimeout(args[i], 0, localCB);
      }
    };
  };
  that.delay = function(str) {
    return function(cb) {
      Z.createCallback(str, cb);
    };
  };
  that.enQ = function(cborstr) {
    var queue = {};
    var cbs = [];
    var running = false;
    function proceed() {
      running = false;
      if (cbs.length === 0) {
        return;
      }
      var args = Array.prototype.slice.call(arguments);
      var acb = cbs[0];
      cbs = cbs.slice(1);
      running = true;
      if (acb.length === 0) {
        setTimeout(function() { acb.apply(queue); proceed(); }, 0);
      } else {
        args.push(proceed);
        setTimeout(function() { acb.apply(queue, args); }, 0);
      }
    };
    queue.push = queue.then = function(acb) {
      if (cbs.length === 0 && !running) {
        if (acb.length === 0) { 
          setTimeout(function() { acb(); proceed(); }, 0);
        } else {
          setTimeout(acb, 0, proceed);
        }
      } else {
        cbs.push(acb);
      }
      return this;
    };
    queue.delay = function(str) {
      return this.push(Z.delay(str));
    };
    var cb;
    if (typeof cborstr == 'string') {
      cb = function(acb) {
        Z.createCallback(cborstr, acb);
      };
    } else if (typeof cborstr !== "undefined") {
      cb = cborstr;
    } else {
      cb = function(acb) { acb(); }
    }
    running = true;
    if (cb.length === 0) {
      setTimeout(function() { cb(); proceed(); }, 0);
    } else {
      setTimeout(cb, 0, proceed);
    }
    return queue;
  };
  that.empty = function() {};
  return that;
})();

