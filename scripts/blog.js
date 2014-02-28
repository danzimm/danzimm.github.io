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
