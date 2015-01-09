
window.onload = function() {
  setTimeout(function() {
    var elms = document.querySelectorAll('#circle svg path'), i;
    for (i = 0; i < elms.length; i++) {
      elms[i].style.strokeOpacity = '1';
      SVGHelpers.animatePath(elms[i], {
        duration: '1s' 
      }).then(function() {
        document.querySelector('#content h1').classList.add('opaque');
      });
    }
  }, 1000);
};

