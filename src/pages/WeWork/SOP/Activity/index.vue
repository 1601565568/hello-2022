<template>
  <div class="sop-schedule-container" ref="SOPSchedule" v-loading="loading">
    <ListHeadSettingBar/>
    <div class="sop-schedule_main">
      <!-- 日历选择列表 -->
      <ScheduleCalendar
        class="sop-schedule_calendar-content"
        :style="{ height: scheludeCalendarHeight }"
        @reload="reloadActivityList"
      />
      <!-- 搜索 -->
      <div class="sop-schedule_activity-content">
        <BaseContainer class="search-bar">
          <el-form :inline="true" class='form-inline_top' style="display: flex">
            <el-form-item label="消息类型：" class='el-form__change'>
              <el-select v-model="model.type" @change="searchActivityList" placeholder="请选择">
                <el-option
                  v-for="item in messageTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="审核状态：" class='el-form__change'>
              <el-select v-model="model.status" @change="searchActivityList" placeholder="请选择">
                <el-option
                  v-for="item in examineStatusOptions"
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
          <NsButton type="primary" class="add-button" size="large" @click="createActivity">新建</NsButton>
        </BaseContainer>
        <ActivityPanel
          class="active-panel"
          :style="{ height: activityPanelHeight }"
          :list="activityList"
          :date="model.timeStart.slice(0, 10)"
          :pagination="pagination"
          @change="changeActivityList"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ListHeadSettingBar from './List/ListHeadSettingBar'
import ScheduleCalendar from './List/ScheduleCalendar'
import ActivityPanel from './List/ActivityPanel'
import BaseContainer from '../components/BaseContainer.vue'
import { SOPActivityMessageType, SOPExamineStatus } from '../types'
import moment from 'moment'

export default {
  components: {
    ListHeadSettingBar,
    ScheduleCalendar,
    ActivityPanel,
    BaseContainer
  },
  data () {
    return {
      loading: false,
      activityPanelHeight: '',
      scheludeCalendarHeight: '',
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
      examineStatusOptions: [
        {
          value: SOPExamineStatus.All,
          label: '全部'
        },
        {
          value: SOPExamineStatus.UnSubmit,
          label: '待提交'
        },
        {
          value: SOPExamineStatus.Pending,
          label: '待审核'
        },
        {
          value: SOPExamineStatus.Succeed,
          label: '审核成功'
        },
        {
          value: SOPExamineStatus.Failed,
          label: '审核失败'
        }
      ],
      model: {
        type: SOPActivityMessageType.All,
        status: SOPExamineStatus.All,
        code: '',
        name: '',
        creatorName: '',
        start: 0,
        length: 15,
        timeStart: `${moment().format('yyyy-MM-DD')} 00:00:00`,
        timeEnd: `${moment().format('yyyy-MM-DD')} 23:59:59`
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
    this.setStyleHeight()

    // if (this.$route.query.date) {
    //   this.model.timeStart = `${this.$route.query.date} 00:00:00`
    //   this.model.timeEnd = `${this.$route.query.date} 23:59:59`
    // }
    // this.getActivityList()
  },
  methods: {
    createActivity () {
      this.$router.push({
        path: '/Marketing/SOP/Edit/0',
        query: {
          date: this.model.timeStart.slice(0, 10)
        }
      })
    },
    pageSizeChange (size) {
      this.pagination = { ...this.pagination, size, page: 1 }
      this.getActivityList()
    },
    pageChange (page) {
      this.pagination = { ...this.pagination, page }
      this.getActivityList()
    },
    /**
     * 计算日历和活动列表的最大高度
     */
    setStyleHeight () {
      // 总高度 - 顶部菜单栏 - 设置菜单 - 底部footer
      this.activityPanelHeight = `${window.innerHeight - 80 - 89 - 16 - 72 - 5}px`
      this.scheludeCalendarHeight = `${window.innerHeight - 80 - 89 - 16 - 5}px`
    },
    searchActivityList () {
      this.pagination = { ...this.pagination, page: 1 }
      this.getActivityList()
    },
    reloadActivityList (date) {
      this.pagination = { ...this.pagination, page: 1 }

      this.model = {
        ...this.model,
        type: SOPActivityMessageType.All,
        status: SOPExamineStatus.All,
        code: '',
        name: '',
        creatorName: ''
      }

      if (date !== undefined) {
        this.model = {
          ...this.model,
          timeStart: `${date} 00:00:00`,
          timeEnd: `${date} 23:59:59`
        }
      }

      this.getActivityList()
    },
    changeActivityList () {
      // 如果当前页非第一页且剩最后一条，翻页到上一页
      if (this.pagination.page > 1 && this.activityList.length === 1) {
        this.pagination = { ...this.pagination, page: this.pagination.page - 1 }
      }
      this.getActivityList()
    },
    getActivityList () {
      if (!this.loading) {
        this.loading = true

        this.$http.fetch(this.$api.weWork.sop.list, {
          ...this.model,
          start: (this.pagination.page - 1) * this.pagination.size,
          length: this.pagination.size
        })
          .then(resp => {
            this.activityList = resp.result.list
            this.pagination.total = resp.result.count
          }).catch((respErr) => {
            this.$notify.error('查询活动列表')
          }).finally(() => {
            this.loading = false
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../styles/search-bar-reset.css";
.sop-schedule-container {
  margin: 6px 6px 0 9px;

  .sop-schedule_main {
    margin-top: 16px;
    display: flex;
    .sop-schedule_calendar-content {
      width: 220px;
      height: 100%;
      padding-bottom: 9px;
    }

    .sop-schedule_activity-content {
      width: calc(100% - 220px - 16px);
      margin-left: 16px;
      display: flex;
      flex-direction: column;
      .search-bar {
        width: 100%;
        height: 64px;
        display: flex;
        justify-content: space-between;
        align-items: center;

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
        height: calc(100% - 72px);
      }
    }
  }
}
</style>
