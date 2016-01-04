define(
    (require, exports, module)->
        Marionette = require('marionette')


        class VerticalScrollerView extends Marionette.ItemView
            __module__: 'marionette_ui'
            __application__: 'vertical_scroller'

            initialize: ()->
                this.generate_template()

        class vertical_scroller extends Marionette.Behavior
            defaults:
                outer: '[data-ui="scroller-outer"]'
                inner: '[data-ui="scroller-inner"]'
                step: 100  # Max pixels per scroll
            initialize: ()->

                return this

        return vertical_scroller
)