var gulp = require('gulp');
var coffee = require('gulp-coffee');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat');
var gutil = require("gulp-util");
var header = require('gulp-header');
var footer = require('gulp-footer');
var rigger = require("gulp-rigger");
var webpack = require("webpack");

var paths = {
    stylus: {
        src: 'src/**/*.styl',
        example_src: 'example/**/*.styl',
        dest: 'dist/'
    },
    coffee: {
        src: 'src/**/*.coffee',
        dest: 'dist/'
    },
    html: {
        src: 'src/**/*.html',
        example_src: 'example/tmpl/**/*.html',
        dest: 'dist/',
        example: 'example/'
    },
    css: {  // For the example
        src: 'dist/**/*.css',
        dest: 'example/'
    },
    js:{
        src: {
            entry: "example/init.coffee",
            compiled: "dist/**.js"
        }
    }
};



gulp.task('stylus', function(){
    gulp.src(paths.stylus.src)
        .pipe(stylus())
        .pipe(gulp.dest(paths.stylus.dest));

    gulp.src([paths.stylus.src, paths.stylus.example_src])
        .pipe(stylus())
        .pipe(concat('style.css'))
        .pipe(gulp.dest(paths.css.dest))
});

gulp.task('html', function(){
    gulp.src(paths.html.src).pipe(gulp.dest(paths.html.dest));

    var regexp = new RegExp('^.*\/tmpl\/(.*)\/(.*)\/template.html$'); // Маска, по которой будет формироваться ID шаблона
    gulp.src([paths.html.src, paths.html.example_src])
    .pipe(header('<script type="text/template" id="<% m = file.path.match(mask) %><%=m[1]%>-<%=m[2]%>">', {mask: regexp}))// Оборачиваем шаблон в <script ...> и генерим для него id
    .pipe(footer('</script>'))
    .pipe(concat('compiled_templates.html'))
    .pipe(gulp.dest(paths.html.example));

    gulp.src('example/template.html').pipe(rigger()).pipe(concat('index.html')).pipe(gulp.dest('example/'));
});

gulp.task('coffee', function(){
    gulp.src(paths.coffee.src).pipe(coffee()).pipe(gulp.dest(paths.coffee.dest))
});


gulp.task('webpack', function(callback){
    webpack({
        // config here
        //watch: true,
        entry: paths.js.src.entry,
        output: {
            path: "example/",
            publicPath: 'example/',
            filename: 'build.js',
            library: 'jquery'
        },
        resolve: {
            modulesDirectories: ['', 'dist', 'bower_components'],
            // extensions: ['.js'],
            alias: {
                marionette: 'backbone.marionette'
            }
        },
        module: {
            loaders: [
                { test: /\.coffee$/, loader: "coffee" }
            ]
        },
        devtool: "source-map",
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                warnings: false,
                drop_console: true,
                unsafe: true
            }),
            new webpack.ResolverPlugin([
                    new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
                ],
                ["normal", "loader"]
            )
        ]
    },
    function(err, stats){
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        callback()
    })
});

gulp.task('watch', function() {
    gulp.watch([paths.stylus.src], ['stylus']);
    gulp.watch([paths.html.src], ['html']);
    gulp.watch([paths.coffee.src], ['coffee', 'webpack']);
    //gulp.watch([paths.js.src.compiled, paths.js.src.entry], ['webpack']);
});

gulp.task('build', ['coffee', 'stylus', 'html', 'webpack']);

gulp.task('default', ['build']);
