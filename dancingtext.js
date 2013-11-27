var DancingText = (function() {
	var module = {};
	module.WaveCharacter = function(letter) {
			this.letter = let;
		this.size = "100%";
		this.html = function() {
			return "<span class=\"dancingcharacter\" style=\"font-size: " + this.size + "\">" + this.letter + "</span>";
		}
	};
	module.htmlFromWaveCharacterArray = function(arr) {
		var ret = "";
		arr.forEach(function(wavechar, index, array) {
			ret += wavechar.html();
		});
		return ret;
	};
	module.addCSSRule = function(selector, rules, index) {
		sheet = document.styleSheets[0];
		if(sheet.insertRule) {
			sheet.insertRule(selector + "{" + rules + "}", index);
		} else {
			sheet.addRule(selector, rules, index);
		}
	};
	module.getRandomInt = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	module.dancetext = function(elm) {
		var characters = [];
		var index = 0;
		var newinner = "";
		var inner = elm.innerHTML;
		var index = -1;
		for (i = 0; i < inner.length; i++) {
			characters[i] = new this.WaveCharacter(inner.charAt(i));
		}
		elm.innerHTML = this.htmlFromWaveCharacterArray(characters);
		children = elm.children;			
		var timeoutfunc = function() {
			children.objectAtIndex(index - 1).style.fontSize = "100%";
			children.objectAtIndex(index).style.fontSize = "100%";
			children.objectAtIndex(index + 1).style.fontSize = "100%";
	        oldindex = index;
	        while (index == oldindex)
			    index = this.getRandomInt(0, characters.length - 1);
	        if (index > 0)
			    children.objectAtIndex(index - 1).style.fontSize = "120%";
			children.objectAtIndex(index).style.fontSize = "150%";
			if (index < children.length - 1)
	            children.objectAtIndex(index + 1).style.fontSize = "120%";
			setTimeout(timeoutfunc, 700);
		}
		setTimeout(timeoutfunc, 10);
	};
	module.dance = function() {
		this.addCSSRule(".dancingcharacter", "transition: all 500ms; -webkit-transition: all 500ms;", 1);
		elms = document.getElementsByClassName("dancingtext");
		for (i = 0; i < elms.length; i++) {
			this.dancetext(elms[i]);
		}
	};
	return module;
}());