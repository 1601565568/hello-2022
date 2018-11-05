// require modules
const fs = require('fs');
const archiver = require('archiver');
const path = require('path')
const packageList = require('../../temp/package/list.json')

function resolve (dir) {
  return path.join(__dirname, '../../', dir)
}

// 使用时第二个参数可以忽略
function mkdir (dirpath, dirname) {
  //判断是否是第一次调用
  if (typeof dirname === "undefined") {
    if (fs.existsSync(dirpath)) {
      return;
    } else {
      mkdir(dirpath, path.dirname(dirpath));
    }
  } else {
    //判断第二个参数是否正常，避免调用时传入错误参数
    if (dirname !== path.dirname(dirpath)) {
      mkdir(dirpath);
      return;
    }
    if (fs.existsSync(dirname)) {
      fs.mkdirSync(dirpath)
    } else {
      mkdir(dirname, path.dirname(dirname));
      fs.mkdirSync(dirpath);
    }
  }
}
// 创建临时目录
mkdir(resolve('temp/package'))

// create a file to stream archive data to.
var output = fs.createWriteStream(resolve('temp/package/' + packageList[0].name));
var archive = archiver('zip', {
  zlib: {level: 9} // Sets the compression level.
});
// listen for all archive data to be written
// 'close' event is fired only when a file descriptor is involved
output.on('close', function () {
  console.log(archive.pointer() + ' total bytes');
  console.log('archiver has been finalized and the output file descriptor has closed.');
});
// This event is fired when the data source is drained no matter what was the data source.
// It is not part of this library but rather from the NodeJS Stream API.
// @see: https://nodejs.org/api/stream.html#stream_event_end
output.on('end', function () {
  console.log('Data has been drained');
});
// good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on('warning', function (err) {
  if (err.code === 'ENOENT') {
    // log warning
  } else {
    // throw error
    throw err;
  }
});
// good practice to catch this error explicitly
archive.on('error', function (err) {
  throw err;
});
// pipe archive data to the file
archive.pipe(output);
// append files from a sub-directory, putting its contents at the root of archive
archive.directory('dist/', false);
// finalize the archive (ie we are done appending files but streams have to finish yet)
// 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
archive.finalize();
