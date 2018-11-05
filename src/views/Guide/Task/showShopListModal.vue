
<template>
<!-- 指派门店--弹窗  wanrengang 20180803 -->
<div class="addSCBox">
  <el-dialog
  title="指派门店"
  :close-on-click-modal=false
  :visible.sync="dialogVisible"
  width="800px"
  :before-close="handleClose">
    <div class="comDialogBoxCon">
      <div class="mt10">
    <el-table
      ref="multipleTable"
      :data="dataList"
      :lock-scroll="false"
      v-loading="loading"
      :element-loading-text="$t('prompt.loading')"
      tooltip-effect="dark"
      stripe
      style="width: 100%"
      >
        <el-table-column prop="shopName" label="门店名称"></el-table-column>
        <el-table-column prop="address" label="区域"></el-table-column>
        <el-table-column width="64" label="类型">            
            <template slot-scope="{row}">
                {{row.shopType|shopType}}
            </template>
        </el-table-column>
        <el-table-column  width="84" label="状态">
            <template slot-scope="{row}">
                <span class="text-error" :class="{'text-error':row.shopStatus<0}">{{row.shopStatus|shopStatus}}</span> 
            </template>
        </el-table-column>
        <el-table-column prop="managerName" width="86" label="店长"></el-table-column>
    </el-table>
  </div>
    <!-- 分页 -->
   <el-pagination v-if="pagination.enable" class="template-table-pagination"
      :page-sizes="pagination.sizeOpts"
      :total="pagination.total"
      :current-page="pagination.page"
      :page-size="pagination.size"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
  </el-pagination>
    </div>
    <span slot="footer" class="dialog-footer">
      <ns-button @click="handleClose">关闭</ns-button>
    </span>
  </el-dialog>
</div>
</template>
<script>
import listPageMixin from 'mixins/listPage'
export default {
  mixins: [listPageMixin],
  data () {
    return {
      loading: false, // 防重复提交
      dialogVisible: false,
      dataList: []
    }
  },
  methods: {
    showToggle (id) {
      console.log(id)
      this.searchObj.searchMap.taskId = id
      this.dialogVisible = true
      this.loadListFun()
    },
    // 分组
    async loadListFun  () {
      // 组装选择的门店
      await this.$http
        .fetch(this.$api.guide.taskQueryTaskShopInfo, this.searchObj)
        .then(resp => {
          this.dataList = resp.result.data
          this.pagination.total = parseInt(resp.result.recordsTotal)
        })
        .catch(resp => {
          this.$notify.error(resp.msg)
        })
    },
    handleClose () {
      this.dataList = []
      this.searchObj.start = 0
      this.dialogVisible = false
    }
  }
}
</script>
