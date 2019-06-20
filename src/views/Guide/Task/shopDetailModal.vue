<template>
<!-- 门店任务详情弹窗-->
<div class="shopDetailBox">
  <el-dialog
  :close-on-click-modal=false
  :visible.sync="dialogVisible"
  width="620px"
  :before-close="handleClose">
    <span slot="title">
      <span style="font-size:16px;">任务详情</span> <span style="padding-left:10px;">(<span class="text-error">{{unfinishedTotal}}</span>人未完成，共{{pagination.total}}人)</span>
    </span>
    <div>
      <div class="tit">
        {{initObj.title}}
      </div>
      <div>
        <span>执行日期：{{initObj.startTime}} ~ {{initObj.endTime}}</span>
        <span style="margin-left: 20px" v-if='initObj.runType === 1'>
          <el-date-picker class="dataBox" v-model="queryDate" :editable="false" align="right" type="date" placeholder="选择执行日期" @change='change' :clearable='false'></el-date-picker>
          </span>
      </div>
      <div class="content">
        {{initObj.content}}
      </div>
      <div class="mt10">
    <el-table
      ref="multipleTable"
      :data="dataList"
      v-loading="loading"
      :element-loading-text="$t('prompt.loading')"
      tooltip-effect="dark"
      stripe
      style="width: 100%"
      >
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column label="状态" align="center" width="80">
        <template slot-scope="{row}">
          <span v-if="row.state === 1">执行中</span>
          <span v-if="row.state === 2">已关闭</span>
          <span v-if="row.state === 3">完成</span>
          <span v-if="row.state === 4">已过期</span>
        </template>
      </el-table-column>
      <el-table-column prop="completeTime" label="完成时间"></el-table-column>
      <el-table-column  label="反馈">
        <template slot-scope="{row}">
          <span>{{row.remark}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
    <!-- 分页 -->
   <el-pagination v-if="pagination.enable" class="template-table-pagination"
      :page-sizes="pagination.sizeOpts"
      :total="pagination.total"
      :current-page.sync="pagination.page"
      :page-size="pagination.size"
      layout="total, prev, pager, next"
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
import moment from 'moment'
import listPageMixin from '@/mixins/listPage'
export default {
  mixins: [listPageMixin],
  props: {
    callBack: Function
  },
  data () {
    return {
      loading: false, // 防重复提交
      dialogImageUrl: '',
      queryDate: '',
      unfinishedTotal: '',
      dialogVisible: false,
      initObj: {
        title: '',
        content: '',
        startTime: null,
        endTime: null,
        runType: ''
      },
      searchform: {
        time: []
      },
      dataList: [
        {
          completeTime: '2018-04-15',
          name: '导购姓名',
          remark: '反馈描述',
          state: 1,
          urlJson: ''
        }
      ]
    }
  },
  created: function () {
    // this.findShopList()
  },
  methods: {
    // 提交搜索
    submitForm (formName) {
      // 组装搜索对象
      // this.loadListFun()
    },
    change () {
      this.searchObj.searchMap.queryDate = moment(this.queryDate).format('YYYY-MM-DD')
      this.loadListFun()
    },
    // 加载列表
    async loadListFun (data) {
      this.loading = true
      let searchObj = data || this.searchObj
      await this.$http
        .fetch(this.$api.guide.queryShopTaskExecution, searchObj)
        .then(resp => {
          this.dataList = resp.result.data
          this.unfinishedTotal = resp.result.ext.unfinishedTotal
          this.pagination.total = parseInt(resp.result.recordsTotal)
        })
        .catch(resp => {
          this.$notify.error(resp.msg)
        })
      this.loading = false
      // 总条数
    },
    showToggle (obj) {
      this.initObj.content = obj.content
      this.initObj.title = obj.name
      this.initObj.runType = obj.runType
      this.initObj.startTime = moment(obj.startTime).format('YYYY-MM-DD')
      this.initObj.endTime = moment(obj.endTime).format('YYYY-MM-DD')
      this.dialogVisible = true
      this.searchObj.searchMap.runType = obj.runType
      this.searchObj.searchMap.taskId = obj.id
      if (obj.runType === 1) {
        let myDate = new Date()
        if (myDate > new Date(obj.endTime)) {
          myDate = obj.endTime
        }
        this.queryDate = moment(myDate).format('YYYY-MM-DD')
        this.searchObj.searchMap.queryDate = moment(myDate).format('YYYY-MM-DD')
      }
      this.loadListFun()
    },
    handleClose () {
      this.dialogVisible = false
      this.queryDate = null
    }
  }
}
</script>
<style scoped>
@component-namespace shopDetailBox {
  .tit {
    font-size: 14px;
    font-weight: 700;
    line-height: 26px;
  }
  .time {
    float: right;
  }
  .content {
    padding-top: 10px;
  }
  .dataBox >>> .el-input__inner{
    width: 160px;
    text-align:center;
  }
}
</style>
