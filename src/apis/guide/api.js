export default {
  materialList: {
    // 素材列表
    url: '/guide/material/findList',
    method: 'post'
  },
  materialEdit: {
    // 素材编辑
    url: '/guide/material/saveOrUpdate',
    method: 'post'
  },
  materialDel: {
    // 素材删除
    url: '/guide/material/delete',
    method: 'post'
  },
  materialSetGroud: {
    // 素材设置分组
    url: '/guide/material/setSubdivision',
    method: 'post'
  },
  materialGroudList: {
    // 素材分组列表
    url: '/guide/material/findSubdivisionList',
    method: 'post'
  },
  materialGroudDeit: {
    // 素材分组编辑
    url: '/guide/material/saveOrUpdateSubdivision',
    method: 'post'
  },
  materialGroudDel: {
    // 素材分组删除
    url: '/guide/material/deleteSubdivision',
    method: 'post'
  },
  materialGroudListAll: {
    // 素材分组列表不分页
    url: '/guide/material/findSubdivisionAll',
    method: 'post'
  }

}
