<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="查询语句：" required>
        <el-form-grid size="xxlg" class="form-textarea">
          <el-input type="textarea" v-model="sql" :rows="4"></el-input>
        </el-form-grid>
      </el-form-item>
      <el-form-item>
        <ns-button type="primary" @click="queryData">确定</ns-button>
        <div class="tmp-tips text-warning"><i class="el-icon-warning"></i>
          目前仅支持数据查询，不允许更新、删除等操作
        </div>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table ref="table" :data="tableList" class="template-table__main" stripe
              resizable v-loading.lock="loadingTable"
              :element-loading-text="$t('prompt.loading')">
      <template v-for="(col, index) in cols">
        <el-table-column align="center" :prop="col" :label="col"></el-table-column>
      </template>
    </el-table>
    <!-- 表格-结束 -->
  </div>
</template>

<script>
  import tableMixin from 'mixins/table'

  export default {
    name: 'DataTable',
    mixins: [tableMixin],
    data: function () {
      return {
        sql: null,
        loadingTable: false,
        tableList: [],
        cols: [],
        url: this.$api.isv.sqlQuery
      }
    },
    mounted: function () {
    },
    methods: {
      queryData: function () {
        let that = this
        that.loadingTable = true
        that.cols = []
        that.$http.fetch(that.url, {sql: that.sql}).then((resp) => {
          if (resp.result && resp.result.length > 0) {
            for (let item in resp.result[0]) {
              that.cols.push(item)
            }
            that.tableList = resp.result
          }
          that.loadingTable = false
        }).catch((resp) => {
          that.$notify.error(resp.msg)
          that.loadingTable = false
        })
      }
    }
  }
</script>

