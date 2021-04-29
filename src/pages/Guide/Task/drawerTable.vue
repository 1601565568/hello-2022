<template>
  <div class="drawer">
    <ElScrollbar ref="fullScreen">
      <div class="drawer-head clearfix">
        {{ name }}
        <ElForm inline class="float-right" :model="form">
          <ElFormItem label="日期：" v-if="type === 1">
            <ElDatePicker
              v-model="form.time"
              type="date"
              @change="queryTimeChange"
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
          <el-table-column prop="name" label="导购" width="150px">
            <template slot-scope="scope">
              {{scope.row.name || '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="workId" label="工号" width="120px">
            <template slot-scope="scope">
              {{scope.row.workId || '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="shopName" label="门店名称" width="140px" />
          <el-table-column align="center" label="任务状态" width="120px">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.state === 1">任务进行中</el-tag>
              <el-tag type="warning" v-if="scope.row.state === 2">已过期</el-tag>
              <el-tag type="info" v-if="scope.row.state === 3">已完成</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="completeTime" label="完成时间" width="180px">
           <template slot-scope="scope">
              {{scope.row.completeTime || '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="反馈">
            <template slot-scope="scope">
              <div>
              <div class="remark">{{scope.row.remark || '-'}}</div>
              <div v-if="scope.row && scope.row.urlJson" class="urkJsonimageWarpper">
                <div class="urkJsonimage" v-for="(item,index) in formatUrlJson(scope.row.urlJson)" :key="index" >
                  <img :src="item"/>
                </div>
                <span title="点击查看全部" @click="onShowPic(scope.row.urlJson)">共{{scope.row.urlJson.split(',').length}}张</span>
              </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination v-if="pagination.enable" class="drawer-footer"
                     :page-sizes="pagination.sizeOpts" :total="pagination.total"
                     :current-page="pagination.page" :page-size="pagination.size"
                     layout="total, sizes, prev, pager, next, jumper" @size-change="$sizeChange$"
                     @current-change="$currentChange$">
      </el-pagination>
    </ElScrollbar>
    <NsPreview ref="NsPreview" :appendToBody='true'></NsPreview>
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
    /* >>> .el-button--small {
      position: relative;
      top: 1px;
    } */
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
.remark {
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.urkJsonimageWarpper {
  display: flex;
  align-items: flex-end;
}
.urkJsonimage{
  width: 32px;
  height: 32px;
  margin-right: 8px;
  border-radius: 2px;
}
.urkJsonimage img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.urkJsonimage:last-child {
  margin-right: 0px!important;
}
.remake-warpper {
  display: flex;
  align-items: center;
}
.urkJsonimageWarpper span {
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  color: #0094FC;
}
</style>
