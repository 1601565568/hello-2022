<template>
  <div class="container-warpper">
    <div class="container-div">
      <page-table :title="`门店名称 - ${shopName}-${name}`">
        <template slot="button">
          <ns-button size="large" @click="handleExport">导出</ns-button>
        </template>
        <template slot="table">
          <div class="form-item_tip">
            客户选择此门店时，会随机添加以下的任意一名在职员工
          </div>
          <el-table
            :data="_data._table.data"
            class="new-table_border"
            @sort-change="handleSort"
            style="width: 100%"
          >
            <el-table-column prop="userName" label="员工姓名">
              <template slot-scope="scope">
                {{ scope.row.userName || "-" }}
              </template>
            </el-table-column>
            <el-table-column prop="workNumber" label="工号">
              <template slot-scope="scope">
                {{ scope.row.workNumber || "-" }}
              </template>
            </el-table-column>
            <el-table-column prop="adduserNum" sortable="custom" label="添加好友数">
            </el-table-column>
            <el-table-column prop="customerCountTotal">
              <template slot="header">
                <span>
                  <span>好友会员数 </span>
                  <el-tooltip content="活动期间内，该员工添加好友的会员数量">
                    <Icon type="question-circle" />
                  </el-tooltip>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="customerCount">
              <template slot="header">
                <span>
                  <span>新增会员数 </span>
                  <el-tooltip content="活动期间内，该员工的新增会员数量">
                    <Icon type="question-circle" />
                  </el-tooltip>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="tradeCount">
              <template slot="header">
                <span>
                  <span>订单转化数 </span>
                  <el-tooltip content="活动期间内，该员工添加好友的订单转化数">
                    <Icon type="question-circle" />
                  </el-tooltip>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="payment">
              <template slot="header">
                <span>
                  <span>订单转化金额 </span>
                  <el-tooltip content="活动期间内，该员工添加好友的订单转化金额">
                    <Icon type="question-circle" />
                  </el-tooltip>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="refundFee">
              <template slot="header">
                <span>
                  <span>转化退单金额 </span>
                  <el-tooltip content="活动期间内，该员工添加好友的退款订单金额">
                    <Icon type="question-circle" />
                  </el-tooltip>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <template slot="pagination">
          <div class="drawer-pagination">
            <div class="pagecontent-left">
              <div class="content-item" @click="handlePrev">
                <i class="el-icon-arrow-left"></i>上一个门店
              </div>
              <div class="content-item" @click="handleNext">
                下一个门店<i class="el-icon-arrow-right"></i>
              </div>
            </div>
            <el-pagination
              v-if="_data._pagination.enable"
              class="template-table__pagination"
              :page-sizes="_data._pagination.sizeOpts"
              :total="_data._pagination.total"
              :current-page="_data._pagination.page"
              :page-size="_data._pagination.size"
              layout="total, prev, pager, next, jumper"
              @size-change="$sizeChange$"
              @current-change="$pageChange$"
            >
            </el-pagination>
          </div>
        </template>
      </page-table>
    </div>
  </div>
</template>
<script>
import PageTable from '@/components/NewUi/PageTable'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import api from '@/config/http'
export default {
  data () {
    return {
      pagination4Emp: {
        enable: true,
        size: 15,
        sizeOpts: [15, 25, 50, 100],
        page: 1,
        total: 0
      },
      url: this.$api.guide.lbs.activityShopDetailByFriends,
      // 筛选数据
      model: {
        sortName: 'addUserNum', // 排序字段名称
        sortType: 0 // 排序类型  0 降序 1 升序
      },
      name: this.$route.query ? this.$route.query.name : ''
    }
  },
  computed: {
    deleteApi () {
      return this.$api.guide.lbs.deleteGroup
    }
  },
  props: [
    'firstQrCodeUserId',
    'channelState',
    'modelData',
    'shopId',
    'guid',
    'shopName',
    'configId',
    'addFriendsStartTime',
    'addFriendsEndTime',
    'timeType',
    'activityStartTime',
    'activityEndTime',
    'activeName'
  ],
  components: {
    PageTable
  },
  mixins: [tableMixin],
  methods: {
    handleExport () {
      const sendParams = {
        ...this.modelData,
        firstQrCodeUserId: this.firstQrCodeUserId,
        channelState: this.channelState,
        shopId: this.shopId,
        name: this.activeName,
        shopName: this.shopName,
        exportType: 37
      }
      this.$http
        .fetch(this.$api.guide.task.exportExcel, sendParams)
        .then((resp) => {
          this.$notify.success('文件已导入下载中心')
        })
        .catch((resp) => {
          this.$notify.error(resp.msg || '导出报错，请联系管理员')
        })
    },
    changeSearchfrom (obj = {}) {
      this.model = Object.assign(this.model, obj)
      this.$searchAction$()
    },
    handleChangeGuide (value) {
      this.changeSearchfrom({ guideIds: value })
    },
    handleSearch () {
      this.changeSearchfrom({ name: this.seachVal })
    },
    // 删除群聊
    handleRemove (row) {
      this.$confirm('确定要删除群聊吗', '提示信息', {
        confirmButtonText: '确定',
        type: 'warning',
        cancelButtonText: '取消'
      }).then(() => {
        this.delect(row.configId, row.chatId)
      })
    },
    // 删除群聊
    delect (configId, chatId) {
      this.$http
        .fetch(this.deleteApi, { configId, chatId, guid: this.model.guid })
        .then(() => {
          this.$searchAction$()
        })
        .catch(() => {
          this.$notify.error('操作失败')
        })
    },
    handlePrev () {
      this.$emit('onPrev')
    },
    handleNext () {
      this.$emit('onNext')
    },
    handleSort (val) {
      const { order, prop } = val
      this.model = {
        ...this.model,
        sortName: prop,
        sortType: order === 'ascending' ? 1 : 0
      }
      this.$searchAction$()
    }
  },
  watch: {
    shopId: {
      handler (newVal, oldVal) {
        this.model.shopId = newVal
        this.model.guid = this.guid
        this.model.configId = this.configId
        this.model.addFriendsStartTime = this.addFriendsStartTime
        this.model.addFriendsEndTime = this.addFriendsEndTime
        this.model.timeType = this.timeType
        this.model.activityStartTime = this.activityStartTime
        this.model.activityEndTime = this.activityEndTime
        this.$searchAction$()
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
.container-warpper {
  height: 100vh;
  overflow-y: auto;
}
.container-div {
  min-height: 100vh;
  padding-bottom: 66px;
  position: relative;
}
.search-icon {
  font-size: 22px;
  margin-top: 2px;
}
.scope-name_tag.el-tag {
  border-radius: 2px;
  &.el-tag--success {
    background: #f7fff0;
    border: 1px solid #53bf1d;
    color: #262626;
  }
  &.el-tag--info {
    background: #f5f5f5;
    border: 1px solid #d9d9d9;
    color: #262626;
  }
  &.el-tag--warning {
    background: #fffbe6;
    border: 1px solid #ffae0d;
    color: #262626;
  }
}
.form-item_tip {
  background: #f2f9fe;
  border-radius: 2px;
  padding: 9px 16px;
  font-size: 14px;
  color: #595959;
  line-height: 22px;
  margin-bottom: 25px;
}
.drawer-pagination {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .pagecontent-left {
    width: 223px;
    height: 32px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    border-radius: 2px;
    display: flex;
    position: relative;
    user-select: none;
    cursor: pointer;
    &:after {
      content: " ";
      position: absolute;
      left: 50%;
      top: 4px;
      bottom: 4px;
      width: 1px;
      background-color: #e8e8e8;
    }
    .content-item {
      width: 50%;
      font-size: 14px;
      color: #595959;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
<style scoped>
.form-item_tip {
  margin-bottom: 20px;
}
.container-warpper >>> .template-table__bar {
  margin-bottom: 20px;
}
</style>
