<template>
  <div class="analysis-container">
    <div class="data-statistics">
      <div class="box-header">
        <h3>数据统计</h3>
      </div>
      <div class="data-statistics-content">
        <DataCard title="参与员工总数" tip="提示啊" :count="99" color="linear-gradient(269deg, #4EB3FC 0%, #0091FA 100%)"/>
        <DataCard title="当前好友总数" tip="提示啊" :count="66" color="linear-gradient(270deg, #A0E35E 0%, #67C230 100%)"/>
        <DataCard title="新增好友总数" tip="提示啊" :count="33" color="linear-gradient(270deg, #F7BD5B 0%, #F49F10 100%)"/>
      </div>
    </div>
    <div class="employee-details">
      <div class="box-header">
        <h3>员工明细</h3>
        <!-- <div class="box-tool-bar">
          我是工具栏
        </div> -->
      </div>
      <div class="employee-table">
        <el-table
          style="width: 100%;"
          size="medium"
          class="table-form_reset"
          row-class-name="employee-table_row"
          header-cell-class-name="employee-talbe-header-cell"
          :data="tableData"
        >
          <el-table-column
            prop="name"
            label="员工姓名">
          </el-table-column>
          <el-table-column
            prop="id"
            label="工号">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机号">
          </el-table-column>
          <el-table-column
            prop="store"
            label="工作门店"
            width="316">
            <template slot-scope="scope">
              <div>
                <span class="scope-store-text">{{scope.row.store}}</span>
                <el-popover
                  placement="top-start"
                  class="item"
                  :title="`工作门店（${scope.row.store.length}）`"
                  width="200"
                  trigger="hover"
                  :content="scope.row.store">
                  <span class="scope-name_tip" slot="reference">共{{scope.row.store.length}}个</span>
                </el-popover>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="count"
            label="添加好友数"
            sortable>
            <template slot-scope="scope">
              <span class="scope-name_tip">{{scope.row.count}}</span>
            </template>
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
    </div>
  </div>
</template>

<script>
import DataCard from './DataCard'
/**
 * 效果分析页面
 */
export default {
  components: {
    DataCard
  },
  data () {
    return {
      activeName: 'first',
      tableData: [
        {
          name: '刘红磊',
          id: '9527',
          phone: '18877665578',
          store: '妙妙屋',
          count: 666
        },
        {
          name: '刘红磊',
          id: '9527',
          phone: '18877665578',
          store: '妙妙屋',
          count: 666
        },
        {
          name: '刘红磊',
          id: '9527',
          phone: '18877665578',
          store: '简直是妙蛙种子拿着妙脆角妙进了米奇妙妙屋，妙到家了！简直是妙蛙种子拿着妙脆角妙进了米奇妙妙屋，妙到家了！简直是妙蛙种子拿着妙脆角妙进了米奇妙妙屋，妙到家了！',
          count: 662
        }
      ]
    }
  },
  methods: {
    handleClick (tab, event) {
      window.console.log(tab, event)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../styles/table-reset.css";

.analysis-container {
  .data-statistics {
    margin-top: 16px;
    width: 100%;
    height: 216px;
    background: #fff;
    border-radius: 4px;
    .data-statistics-content {
      margin: 16px 8px 0;
      display: flex;
      justify-content: space-evenly;
    }
  }

  .box-header {
    height: 56px;
    h3 {
      font-size: 16px;
      line-height: 56px;
      padding-left: 16px;
      color: #262626;
      font-weight: bold;
    }
  }

  .employee-details {
    margin-top: 16px;
    width: 100%;
    background: #fff;
    border-radius: 4px;
    .employee-table {
      width: calc(100% - 32px);
      margin: 0 auto;
      .scope-store-text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        // display: -webkit-box;
        // -webkit-box-orient: vertical;
        // -webkit-line-clamp: 3;
        &::after {
          content: '...'
        }
      }

      .scope-name_tip {
        color: #0091FA;
      }
    }
  }
}
</style>
