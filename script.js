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
		var shower = document.getElementById(newhash);
		if (shower) {
			shower.style.top = "12.5%";
			shower.style.opacity = "1";
		}
	}
}
window.onload = function() {
	start_wavingtext();
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
	window.onhashchange = function(event) {
		var splt = event.oldURL.split('#');
		if (splt.length == 2) {
			var oldhash = splt[1];
			var hider = document.getElementById(oldhash);
			if (hider) {
				hider.style.opacity = "0";
				hider.style.top = "-100%";
				setTimeout(function(h) {
				}, 300, hider);
			}
		}
		showHashDiv();
	};
	if (location.hash == "") {
		location.hash = "#tech";
	} else {
		showHashDiv();
	}
	var men = document.getElementById("menu");
	var meni = men.getElementsByTagName("li");
	for (i = 0; i < meni.length; i++) {
		meni[i].onclick = function(event) {
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
