const transDataTree = function (data) {
  let newData = []
  data.map((v) => {
    let temp = {value: v.id, label: v.label}
    if (v.children && v.children.length > 0) {
      temp.children = transDataTree(v.children)
    }
    newData.push(temp)
  })
  return newData
}

export default function (data) {
  return transDataTree(data)
}
