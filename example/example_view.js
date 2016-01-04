/**
 * Created by mark on 04.01.16.
 */

define(
    function(require, exports, module){
        var Marionette = require('marionette');
        var VerticalScroller = require('vertical_scroller');
        var ExampleView = Marionette.ItemView.extend({
            __module__: 'example',
            __application__: 'example',
            behaviors: {
                VScroller:{
                    behaviorClass: VerticalScroller
                }
            },
            initialize: function(){
                this.generate_template()
            }
        });

        return ExampleView
    }
);