(function () {
  "use strict";
  describe("flui", function () {
    describe("fl.", function () {
      it("should be an object", function () {
        expect(typeof fl).toBe("object");
      }); 
      describe("addOnTap", function () {
        var span;
        beforeEach(function () {
          span = document.createElement("span");
          fl.addOnTap(span);
        });
        afterEach(function () {
          window.i = undefined;
        });
        //Reuseable function
        var doTests = function () {
          it("should fire when target is touched", function () {
            xtag.fireEvent(span, "touchend", {});
            expect(window.i).toBe(true); 
          })
          it("should fire when target is clicked(mouseup);", function () {
            xtag.fireEvent(span, "mouseup", {});
            expect(window.i).toBe(true); 
          });
        };
        describe("Inline events", function () {
          beforeEach(function () {
            span.setAttribute("ontap", "window.i=true");
          });
          doTests();
        });
        describe(".ontap", function () {
          beforeEach(function () {
            span.ontap = function () {
              window.i = true;
            };
          });
          doTests();
        });
        describe(".addEventListener", function () {
          beforeEach(function () {
            span.addEventListener("tap", function () {
              window.i = true;
            });
          });
          doTests();
        });
        describe("fl.removeOnTap", function () {
          beforeEach(function () {
            fl.removeOnTap(span);
            span.addEventListener(function () {
              window.i = true;
            });
          });
          var test = function (type) {
            xtag.fireEvent(span, type, {});
            expect(!window.i).toBe(true);
          }
          it("shouldn't fire when touched", function () {
            test("touchend");
          });
          it("shouldn't fire when clicked", function () {
            test("mouseup");
          });
        });
        it("Make sure the test teardown was done properly, other tests may be inaccurate if this fails", function () {
          expect(window.i).toBe(undefined);
        });
      });
    });
  });
}());