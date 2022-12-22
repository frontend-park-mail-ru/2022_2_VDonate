/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const glob = require('glob');
const fs = require('fs');

const cachedUrl = [
  glob.sync('./dist/**/*.*'),
].flat(Infinity).map(
    (url) =>
      url.replace('/sw.js', '/').replace('./dist', ''),
);

console.log(cachedUrl);
const sw = fs.readFileSync('./src/sw.js');
let swString = sw.toString();
swString = swString.replace('[]', `['${cachedUrl.join('\',\'')}']`);
fs.writeFileSync('./dist/sw.js', swString);
