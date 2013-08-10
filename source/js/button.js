(function() {
  "use strict";
  var xobject = new fl.xtagObject(); 
  xobject.mixins.push("disabled");
  xobject.lifecycle.created = function () {
    fl.addOnTap(this);
    this.style.display = "inline-block";
    this.style.cursor = "pointer";
  }
  //* Just like above, except with no default look
  xtag.register("fl-tappable", xobject);
  xobject.lifecycle.created = function () {
    fl.addOnTap(this);
    this.style.display = "inline-block";
    this.classList.add("btn");
  }
  xobject.accessors.disabled = {};
  xobject.accessors.disabled.set = function(value) {
    (xtag.mixins.disabled.accessors.disabled.set.bind(this))()
    this.classList[value ? "add":"remove"]("disabled");
    }
  //*Like a normal button with ontap events.
  xtag.register("fl-button", xobject)
}());