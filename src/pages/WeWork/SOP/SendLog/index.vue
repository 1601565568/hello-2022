<template>
  <div class="sendlog-container">
    <div class="sendlog-header">
      <h3>社群日历发送日志</h3>
    </div>
    <BaseContainer class="search-bar">
      <el-form :inline="true" class='form-inline_top' style="display: flex">
        <el-form-item label="">
          <el-input v-model="model.code" placeholder="请输入编号"  @keyup.enter.native="searchLogList">
            <Icon type="ns-search" slot="suffix" class='search-icon' @click="searchLogList"></Icon>
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="model.name" placeholder="请输入名称"  @keyup.enter.native="searchLogList">
            <Icon type="ns-search" slot="suffix" class='search-icon' @click="searchLogList"></Icon>
          </el-input>
        </el-form-item>
        <el-form-item label="">
            <el-date-picker
              class="date-filter"
              type="daterange"
              v-model="searchDate"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="false"
              :picker-options="pickerOptions"
              @change="switchSearchDate"
            ></el-date-picker>
        </el-form-item>
      </el-form>
      <NsButton class="add-button" size="large" @click="exportFile">导出CSV文件</NsButton>
    </BaseContainer>
    <BaseContainer class="sendlog-table-container" v-loading="loading">
      <el-table
        class="table-form_reset sendlog-table"
        :row-style="tableRowClassName"
        :data="activityList"
      >
        <el-table-column prop="code" label="编号"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="sendTime" label="发送时间"></el-table-column>
        <el-table-column prop="msgNum" label="发送消息">
          <template slot-scope="scope">
            <NsButton type="text" @click="checkActivityMessage(scope.row.id, scope.$index)">{{scope.row.msgNum}}</NsButton>条
          </template>
        </el-table-column>
        <el-table-column prop="sendType" label="发送消息类型">
          <template slot-scope="scope">
            <div class="message-icons-list">
                <el-tooltip
                  v-for="item in messageToolTipList(scope.row.contentList)"
                  :key="item.type"
                  class="message-icons-item"
                  :content="item.tip"
                  placement="top"
                >
                  <Icon :type="item.icon" className="icon"/>
                </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="chatroomNum" label="发送结果">
          <template slot-scope="scope">
            <NsButton type="text" @click="checkActivityGroup(scope.row.id, scope.$index)">{{`${scope.row.successNum}/${scope.row.chatroomNum}`}}</NsButton>个群
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        :page-sizes="pagination.sizeOpts"
        :total="pagination.total"
        :current-page="pagination.page"
        :page-size="pagination.size"
        :background="true"
        @size-change="pagination.sizeChange"
        @current-change="pagination.pageChange"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </BaseContainer>
    <!-- 参加活动群drawer -->
      <!-- :update:visible="clearActiveIndex" -->
    <GroupDrawer
      :visible.sync="visibleGroupDrawer"
      :activityId="activeActivityId"
    />
    <!-- 发送消息列表Drawer -->
    <MessageDrawer
      :visible.sync="visibleMessageDrawer"
      :activityId="activeActivityId"
    />
  </div>
</template>

<script>
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import BaseContainer from '../components/BaseContainer'
import GroupDrawer from './GroupDrawer.vue'
import MessageDrawer from './MessageDrawer.vue'
import { SOPActivityMessageType, SOPExamineStatus, SOPMessageTypeToolTip } from '../types'
import moment from 'moment'

export default {
  components: {
    BaseContainer,
    GroupDrawer,
    MessageDrawer
  },
  mixins: [tableMixin],
  watch: {
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
      loading: false,
      SOPActivityMessageType,
      visibleGroupDrawer: false,
      visibleMessageDrawer: false,
      activeActivityId: 0,
      activeIndex: -1,
      searchDate: [
        `${moment().format('yyyy-MM-DD')} 00:00:00`,
        `${moment().format('yyyy-MM-DD')} 23:59:59`
      ],
      model: {
        status: SOPExamineStatus.Succeed,
        showSuccessNum: 1,
        creatorName: '',
        code: '',
        name: '',
        showDeleteData: true,
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
      },
      pickerOptions: {
        disabledDate: (time) => {
          // 半年前（180天） 至 今天
          return (
            time < Date.now() - 3600 * 1000 * 24 * 180 ||
            time > Date.now()
          )
        }
      }
    }
  },
  mounted () {
    this.getActivityList()
  },
  methods: {
    clearActiveIndex (state) {
      window.console.log('哈哈哈', state)
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
    checkActivityGroup (id, index) {
      this.activeIndex = index
      this.activeActivityId = id
      this.visibleGroupDrawer = true
    },
    /**
     * 查看发送的消息
     */
    checkActivityMessage (id, index) {
      this.activeIndex = index
      this.activeActivityId = id
      this.visibleMessageDrawer = true
    },
    searchLogList () {
      this.pagination = { ...this.pagination, page: 1 }
      this.getActivityList()
    },
    switchSearchDate () {
      this.pagination = { ...this.pagination, page: 1 }
      this.model = {
        ...this.model,
        timeStart: `${this.searchDate[0]} 00:00:00`,
        timeEnd: `${this.searchDate[1]} 23:59:59`
      }
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

      this.$http.fetch(this.$api.weWork.sop.list, {
        ...this.model,
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
    exportFile () {
      if (!this.activityList.length) {
        this.$notify.error('当前没有匹配的数据项')
        return
      }
      const params = {
        code: this.model.code,
        name: this.model.name,
        startTime: `${this.searchDate[0]} 00:00:00`,
        endTime: `${this.searchDate[1]} 23:59:59`,
        exportType: 3
      }
      this.$http.fetch(this.$api.guide.task.exportExcel, params).then((resp) => {
        this.$store.dispatch({
          type: 'down/downAction',
          status: true,
          top: 180,
          right: 60
        })
      }).catch((resp) => {
        this.$notify.error(resp.msg || '导出报错，请联系管理员')
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
      .el-input {
        width: 240px;
      }
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
          color:#383838;
        }
      }
    }
  }
}
</style>
