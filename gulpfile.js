var gulp    = require('gulp'),
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
                destiny : 'src/js/'
        }
      }
};

gulp.task('coffee', function() {
    gulp.src(path.src.coffee.origin)
        .pipe(plumber())
        .pipe(coffee({bare: true}).on('error', function(err){
            console.log('');
            console.log(err.name + " in " + err.plugin);
            console.log('Message: ' + err.message);
            console.log('Stack: ' + err.stack);

        }))
        .pipe(gulp.dest(path.src.coffee.destiny));
});

//compilando javascript
gulp.task('js', function () 
{
    var file = "lyricsKaraoke.js"
    setTimeout(function()
    {
        gulp.src(path.src.js.origin)
            .pipe(concat(file))
            .pipe(gulp.dest(path.src.js.destiny));

        gulp.src(file)
            .pipe(uglify())
            .pipe(concat(file.replace('.js', '.min.js')))
            .pipe(gulp.dest(path.src.js.destiny));
    },500);
});


gulp.task('default', function(){
  gulp.run(['coffee','js']); 
});
gulp.task('watch', function () {
  gulp.watch(path.src.coffee.origin, ['coffee']);
  gulp.watch(path.src.js.origin, ['js']);
});