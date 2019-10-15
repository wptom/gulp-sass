const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const del = require('del');
const htmlmin = require('gulp-htmlmin');

gulp.task('clean-html', function () {
    return del([
        'output/*.html'
    ]);
});

gulp.task('sass', function () {
    return gulp.src('app/sass/style.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest('output/css'));
});

gulp.task('build-html', function() {
    return gulp.src('app/*.html')
        .pipe(htmlmin({ 
            collapseWhitespace: true, 
            minifyCSS: true,
            minifyJS: true 
        }))
        .pipe(gulp.dest('output/'));
});

gulp.task('images', done => {
    gulp.src('app/**/*.{gif,jpg,png,svg}')
        .pipe(gulp.dest('output'))

        done()
});

gulp.task('watch',function() {
    browserSync.init({
        server: 'output'
    });

    gulp.watch('app/**/*.{gif,jpg,png,svg}', gulp.series('images'));
    gulp.watch('app/*.html', gulp.series(['clean-html', 'build-html']));
    gulp.watch('app/sass/**/*.scss', gulp.series(['sass', 'clean-html', 'build-html']));
    gulp.watch('./output').on('change', browserSync.reload);
});

gulp.task('default', gulp.parallel(
    'images',
    'sass',
    'clean-html',
    'build-html'
));