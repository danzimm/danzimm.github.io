function WaveCharacter(let) {
	this.letter = let;
	this.size = "100%";
	this.html = function() {
		return "<span class=\"wavingcharacter\" style=\"font-size: " + this.size + "\">" + this.letter + "</span>";
	}
}
function htmlFromWaveCharacterArray(arr) {
	var ret = "";
	arr.forEach(function(wavechar, index, array) {
		ret += wavechar.html();
	});
	return ret;
}
function oai(index) {
	if (index < 0) {
		index = this.length + index;
	} else if (index >= this.length) {
		index = this.length % index;
	}
	return this[index];
};
Array.prototype.objectAtIndex = oai;
NodeList.prototype.objectAtIndex = oai;
HTMLCollection.prototype.objectAtIndex = oai;
NodeList.prototype.forEach = function(func) {
	for (i = 0; i < this.length; i++) {
		func(this[i], i, this);
	}
};
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// meow why are you looking at my source code
function wavetext(elm) {
	var characters = [];
	var index = 0;
	var newinner = "";
	var inner = elm.innerHTML;
	var index = -1;
	for (i = 0; i < inner.length; i++) {
		characters[i] = new WaveCharacter(inner.charAt(i));
	}
	elm.innerHTML = htmlFromWaveCharacterArray(characters);
	children = elm.children;			
	var timeoutfunc = function() {
		children.objectAtIndex(index - 1).style.fontSize = "100%";
		children.objectAtIndex(index).style.fontSize = "100%";
		children.objectAtIndex(index + 1).style.fontSize = "100%";
        oldindex = index;
        while (index == oldindex)
		    index = getRandomInt(0, characters.length - 1);
        if (index > 0)
		    children.objectAtIndex(index - 1).style.fontSize = "120%";
		children.objectAtIndex(index).style.fontSize = "150%";
		if (index < children.length - 1)
            children.objectAtIndex(index + 1).style.fontSize = "120%";
		setTimeout(timeoutfunc, 700);
	}
	setTimeout(timeoutfunc, 10);
}
function start_wavingtext() {
	elms = document.getElementsByClassName("wavingtext");
	elms.forEach(function(element, index, array) {
		wavetext(element);
	});
}
var showingMenu = false;
var isToggling = false;
function toggleMenu() {
	if (isToggling) {
		return;
	} else {
		isToggling = true;
	}
	var men = document.getElementById("menu");
	var contain = document.getElementById("container");
	if (showingMenu) {
		showingMenu = false;
		contain.style.marginLeft = "0";
		contain.style.width = "100%";
	} else {
		showingMenu = true;
		contain.style.marginLeft = men.offsetWidth;
		contain.style.width = (contain.offsetWidth - men.offsetWidth).toString() + "px";
	}
	setTimeout(function() {
		isToggling = false;
	}, 300);
}
function showHashDiv(animate) {
	var newhash = location.hash;
	if (newhash != "") {
		newhash = newhash.substring(1);
		var li = document.getElementById("li" + newhash);
		var shower = document.getElementById(newhash);
		if (shower) {
			if (document.documentElement.clientWidth > 575)
				shower.style.top = "12.5%";
			else
				shower.style.top = "0%";
			shower.style.position = "relative";
			shower.style.opacity = "1";
		}
		if (li) {
			li.classList.add("menuselected");
		}
	}
}
function updateWindowSize(size) {
	if (size > 575) {
		setTimeout(function() {
			document.getElementById("container").style.marginLeft = "5%";
			document.getElementById("container").style.width = (document.getElementById("container").offsetWidth - .05 * document.getElementById("container").offsetWidth) + "px";
			setTimeout(function() {
				document.getElementById("container").style.marginLeft = "0";
				document.getElementById("container").style.width = "100%";
			}, 400);
		}, 500);
		document.getElementById("container").onmousemove = function(event) {
			if (!showingMenu) {
				if (event.clientX <= document.getElementById("menu").offsetWidth) {
					toggleMenu();
				}
			} else {
				toggleMenu();
			}
		};
	} else {
		document.getElementById("container").onmousemove = null;
	}
}
function tr(input, str1, str2) {
	output = "";
	for (i = 0; i < input.length; i++) {
		inde = str1.indexOf(input[i]);
		output += str2[inde];
	}
	return output;
}
window.onload = function() {
	start_wavingtext();
	if (document.documentElement.clientWidth > 575) {
		
	}
	window.onresize = function(ev) {
		updateWindowSize(document.documentElement.clientWidth);
		if (document.documentElement.clientWidth > 575) {
			
		} else {
		}
	};
	updateWindowSize(document.documentElement.clientWidth);
	document.getElementById("mobileaddy").onclick = function(ev) {
		em = tr("wmg'%jx='qq%yqmgzq%xocq", "meow%~+*'lkjqgcrtyui_p<>?=zx", "abcdefghijklmnopqrstuvwxyz@.");
		window.location.href = "mailto:" + em;
	};
	window.onhashchange = function(event) {
		var splt = event.oldURL.split('#');
		if (splt.length == 2) {
			var oldhash = splt[1];
			var hider = document.getElementById(oldhash);
			if (hider) {
				hider.style.opacity = "0";
				hider.style.top = "-100%";
				hider.style.position = "absolute";
				setTimeout(function(h) {
				}, 300, hider);
			}
		}
		showHashDiv();
	};
	if (location.hash != "#tech" && location.hash != "#about" && location.hash != "#academics" && location.hash != "#miscellaneous") {
		location.hash = "#tech";
	} else {
		showHashDiv();
	}
	var men = document.getElementById("menu");
	var meni = men.getElementsByTagName("li");
	for (i = 0; i < meni.length; i++) {
		meni[i].onclick = function(event) {
			mensel = document.getElementsByClassName("menuselected");
			for (i = 0; i<mensel.length; i++) {
				mensel[i].classList.remove("menuselected");
			}
			window.location.hash = "#" + event.target.innerHTML.toLowerCase().replace("\n","");
		}
	}
	function selectText(element) {
	    var doc = document;
	    var text = doc.getElementById(element);    

	    if (doc.body.createTextRange) { // ms
	        var range = doc.body.createTextRange();
	        range.moveToElementText(text);
	        range.select();
	    } else if (window.getSelection) { // moz, opera, webkit
	        var selection = window.getSelection();            
	        var range = doc.createRange();
	        range.selectNodeContents(text);
	        selection.removeAllRanges();
	        selection.addRange(range);
	    }
	}
    document.getElementById("emailaddy").onclick = function(ev) {
        selectText("emailaddy");
    }
}
