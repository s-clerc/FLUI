(function () {
  "use strict";
  describe("flui", function () {
    describe("fl.", function () {
      it("should be an object", function () {
        expect(typeof fl).toBe("object");
      });
      describe("xtagObject", function () {
        var xobject;
        beforeEach(function() {
          xobject = new fl.xtagObject();
        });
        it("should have a lifecycle property", function () {
          expect(typeof xobject.lifecycle).toBe("object");
        });
        it("should have a events property", function () {
          expect(typeof xobject.events).toBe("object");
        });
        it("should have a accessors property", function () {
          expect(typeof xobject.accessors).toBe("object");
        });
        it("should have a methods property", function () {
          expect(typeof xobject.methods).toBe("object");
        });
        it("should have a mixins property", function () {
          expect(typeof xobject.mixins).toBe("object");
        });
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
            expect(window.i).toBeTruthy(); 
          })
          it("should fire when target is clicked(mouseup);", function () {
            xtag.fireEvent(span, "mouseup", {});
            expect(window.i).toBeTruthy(); 
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
            }, false);
          });
          doTests();
        });
        describe("fl.removeOnTap", function () {
          beforeEach(function () {
            fl.removeOnTap(span);
            span.addEventListener("tap", function () {
              window.i = true;
            });
          });
          var test = function (type) {
            xtag.fireEvent(span, type, {});
            expect(window.i).toBeFalsy();
          }
          it("shouldn't fire when touched", function () {
            test("touchend");
          });
          it("shouldn't fire when clicked", function () {
            test("mouseup");
          });
        });
        it("Make sure the test teardown was done properly, other tests may be inaccurate if this fails", function () {
          expect(window.i).toBeUndefined();
        });
      });
      describe("forEach", function () {
        it("shouldn't work without a callback", function () {
          var test = function () {
            fl.forEach([]);
          };
          expect(test).toThrow();
        });
        it("shouldn't work when the callback is a function", function () {
          var test = function () {
            fl.forEach([], {});
          };
          expect(test).toThrow();
        });
        it("shouldn't work when there isn't an arraylike passed to it", function () {
          var test = function () {
            fl.forEach(false, function() {});
          };
          expect(test).toThrow();
        });
        it("shouldn't work when an object without the .length property is passed", function () {
          var test = function () {
            fl.forEach({}, function () {});
          };
          expect(test).toThrow();
        });
        it("shouldn't work when an object without the ability to query with []", function () {
          var test = function () {
            fl.forEach({length: 1}, function () {});
          };
          expect(test).toThrow();
        });
        it("should execute the callback * array.length", function () {
          var i = 0;
          fl.forEach([1,2,3,4,5,6,7], function () {
            i += 1;  
          });
          expect(i).toBe(7)
        });
        it("should return true when it has gone through the whole array", function () {
          expect(fl.forEach([1], function () {})).toBeTruthy();
        });
        it("should stop going through the array when the callback returns false", function () {
          i = 0;
          fl.forEach([1,2,3,4], function () {
            i += 3;
            if(i===3) {
              return false;
            }
          });
          expect(i).toBe(3);
        });
        it("should return false when looping is interupted by return false", function () {
          expect(fl.forEach([1, 2], function () {return false;})).toBeFalsy();
        });
      })
    });
  });
}());