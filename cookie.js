var Cookies = (function() {
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
