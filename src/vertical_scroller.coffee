define(
    (require, exports, module)->
        Marionette = require('marionette')
        _ = require('underscore')
        $ = require('jquery')

        class VerticalScrollerView extends Marionette.ItemView
            __module__: 'marionette_ui'
            __application__: 'vertical_scroller'
            ui:
                scroller_button: '[data-content="scroller-button"]'
            events:
                'dragstart @ui.scroller_button': 'on_drag_start'

            initialize: ()->
                this.generate_template()

            on_drag_start: (e)->
                e.preventDefault()
                console.log(e)
                this.drag_begin_coords =
                    x: e.originalEvent.clientX
                    y: e.originalEvent.clientY
                    top: e.target.offsetTop
                $(window).on('mousemove', _.bind(this.on_mousemove, this))
                $(window).once('mouseup', _.bind(this.on_mouseup, this))
                return false

            on_mouseup: (e)->
                $(window).off('mousemove')


            on_mousemove: (e)->
#                if (e.clientY-this.drag_begin_coords.y) > 0
                console.log(this.drag_begin_coords.top)
                this.ui.scroller_button.css(top: (this.drag_begin_coords.top + (e.clientY-this.drag_begin_coords.y)))


                console.log(e)

        class vertical_scroller extends Marionette.Behavior
            defaults:
                step: 100  # Max pixels per scroll
            ui:
                outer: '[data-ui="scroller-outer"]'
                inner: '[data-ui="scroller-inner"]'
            events:
                'wheel @ui.outer': 'on_scroll'
                'mouseenter @ui.outer': 'on_mouseenter'
                'mouseleave @ui.outer': 'on_mouseleave'

            initialize: ()->
                console.log("Vertical Scroller Init")
                this.view.on('render', this.on_view_render, this)
                return this

            on_view_render: ()->
                this.vertical_scroller_view = new VerticalScrollerView()
                this.ui.outer.append(this.vertical_scroller_view.$el)
                this.vertical_scroller_view.render()

            on_scroll: (e)->
                e.preventDefault()
                if (e.originalEvent.wheelDeltaY < 0) || (e.originalEvent.deltaY > 0)
                    # Move up
                    current_margin_top = Number(this.ui.inner.css('marginTop').replace('px', ''))
                    inner_height = this.ui.inner.height()
                    outer_height = this.ui.outer.height()
                    delta = this.options.step
                    if inner_height - outer_height > 0 # Проверяем, нужно ли вообще скроллить
                        if (inner_height - outer_height + current_margin_top) > delta
                            this.ui.inner.stop().animate(marginTop: "-="+delta, 200)
                        else
                            this.ui.inner.stop().css(marginTop: -inner_height+outer_height, 200)
                else
                    # Move down
                    current_margin_top = Number(this.ui.inner.css('marginTop').replace('px', ''))
                    delta = this.options.step
                    if (current_margin_top + delta) > 0
                        this.ui.inner.stop().css(marginTop: "0", 200)
                    else
                        this.ui.inner.stop().animate(marginTop: "+="+delta, 200)
                return false

            on_mouseenter: ()->
                this.vertical_scroller_view.$el.stop().animate(opacity: 1)

            on_mouseleave: ()->
                this.vertical_scroller_view.$el.stop().animate(opacity: 0)

        return vertical_scroller
)