var fs = require("fs")
var path = require("path")



const getDllList = function (list) {

  let dllList = []
  function readDirSync(path){
    var pa = fs.readdirSync(path);
    pa.forEach(function(ele,index){
      var info = fs.statSync(path+"/"+ele)
      if(info.isDirectory()){
        if (list.exclude[ele] !== false) {
          dllList.push(path  + '/' + ele)
        }
      } else if(list.exclude[ele] !== false) {
        dllList.push(path + '/' + ele)
      }
    })
  }
  list.list.forEach((v) => {
    readDirSync(path.join(__dirname,'../node_modules/web-crm/src/', v))
  })
  return dllList
}
module.exports = function (list) {
 return getDllList(list)
}
