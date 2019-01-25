export default {
  queryTableList: {
    url: '/guide/material/queryTableList',
    method: 'post'
  },
  saveMaterial: {
    url: '/guide/material/saveMaterial',
    method: 'post'
  },
  deleteMaterialById: {
    url: '/guide/material/deleteMaterialById',
    method: 'get'
  },
  uploadImage: {
    url: '/core/file/upload/module=material',
    method: 'post'
  },
  batchEditSub: {
    url: '/guide/material/batchEditSub',
    method: 'post'
  },
  queryMaterials: {
    url: '/guide/material/queryMaterials',
    method: 'get'
  },
  batchDeleteMaterial: { // 素材批量删除
    url: '/guide/material/batchDeleteMaterial',
    method: 'post'
  }
}
