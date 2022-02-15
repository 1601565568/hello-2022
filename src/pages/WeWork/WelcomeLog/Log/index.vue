<template>
  <div class="sendlog-container">
    <div class="sendlog-header">
      <h3>欢迎语日志</h3>
    </div>
    <BaseContainer class="search-bar">
      <el-form :inline="true"
               class='form-inline_top'
               style="display: flex">
        <el-form-item label="">
          <el-input v-model="model.customerName"
                    placeholder="请输入客户昵称"
                    @keyup.enter.native="searchLogList">
            <Icon type="ns-search"
                  slot="suffix"
                  class='search-icon'
                  @click="searchLogList"></Icon>
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="model.title"
                    placeholder="请输入欢迎语名称"
                    @keyup.enter.native="searchLogList">
            <Icon type="ns-search"
                  slot="suffix"
                  class='search-icon'
                  @click="searchLogList"></Icon>
          </el-input>
        </el-form-item>
        <el-form-item label="发送状态：">
          <el-select v-model="model.status"
                     @change="fnEdit">
            <el-option v-for="item in statusOptionList"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="cloudPlatformType == 'ecrp'?'选择员工：':'企业微信成员：'">
          <NsGuideDialog :selfBtn='true'
                         :appendToBody='true'
                         :isButton="false"
                         :auth="false"
                         btnTitle=""
                         dialogTitle="选择员工"
                         v-model="model.guideIds"
                         @input="handleChangeGuide"
                         :isOpenDialogAfterRequest='false'
                         v-if="cloudPlatformType == 'ecrp'">
            <template slot='selfBtn'>
              <div class='self-btn'>
                {{(model.guideIds&&model.guideIds.length)?`已选择${model.guideIds.length}个员工`:'全部'}}
                <Icon type="geren"
                      class='guideIds-icon'></Icon>
              </div>
            </template>
          </NsGuideDialog>
          <NsGuideWeChatDialog :selfBtn='true'
                               :appendToBody='true'
                               :isButton="false"
                               :auth="false"
                               btnTitle=""
                               dialogTitle="选择企业微信成员"
                               v-model="model.guideIds"
                               @input="handleChangeGuide"
                               :isOpenDialogAfterRequest='false'
                               v-else>
            <template slot='selfBtn'>
              <div class='self-btn'>
                {{(model.guideIds&&model.guideIds.length)?`已选择${model.guideIds.length}个员工`:'全部'}}
                <Icon type="geren"
                      class='guideIds-icon'></Icon>
              </div>
            </template>
          </NsGuideWeChatDialog>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker class="date-filter"
                          type="daterange"
                          v-model="searchDate"
                          value-format="yyyy-MM-dd"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :clearable="false"
                          :picker-options="pickerOptions"
                          @change="switchSearchDate"></el-date-picker>
        </el-form-item>
      </el-form>
      <!-- <NsButton class="add-button" size="large" @click="exportFile">导出CSV文件</NsButton> -->
    </BaseContainer>
    <BaseContainer class="sendlog-table-container"
                   v-loading="loading">
      <el-table class="table-form_reset sendlog-table"
                :row-style="tableRowClassName"
                :data="activityList">
        <el-table-column prop="customerName"
                         label="客户昵称"></el-table-column>
        <el-table-column prop="title"
                         label="欢迎语名称"></el-table-column>
        <el-table-column prop="workerName"
                         :label="cloudPlatformType=='ecrp'? '员工':'企业微信成员'"></el-table-column>
        <el-table-column prop="workerId"
                         label="工号"
                         v-if="cloudPlatformType=='ecrp'"></el-table-column>
        <el-table-column prop="workerId"
                         label="工作门店"
                         v-if="cloudPlatformType=='ecrp'">
          <template slot-scope="scope">
            <div class="scope-name">
              <div :class="'scope-name_text'">
                {{scope.row.shopNames.join(',')}}
              </div>
              <el-popover placement="top-start"
                          class="item"
                          :title="`线下门店（${scope.row.shopNames.length}）`"
                          width="200"
                          trigger="hover"
                          :content="scope.row.shopNames.join(',')">
                <span class="scope-name_tip"
                      slot="reference">共{{scope.row.shopNames.length}}个</span>
              </el-popover>
              <!-- <el-tooltip class="item" effect="light" :content="scope.row.shopNames.join(',')" placement="top" popper-class='max-popper'>
                  <span class="scope-name_tip">共{{scope.row.shopNames.length}}个</span>
                </el-tooltip> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="msgTime"
                         label="发送时间"></el-table-column>
        <el-table-column prop="msgNum"
                         label="发送内容">
          <template slot-scope="scope">
            <!-- <NsButton type="text" @click="checkActivityMessage(scope.row.id, scope.$index)">{{scope.row.totalNum}}</NsButton>条 -->
            <NsButton type="text"
                      @click="checkActivityMessage(scope.row.id, scope.$index)">{{scope.row.totalNum}}</NsButton>条
          </template>
        </el-table-column>
        <el-table-column prop="sendType"
                         label="发送状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status==0"
                    type="danger">发送失败</el-tag>
            <el-tag v-if="scope.row.status==1"
                    type="success">发送成功</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="resultDetail"
                         label="发送详情">
        </el-table-column>
      </el-table>
      <el-pagination class="pagination"
                     :page-sizes="pagination.sizeOpts"
                     :total="pagination.total"
                     :current-page="pagination.page"
                     :page-size="pagination.size"
                     :background="true"
                     @size-change="pagination.sizeChange"
                     @current-change="pagination.pageChange"
                     layout="total, sizes, prev, pager, next, jumper" />
    </BaseContainer>
    <!-- 参加活动群drawer -->
    <!-- :update:visible="clearActiveIndex" -->
    <GroupDrawer :visible.sync="visibleGroupDrawer"
                 :activityId="activeActivityId" />
    <!-- 发送消息列表Drawer -->
    <!-- 发送消息列表Drawer -->
    <MessageDrawer :visible.sync="visibleMessageDrawer"
                   :activityId="activeActivityId" />
  </div>
</template>

<script>
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import BaseContainer from '../components/BaseContainer'
import GroupDrawer from './GroupDrawer.vue'
import MessageDrawer from './MessageDrawer.vue'
import NsGuideDialog from '@/components/NsGuideDialog'
import NsGuideWeChatDialog from '@/components/NsGuideWeChatDialog'
import { SOPActivityMessageType, SOPExamineStatus, SOPMessageTypeToolTip } from '../types'
import moment from 'moment'

export default {
  components: {
    BaseContainer,
    GroupDrawer,
    MessageDrawer,
    NsGuideDialog,
    NsGuideWeChatDialog
  },
  mixins: [tableMixin],
  watch: {
    searchDate (newVal) {
      const date = newVal || [null, null]
      this.searchDateChange({ startTime: `${moment(date[0]).format('yyyy-MM-DD')} 00:00:00`, endTime: `${moment(date[1]).format('yyyy-MM-DD')} 23:59:59` })
    },
    visibleGroupDrawer (val) {
      if (!val) {
        this.activeIndex = -1
      }
    },
    visibleMessageDrawer (val) {
      if (!val) {
        this.activeIndex = -1
      }
    }
  },
  data () {
    return {
      cloudPlatformType: this.$store.state.user.remumber.remumber_login_info.productConfig.cloudPlatformType, // 平台判断
      loading: false,
      SOPActivityMessageType,
      visibleGroupDrawer: false,
      visibleMessageDrawer: false,
      activeActivityId: 0,
      activeIndex: -1,
      searchDate: [],
      model: {
        status: -1,
        customerName: '',
        title: '',
        startTime: ``,
        endTime: ``
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
      },
      // 活动状态列表
      statusOptionList: [
        {
          label: '全部',
          value: -1
        },
        {
          label: '发送失败',
          value: 0
        },
        {
          label: '发送成功',
          value: 1
        }
      ],

      selectDate: '',
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.selectDate = minDate.getTime()
          if (maxDate) {
            this.selectDate = ''
          }
        },
        disabledDate: (time) => {
          if (this.selectDate !== '') {
            const one = 6 * 24 * 3600 * 1000
            const minTime = this.selectDate - one
            const maxTime = this.selectDate + one
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        }
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getActivityList()
    })
  },
  created () {
    this.setTime()
  },
  methods: {
    searchDateChange (obj = {}) {
      this.model = Object.assign(this.model, obj)
    },
    setTime () {
      const end = new Date()
      const start = new Date()
      // 7天，需要特殊处理：+1000ms
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7 + 1000)
      const startTime = moment(start).format('YYYY-MM-DD HH:mm:ss')
      const endTime = moment(end).format('YYYY-MM-DD HH:mm:ss')
      this.searchDate = [startTime, endTime]
    },
    fnEdit () {
      this.getActivityList()
    },
    clearActiveIndex (state) {
      // this.visibleGroupDrawer = state
    },
    messageToolTipList (list) {
      const messageTypes = Array.from(new Set(list.map(item => item.type)))
      return messageTypes.map(type => {
        return SOPMessageTypeToolTip[type]
      })
    },
    /**
     * 查看活动的群
     */
    // checkActivityGroup (id, index) {
    //   this.activeIndex = index
    //   this.activeActivityId = id
    //   this.visibleGroupDrawer = true
    // },
    /**
     * 查看发送的消息
     */
    checkActivityMessage (id, index) {
      this.activeIndex = index
      this.activeActivityId = id * 1
      this.visibleMessageDrawer = true
    },
    searchLogList () {
      this.pagination = { ...this.pagination, page: 1 }
      this.getActivityList()
    },
    switchSearchDate () {
      this.pagination = { ...this.pagination, page: 1 }
      this.model = {
        ...this.model
      }
      this.getActivityList()
    },
    handleChangeGuide (value) {
      this.pagination = { ...this.pagination, page: 1 }
      //   this.model.guideIds = this.model.guideIds.join(',')
      this.getActivityList()
    },
    pageSizeChange (size) {
      this.pagination = { ...this.pagination, size }
      this.getActivityList()
    },
    pageChange (page) {
      this.pagination = { ...this.pagination, page }
      this.getActivityList()
    },
    getActivityList () {
      this.loading = true

      this.$http.fetch(this.$api.weWork.log.list, {
        searchMap: { ...this.model },
        start: (this.pagination.page - 1) * this.pagination.size,
        length: this.pagination.size
      })
        .then(resp => {
          this.activityList = resp.result.data
          this.pagination.total = resp.result.recordsTotal * 1
        }).catch((respErr) => {
          this.$notify.error('查询活动列表失败')
        }).finally(() => {
          this.loading = false
        })
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex === this.activeIndex) {
        return { backgroundColor: '#D9EFFE' }
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../styles/table-reset.css";
@import "../styles/search-bar-reset.css";
.self-btn {
  min-width: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #606266;
  .guideIds-icon {
    color: #c0c4cc;
  }
  margin-right: 8px;
}
.scope-name_text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.scope-name_tip {
  color: #0091fa;
}
.sendlog-container {
  width: 100%;

  .sendlog-header {
    margin: -10px -10px 16px;
    height: 48px;
    background: #fff;
    h3 {
      font-size: 16px;
      color: #262626;
      line-height: 48px;
      margin-left: 16px;
    }
  }

  .search-bar {
    width: 100%;
    height: 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    .el-form-item {
      .search-icon {
        font-size: 28px;
      }
    }
    .date-filter {
      width: 256px;
    }
    .add-button {
      height: 32px;
      margin: 0 16px 0 16px;
    }
  }

  .sendlog-table-container {
    width: 100%;
    margin-top: 8px;
    .el-tag.el-tag--success,
    .el-tag.el-tag--danger {
      color: #000000;
    }
    .sendlog-table {
      width: calc(100% - 32px);
      margin: 0 auto;
      padding-top: 32px;
      .message-icons-list {
        display: flex;
        align-items: center;
        height: 16px;
        font-size: 16px;
        width: 185px;
        .message-icons-item {
          margin-left: 4px;
          flex-shrink: 1;
        }

        .icon {
          font-size: 16px;
          color: #383838;
        }
      }
    }
  }
}
</style>
