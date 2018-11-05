export default {
  methods: {
    /**
     * 递归获取树的子所有节点id
     * @param data
     * @param node
     * @returns {*[]}
     */
    getTreeChildIds: function (data, node) {
      let ids = [data.id]
      if (!node.isLeaf) {
        for (var i = 0; i < data.children.length; i++) {
          ids = ids.concat(this.getTreeChildIds(data.children[i], node.childNodes[i]))
        }
      }
      return ids
    },
    /**
     *  获取树的所欲父路径
     * @param data
     * @param node
     * @returns {{pathIds: *[], pathNames: *[]}}
     */
    getTreeParentPath: function (data, node) {
      let paths = {
        pathIds: [data.id],
        pathNames: [data.label]
      }
      if (node.parent && node.parent.data.id !== 0) {
        let path = this.getTreeParentPath(node.parent.data, node.parent)
        paths.pathIds = path.pathIds.concat(paths.pathIds)
        paths.pathNames = path.pathNames.concat(paths.pathNames)
      }
      return paths
    },
    /**
     *  节点能否被拖拽
     * @param node
     */
    onAllowDrag: function (node) {
      return node.isLeaf
    },
    /**
     * 能否被拖拽到目标节点
     * @param draggingNode
     * @param dropNode
     * @param type
     * @returns {boolean}
     */
    onAllowDrop: function (draggingNode, dropNode, type) {
      if (dropNode.data.id === 0) {
        return type !== 'prev'
      } else {
        return true
      }
    },
    /**
     * 节点拖拽结束
     * @param draggingNode
     * @param dropNode
     * @param position
     */
    nodeDragEndDeal: function (draggingNode, dropNode, position) {
      // 拖拽是否成功
      if (position !== 'none') {
        let params = {
          id: draggingNode.data.id
        }
        if (position === 'inner') {
          // 拖拽到目标节点下级
          params.parentId = dropNode.data.id
          let ids = this.getTreeParentPath(dropNode.data, dropNode).pathIds
          ids.push(params.id)
          params.path = ids.join('/') + '/'
          params.level = dropNode.level
        } else {
          // 拖拽到目标节点同级
          params.parentId = dropNode.data.parentId
          // 判断拖拽放置节点是否为第一级
          if (dropNode.parent.data.id !== 0) {
            // 递归获取节点的路径
            let ids = this.getTreeParentPath(dropNode.parent.data, dropNode.parent).pathIds
            ids.push(params.id)
            params.path = ids.join('/') + '/'
          } else {
            params.path = dropNode.data.id + '/'
            params.level = dropNode.level - 1
          }
        }
        return params
      }
      return undefined
    }
  }
}
