
var F = (function() {
  var that = {};
  function conformedIterable(iter) {
    if (typeof iter === 'string') {
      iter = iter.split("");
      iter.__depackage__ = function() {
        return this.join("");
      };
    } else {
      if (!iter.__depackage__) {
        iter.__depackage__ = function() {
          return this;
        }
      }
    }
    return iter;
  }
  that.takeUntil = function(iter, f) { // iter must have length and either push or a constructor that takes an array
    if (typeof f === 'string') {
      var str = f;
      f = (x) => {
        if (str.indexOf(x) !== -1) {
          return true;
        }
        return false;
      };
    }
    iter = conformedIterable(iter);
    let proto = Object.getPrototypeOf(iter);
    if (proto.hasOwnProperty("push")) {
      let ret = new iter.constructor;
      ret.__depackage__ = iter.__depackage__;
      for (let i = 0; i < iter.length; i++) {
        let item = iter[i];
        if (!f(item, i)) {
          ret.push(item);
        } else {
          break;
        }
      }
      return ret.__depackage__();
    } else {
      let arr = [];
      for (var item of iter) {
        if (!f(item, i)) {
          i++;
          arr.push(item);
        } else {
          break;
        }
      }
      return new iter.constructor(arr);
    }
  };
  // look above for properties needed on iter
  that.takeWhile = function(iter, f) {
    return that.takeUntil(iter, that.compose(that.not, f));
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
  that.not = x => !x;

  that.cons = (x, xs) => {
    return [x].concat(xs);
  };
  that.concat = (xs, ys) => {
    return [].concat.apply(xs, ys);
  };
  that.flatten = (xs) => {
    return F.ListMonad.join(xs);
  };
  that.foldLeft = (xs, acc, f) => {
    if (xs.length === 0)
      return acc;
    return that.foldLeft(xs.slice(1), f(acc, xs[0]), f);
  };
  that.equal = (obj) => {
    return x => x === obj;
  };
  that.similar = (obj) => {
    return x => x == obj;
  };
  that.property = (name) => {
    return (x) => {
      return x[name];
    };
  };
  that.if = (f, t, e) => {
    return (x) => {
      if (f(x)) {
        if (t !== undefined)
          return t(x);
      } else {
        if (e !== undefined)
          return e(x);
      }
    };
  };
  that.return = (obj) => {
    return () => obj;
  };
  that.sequence = (f, g) => {
    return (x) => {
      f(x);
      return g(x);
    };
  };
  that.sequenced = (f) => {
    let funcs = f !== undefined ? [f] : [];
    let g = x => that.foldLeft(funcs, undefined, (r, f) => f(x) );
    g.then = that.compose(that.return(g), funcs.push.bind(funcs));
    return g;
  };
  
  // {{{ Functional Stuffs
  that.Functor = function(fmap) {
    this.fmap = fmap;
  };
  that.Monad = function(ret, bind) {
    this.ret = ret;
    this.bind = bind;
  };
  that.Monad.prototype.fmap = function(f, ma) {
    return this.bind(ma, that.compose(this.ret, f));
  };
  that.Monad.prototype.join = function(mma) {
    return this.bind(mma, that.id);
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
  // }}}

  return that;
})();

