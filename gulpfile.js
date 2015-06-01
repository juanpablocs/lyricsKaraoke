var gulp    = require('gulp'),
    gutil   = require('gulp-util'),
    uglify  = require('gulp-uglify'),
    concat  = require('gulp-concat');
    plumber  = require('gulp-plumber');
    coffee  = require('gulp-coffee');

var path = {
      src:{
        js    : {
                origin  :'src/js/*.js',
                destiny : 'dist/js/'
        },
        coffee: {
                origin: 'src/coffee/*.coffee',
                destiny : 'dist/js/'
        }
      }
};

//compilando javascript
gulp.task('js', function () {
    gulp.src(path.src.js.origin)
        .pipe(uglify())
        .pipe(concat('lyricskaraoke.min.js'))
        .pipe(gulp.dest(path.src.js.destiny));
});
gulp.task('coffee', function() {
    gulp.src(path.src.coffee.origin)
        .pipe(plumber())
        .pipe(coffee({bare: true}).on('error', function(err){
            console.log('');
            console.log(err.name + " in " + err.plugin);
            console.log('Message: ' + err.message);
            console.log('Stack: ' + err.stack);

        }))
        .pipe(concat('lyricskaraoke.min.js'))
        .pipe(gulp.dest(path.src.coffee.destiny));
});

gulp.task('default', function(){
  gulp.run(['js', 'coffee']); 
});
gulp.task('watch', function () {
  gulp.watch(path.src.js.origin, ['js']);
  gulp.watch(path.src.coffee.origin, ['coffee']);
});