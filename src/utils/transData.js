/**
 * data 将要转为URL参数字符串的对象
 */

export default function (data) {
  let dataArr = []
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      if (data[key] instanceof Array) {
        data[key].map(item => {
          dataArr.push(key + '=' + encodeURIComponent(item))
        })
      } else {
        dataArr.push(key + '=' + encodeURIComponent(data[key]))
      }
    }
  }
  return dataArr.join('&')
}
