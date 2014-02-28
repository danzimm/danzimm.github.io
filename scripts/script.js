
window.onload = function() {
    // initialization
    // {{{
	DancingText.dance();
	Plates.initialize("0em", "0em", "100%", "100%");
	Keys.start();
	var items = ["Io", "Interessi", "Blog", "Miscellaneo"],
	    menu = ZimmMenu.createMenu(items),
        plates = [], item, plat, elm, elmm, index = 0;
    menu.addToElement(document.getElementById("menucontainer"));
    window.menu = menu;

	document.body.style.width = "100%";
	document.body.style.height = "100%";
    
    // }}}
    
    // customization
    // {{{
	for (i in items) {
		item = items[i];

		plat = Plates.placePlate(item);
		plat.x = "10em";
		plat.y = "50%";
		plat.width = "calc(100% - 20em)";
		plat.height = "30em";
		plat.backgroundColor = "none";

		elm = plat.contentDiv;
		elmm = document.getElementById(item.toLowerCase());
		elm.appendChild(elmm);
		elmm.style.display = "block";

		plat.customStyle = (function(j) {
            return function(style) {
                var rotation = (4 - j) * 90,
                    sty = "rotate(" + rotation + "deg)";
                style.marginTop = "calc(-" + plat.height + " / 2)";
                style.mozTransform = sty;
                style.webkitTransform = sty;
                style.mosTransform = sty;
                style.oTransform = sty;
                style.transform = sty;
            };
        })(index);

		plat.update();
		plates.push(plat);
		index++;
	}
    
	menu.clickHandler = function(index) {
        var plat, i;
		for (i = 0; i < 4; i++) {
			plat = plates[i];
			plat.customStyle = (function(j) {
                return function(style) {
                    var rotation = (4 - j + index) * 90 + (360 * (ZimmUtil.getRandomInt(0,4) - 2)),
                        sty = "rotate(" + rotation + "deg)";
                    style.mozTransform = sty;
                    style.webkitTransform = sty;
                    style.mosTransform = sty;
                    style.oTransform = sty;
                    style.transform = sty;
                };
            })(i);
			plat.update();
		}
	};

	Keys.registerListener([104,106,107,108,37,38,39,40], true, function(key, shift, alt, meta, ctrl) {
		switch (key) {
			case 104:
			case 37:
			case 107:
			case 38:
                menu.previous();
				break;
			case 106:
			case 108:
			case 40:
			case 39:
                menu.next();
				break;
		};
	}, "movement");
    // }}}
    
    // color schemes
    // {{{
    var applyColorScheme = function(colorScheme) {
        document.body.style.backgroundColor = colorScheme.primary;
        ZimmUtil.addCSSRule("#menucontainer ul li:hover", "background-color: " + colorScheme.secondary);
        ZimmUtil.addCSSRule(".zimmlected", "background-color: " + colorScheme.darkPrimary);
        ZimmUtil.addCSSRule(".platecontent", "background-color: " + colorScheme.darkPrimary);
        ZimmUtil.addCSSRule("::selection", "background-color: " + colorScheme.secondary);
    };
    var colorSchemes = [
        {
            primary : "#C2727C",
            darkPrimary : "#9E5A63",
            secondary : "#72C2B8"
        },
        {
            primary : "#72C2B8",
            darkPrimary : "#5A9E95",
            secondary : "#C2727C"
        },
        {
            primary : "#3A92C8",
            darkPrimary : "#2F77A3",
            secondary : "#C8703A"
        },
        {
            primary : "#C8703A",
            darkPrimary : "#A35B2F",
            secondary : "#3A92C8"
        }
    ];
    var currentColorScheme = Cookies.get("colorscheme");
    if (currentColorScheme == "")
        currentColorScheme = 0;
    else
        currentColorScheme = parseInt(currentColorScheme);
    applyColorScheme(colorSchemes[currentColorScheme]);
    // }}}
    
    //matrix
    // {{{
    var matrixMode = false,
        matrixContainer,
        matrix,
        toggleMatrix = function() {
            var i, plat;
            matrixMode = !matrixMode;
            if (matrixMode) {
                for (i = 0; i < plates.length; i++) {
                    plat = plates[i];
                    plat.x = "calc(100% + 20em)";
                    plat.update();
                }
                document.getElementById("menucontainer").children[0].style.left = "-100%";
                var cont = document.createElement("div");
                cont.classList.add("matrixContainer");
                cont.style.position = "absolute";
                cont.style.top = cont.style.left = "0";
                cont.style.width = cont.style.height = "100%";
                //cont.style.backgroundColor = colorSchemes[currentColorScheme].primary;
                matrixContainer = cont;
                setTimeout(function() {
                    document.body.appendChild(matrixContainer);
                    Matrix.options.color = "#FFF";
                    Matrix.options.fontSize = 14;
                    Matrix.options.speed = 3;
                    Matrix.options.chance = 0.99;
                    Matrix.options.tailLength = 40;
                    var rtable = [];
                    for (j = 0; j < 10000; j++) {
                        rtable.push(Math.random());
                    }
                    Matrix.options.speedForColumn = function(c, t) {
                        return (10 * Math.pow(Math.sin(4 * Math.PI * c / Math.floor(t) ), 2) + 2 * rtable[c]);
                    };
                    matrix = Matrix.fly(cont);
                }, 500);
            } else {
                for (i = 0; i < plates.length; i++) {
                    plat = plates[i];
                    plat.x = "10em";
                    plat.update();
                }
                document.getElementById("menucontainer").children[0].style.left = "0";
                Matrix.land(matrix);
                document.body.removeChild(matrixContainer);
                matrixContainer = null;
            }
        };
    // }}}

    // cheats
    // {{{
    var cheatBack = function(nam) {
        currentColorScheme++;
        if (currentColorScheme == colorSchemes.length) {
            currentColorScheme = 0;
        }
        Cookies.set("colorscheme", currentColorScheme, 365);
        applyColorScheme(colorSchemes[currentColorScheme]);
    };
    Keys.registerCheatCode([38, 38, 40, 40, 37, 39, 37, 39, 66, 65], "cheat1", cheatBack);
    Keys.registerCheatCode([38, 38, 40, 40, 37, 39, 37, 39, 98, 97], "cheat2", cheatBack);
    Keys.registerCheatCode([77, 65, 84, 82, 73, 88], "cheat3", function() {
        toggleMatrix();
    });
    // }}}

    // blog
    // {{{
    var blog = ZimmBlog.createBlog("http://blog.danz.im/meta", "http://blog.danz.im/post/", "blog"),
        belm = blog.draw();
    belm.classList.add("textbloc");
    document.getElementById(items[2].toLowerCase()).appendChild(belm);
    blog.showPost(0);
	// }}}
    
    // initial hash
    // {{{
    if (location.hash && location.hash.length > 0) {
		var tst = items.indexOf(location.hash.substring(1));
		if (tst != -1) {
			menu.selectItemAtIndex(tst, true); // restrict for the first page
            return;
		}
	}
    menu.selectItemAtIndex(0); // don't restrict this one though
    // }}}
};
