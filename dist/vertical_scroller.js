(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(function(require, exports, module) {
    var Marionette, VerticalScrollerView, vertical_scroller;
    Marionette = require('marionette');
    VerticalScrollerView = (function(superClass) {
      extend(VerticalScrollerView, superClass);

      function VerticalScrollerView() {
        return VerticalScrollerView.__super__.constructor.apply(this, arguments);
      }

      VerticalScrollerView.prototype.__module__ = 'marionette_ui';

      VerticalScrollerView.prototype.__application__ = 'vertical_scroller';

      VerticalScrollerView.prototype.initialize = function() {
        return this.generate_template();
      };

      return VerticalScrollerView;

    })(Marionette.ItemView);
    vertical_scroller = (function(superClass) {
      extend(vertical_scroller, superClass);

      function vertical_scroller() {
        return vertical_scroller.__super__.constructor.apply(this, arguments);
      }

      vertical_scroller.prototype.defaults = {
        outer: '[data-ui="scroller-outer"]',
        inner: '[data-ui="scroller-inner"]',
        step: 100
      };

      vertical_scroller.prototype.initialize = function() {
        return this;
      };

      return vertical_scroller;

    })(Marionette.Behavior);
    return vertical_scroller;
  });

}).call(this);
