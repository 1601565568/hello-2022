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
      noticeList: [
        {
          value: '一：导购招募成功通知',
          key: 'guideMsgCfg'
        },
        {
          value: '二：门店招募成功通知',
          key: 'shopManageMsgCfg'
        }
      ],
      noticeOptions: [
        { key: 'name', label: '会员姓名' },
        { key: 'time', label: '入会时间' },
        { key: 'memberCard', label: '会员卡号' },
        { key: 'mobile', label: '联系方式' },
        { key: 'shopName', label: '专属门店' }
      ],
      noHaveImg: 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-WM-APP-WEB/img/recruitingHave.png',
      haveImg: 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-WM-APP-WEB/img/recruitingNo.png',
      previewVisin: false,
      btnLoad: false,
      model: {
        mpFollowState: 0,
        guideMsgCfg: {
          state: 0,
          name: 0,
          time: 0,
          memberCard: 0,
          mobile: 0,
          shopName: 0
        },
        shopManageMsgCfg: {
          state: 0,
          name: 0,
          time: 0,
          memberCard: 0,
          mobile: 0,
          shopName: 0
        }
      }
    }
  },
  computed: {
    showImg () {
      return this.model.mpFollowState ? this.haveImg : this.noHaveImg
    }
  },
  created () {
    this.$http.fetch(this.$api.guide.recruitPageConfig.getInfo).then(res => {
      if (res.success) {
        const { mpFollowState, guideMsgCfg, shopManageMsgCfg } = res.result
        if (mpFollowState) this.model.mpFollowState = mpFollowState
        if (guideMsgCfg) this.model.guideMsgCfg = guideMsgCfg
        if (shopManageMsgCfg) this.model.shopManageMsgCfg = shopManageMsgCfg
      }
    })
  },
  methods: {
    handlePreview () {
      this.previewVisin = true
    },
    changeState (key, state) {
      const reset = (val) => {
        for (const col in this.model.guideMsgCfg) {
          if (col !== 'state') {
            this.model[key][col] = val
          }
        }
      }
      if (state === 1) reset(1)
      if (state === 0) reset(0)
    },
    handleSave () {
      this.btnLoad = true
      this.$http.fetch(this.$api.guide.recruitPageConfig.mpFollowStateChange, this.model).then((res) => {
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
