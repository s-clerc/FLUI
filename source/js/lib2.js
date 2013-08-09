//Non-strict code
(function() {
 var fireOnTap = function (e) {
    xtag.fireEvent(this, "tap", e);
    if (this.ontap) {
      if (this.ontap(e) === false) {
        return false;
      }
    } 
    if (this.getAttribute("ontap")) {
      eval(this.getAttribute("ontap"));
    }
  };
  window.fl.addOnTap = function (n) {
    n.addEventListener("touchend", fireOnTap, false);
    n.addEventListener("mouseup", fireOnTap, false);        
  };
  window.fl.removeOnTap = function (n) {
    n.removeEventListener("touchend", fireOnTap, false);
    n.removeEventListener("mouseup", fireOnTap, false);          
  }
}());