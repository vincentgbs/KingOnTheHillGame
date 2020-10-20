document.addEventListener("DOMContentLoaded", function(event) {
    let tests = {
        domain: '',
        get_domain: function() {
            let url = window.location.href; // remove /koth/index.html
            this.domain = url.substring(0, url.length-15);
            return this;
        },
        add: function(name) {
            let src = document.createElement("script");
            src.setAttribute("src", this.domain + name);
            src.setAttribute("type", "text/javascript");
            document.head.appendChild(src);
            return this;
        },
    };

    tests.get_domain().add('koth-test/game.test.js').add('koth-test/layout.test.js').add('koth-test/remote.test.js');
});
