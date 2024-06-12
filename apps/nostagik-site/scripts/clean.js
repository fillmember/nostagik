const fs = require('fs-extra');

fs.emptyDirSync('./src/data');
fs.emptyDirSync('./.next');
fs.emptyDirSync('./public/cached-images');
