/**
 * gulpfile.js
 * 
 * @author yuki
 */

'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();



const mainSourceDir  = 'src/main/jsx';
const testSourceDir  = 'src/test/jsx';
const mainTargetDir  = 'app/script';
const testTargetDir  = 'cache/test';

gulp.task('compile', () => {
    return gulp.src(`${mainSourceDir}/**/*.{js,jsx}`).pipe($.babel({
        stage: 0,
    })).pipe(gulp.dest(mainTargetDir)).pipe(gulp.dest(testTargetDir)) &&
    gulp.src(`${testSourceDir}/**/*.{js,jsx}`).pipe($.babel({
        stage: 0,
    })).pipe(gulp.dest(testTargetDir));
});

gulp.task('compile-main', () => {
    return gulp.src(`${mainSourceDir}/**/*.{js,jsx}`).pipe($.babel({
        stage: 0,
    })).pipe(gulp.dest(mainTargetDir));
});

gulp.task('compile-test', () => {
    return gulp.src(`${testSourceDir}/**/*.{js,jsx}`).pipe($.babel({
        stage: 0,
    })).pipe(gulp.dest(testTargetDir));
});

gulp.task('unit-test', () => {
    return gulp.src(`${testTargetDir}/*.js`, { read: false }).pipe($.mocha({
        reporter: 'dot',
    })).once('error', () => {
        process.exit();
    });
});

