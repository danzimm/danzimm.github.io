
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
  return that;
})();
