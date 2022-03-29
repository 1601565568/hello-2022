<template>
  <el-drawer
    :visible.sync="drawer"
    :direction="direction"
    size="720px"
    :with-header="false"
    destroy-on-close
    :modal="false"
  >
    <div>
      <div class="close-view">
        <Icon type="close" class="close-icon" @click="closeDeawer" />
      </div>
      <div class="drawer-title">
        {{
          item.materialTitle && item.materialTitle.length > 25
            ? item.materialTitle.substr(0, 25) + '...'
            : item.materialTitle
        }}
      </div>
      <div class="content-view">
        <div class="menu-view">
          <div class="user-view">
            <el-form :inline="true" class="form-inline_top">
              <el-form-item label="门店/员工：">
                <NsGuideDialog
                  :selfBtn="true"
                  :appendToBody="true"
                  :isButton="false"
                  :auth="true"
                  type="primary"
                  btnTitle=""
                  dialogTitle="门店/员工："
                  @input="handleChangeGuide"
                  v-model="guideIds"
                  :switchAreaFlag="1"
                >
                  <template slot="selfBtn">
                    <div class="self-btn">
                      {{
                        guideIds && guideIds.length
                          ? `已选择${guideIds.length}个员工`
                          : '全部'
                      }}
                      <Icon type="geren" class="guideIds-icon"></Icon>
                    </div>
                  </template>
                </NsGuideDialog>
              </el-form-item>
            </el-form>
          </div>
          <ns-button size='large' type='primary' style='margin-right:16px;' @click='handleExport'>导出文件</ns-button>
        </div>
        <div class="select-data-view">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="未发送" name="first"></el-tab-pane>
            <el-tab-pane label="未下载" name="second"></el-tab-pane>
            <el-tab-pane
              label="未补全"
              name="third"
              v-if="item.materialScriptType === 2"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <div v-if="listData.length > 0">
          <page-table style="padding-top:0">
            <template slot="table">
              <!-- <div class="content-view"> -->
              <el-table
                :data="listData"
                class="new-table_border drawer-table"
                :row-style="{ height: '48px' }"
                :row-key="getRowKey"
              >
                <el-table-column
                  prop="employeeNumber"
                  label="工号"
                  :width="114"
                >
                  <template slot-scope="scope">{{
                    scope.row.employeeNumber || '-'
                  }}</template>
                </el-table-column>
                <el-table-column prop="name" label="员工"> </el-table-column>
                <el-table-column prop="phone" label="电话">
                  <template slot-scope="scope">{{
                    scope.row.phone || '-'
                  }}</template>
                </el-table-column>
                <el-table-column prop="post" label="岗位">
                  <template slot-scope="scope">{{
                    transPost(scope.row.post)
                  }}</template>
                </el-table-column>
                <el-table-column prop="shopNamesStr" label="所属门店">
                  <template slot-scope="scope">
                    <el-popover
                      placement="top-start"
                      width="300"
                      trigger="hover"
                      :disabled="scope.row.shopNamesStr.length <= 15"
                    >
                      <div>{{ scope.row.shopNamesStr }}</div>
                      <span
                        slot="reference"
                        v-if="scope.row.shopNamesStr.length <= 15"
                        >{{ scope.row.shopNamesStr }}</span
                      >
                      <span
                        slot="reference"
                        v-if="scope.row.shopNamesStr.length > 15"
                        >{{
                          scope.row.shopNamesStr.substr(0, 15) + '...'
                        }}</span
                      >
                    </el-popover>
                  </template>
                </el-table-column>
              </el-table>
              <!-- </div> -->
            </template>
            <template slot="pagination">
              <el-pagination
                background
                class="label-dialog__pagination"
                :page-sizes="paginationToPerson.sizeOpts"
                :total="paginationToPerson.total"
                :current-page.sync="paginationToPerson.page"
                :page-size="paginationToPerson.size"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChangeForPerson"
                @current-change="handleCurrentChangeForPerson"
              >
              </el-pagination>
            </template>
          </page-table>
        </div>
        <div v-else>
          <NoData />
        </div>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import ElDrawer from '@nascent/nui/lib/drawer'
import PageTable from '@/components/NewUi/PageTable'
import NsGuideDialog from '@/components/NsGuideDialog'
import NoData from './NoData'
export default {
  name: 'undone',
  components: { ElDrawer, PageTable, NsGuideDialog, NoData },
  data () {
    return {
      direction: 'rtl',
      drawer: false,
      listData: [],
      inputValue: '',
      activeName: 'first',
      item: {},
      guideIdsStr: '',
      paginationToPerson: {
        size: 10,
        sizeOpts: [5, 10, 15],
        page: 1,
        total: 0
      },
      eventType: 16,
      guideIds: []
    }
  },
  methods: {
    transPost (val) {
      if (val === 1) {
        return '店长'
      } else if (val === 2) {
        return '客服'
      } else if (val === 0) {
        return '导购'
      }
      return '-'
    },
    getRowKey (row) {
      return row.id
    },
    handleChangeGuide (val) {
      this.guideIdsStr = val.join(',')
      this.paginationToPerson = {
        ...this.paginationToPerson,
        size: 10,
        page: 1
      }
      this.loadDetail()
    },
    handleSizeChangeForPerson (size) {
      this.paginationToPerson = {
        ...this.paginationToPerson,
        size,
        page: 1
      }
      this.loadDetail()
    },
    handleCurrentChangeForPerson (page) {
      this.paginationToPerson.page = page
      this.loadDetail()
    },
    handleClick (val) {
      this.paginationToPerson = {
        ...this.paginationToPerson,
        size: 10,
        page: 1
      }
      if (val.name === 'first') {
        this.eventType = 16
      } else if (val.name === 'second') {
        this.eventType = 14
      } else if (val.name === 'third') {
        this.eventType = 18
      }
      this.loadDetail()
    },
    closeDeawer () {
      this.drawer = false
    },
    initData () {
      this.eventType = 16
      this.item = {}
      this.guideIdsStr = ''
      this.guideIds = []
      this.activeName = 'first'
      this.paginationToPerson = {
        size: 10,
        sizeOpts: [5, 10, 15],
        page: 1,
        total: 0
      }
    },
    openDeawer (item) {
      // materialScriptType
      this.initData()
      this.item = item
      this.drawer = true
      this.loadDetail()
    },
    handleClose () {},
    // 导出
    handleExport () {
      const param = {
        eventType: this.eventType,
        guideIdsStr: this.guideIdsStr,
        materialId: this.item.materialId,
        exportType: 12,
        materialTitle: this.item.materialTitle || ''
      }
      this.$http.fetch(this.$api.guide.task.exportExcel, param).then((resp) => {
        this.$notify.success('文件已导入下载中心')
      }).catch((resp) => {
        this.$notify.error(resp.msg || '导出报错，请联系管理员')
      })
    },
    loadDetail () {
      const parms = {
        searchMap: {
          eventType: this.eventType,
          guideIdsStr: this.guideIdsStr,
          materialId: this.item.materialId
        },
        start:
          (this.paginationToPerson.page - 1) * this.paginationToPerson.size,
        length: this.paginationToPerson.size
      }
      if (this.paginationToPerson.page === 1) {
        this.listData = []
        this.paginationToPerson.total = 0
      }
      this.$http
        .fetch(this.$api.guide.getNoCompleteStatisticsDetailByMaterial, parms)
        .then(resp => {
          const json = resp.result
          const arr = json.data || []
          this.listData = arr
          this.paginationToPerson.total = parseInt(json.recordsTotal)
        })
        .catch(resp => {})
    }
  }
}
</script>
<style scoped>
@import '@components/NewUi/styles/reset.css';
@import '../styles/index.css';
.user-view {
  margin-left: 0;
}
.form-inline_top .el-form-item {
  height: 32px;
  margin-bottom: 0;
  border: 1px solid #d9d9d9;
}
.form-inline_top {
  margin-left: 16px;
  display: flex;
  align-items: center;
  height: 32px;
}
.self-btn {
  width: 150px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #606266;
  .guideIds-icon {
    color: #c0c4cc;
  }
}
.el-tabs__item {
  font-size: 18px !important;
  padding: 10px 0 50px !important;
  width: 120px !important;
}
.el-tabs__active-bar {
  width: 120px !important;
}
.drawer-title {
  height: 53px;
  font-size: 16px;
  color: #262626;
  line-height: 53px;
  padding-left: 16px;
  font-weight: bold;
}
.drawer-sub-title {
  font-size: 14px;
  color: #303133;
  line-height: 55px;
  font-weight: 500;
  padding-left: 32px;
  height: 55px;
}
.drawer-sub-cont {
  font-size: 14px;
  color: #606266;
  line-height: 24px;
  font-weight: 400;
  margin-left: 32px;
  margin-right: 32px;
  padding-bottom: 33px;
  border-bottom: 1px solid #e8e8e8;
}
.drawer-sub-img {
  width: 375px;
  height: 257px;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  margin-left: 32px;
}
.close-view {
  height: 49px;
  display: flex;
  align-items: center;
}
.close-icon {
  margin-left: 16px;
  width: 20px;
  height: 20px;
}
.drawer-showinfo {
  font-size: 14px;
  color: #595959;
  line-height: 22px;
  font-weight: 400;
  margin-left: 16px;
  margin-right: 16px;
  display: flex;
  justify-content: space-between;
  height: 65px;
  align-items: center;
}
.drawer-showinfo >>> .el-tabs__header {
  border: none;
  box-shadow: none;
}

.drawer-table {
  padding: 0;
  font-size: 14px;
  font-weight: 400;
}
.drawer-output {
  width: 116px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  line-height: 32px;
  text-align: center;
  font-size: 14px;
}
.select-button {
  font-size: 14px;
  color: #0094fc;
  font-weight: 400;
}
.menu-view {
  height: 65px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  /* background-color: red; */
}

.item-down {
  width: 143px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  display: flex;
  flex-direction: row;
  font-size: 14px;
  align-items: center;
  .name {
    width: 42px;
    margin-left: 8px;
  }
}
.content-view {
  overflow: scroll;
  height: 85vh;
}

.content-view::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.content-view::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #9093994d;
}
</style>
