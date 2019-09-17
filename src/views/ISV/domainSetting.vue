<template>
  <el-dialog
    title="域名配置"
    :visible.sync="dialogVisible"
    width="800px">
    <!-- 弹窗内容 -->
    <el-form label-width="120px"
             class="form-main"
             :model="model"
             ref="form">
      <div class="tmp-tips text-warning"><Icon fontType="el-icon-warning"></Icon>
        第三方平台旗下授权的小程序，只可配置本平台服务器域名列表中的域名，必须以https://开头，多个域名以,隔开
      </div>
      <el-form-item label="request：">
        <el-form-grid size="xlg">
          <el-form-item prop="request">
            <el-input type="textarea" v-model="model.request_domain"></el-input>
          </el-form-item>
        </el-form-grid>
      </el-form-item>
      <el-form-item label="socket：">
        <el-form-grid size="xlg">
          <el-form-item prop="socket">
            <el-input type="textarea" v-model="model.ws_request_domain"></el-input>
          </el-form-item>
        </el-form-grid>
      </el-form-item>
      <el-form-item label="uploadFile：">
        <el-form-grid size="xlg">
          <el-form-item prop="uploadFile">
            <el-input type="textarea" v-model="model.upload_domain"></el-input>
          </el-form-item>
        </el-form-grid>
      </el-form-item>
      <el-form-item label="downloadFile：">
        <el-form-grid size="xlg">
          <el-form-item prop="downloadFile">
            <el-input type="textarea" v-model="model.download_domain"></el-input>
          </el-form-item>
        </el-form-grid>
      </el-form-item>
      <br/><br/>
      <el-form-item label="webViewDomain：">
        <el-form-grid size="xlg">
          <el-form-item prop="webViewDomain">
            <el-input type="textarea" v-model="model.webview_domain"
                      placeholder="小程序业务域名，必须以https://开头，多个域名以,隔开"></el-input>
          </el-form-item>
        </el-form-grid>
      </el-form-item>
    </el-form>
    <!-- 弹窗内容-结束 -->
    <span slot="footer" class="dialog-footer">
        <ns-button @click="dialogVisible = false">取 消</ns-button>
        <ns-save @click="onSave"></ns-save>
      </span>
  </el-dialog>
</template>

<script>
import { getErrorMsg } from '@/utils/toast'
export default {
  name: 'detail',
  data () {
    return {
      dialogVisible: false,
      model: {
        id: -1,
        request_domain: null,
        ws_request_domain: null,
        upload_domain: null,
        download_domain: null,
        webview_domain: null
      }
    }
  },
  methods: {
    // 打开弹框
    openDialog: function (id) {
      let that = this
      that.$http.fetch(that.$api.isv.getDomainInfo, { id: id })
        .then((resp) => {
          that.model = resp.result
        }).catch((resp) => {
          that.$notify.error(getErrorMsg('查询失败', resp))
        })
      that.dialogVisible = true
    },
    // 保存
    onSave: function () {
      let that = this
      that.$http.fetch(that.$api.isv.setModifyDomain, that.model)
        .then((resp) => {
          that.$notify.success('保存成功')
          that.dialogVisible = false
        }).catch((resp) => {
          that.$notify.error(getErrorMsg('查询失败', resp))
        })
    }
  }
}
</script>
