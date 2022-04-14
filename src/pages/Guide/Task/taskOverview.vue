<template>
  <div class="taskOverview">
    <!-- 页面顶部内容 - 标题、保存按钮、面包屑 -->
    <div class="taskOverview-head">
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem>业绩指标</ElBreadcrumbItem>
        <ElBreadcrumbItem>任务管理</ElBreadcrumbItem>
        <ElBreadcrumbItem>查看任务进度</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
    <div class="taskOverview-content">
      <div class="taskOverview-materials">
        <div class="taskOverview-materials__head">任务概况</div>
        <div class="taskOverview-materials__content">
          <div class="taskOverview-materials__content-head">
            <!-- <span class="task-type business"><Icon type='business' class="task-type_icon"/>商机</span>
            <span class="task-type takumi"><Icon type='takumi' class="task-type_icon" />拓客</span> -->
            <div class="task-type marketing" v-if="taskMsg.type === 0">
              <Icon type="market" class="task-type_icon" />营销
            </div>
            <div class="task-type share" v-if="taskMsg.type === 2">
              <Icon type="share-alt" class="task-type_icon" />分享
            </div>
            <div class="task-type daily" v-if="taskMsg.type === 3">
              <Icon type="daily" class="task-type_icon" />日常
            </div>
            <div class="task-type returnvisit" v-if="taskMsg.type === 1">
              <Icon type="returnvisit" class="task-type_icon" />回访
            </div>
            <span class="task-type-name">{{ taskMsg.name }}</span>
            <el-tag type="success" v-if="taskMsg.state === 1">执行中</el-tag>
            <el-tag type="info" v-if="taskMsg.state === 3">已完成</el-tag>
            <el-tag type="warning" v-if="taskMsg.state === 5">未开始</el-tag>
            <el-tag type="danger" v-if="taskMsg.state === 6">未完成</el-tag>
            <div class="task-group__name" v-if="taskMsg.subGroupId">
              {{ taskMsg.subGroupName }}
              <NsButton @click="showSubgroupMsg" type="text" >查看详情</NsButton>
            </div>
            <!-- <el-tag class="head-tag" type="danger">未完成</el-tag> -->
          </div>
          <div class="taskOverview-materials__content-info">
            {{ taskMsg.startTime }} 至 {{ taskMsg.endTime }}
            <span class="text-normal" v-if="taskMsg.runType === 0">（一次性）</span>
            <span class="text-normal" v-if="taskMsg.runType === 1">（每日执行）</span>
          </div>
          <div class="taskOverview-materials__content-text">
            {{ taskMsg.remark }}
          </div>
        </div>
        <div class="taskOverview-materials__info" v-if="taskMsg.materialId != null">
          <addMaterial
            :types="1"
            :data="taskMsg.materialMsg"
            @preview="togglePreview"
            :materialTitle="taskMsg.materialContent"
          ></addMaterial>
          <div
            class="v_btn"
            v-if="
              taskMsg.materialMsg.imageList && taskMsg.materialMsg.imageList.length > 0
            "
          >
            共{{
              (taskMsg.materialMsg.imageList && taskMsg.materialMsg.imageList.length) ||
              0
            }}条信息
            <el-tooltip
              v-if="subNumber(0, taskMsg.materialMsg.imageList)"
              content="图片"
              placement="top"
              effect="light"
            >
              <Icon class="icons" type="images" />
            </el-tooltip>
            <el-tooltip
              v-if="subNumber(2, taskMsg.materialMsg.imageList)"
              content="视频"
              placement="top"
              effect="light"
            >
              <Icon class="icons" type="videos" />
            </el-tooltip>
            <el-tooltip
              v-if="subNumber(3, taskMsg.materialMsg.imageList)"
              content="链接"
              placement="top"
              effect="light"
            >
              <Icon class="icons" type="links" />
            </el-tooltip>
            <el-tooltip
              v-if="subNumber(4, taskMsg.materialMsg.imageList)"
              content="小程序"
              placement="top"
              effect="light"
            >
              <Icon class="icons" type="apps" />
            </el-tooltip>
            <span @click="dialogClick(taskMsg.materialMsg)">查看全部</span>
          </div>
        </div>
        <!-- <div class="taskOverview-materials__info" v-if="taskMsg.materialId != null">
          <p class="taskOverview-materials__info-content">
            {{ taskMsg.materialTitle }}
          </p>
          <div class="taskOverview-materials__item--media">
              <div class='taskOverview-materials__image' v-if="taskMsg.materialType === 1 && taskMsg.materialMsg">
                <div v-for="(item, index) in taskMsg.materialMsg.imageList" :key="index">
                  <img :src='item' />
                </div>
              </div>
              <div class='taskOverview-materials__video' v-if="taskMsg.materialType === 2  && taskMsg.materialMsg">
                <video
                  :src='taskMsg.materialMsg.imageList[0]'
                  style='width: 60px; height: 107px'
                >
                  您的浏览器暂不支持播放该视频，请升级至最新版浏览器。
                </video>
                <div class='taskOverview-materials__video--mask'>
                  <div class='taskOverview-materials__video--wrapper'>
                    <Icon type='begin' />
                  </div>
                </div>
              </div>
              <div class="taskOverview-materials__article" v-if="taskMsg.materialType === 0 && taskMsg.materialMsg">
                <img :src="taskMsg.materialMsg.imageList[0]">
                <p>{{taskMsg.materialTitle}}</p>
              </div>
          </div>
        </div> -->
      </div>
      <div class="taskOverview-detail">
        <div class="taskOverview-detail__head clearfix">
          <span class="taskOverview-detail__title">进度统计</span>
          <ElForm inline class="float-right" :model="searchMap">
            <ElFormItem label="选择门店：">
              <el-form-grid size="xmd">
                <shop-select-load
                  placeholder="请选择工作门店"
                  v-model="searchMap.shopId"
                  ref="shopSelectLoad"
                  @handleVisibleChange="handleVisibleChange"
                  clearable
                />
              </el-form-grid>
            </ElFormItem>
            <ElFormItem label="日期：" v-if="taskMsg.runType === 1">
              <ElDatePicker
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                v-model="searchMap.queryTime"
                type="date"
                :picker-options="pickerOptions"
                @change="queryTimeChange"
                placeholder="选择日期"
              />
            </ElFormItem>
            <NsButton @click="exportGuideCompleteData">导出导购完成明细CSV文件</NsButton>
            <NsButton @click="exportShopCompleteData">导出CSV文件</NsButton>
          </ElForm>
        </div>
        <div class="taskOverview-detail__data">
          <ElRow :gutter="24">
            <ElCol :span="4">
              <div class="taskOverview-detail__data-item">
                <p class="data-item__title">指派门店</p>
                <span class="data-item__num">{{ taskMsg.shopNum }}</span>
                <span class="data-item__icon distributionStore">
                  <Icon type="distributionstore" class="distributionStoreIcon" />
                  <!-- <img src="../../../icons/outline/distributionStore.svg" alt=""> -->
                </span>
              </div>
            </ElCol>
            <ElCol :span="4">
              <div class="taskOverview-detail__data-item">
                <p class="data-item__title">分配导购</p>
                <span class="data-item__num">{{ taskMsg.guideNum }}</span>
                <span class="data-item__icon distributionGuide">
                  <Icon type="distributionguide" class="distributionguideIcon" />
                  <!-- <img src="../../../icons/outline/distributionGuide.svg" alt=""> -->
                </span>
              </div>
            </ElCol>
            <ElCol :span="4">
              <div class="taskOverview-detail__data-item">
                <p class="data-item__title">分配客户</p>
                <span class="data-item__num">{{isHaveGroup ? taskMsg.customerTotal:'-' }}</span>
                <span class="data-item__icon distributionGuideA">
                  <Icon
                    type="distributionguide"
                    class="distributionguideIcon"
                    style="color: #905ee6"
                  />
                  <!-- <img src="../../../icons/outline/distributionGuide.svg" alt=""> -->
                </span>
              </div>
            </ElCol>
            <ElCol :span="4">
              <div class="taskOverview-detail__data-item">
                <p class="data-item__title">联系中客户</p>
                <span class="data-item__num">{{ isHaveGroup ?taskMsg.customerFollowingNum :'-' }}</span>
                <span class="data-item__icon distributionGuideB">
                  <Icon
                    type="distributionguide"
                    class="distributionguideIcon"
                    style="color: #fa8500"
                  />
                  <!-- <img src="../../../icons/outline/distributionGuide.svg" alt=""> -->
                </span>
              </div>
            </ElCol>
            <ElCol :span="4">
              <div class="taskOverview-detail__data-item">
                <p class="data-item__title">跟进成功客户</p>
                <span class="data-item__num">{{ isHaveGroup ? taskMsg.customerFollowNum  :'-'}}</span>
                <span class="data-item__icon distributionGuideC">
                  <Icon
                    type="distributionguide"
                    class="distributionguideIcon"
                    style="color: #5ec920"
                  />
                  <!-- <img src="../../../icons/outline/distributionGuide.svg" alt=""> -->
                </span>
              </div>
            </ElCol>
            <ElCol :span="4">
              <div class="taskOverview-detail__data-item">
                <p class="data-item__title">
                  完成度
                  <el-tooltip content="筛选门店的平均完成度，即门店完成度相加/门店数">
                    <Icon type="question-circle" />
                  </el-tooltip>
                </p>
                <span class="data-item__num">{{ taskMsg.completion }}%</span>
                <span class="data-item__icon degreeCompletion">
                  <Icon type="degreecompletion" class="degreecompletionIcon" />
                  <!-- <img src="../../../icons/outline/degreeCompletion.svg" alt=""> -->
                </span>
              </div>
            </ElCol>
          </ElRow>
        </div>
        <div class="taskOverview-detail__table">
          <el-table
            ref="table"
            :data="tableData"
            resizable
            v-loading.lock="table.loadingtable"
            style="width: 100%"
            :element-loading-text="$t('prompt.loading')"
            @sort-change="$orderChange$"
          >
            <el-table-column
              :show-overflow-tooltip="true"
              prop="shopName"
              label="门店名称"
            />
            <el-table-column label="区域" prop="address" width="200px" />
            <el-table-column align="left" prop="shopType" label="类型">
              <template slot-scope="{ row }">
                <span v-if="row.shopType === 'ZYD'">直营店</span>
                <span v-else-if="row.shopType === 'JMD'">加盟店</span>
                <span v-else-if="row.shopType === 'LYD'">联营店</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column align="left" prop="shopStatus" label="线下门店状态">
              <template slot-scope="scope">
                <span v-if="scope.row.shopStatus === 0" class="text-danger">删除</span>
                <span v-if="scope.row.shopStatus === -1" class="text-danger">暂停</span>
                <span v-if="scope.row.shopStatus === -2" class="text-danger">已关店</span>
                <span v-if="scope.row.shopStatus === 1" class="text-info">正常</span>
              </template>
            </el-table-column>
            <el-table-column align="left" prop="guideCount" label="分配导购" >
              <template slot-scope="scope"> {{ `${scope.row.guideCount}人` || '-'}} </template>
            </el-table-column>
            <el-table-column align="left" prop="customerTotal" label="分配客户" >
              <template slot-scope="scope"> {{ isHaveGroup ? `${Number(scope.row.customerTotal) === NaN ? scope.row.customerTotal : scope.row.customerTotal + '人'}` : '-' }} </template>
            </el-table-column>
            <el-table-column align="left" prop="customerNoFollowNum" label="待跟进客户">
              <template slot-scope="scope"> {{ isHaveGroup ? `${Number(scope.row.customerNoFollowNum) === NaN ? scope.row.customerNoFollowNum : scope.row.customerNoFollowNum + '人'}` : '-' }} </template>
            </el-table-column>
            <el-table-column
              align="left"
              prop="customerFollowingNum"
              label="联系中客户"
            >
            <template slot-scope="scope"> {{ isHaveGroup ? `${Number(scope.row.customerFollowingNum) === NaN ? scope.row.customerFollowingNum : scope.row.customerFollowingNum + '人'}` : '-' }}</template>
            </el-table-column>
            <el-table-column align="left" prop="customerFollowNum" label="跟进成功客户" >
              <template slot-scope="scope"> {{isHaveGroup ? `${Number(scope.row.customerFollowNum) === NaN ? scope.row.customerFollowNum : scope.row.customerFollowNum + '人'}` : '-'}} </template>
            </el-table-column>
            <el-table-column align="left" prop="completion" label="完成度">
              <template slot-scope="scope"> {{ scope.row.completion || 0 }}% </template>
            </el-table-column>
            <el-table-column align="left" label="操作">
              <template slot-scope="scope">
                <ns-table-column-operate-button
                  :buttons="table.table_buttons"
                  :class="[scope.row.customerTotal === '正在获取中…' && 'zhihui']"
                  :prop="scope"
                >
                </ns-table-column-operate-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          v-if="pagination.enable"
          class="taskOverview-detail__footer"
          :page-sizes="pagination.sizeOpts"
          :total="pagination.total"
          :current-page="pagination.page"
          :page-size="pagination.size"
          :pager-count="5"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="sizeChange"
          @current-change="pageChange"
        >
        </el-pagination>
      </div>
    </div>
    <el-drawer title="" size="1500px" :visible.sync="drawerVisible" direction="rtl">
      <drawerTable
        v-if="drawerVisible"
        :id="id"
        :shopId="shopId"
        :shopName="shopName"
        :runType="runType"
        :queryTime="searchMap.queryTime"
      />
    </el-drawer>
    <ElDialog title="会员分组客户列表" :visible.sync="dialogVisible" width="960px">
      <el-form :inline="true" v-if="taskMsg.runType === 1">
        <el-form-item label="执行时间：">
          <el-date-picker
            :clearable="false"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="taskTime"
            :picker-options="pickerOptions"
            type="datetime"
            placeholder="选择日期时间"
            default-time="12:00:00"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <lookCardList
        v-if="dialogVisible"
        :subgroupId="taskMsg.subgroupId"
        :formSource="2"
        :time="taskTime"
        :runType="taskMsg.runType"
        :taskId="taskMsg.id"
      ></lookCardList>
    </ElDialog>
    <el-dialog width="600px" title="查看全部" :visible.sync="dialogFlag">
      <materialDialog
        :names="taskMsg.name"
        :listMap="listMap"
        :createTime="taskMsg.startTime"
        :types="1"
        :materialTitle="taskMsg.materialTitle"
        @preview="togglePreview"
      ></materialDialog>
    </el-dialog>
    <preview ref="preview"></preview>
  </div>
</template>
<script>
import taskOverview from './src/taskOverview'
export default taskOverview
</script>
<style lang="scss" scoped>
.v_btn {
  height: 20px;
  font-size: 12px;
  color: #383838;
  line-height: 20px;
  margin-top: 8px;
  .icons {
    margin-left: 4px;
  }
  svg {
    vertical-align: -2px;
  }
  span {
    margin-left: 5px;
    color: #0094fc;
    cursor: pointer;
  }
}
</style>
<style scoped>
@import "@theme/variables.pcss";
.zhihui >>> button {
  color: #606266;
}
.taskOverview {
  >>> .taskOverview-head {
    padding: 16px 16px 8px;
    background: var(--theme-color-white);
    margin: -10px -10px 0;
    .el-breadcrumb {
      line-height: 22px;
    }
    .el-breadcrumb__item:not(:last-child) {
      .el-breadcrumb__inner,
      .el-breadcrumb__separator {
        color: var(--theme-font-color-secondary);
      }
    }
    .el-breadcrumb__separator {
      font-weight: normal;
      margin: 0 var(--default-margin-larger) 0 var(--default-margin-small);
    }
  }
}
.task-group__name {
  margin-left: 32px;
  position: relative;
  top: -2px;
}

/* 素材模版样式 */
@component-namespace taskOverview {
  @b materials {
    padding: 0 16px 16px;
    margin-top: 8px;
    background: var(--theme-color-white);
    border-radius: 4px;
    @e head {
      line-height: 56px;
      font-size: var(--default-font-size-middle);
      color: #262626;
    }
    @e image {
      margin-right: -6px;
      margin-bottom: -5px;
      vertical-align: middle;
      display: flex;
      flex-wrap: wrap;
      img {
        margin: 0 5px 5px 0;
        width: 78px;
        height: 78px;
        border-radius: 3px;
        cursor: pointer;
        object-fit: cover;
      }
    }
    @e article {
      background: #ccc;
      display: flex;
      align-items: center;
      padding: 5px;
      img {
        width: 78px;
        height: 78px;
        border-radius: 3px;
        cursor: pointer;
        object-fit: cover;
        margin-right: 5px;
      }
      p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    @e content {
      padding: 8px 0;
    }
    @e content-head {
      color: #303133;
      line-height: 22px;
      display: flex;
      .task-type {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 6px;
        height: 22px;
        width: 56px;
        color: #ffffff;
        margin-right: 8px;
        border-radius: 11px;
        background-image: linear-gradient(90deg, #fbd266 0%, #f8b864 100%);
        img {
          position: relative;
          top: -1px;
          margin-right: 2px;
        }
        &.business {
          background-image: linear-gradient(90deg, #f77676 0%, #ea6d6d 100%);
        }
        &.takumi {
          background-image: linear-gradient(90deg, #fbd266 0%, #f8b864 100%);
        }
        &.marketing {
          background-image: linear-gradient(90deg, #31bbff 0%, #2ba5ff 100%);
        }
        &.share {
          background-image: linear-gradient(90deg, #fbd266 0%, #f8b864 100%);
        }
        &.daily {
          background-image: linear-gradient(90deg, #fbae66 0%, #f89364 100%);
        }
        &.returnvisit {
          background-image: linear-gradient(90deg, #f77676 0%, #ea6d6d 100%);
        }
        .task-type_icon {
          font-size: 16px;
        }
      }
      .task-type-name {
        display: inline-block;
        margin-right: 8px;
      }
      .head-tag {
        cursor: default;
        margin-left: 8px;
      }
    }
    @e content-info {
      margin-top: 16px;
      color: #8c8c8c;
      line-height: 20px;
      .text-normal {
        color: #262626;
      }
    }
    @e content-text {
      margin-top: 8px;
      color: #595959;
      text-align: justify;
      line-height: 22px;
    }
    @e info {
      padding: 16px;
      background: #f5f5f5;
      border-radius: 2px;
    }
    @e info-content {
      margin-bottom: 8px !important;
      line-height: 22px;
      color: #595959;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    @e video {
      display: inline-block;
      position: relative;
      font-size: 0;
      line-height: 1;
      vertical-align: middle;
      video {
        width: 100%;
        height: 142px;
        border-radius: 3px;
        object-fit: cover;
      }

      @m mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.25);
        cursor: pointer;
        border-radius: 3px;
      }
      @m wrapper {
        position: relative;
        top: 50%;
        left: 50%;
        margin-left: -20px;
        margin-top: -20px;
        width: 40px;
        height: 40px;
        border-radius: 40px;
        background-color: rgba(255, 255, 255, 0.4);
        > svg {
          margin: 5px 0 0 9px;
          font-size: 25px;
          color: #fff;
        }
      }
    }
  }
  @b detail {
    padding: 0 16px;
    margin-top: 8px;
    background: var(--theme-color-white);
    @e head {
      padding: 12px 0;
      >>> .el-form-item--small.el-form-item {
        margin: 0 4px 0 0 !important;
      }
      >>> .el-button--small {
        position: relative;
        top: 1px;
      }
      >>> .el-button--small .el-button--small {
        margin-left: 16px;
      }
    }
    @e title {
      margin: 5px 0;
      display: inline-block;
      font-size: 16px;
      color: #262626;
      font-weight: bold;
    }
    @e data {
      padding-top: 12px;
      .taskOverview-detail__data-item {
        position: relative;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        padding: 17px 24px;
        min-height: 90px;
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
    }
    @e table {
      padding-top: 24px;
      >>> .el-button--text{
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
    }
    @e footer {
      padding: 16px 24px;
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
    >>>.btn-prev .el-icon {
      font-size: 16px;
      margin-top: 2px;
    }
    >>>.btn-next .el-icon {
      font-size: 16px;
      margin-top: 2px;
    }
    >>> .el-pager li {
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
    >>> .el-pagination__jump{
      font-size: 14px;
    }
    >>>.el-pagination__editor.el-input{
      width: 50px;
      height: 32px;
      border: 1px solid rgba(217,217,217,1);
      border-radius: 2px;
      box-sizing: border-box;
      margin:0 8px
    }
    >>>.el-input.el-input--small .el-input__inner{
      border: none;
    }
    }
  }
}
>>> .el-drawer__header {
  margin-bottom: 0;
  display: block;
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
</style>
