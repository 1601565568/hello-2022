<template>
  <div class="examine-container" v-loading="loading">
    <el-tabs class="el-tabs" v-model="examineStatus" @tab-click="tabSwitchActivityList">
      <el-tab-pane lazy :label="`待审核 ${pendingExamineCount}`" :name="String(SOPExamineStatus.Pending)"></el-tab-pane>
      <el-tab-pane lazy label="审核成功" :name="String(SOPExamineStatus.Succeed)"></el-tab-pane>
      <el-tab-pane lazy label="审核失败" :name="String(SOPExamineStatus.Failed)"></el-tab-pane>
    </el-tabs>
    <!-- 搜索 -->
    <div class="sop-schedule_activity-content">
      <BaseContainer class="search-bar">
        <el-form :inline="true" class='form-inline_top' style="display: flex">
          <el-form-item label="消息类型：" class='el-form__change'>
            <el-select v-model="model.type"  @change="searchActivityList" placeholder="请选择">
              <el-option
                v-for="item in messageTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="model.creatorName" placeholder="请输入创建人"  @keyup.enter.native="searchActivityList">
              <Icon type="ns-search" slot="suffix" class='search-icon' @click="searchActivityList"></Icon>
            </el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="model.code" placeholder="请输入编号"  @keyup.enter.native="searchActivityList">
              <Icon type="ns-search" slot="suffix" class='search-icon' @click="searchActivityList"></Icon>
            </el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="model.name" placeholder="请输入名称"  @keyup.enter.native="searchActivityList">
              <Icon type="ns-search" slot="suffix" class='search-icon' @click="searchActivityList"></Icon>
            </el-input>
          </el-form-item>
        </el-form>
      </BaseContainer>
      <ActivityPanel
        class="active-panel"
        :style="{ height: activityPanelHeight }"
        panelType="examine"
        :list="activityList"
        :pagination="pagination"
        @change="changeActivityList"
      />
    </div>
  </div>
</template>

<script>
import BaseContainer from '../components/BaseContainer.vue'
import ActivityPanel from '../Activity/List/ActivityPanel.vue'
import { SOPActivityMessageType, SOPExamineStatus } from '../types'
import moment from 'moment'

export default {
  components: {
    BaseContainer,
    ActivityPanel
  },
  data () {
    return {
      SOPExamineStatus: SOPExamineStatus,
      examineStatus: '2',
      loading: false,
      activeName: '',
      seachVal: '',
      activityPanelHeight: '0',
      messageTypeOptions: [
        {
          value: SOPActivityMessageType.All,
          label: '全部'
        },
        {
          value: SOPActivityMessageType.Text,
          label: '文本'
        },
        {
          value: SOPActivityMessageType.Image,
          label: '图片'
        },
        {
          value: SOPActivityMessageType.Video,
          label: '视频'
        },
        {
          value: SOPActivityMessageType.Link,
          label: '链接'
        },
        {
          value: SOPActivityMessageType.MiniProgram,
          label: '小程序'
        },
        {
          value: SOPActivityMessageType.Poster,
          label: '海报'
        }
      ],
      pendingExamineCount: '',
      model: {
        type: SOPActivityMessageType.All,
        status: SOPExamineStatus.All,
        // status: SOPExamineStatus.Pending,
        code: '',
        name: '',
        creatorName: '',
        desc: false,
        start: 0,
        length: 15
        // timeStart: `${moment().format('yyyy-MM-DD')} 00:00:00`,
        // timeEnd: `${moment().format('yyyy-MM-DD')} 23:59:59`
      },
      activityList: [],
      pagination: {
        enable: true,
        size: 15,
        sizeOpts: [15, 50, 100],
        page: 1,
        total: 0,
        sizeChange: this.pageSizeChange.bind(this),
        pageChange: this.pageChange.bind(this)
      }
    }
  },
  mounted () {
    this.setActivityPanelHeight()

    this.getActivityList()

    this.getCountByPendingStatus()
  },
  methods: {
    setActivityPanelHeight () {
      this.activityPanelHeight = `${window.innerHeight - 80 - 48 - 72 - 32}px`
    },
    pageSizeChange (size) {
      this.pagination = { ...this.pagination, size, page: 1 }
      this.getActivityList()
    },
    pageChange (page) {
      this.pagination = { ...this.pagination, page }
      this.getActivityList()
    },
    searchActivityList () {
      this.pagination = { ...this.pagination, page: 1 }
      this.getActivityList()
    },
    reloadActivityList () {
      this.pagination = { ...this.pagination, page: 1 }

      this.model = {
        ...this.model,
        type: SOPActivityMessageType.All,
        code: '',
        name: '',
        creatorName: ''
      }

      this.getCountByPendingStatus()
      this.getActivityList()
    },
    changeActivityList () {
      // 如果当前页非第一页且剩最后一条，翻页到上一页
      if (this.pagination.page > 1 && this.activityList.length === 1) {
        this.pagination = { ...this.pagination, page: this.pagination.page - 1 }
      }
      this.getCountByPendingStatus()
      this.getActivityList()
    },
    tabSwitchActivityList () {
      this.pagination = { ...this.pagination, page: 1 }

      this.model = {
        ...this.model,
        type: SOPActivityMessageType.All,
        code: '',
        name: '',
        creatorName: ''
      }

      if (Number(this.examineStatus) === SOPExamineStatus.Succeed || Number(this.examineStatus) === SOPExamineStatus.Failed) {
        this.model.desc = true
      } else {
        this.model.desc = false
      }

      this.getCountByPendingStatus()
      this.getActivityList()
    },
    getActivityList () {
      this.loading = true

      this.$http.fetch(this.$api.weWork.sop.list, {
        ...this.model,
        status: Number(this.examineStatus),
        start: (this.pagination.page - 1) * this.pagination.size,
        length: this.pagination.size
      })
        .then(resp => {
          this.activityList = resp.result.list
          this.pagination.total = resp.result.count
        }).catch((respErr) => {
          this.$notify.error('查询活动列表失败')
        }).finally(() => {
          this.loading = false
        })
    },
    getCountByPendingStatus () {
      this.$http.fetch(this.$api.weWork.sop.getCountByStatus, { status: SOPExamineStatus.Pending })
        .then(resp => {
          const count = resp.result
          if (count > 0 && count < 100) {
            this.pendingExamineCount = count
          } else if (count >= 100) {
            this.pendingExamineCount = '99+'
          } else {
            this.pendingExamineCount = ''
          }
        }).catch((respErr) => {
          this.$notify.error('获取待审核活动数量失败')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../styles/search-bar-reset.css";

.examine-container {
  .el-tabs {
    background: #fff;
  }

  .sop-schedule_activity-content {
      margin-top: 8px;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      .search-bar {
        width: 100%;
        height: 64px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fff;

        .search-icon {
          font-size: 28px;
        }

        .add-button {
          height: 32px;
          margin: 0 16px 0 16px;
        }
      }
      .active-panel {
        margin-top: 8px;
        // height: calc(100% - 72px);
        height: calc(100%);
      }
  }
}
</style>
