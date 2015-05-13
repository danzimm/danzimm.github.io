
window.onload = function() {

  // {{{initialize variables
  var selected = 1000;
  var transitioning = false;

  var header = document.querySelector('section header h1');
  var menuItems = [].slice.call(document.querySelectorAll('nav ul li')), i;
  var nav = document.querySelector('nav');
  var frontPageItems = menuItems.concat(header);

  var article = document.querySelector('article');

  var transitionDuration = Z.convertPlainTextDurationToMS(F.takeUntil(window.getComputedStyle(frontPageItems[0])['transitionDuration'], ','));
  var articleTransitionDuration = Z.convertPlainTextDurationToMS(F.takeUntil(window.getComputedStyle(article)['transitionDuration'], ','));
  // }}}

  // {{{sections texts
  var sections = [];
  sections.push(`I currently have undergraduate in both physics and mathematics. It should be known that my physics degree is techinically 'Theoretical Physics and Applied
 Mathematics,' so that means if you want an experiment done don't ask me! I have partial graduate training in Mathematics, specifically in the fields of PDEs and Calculus of
Variations (to give a preview of my knowledge base, I'm familiar with the base ideas in measure theory and functional analysis. I'm also familiar with all the basic theorems
 of Calculus of Variations, e.g. The du Bois-Reymond lemma etc. and Sobolev Spaces as well as the notion of weak solutions). I am self taught in CS but am familiar with many 
topics that are taught in an undergrad CS program.`);

  sections.push(`As I'm sure many of the readers of this have realized (well, if I ever get a 'many' number of readers...), hobbies change from day to day, new ones are 
picked up and old ones thrown away, and maybe even an old one reintroduced! But what I can say is that I enjoy programming. I think it's become even more than a hobby for me,
 but I still categorize it as that since that's how it all started out (yes, I have had a job as a Software Engineer, that's why it's a bit weird to call programming simply a
 hobby. Anyways I'm particularly curious, nowadays, with functional programming. I'm looking at you haskell/scala/elm. I have yet to get into lisp yet, but I'm sure I will 
some day. I'm also curious about data science; 0xFEEDFACF and 0xDEADBEEF are useful.`);

  sections.push(`Stuff will be put here eventually... ¯\\_(ツ)_/¯`);
  // }}}

  // {{{hide and show functions
  function showArticle(j) {
    if (transitioning)
      return;
    var k = 0;
    if (selected === -1) { // I'm checking because all y'all hackers
      var text = "";
      selected = j;
      if (selected < sections.length) {
        text = sections[selected];
      }
      article.innerHTML = text;
      transitioning = true;
      Z.enQ(Z.iterative(frontPageItems, function(elem) {
        elem.classList.remove('showing');
      })).then(Z.delay(transitionDuration)).then(Z.iterative(frontPageItems, function(elem) {
        elem.classList.add('hidden');
      })).then(function() {
        nav.classList.add('hidden');
        article.classList.remove('hidden'); 
        article.classList.add('showing'); 
      }).then(Z.delay(articleTransitionDuration)).then(function() {
        transitioning = false;
      });
    }
  }

  function showMenu(cb) {
    if (transitioning)
      return;
    cb = typeof cb === 'function' ? cb : () => {};
    if (selected !== -1) {
      selected = -1;
      transitioning = true;
      nav.classList.remove('hidden');
      Z.enQ(function() {
        article.classList.remove('showing');
      }).then(Z.delay(articleTransitionDuration)).then(function() {
        article.classList.add('hidden');
      }).then(Z.iterative(frontPageItems, function(elem) {
        elem.classList.remove('hidden');
        elem.classList.add('showing');
      })).then(Z.delay(transitionDuration)).then(function() {
        article.innerHTML = "";
        transitioning = false;
      }).then(cb);
    }
  }

  // }}}
  
  // {{{initialize document
  
  if (document.body.clientWidth >= 600) {
    Z.enQ(Z.delay(1000)).then(Z.iterative(document.querySelectorAll('#circle path'), function(elm, cb) {
      elm.style.strokeOpacity = '1';
      SVGHelpers.animatePath(elm, { duration: '1s' }).then(cb);
    })).then(showMenu);
  } else {
    F.ListMonad.fmap((elm) => { elm.style.strokeOpacity = '1'; }, [].slice.call(document.querySelectorAll('#circle path')));
    F.ListMonad.fmap((elm) => { 
      elm.classList.add('transitionfree');
      elm.classList.remove('hidden');
      elm.classList.add('showing'); 
      elm.offsetHeight;
      elm.classList.remove('transitionfree');
    }, frontPageItems);
    selected = -1;
  }

  //}}}
  
  // {{{initialize click handlers

  Z.enQ(Z.iterative(menuItems.length, function(j) {
    menuItems[j].onclick = showArticle.bind(menuItems[j], j);
  }));
  document.querySelector('main').onclick = function(event) { event.stopPropagation(); };
  document.onclick = header.onclick = showMenu;

  // }}}
};

