var ZimmMenu = (function() {
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
