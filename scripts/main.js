
window.onload = function() {
  setTimeout(function() {
    var elms = document.querySelectorAll('#circle svg path');
    Z.enQ(Z.iterative(elms.length, function(i, cb) {
      elms[i].style.strokeOpacity = '1';
      SVGHelpers.animatePath(elms[i], {
        duration: '1s'
      }).then(cb);
    })).then(function(cb) {
      document.querySelector('#content h1').classList.add('opaque');
      var ellms = document.querySelectorAll('#content .navcontainer .navigation ul li');
      Z.iterative(ellms.length, function(i, acb) {
        ellms[i].classList.add('showing');
        acb();
      })(cb);
    });
  }, 1000);
};

