var ZimmBlog = (function() {
    var that = {};
    var concaturl = function(base, append) {
        if (base[base.length-1] == '/')
            return base + append;
        else
            return base + '/' + append;
    };
    that.createBlog = function(metaurl, posturl, name) {
        var that = {},
            currentPost = -1,
            currentPostData = "",
            posts = [],
            nposts = 0,
            loadNumberOfPosts = function() {
                var xhr = new XMLHttpRequest(),
                    resp;
                xhr.open("GET", metaurl, false);
                xhr.send();
                resp = JSON.parse(xhr.responseText);
                posts = resp.files
                nposts = resp.files.length;
            };
        loadNumberOfPosts();
        that.draw = function() {
            var elm = document.createElement("div"),
                content = document.createElement("div"),
                left = document.createElement("div"),
                right = document.createElement("div");
            content.id = name + "_blog_content";
            content.classList.add("blogpost");
            //elm.innerHTML = "<center><h1>Blog</h1></center><hr/>";
            elm.appendChild(content);
            content.innerHTML = currentPostData;
            left.innerHTML = "Previous";
            right.innerHTML = "Next";
            left.style["float"] = "left";
            right.style["float"] = "right";
            left.classList.add("blognav");
            right.classList.add("blognav");
            left.id = "leftblognav";
            right.id = "rightblognav";
            left.onclick = function() {
                that.previous();
            };
            right.onclick = function() {
                that.next();
            };
            elm.appendChild(left);
            elm.appendChild(right);
            return elm;
        };
        that.showPost = function(index) {
            if (nposts === 0) {
                document.getElementById("rightblognav").style.display = "none";
                document.getElementById("leftblognav").style.display = "none";
                currentPostData = "No posts found";
                document.getElementById(name+"_blog_content").innerHTML = currentPostData;
                return;
            }
            if (index == currentPost) {
                return;
            }
            currentPost = index;
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    currentPostData = xhr.responseText;
                    document.getElementById(name+"_blog_content").innerHTML = currentPostData;
                }
            };
            xhr.open("GET", concaturl(posturl, index), true);
            xhr.send();
            if (index === nposts - 1) {
                document.getElementById("rightblognav").style.display = "none";
            } else {
                document.getElementById("rightblognav").style.display = "block";
            }
            if (index === 0) {
                document.getElementById("leftblognav").style.display = "none";
            } else {
                document.getElementById("leftblognav").style.display = "block";
            }
        };
        that.next = function() {
            var indy = currentPost;
            indy++;
            if (indy >= nposts) {
                indy = nposts - 1;
            }
            this.showPost(indy);
        };
        that.previous = function() {
            var indy = currentPost;
            indy--;
            if (indy < 0) {
                indy = 0;
            }
            this.showPost(indy);
        };
        return that;
    };
    return that;
})();
;var Cookies = (function() {
    var that = {};
    that.set = function(cname, cvalue, exdays) {
        var d = new Date(), expires;
        d.setTime(d.getTime()+(exdays*24*60*60*1000));
        expires = "expires="+d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    };
    that.get = function(cname) {
        var name = cname + "=",
            ca = document.cookie.split(';'),
            i, c;
        for(i = 0; i < ca.length; i++) { 
            c = ca[i].trim();
            if (c.indexOf(name) == 0) {
                return c.substring(name.length,c.length);
            }
        }
        return "";
    };
    return that;
})();
;var DancingText = (function() {
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
;var Keys = (function() {
	var that = {},
	    listeners = [],
	    lower = function(str) {
            var ret = [], elm;
            for (i = 0; i < str.length; i++) {
                elm = str[i];
                if (typeof elm == 'string') {
                    ret.push(elm.toLowerCase());
                } else if (typeof elm == 'number' && elm >= 65 && elm <= 90) {
                    ret.push(elm + 32);
                } else {
                    ret.push(elm);
                }
            }
            return ret;
        },
	    createListener = function(letters, caseinsensitive, callback, name) {
            var that = {};
            that.caseinsensitive = caseinsensitive;
            if (that.caseinsensitive)
                that.letters = lower(letters);
            else
                that.letters = letters;
            that.callback = callback;
            that.name = name;
            return that;
        };

	that.registerListener = function(letters, caseinsensitive, callback, name) {
		listeners.push(createListener(letters, caseinsensitive, callback, name));
	};
    that.removeListenerForName = function(name) {
        var indys = [], i;
        listeners.forEach(function(listener, i) {
            if (listener.name === name) {
                indys.push(i);
            }
        });
        for (i = indys.length - 1; i >= 0; i--) {
            listeners.splice(indys[i], 1);
        }
    };
	that.announce = function(key, shift, alt, meta, ctrl) {
		listeners.forEach(function(listener, index, listeners) {
			if (listener.letters.indexOf(key) !== -1) {
				listener.callback(key, shift, alt, meta, ctrl);
			} else if (listener.caseinsensitive && listener.letters.indexOf(lower([key])[0]) !== -1) {
				listener.callback(lower([key])[0], shift, alt, meta, ctrl);
			}
		});
	};
    that.registerCheatCode = function(cheatsequence, name, callback) {
        var cheatindex = 0;
        this.registerListener(cheatsequence, false, function(key, shift, alt, meta, ctrl) {
            if (key === cheatsequence[cheatindex]) {
                cheatindex++;
            } else {
                cheatindex = 0;
            }
            if (cheatindex == cheatsequence.length) {
                callback();
                cheatindex = 0;
            }
        }, name);
    };
	var keydown = function(event) {
		that.announce(event.keyCode, event.shiftKey, event.altKey, event.metaKey, event.ctrlKey);
	};
	that.start = function() {
		window.onkeydown = keydown;
	};
	that.stop = function() {
		window.onkeydown = null;
	};
	return that;
}());
;var ZimmMenu = (function() {
	var that = {},
        module = that; // need this for namespace reasons -_-
	that.selectedClass = "zimmlected";
	that.createMenu = function(items, splitters) {
		var that = {},
            listNode = document.createElement("ul"),
            li, _clickHandler;
        that.currentIndex = -1;
        that.clickHandler = function(index) {};

        _clickHandler = function(index, restricthist) {
            if (that.currentIndex == index) {
                return;
            }
            that.currentIndex = index;
            if (!restricthist) {
                var state = { index : index };
                history.pushState(state, "DanZ.im - " + items[index], "#" + items[index]);
            }
            that.clickHandler(index);
        };

        window.onpopstate = function(event) {
            if (event.state && event.state.hasOwnProperty('index')) {
                that.selectItemAtIndex(event.state.index, true); // PLEASE MAKE SURE WE RESTRICT THE HISTORY FOR CHRISTS SAKE I ALMOST KILLED SOMEONE FIGURING THIS OUT
            }
        };

		for (i = 0; i < items.length; i++) {

            li = document.createElement("li");
            li.innerHTML = items[i];

			li.onclick = function(event) {
				ind = that.indexForItem(this.innerHTML);
				that.selectItemAtIndex(ind);
			};
            
            listNode.appendChild(li);

            if (splitters) {
                if (i < items.length - 1) { // not the last element
                    that.list.appendChild(document.createElement("hr"));
                }
            }

		};

		that.selectItem = function(item) {
			this.selectItemAtIndex(this.indexForItem(item));
		};
		that.selectItemAtIndex = function(index, restricthist) {
			for (i = 0; i < listNode.children.length; i++) {
				if (i == index) {
					listNode.children[i].classList.add(module.selectedClass);
				} else {
					listNode.children[i].classList.remove(module.selectedClass);
				}
			};
			_clickHandler(index, restricthist);
		};
		that.indexForItem = function(item) {
			for (i = 0; i < listNode.children.length; i++) {
				if (listNode.children[i].innerHTML === item) {
					return i;
				}
			}
		};
        that.previous = function() {
            if (this.currentIndex == 0) {
                this.selectItemAtIndex(items.length - 1);
            } else {
                this.selectItemAtIndex(this.currentIndex - 1);
            }
        };
        that.next = function() {
            if (this.currentIndex == items.length - 1) {
                this.selectItemAtIndex(0);
            } else {
                this.selectItemAtIndex(this.currentIndex + 1);
            }
        };
		that.addToElement = function(elm) {
			elm.appendChild(listNode);
		};
        return that;
	};
	return that;
}());
;var Plates = (function() {
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
;
window.onload = function() {
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

		plat.customStyle = function(style) {
            var rotation = (4 - index) * 90,
                sty = "rotate(" + rotation + "deg)";
			style.marginTop = "calc(-" + plat.height + " / 2)";
			style.mozTransform = sty;
			style.webkitTransform = sty;
			style.mosTransform = sty;
			style.oTransform = sty;
			style.transform = sty;
		};

		plat.update();
		plates.push(plat);
		index++;
	}

	menu.clickHandler = function(index) {
        var plat, i;
		for (i = 0; i < 4; i++) {
			plat = plates[i];
			plat.customStyle = function(style) {
				var rotation = (4 - i + index) * 90 + (360 * (ZimmUtil.getRandomInt(0,4) - 2)),
                    sty = "rotate(" + rotation + "deg)";
				style.mozTransform = sty;
				style.webkitTransform = sty;
				style.mosTransform = sty;
				style.oTransform = sty;
				style.transform = sty;
			};
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
    var cheatBack = function() {
        currentColorScheme++;
        if (currentColorScheme == colorSchemes.length) {
            currentColorScheme = 0;
        }
        Cookies.set("colorscheme", currentColorScheme, 365);
        applyColorScheme(colorSchemes[currentColorScheme]);
    };
    Keys.registerCheatCode([38, 38, 40, 40, 37, 39, 37, 39, 66, 65], "cheat1", cheatBack);
    Keys.registerCheatCode([38, 38, 40, 40, 37, 39, 37, 39, 98, 97], "cheat2", cheatBack);
    
    var blog = ZimmBlog.createBlog("http://blog.danz.im/meta", "http://blog.danz.im/post/", "blog"),
        belm = blog.draw();
    belm.classList.add("textbloc");
    document.getElementById(items[2].toLowerCase()).appendChild(belm);
    blog.showPost(0);
	
    if (location.hash && location.hash.length > 0) {
		var tst = items.indexOf(location.hash.substring(1));
		if (tst != -1) {
			menu.selectItemAtIndex(tst, true); // restrict for the first page
            return;
		}
	}
    menu.selectItemAtIndex(0); // don't restrict this one though
};
;var ZimmUtil = (function() {
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
