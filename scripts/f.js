
var F = (function() {
  var that = {};
  that.takeUntil = function(cont, x) {
    var slicer = undefined;
    if (Array.isArray(cont)) {
      slicer = "slice";
    } else if (typeof cont === "string") {
      slicer = "substr";
    } else { // TODO: add support for functions
      return cont;
    }
    var idx = cont.indexOf(x);
    if (idx !== -1) {
      return cont[slicer](0, idx);
    } else {
      return cont;
    }
  };
  that.compose = function(f, g, thisArg) {
    return function() {
      return f(g.apply(thisArg !== undefined ? thisArg : this, arguments));
    }
  };
  that.partialApply = function(f, x) {
    return function() {
      return f.apply(this, [x].concat(Array.prototype.slice.call(arguments)));
    };
  };
  that.curry = function(f, i) {
    if (i === undefined)
      return that.curry(f, f.length);
    if (i <= 1) {
      return f;
    }
    return function(x) {
      return that.curry(that.partialApply(f, x), i-1);
    };
  };
  that.id = function(x) {
    return x;
  };
  that.const = function(x) {
    return function() {
      return x;
    };
  };
  that.flip = function(f) {
    return (x, y) => {
      return f(y, x);
    };
  };
  that.plus = function(a, b) {
    return a + b;
  };
  that.minus = function(a, b) {
    return a - b;
  };
  that.times = function(a, b) {
    return a * b;
  };
  that.divide = function(a, b) {
    return a / b;
  };

  that.cons = (x, xs) => {
    return [x].concat(xs);
  };
  that.concat = (xs, ys) => {
    return [].concat.apply(xs, ys);
  };
  that.flatten = (xs) => {
    F.ListMonad.join(xs);
  };

  that.Functor = function(fmap) {
    this.fmap = fmap;
  };
  that.Monad = function(ret, bind) {
    this.ret = ret;
    this.bind = bind;
  };
  that.Monad.prototype.fmap = function(f, ma) {
    return this.bind(ma, F.compose(this.ret, f));
  };
  that.Monad.prototype.join = function(mma) {
    return this.bind(mma, F.id);
  };
  that.Applicative = function(pure, apply) {
    this.pure = pure;
    this.apply = apply;
  };
  that.Applicative.prototype.fmap = function(f, fa) {
    return this.apply(this.pure(f), fa);
  };
  // It's hard to actually do functonal things here because you
  // can't really embed your own type system since there isn't
  // really a type system in the first place...
  //
  // Dunno if any of this works, just wrote it cuz seemed fun
  // and was good practice.
  
  that.FunctionMonad = new that.Monad(that.const, function(ma, comp) {
    return function(r) {
      return comp(ma(r))(r);
    };
  });
  that.ListMonad = new that.Monad(that.curry(that.flip(that.cons))([]), function(ma, comp) {
    return ma.map(comp).reduce(F.concat);
  });

  return that;
})();

