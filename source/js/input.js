(function () {
  xtag.register("fl-input", {
    extends: "input",
    lifecycle: {
      created: function () {
        fl.CorrectImproperExtendedComponents("input", "fl-input", this);
      }
    },
    accessors: {
    },
    events: {
    },
    methods: {
    },
    mixins: []
  });
}());