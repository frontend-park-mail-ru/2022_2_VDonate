npx stylus -c -o public src
npx handlebars src/template/ -f public/all.precompiled.js
cp src/index.html public/index.html
