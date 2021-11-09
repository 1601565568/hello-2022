<template>
  <div>
    <div class="header-view">
      <div class="top-menus-view">
        <span>数据运营 /</span>
        <span> 企微运营数据 /</span>
        <span @click="handleBack" style="cursor: pointer;"> 素材库行为统计 /</span>
        <span style="color: #303133;cursor: pointer;"> 未执行统计</span>
      </div>
    </div>
    <div class="name-view">未执行统计</div>
    <div class="output-view">
      <div class="no-input-view">
        <el-input v-model="inputTitle" placeholder="请输入素材标题" @change="inputClick">
          <Icon
            type="ns-search"
            slot="suffix"
            style="font-size: 30px;"
            @click="inputClick"
          ></Icon>
        </el-input>
      </div>
      <div class="output-button" @click="outputCsvFile">导出CSV文件</div>
    </div>
    <div class="chat-bg">
      <div></div>
      <div class="reminde-view">
        仅统计有未执行数据的素材，全部执行完成的素材不显示
      </div>
      <div v-if="listDate.length > 0">
        <page-table style="padding-top:0">
          <template slot="table">
            <el-table
              :data="listDate"
              class="new-table_border drawer-table"
              :row-style="{ height: '48px' }"
            >
              <el-table-column prop="materialTitle" label="素材标题">
                <template slot-scope="scope">
                  <el-popover
                    placement="top-start"
                    width="300"
                    trigger="hover"
                    :disabled="scope.row.materialTitle.length <= 15"
                  >
                    <div>{{ scope.row.materialTitle }}</div>
                    <span
                      slot="reference"
                      v-if="scope.row.materialTitle.length <= 15"
                      >{{ scope.row.materialTitle }}</span
                    >
                    <span
                      slot="reference"
                      v-if="scope.row.materialTitle.length > 15"
                      >{{
                        scope.row.materialTitle.substr(0, 15) + '...'
                      }}</span
                    >
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="noCompleteSend" label="未发送人次">
                <template slot-scope="scope">{{
                  scope.row.noCompleteSend || '-'
                }}</template>
              </el-table-column>
              <el-table-column prop="noCompleteDownload" label="未下载人次">
                <template slot-scope="scope">{{
                  scope.row.noCompleteDownload || '-'
                }}</template>
              </el-table-column>
              <el-table-column prop="noCompleteCompletion" label="未补全人次">
                <template slot-scope="scope">{{
                  scope.row.materialScriptType === 2 ? scope.row.noCompleteCompletion || '-' : '-'
                }}</template>
              </el-table-column>
              <el-table-column prop="status" width="125px" label="操作">
                <template slot-scope="scope">
                  <ns-button
                    type="text"
                    class="select-button"
                    @click="showMoreData(scope.row)"
                    >查看明细</ns-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </template>
          <template slot="pagination">
            <el-pagination
              background
              class="label-dialog__pagination"
              :page-sizes="paginationToDate.sizeOpts"
              :total="paginationToDate.total"
              :current-page.sync="paginationToDate.page"
              :page-size="paginationToDate.size"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChangeForDate"
              @current-change="handleCurrentChangeForDate"
            >
            </el-pagination>
          </template>
        </page-table>
      </div>
      <div v-else>
        <NoData/>
      </div>
    </div>
    <UnDone ref="undone" />
  </div>
</template>

<script>
import PageTable from '@/components/NewUi/PageTable'
import ElBreadcrumb from '@nascent/nui/lib/breadcrumb'
import ElBreadcrumbItem from '@nascent/nui/lib/breadcrumb-item'
import UnDone from './components/UnDone'
import NoData from './components/NoData'
import moment from 'moment'
export default {
  name: 'noStatistical',
  components: {
    PageTable,
    UnDone,
    NoData
  },
  data () {
    return {
      inputTitle: '',
      paginationToDate: {
        size: 10,
        sizeOpts: [5, 10, 15],
        page: 1,
        total: 0
      },
      listDate: []
    }
  },
  methods: {
    handleBack () {
      this.$router.back(-1)
    },
    outputCsvFile () {
      let that = this
      that.$notify.info('导出中，请稍后片刻')
      this.$http
        .fetch(this.$api.guide.exportExcelByNoComplete, {})
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
            let curDate = moment().format('YYYYMMDD')
            let fileName =
              '素材库未执行统计' + curDate + '.xlsx'
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
          }
        })
    },
    handleSizeChangeForDate (size) {
      this.paginationToDate = {
        ...this.paginationToDate,
        size,
        page: 1
      }
      this.loadList()
    },
    handleCurrentChangeForDate (page) {
      this.paginationToDate.page = page
      this.loadList()
    },
    inputClick () {
      this.paginationToDate = {
        ...this.paginationToDate,
        size: 10,
        page: 1
      }
      this.loadList()
    },
    showMoreData (item) {
      this.$refs.undone.openDeawer(item)
    },
    loadList () {
      const parms = {
        searchMap: {
          materialTitle: this.inputTitle
        },
        start: (this.paginationToDate.page - 1) * this.paginationToDate.size,
        length: this.paginationToDate.size
      }
      if (this.paginationToDate.page === 1) {
        this.listDate = []
        this.paginationToDate.total = 0
      }
      this.$http
        .fetch(this.$api.guide.getNoCompleteStatisticsByMaterial, parms)
        .then(resp => {
          if (resp.success) {
            const json = resp.result
            const arr = json.data || []
            this.listDate = arr
            this.paginationToDate.total = parseInt(json.recordsTotal)
          }
        })
        .catch(resp => {})
        .finally(() => {})
    }
  },
  mounted () {
    this.loadList()
  }
}
</script>

<style scoped>
@import '@components/NewUi/styles/reset.css';
@import '@theme/variables.pcss';
@import './styles/index.css';
.output-view {
  background-color: white;
  height: 64px;
  margin-bottom: 8px;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 16px;
  padding-right: 16px;
}
.output-button {
  width: 116px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  font-size: 14px;
  color: #595959;
  text-align: center;
  line-height: 22px;
  font-weight: 400;
  line-height: 32px;
  cursor: pointer;
}
.chat-bg {
  background-color: white;
  padding-top: 16px;
}
.reminde-view {
  padding-left: 16px;
  margin-left: 16px;
  margin-right: 16px;
  background: #f2f9fe;
  border-radius: 2px;
  height: 40px;
  font-size: 14px;
  color:  #979797;
  line-height: 22px;
  font-weight: 400;
  line-height: 40px;
}
.drawer-table {
  padding: 0;
  font-size: 14px;
  font-weight: 400;
}
.select-button {
  font-size: 14px;
  color: #0094fc;
  font-weight: 400;
}
.name-view {
  height: 48px;
  background-color: white;
  margin-bottom: 8px;
  font-size: 16px;
  color: #262626;
  line-height: 24px;
  font-weight: 500;
  line-height: 48px;
  padding-left: 16px;
}
.header-view {
  background-color: white;
  height: 46px;
  font-size: 14px;
  line-height: 46px;
  padding-left: 16px;
  line-height: 46px;
}
.header-view >>> .el-breadcrumb {
  line-height: 46px;
}
.top-menus-view {
  font-size: 14px;
  color: #909399;
  line-height: 22px;
  font-weight: 400;
  line-height: 46px;
}
</style>
