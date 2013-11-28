
window.onload = function() {
	DancingText.dance();
	Plates.initialize("0em", "0em", "100%", "100%");
	var items = ["Io", "Codifico", "Capisco", "Miscellaneo"];
	var menu = new ZimmMenu.Menu(items);
	plates = [];
	index = 0;
	document.body.style.width = "100%";
	document.body.style.height = "100%";
	for (i in items) {
		item = items[i];
		plat = new Plates.Plate(item);
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
			style.marginTop = "calc(-" + plat.height + " / 2)";
			rotation = (4 - index) * 90;
			transorg = "right top";
			style.transformOrigin = transorg;
			style.webkitTransformOrigin = transorg;
			style.mozTransformOrigin = transorg;
			style.mosTransformOrigin = transorg;
			style.oTransformOrigin = transorg;
			sty = "rotate(" + rotation + "deg)";
			style.mozTransform = sty;
			style.webkitTransform = sty;
			style.mosTransform = sty;
			style.oTransform = sty;
			style.transform = sty;
			trans = "all 0.5s ease-in-out";
			style.mozTransition = trans;
			style.webkitTransition = trans;
			style.mosTransition = trans;
			style.oTransition = trans;
			style.transition = trans;
		};
		plat.update();
		plates.push(plat);
		index++;
	}
	menu.list.id = "menu";
	menu.addToElement(document.getElementById("menucontainer"),false);
	var previousIndex = -1;
	menu.clickhandler = function(index) {
		if (previousIndex == index)
			return;
		history.pushState({ previousIndex : previousIndex, index : index},null,"/" + items[index]);
		for (var i = 0; i < 4; i++) {
			plat = plates[i];
			plat.customStyle = function(style) {
				rotation = (4 - i + index) * 90 + (360 * (ZimmUtil.getRandomInt(0,4) - 2));
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
	window.onpopstate = function(event) {
		previousIndex = event.state.previousIndex;
		menu.selectItemAtIndex(event.state.index);
	};
	history.replaceState({previousIndex : previousIndex, index : index},null, null);
	// if (location.hash != null && location.hash.length > 0) {
	// 	tst = items.indexOf(location.hash.substring(1));
	// 	if (tst != -1) {
	// 		menu.selectItemAtIndex(tst);
	// 		return;
	// 	}
	// }
	menu.selectItemAtIndex(0);
}
