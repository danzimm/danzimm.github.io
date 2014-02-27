
var Matrix = (function() {
    var that = {},
        elmMap = {},
        defaults = {
            fadeIntensity : 10,
            color : "#0F0",
            backgroundColor : "#000000",
            fontFamily : "Monaco",
            fontSize : 15,
            letters : "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            speed : 3,
            chance : 0.975,
            speedForColumn : function(c) { return 1; }
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
    }
    that.fly = function(elm) {
        var c = document.createElement("canvas"),
            ctx = c.getContext("2d"),
            letters = that.options.letters,
            letterset = letters.split(""),
            drops = [], counters = [], i, ncol,
            rgbbg = hexToRgb(that.options.backgroundColor), bgfillStyle = "rgba(" + rgbbg.r + "," + rgbbg.g + "," + rgbbg.b + "," + that.options.fadeIntensity / 100 + ")",
            fontWidth = fetchCharWidth(that.options.fontSize);
        
        c.style.backgroundColor = that.options.backgroundColor;

        elm.appendChild(c);
        c.width = elm.clientWidth;
        c.height = elm.clientHeight;
        ncol = c.width / fontWidth;
        for(i = 0; i < ncol; i++) {
            drops[i] = c.height;
            counters[i] = 0;
        };
        
        var draw = function(fontSize, fontWidth, fontFamily, col, chance, speedForColumn) {
            ctx.fillStyle = bgfillStyle;
            ctx.fillRect(0, 0, c.width, c.height);
            ctx.fillStyle = col;
            ctx.font = fontSize + "px " + fontFamily;
            for(var i = 0; i < drops.length; i++) {
                counters[i]++;
                if (counters[i] > speedForColumn(i, drops.length)) {
                    var text = letterset[Math.floor(Math.random()*letterset.length)];
                    ctx.fillText(text, i*fontWidth, drops[i]*fontSize);

                    if(drops[i]*fontSize > c.height && Math.random() > chance)
                        drops[i] = 0;
                
                    drops[i]++;
                    counters[i] = 0;
                }
            }
        }

        var id = setInterval(draw, 100 / that.options.speed, that.options.fontSize, fontWidth, that.options.fontFamily, that.options.color, that.options.chance, that.options.speedForColumn);
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

