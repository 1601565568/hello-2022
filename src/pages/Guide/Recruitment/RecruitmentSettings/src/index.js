import { getErrorMsg } from '@/utils/toast'
export default {
  data () {
    return {
      stepList: [
        {
          value: 'Step1：消费者添加导购企微为好友，并自动发送招募链接'
        }, {
          value: 'Step2：消费者提交信息注册开卡'
        }, {
          value: 'Step3：消费者关注公众号',
          extra: 'checkbox_button'
        }
      ],
      noHaveImg: 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-WM-APP-WEB/img/recruitingHave.png',
      haveImg: 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-WM-APP-WEB/img/recruitingNo.png',
      previewVisin: false,
      mpFollowState: false,
      btnLoad: false
      // result: {} // 保存初始接口数据不做处理
    }
  },
  computed: {
    showImg () {
      return this.mpFollowState ? this.haveImg : this.noHaveImg
    }
  },
  mounted () {
    this.$http.fetch(this.$api.guide.recruitPageConfig.getInfo).then(res => {
      if (res.success) {
        const { mpFollowState } = res.result
        // this.result = res.result
        this.mpFollowState = !!mpFollowState
      }
    })
  },
  methods: {
    handlePreview () {
      this.previewVisin = true
    },
    handleSave () {
      this.btnLoad = true
      this.$http.fetch(this.$api.guide.recruitPageConfig.mpFollowStateChange, { mpFollowState: +this.mpFollowState }).then((res) => {
        if (res.success) {
          this.$notify.success('修改成功')
        } else {
          this.$notify.error(getErrorMsg('修改失败', res))
        }
        this.btnLoad = false
      }).catch((resp) => {
        this.btnLoad = false
        this.$notify.error(getErrorMsg('修改失败', resp))
      })
    }
  }
}
