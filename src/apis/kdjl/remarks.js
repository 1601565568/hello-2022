import transData from 'web-crm/src/utils/transData'
export default {
  queryPublicTable: {
    url: '/kdjl/remarks/queryPublicTable',
    method: 'post'
  },
  queryPriviteTable: {
    url: '/kdjl/remarks/queryPriviteTable',
    method: 'post'
  },
  queryByMemoPhrase: {
    url: '/kdjl/remarks/queryByMemoPhrase',
    method: 'post',
    transformRequest: transData
  },
  saveOrUpdate: {
    url: '/kdjl/remarks/saveOrUpdate',
    method: 'post'
  },
  deleteById: {
    url: '/kdjl/remarks/deleteById',
    method: 'post',
    transformRequest: transData
  },
  updateMemoStaus: {
    url: '/kdjl/remarks/updateStaus',
    method: 'post',
    transformRequest: transData
  },
  updateMemoType: {
    url: '/kdjl/remarks/updateMemoType',
    method: 'post',
    transformRequest: transData
  },
  updateOrder: {
    url: '/kdjl/remarks/updateOrder',
    method: 'post',
    transformRequest: transData
  }
}
