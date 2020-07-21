
<template>
<!-- 门店指标--编辑弹窗  wanrengang 20180713 -->
<div>
  <el-dialog
  title="批量设置指标"
  :close-on-click-modal=false
  :visible.sync="dialogVisible"
  :before-close="handleClose"
  width='1200px'>
    <div class="topTip">指标年份:<span class="text-error">{{saveObj.year}}</span>年（您好，重新设置指标后，原来设置的指标都会被清除。）
      <span v-if="saveObj.type <= 0" class="text-error">最多输入两位小数</span>
      <span v-if="saveObj.type > 0" class="text-error">请输入正整数</span>
    </div>
    <el-form label-width='0' :model='shopList[0]' novalidate='novalidate'>
    <el-table
      ref="multipleTable"
      :data="shopList"
      tooltip-effect="dark">
      <el-table-column
        :label="n + '月'"
        align="right"
        v-for='n in 12'
        v-bind:key='n'
        style='width: 110px'>
        <template slot-scope="scope">
          <el-input :disabled="curMonth>n" v-model="scope.row['quota' + n]" type="text"
                    maxlength="10"
                    @input="scope.row['quota' + n]=changeInput(scope.row['quota' + n], n)"
                    @change="scope.row['quota' + n] = inputFunc(scope.row['quota' + n], n)"
                    placeholder="请输入"></el-input>
        </template>
      </el-table-column>
    </el-table>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <ns-button @click="handleClose">取 消</ns-button>
      <ns-button type="primary" :loading="loading" :disabled='loading' @click="saveFun">确 定</ns-button>
    </span>
  </el-dialog>
</div>
</template>
<script>
import validateUtil from '@/utils/validateUtil'

export default {
  props: {
    callBack: Function
  },
  data () {
    return {
      loading: false, // 防重复提交
      saveObj: {
        list: []
      },
      curMonth: 5,
      dialogVisible: false,
      selectedArr: [],
      shopList: [],
      status: null,
      valid: true
    }
  },
  created: function () {},
  methods: {
    changeInput (value) {
      if (parseInt(this.saveObj.type) === 1 || parseInt(this.saveObj.type) === 2) {
        value = value.replace(/[^\d]/g, '')
        return Number(value)
      }
      if (value) {
        if (value.indexOf('.') < 0) {
          return value.replace(/[^\d]/g, '')
        }
        if (value.indexOf('.') === 0) {
          return '0.' + value.replace(/[^\d]/g, '').slice(0, 2)
        }
        let values = value.split('.')
        let size = values.length
        if (size === 1) {
          return values.replace(/[^\d]/g, '')
        }
        if (size > 1) {
          let value1 = values[0]
          let value2 = values[1]
          if (!value1) {
            value1 = 0
          }
          value2 = value2.slice(0, 2)
          return value1.replace(/[^\d]/g, '') + '.' + value2.replace(/[^\d]/g, '')
        }
      }
      return value
    },
    inputFunc (value, month) {
      value = Number(value)
      var _this = this
      var regin = /^-?\d+\.?\d{0,2}$/
      if (parseInt(_this.saveObj.type) === 0) {
        _this.checkNumber(value, month, regin, '最多输入两位小数')
      } else if (parseInt(_this.saveObj.type) === 1) {
        regin = /^(0|[1-9][0-9]*)$/
        _this.checkNumber(value, month, regin, '请输入整数')
      }
      return value
    },
    checkNumber (value, month, regin, msg) {
      if (!regin.test(value)) {
        this.$notify.error(msg)
        this.valid = false
        this.shopList[0]['quota' + month] = 0
      } else {
        this.valid = true
        if (parseInt(this.saveObj.type) === 0) {
          validateUtil.checkDigitalLength(null, 10, null, (Number(value) * 10000).toFixed(0), (error) => {
            if (error) {
              this.$notify.error('最多输入6位数')
              this.valid = false
              this.shopList[0]['quota' + month] = 0
            }
          })
        } else {
          validateUtil.checkDigitalLength(null, 10, null, value, (error) => {
            if (error) {
              this.$notify.error('最多输入10位数')
              this.valid = false
              this.shopList[0]['quota' + month] = 0
            }
          })
        }
      }
    },
    showToggle (data, name) {
      this.status = name
      this.saveObj.type = data.type
      this.saveObj.year = data.year
      this.selectedArr = data.selectedArr
      // 根据年份来控制可输入的范围
      var myDate = new Date()
      var curYear = myDate.getFullYear()
      var curMonth = myDate.getMonth()
      if (parseInt(curYear) > parseInt(data.year)) {
        // 之前的全部不可设置
        this.curMonth = 13
      } else if (parseInt(curYear) === parseInt(data.year)) {
        // 本年
        this.curMonth = curMonth + 1
      } else {
        // 下一年及未来都可以设置
        this.curMonth = 0
      }
      let target
      // 如果是选择一家门店就回显对应的指标
      if (data.selectedArr.length === 1) {
        let sl = JSON.parse(JSON.stringify(data.selectedArr))
        target = sl[0]
      }
      let temp = {}
      for (let i = 1; i <= 12; i++) {
        if (this.status === '0') {
          temp['quota' + i] = target ? this.$numeral(target['quota' + i]).format('0.00') : '0.00'
        } else {
          temp['quota' + i] = target ? this.$numeral(target['quota' + i]).format('0') : '0'
        }
      }
      this.shopList = [
        temp
      ]
      this.dialogVisible = true
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    async saveFun () {
      if (this.valid) {
        this.loading = true
        // 组装选择的门店
        this.saveObj.list = [] // 清空
        this.selectedArr.forEach((value, key) => {
          this.saveObj.list.push({
            id: value.id,
            shopId: value.shopId
          })
        })
        if (this.status === '0') {
          this.saveObj.quota1 = (this.shopList[0].quota1 * 10000).toFixed(2)
          this.saveObj.quota2 = (this.shopList[0].quota2 * 10000).toFixed(2)
          this.saveObj.quota3 = (this.shopList[0].quota3 * 10000).toFixed(2)
          this.saveObj.quota4 = (this.shopList[0].quota4 * 10000).toFixed(2)
          this.saveObj.quota5 = (this.shopList[0].quota5 * 10000).toFixed(2)
          this.saveObj.quota6 = (this.shopList[0].quota6 * 10000).toFixed(2)
          this.saveObj.quota7 = (this.shopList[0].quota7 * 10000).toFixed(2)
          this.saveObj.quota8 = (this.shopList[0].quota8 * 10000).toFixed(2)
          this.saveObj.quota9 = (this.shopList[0].quota9 * 10000).toFixed(2)
          this.saveObj.quota10 = (this.shopList[0].quota10 * 10000).toFixed(2)
          this.saveObj.quota11 = (this.shopList[0].quota11 * 10000).toFixed(2)
          this.saveObj.quota12 = (this.shopList[0].quota12 * 10000).toFixed(2)
        } else {
          this.saveObj.quota1 = this.shopList[0].quota1
          this.saveObj.quota2 = this.shopList[0].quota2
          this.saveObj.quota3 = this.shopList[0].quota3
          this.saveObj.quota4 = this.shopList[0].quota4
          this.saveObj.quota5 = this.shopList[0].quota5
          this.saveObj.quota6 = this.shopList[0].quota6
          this.saveObj.quota7 = this.shopList[0].quota7
          this.saveObj.quota8 = this.shopList[0].quota8
          this.saveObj.quota9 = this.shopList[0].quota9
          this.saveObj.quota10 = this.shopList[0].quota10
          this.saveObj.quota11 = this.shopList[0].quota11
          this.saveObj.quota12 = this.shopList[0].quota12
        }
        await this.$http
          .fetch(this.$api.guide.guide.shopIndexSave, this.saveObj)
          .then(resp => {
            this.$notify.success('保存成功')
          })
          .catch(resp => {
            this.$notify.error('保存失败')
          })
        this.handleClose()
        // 回调刷新列表
        this.$props.callBack()
      }
    },
    handleClose () {
      this.dialogVisible = false
      this.loading = false
    }
  }
}
</script>
<style scoped>
.comDialogBox {
  width: 1000px !important;
}
.topTip {
  line-height: 32px;
  height: 32px;
  text-indent: 24px;
  font-size: 13px;
}
</style>
