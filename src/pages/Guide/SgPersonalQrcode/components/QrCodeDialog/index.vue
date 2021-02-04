<template>
  <el-dialog title="二维码" width="492px" :visible.sync="visible">
    <DefaultQrCode :baseUrl="baseUrl" :qrcodeUrl="qrcodeUrl" v-if="qrcodeType === 'default'" />
    <span slot="footer" class="dialog-footer">
      <ns-button size="mideum" type="primary" @click="visible = false">确 定</ns-button>
    </span>
  </el-dialog>
</template>

<script>
import api from '@/config/http'
import DefaultQrCode from './DefaultQrCode.vue'
import defaultBgImg from '../../src/images/bgimage.png'
/**
 * 聚合二维码
 */
export default {
  name: 'QrCodeDialog',
  components: {
    DefaultQrCode
  },
  props: [ 'memberManagePlan' ],
  data () {
    return {
      baseUrl: `${api.API_ROOT}/upload`,
      visible: false,
      qrcodeType: 'default', // default custom
      qrcodeUrl: '',
      bgimg: ''
    }
  },
  methods: {
    getQrCode (dataRow) {
      window.console.log('这一行是什么', dataRow)
      if (this.memberManagePlan === 1 && dataRow.type === 0) {
        if (!dataRow.qrcode_url) {
          this.qrcodeUrl = defaultBgImg
        } else {
          this.qrcodeUrl = dataRow.qrcode_url
        }

        this.qrcodeType = 'default'
      } else if (this.memberManagePlan === 2 || (this.memberManagePlan === 1 && row.type === 1)) {
        const baseUrl = window.location.origin
        this.qrcodeUrl = `${window.location.origin}/mobile/aggregationCode.html?guid=${dataRow.guid}&groupId=${dataRow.groupid}`

        if (!dataRow.bgimg) {
          this.bgimg = defaultBgImg
        } else {
          this.bgpic = dataRow.bgimg
        }

        this.qrcodeType = 'custom'
      }

      this.visible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.test {
  color: "red";
}

.qrcode-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    margin-top: 28px;
    width: 222px;
    height: 222px;
  }

  .qrcode-operate {
    margin-top: 16px;
    .qrcode-button {
      width: 103px;
    }
    .qrcode-button:last-child {
        margin-left: 16px;
    }
  }

  .prompt-text {
    display: flex;
    align-items: center;
    margin-top: 2px;
    .yellow-point {
      background: #F2AA18;
      display: inline-block;
      height: 8px;
      width: 8px;
      border-radius: 50%;
      margin-right: 8px;
    }
  }
}
</style>
