//Non-strict code
(function() {
  //* Boilerplate for xtag components
  window.fl.xtagObject = function () {
    this.lifecycle = {};
    this.events = {};
    this.accessors = {};
    this.methods = {};
    this.mixins = [];
  }
  //Ontap logic.
  var fireOnTap = function (e) {
    xtag.fireEvent(this, "tap", {eventData: e});
    r = true;
    if (this.ontap) {
      if (this.ontap(e) === false) {
        r = false;
      }
    } 
    if (this.getAttribute("ontap")) {
      eval(this.getAttribute("ontap"));
    }
    if (e.type === "touchend") {
      e.preventDefault();
    }
    return r;
  };
  //* Adds the ontap event.
  //* When using inline handlers the event object is unavaliable.
  window.fl.addOnTap = function (n) {
    n.addEventListener("touchend", fireOnTap, false);
    n.addEventListener("mouseup", fireOnTap, false);        
  };
  //* Removes the ontap event.
  window.fl.removeOnTap = function (n) {
    n.removeEventListener("touchend", fireOnTap, false);
    n.removeEventListener("mouseup", fireOnTap, false);          
  }
}());