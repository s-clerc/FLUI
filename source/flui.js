//Adds :hover support for ios Devices
/** 
  * @author sam 
*/
document.addEventListener("touchstart", function() {},false);
xtag.register("fl-toolbar", {
  lifecycle: {
    created: function() {
      this.xtag.shadow = (this.createShadowRoot || this.webkitCreateShadowRoot).bind(this)();
      this.xtag.shadow.applyAuthorStyles = true;
      this.xtag.shadowDiv = document.createElement("div");
      this.xtag.shadow.appendChild(this.xtag.shadowDiv);
      this.xtag.shadowDiv.className += "toolbar ";
      this.xtag.shadowDiv.innerHTML = this.innerHTML;
    },
    attributeChanged: function() {
      console.log("ATTRIBUTE CHANGED, ACT NORMAL ACT NORMAL");
    }
    
  },
  accessors: {
    "innerHTML": {
      set: function() {
        console.log("F");
      }
    },
    "e": {
      set: function() {
        console.log("F");
      }
    }
  }
});