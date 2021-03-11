import sohot from '@/assets/sohot.png'
import nothot from '@/assets/nothot.png'

export default {
  data () {
    return {
      tools: [
        { type: 'tag', text: '插入企业微信员工姓名', id: '1', value: '企业微信员工姓名' },
        { type: 'tag', text: '插入客户微信昵称', id: '2', value: '客户微信昵称' },
        { type: 'tag', text: '插入企业微信员工门店', id: '3', value: '企业微信员工门店' }
      ],
      model: {
        content: '',
        rank: 5,
        outList: [],
        isAll: 1,
        mediaList: []
      },
      rules: {},
      btnLoad: false,
      sohot,
      nothot
    }
  },
  computed: {
  },
  methods: {
    inputLength () {

    },
    handleCancel () {

    },
    update () {

    }
  }
}
