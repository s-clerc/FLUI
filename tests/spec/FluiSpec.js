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
              console.warn("⚠ THIS MEANS THE FL.REMOVEONTAP TESTS FAILED");
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
          fl.forEach([1,2,3,4,5,6,7], function (s) {
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
      });
      describe("appendChildren", function () {
        var a = document.createElement("div"),
            b = document.createElement("div"),
            list = [
                document.createElement("span"),
                document.createElement("span"),
                document.createElement("span")
            ];
        beforeEach(function () {
          fl.appendChildren(list, a);
        });
        it("should append all nodes from an array to another element", function () {
          expect(a.childNodes.length).toEqual(3);
        });
        it("should append all nodes from an nodelist to another element", function () {
          fl.appendChildren(a.children, b);
          expect(b.childNodes.length).toEqual(3);
        });
      });
      describe("wormholeObject.", function () {
        var a,
            b,
            wormhole;
        beforeEach(function () {
          a = document.createElement("div"),
            b = document.createElement("span"),
            wormhole = new fl.wormholeObject(b, a);
          b.setAttribute("a", true);
          b.setAttribute("d", "next");
        });
        describe("open", function () {
          it("should open the wormhole, and transport elements to a", function () {
            runs(function () {
              wormhole.open();
              b.appendChild(document.createElement("a"));
              document.body.appendChild(a);
            });
            waitsFor(function () {
              return a.childNodes.length > 0 ? true : false;
            }, 10000);
            runs(function () {
              expect(a.childNodes.length).toEqual(1);
            });
          });
        });
        describe("close", function () {
          it("should close the wormhole and not transport elements to a", function () {
            wormhole.open();
            wormhole.close();
            b.appendChild(document.createElement("a"));
            expect(b.childNodes.length).toEqual(1);
            expect(a.childNodes.length).toEqual(0);
          });
        });
       
        describe("copyAttributes", function () {
          it("should copy all attributes", function() {
            wormhole.copyAttributes();
            expect(a.getAttribute("a")).toBeTruthy();
            expect(a.getAttribute("d")).toBe("next");
          });
          it("shouldn't copy attributes in the blacklist", function () {
            a.setAttribute("d", false); 
            wormhole.copyAttributes(false, ["d"]);
            expect(a.getAttribute("d")).toBe("false");
          });
          it("shouldn't copy attributes which match regex in the blacklist", function () {
            b.setAttribute("onclick", "hello");
            wormhole.copyAttributes(false, [/on*/]);
            expect(a.onclick).toBeFalsy();
          });
          it("should erase the values of the attributes when the first argument is set to false", function () { 
            b.setAttribute("a", "hello");
            wormhole.copyAttributes(true);
            expect(b.getAttribute("a")).toBe("");
          });
        });
      });
      describe("xtag.mixins.disabled(added by flui)", function () {
            window.i = undefined;
            var addListener = function (element, type) {
              element.addEventListener(type, function () {
                window.i = true;
                console.warn("THIS MEANS MIXINS.DISABLED FAILED MISERABLY");
              });
            },
            test = function (type, dispatchName, checkType) {
              //Creates new x-foo
              var e = document.createElement("x-foo");
              addListener(e, type);
              e.disabled = true;
              //Reset variable
              window.i = undefined;
              xtag.fireEvent(e, dispatchName);
              expect(window.i).toBe(checkType);
            };
        beforeEach(function () {
          //This is done in before each because doing it in describe wouldn't work because the file wouldn't be loaded.
          var xobject = new fl.xtagObject();
          xobject.mixins.push("disabled");
          xobject.lifecycle.created = function () {fl.addOnTap(this);};
          xtag.register("x-foo", xobject);  
        });
        it("should disable ontap", function () {
          test("tap", "touchend", undefined);
        });
        it("should disable onClick", function () {
          test("click", "mouseup", undefined);
        });
        it("should add and remove disabled class", function () {
            //Creates new x-foo
            var e = document.createElement("x-foo");
            //Checks is it adds the disabled class
            e.disabled = true;
            console.log(e.className);
            expect(e.classList.contains("disabled")).toBeTruthy();
            //Checks if it removes the disabled class.
            e.disabled = false;
            expect(e.classList.contains("disabled")).toBeFalsy();
        });
      });
    });
  });
  describe("Input Components", function () {
    describe("fl-button", function () {
      var button;
      beforeEach(function () {
        button = document.createElement("fl-button");
      });
      it("should have ontap funtionnality", function () {
        button.addEventListener("tap", function () {
          window.i = true;
        });
        xtag.fireEvent(button, "touchend");
        expect(window.i).toBeTruthy;
        window.i = undefined;
      });
      it("should have disabled functionnality", function () {
        button.disabled = true;
        expect(button.classList.contains("disabled")).toBeTruthy();
      });
    });  
  });
}());