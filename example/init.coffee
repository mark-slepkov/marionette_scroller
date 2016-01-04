Marionette = require('marionette')
$ = require('jquery')
require('script!nunjucks')
_ = require('underscore')
Marionette.TemplateCache.prototype.loadTemplate =
    (templatePath, options)->

        template = $('#'+templatePath).text()
        return nunjucks.renderString(template, options);

Marionette.Renderer.render =
    (templatePath, options)->
        template = $('#'+templatePath).text()
        return nunjucks.renderString(template, options);

Marionette.View.prototype.generate_template =
    (options)->
        if not options
            options = {}
        module_name = options.__module__ || this.__module__
        app_name = options.__application__ || this.__application__
        template_name = options.__template__ || this.__template__ || 'default'
#                        template_url = 'js/' + root + '/' + module_name + '/tmpl/' + app_name + '/' + template_name + '/template.html';
        template_id = app_name + '-' + template_name
        this.template = template_id;
        attributes =
            'data-module': module_name
            'data-application': app_name
            'data-template': template_name
        if not this.attributes
            this.attributes = {}
        _.extend(this.attributes, attributes)
        this.$el.attr(attributes)
        # console.log(this.attributes)

        return template_id;

$(document).ready(
    ()->
        console.log('load')
        ExampleView = require('example_view')
        example_view = new ExampleView()
        $('body').append(example_view.$el)
        example_view.render()
)