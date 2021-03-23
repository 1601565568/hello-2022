const profilePrefix = 'externalProfile/'
const adPagePrefix = 'AdPage/'
export default {
  // 外部联系人属性添加
  profileAdd: {
    url: `${profilePrefix}add`,
    method: 'post'
  },
  // 外部联系人属性列表
  profileList: {
    url: `${profilePrefix}list`,
    method: 'post'
  },
  // 外部联系人属性列表删除
  profileDelById: {
    url: `${profilePrefix}delById`,
    method: 'get'
  },
  // 外部联系人属性列表刷新
  profileSync: {
    url: `${profilePrefix}sync`,
    method: 'get'
  },
  // 外部联系人属性查看详情
  profileFindById: {
    url: `${profilePrefix}findById`,
    method: 'get'
  },
  // 外部联系人内容透出新建
  adPageAdd: {
    url: `${adPagePrefix}add`,
    method: 'post'
  },
  // 外部联系人内容透出列表
  adPageList: {
    url: `${adPagePrefix}list`,
    method: 'post'
  },
  // 外部联系人创建人列表
  adFoundList: {
    url: `${adPagePrefix}foundList`,
    method: 'get'
  },
  // 外部联系人创建人列表删除
  adDeleteById: {
    url: `${adPagePrefix}deleteById`,
    method: 'get'
  },
  // 外部联系人创建人列表置顶
  adToTop: {
    url: `${adPagePrefix}toTop`,
    method: 'get'
  },
  // 外部联系人创建人详情
  adFindById: {
    url: `${adPagePrefix}findById`,
    method: 'get'
  },
  findGuideListWithShop: {
    url: 'guide/guide/findGuideListWithShop',
    method: 'post'
  },
  uploadBase64File: {
    url: `/core/sgfile/uploadFileBase64/test`,
    method: 'post'
  }
}
