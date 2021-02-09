<template>
  <div class="channel-detail">
    <div class="channel-nav">
      <!-- <Icon class="back" type="icon-fanhuishangyiji"/> -->
      <Icon class="back" type="return" @click="$router.go(-1)" />
      <h3>渠道明细</h3>
    </div>
    <ContentPanel class="channel-content">
      <template v-slot:toolbar>
        <el-form :inline="true" class="top-tool-bar">
          <el-radio-group class="alalysis-radio" v-model="analysisDateField">
            <el-radio label="1" border>全部</el-radio>
            <el-radio label="2" border>近7天</el-radio>
            <el-radio label="3" border>近30天</el-radio>
          </el-radio-group>
          <span class="line"></span>
          <el-date-picker
            class="date-filter"
            v-model="searchDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
          <el-input placeholder="请输入渠道名称" v-model="filterText">
            <Icon type="ns-search-copy" slot="suffix" style="font-size: 24px; margin-top: 2px"></Icon>
          </el-input>
        </el-form>
        <ns-button class="export-button">导出CSV文件</ns-button>
      </template>
      <div class="new-table channel-detail-table">
        <el-table
          style="width: 100%;"
          size="medium"
          class="table-form_reset"
          row-class-name="employee-table_row"
          header-cell-class-name="employee-talbe-header-cell"
          :data="tableData"
        >
          <el-table-column prop="name" label="渠道名称"></el-table-column>
          <el-table-column prop="totalAddCount" label="总添加人数" sortable></el-table-column>
          <el-table-column prop="addCount" label="添加人数" sortable></el-table-column>
          <el-table-column prop="delCount" label="删除人数" width="316" sortable>
          </el-table-column>
          <el-table-column prop="deletedCount" label="被删除人数" sortable>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        class="template-table__pagination"
        :page-sizes="[15, 25, 50, 100]"
        :total="100"
        :current-page="1"
        :page-size="20"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="$sizeChange$"
        @current-change="$pageChange$">
      </el-pagination>
    </ContentPanel>
  </div>
</template>

<script>
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import ContentPanel from '../components/ContentPanel'

export default {
  components: {
    ContentPanel
  },
  mixins: [tableMixin],
  data () {
    return {
      analysisDateField: '',
      searchDate: '',
      filterText: '',
      tableData: [
        {
          name: '渠道名字',
          totalAddCount: 100,
          addCount: 88,
          delCount: 55,
          deletedCount: 23
        },
        {
          name: '渠道名字',
          totalAddCount: 99,
          addCount: 89,
          delCount: 25,
          deletedCount: 21
        }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
@import "./styles/reset.css";
@import "../styles/reset.css";

.channel-detail {
  width: 100%;
  .channel-nav {
    background: #fff;
    height: 48px;
    line-height: 48px;
    margin: -10px -10px 0;
    .back {
      display: inline-block;
      margin-left: 16px;
      color: #0094fc;
      font-size: 16px;
      cursor: pointer;
    }
    h3 {
      display: inline-block;
      font-size: 16px;
      margin-left: 16px;
    }
  }

  .channel-content {
    .top-tool-bar {
      display: flex;
      align-items: center;
      margin-left: 16px;
      .line {
        margin-left: 8px;
        margin-right: 24px;
        display: inline-block;
        height: 20px;
        border: 1px solid #e8e8e8;
      }
    }
    .export-button {
      font-size: 14px;
      height: 32px;
      margin-right: 16px;
    }

    .channel-detail-table {
      margin: 12px auto 0;
      width: calc(100% - 32px);
    }
  }
}
</style>
