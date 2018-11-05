import formMixin from 'mixins/form'

export default {
  mixins: [formMixin],
  data: function () {
    return {
      visible11: true,
      visible: false,
      trackVisible: false,
      detailVisible: false,
      tags: {},
      model: {
        smsTemplateId: '',
        mobiles: '',
        smsContent: '',
        smsSignature: ''
      },
      templateParams: {
        type: 4,
        marketingManner: 0
      },
      rules: {
        smsTemplateId: [{required: true, message: '请选择', trigger: 'change'}],
        smsSignature: [{required: true, message: '请选择', trigger: 'change'}],
        smsContent: [{required: true, message: '请输入短信内容', trigger: 'change'}]
      },
      data2: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 11,
          label: '二级 1-1',
          children: [{
            id: 12,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 21,
          label: '二级 2-1'
        }, {
          id: 22,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 31,
          label: '二级 3-1'
        }, {
          id: 32,
          label: '二级 3-2'
        }]
      }, {
        id: 4,
        label: '一级 4',
        children: [{
          id: 41,
          label: '二级 4-1'
        }, {
          id: 42,
          label: '二级 4-2'
        }]
      }, {
        id: 5,
        label: '一级 5',
        children: [{
          id: 51,
          label: '二级 5-1'
        }, {
          id: 52,
          label: '二级 5-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    onCloseNode () {
      var that = this
      setTimeout(function () {
        that.$nextTick(() => {
          if (that.$refs.pageLeft.$el.children[0].children[0].style.width === '99%') {
            that.$refs.pageLeft.$el.children[0].children[0].style.width = '100%'
          } else {
            that.$refs.pageLeft.$el.children[0].children[0].style.width = '99%'
          }
        })
      }, 450)
    }
  },
  created: function () {
  },
  mounted: function () {
    this.$nextTick(() => {
      this.$refs.pageLeft.$el.children[0].style.maxHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 91 + 'px'
    })
  }
}
