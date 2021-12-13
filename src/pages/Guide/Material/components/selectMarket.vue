
<template>
<!-- 新增素材--编辑弹窗  wanrengang 20180731 -->
<div class="selectMarketbox">
  <el-dialog
  title="选择营销活动"
  :close-on-click-modal=false
  :visible.sync="dialogVisible"
  width="800px"
  :before-close="handleClose">
    <div class="template-table">
      <div class="template-table-search">
        <div class="template-table__bar-more">
          <el-form ref="searchform" label-width="80px"  class="surround-btn" :model="searchObj.searchMap"  :inline="true">
            <el-form-item label="活动类型：" prop="type">
              <el-select v-model="searchObj.searchMap.type" placeholder="请选择活动类型">
                <el-option v-for="item in groudList"
                :key="item.type"
                :label="item.name"
                :value="item.type">
                </el-option>
              </el-select>
            </el-form-item>

            <!-- <el-form-item label="活动名称：" prop="content">
              <el-input v-model="searchform.content" placeholder="请输入活动名称" clearable></el-input>
            </el-form-item> -->

          </el-form>
          <div class="template-table__more-btn">
            <ns-button type="primary" @click="submitForm('searchform')">搜索</ns-button>
            <ns-button @click="resetForm('searchform')">重置</ns-button>
          </div>
        </div>
      </div>
    </div>
    <div class="mt10">
      <el-table
        ref="multipleTable"
        :data="dataList"
        v-loading="loading"
        :element-loading-text="$t('prompt.loading')"
        tooltip-effect="dark"
        stripe
        highlight-current-row
        @current-change="selectCurrentChange"
        style="width: 100%"
        >
        <el-table-column  width="30">
          <template slot-scope="scope">
              <el-radio :label="scope.row.activityId" v-model="activityId" ></el-radio>
          </template>
        </el-table-column>
        <!-- <el-table-column  label="活动类型" align="left" >
          <template slot-scope="scope">
            <span :class='scope.row'>{{searchObj.searchMap.type ==2 ?'多人拼团':searchObj.searchMap.type ==3?'满减送':'秒杀'}}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="activityName" label="活动名称" align="left" >
        </el-table-column>
        <el-table-column prop="activityStatus" label="活动状态" align="center" >
          <template slot-scope="scope">
            {{scope.row.activityStatus === 1?'未开始':scope.row.activityStatus === 2?'进行中':scope.row.activityStatus ===
            3?'已结束':'-'}}
          </template>
        </el-table-column>
        <el-table-column label="有效时间 " width="300" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.startTime}} - {{scope.row.endTime}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination v-if="pagination.enable" class="template-table-pagination"
        :page-sizes="pagination.sizeOpts"
        :total="pagination.total"
        :current-page.sync="pagination.page"
        :page-size="pagination.size"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
    </el-pagination>
    <span slot="footer" class="dialog-footer">
      <ns-button @click="handleClose">取 消</ns-button>
      <ns-button type="primary"  @click="saveFun">确定</ns-button>
    </span>
  </el-dialog>
</div>
</template>
<script>
import listPageMixin from '@/mixins/listPage'
import { getErrorMsg } from '@/utils/toast'
export default {
  components: {
  },
  mixins: [listPageMixin],
  props: {
    callBack: Function,
    selectObj: Object
  },
  data () {
    return {
      market: {
        activityId: '',
        guid: '',
        marketType: 0
      },
      loading: false,
      searchObj: {
        searchMap: {
          type: 2
        }
      },
      wechatPageTypeList: [{ name: '商城主页面', id: 1 }, { name: '商品', id: 2 }, { name: '优惠券', id: 3 }, { name: '营销活动', id: 4 }, { name: '自定义页面', id: 5 }],
      wechatPageUrlList: [],
      dialogImageUrl: '',
      groudList: [{ name: '多人拼团', type: 2 }, { name: '满减送', type: 3 }, { name: '秒杀', type: 4 }],
      dialogVisible: false,
      activityId: ''
    }
  },
  methods: {
    selectCurrentChange (currentRow) {
      this.market = currentRow || {}
    },
    showToggle (obj = {}) {
      this.dialogVisible = true
      if (obj.codeTarget && obj.codeTarget.length > 0) {
        this.activityId = obj.codeTarget
      } else {
        this.activityId = ''
      }
      this.loadListFun()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 提交保存
    saveFun () {
      this.market.marketType = this.searchObj.searchMap.type
      this.$props.callBack(Object.assign({}, this.market, { marketType: this.searchObj.searchMap.type }))
      this.handleClose()
    },
    handleClose () {
      this.activityId = ''
      this.dialogVisible = false
      this.$refs.searchform.resetFields()
    },
    async loadListFun () {
      let that = this
      this.loading = true
      await this.$http.fetch(this.$api.guide.material.findMallMarketingList, this.searchObj).then(res => {
        if (res.result.data && res.result.data.length > 0) {
          that.dataList = res.result.data
          that.pagination.total = Number(res.result.total)
        } else {
          that.dataList = null
        }
        if (this.dataList && this.activityId) {
          const isSelect = (item) => item.activityId === this.activityId
          const index = this.dataList.findIndex(isSelect)
          if (index !== -1) {
            this.market = this.dataList[index]
          }
        }
      }).catch((resp) => {
        that.$notify.error(getErrorMsg('查询失败', resp))
      }).finally(() => {
        this.loading = false
      })
    },
    submitForm () {
      this.market = {}
      this.clearSearch()
      this.loadListFun()
    }
  }
}
</script>
<style scoped>
.selectMarketbox .current-row{
  td{
    color: #fff !important;
    background:  #0091FA !important
  }
}
</style>
