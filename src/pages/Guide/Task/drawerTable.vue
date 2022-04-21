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
              placeholder="选择日期"
            />
          </ElFormItem>
        </ElForm>
      </div>
      <!-- <div class="drawer-info">
        执行导购：
        <span class="drawer-info__content">{{ totalNum }}人（ <span class="text-danger">{{ finishedCount }}</span> 人未完成）</span>
      </div> -->
      <div class="nav">
        <div class="taskOverview-detail__data-item">
          <p class="data-item__title">执行导购</p>
          <span class="data-item__num">{{ isHaveGroup ? pagination.total : "-" }}</span>
          <span class="data-item__icon distributionStore">
            <Icon type="distributionstore" class="distributionStoreIcon" />
          </span>
        </div>
        <div class="taskOverview-detail__data-item">
          <p class="data-item__title">分配客户</p>
          <span class="data-item__num">{{
            isHaveGroup ? extData.customerTotal : "-"
          }}</span>
          <span class="data-item__icon distributionGuide">
            <Icon type="distributionguide" class="distributionguideIcon" />
          </span>
        </div>
        <div class="taskOverview-detail__data-item">
          <p class="data-item__title">联系中客户</p>
          <span class="data-item__num">{{
            isHaveGroup ? extData.customerFollowingNum : "-"
          }}</span>
          <span class="data-item__icon distributionGuideA">
            <Icon
              type="distributionguide"
              class="distributionguideIcon"
              style="color: #905ee6"
            />
          </span>
        </div>
        <div class="taskOverview-detail__data-item">
          <p class="data-item__title">跟进成功客户</p>
          <span class="data-item__num">{{
            isHaveGroup ? extData.customerFollowNum : "-"
          }}</span>
          <span class="data-item__icon distributionGuideB">
            <Icon
              type="distributionguide"
              class="distributionguideIcon"
              style="color: #fa8500"
            />
          </span>
        </div>
        <div class="taskOverview-detail__data-item">
          <p class="data-item__title">
            跟进进度
            <!-- <el-tooltip content="筛选门店的平均完成度，即门店完成度相加/门店数">
                    <Icon type="question-circle" />
                  </el-tooltip> -->
          </p>
          <span class="data-item__num">{{
            isHaveGroup ? extData.followProgress : "-"
          }}</span>
          <span class="data-item__icon degreeCompletion">
            <Icon type="degreecompletion" class="degreecompletionIcon" />
          </span>
        </div>
      </div>
      <div class="export">
        <NsButton @click="exportData">导出文件</NsButton>
      </div>
      <div class="drawer-table">
        <el-table
          ref="table"
          :data="tableData"
          resizable
          v-loading.lock="_data._table.loadingtable"
          style="width: 100%"
          :element-loading-text="$t('prompt.loading')"
          @sort-change="$orderChange$"
        >
          <el-table-column prop="name" label="导购">
            <template slot-scope="scope">
              {{ scope.row.name || "-" }}
            </template>
          </el-table-column>
          <el-table-column prop="workId" label="工号">
            <template slot-scope="scope">
              {{ scope.row.workId || "-" }}
            </template>
          </el-table-column>
          <el-table-column prop="shopName" label="门店名称" />
          <el-table-column align="left" label="任务状态">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.state === 1">任务进行中</el-tag>
              <el-tag type="warning" v-if="scope.row.state === 2">已过期</el-tag>
              <el-tag type="info" v-if="scope.row.state === 3">已完成</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="left" prop="customerTotal" label="分配客户">
            <template slot-scope="scope">
              {{ isHaveGroup ? `${Number.isFinite(Number(scope.row.customerTotal))?scope.row.customerTotal+'人': scope.row.customerTotal}` : "-" }}
            </template>
          </el-table-column>
          <el-table-column align="left" prop="customerNoFollowNum" label="未联系客户">
            <template slot-scope="scope">
              {{ isHaveGroup ? `${Number.isFinite(Number())? scope.row.customerNoFollowNum+'人': scope.row.customerNoFollowNum}` : "-" }}
            </template>
          </el-table-column>
          <el-table-column align="left" prop="customerFollowingNum" label="联系中客户">
            <template slot-scope="scope">
              {{ isHaveGroup ? `${Number.isFinite(Number())? scope.row.customerFollowingNum+'人': scope.row.customerFollowingNum}` : "-" }}
            </template>
          </el-table-column>
          <el-table-column align="left" prop="customerFollowNum" label="跟进成功客户">
            <template slot-scope="scope">
              {{ isHaveGroup ? `${ Number.isFinite(Number())?scope.row.customerFollowNum+'人': scope.row.customerFollowNum}` : "-" }}
            </template>
          </el-table-column>
          <el-table-column align="left" prop="followProgress" label="跟进进度">
            <template slot-scope="scope">
              {{ isHaveGroup ? scope.row.followProgress : "-" }}
            </template>
          </el-table-column>
          <el-table-column align="left" prop="completeTime" label="完成时间">
            <template slot-scope="scope">
              {{ scope.row.completeTime || "-" }}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="任务反馈" width="260px">
            <template slot-scope="scope">
              <div>
                <div class="remark">{{ scope.row.remark || "-" }}</div>
                <div v-if="scope.row && scope.row.urlJson" class="urkJsonimageWarpper">
                  <div
                    class="urkJsonimage"
                    v-for="(item, index) in formatUrlJson(scope.row.urlJson)"
                    :key="index"
                  >
                    <img :src="item" />
                  </div>
                  <span title="点击查看全部" @click="onShowPic(scope.row.urlJson)"
                    >共{{ scope.row.urlJson.split(",").length }}张</span
                  >
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="left" label="操作">
            <template slot-scope="scope">
              <ns-table-column-operate-button
                :buttons="table.table_buttons"
                :prop="scope"
              >
              </ns-table-column-operate-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        v-if="pagination.enable"
        class="drawer-footer"
        :page-sizes="pagination.sizeOpts"
        :total="pagination.total"
        :current-page="pagination.page"
        :page-size="pagination.size"
        :pager-count="5"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="$sizeChange$"
        @current-change="$currentChange$"
      >
      </el-pagination>
    </ElScrollbar>
    <NsPreview ref="NsPreview" :appendToBody="true"></NsPreview>
    <el-drawer
      title=""
      size="80%"
      :visible.sync="drawerVisible"
      direction="rtl"
      :append-to-body="true"
    >
      <drawerClient
        v-if="drawerVisible"
        :runType="runType"
        :guideName="guideName"
        :isHaveGroup="isHaveGroup"
        :id="id"
        :shopId="shopId"
        :guideId="guideId"
        :queryDate="form.time"
        :shopName="name"
        :taskName="taskName"
      />
    </el-drawer>
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
>>> .el-drawer__header {
  margin-bottom: 0;
  display: block;
}
@component-namespace drawer {
  @b head {
    line-height: 28px;
    font-size: var(--default-font-size-middle);
    padding: 12px 0;
    >>> .el-form-item--small.el-form-item {
      margin: 0 16px 0 0 !important;
    }
    /* >>> .el-button--small {
      position: relative;
      top: 1px;
    } */
  }
  @b info {
    margin-top: 8px;
    background: #f2f9fe;
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
    >>> .el-button--text {
        font-size: 14px;
      }
    &:before {
      background-color: #e8e8e8;
    }
    >>> tr {
      font-size: 14px;
    }
    >>> th {
      background-color: #f5f5f5;
      padding: 9px 0;
      border-color: #e8e8e8;
      &:first-child .cell {
        padding-left: 25px;
      }
      &:not(:last-child) .cell:after {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        content: " ";
        border-left: 1px solid #e8e8e8;
      }
      .cell {
        padding: 0 9px;
      }
    }
    >>> td {
      padding: 13.5px 0;
      border-color: #e8e8e8;
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
    >>> .el-pagination__total {
      font-size: 14px;
      color: #262626;
      line-height: 30px;
    }
    >>> .el-select .el-input .el-input__inner {
      height: 32px;
      line-height: 32px;
    }
    >>> .el-pagination__sizes .el-input .el-input__inner {
      font-size: 14px;
    }
    >>> .btn-prev .el-icon {
      font-size: 16px;
      margin-top: 2px;
    }
    >>> .btn-next .el-icon {
      font-size: 16px;
      margin-top: 2px;
    }
    >>> .el-pager li {
      padding: 0;
      font-size: 14px;
      width: 32px;
      height: 32px;
      line-height: 32px;
      border: 1px solid rgba(217, 217, 217, 1);
      border-radius: 2px;
      box-sizing: border-box;
      margin-right: 8px;
      min-width: 32px;
    }
    >>> .el-pager li.active {
      border: none;
    }
    >>> .el-pagination__jump {
      font-size: 14px;
    }
    >>> .el-pagination__editor.el-input {
      width: 50px;
      height: 32px;
      border: 1px solid rgba(217, 217, 217, 1);
      border-radius: 2px;
      box-sizing: border-box;
      margin: 0 8px;
    }
    >>> .el-input.el-input--small .el-input__inner {
      border: none;
    }
  }
}
.remark {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.urkJsonimageWarpper {
  display: flex;
  align-items: flex-end;
}
.urkJsonimage {
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
  margin-right: 0px !important;
}
.remake-warpper {
  display: flex;
  align-items: center;
}
.urkJsonimageWarpper span {
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  color: #0094fc;
}
.nav {
  width: 100%;
  /* padding: 0 16px; */
  margin: 16px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .taskOverview-detail__data-item {
    &:last-child {
      margin-right: 0;
    }
    flex: 1;
    min-height: 90px;
    margin-right: 17px;
    position: relative;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    padding: 17px 24px;
    .data-item__title {
      color: #8c8c8c;
      line-height: 22px;
      .data-item__title-icon {
        cursor: pointer;
      }
    }
    .data-item__num {
      margin-top: 8px;
      font-size: 24px;
      color: #262626;
      line-height: 32px;
    }
    .data-item__icon {
      position: absolute;
      top: 50%;
      right: 24px;
      margin-top: -24px;
      display: inline-block;
      width: 48px;
      height: 48px;
      padding: 11px;
      background: #fff6e6;
      border-radius: 100%;
      &.distributionStore {
        background: #f2f9fe;
      }
      &.distributionGuide {
        background: #fff6e6;
      }
      &.distributionGuideA {
        background: #f7f0ff;
      }
      &.distributionGuideB {
        background: #fff4e6;
      }
      &.distributionGuideC {
        background: #edfae1;
      }
      &.degreeCompletion {
        background: #edf9e8;
      }
      img {
        width: 26px;
        height: 26px;
      }
    }
  }
  .distributionStoreIcon {
    font-size: 26px;
    color: rgb(71, 146, 249);
  }
  .distributionguideIcon {
    font-size: 26px;
    color: rgb(243, 174, 17);
  }

  .degreecompletionIcon {
    font-size: 26px;
    color: rgb(65, 197, 0);
  }
}
.export {
  display: flex;
  justify-content: flex-end;
  & >>> button {
    width: 116px;
    height: 32px;
    font-size: 14px;
    color: #595959;
  }
}
</style>
