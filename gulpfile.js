const { src, dest, watch } = require('gulp');
const minify = require('gulp-uglify');

const bundleJS = () => {
    return src('./dist/**/*.js')
        .pipe(minify())
        .pipe(dest('./bundle'));
}

exports.bundleJS = bundleJS;