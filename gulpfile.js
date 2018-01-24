const gulp = require('gulp');
const browserify = require('browserify')
const babelify = require('babelify')
const source = require('vinyl-source-stream');



gulp.task('watch', () => {
	gulp.watch(['./clientJavascript/index.js'], ['es'])
})

gulp.task('es', function(){
	return browserify({
		entries: './clientJavascript/index.js'
	}).transform('babelify', {presets: ["es2015"]})
	.bundle()
	.pipe(source('build.js'))
	.pipe(gulp.dest('./public'))
})

gulp.task('default', ['es', 'watch'])