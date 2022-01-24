<template>
  <div>
    <div class="down-table" v-if="listData.length > 0">
      <page-table style="padding-top:0">
        <template slot="table">
          <div class="down-table-view">
            <el-table
              :data="listData"
              class="new-table_border drawer-table"
              :row-style="{ height: '48px' }"
            >
              <el-table-column prop="fileName" label="文件名称">
                <template slot-scope="scope">
                  <span>{{ fileNameStr(scope.row.fileName) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="generationTime" label="创建时间">
                <template slot-scope="scope">{{
                  scope.row.generationTime || '-'
                }}</template>
              </el-table-column>
              <el-table-column prop="fileState" label="操作">
                <template slot-scope="scope">
                  <span
                    :class="
                      scope.row.fileState === 2
                        ? 'down-text down-name'
                        : 'down-name'
                    "
                    @click="downExcelFile(scope.row)"
                    >{{ downStatus(scope.row.fileState) }}</span
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
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
        page: 1,
        total: 0
      },
      listData: []
    }
  },
  mounted () {
    // this.loadDetail()
  },
  methods: {
    downloadRange (data, start, end, i) {
      return new Promise((resolve, reject) => {
        const test = {
          url: '/file/export/record/segmentedDownload',
          method: 'get',
          responseType: 'blob',
          headers: {
            'range': `bytes=${start}-${end}`
          }
        }
        this.$http
          .fetch(test, data)
          .then(res => {
          })
          .catch(res => {})
        // const req = new XMLHttpRequest()
        // req.open('GET', url, true)
        // req.setRequestHeader('range', `bytes=${start}-${end}`)
        // req.responseType = 'blob'
        // req.onload = function (oEvent) {
        //   req.response.arrayBuffer().then(res => {
        //     resolve({
        //       i,
        //       buffer: res
        //     })
        //   })
        // }
        // req.send()
      })
    },
    // 合并buffer
    concatenate (arrays) {
      let totalLength = 0
      for (let arr of arrays) {
        totalLength += arr.length
      }
      let result = new Uint8Array(totalLength)
      let offset = 0
      for (let arr of arrays) {
        result.set(arr, offset)
        offset += arr.length
      }
      return result
    },
    downExcelFile (item) {
      if (item.fileState === 2) {
        const data = {
          id: item.id
        }
        let that = this
        const url = this.$api.guide.task.segmentedDownload
        that.$notify.info('导出中，请稍后片刻 test')
        this.$http
          .fetch(url, data)
          .then(res => {
            const size = Number(res.headers['content-length'])
            const m = 1024
            const length = parseInt(size / m)
            const arr = []
            for (let i = 0; i < length; i++) {
              let start = i * m
              let end = i === length - 1 ? size - 1 : (i + 1) * m - 1
              arr.push(this.downloadRange(data, start, end, i))
            }
            Promise.all(arr).then(res => {
              const arrBufferList = res
                .sort(item => item.i - item.i)
                .map(item => new Uint8Array(item.buffer))
              const allBuffer = this.concatenate(arrBufferList)
              const blob = new Blob([allBuffer])
              const blobUrl = URL.createObjectURL(blob)
              const aTag = document.createElement('a')
              aTag.download = item.fileName
              aTag.href = blobUrl
              aTag.click()
              URL.revokeObjectURL(blob)
              console.timeEnd('并发下载')
            })
          })
          .catch(res => {})
      }
    },
    // downExcelFile (item) {
    //   if (item.fileState === 2) {
    //     const data = {
    //       id: item.id
    //     }
    //     let that = this
    //     that.$notify.info('导出中，请稍后片刻')
    //     this.$http
    //       .fetch(this.$api.guide.task.downloadExcelFile, data)
    //       .then(resp => {
    //         that.$notify.success('下载完成')
    //       })
    //       .catch(resp => {
    //         if (!resp.size === 0) {
    //           that.$notify.error('导出报错，请联系管理员')
    //         } else {
    //           let url = window.URL.createObjectURL(new Blob([resp]))
    //           let link = document.createElement('a')
    //           link.style.display = 'none'
    //           link.href = url
    //           let fileName = item.fileName + '.xlsx'
    //           link.setAttribute('download', fileName)
    //           document.body.appendChild(link)
    //           link.click()
    //         }
    //       })
    //   }
    // },
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
        page: 1,
        total: 0
      }
      this.listData = []
    },
    handleSizeChange (size) {
      this.downPagination = {
        ...this.downPagination,
        size,
        page: 1
      }
      this.loadDetail()
    },
    handleCurrentChange (page) {
      this.downPagination.page = page
      this.loadDetail()
    },
    async loadDetail (searchName = null, timeRange = []) {
      const startTime =
        timeRange && timeRange.length >= 2 ? timeRange[0] + ' 00:00:00' : null
      const endTime =
        timeRange && timeRange.length >= 2 ? timeRange[1] + ' 23:59:59' : null
      const fileName = searchName && searchName.length > 0 ? searchName : null
      const start = (this.downPagination.page - 1) * this.downPagination.size
      const data = {
        start,
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
  color: #0094fc;
}
.down-name {
  cursor: pointer;
  font-size: 14px;
}
.down-table-view {
  max-height: 520px;
  overflow: scroll;
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: #9093994d;
  }
  &::-webkit-scrollbar {
    width: 2px;
    height: 6px;
  }
}
</style>
