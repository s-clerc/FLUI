(function() {
  "use strict";
  //*Like a normal button with ontap events.
  //*It's touch target is bigger than it's visible size
  xtag.register("fl-button", {
    lifecycle: {
      created: function() {
        this.xtag.span = document.createElement("span");
        this.xtag.extendObject = new fl.extendEmulationObject(this, this.xtag.span, ["class", "style", "unselectable"]);
        this.xtag.extendObject.copyAttributes(true, [/^on/, "id", "class", "style"]);
        fl.addOnTap(this);
        this.style.minHeight = "44px";
        this.style.minWidth = "44px";
        this.style.display = "inline-block";
        this.style.cursor = "pointer";
        this.xtag.span.classList.add("btn");
        fl.appendChildren(this.childNodes, this.xtag.span);
        this.appendChild(this.xtag.span);
        this.xtag.extendObject.emulate();
      }
    }
  });
  //*Just like above, except with no default styling
  xtag.register("fl-tappable", {
    lifecycle: {
      created: function() {
        fl.addOnTap(this);
        this.style.minHeight = "44px";
        this.style.minWidth = "44px";
        this.style.display = "inline-block";
        this.style.cursor = "pointer";
      }
    }
  });
}());