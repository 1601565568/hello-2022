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
import { Base64 } from 'js-base64'
import OSS from 'ali-oss'
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
      listData: [],
      searchName: null,
      timeRange: []
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
        const url = this.$api.guide.task.segmentedDownload
        that.$notify.info('导出中，请稍后片刻')
        this.$http
          .fetch(url, data)
          .then(json => {
            if (json.success) {
              const client = new OSS({
                region: Base64.decode(json.result.region),
                accessKeyId: Base64.decode(json.result.accessKeyId),
                accessKeySecret: Base64.decode(json.result.accessKeySecret),
                bucket: Base64.decode(json.result.bucket)
              })
              const filename = Base64.decode(json.result.fileName)
              const response = {
                'content-disposition': `attachment; filename=${encodeURIComponent(filename)}`
              }
              const result = client.signatureUrl(Base64.decode(json.result.filePath), { response })
              window.location = result
            }
          })
          .catch(res => {
            that.$notify.error(res.msg || '导出失败')
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
    async loadDetail (downPagination, searchName = null, timeRange = []) {
      this.searchName = searchName
      this.timeRange = timeRange
      const startTime =
        timeRange && timeRange.length >= 2 ? timeRange[0] + ' 00:00:00' : null
      const endTime =
        timeRange && timeRange.length >= 2 ? timeRange[1] + ' 23:59:59' : null
      const fileName = searchName && searchName.length > 0 ? searchName : null
      const start = (downPagination.page - 1) * downPagination.size
      const data = {
        start,
        length: downPagination.size,
        searchMap: {
          fileName,
          startTime,
          endTime
        }
      }
      const json = await this.$http.fetch(this.$api.guide.task.exportList, data)
      if (json.success) {
        const data = json.result.data || []
        this.listData = data
        const total = parseInt(json.result.recordsTotal) || 0
        this.$emit('updatePageSize', total)
      } else {
        this.listData = []
        this.$emit('updatePageSize', 0)
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
  cursor: pointer;
}
.down-name {
  font-size: 14px;
}
.down-table {
  margin-top: -5px;
}
.down-table-view {
  max-height: 670px;
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
