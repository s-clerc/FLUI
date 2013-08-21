(function () {
  "use strict";
  describe("flui", function () {
    describe("fl.", function () {
      it("should be an object", function () {
        expect(typeof fl).toBe("object");
      }); 
      describe("ontap", function () {
        var span;
        beforeEach(function () {
          span = document.createElement("span");
          fl.addOnTap(span);
        });
        it("inline event should fire when target is touched", function () {
          var i;
          span.setAttribute("ontap", "window.i=true");
          xtag.fireEvent(span, "touchend", {});
          expect(window.i).toBe(true); 
        });
      });
    });
  });
}());