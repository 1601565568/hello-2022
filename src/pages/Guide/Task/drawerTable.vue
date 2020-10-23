<template>
  <div class="drawer">
    <ElScrollbar ref="fullScreen">
      <div class="drawer-head clearfix">
        门店名称
        <ElForm inline class="float-right" :model="form">
          <ElFormItem label="日期：">
            <ElDatePicker
              v-model="form.time"
              type="date"
              placeholder="选择日期" />
          </ElFormItem>
          <NsButton @click="exportData">导出CSV文件</NsButton>
        </ElForm>
      </div>
      <div class="drawer-info">
        执行导购：
        <span class="drawer-info__content">{{ totalNum }}人（ <span class="text-danger">{{ finishedCount }}</span> 人未完成）</span>
      </div>
      <div class="drawer-table">
        <el-table ref="table" :data="tableData"
                  resizable v-loading.lock="_data._table.loadingtable"
                  style="width: 100%;"
                  :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
          <el-table-column prop="name" label="导购" width="100px"/>
          <el-table-column prop="workId" label="工号" width="120px"/>
          <el-table-column prop="shopName" label="门店名称" width="120px" />
          <el-table-column align="center" label="任务状态" width="120px">
            <template slot-scope="scope">
              <span v-if="scope.row.state === 2" class="text-danger">未完成任务</span>
              <span v-if="scope.row.state === 1" class="text-info">任务进行中</span>
              <span v-if="scope.row.state === 3" class="text-success">已完成任务</span>
              <!-- <span v-if="scope.row.state === 3">未开始任务</span> -->
            </template>
          </el-table-column>
          <el-table-column align="center" prop="completeTime" label="完成时间" width="180px"/>
          <el-table-column prop="remark" label="反馈">
            <template slot-scope="scope">
              <!-- <div v-html="scope.row.content" class="table-content" /> -->
              <div class="remake-warpper">
               <div>{{scope.row.remark}}</div>
              <template v-if="scope.row && scope.row.urlJson">
                <div v-for="(item,index) in scope.row.urlJson.split(',')" :key="index">
                  <img :src="item" class="urkJsonimage" />
                </div>
              </template>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination v-if="_data._pagination.enable" class="drawer-footer"
                     :page-sizes="_data._pagination.sizeOpts" :total="_data._pagination.total"
                     :current-page="_data._pagination.page" :page-size="_data._pagination.size"
                     layout="total, sizes, prev, pager, next, jumper" @size-change="$sizeChange$"
                     @current-change="$pageChange$">
      </el-pagination>
    </ElScrollbar>
  </div>
</template>

<script>
import drawerVisible from './src/drawerVisible'
export default drawerVisible
</script>

<style scoped>
@import "@theme/variables.pcss";
.drawer {
  padding: 0 16px;
}
@component-namespace drawer {
  @b head {
    line-height: 28px;
    font-size: var(--default-font-size-middle);
    padding: 12px 0;
    >>> .el-form-item--small.el-form-item {
      margin: 0 16px 0 0!important;
    }
    >>> .el-button--small {
      position: relative;
      top: 1px;
    }
  }
  @b info {
    margin-top: 8px;
    background: #F2F9FE;
    border-radius: 2px;
    padding: 0 16px;
    color: #303133;
    line-height: 40px;
    @e content {
      color: #262626;
    }
  }
  @b table {
    padding-top: 16px;
    &:before {
      background-color: #E8E8E8;
    }
    >>> th {
      background-color: #f5f5f5;
      padding: 9px 0;
      border-color: #E8E8E8;
      &:first-child .cell {
        padding-left: 25px;
      }
      &:not(:last-child) .cell:after {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        content: ' ';
        border-left: 1px solid #E8E8E8;
      }
      .cell {
        padding: 0 9px;
      }
    }
    >>> td {
      padding: 10px 0;
      border-color: #E8E8E8;
      &:first-child .cell {
        padding-left: 25px;
      }
    }
    >>> .table-content {
      img {
        width: 32px;
        height: 32px;
        border-radius: 3px;
        margin-right: 4px;
        & + img {
          margin-left: 4px;
        }
      }
    }
  }
  @b footer {
    padding: 16px;
    box-shadow: none;
  }
}
.urkJsonimage{
  width: 50px;
  height: 50px;
  margin: 5px;
  object-fit: cover;
}
.remake-warpper {
  display: flex;
  align-items: center;
}
</style>
