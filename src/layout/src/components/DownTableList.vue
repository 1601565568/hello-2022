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
            <el-table-column prop="guideName" label="文件名称">
            </el-table-column>
            <el-table-column prop="phone" label="生成时间">
              <template slot-scope="scope">{{
                scope.row.phone || '-'
              }}</template>
            </el-table-column>
            <el-table-column prop="post" label="操作">
              <template slot-scope="scope">{{
                transPost(scope.row.post)
              }}</template>
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
      paginationToPerson: {
        size: 10,
        sizeOpts: [5, 10, 15],
        page: 0,
        total: 0
      },
      listData: []
    }
  },
  mounted () {
    this.loadDetail()
  },
  methods: {
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
    async loadDetail (fileName = '', timeRange = []) {
      const startTime = timeRange && timeRange.length >= 2 ? timeRange[0] + ' 00:00:00' : ''
      const endTime = timeRange && timeRange.length >= 2 ? timeRange[1] + ' 23:59:59' : ''
      const data = {
        start: this.paginationToPerson.page,
        length: this.paginationToPerson.size,
        searchMap: {
          fileName,
          startTime,
          endTime
        }
      }
      const json = await this.$http.fetch(this.$api.guide.task.exportList, data)
      if (json.success) {
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
