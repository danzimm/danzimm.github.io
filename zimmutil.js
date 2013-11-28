var ZimmUtil = (function() {
	var module = {};
	module.objectAtIndex = function(index) {
		if (index < 0) {
			index = this.length + index;
		} else if (index >= this.length) {
			index = this.length % index;
		}
		return this[index];
	};
	module.getRandomInt = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	module.tr = function(input, str1, str2) {
		output = "";
		for (i = 0; i < input.length; i++) {
			inde = str1.indexOf(input[i]);
			output += str2[inde];
		}
		return output;
	}
	module.addCSSRule = function(selector, rules, index) {
		sheet = document.styleSheets[0];
		if(sheet.insertRule) {
			sheet.insertRule(selector + "{" + rules + "}", index);
		} else {
			sheet.addRule(selector, rules, index);
		}
	};
	module.fullSite = function() {};
	module.mobileSite = function() {};
	module.fullSiteSize = 575;
	module.updateWindowSize = function(size) {
		if (size > this.fullSiteSize) {
			this.fullSite();
		} else {
			this.mobileSite();
		}
	};
	return module;
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
NodeList.prototype.forEach = function(func) {
	for (i = 0; i < this.length; i++) {
		func(this[i], i, this);
	}
};