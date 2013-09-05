(function () {
  "use strict";
  window.fl = ({} || window.fl);
  window.fl.findFileSource = function () {
    var scripts = document.getElementsByTagName('script'),
      script = scripts[scripts.length - 1];
    console.log(script);
    console.dir(scripts);
    if (script.getAttribute.length !== undefined) {
      return script.getAttribute('src')
    }
    return script.getAttribute('src', 2)
  };
  window.fl.depends = function (r, filename, asyncDefer, filesource) {
    var e,
        source = (filesource  || document.querySelector("script[src*='" + filename + "']").getAttribute("src")).replace(filename, "")
      r.forEach(function (src) {
        e = document.createElement("script");
        if (asyncDefer !== "undefined") {
          e.setAttribute(asyncDefer, (asyncDefer || false));
        }
        e.setAttribute("src", source + src);
        document.head.appendChild(e);
    });
  }
  fl.depends([
    "js/package.js"
  ], "flui.js", true);
}())