
var Matrix = (function() {
    var that = {},
        elmMap = {},
        defaults = {
            color : "#0F0",
            fontFamily : "Monaco",
            fontSize : 15,
            letters : "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            speed : 3,
            chance : 0.975,
            speedForColumn : function(c) { return 1; },
            tailLength : 10
        };
    that.letters = {};
    that.letters.chinese = "田由甲申甴电甶男甸甹町画甼甽甾甿畀畁畂畃畄畅畆畇畈畉畊畋界畍畎畏畐畑";
    that.letters.lowercaseEnglish = "abcdefghijklmnopqrstuvwxyz";
    that.letters.uppercaseEnglish = that.letters.lowercaseEnglish.toUpperCase();
    that.letters.digits = "0123456789";
    that.letters.leet = "1337leet";
    that.resetOptions = function() {
        that.options = {};
        for (key in defaults) {
            that.options[key] = defaults[key];
        }
    };
    that.resetOptions();

    var fetchCharWidth = function(fontSize) {
        var elm = document.createElement("span"),
            retval = 0;
        elm.style.fontSize = fontSize + "px";
        elm.innerHTML = "x";
        elm.style.margin = elm.style.padding = "0";
        document.body.appendChild(elm);
        retval = elm.offsetWidth;
        document.body.removeChild(elm);
        return retval;
    };
    var hexToRgb = function(hex) { // from http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb (ty Tim Down)
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };
    var emptySpace = function(len) {
        return (new Array(len)).join(" ");
    };
    that.fly = function(elm) {
        var c = document.createElement("canvas"),
            ctx = c.getContext("2d"),
            letters = that.options.letters + emptySpace(Math.floor(that.options.letters.length / 2)),
            letterset = letters.split(""),
            drops = [], counters, i, j, ncol, nrow,
            fgrgb = hexToRgb(that.options.color), fgFillStyle = "rgba(" + fgrgb.r + "," + fgrgb.g + "," + fgrgb.b + ",",
            fontWidth = fetchCharWidth(that.options.fontSize), columnSpeeds;
        
        elm.appendChild(c);
        c.width = elm.clientWidth;
        c.height = elm.clientHeight;
        ncol = Math.floor(c.width / fontWidth) + 1;
        nrow = Math.floor(c.height / that.options.fontSize) + 1;
        counters = new Array(ncol);
        columnSpeeds = new Array(columnSpeeds);
        for (i = 0; i < ncol; i++) {
            drops.push(new Array(nrow));
            for (j = 0; j < nrow; j++) {
                drops[i][j] = {
                    alpha : 0,
                    letter : " "
                };
            }
            counters[i] = 0;
            drops[i].ready = true;
        }
        var draw = function(fontSize, fontWidth, fontFamily, chance, tailLength) {
            ctx.clearRect(0,0, c.width, c.height);
            ctx.font = fontSize + "px " + fontFamily;
            for (i = 0; i < ncol; i++) {
                counters[i]++;
                var flag = false;
                for (j = 0; j < nrow; j++) {
                    var drop = drops[i][j];
                    if (drop.alpha === 1) {
                        flag = true;
                        drop.alpha -= 1 / (tailLength + 1);
                    } else if (flag) {
                        flag = false;
                        drop.alpha = 1;
                        drop.letter = letterset[Math.floor(Math.random()*letterset.length)];
                        if (j === nrow - 1) {
                            drops[i].ready = true;
                        }
                    } else {
                        drop.alpha -= 1 / (tailLength + 1);
                    }
                    ctx.fillStyle = fgFillStyle + drop.alpha + ")";
                    ctx.fillText(drop.letter, i*fontWidth, j*fontSize);
                }
                if (drops[i].ready && Math.random() > chance) {
                    drops[i].ready = false;
                    drops[i][0].alpha = 1;
                    drops[i][0].letter = letterset[Math.floor(Math.random()*letterset.length)];
                }
            }
        };

        var id = setInterval(draw, 100 / that.options.speed, that.options.fontSize, fontWidth, that.options.fontFamily, that.options.chance, that.options.tailLength);
        return {
            id : id,
            elm : elm,
            canvas : c
        };
    };
    that.land = function(arg) {
        clearInterval(arg.id);
        arg.elm.removeChild(arg.canvas);
    };

    return that;
})();

