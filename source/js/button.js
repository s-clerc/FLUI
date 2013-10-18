(function() {
  "use strict";
  var xobject = new fl.xtagObject();
  xobject.mixins.push("disabled");
  xobject.lifecycle.created = function () {
    fl.addOnTap(this);
    this.style.display = "inline-block";
    this.style.cursor = "pointer";
  }
  //* Just like below, except with no default look
  xtag.register("fl-tappable", xobject);
  xobject.lifecycle.created = function () {
    fl.addOnTap(this);
    this.style.display = "inline-block";
  }
  //*Like a normal button with ontap events.
  xtag.register("fl-button", xobject);
}());