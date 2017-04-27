const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for your application, as well as bundling up your JS files.
 |
 */

mix.combine(['./public/src/assets/css/normalize.css'], './public/dist/assets/css/normalize.css');
mix.combine(['./public/src/assets/css/element-theme/index.css'], './public/dist/assets/css/element-theme/index.css');
mix.combine(['./public/src/assets/css/buefy.css'], './public/dist/assets/css/buefy.css');
mix.combine(['./public/src/assets/css/style.css'], './public/dist/assets/css/style.css');
mix.sass('./public/src/assets/css/bulma.sass', './public/dist/assets/css');

mix
  .js('./public/src/assets/js/app.js', './public/dist/assets/js')
  .js('./public/src/services/routes.js', './public/dist/services')
  .copy('./public/src/assets/imgs', './public/dist/assets/imgs', false)
  .copy('./public/src/fonts', './public/dist/fonts', false)
  .copy('./public/src/index.html', './public/dist')
  .copy('./public/src/favicon.ico', './public/dist');


mix.webpackConfig({
  module: {
    rules: [{
      test: /\.html$/,
      loader: 'html-loader',
      options: {
        minimize: true,
        removeComments: true,
      },
    }],
  },
});

// Full API
// mix.js(src, output);
// mix.react(src, output); <-- Identical to mix.js(), but registers React Babel compilation.
// mix.extract(vendorLibs);
// mix.sass(src, output);
// mix.less(src, output);
// mix.stylus(src, output);
// mix.browserSync('my-site.dev');
// mix.combine(files, destination);
// mix.copy(from, to);
// mix.copyDirectory(fromDir, toDir);
// mix.minify(file);
// mix.sourceMaps(); // Enable sourcemaps
// mix.version(); // Enable versioning.
// mix.disableNotifications();
// mix.setPublicPath('path/to/public');
// mix.setResourceRoot('prefix/for/resource/locators');
// mix.autoload({}); <-- Will be passed to Webpack's ProvidePlugin.
// mix.webpackConfig({}); <-- Override webpack.config.js, without editing the file directly.
// mix.then(function () {}) <-- Will be triggered each time Webpack finishes building.
// mix.options({
//   extractVueStyles: false, // Extract .vue component styling to file, rather than inline.
//   purifyCss: false, // Remove unused CSS selectors.
//   uglify: {}, // Uglify-specific options. https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
//   postCss: [] // Post-CSS options: https://github.com/postcss/postcss/blob/master/docs/plugins.md
// });
