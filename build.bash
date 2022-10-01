npx stylus -c -o public src/style.styl
npx handlebars src/template/ -f public/all.precompiled.js
cp src/index.html public/index.html
