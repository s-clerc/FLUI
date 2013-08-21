(function() {
  "use strict";
  window.fl = {};
  window.fl.findFileSource = function() {
    var scripts = document.getElementsByTagName('script'),
      script = scripts[scripts.length - 1];
    if (script.getAttribute.length !== undefined) {
      return script.getAttribute('src')
    }
    return script.getAttribute('src', 2)
  };
  window.fl.depends = function(r, filename, async, filesource) {
    var e,
        source = (filesource ? filesource : fl.findFileSource()).replace(filename, ""); 
    r.forEach(function(src) {
      e = document.createElement("script");
      if (async !== "undefined") {
        e.setAttribute("async", (async || false));
      }
      e.setAttribute("src", source + src);
      document.head.appendChild(e);
    });
  }
  fl.depends([
    "js/package.js"
  ], "flui.js", true);
}())