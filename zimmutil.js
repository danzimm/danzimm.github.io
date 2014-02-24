var ZimmUtil = (function() {
	var that = {};
	that.objectAtIndex = function(index) {
		if (index < 0) {
			index = this.length + index;
		} else if (index >= this.length) {
			index = this.length % index;
		}
		return this[index];
	};
	that.getRandomInt = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	that.tr = function(input, str1, str2) {
		var output = "", i, inde;
		for (i = 0; i < input.length; i++) {
			inde = str1.indexOf(input[i]);
			output += str2[inde];
		}
		return output;
	};
	that.addCSSRule = function(selector, rules, index) {
		var sheet = document.styleSheets[0];
        if (index === undefined || index === -1) {
            index = sheet.cssRules.length;
        }
		if (sheet.insertRule) {
			sheet.insertRule(selector + "{" + rules + "}", index);
		} else {
			sheet.addRule(selector, rules, index);
		}
	};
	that.fullSite = function() {};
	that.mobileSite = function() {};
	that.fullSiteSize = 575;
	that.updateWindowSize = function(size) {
		if (size > this.fullSiteSize) {
			this.fullSite();
		} else {
			this.mobileSite();
		}
	};
	return that;
}());

Object.defineProperty(Array.prototype, "objectAtIndex", {
	value : ZimmUtil.objectAtIndex
});
Object.defineProperty(NodeList.prototype, "objectAtIndex", {
	value : ZimmUtil.objectAtIndex
});
Object.defineProperty(HTMLCollection.prototype, "objectAtIndex", {
	value : ZimmUtil.objectAtIndex
});
Object.defineProperty(NodeList.prototype, "forEach", {
    value : function(func) {
        var i;
        for (i = 0; i < this.length; i++) {
            func(this[i], i, this);
        }
    }
});
