var Plates = (function() {
	var that = {};
	var fetchStyle = function(elms) {
		var rulestoadd = [], retval = {};
		for (var i = 0; i < document.styleSheets.length; i++) {
			styshet = document.styleSheets[i];
			for (var j = 0; j < styshet.cssRules.length; j++) {
				for (var k = 0; k < elms.length; k++) {
					if (styshet.cssRules[j].selectorText === elms[k]) {
						rulestoadd.push(styshet.cssRules[j].style);
					}
				}
			}
		}
		for (i = 0; i < rulestoadd.length; i++) {
			for (var key in rulestoadd[i]) {
				if (typeof key === 'string' && key !== 'cssText' && isNaN(key) && typeof rulestoadd[i][key] === 'string' && rulestoadd[i][key].length > 0)
					retval[key] = rulestoadd[i][key];
			}
		}
		return retval;
	}
	that.initialize = function(x,y,width,height) {
		elm = document.createElement("div");
		elm.id = "table";
		if (document.body.children.length > 0) {
			document.body.insertBefore(elm, document.body.firstChild);
		} else {
			document.body.appendChild(elm);
		}
		elm.style.width = width;
		elm.style.height = height;
		elm.style.padding = "0";
		elm.style.margin = "0";
		elm.style.top = y;
		elm.style.left = x;
		elm.style.position = "absolute";
		elm.style.overflow = "hidden";
	};
	that.placePlate = function(name) {
		var that = {};
		that.name = name;
		that.customStyle = function(style){};
		that.overridecss = true;
		that.contentDiv = document.createElement("div");
		that.update = function() {
			var elm = document.getElementById("plate-" + this.name);
			if (elm == null) {
				elm = document.createElement("div");
				elm.appendChild(this.contentDiv);
				elm.id = "plate-" + this.name;
				elm.classList.add("plate");
				document.getElementById("table").appendChild(elm);
				elm.style.position = "absolute";
				elm.style.display = "block";
				elm.style.margin = "0";
				elm.style.padding = "0";
			}
			if (this.overridecss) {
				elm.style.top = this.y;
				elm.style.left = this.x;
				elm.style.width = this.width;
				elm.style.height = this.height;
				elm.style.color = this.textColor;
				elm.style.backgroundColor = this.backgroundColor;
			}
            console.log("Hrmde: ");
            console.log(this.customStyle);
			this.customStyle(elm.style);
		};
		that.x = "0";
		that.y = "0";
		that.width = "100%";
		that.height = "100%";
		that.backgroundColor = "white";
		that.textColor = "black";
		that.layerLevel = 0;
        return that;
	};
	return that;
}());
