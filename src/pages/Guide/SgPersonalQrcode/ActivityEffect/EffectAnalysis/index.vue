<template>
  <div class="analysis-container">
    <div class="data-statistics">
      <div class="box-header">
        <h3>数据统计</h3>
      </div>
      <div class="data-statistics-content">
        <DataCard
          title="参与员工总数"
          tip="此聚合码的所有员工"
          :count="dataStatistics.employeeSum"
          color="linear-gradient(269deg, #4EB3FC 0%, #0091FA 100%)"
        />
        <DataCard
          title="当前好友总数"
          tip="通过扫此聚合码添加好友总数"
          :count="dataStatistics.inviteFriendSum"
          color="linear-gradient(270deg, #A0E35E 0%, #67C230 100%)"
        />
        <DataCard
          title="新增好友总数"
          tip="筛选期间内，通过扫此聚合码添加好友总数"
          :count="dataStatistics.inviteFriendSumByDate"
          color="linear-gradient(270deg, #F7BD5B 0%, #F49F10 100%)"
        />
      </div>
    </div>
    <div class="employee-details">
      <div class="box-header">
        <h3>员工明细</h3>
        <div class="adder-tool-bar">
          <div class="adder-owners">
            <span class="owners-label">所属员工：</span>
            <NsGuideDialog :selfBtn='true' :appendToBody='true' :isButton="false" :auth="false" type="primary" btnTitle="" dialogTitle="选择员工" v-model="model.guideIds" @input="searchform">
              <template slot='selfBtn'>
                <div class="owners-select">
                  <span>{{(model.guideIds && model.guideIds.length)?`已选择${model.guideIds.length}个员工`:'全部'}}</span>
                  <Icon type="geren" class="select-icon"/>
                </div>
              </template>
            </NsGuideDialog>
          </div>
          <el-input v-model="model.employeeName" placeholder="请输入员工姓名" @keyup.enter.native="searchform">
            <Icon type="ns-search-copy" slot="suffix" class='search-icon el-input__icon' @click="searchform"></Icon>
          </el-input>
          <ns-button size="medium" class="export-cvs-btn" @click="exportFile">导出文件</ns-button>
        </div>
      </div>
      <div class="employee-table">
        <el-table
          style="width: 100%;"
          class="table-form_reset"
          row-class-name="employee-table_row"
          header-cell-class-name="employee-talbe-header-cell"
          :data="_data._table.data"
          @sort-change="sortChange"
        >
          <el-table-column
            prop="employeeName"
            label="员工姓名">
          </el-table-column>
          <el-table-column
            prop="employeeNumber"
            label="工号">
            <template slot-scope="scope">
              {{ scope.row.employeeNumber ? scope.row.employeeNumber : '-' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="employeeMobile"
            label="手机号">
             <template slot-scope="scope">
              {{ scope.row.employeeMobile ? scope.row.employeeMobile : '-' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="offlineShops"
            label="工作门店"
            width="316">
            <template slot-scope="scope">
              <div class="offline-shop-content">
                <span class="scope-store-text">
                  {{scope.row.offlineShops.length ? scope.row.offlineShops.join('；') : '-'}}
                </span>
                <el-popover
                  v-if="scope.row.offlineShops.length"
                  placement="top-start"
                  class="item"
                  :title="`工作门店（${scope.row.offlineShops.length}）`"
                  trigger="hover"
                  :content="scope.row.offlineShops.join('；')">
                  <span class="scope-name_tip" slot="reference">共{{scope.row.offlineShops.length}}个</span>
                  <div style="max-width: 400px">
                    {{scope.row.offlineShops.join('；')}}
                  </div>
                </el-popover>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="inviteFriendCount"
            label="添加好友数"
            sortable="custom">
            <template slot-scope="scope">
              <!-- <span class="scope-name_tip">{{scope.row.inviteFriendCount}}</span> -->
              {{scope.row.inviteFriendCount}}
            </template>
          </el-table-column>
      </el-table>
      </div>
      <el-pagination
        v-if="_data._pagination.enable"
        class="template-table__pagination"
        :page-sizes="_data._pagination.sizeOpts"
        :total="_data._pagination.total"
        :current-page="_data._pagination.page"
        :page-size="_data._pagination.size"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="$sizeChange$"
        @current-change="$pageChange$">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import NsGuideDialog from '@/components/NsGuideDialog'
import DataCard from './DataCard'
import common from '../../../../../apis/core/common'

/**
 * 效果分析页面
 */
export default {
  components: {
    NsGuideDialog,
    DataCard
  },
  mixins: [tableMixin],
  props: [ 'searchDate' ],
  watch: {
    async searchDate (times) {
      if (times !== null) {
        this.model.startTime = times[0]
        this.model.endTime = times[1]
      } else {
        this.model.startTime = ''
        this.model.endTime = ''
      }

      await this.statisticsCount()
      this.searchform()
    }
  },
  data () {
    return {
      url: this.$api.guide.sgPersonalQrcode.getQrCodeEffectList,
      dataStatistics: {
        employeeSum: '-',
        inviteFriendSum: '-',
        inviteFriendSumByDate: '-'
      },
      model: {
        guid: this.$route.params.guid,
        guideIds: [],
        employeeName: '',
        startTime: this.searchStartTime,
        endTime: this.searchEndDateTime,
        friendOrder: 'desc'
      },
      seachEmployeeName: ''
    }
  },
  mounted () {
    this.statisticsCount()
    this.searchform()
  },
  methods: {
    searchform () {
      this.$searchAction$()
    },
    async statisticsCount () {
      const res = await this.$http.fetch(this.$api.guide.sgPersonalQrcode.getQrcodeStatisticsCount, {
        guid: this.$route.params.guid,
        startTime: this.model.startTime,
        endTime: this.model.endTime
      })
      if (res.success) {
        this.dataStatistics = res.result
        this.test = res.result.inviteFriendSumByDate
      } else {
        this.$notify.error('获取数据统计失败')
      }
    },
    sortChange (data) {
      if (data.order === 'ascending') {
        this.model.friendOrder = 'asc'
      } else if (data.order === 'descending') {
        this.model.friendOrder = 'desc'
      } else {
        this.model.friendOrder = 'asc'
      }
      this.searchform()
    },
    checkTableDataExists () {
      if (!this._data || !this._data._table || !this._data._table.data || this._data._table.data.length < 1) {
        this.$notify.error('当前没有匹配的数据项')
        return true
      }
      return false
    },
    exportFile () {
      if (this.checkTableDataExists()) {
        return false
      }

      let param = this.$generateParams$()
      param.searchMap.type = 1
      const searchMap = param.searchMap || {}
      const params = {
        ...searchMap,
        exportType: 22
      }
      this.$http.fetch(this.$api.guide.task.exportExcel, params).then((resp) => {
        this.$store.dispatch({
          type: 'down/downAction',
          status: true,
          top: 380,
          right: 60
        })
      }).catch((resp) => {
        this.$notify.error(resp.msg || '导出报错，请联系管理员')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../styles/table-reset.css";
@import "../styles/toolbar-reset.css";

.analysis-container {
  .data-statistics {
    margin-top: 16px;
    width: 100%;
    height: 216px;
    background: #fff;
    border-radius: 4px;
    .data-statistics-content {
      margin: 16px 8px 0;
      display: flex;
      justify-content: space-evenly;
    }
  }

  .box-header {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    h3 {
      font-size: 16px;
      line-height: 56px;
      padding-left: 16px;
      color: #262626;
      font-weight: bold;
    }

    .adder-tool-bar {
      display: flex;
      align-items: center;
      margin-right: 16px;
      .adder-owners {
        position: relative;
        width: 230px;
        height: 32px;
        font-size: 14px;
        box-sizing: border-box;
        border: 1px solid #D9D9D9;
        border-radius: 4px;
        margin: 0 16px;
        display: flex;
        align-items: center;
        .owners-label {
          color: #606266;
          padding-left: 8px;
        }
        .owners-select {
          display: flex;
          align-items: center;
          cursor: pointer;
          span {
            display: inline-block;
            width: 60px;
            white-space: nowrap;
            color:#262626;
            font-size: 14px;
          }
          .select-icon {
            display: inline-block;
            position: absolute;
            top: 8px;
            right: 8px;
            color:#C0C4CC;
          }
        }
      }
      .export-cvs-btn {
        margin-left: 16px;
      }
    }
  }

  .employee-details {
    margin-top: 16px;
    width: 100%;
    background: #fff;
    border-radius: 4px;
    .employee-table {
      width: calc(100% - 32px);
      margin: 0 auto;

      .offline-shop-content {
        display: flex;
        .scope-store-text {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .scope-name_tip {
        color: #0091FA;
        display: block;
        min-width: 55px;
      }
    }
  }
}
</style>
