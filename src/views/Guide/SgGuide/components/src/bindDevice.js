import { getErrorMsg } from '@/utils/toast'

export default {
  props: {
    visible: Boolean,
    guide: Object
  },
  data () {
    const originModel = {
      deviceNos: []
    }
    return {
      sVisible: false,
      model: JSON.parse(JSON.stringify(originModel)),
      originModel,
      deviceList: [],
      rules: {
        deviceNos: [
          { required: true, message: '至少选择一个个人号设备', trigger: ['change', 'visible'] }
        ]
      },
      saving: false,
      guideDeviceNos: []
    }
  },
  watch: {
    visible (value) {
      this.sVisible = value
      if (value) {
        this.getBindableYkDeviceList()
        let guideDeviceNos = this.guide.deviceNos ? this.guide.deviceNos.split(',') : []
        this.guideDeviceNos = guideDeviceNos
        this.model.deviceNos = JSON.parse(JSON.stringify(guideDeviceNos))
      }
    }
  },
  mounted () {
    this.sVisible = this.visible
  },
  methods: {
    onClose () {
      this.$emit('update:visible', false)
      this.saving = false
      // 还原数据和表单验证
      this.model = JSON.parse(JSON.stringify(this.originModel))
      this.$refs.saveForm.resetFields()
    },
    getBindableYkDeviceList () {
      this.$http.fetch(this.$api.guide.guideDevice.getBindableYkDeviceList, {
        guideId: this.guide.id
      }).then(data => {
        this.deviceList = Object.assign([], data.result)
      }).catch(error => {
        this.deviceList = []
        this.$notify.error(getErrorMsg('获取个人号设备列表出现异常', error))
      })
    },
    bindDevice () {
      this.$refs.saveForm.validate(valid => {
        if (valid) {
          this.saving = true
          const n = this.model.deviceNos.sort()
          const o = this.guideDeviceNos.sort()
          // const ns = n.join(',')
          // const os = o.join(',')
          //
          // if (ns === os) {
          //   // 如果新旧设备相同则跳过
          //   return
          // }
          // 只允许新增设备，不允许解绑设备
          for (let i in o) {
            let deviceNo = o[i]
            if (n.indexOf(deviceNo) < 0) {
              this.$notify.error('不允许解绑设备' + deviceNo)
              this.saving = false
              return
            }
          }
          this.$http.fetch(this.$api.guide.guideDevice.bind, Object.assign(this.model, { guideId: this.guide.id })).then(data => {
            this.deviceList = Object.assign([], data.result)
          }).then(data => {
            this.$notify.success('设备绑定成功')
            this.sVisible = false
            this.$emit('reload')
          })
            .catch(error => {
              this.saving = false
              if (error === 'cancel') {
                return
              }
              this.$notify.error(getErrorMsg('绑定个人号设备出现异常', error))
            })
        }
      })
    }
  }
}
