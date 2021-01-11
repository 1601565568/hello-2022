<template>
    <div>
    <el-dialog title="外部店铺编码" :visible.sync="goodOutIdDialog.visible" :show-scroll-x="false"
               :close-on-click-modal = "false" :before-close="onClose" width="600px" height="400px" :append-to-body="true">
        <el-form>
            <el-form-item>
                <el-tabs v-model="tabs" @tab-click="change">
                    <el-tab-pane label="手动输入" name="first">
                        <el-form class="form-main" placement="left">
                            <el-form-item prop = "targetStr">
                                <el-form-grid size="xlg">
                                    <el-input type="textarea"
                                              :autosize="{ minRows: 5, maxRows: 100}"
                                              v-model = "inputOutId"
                                              placeholder="请输入外部店铺编号">
                                    </el-input>
                                </el-form-grid>
                            </el-form-item>
                            <el-form-item>
                                <el-form-grid>
                                    <div class="tmp-tips text-info"><Icon type="info-circle" theme="outlined" /> 输入多个外部店铺编码用","隔开 </div>
                                </el-form-grid>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="文件导入" name="second">
                        <el-form  class="form-main" placement="left" >
                            <el-form-item label="上传文件：" required>
                                <el-form-grid size="xmd">
                                    <el-upload
                                            ref="file"
                                            :limit-file-list="true"
                                            :file-list="fileList"
                                            :limit="1"
                                            :auto-upload="false"
                                            action=""
                                            :on-success="onUploadSuccess"
                                            :on-error="onUploadError"
                                            :on-remove="onUploadRemove"
                                            :on-change="onChange"
                                            accept=".xlsx,.xls" name="file" >
                                        <ns-button size="small"  type="primary">选择文件</ns-button>
                                        <div slot="tip" class="el-upload__tip" style="width: 500px">
                                            <div class="tmp-tips text-warning"><Icon type="exclamation-circle" theme="outlined" />
                                                您可使用系统提供的模板填写信息并导入.<a class="text-primary" :href=this.download download="">下载模板</a>
                                            </div>
                                        </div>
                                    </el-upload>
                                </el-form-grid>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </el-form-item>
        </el-form>
        <div slot="footer"  class="dialog-footer">
            <ns-button @click="onCloseFilter">{{$t('operating.cancel')}}</ns-button>
            <ns-button @click="onConfirmFilterNew" type="primary">确定</ns-button>
        </div>
    </el-dialog>
    <el-dialog
            title="提示"
            :visible.sync="tipDialog.visible"
            width="500px"
            :append-to-body="true">
        <span>共上传{{tipDialog.all}}个</span><br>
        <span>成功{{tipDialog.success}}个</span><br>
        <span>失败{{tipDialog.fail}}个</span><br>
        <span>失败编码为{{tipDialog.failList}}</span>
        <span slot="footer" class="dialog-footer">
    <ns-button @click="tipDialog.visible = false">{{$t('operating.close')}}</ns-button>
  </span>
    </el-dialog>
    </div>
</template>
<script>

import ElUpload from '@nascent/nui/lib/upload'
import ErrorCode from '@/config/errorCode'
import XLSX from 'xlsx'
export default {
  name: 'NsShopIdDialog',
  data () {
    return {
      goodOutIdDialog: {
        visible: false
      },
      tipDialog: {
        visible: false,
        all: '',
        success: '',
        fail: '',
        failList: ''
      },
      tabs: 'first',
      inputOutId: '',
      inputOutIds: '',
      uploadOutId: [],
      uploadOutIdNew: [],
      fileList: [],
      importSendModel: '',
      goodsOuterId: '',
      goodsOuterIdNew: [],
      download: 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/downloads/ecrp-sg-web/ImportShop/%E5%BA%97%E9%93%BA%E7%BC%96%E7%A0%81%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx'
    }
  },
  components: {
    ElUpload
  },
  methods: {
    onOpenSearch: function () {
      this.goodOutIdDialog.visible = true
    },
    onClose: function () {
      this.goodOutIdDialog.visible = false
    },
    change: function () {
    },
    beforeAvatarUpload: function (file) {
      const istype = file.name.substring(file.name.lastIndexOf('.') + 1) === 'xls' || file.name.substring(file.name.lastIndexOf('.') + 1) === 'xlsx'
      const isSize = file.size / 1024 / 1024 < 1
      if (!istype) {
        this.$notify.error('上传文件只能是xls/xlsx格式!')
      } else if (!isSize) {
        this.$notify.error('上传文件大小不能超过 1MB!')
      }
      return istype && isSize
    },
    onUploadSuccess: function (response) {
      const that = this
      that.fileList = []
      if (response.success) {
        if (response.code === ErrorCode.SUCCESS) {
          const file = {}
          file.name = response.result.download_name
          file.id = response.result.id
          that.fileList.push(file)
        } else {
          that.$notify.error(response.msg)
        }
      }
    },
    onUploadError: function (response) {
      const that = this
      that.$notify.error(response.msg)
    },
    onUploadRemove: function () {
      const that = this
      that.fileList = []
      that.uploadOutId = null
      that.uploadOutIdNew = []
    },
    onCloseFilter: function () {
      this.goodOutIdDialog.visible = false
      this.goodsOuterId = null
      this.goodsOuterIdNew = []
    },
    onConfirmFilter: function () {
      this.goodOutIdDialog.visible = false
      if (this.inputOutId) {
        // 全角逗号转半角
        this.inputOutId = this.inputOutId.replace(/，/ig, ',')
        // 手动输入的商家编码字符串,如果末尾带上逗号则去除最后一个‘,’
        if (this.inputOutId.lastIndexOf(',') === this.inputOutId.length - 1) {
          this.inputOutId = this.inputOutId.substring(0, this.inputOutId.lastIndexOf(','))
        }
        this.inputOutIds = this.inputOutId.split(',')
        for (const i in this.inputOutIds) {
          if (this.inputOutIds[i] === '') {
            this.inputOutIds.splice(i, 1)
          }
        }
        if (this.uploadOutId) {
          this.goodsOuterId = this.uploadOutId.concat(this.inputOutIds)
        } else {
          this.goodsOuterId = this.inputOutIds
        }
      } else {
        this.goodsOuterId = this.uploadOutId
      }
      // 排重
      this.goodsOuterId = [...new Set(this.goodsOuterId)]
      this.goodsOuterId = this.goodsOuterId.join()
      this.$emit('input', this.goodsOuterId)
      this.$emit('searchAndChecked')
      this.goodsOuterId = null
    },
    /**
     * type=1 外部店铺编号
     * type=2 内部店铺id
     */
    onConfirmFilterNew: function () {
      this.goodOutIdDialog.visible = false
      let goodsOuterIdNew = []
      // 有输入外部店铺编码
      if (this.inputOutId) {
        // 全角逗号转半角
        this.inputOutId = this.inputOutId.replace(/，/ig, ',')
        // 手动输入的商家编码字符串,如果末尾带上逗号则去除最后一个‘,’
        if (this.inputOutId.lastIndexOf(',') === this.inputOutId.length - 1) {
          this.inputOutId = this.inputOutId.substring(0, this.inputOutId.lastIndexOf(','))
        }
        this.inputOutIds = this.inputOutId.split(',')
        const inputOutIdsArr = []
        for (const i in this.inputOutIds) {
          if (this.inputOutIds[i]) {
            // this.inputOutIds.splice(i, 1)
            inputOutIdsArr.push({ type: 1, shopId: this.inputOutIds[i] })
          }
        }
        if (this.uploadOutIdNew && this.uploadOutIdNew.length > 0) {
          goodsOuterIdNew = this.uploadOutIdNew.concat(inputOutIdsArr)
        } else {
          goodsOuterIdNew = inputOutIdsArr
        }
      } else {
        goodsOuterIdNew = this.uploadOutIdNew
      }
      // 排重
      if (goodsOuterIdNew.length > 0) {
        const outIdArr = []
        const innerIdArr = []
        const goodsOuterIdNewFinal = []
        for (const item of goodsOuterIdNew) {
          if (item.type === 1 && outIdArr.indexOf(item.type + '&&' + item.shopId) < 0) {
            goodsOuterIdNewFinal.push(item)
          } else if (item.type === 2 && innerIdArr.indexOf(item.type + '&&' + item.shopId) < 0) {
            goodsOuterIdNewFinal.push(item)
          }
          if (item.type === 1) {
            outIdArr.push(item.type + '&&' + item.shopId)
          } else if (item.type === 2) {
            outIdArr.push(item.type + '&&' + item.shopId)
          }
        }
        goodsOuterIdNew = goodsOuterIdNewFinal
      }
      this.$emit('input', goodsOuterIdNew)
      this.$emit('searchAndChecked')
      this.goodsOuterIdNew = []
    },
    // 重置
    onReset: function () {
      this.inputOutId = ''
      this.onUploadRemove()
      this.goodsOuterId = null
    },
    // 解析excel
    async onChange (file) {
      if (!this.beforeAvatarUpload(file)) {
        this.fileList = []
        return
      }
      const _file = file
      const fileReader = new FileReader()
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result
          const workbook = XLSX.read(data, {
            type: 'binary'
          })
          for (const sheet in workbook.Sheets) {
            // 循环读取每个文件
            const sheetArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
            // 若当前sheet没有数据，则continue
            if (sheetArray.length === 0) {
              continue
            }
            const rowTable = []
            for (const item in sheetArray) {
              // 这里的rowTable的属性名注意要与上面表格的prop一致
              // sheetArray的属性名与上传的表格的列名一致
              // console.log('item:' + sheetArray[item])
              // console.log('item2:' + JSON.stringify(sheetArray[item]))
              if (sheetArray[item].店铺ID) {
                rowTable.push({ type: 2, shopId: sheetArray[item].店铺ID + '' })
              }
              if (sheetArray[item].外部店铺编码) {
                rowTable.push({ type: 1, shopId: sheetArray[item].外部店铺编码 + '' })
              }
            }
            // this.uploadOutId = rowTable
            this.uploadOutIdNew = rowTable
          }
        } catch (e) {
          this.$message.warning('文件类型不正确！')
        }
      }
      fileReader.readAsBinaryString(_file.raw)
    },
    // 提示框
    onOpenTip: function (success, all, failList) {
      this.tipDialog.success = success
      this.tipDialog.all = all
      this.tipDialog.fail = all - success
      this.tipDialog.failList = failList
      this.tipDialog.visible = true
    }
  }
}
</script>
