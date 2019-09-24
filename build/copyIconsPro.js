const fs = require('fs-extra');

// copy file
// fs.copySync('/tmp/myfile', '/tmp/mynewfile')

// copy directory, even if it has subdirectories or files
fs.copySync('./node_modules/@nascent/icons-pro', './.temp/icons-pro');
