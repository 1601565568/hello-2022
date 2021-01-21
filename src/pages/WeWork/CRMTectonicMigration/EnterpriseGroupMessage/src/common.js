import moment from 'moment/moment'
import emojiTranslate from '@nascent/ecrp-ecrm/src/utils/emojiTranslate'

const pickerOptions = {
  shortcuts: [{
    text: '今日',
    onClick (picker) {
      // 默认 3个月
      const start = new Date(moment().format('YYYY-MM-DD 00:00:00'))
      const end = new Date(moment().format('YYYY-MM-DD 23:59:59'))
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一周',
    onClick (picker) {
      const start = new Date(moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00'))
      const end = new Date(moment().format('YYYY-MM-DD 23:59:59'))
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一个月',
    onClick (picker) {
      const start = new Date(moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00'))
      const end = new Date(moment().format('YYYY-MM-DD 23:59:59'))
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近三个月',
    onClick (picker) {
      const start = new Date(moment().subtract(3, 'months').format('YYYY-MM-DD 00:00:00'))
      const end = new Date(moment().format('YYYY-MM-DD 23:59:59'))
      picker.$emit('pick', [start, end])
    }
  }]
}
const matchType = {
  IMAGE: 'image',
  VIDEO: 'video',
  LINK: 'link',
  TEXT: 'text'
}
const rulesObj = {
  // 朋友圈字数
  CIRCLE_CONTENT_WORD_NUM: 1500,
  CIRCLE_COMMENT_WORD_NUM: 700,
  // 上传文件字节数
  IMGAGE_MAX_NUM: 10485760,
  IMGAGE_MIN_NUM: 5,
  VIDEO_MAX_NUM: 31457280,
  VIDEO_MIN_NUM: 5
}

const getHtmlData = function (data) {
  /* 转换为纯文本 */
  // console.log(emojiTranslate.toText(emojiTranslate.toHtml(data, emojiTranslate.emojiList), emojiTranslate.emojiList))
  // data: 文本数据
  // emojiTranslate.emojiList： 表情列表
  return emojiTranslate.toHtml(data, emojiTranslate.list)
}

// 微信营销活动类型
const MARKETING_TYPE = {
  ENT_GROUP: 5 // 企业群活动
}

export { pickerOptions, matchType, rulesObj, MARKETING_TYPE, getHtmlData }
