(function() {
  "use strict";
  //*Like a normal button with ontap events.
  var addStyles = function (that) {
    fl.addOnTap(that);
    that.style.minHeight = "1cm";
    that.style.minWidth = "1cm";
    that.style.display = "inline-block";
  }
  var xobject = new fl.xtagObject(); 
  xobject.mixins.push("disabled");
  xobject.lifecycle.created = function () {
    addStyles(this)
    this.style.cursor = "pointer";
  }
  //* Just like above, except with no default look
  xtag.register("fl-tappable", xobject);
  xobject.lifecycle.created = function () {
    addStyles(this);
    this.classList.add("btn");
    console.log(this);
  }
  xobject.accessors.disabled = {};
  xobject.accessors.disabled.set = function(value) {
    (xtag.mixins.disabled.accessors.disabled.set.bind(this))()
    this.classList[value ? "add":"remove"]("disabled");
    }
  xtag.register("fl-button", xobject)
}());