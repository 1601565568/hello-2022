<template>
  <el-dialog
    ref="linkDialog"
    width="1000px"
    :visible="visible"
    title="选择二维码海报"
    :show-scroll-x="false"
    :close-on-click-modal="false"
    @open="open"
    @close="close"
    modal-append-to-body
    append-to-body
  >
    <Qrcode v-if="visible" :qrcodeModel="defaultModel" ref='qrcode'/>
    <div slot="footer" class="dialog-footer">
      <ns-button @click="close">取消</ns-button>
      <ns-button @click="confirm" type="primary">确定</ns-button>
    </div>
  </el-dialog>
</template>

<script>
import Qrcode from '@/pages/WeWork/WelcomeCode/components/Qrcode'

export default {
  components: {
    Qrcode
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    content: {
      type: Object,
      default: function () {
        return {
          configId: null, // 海报id
          placard: '', // 海报地址
          title: '' // 海报名称
        }
      }
    }
  },
  data () {
    return {
      defaultModel: {
        configId: null, // 海报id
        placard: '', // 海报地址
        title: '' // 海报名称
      }
    }
  },
  mounted () {
  },
  methods: {
    close () {
      this.defaultModel = {
        configId: null,
        placard: '',
        title: ''
      }
      this.$emit('update:visible', false)
    },
    open () {
      if (this.content) {
        this.defaultModel = this.content
      }
    },
    confirm () {
      const model = this.$refs.qrcode.onSave()
      if (model) {
        this.$emit('confirm', {
          type: 'poster',
          content: {
            title: model.title,
            placard: model.placard,
            configId: model.id
          }
        })
        this.close()
      }
    }
  }
}
</script>

<style>

</style>
