/**
 * gulpfile.babel.js
 * 
 * @author yuki
 */

import gulp from 'gulp';
import babel from 'gulp-babel';
import mocha from 'gulp-mocha';

import runSequence from 'run-sequence';
import remove from 'del';


const mainSourceDir = 'src/main/js';
const testSourceDir = 'src/test/js';
const mainTargetDir = 'app/script';
const testTargetDir = 'test/script';

/** Clean */
gulp.task('clean-main', remove.bind(null, [mainTargetDir]));
gulp.task('clean-test', remove.bind(null, [testTargetDir]));

/** Compile */
gulp.task('compile-main', () => {
    return gulp.src(
        `${mainSourceDir}/**/*.js`
    ).pipe(
        babel()
    ).pipe(
        gulp.dest(mainTargetDir)
    );
});

gulp.task('compile-test', () => {
    return gulp.src(
        `${testSourceDir}/**/*.js`
    ).pipe(
        babel()
    ).pipe(
        gulp.dest(testTargetDir)
    );
});

/** Build */
gulp.task('build-app', (cb) => {
    return runSequence('clean-main', 'compile-main', cb);
});

gulp.task('build-test', (cb) => {
    return runSequence(['clean-main', 'clean-test'], ['compile-main', 'compile-test'], cb);
});