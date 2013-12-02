var Plates = (function() {
	var module = {};
	var fetchStyle = function(elms) {
		var rulestoadd = [];
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
		var retval = {};
		for (i = 0; i < rulestoadd.length; i++) {
			for (var key in rulestoadd[i]) {
				if (rulestoadd[i][key] !== "" && rulestoadd[i][key] !== null && rulestoadd[i][key] !== undefined && typeof rulestoadd[i][key] === 'string' && typeof key === 'string' && key !== 'cssText' && isNaN(key))
					retval[key] = rulestoadd[i][key];
			}
		}
		return retval;
	}
	module.initialize = function(x,y,width,height) {
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
	module.Plate = function(name) {
		var plate = this;
		this.name = name;
		this.customStyle = function(style){};
		this.overridecss = true;
		this.contentDiv = document.createElement("div");
		this.update = function() {
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
			this.customStyle(elm.style);
		};
		this.x = "0";
		this.y = "0";
		this.width = "100%";
		this.height = "100%";
		this.backgroundColor = "white";
		this.textColor = "black";
		this.layerLevel = 0;
	}
	return module;
}())