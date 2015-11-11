var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
    pattern: ["gulp-*", "del"],
    scope: ["dependencies", "devDependencies"]
});

var workingDir = "./resources";
var developmentDir = "./.temp/raven-example";
var bowerFilter = plugins.filter(['**/*.{min.js,min.css,css,js}']);

gulp.task('preview', function() {
    return gulp.src(".temp/raven-example/")
        .pipe(plugins.serverLivereload({
            livereload: true,
            directoryListing: false,
            basePath: "/",
            open: true
        }));
});

gulp.task('watch', function() {
    gulp.watch("./scss/**/*.scss", ["scss"]);
    gulp.watch(["**/*.html", "!node_modules/**", "!bower_components/**", "!dev/**", "!dist/**"], ["html"]);
    gulp.watch("**/*.{woff,ttf,woff2}", ["font"]);
});

gulp.task("html", function() {
    return gulp.src(["**/*.html", "!node_modules/**", "!bower_components/**", "!dev/**", "!dist/**"])
        .pipe(gulp.dest(developmentDir));
});

gulp.task("scss", function() {
    return gulp.src('./scss/**/*.scss')
        .pipe(plugins.sass().on('error', plugins.sass.logError))
        .pipe(gulp.dest(developmentDir + "/resources/css"));
});

gulp.task("bowerbuild", function() {
    return gulp.src('./scss/**/*.scss')
        .pipe(plugins.sass().on('error', plugins.sass.logError))
        .pipe(gulp.dest(developmentDir + "/css"));
});

gulp.task("resources", function() {
    return gulp.src('./resources/**/*.css')
        .pipe(plugins.sass().on('error', plugins.sass.logError))
        .pipe(gulp.dest(developmentDir + "/resources/css"));
});

gulp.task("font", function() {
    return gulp.src(['**/*.woff','**/*.ttf','**/*.woff2'])
        .pipe(plugins.rename({dirname: ''}))
        .pipe(gulp.dest(developmentDir + "/resources/fonts"));
});

gulp.task("copy", function() {
    return gulp.src(workingDir + "/lib/**/*")
        .pipe(gulp.dest(developmentDir + "/resources/lib"));
});


gulp.task('build', plugins.sequence(["copy", "scss", "html", "font","resources"]));
gulp.task('develop', plugins.sequence(["copy", "scss", "html", "font","resources"], "preview", "watch"));
gulp.task('default', ['build']);