var http = require('http');
// require modules
var fs = require('fs');
var moment = require('moment');

const path = require('path')
const packageFile = require('../../package.json')

function resolve(dir) {
  return path.join(__dirname, '../../', dir)
}

/**
 * 读取远程文件
 *
 * @param {String} url
 * @param {Function} cb
 *   - {Error} err
 *   - {Buffer} buf
 */
function readRemoteFile(url, cb) {
  var callback = function () {
    // 回调函数，避免重复调用
    callback = function () {
    };
    cb.apply(null, arguments);
  };
  console.log(url)
  var req = http.get(url, function (res) {
    var b = [];
    res.on('data', function (c) {
      b.push(c);
    });
    res.on('end', function () {
      callback(null, Buffer.concat(b));
    });
    res.on('error', callback);
  });
  req.on('error', callback);
}

// 使用时第二个参数可以忽略
function mkdir(dirpath, dirname) {
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


const updataVersion = (val, time) => {
  let date = new Date()
  let version = val.split('.')
  version[2] = parseInt(version[2]) + 1
  if (time) {
    version[3] = date.getTime()
  } else {
    version.splice(3, 1);
  }
  return {date: moment(date).format('YYYY-MM-DD HH:mm:ss') , version: version.join('.')}
}

readRemoteFile('http://wx-smartcrm.image.alimmdn.com/CRM-Enterprise-Web/package/list.json?v=' + new Date().getTime(), function (err, data) {
  if (err) {
    data = '[{"version": "1.0.0"}]'
  }


  const packageList = JSON.parse(data)

  const versionfn = updataVersion(packageList[0].version, true)
  const fileName = packageFile.name + '-' + versionfn.version + '.zip'

  packageList.splice(0, 0, {
    name: fileName,
    version: versionfn.version,
    lastModified: versionfn.date,
    path: 'http://wx-smartcrm.image.alimmdn.com/CRM-Enterprise-Web/package/' + fileName
  })

  fs.writeFile(resolve('temp/package/list.json'), JSON.stringify(packageList, null, 2), function (err) {
    if (err) throw err
    // return done()
  })
});
