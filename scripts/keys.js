var Keys = (function() {
	var that = {},
	    listeners = [],
        allAscii = [],
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
    allAscii = " qwertyuiopasdfghjklzxcvbnm[]\\;',./`1234567890-=~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>?".split("").map(function(a) { return a.charCodeAt(0) });
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
        this.registerListener(cheatsequence.concat(allAscii), false, function(key, shift, alt, meta, ctrl) {
            if (key === cheatsequence[cheatindex]) {
                cheatindex++;
            } else {
                cheatindex = 0;
            }
            if (cheatindex == cheatsequence.length) {
                callback(name);
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
