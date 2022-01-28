export default {
  queryTaskList: {
    url: '/guide/task/queryTaskList',
    method: 'post'
  },
  getTaskCount: {
    url: '/guide/task/getTaskCount',
    method: 'get'
  },
  getTaskProgress: {
    url: '/guide/task/getTaskProgress',
    method: 'post'
  },
  findShopTaskRanking: {
    url: '/guide/task/findShopRanking',
    method: 'get'
  },
  findGuideTaskRanking: {
    url: '/guide/task/findGuideRanking',
    method: 'get'
  },
  findDailyStatistics: {
    url: '/guide/task/findDailyStatistics',
    method: 'get'
  },
  exportList: {
    url: '/file/export/record/list',
    method: 'post'
  },
  downloadExcelFile: {
    url: '/file/export/record/download',
    method: 'get',
    responseType: 'blob',
    timeout: 600000
  },
  exportExcel: {
    url: '/file/export/record/exportExcel',
    method: 'post'
  },
  isSuccess: {
    url: '/file/export/record/isSuccess',
    method: 'get'
  },
  segmentedDownload: {
    url: '/file/export/record/segmentedDownload',
    method: 'post'
  }
}
