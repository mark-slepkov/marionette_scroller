/**
 * Created by mark on 04.01.16.
 */

define(
    function(require, exports, module){
        var Marionette = require('marionette');
        var VerticalScroller = require('vertical_scroller');

        var ItemView = Marionette.ItemView.extend({
            __module__: 'example',
            __application__: 'item',

            initialize: function(){
                this.generate_template()
            }
        });

        var ExampleView = Marionette.CompositeView.extend({
            __module__: 'example',
            __application__: 'example',
            childView: ItemView,
            childViewContainer: '[data-region="items"]',
            behaviors: {
                VScroller:{
                    behaviorClass: VerticalScroller
                }
            },
            ui: {
                add_item_button: '[data-action="add-item"]'
            },
            events: {
                'click @ui.add_item_button': 'add_item'
            },
            initialize: function(){
                this.generate_template();
                this.collection = new Backbone.Collection()
            },
            add_item: function(){
                this.collection.add({key: 'value'})
            }

        });

        return ExampleView
    }
);