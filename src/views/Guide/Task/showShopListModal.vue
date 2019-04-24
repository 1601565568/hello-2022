
<template>
<!-- 指派门店明细--弹窗  wanrengang 20180803 -->
<div class="addSCBox">
  <el-dialog
  title="指派门店明细"
  :close-on-click-modal=false
  :visible.sync="dialogVisible"
  width="805px"
  :before-close="handleClose">
    <div class="comDialogBoxCon">
      <div class="template-table-search">
        <div class="template-table__bar-more">
          <el-form ref="searchform" label-width="80px"  class="surround-btn"  :inline="true" :model="searchform">
            <el-form-item label="所在区域：" style="margin-right:0;" prop="area">
              <el-form-grid width="300" prop="area">
                <ns-area  :props="searchform.key" @change="onAreaChange" change-on-select v-model="searchform.area"></ns-area>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="门店名称：" prop="shopName">
              <el-input v-model="searchform.shopName" placeholder="请输入门店名称"></el-input>
            </el-form-item>
          </el-form>
          <div class="template-table__more-btn">
            <ns-button type="primary" @click="submitForm('searchform')">搜索</ns-button>
            <ns-button @click="resetForm('searchform')">重置</ns-button>
          </div>
        </div>
      </div>
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
        <!-- <el-table-column prop="managerName" width="86" label="店长"></el-table-column> -->
        <el-table-column prop="guideTotal" width="80" label="分配导购" align='right'></el-table-column>
        <el-table-column  width="80" label="完成度" align='right'>
          <template slot-scope="{row}">
            {{row.completion + '%'}}
          </template>
        </el-table-column>
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
import listPageMixin from '@/mixins/listPage'
import NsArea from 'components/NsArea'
export default {
  mixins: [listPageMixin],
  data () {
    return {
      loading: false, // 防重复提交
      dialogVisible: false,
      dataList: [],
      searchform: {
        // 区域选择相关start
        key: {
          children: 'children',
          label: 'label',
          value: 'label',
          disabled: 'disabled'
        },
        area: [],
        shopName: '',
        date: '', // 年月份,
        type: '1' // 1按月、2按日
      }
    }
  },
  methods: {
    onAreaChange (e) {
      console.log(e)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.submitForm()
    },
    submitForm (formName) {
      // 组装搜索对象
      this.searchObj.start = 0
      this.searchObj.searchMap.province = this.searchform.area[0]
      this.searchObj.searchMap.city = this.searchform.area[1]
      this.searchObj.searchMap.district = this.searchform.area[2]
      this.searchObj.searchMap.shopName = this.searchform.shopName
      this.loadListFun()
    },
    showToggle (id) {
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
  },
  components: {
    NsArea
  }
}
</script>
