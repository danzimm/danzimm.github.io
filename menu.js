var ZimmMenu = (function() {
	var module = {};
	module.selectedClass = "zimmlected";
	module.Menu = function(items, splitters) {
		var menu = this;
		this.clickhandler = function(index) {};
		this.created = (typeof items === typeof []);
		this.list = (this.created ? document.createElement("ul") : items);
		for (i = 0; i < items.length; i++) {
			var li;
			if (this.created) {
				li = document.createElement("li");
				li.innerHTML = items[i];
			} else {
				li = items.children[i];
			}
			li.onclick = function(event) {
				ind = menu.indexForItem(this.innerHTML);
				menu.selectItemAtIndex(ind);
			};
			if (this.created) {
				this.list.appendChild(li);
				if (splitters) {
					if (i < items.length - 1) {
						this.list.appendChild(document.createElement("hr"));
					}
				}
			}
		}
		this.selectItem = function(item) {
			this.selectItemAtIndex(this.indexForItem(item));
		};
		this.selectItemAtIndex = function(index) {
			for (i = 0; i < this.list.children.length; i++) {
				if (i == index) {
					this.list.children[i].classList.add(module.selectedClass);
				} else {
					this.list.children[i].classList.remove(module.selectedClass);
				}
			};
			menu.clickhandler(index);
		};
		this.indexForItem = function(item) {
			for (i = 0; i < this.list.children.length; i++) {
				if (this.list.children[i].innerHTML == item) {
					return i;
				}
			};
		};
		this.addToElement = function(elm) {
			elm.appendChild(this.list);
		};
	};
	return module;
}());