export const networkImg2Base64 = imgUrl => {
  return new Promise((resolve, reject) => {
    let image = new Image()
    // image.src = imgUrl
    image.crossOrigin = 'Anonymous' // 跨域
    // image.setAttribute('crossOrigin', 'anonymous')
    image.src = imgUrl + '?timeStamp=' + new Date()
    image.onload = function () {
      // 用canvas把图片转成base64
      let canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      let ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0, image.width, image.height)
      try {
        let base64 = canvas.toDataURL('image/png')
        resolve(base64)
        return base64
      } catch (error) {
        // console.log(error, 'error')
        promise.reject(new Error(`浏览器不支持canvas转base64${error}`))
      }
    }
    // image.onerror = function (err) {
    //   //   console.log(err, '1111111111')
    //   //   promise.reject(new Error(`图片加载失败${err}`))
    // }
  })
}

export const getBase64Image = imgUrl => {
  let image = new Image()
  // image.src = imgUrl
  image.crossOrigin = 'Anonymous' // 跨域
  // image.setAttribute('crossOrigin', 'anonymous')
  image.src = imgUrl + '?timeStamp=' + new Date()
  image.onload = function () {
    // 用canvas把图片转成base64
    let canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    let ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0, image.width, image.height)
    try {
      let base64 = canvas.toDataURL('image/png')
      return base64
    } catch (error) {
    }
  }
}
