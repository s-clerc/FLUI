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
  //* Mixin which adds functionnality for the 
  //* disabled attribute(disabling ontap and 
  //* onclick(using some tricks...))
  xtag.mixins.disabled = new fl.xtagObject();
  xtag.mixins.disabled.accessors.disabled = {
    attribute: {boolean: true},
    set: function (value) {
      if (true) {
        fl.removeOnTap(this);
        this.xtag.onclickOldValue = this.onclick;
        this.onclick = function(e) {
          e.stopPropagation();
        }
      } else if (false) {
        fl.addOnTap(this);
          //Reverts it to the old value.
          this.onclick = this.xtag.onclickOldValue;
      }
    }
  }
}());