<template>
  <el-drawer
    :visible.sync="drawer"
    :direction="direction"
    size="940px"
    :with-header="false"
    destroy-on-close
    :modal="false"
  >
    <div>
      <div class="close-view">
        <Icon type="close" class="close-icon" @click="closeDeawer" />
      </div>
      <div class="drawer-title">{{item.guideName}}{{'&nbsp;&nbsp;'}}{{ item.employeeNumber}}{{'&nbsp;&nbsp;'}}{{item.shopName}}</div>
      <div class="content-view">
        <div class="menu-view">
          <div class="input-view">
            <el-input
              placeholder="请输入素材标题"
              autofocus="false"
              type="text"
              v-model="inputTitle"
              @change="inputChange"
            >
              <Icon
                type="ns-search"
                slot="suffix"
                style="font-size: 30px;"
                @click="inputChange"
              ></Icon>
            </el-input>
          </div>
          <!-- <div class="user-view">
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
          </div> -->
        </div>
        <div v-if="listData.length > 0">
          <page-table style="padding-top:0">
            <template slot="table">
              <el-table
                :data="listData"
                class="new-table_border drawer-table"
                :row-style="{ height: '48px' }"
              >
                <el-table-column prop="trackTime" label="日期">
                </el-table-column>
                <el-table-column prop="materialTitle" label="素材">
                  <template slot-scope="scope">
                    <el-popover
                      placement="top-start"
                      width="300"
                      trigger="hover"
                      :disabled="scope.row.materialTitle.length <= 10"
                    >
                      <div>{{ scope.row.materialTitle }}</div>
                      <span
                        slot="reference"
                        v-if="scope.row.materialTitle.length <= 10"
                        >{{ scope.row.materialTitle }}</span
                      >
                      <span
                        slot="reference"
                        v-if="scope.row.materialTitle.length > 10"
                        >{{
                          scope.row.materialTitle.substr(0, 10) + '...'
                        }}</span
                      >
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column prop="sendCodePicturesSum" label="发送次数">
                </el-table-column>
                <el-table-column prop="imagesViewedSum" label="被浏览次数">
                </el-table-column>
                <el-table-column prop="conversionOrderSum" label="转化订单数">
                </el-table-column>
                <el-table-column prop="conversionAmountSum" label="转化金额">
                </el-table-column>
              </el-table>
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
// import NsGuideDialog from '@/components/NsGuideDialog'
import NoData from './NoData'
export default {
  name: 'userList',
  components: { ElDrawer, PageTable, NoData },
  data () {
    return {
      direction: 'rtl',
      drawer: false,
      listData: [],
      inputValue: '',
      actionValue: 0,
      inputTitle: '',
      guideIds: [],
      item: {},
      paginationToPerson: {
        size: 10,
        sizeOpts: [5, 10, 15],
        page: 1,
        total: 0
      },
      selectActionValue: 0,
      guideIdsStr: '',
      flag: false
    }
  },
  methods: {
    inputChange () {
      this.paginationToPerson = {
        size: 10,
        sizeOpts: [5, 10, 15],
        page: 1,
        total: 0
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
    openDeawer (item) {
      this.initData()
      this.drawer = true
      this.item = item
      this.guideIdsStr = item.guide_id || ''
      this.loadDetail()
    },
    initData () {
      this.item = {}
      this.actionValue = 0
      this.guideIds = []
      this.selectActionValue = 0
      this.guideIdsStr = ''
      this.inputTitle = ''
      this.paginationToPerson = {
        size: 10,
        sizeOpts: [5, 10, 15],
        page: 1,
        total: 0
      }
    },
    closeDeawer () {
      this.drawer = !this.drawer
    },
    handleClose () {},
    handleClick (tab, event) {},
    handleChangeGuide (val) {
      this.paginationToPerson = {
        size: 10,
        sizeOpts: [5, 10, 15],
        page: 1,
        total: 0
      }
      this.guideIdsStr = val.join(',')
      this.loadDetail()
    },
    loadDetail () {
      const parms = {
        searchMap: {
          startTime: this.item.trackTime,
          eventType: this.selectActionValue,
          guideIdsStr: this.guideIdsStr,
          shopIdsStr: '',
          materialTitle: this.inputTitle
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
        .fetch(this.$api.guide.getOperateStatisticsDetailsByGuideId, parms)
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
.input-view {
  margin-right: 0px;
}
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
  padding-left: 16px;
  align-items: center;
}

.arrowTransform {
  transition: 0.2s;
  transform-origin: center;
  transform: rotateZ(0deg);
}
.arrowTransformReturn {
  transition: 0.2s;
  transform-origin: center;
  transform: rotateZ(180deg);
}
.icon-view {
  width: 20px;
  height: 20px;
  cursor: pointer;
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
