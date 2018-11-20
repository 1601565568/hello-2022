
<template>
<!-- 门店指标--编辑弹窗  wanrengang 20180713 -->
<div>
  <el-dialog
  title="批量设置指标"
  :close-on-click-modal=false
  :visible.sync="dialogVisible"
  width="1000px"
  :before-close="handleClose">
    <div class="topTip">指标年份:<span>{{saveObj.year}}</span>年</div>
    <el-table
      ref="multipleTable"
      :data="shopList"
      tooltip-effect="dark">
      <el-table-column
        label="1月"
        align="center"
      >
        <template slot-scope="scope">
          <el-input :disabled="curMonth>1?true:false" v-model="scope.row.quota1" placeholder="请输入"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="2月"
        align="center"
      >
        <template slot-scope="scope">
          <el-input :disabled="curMonth>2?true:false" v-model="scope.row.quota2" placeholder="请输入"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="3月"
        align="center"
      >
        <template slot-scope="scope">
          <el-input :disabled="curMonth>3?true:false" v-model="scope.row.quota3" placeholder="请输入"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="4月"
        align="center"
      >
        <template slot-scope="scope">
          <el-input :disabled="curMonth>4?true:false" v-model="scope.row.quota4" placeholder="请输入"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="5月"
        align="center"
      >
        <template slot-scope="scope">
          <el-input type="number" :disabled="curMonth>5?true:false" v-model="scope.row.quota5" placeholder="请输入"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="6月"
        align="center"
      >
        <template slot-scope="scope">
          <el-input type="number" :disabled="curMonth>=6?true:false" v-model="scope.row.quota6" placeholder="请输入"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="7月"
        align="center"
      >
        <template slot-scope="scope">
          <el-input type="number" :disabled="curMonth>7?true:false" v-model="scope.row.quota7" placeholder="请输入"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="8月"
        align="center"
      >
        <template slot-scope="scope">
          <el-input type="number" :disabled="curMonth>8?true:false" v-model="scope.row.quota8" placeholder="请输入"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="9月"
        align="center"
      >
        <template slot-scope="scope">
          <el-input type="number" :disabled="curMonth>9?true:false" v-model="scope.row.quota9" placeholder="请输入"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="10月"
        align="center"
      >
        <template slot-scope="scope">
          <el-input type="number" :disabled="curMonth>10?true:false" v-model="scope.row.quota10" placeholder="请输入"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="11月"
        align="center"
      >
        <template slot-scope="scope">
          <el-input type="number" :disabled="curMonth>11?true:false" v-model="scope.row.quota11" placeholder="请输入"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="12月"
        align="center"
      >
        <template slot-scope="scope">
          <el-input type="number" :disabled="curMonth>12?true:false" v-model="scope.row.quota12" placeholder="请输入"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <ns-button @click="handleClose">取 消</ns-button>
      <ns-button type="primary" :loading="loading" @click="saveFun">确 定</ns-button>
    </span>
  </el-dialog>
</div>
</template>
<script>
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
      status: null
    }
  },
  created: function () {},
  methods: {
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
      // 如果是选择一家门店就回显对应的指标
      if (data.selectedArr.length === 1) {
        this.shopList = JSON.parse(JSON.stringify(data.selectedArr))
      } else {
        this.shopList = [
          {
            quota1: '',
            quota2: '',
            quota3: '',
            quota4: '',
            quota5: '',
            quota6: '',
            quota7: '',
            quota8: '',
            quota9: '',
            quota10: '',
            quota11: '',
            quota12: ''
          }
        ]
      }
      this.dialogVisible = true
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    async saveFun () {
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
        this.saveObj.quota1 = this.shopList[0].quota1 * 10000
        this.saveObj.quota2 = this.shopList[0].quota2 * 10000
        this.saveObj.quota3 = this.shopList[0].quota3 * 10000
        this.saveObj.quota4 = this.shopList[0].quota4 * 10000
        this.saveObj.quota5 = this.shopList[0].quota5 * 10000
        this.saveObj.quota6 = this.shopList[0].quota6 * 10000
        this.saveObj.quota7 = this.shopList[0].quota7 * 10000
        this.saveObj.quota8 = this.shopList[0].quota8 * 10000
        this.saveObj.quota9 = this.shopList[0].quota9 * 10000
        this.saveObj.quota10 = this.shopList[0].quota10 * 10000
        this.saveObj.quota11 = this.shopList[0].quota11 * 10000
        this.saveObj.quota12 = this.shopList[0].quota12 * 10000
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
        .then(resp => {})
        .catch(resp => {
          this.$notify.error('保存失败')
        })
      this.loading = false
      this.handleClose()
      // 回调刷新列表
      this.$props.callBack()
    },
    handleClose () {
      this.dialogVisible = false
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
.topTip span {
  color: #f00;
}
</style>
