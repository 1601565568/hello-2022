import apiRequestConfirm from 'utils/apiRequestConfirm'
import transData from 'utils/transData'
export default {
  queryTable: {
    url: '/core/datadictionary/queryTable',
    method: 'post'
  },
  hasCodeAndTypeExist: {
    url: '/core/datadictionary/hasCodeAndTypeExist',
    method: 'post',
    transformRequest: transData
  },
  saveOrUpdate: {
    url: '/core/datadictionary/saveOrUpdate',
    method: 'post'
  },
  deleteById: {
    url: '/core/datadictionary/deleteById',
    method: 'get',
    /**
     * 发起请求前拦截器
     * config 当前API配置
     * params 要向服务器发送的内容
     */
    request: function (config, params) {
      return apiRequestConfirm('删除该数据字典')
    }
  },
  getTypes: {
    url: '/core/datadictionary/getTypes',
    method: 'get'
  },
  queryById: {
    url: '/core/datadictionary/queryById',
    method: 'get'
  }
}
