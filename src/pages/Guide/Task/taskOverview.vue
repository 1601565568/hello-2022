<template>
  <div class="taskOverview">
    <!-- 页面顶部内容 - 标题、保存按钮、面包屑 -->
    <div class="taskOverview-head">
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem>业绩指标</ElBreadcrumbItem>
        <ElBreadcrumbItem>任务管理</ElBreadcrumbItem>
        <ElBreadcrumbItem>任务进度统计</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
    <div class="taskOverview-content">
      <div class="taskOverview-materials">
        <div class="taskOverview-materials__head">任务概况</div>
        <div class="taskOverview-materials__content">
          <div class="taskOverview-materials__content-head">
            <!-- <span class="task-type business"><img src="../../../icons/outline/business.svg" alt="">商机</span>
            <span class="task-type takumi"><img src="../../../icons/outline/takumi.svg" alt="">拓客</span> -->
            <span class="task-type marketing" v-if="taskMsg.type === 0"><img src="../../../icons/outline/market.svg" alt="">营销</span>
            <span class="task-type share" v-if="taskMsg.type === 2"><img src="../../../icons/outline/share.svg" alt="">分享</span>
            <span class="task-type daily" v-if="taskMsg.type === 3"><img src="../../../icons/outline/daily.svg" alt="">日常</span>
            <span class="task-type returnvisit" v-if="taskMsg.type === 1"><img src="../../../icons/outline/returnvisit.svg" alt="">回访</span>
             {{ taskMsg.name }}
            <el-tag class="head-tag" v-if="taskMsg.state === 1">进行中</el-tag>
            <!-- <el-tag class="head-tag" type="success">已完成</el-tag> -->
            <el-tag class="head-tag" type="info" v-if="taskMsg.state === 4">未开始</el-tag>
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
        <div class="taskOverview-materials__info">
          <p class="taskOverview-materials__info-content">
            {{ taskMsg.materialTitle }}
          </p>
          <div class="taskOverview-materials__item--media">
            <!-- 视频、图片预览请使用SG项目中组件：NsPreview，可参照实例：https://test-sg.ecrpcloud.com/Guide/Material/Library -->
            <!-- 展示图片结构 -->
            <!-- <div class="taskOverview-materials__image">-->
            <!-- <img src="https://shopguide.oss-cn-hangzhou.aliyuncs.com/image/202009/10000146/3aaf0732-4f73-4052-b808-8e34975778da.png?x-oss-process=image/resize,m_mfit,h_200,w_200" />-->
            <!-- </div>-->
            <div class="taskOverview-materials__video">
              <video src="https://shopguide.oss-cn-hangzhou.aliyuncs.com/video/202008/10000146/30d72b50-dca3-479c-9b6a-bb1975efa879.mp4" style="width: 60px;height: 107px">
                您的浏览器暂不支持播放该视频，请升级至最新版浏览器。
              </video>
              <div class="taskOverview-materials__video--mask">
                <div class="taskOverview-materials__video--wrapper">
                  <Icon type="begin" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="taskOverview-detail">
        <div class="taskOverview-detail__head clearfix">
          进度统计
          <ElForm inline class="float-right" :model="form">
            <ElFormItem label="选择门店：">
              <el-form-grid size="xmd">
                <shop-select-load placeholder="请选择工作门店"
                                  v-model="model.shop"
                                  clearable/>
              </el-form-grid>
              <!-- <el-select v-model="form.store" placeholder="请选择门店">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select> -->
            </ElFormItem>
            <ElFormItem label="日期：">
              <ElDatePicker
                v-model="form.time"
                type="date"
                placeholder="选择日期" />
            </ElFormItem>
            <NsButton>导出导购完成明细CSV文件</NsButton>
            <NsButton>导出CSV文件</NsButton>
          </ElForm>
        </div>
        <div class="taskOverview-detail__data">
          <ElRow :gutter="24">
            <ElCol :span="8">
              <div class="taskOverview-detail__data-item">
                <p class="data-item__title">指派门店</p>
                <span class="data-item__num">{{ taskMsg.shopNum }}</span>
                <span class="data-item__icon distributionStore">
                  <img src="../../../icons/outline/distributionStore.svg" alt="">
                </span>
              </div>
            </ElCol>
            <ElCol :span="8">
              <div class="taskOverview-detail__data-item">
                <p class="data-item__title">分配导购</p>
                <span class="data-item__num">{{ taskMsg.guideNum }}</span>
                <span class="data-item__icon distributionGuide">
                  <img src="../../../icons/outline/distributionGuide.svg" alt="">
                </span>
              </div>
            </ElCol>
            <ElCol :span="8">
              <div class="taskOverview-detail__data-item">
                <p class="data-item__title">完成度 <Icon type="help" class="data-item__title-icon" /></p>
                <span class="data-item__num">{{ taskMsg.completion }}%</span>
                <span class="data-item__icon degreeCompletion">
                  <img src="../../../icons/outline/degreeCompletion.svg" alt="">
                </span>
              </div>
            </ElCol>
          </ElRow>
        </div>
        <div class="taskOverview-detail__table">
          <el-table ref="table" :data="tableData"
                    resizable v-loading.lock="table.loadingtable"
                    style="width: 100%;"
                    :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
            <el-table-column :show-overflow-tooltip="true" prop="name"
                             label="门店名称" />
            <el-table-column label="地区" prop="address" />
            <el-table-column align="center" prop="shopType" width="80" label="类型">
              <template slot-scope="{row}">
                <span v-if="row.shopType === 'ZYD'">直营店</span>
                <span v-if="row.shopType === 'JMD'">加盟店</span>
                <span v-if="row.shopType === 'LYD'">联营店</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="shopStatus" width="120"
                             label="线下门店状态">
              <template slot-scope="scope">
                <span v-if="scope.row.shopStatus === 0" class="text-danger">删除</span>
                <span v-if="scope.row.shopStatus === -1" class="text-danger">暂停</span>
                <span v-if="scope.row.shopStatus === -2" class="text-danger">已关店</span>
                <span v-if="scope.row.shopStatus === 1" class="text-info">正常</span>
              </template>
            </el-table-column>
            <el-table-column align="right" prop="num" width="80"
                             label="分配导购" />
            <el-table-column align="center" prop="done" width="300"
                             label="完成度" />
            <el-table-column align="center" label="操作"
                             width="100">
              <template slot-scope="scope">
                <ns-table-column-operate-button :buttons="table.table_buttons"
                                                :prop="scope">
                </ns-table-column-operate-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination v-if="pagination.enable" class="taskOverview-detail__footer"
                       :page-sizes="pagination.sizeOpts" :total="pagination.total"
                       :current-page="pagination.page" :page-size="pagination.size"
                       layout="total, sizes, prev, pager, next, jumper" @size-change="$sizeChange$"
                       @current-change="$pageChange$">
        </el-pagination>
      </div>
    </div>
    <el-drawer
      title=""
      size="800px"
      :visible.sync="drawerVisible"
      direction="rtl">
      <drawerTable />
    </el-drawer>
  </div>
</template>
<script>
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import ElBreadcrumb from '@nascent/nui/lib/breadcrumb'
import ElBreadcrumbItem from '@nascent/nui/lib/breadcrumb-item'
import ElDrawer from '@nascent/nui/lib/drawer'
import drawerTable from './drawerTable'
import ShopSelectLoad from '@/components/ShopSelectLoad'
import { getErrorMsg } from '@/utils/toast'
export default {
  mixins: [tableMixin],
  components: {
    ElBreadcrumb,
    ElBreadcrumbItem,
    ElDrawer,
    drawerTable,
    ShopSelectLoad
  },
  data () {
    const pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    const tableButtons = [
      {
        func: function () {
          this.drawerVisible = true
        },
        icon: '$.noop',
        name: '查看详情',
        auth: '',
        visible: ''
      }
    ]

    const model = Object.assign({},
      {
        taskType: '',
        state: '',
        taskName: ''
      },
      {})
    return {
      model: model,
      rules: Object.assign({}, {}, {}),
      url: '',
      pagination: pagination,
      table: {
        table_buttons: tableButtons,
        quickSearchMap: {}
      },
      queryConfig: {
        expand: false
      },
      form: {
        store: '',
        time: '',
        executionTimes: 1,
        taskType: 1,
        executiveStore: 1,
        memberGroup: '1',
        taskBrief: ''
      },
      tableData: [
      //   {
      //   done: '30%',
      //   name: '0901华东区招募任务',
      //   num: 47,
      //   type: '直营店',
      //   address: '浙江省-杭州市-江干区',
      //   state: 0
      // }
      ],
      options: [{
        value: '1',
        label: '门店1'
      }, {
        value: '2',
        label: '门店2'
      }, {
        value: '3',
        label: '门店3'
      }, {
        value: '4',
        label: '门店4'
      }, {
        value: '5',
        label: '门店5'
      }],
      taskMsg: {
        name: '',
        type: 0,
        startTime: '',
        endTime: '',
        remark: '',
        shopRangeType: 0,
        runType: 0,
        viewId: '',
        viewName: '',
        subgroupId: '',
        subgroupName: '',
        shopNum: 0,
        guideNum: 0,
        completion: 0
      },
      drawerVisible: false
    }
  },
  methods: {
    onSearch () {
      // console.log('搜索响应')
    }
  },
  mounted: function () {
    var that = this
    const id = this.$route.params.id
    if (parseInt(id) > 0) {
      var params = {}
      params.taskId = parseInt(id)
      this.$http.fetch(this.$api.guide.queryTask, params).then(resp => {
        if (resp.success) {
          var obj = resp.result
          this.taskMsg.id = obj.id
          this.taskMsg.type = obj.type
          this.taskMsg.runType = obj.runType
          this.taskMsg.remark = obj.remark
          this.taskMsg.name = obj.name
          this.taskMsg.startTime = obj.startTime
          this.taskMsg.endTime = obj.endTime
          this.taskMsg.viewId = obj.viewId
          this.taskMsg.subgroupId = obj.subgroupId
          this.taskMsg.state = obj.state
          // 指定门店
          if (obj.targetIds === '0') {
            this.taskMsg.shopRangeType = 0
          } else {
            this.taskMsg.shopRangeType = 1
          }
          // 素材任务时
          if (obj.materialId) {
            this.taskMsg.materialId = obj.materialId
            this.taskMsg.materialTitle = obj.materialTitle
          }
        }
      }).catch(resp => {
        this.$notify.error(getErrorMsg('查看完整任务失败', resp))
        this.$router.push('/Guide/Task/List')
      })
      var param = {}
      param.taskId = parseInt(id)
      this.$http.fetch(this.$api.guide.queryProgressStatistics, param).then(resp => {
        if (resp.success) {
          var result = resp.result
          that.taskMsg.shopNum = result.shopNum
          that.taskMsg.guideNum = result.guideNum
          that.taskMsg.completion = result.completion
        }
      }).catch(resp => {
        console.log(resp)
        that.$notify.error(getErrorMsg('进度统计查询失败', resp))
      })
      param.searchMap = {}
      param.searchMap.taskId = parseInt(id)
      param.size = 0
      this.$http.fetch(this.$api.guide.taskQueryTaskShopInfo, param).then(resp => {
        if (resp.success) {
          var result = resp.result
          this.pagination.total = parseInt(result.recordsTotal)
          // result.data.forEach(obj => {
          //   var taskShopInfo = {}
          //   taskShopInfo.name = obj.shopName
          //   taskShopInfo.address = obj.address
          //   taskShopInfo.done = obj.completion
          //   taskShopInfo.num = obj.guideTotal
          //   taskShopInfo.shopType = obj.shopType
          //   taskShopInfo.shopStatus = obj.shopStatus
          //   this.tableData.push(taskShopInfo)
          // })
          const data = result.data.map(obj => ({
            name: obj.shopName,
            address: obj.address,
            done: obj.completion,
            num: obj.guideTotal,
            shopType: obj.shopType,
            shopStatus: obj.shopStatus
          }))
          this.tableData.push(...data)
        }
      }).catch(resp => {
        console.log(resp)
        that.$notify.error(getErrorMsg('进度统计列表查询失败', resp))
      })
    }
  }
}
</script>

<style scoped>
@import "@theme/variables.pcss";
.taskOverview {
  >>> .taskOverview-head {
    padding: 16px 16px 8px;
    background: var(--theme-color-white);
    margin: -10px -10px 0;
    .el-breadcrumb {
      line-height: 22px;
    }
    .el-breadcrumb__item:not(:last-child) {
      .el-breadcrumb__inner, .el-breadcrumb__separator {
        color: var(--theme-font-color-secondary);
      }
    }
    .el-breadcrumb__separator {
      font-weight: normal;
      margin: 0 var(--default-margin-larger) 0 var(--default-margin-small);
    }
  }
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
      img {
        margin: 0 5px 5px 0;
        width: 78px;
        height: 78px;
        border-radius: 3px;
        cursor: pointer;
        object-fit: cover;
      }
    }
    @e content {
      padding: 8px 0;
    }
    @e content-head {
      color: #303133;
      line-height: 22px;
      .task-type {
        display: inline-block;
        padding: 0 6px;
        height: 22px;
        width: 56px;
        color: #ffffff;
        margin-right: 8px;
        border-radius: 11px;
        background-image: linear-gradient(90deg, #FBD266 0%, #F8B864 100%);
        img {
          position: relative;
          top: -1px;
          margin-right: 2px;
        }
        &.business {
          background-image: linear-gradient(90deg, #F77676 0%, #EA6D6D 100%);
        }
        &.takumi {
          background-image: linear-gradient(90deg, #FBD266 0%, #F8B864 100%);
        }
        &.marketing {
          background-image: linear-gradient(90deg, #31BBFF 0%, #2BA5FF 100%);
        }
        &.share {
          background-image: linear-gradient(90deg, #FBD266 0%, #F8B864 100%);
        }
        &.daily {
          background-image: linear-gradient(90deg, #FBAE66 0%, #F89364 100%);
        }
        &.returnvisit {
          background-image: linear-gradient(90deg, #F77676 0%, #EA6D6D 100%);
        }
      }
      .head-tag {
        cursor: default;
        margin-left: 8px;
      }
    }
    @e content-info {
      margin-top: 16px;
      color: #8C8C8C;
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
      margin-bottom: 8px!important;
      line-height: 22px;
      color: #595959;
      overflow : hidden;
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
        background-color: rgba(0, 0, 0, .25);
        cursor: pointer;
        border-radius: 3px;
      }
      @m wrapper {
        position: relative;
        top: 50%;
        left: 50%;
        margin-left: -20px;
        margin-top: -20px;
        width:40px;
        height:40px;
        border-radius:  40px;
        background-color: rgba(255, 255, 255, .4);
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
        margin: 0 16px 0 0!important;
      }
      >>> .el-button--small {
        position: relative;
        top: 1px;
      }
      >>> .el-button--small + .el-button--small {
        margin-left: 16px;
      }
    }
    @e data {
      padding-top: 12px;
      .taskOverview-detail__data-item {
        position: relative;
        border: 1px solid #D9D9D9;
        border-radius: 4px;
        padding: 17px 24px;
        .data-item__title {
          color: #8C8C8C;
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
          background: #FFF6E6;
          border-radius: 100%;
          &.distributionStore {
            background: #F2F9FE;
          }
          &.distributionGuide {
            background: #FFF6E6;
          }
          &.degreeCompletion {
            background: #EDF9E8;
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
    }
    @e footer {
      padding: 16px 24px;
      box-shadow: none;
    }
  }
}
  >>> .el-drawer__header {
    margin-bottom: 0;
  }
</style>
