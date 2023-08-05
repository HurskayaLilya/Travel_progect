import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';

import cleanCss from 'gulp-clean-css';//сжатие cssфайлов
import webpcss from 'gulp-webpcss';//вівод webp изображений 
import autoprefixer from 'gulp-autoprefixer';//добавление вендорних префиксов
import groupCssMediaQueries from 'gulp-group-css-media-queries';//грепировка медиа запросов

const sass = gulpSass(dartSass);

export const scss = () => {
   return app.gulp.src(app.path.src.scss, {sourcemaps: true})
      .pipe(app.plugins.plumber(
         app.plugins.notify.onError({
            title: "Sass",
            message: "Error: <%= error.message %>"
         })
      ))
      .pipe(app.plugins.replace(/@img\//g, '../img/'))
      .pipe(sass({
         outputStyle: 'expanded'
      }))  
      .pipe(groupCssMediaQueries())
      .pipe(webpcss(
         {
            webpcss: ".webp",
            noWebpClass: ".no-webp"
         }
      ))
      .pipe(autoprefixer({
         grid: true,
         overrideBrowserslist: ["last 3 versions"],
         cascade: true
      }))
      .pipe(app.gulp.dest(app.path.build.css))
      .pipe(cleanCss())
      .pipe(rename({
         extname: ".min.css"
      }))
      .pipe(app.gulp.dest(app.path.build.css))
      .pipe(app.plugins.browsersync.stream());
}