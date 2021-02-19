/**
 * 渠道管理相关接口
 */
export default {
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
  }
}
