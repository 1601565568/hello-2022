const TreeDeepSearch = function (root, key, children, name) {
  if (root[key] === name) {
    delete root[children]
    return [root]
  } else {
    for (let item of (root[children] || [])) {
      let res = TreeDeepSearch(item, key, children, name)
      if (res.length) {
        delete root[children]
        return [...res, root]
      }
    }
    return []
  }
}
export default function (root, key, children, name) {
  return TreeDeepSearch(root, key, children, name)
}
