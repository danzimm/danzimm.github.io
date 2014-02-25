var DancingText = (function() {
	var that = {},
        createWaveCharacter = function(letter) {
        var that = {};
		that.letter = letter;
		that.size = "100%";
		that.html = function() {
			return "<span class=\"dancingcharacter\" style=\"font-size: " + this.size + "\">" + this.letter + "</span>";
		};
        return that;
	};
	that.dancetext = function(elm) {
		var characters = [],
		    index = 0,
		    newinner = "",
		    inner = elm.innerHTML,
	        index = -1, i, timeoutfunc;

		for (i = 0; i < inner.length; i++) {
			characters.push(createWaveCharacter(inner.charAt(i)));
		}
		elm.innerHTML = characters.map(function(e) {
            return e.html();
        }).join("");
		timeoutfunc = function(childs) {
			childs.objectAtIndex(index - 1).style.fontSize = "100%";
			childs.objectAtIndex(index).style.fontSize = "100%";
			childs.objectAtIndex(index + 1).style.fontSize = "100%";
	        oldindex = index;
	        while (index == oldindex)
			    index = ZimmUtil.getRandomInt(0, characters.length - 1);
	        if (index > 0)
			    childs.objectAtIndex(index - 1).style.fontSize = "120%";
			childs.objectAtIndex(index).style.fontSize = "150%";
			if (index < childs.length - 1)
	            childs.objectAtIndex(index + 1).style.fontSize = "120%";
			setTimeout(timeoutfunc, 700, childs);
		}
		setTimeout(timeoutfunc, 10, elm.children);
	};
	that.dance = function() {
		var elms = document.getElementsByClassName("dancingtext");
		ZimmUtil.addCSSRule(".dancingcharacter", "transition: all 500ms; -webkit-transition: all 500ms;", 1);
		for (var i = 0; i < elms.length; i++) {
            this.dancetext(elms[i]);
		}
	};
	return that;
}());
