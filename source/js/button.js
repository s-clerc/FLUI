(function() {
  "use strict";
  var xobject = new fl.xtagObject();
  xobject.mixins.push("disabled");
  xobject.lifecycle.created = function () {
    fl.addOnTap(this);
  }
  //*Like a normal button with ontap events and defaults styling.
  xtag.register("fl-button", xobject);
}());