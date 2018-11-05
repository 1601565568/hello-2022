const TreeParentSearch = function (data, key, children, name) {
  let Parent = []
  for (let item of (data[children] || [])) {
    if (item[key] === name) {
      Parent = data[children]
      break
    } else {
      let res = TreeParentSearch(item, key, children, name)
      if (res.length) {
        Parent = res
        break
      }
    }
  }
  return Parent
}

export default function (data, key, children, name) {
  let arr = []
  for (let item of (data instanceof Array) ? data : [data]) {
    arr = TreeParentSearch(item, key, children, name)
    if (arr.length > 0) {
      break
    }
  }
  return arr
}
