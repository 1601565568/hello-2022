
<template>
<!-- 分配导购--弹窗  wanrengang 20180803 -->
<div class="guidebox">
  <el-dialog
  :close-on-click-modal=false
  :visible.sync="dialogVisible"
  width="530px"
  :before-close="handleClose">
  <span slot="title">
      <span style="font-size:16px;">分配导购</span> <span style="padding-left:10px;">(<span class="text-error">{{guideTotal}}</span>人,全店{{allGuideTotal}}人)</span>
    </span>
    <div class="comDialogBoxCon"
         v-loading.lock="dialogLoading"
         :element-loading-text="$t('prompt.loading')"
        style='min-height: 165px'>
      <div class="mt10 clearfix">
          <ul class="guideList">
              <li v-for="(item,index) in dataList" :key="index">
                  <div class="imgbox">
                    <img :src="item.image||require('../../../assets/default-guide.png')" alt="">
                    </div>
                  <span>{{item.name}}</span><span v-if="item.sameFlag === 1 && item.work_number">（{{item.work_number}}）</span>
              </li>
          </ul>
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
import listPageMixin from '@/mixins/listPage'
import { getErrorMsg } from '@/utils/toast'
export default {
  mixins: [listPageMixin],
  data () {
    return {
      loading: false, // 防重复提交
      dialogVisible: false,
      allGuideTotal: 0, // 全店导购数
      guideTotal: 0, // 分配的人数
      searchform: {},
      dataList: [],
      dialogLoading: false
    }
  },
  methods: {
    showToggle (taskId, shopId) {
      this.searchObj.searchMap.taskId = taskId
      this.searchObj.searchMap.shopId = shopId
      this.dialogVisible = true
      this.loadListFun()
    },
    // 加载列表
    async loadListFun () {
      this.dialogLoading = true
      await this.$http
        .fetch(this.$api.guide.taskQueryShopGuideList, this.searchObj)
        .then(resp => {
          this.dataList = resp.result.data
          this.pagination.total = parseInt(resp.result.recordsTotal)
          this.guideTotal = parseInt(resp.result.recordsTotal)
          if (resp.result.ext) {
            this.allGuideTotal = resp.result.ext.shopTotal
          }
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
        .finally(() => {
          this.dialogLoading = false
        })
    },
    handleClose () {
      this.dataList = []
      this.searchObj.start = 0
      this.dialogVisible = false
      this.guideTotal = 0
      this.allGuideTotal = 0
    }
  }
}
</script>
<style scoped>
@component-namespace guidebox {
  .guideList {
    padding: 15px 0;
    width: 500px;
    li {
      width: 60px;
      text-align: center;
      margin: 10px 20px;
      font-size: 12px;
      float: left;
      min-height:90px;
      .imgbox {
        width: 50px;
        height: 50px;
        border: 1px solid #f2f2f2;
        border-radius: 50%;
        img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
        }
      }

      span {
        color: #999;
         overflow: hidden;
         width:100%;
        display: inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    list-style: none;
  }
}
</style>
