<template>
  <div class="adder-detail-container">
    <div class="adder-tool-bar">
      <div class="adder-owners">
        <span class="owners-label">所属员工：</span>
        <div class="owners-select">
          <span>已选择555哈哈啊哈个</span>
          <Icon type="geren" class="select-icon"/>
        </div>
      </div>
      <el-input v-model="seachVal" placeholder="请输入员工姓名" >
        <Icon type="ns-search-copy" slot="suffix" class='search-icon el-input__icon'></Icon>
      </el-input>
      <ns-button size="medium" class="export-cvs-btn">导出CSV文件</ns-button>
    </div>
    <div class="adder-detail-table">
      <el-table
        style="width: 100%;"
        size="medium"
        class="table-form_reset"
        row-class-name="employee-table_row"
        header-cell-class-name="employee-talbe-header-cell"
        :data="tableData"
      >
        <el-table-column
          prop="avatar"
          label="头像">
          <template slot-scope="scope">
            <img class="scope-avatar" :src="scope.row.avatar" alt="">
          </template>
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="昵称">
        </el-table-column>
        <el-table-column
          prop="name"
          label="员工">
        </el-table-column>
        <el-table-column
          prop="id"
          label="工号">
        </el-table-column>
        <el-table-column
          prop="time"
          label="添加时间"
          sortable>
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

      <NsGuideDialog :selfBtn='true' :appendToBody='true' :isButton="false" :auth="false" type="primary" btnTitle="" dialogTitle="选择员工" v-model="model.guideIds" @input="handleChangeGuide">
          <template slot='selfBtn'>
            <div class='self-btn'>
              全部
              <Icon type="geren" class='guideIds-icon'></Icon>
            </div>
          </template>
      </NsGuideDialog>
  </div>
</template>

<script>
import NsGuideDialog from '@/components/NsGuideDialog'

/**
 * 添加明细
 */
export default {
  data () {
    return {
      seachVal: '',
      // 筛选数据
      model: {
        guideIds: [],
        name: '',
        startTime: '',
        endTime: '',
        status: -1
      },
      tableData: [
        {
          id: '9527',
          avatar: 'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2661062384,3387585137&fm=26&gp=0.jpg',
          name: '18877665578',
          nickname: '红磊',
          time: '2021/02/04'
        },
        {
          id: '9528',
          avatar: 'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=4216711975,3280417109&fm=26&gp=0.jpg',
          name: '18877665578',
          nickname: '宇业',
          time: '2021/02/04'
        }
      ]
    }
  },
  methods: {
    handleClick (tab, event) {
      window.console.log(tab, event)
    },
    handleChangeGuide () {
      window.console.log('handleChangeGuide')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../styles/table-reset.css";
@import "../styles/toolbar-reset.css";

.adder-detail-container {
  margin-top: 16px;
  width: 100%;
  background: #fff;
  border-radius: 4px;
  overflow: hidden;

  .adder-tool-bar {
    margin-top: 4px;
    width: 100%;
    height: 56px;
    display: flex;
    align-items: center;
    position: relative;

    .adder-owners {
      position: relative;
      width: 168px;
      height: 32px;
      font-size: 14px;
      box-sizing: border-box;
      border: 1px solid #D9D9D9;
      border-radius: 4px;
      margin: 0 16px;
      display: flex;
      align-items: center;
      .owners-label {
        color: #606266;
        padding-left: 8px;
      }
      .owners-select {
        display: flex;
        align-items: center;
        cursor: pointer;
        span {
          display: inline-block;
          width: 60px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .select-icon {
          display: inline-block;
          position: absolute;
          top: 8px;
          right: 8px;
          color:#C0C4CC;
        }
      }
    }

    .export-cvs-btn {
      position: absolute;
      top: 12px;
      right: 16px;
    }
  }

  .adder-detail-table {
    width: calc(100% - 32px);
    margin: 8px auto 0;

    .scope-avatar {
      width: 32px;
      height: 32px;
      border-radius: 4px;
    }
  }
}
</style>
