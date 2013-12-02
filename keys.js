var Keys = (function() {
	var module = {};
	var running = false;
	var listeners = [];
	var keymap = {};
	function lower(str) {
		ret = [];
		for (i = 0; i < str.length; i++) {
			elm = str[i];
			if (typeof elm == 'string') {
				ret.push(elm.toLowerCase());
			} else {
				if (typeof elm == 'number') {
					if (elm >= 65 && elm <= 90) {
						ret.push(elm + 32);
					} else {
						ret.push(elm);
					}
				} else {
					ret.push(elm);
				}
			}
		}
		return ret;
	}
	module.Listener = function(letters, caseinsensitive, callback) {
		this.caseinsensitive = caseinsensitive;
		if (this.caseinsensitive)
			this.letters = lower(letters);
		else
			this.letters = letters;
		this.callback = callback;
	};
	module.registerListener = function(listener) {
		listeners.push(listener);
	};
	module.keyrate = 10;
	module.announce = function(key, shift, alt, meta, ctrl) {
		listeners.forEach(function(listener, index, listeners) {
			if (listener.letters.indexOf(key) !== -1) {
				listener.callback(key, shift, alt, meta, ctrl);
			} else if (listener.caseinsensitive && listener.letters.indexOf(lower([key])[0]) !== -1) {
				listener.callback(lower([key])[0], shift, alt, meta, ctrl);
			}
		});
	};
	var runloop = function(key, shift, alt, meta, ctrl) {
		if (!(keymap[key]) || !running) {
			return;
		}
		module.announce(key, shift, alt, meta, ctrl);
		// setTimeout(runloop, module.keyrate/1000, key, shift, alt, meta, ctrl);
	};
	var keydown = function(event) {
		keymap[event.keyCode] = true;
		runloop(event.keyCode, event.shiftKey, event.altKey, event.metaKey, event.ctrlKey);
	};
	var keyup = function(event) {
		keymap[event.keyCode] = false;
	};
	module.start = function() {
		running = true;
		window.onkeydown = keydown;
		window.onkeyup = keyup;
	};
	module.stop = function() {
		running = false;
		window.onkeydown = null;
		window.onkeyup = null;
	};
	return module;
}());