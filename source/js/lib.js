/**
   * @author Samarth AGARWAL
   * @copyright (C) Samarth AGARWAL 2013 All rights reserved
      
  */
(function () {
  "use strict";
  //Makes sure :active classes work on ios devices.
  document.addEventListener("touchstart", function () {}, false);
    /**Emulates the forEach function.
     *Expects an array(must have .length) and a callback(remember to bind it).
     *Callback recives 3 arguments:
     *1. Data from index, 2. Actual Index, 3. Array
     *return false from the callback to stop looping.
     * Returns false when the loop is stopped mid-way otherwise returns true.
     */
  window.fl.forEach = function (arrayLike, callback) {
    var i;
    //Error Handling.
    if (!callback) {
      throw new Error("A callback is required to use this function");
    } else if (typeof callback !== "function") {
        throw new TypeError("Callback must be a function");
    } else if (!arrayLike) {
      throw new Error("An arrayLike object must be passed as the first argument");
    } else if (arrayLike.length === undefined) {
      throw new TypeError("An object which has the . length property must be passed as the first argument");
    } else if (!arrayLike[0] && arrayLike.length !== 0) {
      throw new TypeError("An object which has the ability to query indexes using [0] must be passed as the first argument");
    } else if (arrayLike.length === 0) {
      throw new TypeError("The first argument mustn't be empty");
    } else {
      for (i = 0; i < arrayLike.length; i++) {
        if (callback(arrayLike[i], i, arrayLike) === false) {
          return false
        }
      }
      return true;
    }
  },
  //*Like element.appendChild, except appends multiple.
  //*2 arguments: a nodeList(or array containing nodes), append location.
  window.fl.appendChildren = function (nodeList, newContainer) { 
    fl.forEach(nodeList, function (n) {
        newContainer.appendChild(n);
    });
  },
  /** 
  *Object which houses functionality to make sure that any elements which are inserted are 
  *Automatically transfered to a different container.
  *This is supposed to simulate a component being an extension
  *of another element and attributes set are also automatically transferred.
  *3 arguments: 1. Target to extend, Node of new container, array to whitelist attributes.
  *Functionallity is implemented using Mutation Observers.
  */
  window.fl.extendEmulationObject = function (target, newContainer, filter) {
    this.target = target;
    this.newContainer = newContainer;
    this.emulating = false;
    this.filter = filter;
    this.observeFunction = function (mutations) {
      //Loops over mutations
      mutations.forEach(function (mutation) {
        var i,
            item;
        switch (mutation.type) {
          //Appends children to the newContainer
          case "childList":
            if (mutation.addedNodes.length !== 0) {
              fl.appendChildren(mutation.addedNodes, this.newContainer);
            };
          break;
          case "attributes":
            this.newContainer.setAttribute(mutation.attributeName, this.target.getAttribute(mutation.attributeName));  
          break;
          }
        }.bind(this))   
      }.bind(this);
    
    this.observer = new MutationObserver(this.observeFunction)
    //*Starts emulation.
    this.emulate = function () {
      if (this.emulating) {
        throw new Error("Already emulating, can't emulate twice");
      }
      this.observer.observe(target, {childList: true, attributes: true, attributeFilter: this.filter});
      this.emulating = true;
      return true;
    };
    //*Stops emulation
    this.stop = function () {
      if (!this.emulating) {
        throw new Error("We aren't emulating, we can't stop anything!");
      } else {
        this.observer.disconnect();
        this.emulating = false;
        return true;
      }
    };
  //*This copies the attribute from the parent/target.
  //*2 arguments: wheather or not the method should erase the attributes's value from the parent.
  //*2. A blacklist of attributes(REGEX Supported).
  this.copyAttributes = function (erase, blackList) {
    var attributes = this.target.attributes,
        r;
    fl.forEach(attributes, function (a) {
      //Loops over the blackList.
      r = typeof blackList === "object" ? blackList.forEach(function (b) {
        if (typeof b !== "object" && a.name === b) {
          return false;
        } else if (typeof b === "object" && b.test(a)) {
          return false;
        }
      }) : true;
      //Makes sure attribute is not on blacklist.
      if (r) {
        this.newContainer.setAttribute(a.name, a.value);
        //Erases value of attribute if neccessary.
        if (erase){
          this.target.setAttribute(a.name, "");  
        }
      }
      }.bind(this));
    };
  };
//* http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/
  var addFlowListener = function (element, type, fn){
      var flow = type == 'over';
      element.addEventListener('OverflowEvent' in window ? 'overflowchanged' : type + 'flow', function(e){
          if (e.type == (type + 'flow') ||
          ((e.orient == 0 && e.horizontalOverflow == flow) ||
          (e.orient == 1 && e.verticalOverflow == flow) ||
          (e.orient == 2 && e.horizontalOverflow == flow && e.verticalOverflow == flow))) {
              e.flow = type;
              return fn.call(this, e);
          }
      }, false);
  };
  window.fl.addResizeListener = function (element, fn){
      var resize = 'onresize' in element;
      if (!resize && !element._resizeSensor) {
          var sensor = element._resizeSensor = document.createElement('div');
              sensor.className = 'resize-sensor';
              sensor.innerHTML = '<div class="resize-overflow"><div></div></div><div class="resize-underflow"><div></div></div>';
                                  
          var x = 0, y = 0,
              first = sensor.firstElementChild.firstChild,
              last = sensor.lastElementChild.firstChild,
              matchFlow = function(event){
                  var change = false,
                  width = element.offsetWidth;
                  if (x != width) {
                      first.style.width = width - 1 + 'px';       
                      last.style.width = width + 1 + 'px';
                      change = true;
                      x = width;
                  }
                  var height = element.offsetHeight;
                  if (y != height) {
                      first.style.height = height - 1 + 'px';
                      last.style.height = height + 1 + 'px';      
                      change = true;
                      y = height;
                  }
                  if (change && event.currentTarget != element) xtag.fireEvent(element, 'resize');
              };
                          
          if (getComputedStyle(element).position == 'static'){
              element.style.position = 'relative';
              element._resizeSensor._resetPosition = true;
          }
          addFlowListener(sensor, 'over', matchFlow);
          addFlowListener(sensor, 'under', matchFlow);
          addFlowListener(sensor.firstElementChild, 'over', matchFlow);
          addFlowListener(sensor.lastElementChild, 'under', matchFlow);   
          element.appendChild(sensor);
          matchFlow({});
      }
          var events = element._flowEvents || (element._flowEvents = []);
          if (events.indexOf(fn) == -1) events.push(fn);
          if (!resize) element.addEventListener('resize', fn, false);
          element.onresize = function(e){
              events.forEach(function(fn){
                  fn.call(element, e);
              });
          };
  };
          
  var removeResizeListener = function(element, fn){
      var index = element._flowEvents.indexOf(fn);
      if (index > -1) element._flowEvents.splice(index, 1);
      if (!element._flowEvents.length) {
          var sensor = element._resizeSensor;
          if (sensor) {
              element.removeChild(sensor);
              if (sensor._resetPosition) element.style.position = 'static';
              delete element._resizeSensor;
          }
          if ('onresize' in element) element.onresize = null;
          delete element._flowEvents;
      }
      element.removeEventListener('resize', fn);
  };
}());