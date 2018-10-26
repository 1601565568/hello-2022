import transData from 'utils/transData'
export default {
  queryTable: {
    url: '/integral/integralactivity/queryTable',
    method: 'post'
  },
  saveOrUpdate: {
    url: '/integral/integralactivity/saveOrUpdate',
    method: 'post'
  },
  updateACtivityState: {
    url: '/integral/integralactivity/updateACtivityState',
    method: 'post',
    transformRequest: transData
  },
  deleteById: {
    url: '/integral/integralactivity/deleteById',
    method: 'post',
    transformRequest: transData
  },
  queryByActivityName: {
    url: '/integral/integralactivity/queryByActivityName',
    method: 'post',
    transformRequest: transData
  }
}
