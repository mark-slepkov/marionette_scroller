(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(function(require, exports, module) {
    var $, Marionette, VerticalScrollerView, _, vertical_scroller;
    Marionette = require('marionette');
    _ = require('underscore');
    $ = require('jquery');
    VerticalScrollerView = (function(superClass) {
      extend(VerticalScrollerView, superClass);

      function VerticalScrollerView() {
        return VerticalScrollerView.__super__.constructor.apply(this, arguments);
      }

      VerticalScrollerView.prototype.__module__ = 'marionette_ui';

      VerticalScrollerView.prototype.__application__ = 'vertical_scroller';

      VerticalScrollerView.prototype.ui = {
        scroller_button: '[data-content="scroller-button"]'
      };

      VerticalScrollerView.prototype.events = {
        'dragstart @ui.scroller_button': 'on_drag_start'
      };

      VerticalScrollerView.prototype.initialize = function(options) {
        this.generate_template();
        this.parent_view = {
          view: options.view,
          inner: options.inner,
          outer: options.outer
        };
        return this.parent_view.view.$el.on('DOMSubtreeModified', _.bind(this.resize, this));
      };

      VerticalScrollerView.prototype.onRender = function() {
        this.rendered = true;
        return this.resize();
      };

      VerticalScrollerView.prototype.resize = function() {
        var scroller_button_height;
        console.log('resize');
        if (this.rendered) {
          scroller_button_height = this.parent_view.outer.height() / this.parent_view.inner.height();
          if (scroller_button_height > 1) {
            scroller_button_height = 1;
          }
          return this.ui.scroller_button.css({
            height: scroller_button_height * 100 + '%'
          });
        }
      };

      VerticalScrollerView.prototype.on_drag_start = function(e) {
        e.preventDefault();
        this.drag_begin_coords = {
          x: e.originalEvent.clientX,
          y: e.originalEvent.clientY,
          top: e.target.offsetTop
        };
        $(window).on('mousemove', _.bind(this.on_mousemove, this));
        $(window).on('mouseup', _.bind(this.on_mouseup, this));
        return false;
      };

      VerticalScrollerView.prototype.on_mouseup = function(e) {
        $(window).off('mousemove');
        return $(window).off('mouseup');
      };

      VerticalScrollerView.prototype.on_mousemove = function(e) {
        return this.ui.scroller_button.css({
          top: this.drag_begin_coords.top + (e.clientY - this.drag_begin_coords.y)
        });
      };

      return VerticalScrollerView;

    })(Marionette.ItemView);
    vertical_scroller = (function(superClass) {
      extend(vertical_scroller, superClass);

      function vertical_scroller() {
        return vertical_scroller.__super__.constructor.apply(this, arguments);
      }

      vertical_scroller.prototype.defaults = {
        step: 100
      };

      vertical_scroller.prototype.ui = {
        outer: '[data-ui="scroller-outer"]',
        inner: '[data-ui="scroller-inner"]'
      };

      vertical_scroller.prototype.events = {
        'wheel @ui.outer': 'on_scroll',
        'mouseenter @ui.outer': 'on_mouseenter',
        'mouseleave @ui.outer': 'on_mouseleave'
      };

      vertical_scroller.prototype.initialize = function() {
        console.log("Vertical Scroller Init");
        this.view.on('render', this.on_view_render, this);
        return this;
      };

      vertical_scroller.prototype.on_view_render = function() {
        this.vertical_scroller_view = new VerticalScrollerView({
          view: this.view,
          inner: this.ui.inner,
          outer: this.ui.outer
        });
        this.ui.outer.append(this.vertical_scroller_view.$el);
        return this.vertical_scroller_view.render();
      };

      vertical_scroller.prototype.on_scroll = function(e) {
        var current_margin_top, delta, inner_height, outer_height;
        e.preventDefault();
        if ((e.originalEvent.wheelDeltaY < 0) || (e.originalEvent.deltaY > 0)) {
          current_margin_top = Number(this.ui.inner.css('marginTop').replace('px', ''));
          inner_height = this.ui.inner.height();
          outer_height = this.ui.outer.height();
          delta = this.options.step;
          if (inner_height - outer_height > 0) {
            if ((inner_height - outer_height + current_margin_top) > delta) {
              this.ui.inner.stop().animate({
                marginTop: "-=" + delta
              }, 200);
            } else {
              this.ui.inner.stop().css({
                marginTop: -inner_height + outer_height
              }, 200);
            }
          }
        } else {
          current_margin_top = Number(this.ui.inner.css('marginTop').replace('px', ''));
          delta = this.options.step;
          if ((current_margin_top + delta) > 0) {
            this.ui.inner.stop().css({
              marginTop: "0"
            }, 200);
          } else {
            this.ui.inner.stop().animate({
              marginTop: "+=" + delta
            }, 200);
          }
        }
        return false;
      };

      vertical_scroller.prototype.on_mouseenter = function() {};

      vertical_scroller.prototype.on_mouseleave = function() {};

      return vertical_scroller;

    })(Marionette.Behavior);
    return vertical_scroller;
  });

}).call(this);
