<template>
  <div>
    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      size="720px"
      :with-header="false"
      :modal="false"
      @close="handleClose"
      destroy-on-close
    >
      <div>
        <div class="close-view">
          <Icon type="close" class="close-icon" @click="handleClose" />
        </div>
        <div class="drawer-title">自创明细</div>
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
        <div class="drawer-showinfo">
          <div>
            <span>已完成员工 {{ numData.completionTotal }}人</span>
            <span style="margin-left:46px" @click="toUnDataList"
              >未完成员工<span class="remind-text">{{
                numData.noCompletionTotal
              }}</span
              >人</span
            >
          </div>
          <div class="drawer-output" @click="exportData">
            导出CSV文件
          </div>
        </div>
        <page-table style="padding-top:0">
          <template slot="table">
            <el-table :data="listData" class="new-table_border drawer-table">
              <el-table-column prop="completionTime" label="完成时间">
              </el-table-column>
              <el-table-column prop="guideName" label="员工"> </el-table-column>
              <el-table-column prop="shopName" label="所属门店">
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
      </div>
    </el-drawer>
    <UnDetailList ref="unDetailList" :materialScriptId="materialScriptId" />
    <InfoDialog ref="infoDialog" :metailInfo="metailInfo" />
  </div>
</template>
<script>
import ElDrawer from '@nascent/nui/lib/drawer'
import PageTable from '@/components/NewUi/PageTable'
import { getErrorMsg } from '@/utils/toast'
import UnDetailList from './UnDetailList'
import NsGuideDialog from '@/components/NsGuideDialog'
import InfoDialog from './InfoDialog'
export default {
  name: 'detailList',
  components: { ElDrawer, PageTable, UnDetailList, NsGuideDialog, InfoDialog },
  props: {
    materialScriptId: {
      type: Number,
      default: 0
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
      metailInfo: {}
    }
  },
  watch: {
    materialScriptId (newValue, oldValue) {
      this.loadList()
      this.loadNum()
    }
  },
  methods: {
    handleClose () {
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
      this.loadNum()
    },
    deleteFile (row) {
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
            this.loadNum()
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
      this.loadNum()
    },
    handleCurrentChange (page) {
      this.pagination.page = page
      this.loadList()
    },
    closeDeawer () {
      this.drawer = true
      if (this.drawer) {
        this.pagination = {
          size: 10,
          sizeOpts: [10],
          page: 1,
          total: 0
        }
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
      this.$http
        .fetch(this.$api.guide.findScriptCompletionDetailList, params)
        .then(resp => {
          if (resp.success) {
            this.listData = resp.result.data
            this.pagination.total = parseInt(resp.result.recordsTotal)
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
        guideIdsStr: this.guideIdsStr,
        isCompletion: this.isCompletion,
        shopIdsStr: this.shopIdsStr
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
            var fileName = '邀请好友明细表.CSV'
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
.drawer-title {
  height: 53px;
  font-size: 16px;
  color: #262626;
  line-height: 53px;
  padding-left: 16px;
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
</style>
