<template>
  <div class="drawer">
    <ElScrollbar ref="fullScreen">
      <div class="nav">
      <div class="header">
        {{ guideName }}
      </div>
      <div class="block">
        <div class="taskOverview-detail__data-item">
          <p class="data-item__title">分配客户</p>
          <span class="data-item__num">{{
            isHaveGroup ? extData.customerTotal : "-"
          }}</span>
          <span class="data-item__icon distributionGuide">
            <Icon
              type="distributionguide"
              class="distributionguideIcon"
              style="color: #905ee6"
            />
          </span>
        </div>
        <div class="taskOverview-detail__data-item">
          <p class="data-item__title">联系中客户</p>
          <span class="data-item__num">{{
            isHaveGroup ? extData.customerFollowingNum : "-"
          }}</span>
          <span class="data-item__icon distributionGuideA">
            <Icon type="distributionguide" class="distributionguideIcon" />
          </span>
        </div>
        <div class="taskOverview-detail__data-item">
          <p class="data-item__title">跟进成功客户</p>
          <span class="data-item__num">{{
            isHaveGroup ? extData.customerFollowNum : "-"
          }}</span>
          <span class="data-item__icon distributionGuideB">
            <Icon
              type="distributionguide"
              class="distributionguideIcon"
              style="color: #5ec920"
            />
          </span>
        </div>
        <div class="taskOverview-detail__data-item">
          <p class="data-item__title">跟进进度</p>
          <span class="data-item__num">{{
            isHaveGroup ? extData.followProgress : "-"
          }}</span>
          <span class="data-item__icon degreeCompletion">
            <Icon type="degreecompletion" class="degreecompletionIcon" />
          </span>
        </div>
      </div>
      <div class="export">
        <el-form class="form-inline_top" :inline="true">
          <el-form-item label="跟进状态：" class="el-form__change">
            <el-select
              v-model="followType"
              placeholder="请选择"
              @change="
                (value) => {
                  changeStatus(value);
                }
              "
            >
              <el-option
                v-for="item in statusOptionList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <NsButton @click="exportData">导出文件</NsButton>
      </div>
      </div>
      <div class="drawer-table">
        <el-table
          ref="table"
          :data="tableData"
          resizable
          v-loading.lock="table.loadingtable"
          style="width: 100%"
          :element-loading-text="$t('prompt.loading')"
          @sort-change="$orderChange$"
        >
          <el-table-column prop="customerName" label="会员姓名" align="center">
            <template slot-scope="scope">
              <ns-sg-sensitive-button type="simple" :defaultText="true" :encryptData="scope.row.encCustomerName || '-'" :sensitiveData="scope.row.customerName || '-'"></ns-sg-sensitive-button>
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="会员手机号">
             <template slot-scope="scope">
                <ns-sg-sensitive-button type="phone" :defaultText="true" :encryptData="scope.row.encMobile" :sensitiveData="scope.row.mobile"></ns-sg-sensitive-button>
              </template >
          </el-table-column>
          <el-table-column align="left" label="跟进状态">
            <template slot-scope="scope">
              <div  v-if="scope.row.followType === 0">待跟进</div>
              <div  v-if="scope.row.followType === 1">跟进完成</div>
              <div  v-if="scope.row.followType === 2">联系中</div>
            </template>
          </el-table-column>
          <el-table-column align="left" prop="customerTotal" label="联系方式">
            <template slot-scope="scope">
              <div v-if="scope.row.phoneCount !== '0'">
                {{ `电话（${scope.row.phoneCount}）${scope.row.wechatCount !== '0'? '、':'' }`
                }}
              </div>
              <div v-if="scope.row.wechatCount !== '0'">
                {{ `企业微信（${scope.row.wechatCount}）` }}
              </div>
              <div v-if="scope.row.phoneCount === '0'&& scope.row.wechatCount === '0'">-</div>
            </template>
          </el-table-column>
          <el-table-column align="left" prop="followTime" label="最近一次联系时间">
            <template slot-scope="scope">
              {{ scope.row.followTime || "-" }}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="跟进记录" width="260px">
            <template slot-scope="scope">
              <div class="spanStyle">
                <div class="remark">
                  {{ scope.row.remark || "-" }}
                </div>
                <span  v-if="scope.row && !scope.row.urlJson && scope.row.remark" title="点击查看全部" @click="goDetail(scope.row)">详情</span>
                <div class="urkJsonFather">
                 <div v-if="scope.row && scope.row.urlJson" class="urkJsonimageWarpper">
                    <div
                    class="urkJsonimage"
                    v-for="(item, index) in formatUrlJson(scope.row.urlJson)"
                    :key="index"
                  >
                    <img :src="item" />
                  </div>
                  <span  title="点击查看全部" @click="goDetail(scope.row)">详情</span>
                 </div>

                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        v-if="pagination.enable"
        class="drawer-footer"
        :page-sizes="pagination.sizeOpts"
        :total="pagination.total"
        :current-page="pagination.page"
        :page-size="pagination.size"
        :pager-count="5"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="$sizeChange$"
        @current-change="$currentChange$"
      />
    </ElScrollbar>

    <el-drawer
      title=""
      size="80%"
      :visible.sync="drawerVisible"
      direction="rtl"
      :append-to-body="true"
    >
      <followRecord
        v-if="drawerVisible"
        :runType="runType"
        :draw="isHaveGroup"
        :followType ="followTypeItem"
        :guideId="guideId"
        :queryDate="queryDate"
        :shopId="shopId"
        :taskId="id"
        :subgroupCustomerId="subgroupCustomerId"
      />
    </el-drawer>
    <NsPreview ref="NsPreview" :appendToBody="true"></NsPreview>
  </div>
</template>

<script>
import scrollHeight from '@nascent/ecrp-ecrm/src/mixins/scrollHeight'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import ElDrawer from '@nascent/nui/lib/drawer'
import NsPreview from '@/components/NsPreview'
import { getErrorMsg } from '@/utils/toast'
import followRecord from './followRecord'
import { API_ROOT } from '@/config/http.js'
import log from '@/apis/weWork/log'
export default {
  props: {
    id: {
      type: String
    },
    shopId: {
      type: String
    },
    runType: {
      type: Number,
      default: 0
    },
    guideName: {
      type: String,
      default: ''
    },
    guideId: {
      type: Number,
      default: null
    },
    isHaveGroup: {
      type: Number,
      default: 0
    },
    queryDate: {
      type: String,
      default: null
    },
    shopName: {
      type: String
    },
    taskName: {
      type: String
    }
  },
  mixins: [tableMixin, scrollHeight],
  components: {
    NsPreview,
    ElDrawer,
    followRecord
  },
  data () {
    const pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    const tableButtons = [
      {
        func: function (data) {
          console.log(data)
        },
        icon: '$.noop',
        name: '查看详情',
        auth: '',
        visible: ''
      }
    ]
    return {
      // 页面滚动条内容高度配置
      scrollBarDeploy: {
        ref: 'fullScreen', // 页面滚动条ref的名称
        excludeHeight: 0
      },
      subgroupCustomerId: null,
      pagination: pagination,
      drawerVisible: false,
      tableData: [],
      table: {
        loadingtable: true,
        table_buttons: tableButtons,
        quickSearchMap: {}
      },
      followType: null,
      followTypeItem: null,
      extData: {},
      statusOptionList: [
        {
          label: '全部',
          value: null
        },
        {
          label: '待跟进',
          value: 0
        },
        {
          label: '跟进完成',
          value: 1
        },
        {
          label: '联系中',
          value: 2
        }
      ]
    }
  },
  methods: {
    init () {
      this.queryTask()
      this.getStatisticalInfo()
    },
    getStatisticalInfo () {
      const params = {
        draw: this.isHaveGroup,
        length: this.pagination.size,
        start: (this.pagination.page - 1) * this.pagination.size,
        searchMap: {
          followType: this.followType,
          guideId: this.guideId,
          queryDate: this.queryDate,
          shopId: this.shopId,
          taskId: this.id
        }
      }
      this.$http
        .fetch(this.$api.guide.statisticsSubGroupCustomerMsg, params)
        .then((resp) => {
          if (resp.success) {
            this.extData = this.isHaveGroup && resp.result
          }
        })
        .catch((resp) => {
          this.$notify.error(getErrorMsg('获取统计会员信息失败', resp))
        })
    },
    queryTask () {
      this.table.loadingtable = true
      // 这个接口还可以接收三个参数，orderDir orderKey searchValue 暂时用不到
      const params = {
        draw: this.isHaveGroup,
        length: this.pagination.size,
        start: (this.pagination.page - 1) * this.pagination.size,
        searchMap: {
          followType: this.followType,
          guideId: this.guideId,
          queryDate: this.queryDate,
          shopId: this.shopId,
          taskId: this.id
        }
      }
      this.$http
        .fetch(this.$api.guide.querySubGroupCustomerMsg, params)
        .then((resp) => {
          if (resp.success) {
            // console.log(resp, this.isHaveGroup, 'resp')
            this.tableData = resp.result.data
            this.pagination.total = parseInt(resp.result.recordsTotal)
            this.table.loadingtable = false
          }
        })
        .catch((resp) => {
          this.$notify.error(getErrorMsg('查看导购任务详情失败', resp))
        })
    },
    // 分页功能
    $currentChange$ (data) {
      this.pagination.page = data
      this.queryTask()
    },
    $sizeChange$ (data) {
      this.pagination.size = data
      this.queryTask()
    },
    formatUrlJson (urlJson) {
      let arr = urlJson
      if (arr.length <= 4) {
        return arr
      } else {
        return arr.slice(0, 4)
      }
    },
    goDetail (data) {
      this.followTypeItem = data.followType
      this.subgroupCustomerId = data.subgroupCustomerId
      this.drawerVisible = true
    },
    // 导出
    exportData () {
      if (this.tableData.length === 0) {
        this.$notify.error('当前没有匹配的数据项')
        return
      }
      const sendParams = {
        taskId: this.id,
        exportType: 53,
        shopId: this.shopId,
        guideId: this.guideId,
        shopName: this.shopName,
        guideName: this.guideName,
        taskName: this.taskName,
        queryDate: this.queryDate,
        followType: this.followType
      }
      this.$http
        .fetch(this.$api.guide.task.exportExcel, sendParams)
        .then((resp) => {
          this.$notify.success('文件已导入下载中心')
        })
        .catch((resp) => {
          this.$notify.error(resp.msg || '导出报错，请联系管理员')
        })
    },
    changeStatus (value) {
      this.pagination.page = 1
      this.queryTask()
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>
@import "@components/NewUi/styles/reset.css";
@import "@theme/variables.pcss";
@component-namespace drawer {
  @b table {
    padding-top: 16px;
    &:before {
      background-color: #e8e8e8;
    }
    >>> tr {
      font-size: 14px;
    }
    >>> th {
      background-color: #f5f5f5;
      padding: 9px 0;
      border-color: #e8e8e8;
      &:first-child .cell {
        padding-left: 25px;
      }
      &:not(:last-child) .cell:after {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        content: " ";
        border-left: 1px solid #e8e8e8;
      }
      .cell {
        padding: 0 9px;
      }
    }
    >>> td {
      padding: 12px 0;
      border-color: #e8e8e8;
      &:first-child .cell {
        padding-left: 25px;
      }
    }
    >>> .table-content {
      img {
        width: 32px;
        height: 32px;
        border-radius: 3px;
        margin-right: 4px;
        & + img {
          margin-left: 4px;
        }
      }
    }
      >>> .remark {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: pre-line;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .urkJsonimageWarpper {
      margin-top: 8px;
      display: flex;
      align-items: flex-end;
    }
    .urkJsonimage {
      width: 32px;
      height: 32px;
      margin-right: 8px;
      border-radius: 2px;
    }
    .urkJsonimage img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .urkJsonimage:last-child {
      margin-right: 0px !important;
    }
    .remake-warpper {
      display: flex;
      align-items: center;
    }
    .spanStyle span {
      cursor: pointer;
      display: inline-block;
      font-size: 14px;
      color: #0094fc;
    }
  }
  @b footer {
    padding: 16px;
    box-shadow: none;
    >>> .el-pagination__total {
      font-size: 14px;
      color: #262626;
      line-height: 30px;
    }
    >>> .el-select .el-input .el-input__inner {
      height: 32px;
      line-height: 32px;
    }
    >>> .el-pagination__sizes .el-input .el-input__inner {
      font-size: 14px;
    }
     >>>.btn-prev .el-icon {
      font-size: 16px;
      margin-top: 2px;
    }
    >>>.btn-next .el-icon {
      font-size: 16px;
      margin-top: 2px;
    }
    >>> .el-pager li {
      padding: 0;
      font-size: 14px;
      width: 32px;
      height: 32px;
      line-height: 32px;
      border: 1px solid rgba(217, 217, 217, 1);
      border-radius: 2px;
      box-sizing: border-box;
      margin-right: 8px;
      min-width: 32px;
    }
    >>> .el-pager li.active {
      border: none;
    }
    >>> .el-pagination__jump{
      font-size: 14px;
    }
    >>>.el-pagination__editor.el-input{
      width: 50px;
      height: 32px;
      border: 1px solid rgba(217,217,217,1);
      border-radius: 2px;
      box-sizing: border-box;
      margin:0 8px
    }
    >>>.el-input.el-input--small .el-input__inner{
      border: none;
    }
  }
}
>>> .el-drawer__header {
  margin-bottom: 0;
  display: block;
}
.clientMain {
  /* height: 100vh;
  overflow-y: auto; */
}
.nav {
  width: 100%;
  .header {
    width: 100%;
    height: 56px;
    font-size: 16px;
    color: #262626;
    line-height: 56px;
    font-weight: 500;
  }
  .block {
    width: 100%;
    /* padding: 0 16px; */
    margin: 16px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .taskOverview-detail__data-item {
      &:last-child {
        margin-right: 0;
      }
      flex: 1;
      min-height: 90px;
      margin-right: 17px;
      position: relative;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      padding: 17px 24px;
      .data-item__title {
        color: #8c8c8c;
        line-height: 22px;
        .data-item__title-icon {
          cursor: pointer;
        }
      }
      .data-item__num {
        margin-top: 8px;
        font-size: 24px;
        color: #262626;
        line-height: 32px;
      }
      .data-item__icon {
        position: absolute;
        top: 50%;
        right: 24px;
        margin-top: -24px;
        display: inline-block;
        width: 48px;
        height: 48px;
        padding: 11px;
        background: #fff6e6;
        border-radius: 100%;
        &.distributionStore {
          background: #f2f9fe;
        }
        &.distributionGuide {
          background: #f7f0ff;
        }
        &.distributionGuideA {
          background: #fff4e6;
        }
        &.distributionGuideB {
          background: #edfae1;
        }
        &.distributionGuideC {
          background: #edfae1;
        }
        &.degreeCompletion {
          background: #edf9e8;
        }
        img {
          width: 26px;
          height: 26px;
        }
      }
    }
    .distributionStoreIcon {
      font-size: 26px;
      color: rgb(71, 146, 249);
    }
    .distributionguideIcon {
      font-size: 26px;
      color: rgb(243, 174, 17);
    }

    .degreecompletionIcon {
      font-size: 26px;
      color: rgb(65, 197, 0);
    }
  }
  .export {
    display: flex;
    justify-content: space-between;
    /* margin-bottom: 5px; */
    >>> .el-form-item {
      /* width: 160px; */
      height: 32px;
      font-size: 14px;
      margin: 0!important;
      color: #595959;
    }
    .el-form__change {
      /* width: 143px;
    height: 32px; */
      box-sizing: border-box;
      & >>> .el-input__inner {
        max-width: 88px;
      }
    }
  }
}
</style>
