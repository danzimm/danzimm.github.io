
var SVGHelpers = (function() {
  var that = {};
  
  that.animatePath = function(path, options) {
    options = options || {};

    var duration = options.duration || '2s';
    var curve = options.curve || 'ease-in-out';
    var length = path.getTotalLength();

    path.style.transition = path.style.WebkitTransition = 'none';
    path.style.strokeDasharray = length + ' ' + length;
    path.style.strokeDashoffset = length;
    path.getBoundingClientRect();
    path.style.transition = path.style.WebkitTransition = 'stroke-dashoffset ' + duration + ' ' + curve;
    path.style.strokeDashoffset = '0';
    return ANIHelper.enQ(duration);
  };

  return that;
})();
