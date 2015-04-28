var gulp = require('gulp'),
	less = require('gulp-less'),
	uglify = require('gulp-uglify'),
	minifyCss = require('gulp-minify-css'), 
	rename = require("gulp-rename"), 
	concat = require("gulp-concat"), 
	inlineCss = require('gulp-inline-css');

// Compile Less
gulp.task('less', function() {
    return gulp.src('src/less/*.less')
        .pipe(less())
        .pipe(gulp.dest('src/css/'));
});

gulp.task('css', ['less'], function() {
	return gulp.src('src/css/**/*.css')
    	.pipe(concat('crucio.css'))
    	.pipe(minifyCss())
    	.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('public/css/'));
})

// Compile JS
gulp.task('js', function() {
	return gulp.src('src/js/**/*.js')
    	.pipe(concat('crucio.js'))
    	.pipe(uglify())
    	.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('public/js/'));
})

// Compile Mail Templates
gulp.task('mail', function() {
	return gulp.src('src/mail-templates/**/*.html')
    	.pipe(inlineCss())
		.pipe(gulp.dest('public/mail-templates/'));
})

// Watch Files For Changes
gulp.task('watch', function() {
	gulp.watch('src/less/**/*.less', ['less', 'css']);
	gulp.watch('src/js/**/*.js', ['js']);
	gulp.watch('src/mail-templates/**/*.html', ['mail']);
});

// Default Task
gulp.task('default', ['watch']);