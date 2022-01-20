<template>
  <div>
    <div class="down-table" v-if="listData.length > 0">
      <page-table style="padding-top:0">
        <template slot="table">
          <el-table
            :data="listData"
            class="new-table_border drawer-table"
            :row-style="{ height: '48px' }"
          >
            <el-table-column prop="fileName" label="文件名称">
              <template slot-scope="scope">
                <span>{{fileNameStr(scope.row.fileName)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="generationTime" label="创建时间">
              <template slot-scope="scope">{{
                scope.row.generationTime || '-'
              }}</template>
            </el-table-column>
            <el-table-column prop="fileState" label="操作">
              <template slot-scope="scope">
                <span :class="scope.row.fileState === 2 ? 'down-text down-name': 'down-name'" @click="downExcelFile(scope.row)">{{downStatus(scope.row.fileState)}}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <template slot="pagination">
          <el-pagination
            background
            class="label-dialog__downPagination"
            :page-sizes="downPagination.sizeOpts"
            :total="downPagination.total"
            :current-page.sync="downPagination.page"
            :page-size="downPagination.size"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </template>
      </page-table>
    </div>
    <div v-else>
      <NoData />
    </div>
  </div>
</template>

<script>
import PageTable from '@/components/NewUi/PageTable'
import NoData from '@/pages/WeWork/MaterialChat/components/NoData'
export default {
  name: 'downTableList',
  components: {
    PageTable,
    NoData
  },
  data () {
    return {
      downPagination: {
        size: 10,
        sizeOpts: [5, 10, 15],
        page: 0,
        total: 0
      },
      listData: []
    }
  },
  mounted () {
    // this.loadDetail()
  },
  methods: {
    downExcelFile (item) {
      if (item.fileState === 2) {
        const data = {
          id: item.id
        }
        let that = this
        that.$notify.info('导出中，请稍后片刻')
        this.$http
          .fetch(this.$api.guide.task.downloadExcelFile, data)
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
              let fileName = item.fileName + '.xlsx'
              link.setAttribute('download', fileName)
              document.body.appendChild(link)
              link.click()
            }
          })
      }
    },
    fileNameStr (name) {
      if (name && name.length > 16) {
        return name.substr(0, 16) + '...'
      }
      return name || '-'
    },
    downStatus (fileState) {
      let str = '-'
      if (fileState === 1) {
        str = '生成中…'
      } else if (fileState === 2) {
        str = '下载'
      } else if (fileState === 3) {
        str = '生成失败'
      }
      return str
    },
    resetData () {
      this.downPagination = {
        size: 10,
        sizeOpts: [5, 10, 15],
        page: 0,
        total: 0
      }
      this.listData = []
    },
    handleSizeChange (size) {
      this.downPagination = {
        ...this.downPagination,
        size,
        page: 0
      }
      this.loadDetail()
    },
    handleCurrentChange (page) {
      this.downPagination.page = page
      this.loadDetail()
    },
    async loadDetail (searchName = null, timeRange = []) {
      const startTime = timeRange && timeRange.length >= 2 ? timeRange[0] + ' 00:00:00' : null
      const endTime = timeRange && timeRange.length >= 2 ? timeRange[1] + ' 23:59:59' : null
      const fileName = searchName && searchName.length > 0 ? searchName : null
      const data = {
        start: this.downPagination.page,
        length: this.downPagination.size,
        searchMap: {
          fileName,
          startTime,
          endTime
        }
      }
      if (this.downPagination.page === 0) {
        this.listData = []
        this.downPagination.total = 0
      }
      const json = await this.$http.fetch(this.$api.guide.task.exportList, data)
      if (json.success) {
        const data = json.result.data || []
        this.listData = data
        this.downPagination.total = parseInt(json.result.recordsTotal)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@components/NewUi/styles/reset.css';
.drawer-table {
  padding: 0;
  font-size: 14px;
  font-weight: 400;
}
.down-text {
  color: #0094FC;
}
.down-name {
  cursor: pointer;
  font-size: 14px;
}
</style>
