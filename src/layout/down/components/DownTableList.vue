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
            </el-table-column>
            <el-table-column prop="generationTime" label="生成时间">
              <template slot-scope="scope">{{
                scope.row.generationTime || '-'
              }}</template>
            </el-table-column>
            <el-table-column prop="fileState" label="操作">
            </el-table-column>
          </el-table>
        </template>
        <template slot="pagination">
          <el-pagination
            background
            class="label-dialog__pagination"
            :page-sizes="pagination.sizeOpts"
            :total="pagination.total"
            :current-page.sync="pagination.page"
            :page-size="pagination.size"
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
      pagination: {
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
    resetData () {
      this.pagination = {
        size: 10,
        sizeOpts: [5, 10, 15],
        page: 0,
        total: 0
      }
      this.listData = []
    },
    handleSizeChange (size) {
      this.pagination = {
        ...this.pagination,
        size,
        page: 0
      }
      this.loadDetail()
    },
    handleCurrentChange (page) {
      this.pagination.page = page
      this.loadDetail()
    },
    async loadDetail (searchName = null, timeRange = []) {
      this.resetData()
      const startTime = timeRange && timeRange.length >= 2 ? timeRange[0] + ' 00:00:00' : null
      const endTime = timeRange && timeRange.length >= 2 ? timeRange[1] + ' 23:59:59' : null
      const fileName = searchName && searchName.length > 0 ? searchName : null
      const data = {
        start: this.pagination.page,
        length: this.pagination.size,
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
        this.pagination.total = parseInt(json.result.recordsTotal)
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

</style>
