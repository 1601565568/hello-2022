var fs        = require('fs');

function readDirRecur(folder, callback) {
  console.log(folder)
  fs.readdir(folder, function(err, files) {
    var count = 0
    var checkEnd = function() {
      ++count == files.length && callback()
    }

    files.forEach(function(file) {
      var fullPath = folder + '/' + file;

      fs.stat(fullPath, function(err, stats) {
        if (stats.isDirectory()) {
          return readDirRecur(fullPath, checkEnd);
        } else {
          /*not use ignore files*/
          if(file[0] == '.') {

          } else {
            fileList.push(fullPath)
          }
          checkEnd()
        }
      })
    })

    //为空时直接回调
    files.length === 0 && callback()
  })
}

var fileList  = []
var timeStart = new Date()

readDirRecur('E:\\workspace\\huaweicloud\\CRM-Enterprise-Web\\build', function(filePath) {
  console.log('done', new Date() - timeStart);
  console.log(fileList);
})
