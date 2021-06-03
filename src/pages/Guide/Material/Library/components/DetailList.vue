<template>
  <div>
    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      size="826px"
      :with-header="false"
      :modal="false"
      @close="handleClose"
    >
      <div>
        <div class="close-view">
          <Icon type="close" class="close-icon" @click="handleClose" />
        </div>
        <div class="drawer-title">自创明细</div>
        <div class="select-data-view">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="已完成员工" name="first">
              <div class="finish-view">
                <el-form :inline="true" class="form-inline_top">
                  <el-form-item label="所属员工：">
                    <NsGuideDialog
                      :selfBtn="true"
                      :appendToBody="true"
                      :isButton="false"
                      :auth="false"
                      type="primary"
                      btnTitle=""
                      dialogTitle="所属员工："
                      @input="handleChangeGuide"
                      v-model="guideIds"
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
                <span class="show-name"
                  >已完成员工 {{ recordsTotal || 0 }}人</span
                >
              </div>
              <page-table style="padding-top:0">
                <template slot="table">
                  <el-table
                    :data="listData"
                    class="new-table_border drawer-table"
                  >
                    <el-table-column prop="completionTime" label="完成时间">
                    </el-table-column>
                    <el-table-column prop="guideName" label="员工">
                    </el-table-column>
                    <el-table-column prop="employeeNumber" label="工号">
                      <template slot-scope="scope">{{
                        scope.row.employeeNumber || '-'
                      }}</template>
                    </el-table-column>
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
                    <el-table-column prop="shopName" label="所属门店">
                      <template slot-scope="scope">
                        <el-popover
                          placement="top-start"
                          width="300"
                          trigger="hover"
                          :disabled="scope.row.shopName.length <= 15"
                        >
                          <div>{{ scope.row.shopName }}</div>
                          <span
                            slot="reference"
                            v-if="scope.row.shopName.length <= 15"
                            >{{ scope.row.shopName }}</span
                          >
                          <span
                            slot="reference"
                            v-if="scope.row.shopName.length > 15"
                            >{{
                              scope.row.shopName.substr(0, 15) + '...'
                            }}</span
                          >
                        </el-popover>
                      </template>
                    </el-table-column>
                    <el-table-column prop="title" width="125px" label="操作">
                      <template slot-scope="scope">
                        <ns-button
                          type="text"
                          class="select-button"
                          @click="lookMaterialDetail(scope.row)"
                          >查看</ns-button
                        >
                        <ns-button
                          type="text"
                          class="select-button"
                          @click="deleteFile(scope.row)"
                          >删除</ns-button
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
                <template slot="pagination">
                  <el-pagination
                    class="label-dialog__pagination"
                    :page-sizes="pagination.sizeOpts"
                    :total="pagination.total"
                    :current-page.sync="pagination.page"
                    :page-size="pagination.size"
                    layout="total, prev, pager, next"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                  >
                  </el-pagination>
                </template>
              </page-table>
            </el-tab-pane>
            <el-tab-pane label="未完成员工" name="second">
              <div class="un-finish-view">
                <el-form :inline="true" class="form-inline_top">
                  <el-form-item label="选择门店：">
                    <NsShopDialog
                      :selfBtn="true"
                      :appendToBody="true"
                      :isButton="false"
                      :auth="false"
                      type="icon"
                      btnTitle=""
                      dialogTitle="选择门店："
                      @input="handleChangeShop"
                      v-model="shopIds"
                    >
                      <template slot="btnIcon">
                        <div class="self-btn">
                          {{
                            shopIds && shopIds.length
                              ? `已选择${shopIds.length}个门店`
                              : '全部门店'
                          }}
                          <Icon type="shop" class="shopIds-icon"></Icon>
                        </div>
                      </template>
                    </NsShopDialog>
                  </el-form-item>
                </el-form>
                <span class="show-name"
                  >未完成员工 {{ recordsTotal || 0 }}人</span
                >
              </div>
              <page-table style="padding-top:0">
                <template slot="table">
                  <el-table
                    :data="listData"
                    class="new-table_border drawer-table"
                  >
                    <el-table-column prop="guideName" label="员工">
                    </el-table-column>
                    <el-table-column prop="employeeNumber" label="工号">
                      <template slot-scope="scope">{{
                        scope.row.employeeNumber || '-'
                      }}</template>
                    </el-table-column>
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
                </template>
                <template slot="pagination">
                  <el-pagination
                    class="label-dialog__pagination"
                    :page-sizes="pagination.sizeOpts"
                    :total="pagination.total"
                    :current-page.sync="pagination.page"
                    :page-size="pagination.size"
                    layout="total, prev, pager, next"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                  >
                  </el-pagination>
                </template>
              </page-table>
            </el-tab-pane>
          </el-tabs>
          <div class="output-file-view" @click="exportData">导出CSV文件</div>
        </div>
      </div>
    </el-drawer>
    <InfoDialog ref="infoDialog" :metailInfo="metailInfo" />
  </div>
</template>
<script>
import ElDrawer from '@nascent/nui/lib/drawer'
import PageTable from '@/components/NewUi/PageTable'
import { getErrorMsg } from '@/utils/toast'
import NsGuideDialog from '@/components/NsGuideDialog'
import NsShopDialog from '@/components/NsShopDialog'
import InfoDialog from './InfoDialog'
import moment from 'moment'
export default {
  name: 'detailList',
  components: {
    ElDrawer,
    InfoDialog,
    NsGuideDialog,
    PageTable,
    NsShopDialog
  },
  props: {
    matericalTitle: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      title: '自创明细',
      direction: 'rtl',
      drawer: false,
      listData: [],
      value: '',
      guideIdsStr: '',
      isCompletion: 1,
      shopIdsStr: '',
      // 分页配置
      pagination: {
        size: 10,
        sizeOpts: [10],
        page: 1,
        total: 0
      },
      guideIds: [],
      numData: {},
      metailInfo: {},
      activeName: 'first',
      shopIds: [],
      materialScriptId: 0,
      recordsTotal: 0
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
    handleChangeShop (value) {
      this.shopIds = value
      if (this.shopIds.length > 0) {
        this.shopIdsStr = this.shopIds.join(',')
      } else {
        this.shopIdsStr = ''
      }
      this.pagination = {
        size: 10,
        sizeOpts: [10],
        page: 1,
        total: 0
      }
      this.loadList()
    },
    handleClick (val) {
      this.isCompletion = val.name === 'first' ? 1 : 0
      if (val.name === 'first') {
        this.shopIdsStr = ''
        this.shopIds = []
      }
      if (val.name === 'second') {
        this.guideIdsStr = ''
        this.guideIds = []
      }
      this.pagination = {
        size: 10,
        sizeOpts: [10],
        page: 1,
        total: 0
      }
      // this.drawerInitData()
      this.loadList()
    },
    handleClose () {
      this.drawerInitData()
      this.drawer = false
    },
    handleChangeGuide (value) {
      this.guideIds = value
      if (this.guideIds.length > 0) {
        this.guideIdsStr = this.guideIds.join(',')
      } else {
        this.guideIdsStr = ''
      }
      this.pagination = {
        size: 10,
        sizeOpts: [10],
        page: 1,
        total: 0
      }
      this.loadList()
    },
    deleteFile (row) {
      this.$confirm('将删除改员工本条自建素材，是否删除？', '确定删除？', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '删除'
      })
        .then(() => {
          this.toDelete(row)
        })
        .catch(() => {})
    },
    toDelete (row) {
      const params = {
        guideId: row.guideId,
        materialScriptId: this.materialScriptId
      }
      this.$http
        .fetch(this.$api.guide.delScriptCompletionDetailByGuideId, params)
        .then(resp => {
          if (resp.success) {
            this.pagination = {
              size: 10,
              sizeOpts: [10],
              page: 1,
              total: 0
            }
            this.loadList()
          }
          this.$notify.success(`删除成功`)
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg(this.title, resp))
        })
        .finally(() => {})
    },
    lookMaterialDetail (row) {
      const params = {
        guideId: row.guideId,
        materialScriptId: this.materialScriptId
      }
      this.$http
        .fetch(this.$api.guide.findScriptCompletionDetailByGuideId, params)
        .then(resp => {
          if (resp.success) {
            this.metailInfo = { ...resp.result, ...row }
            this.$refs.infoDialog.showDialog()
          }
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg(this.title, resp))
        })
        .finally(() => {})
    },
    toUnDataList () {
      this.$refs.unDetailList.closeDeawer()
    },
    handleSizeChange (size) {
      this.pagination = {
        ...this.pagination,
        size,
        page: 1
      }
      this.loadList()
    },
    handleCurrentChange (page) {
      this.pagination.page = page
      this.loadList()
    },
    drawerInitData () {
      this.guideIds = []
      this.guideIdsStr = ''
      this.activeName = 'first'
      this.shopIds = []
      this.shopIdsStr = ''
      this.isCompletion = 1
      this.listData = []
      this.pagination = {
        size: 10,
        sizeOpts: [10],
        page: 1,
        total: 0
      }
    },
    closeDeawer (materialScriptId) {
      this.drawerInitData()
      this.materialScriptId = materialScriptId
      this.drawer = true
      if (this.drawer) {
        this.loadList()
      }
    },
    loadList () {
      const params = {
        searchMap: {
          materialScriptId: this.materialScriptId,
          guideIdsStr: this.guideIdsStr,
          isCompletion: this.isCompletion,
          shopIdsStr: this.shopIdsStr
        },
        start: (this.pagination.page - 1) * this.pagination.size,
        length: this.pagination.size
      }
      if (this.pagination.page === 1) {
        this.listData = []
      }
      this.$http
        .fetch(this.$api.guide.findScriptCompletionDetailList, params)
        .then(resp => {
          if (resp.success) {
            this.listData = resp.result.data
            this.pagination.total = parseInt(resp.result.recordsTotal)
            this.recordsTotal = resp.result.recordsTotal || 0
          }
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg(this.title, resp))
        })
        .finally(() => {})
    },
    exportData () {
      const params = {
        materialScriptId: this.materialScriptId,
        guideIdsStr: '',
        isCompletion: 1,
        shopIdsStr: ''
      }
      let that = this
      that.$notify.info('导出中，请稍后片刻')
      this.$http
        .fetch(this.$api.guide.exportMaterialCompletionByExcel, params)
        .then(resp => {
          that.$notify.success('下载完成')
        })
        .catch(resp => {
          if (!resp.size === 0) {
            that.$notify.error('导出报错，请联系管理员')
          } else {
            let url = window.URL.createObjectURL(new Blob([resp]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            let curDate = moment().format('YYYYMMDDHHmmss')
            let fileName = '创建统计' + this.matericalTitle + curDate + '.xlsx'
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
          }
        })
    },
    loadNum () {
      const params = {
        materialScriptId: this.materialScriptId,
        guideIdsStr: this.guideIdsStr,
        isCompletion: this.isCompletion,
        shopIdsStr: this.shopIdsStr
      }
      this.$http
        .fetch(this.$api.guide.getScriptCompletionNumber, params)
        .then(resp => {
          if (resp.success) {
            this.numData = resp.result
          }
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg(this.title, resp))
        })
        .finally(() => {})
    }
  }
}
</script>
<style scoped lang="scss">
@import '@components/NewUi/styles/reset.css';
@import '../styles/reset.css';
@import '../styles/datalist.css';
.un-finish-view {
  margin-top: 17px;
  display: flex;
  flex-direction: row;
  align-items: center;
  .show-name {
    font-size: 14px;
    color: #595959;
    line-height: 22px;
    font-weight: 400;
  }
}
.finish-view {
  margin-top: 17px;
  display: flex;
  flex-direction: row;
  align-items: center;
  .show-name {
    font-size: 14px;
    color: #595959;
    line-height: 22px;
    font-weight: 400;
  }
}
.drawer-title {
  height: 53px;
  font-size: 16px;
  color: #262626;
  line-height: 53px;
  padding-left: 16px;
  font-weight: 500;
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
  border-radius: 2px;
  line-height: 32px;
  text-align: center;
  cursor: pointer;
}
.drawer-select {
  margin-left: 16px;
  margin-top: 16px;
  width: 143px;
  height: 32px;
  background: #ffffff;
  border-radius: 2px;
  font-size: 14px;
  color: #262626;
}
.select-button {
  font-size: 14px;
  color: #0094fc;
  font-weight: 400;
}
.remind-text {
  color: #0091fa;
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
.form-inline_top {
  margin-left: 16px;
  display: flex;
  align-items: center;
}

.form-inline_top .el-form-item {
  height: 32px;
  margin-bottom: 0;
  border: 1px solid #d9d9d9;
}

.select-data-view {
  position: relative;
}
.output-file-view {
  width: 116px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  font-size: 14px;
  color: #595959;
  text-align: center;
  line-height: 32px;
  font-weight: 400;
  position: absolute;
  top: 12px;
  right: 15px;
  cursor: pointer;
}
</style>
