/**
 * 渠道管理相关接口
 */
export default {
  getChannelList: { // 自定义指标
    url: '/Guide/chanel/getChannelList',
    method: 'get'
  },
  findChannelAnalysisChartData: { // 查询渠道分析【图表】数据
    url: '/Guide/chanel/findChannelAnalysisChartData',
    method: 'post'
  },
  findChannelAnalysisList: { // 查询渠道分析【列表】数据（分页）
    url: '/Guide/chanel/findChannelAnalysisList',
    method: 'post'
  },
  findChannelAnalysisDailyList: { //  查询渠道分析【指定渠道】【列表】数据（分页）
    url: '/Guide/chanel/findChannelAnalysisDailyList',
    method: 'post'
  },
  exportChannelAnalysisList: { // 导出渠道统计EXCEL表格数据
    url: '/Guide/chanel/exportChannelAnalysisList',
    method: 'post',
    responseType: 'blob',
    timeout: 600000
  },
  exportChannelAnalysisDailyListExcel: { // 导出渠道明细EXCEL表格数据
    url: '/Guide/chanel/exportChannelAnalysisDailyListExcel',
    method: 'post',
    responseType: 'blob',
    timeout: 600000
  }
}
