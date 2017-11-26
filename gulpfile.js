var gulp         = require('gulp'),
    rigger       = require('gulp-rigger'),
    htmlmin      = require('gulp-htmlmin'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    mmq          = require('gulp-merge-media-queries'),
    cssnano      = require('gulp-cssnano'),
    rename       = require('gulp-rename'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    cache        = require('gulp-cache'),
    del          = require('del'),
    browserSync  = require('browser-sync');

gulp.task('html', function() {
    return gulp.src('src/html/index.html')
        .pipe(rigger())
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({stream: true}))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('sass', function() {
    return gulp.src('src/sass/styles.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 15 versions', '> 1%', 'ie 9', 'ie 8', 'ie 7'],
            cascade: true
        }))
        .pipe(mmq({
            log: false
        }))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({stream: true}))
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('img', function() {
    return gulp.src('src/img/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 5,
            svgoPlugins: [{removeViewBox: true}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('fonts', function() {
    return gulp.src('src/fonts/*')
        .pipe(gulp.dest('dist/fonts'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', function() {
    gulp.watch('src/**/*.html', ['html'], browserSync.reload);
    gulp.watch('src/**/*.scss', ['sass'], browserSync.reload);
    gulp.watch('src/img/*', ['img'], browserSync.reload);
    gulp.watch('src/fonts/*', ['fonts'], browserSync.reload);
});

gulp.task('del', function() {
	return del.sync('dist/*');
});

gulp.task('server', function () {
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
        notify: false
    });
});

gulp.task('clear', function (callback) {
	return cache.clearAll();
})

gulp.task('build', ['html', 'sass', 'img', 'fonts']);

gulp.task('start', [ 'del', 'build', 'server', 'watch']);
