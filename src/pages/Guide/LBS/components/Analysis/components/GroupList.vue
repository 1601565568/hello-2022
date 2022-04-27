<template>
  <div class='container-warpper'>
    <div class='container-div'>
      <page-table :title='`${shopName}-聚合群聊`'>
        <template slot='search'>
          <el-form :inline="true" class='form-inline_top'>
            <el-form-item label=""  v-if='addState.includes(state)' class='addgroup-btn'>
              <NsChatRoomDialog ref='nsChatRoomDialog' :selectedDataParent='chooseChatroom' btnTitle="添加群聊" @getChatRoomData="getChatRoomData" :showIcon='false' :selectedMax="isWhiteList ? 100 : 5"></NsChatRoomDialog>
            </el-form-item>
          </el-form>
        </template>
        <template slot='table'>
          <div class='form-item_tip'>
            门店店长已进行群聚合码设置，群满后会自动创建新群，群名前缀“{{shopName}}”
          </div>
          <el-table
            :data="_data._table.data"
            class="new-table_border"
            @sort-change="handleSort"
            style="width: 100%">
            <el-table-column
              prop="chatroomName"
              label="群名称">
              <template slot-scope="scope">
                {{scope.row.chatroomName || '-'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="guideName"
              label="群主">
              <template slot-scope="scope">
                {{scope.row.guideName || '-'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="personNum"
              sortable="custom"
              label="群成员数">
            </el-table-column>
            <el-table-column
              prop="title"
              label="操作">
              <template slot-scope="scope">
                <div class='btn-context'>
                  <ns-button type="text" class='detail-btn' :loading='scope.row.chatId === loadingIndex' @click='handleRemove(scope.row,scope.$index)'>移除</ns-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <template slot='pagination'>
          <div class='drawer-pagination'>
            <div class='pagecontent-left'>
              <div class='content-item' @click='handlePrev'><i class="el-icon-arrow-left"></i>上一个门店</div>
              <div class='content-item' @click='handleNext'>下一个门店<i class="el-icon-arrow-right"></i></div>
            </div>
            <el-pagination v-if="_data._pagination.enable"
                            class="template-table__pagination"
                            :page-sizes="_data._pagination.sizeOpts"
                            :total="_data._pagination.total"
                            :current-page="_data._pagination.page"
                            :page-size="_data._pagination.size"
                            layout="total, prev, pager, next, jumper"
                            @size-change="$sizeChange$"
                            @current-change="$pageChange$">
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
import NsChatRoomDialog from '@/components/NsChatRoomDialog/index'
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
      url: this.$api.guide.lbs.activityShopDetail,
      // 筛选数据
      model: {
        sortName: 'personNum', // 排序字段名称
        sortType: 0 // 排序类型  0 降序 1 升序
      },
      // 状态列表
      statusList: {
        0: {
          value: '已结束',
          color: 'info'
        },
        1: {
          value: '未开始',
          color: 'warning'
        },
        2: {
          value: '进行中',
          color: 'success'
        },
        3: {
          value: '提前结束',
          color: 'info'
        }
      },
      state: -1,
      name: this.$route.query ? this.$route.query.name : '',
      loadingIndex: -1, // 删除的chatId
      isWhiteList: false
    }
  },
  computed: {
    deleteApi () {
      return this.$api.guide.lbs.deleteGroup
    }
  },
  props: ['shopId', 'guid', 'shopName', 'configId', 'addState', 'chooseChatroom', 'startTime', 'endTime'],
  components: {
    PageTable, NsChatRoomDialog
  },
  mixins: [tableMixin],
  methods: {
    // 是否有白名单
    async checkWhiteList () {
      try {
        const resp = await this.$http.fetch(this.$api.guide.chatRoomConfig.isWhiteList)
        if (resp.success) {
          this.isWhiteList = !!resp.result
        }
      } catch (error) {
        this.$notify.error('是否是白名单获取失败')
      }
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
    handleRemove (row, index) {
      if (this._data._pagination.total > 1) {
        this.$confirm('移除后将无法通过此活动入群，确定移除吗？', '提示信息', {
          confirmButtonText: '确定',
          type: 'warning',
          cancelButtonText: '取消'
        }).then(() => {
          this.delect(row.configId, row.chatId, index)
        })
      } else {
        this.$notify.error('移除失败：只有一个群时，无法移除')
      }
    },
    // 删除群聊
    delect (configId, chatId, index) {
      this.loadingIndex = chatId
      this.$http.fetch(this.deleteApi, { configId, chatId, guid: this.model.guid })
        .then(() => {
          this.$searchAction$()
          this.$emit('onChange', this.shopId)
          this.$notify.success('删除成功,列表数据已变更')
          this.loadingIndex = -1
        }).catch(() => {
          this.$notify.error('操作失败')
          this.loadingIndex = -1
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
    },
    getChatRoomData (list) {
      this.$refs.nsChatRoomDialog.emptyData()
      const parmas = {
        guid: this.guid,
        shopId: this.shopId,
        chatIdList: list.map(item => item.chatId)
      }
      this.$http.fetch(this.$api.guide.lbs.addGroup, parmas).then(res => {
        if (res.success) {
          this.$notify.success('添加成功,列表数据已变更')
          this.$searchAction$()
          this.$emit('onChange', this.shopId)
        }
      }).catch(res => {
        this.$notify.error(res.msg)
      })
    }
  },
  watch: {
    shopId: {
      handler (newVal, oldVal) {
        this.state = this.$route.query ? this.$route.query.state : -1
        this.model.shopId = newVal
        this.model.guid = this.guid
        this.model.configId = this.configId
        this.model.startTime = this.startTime
        this.model.endTime = this.endTime
        this.$searchAction$()
      },
      immediate: true
    }
  },
  mounted () {
    this.checkWhiteList()
  }
}
</script>
<style lang="scss" scoped>
  @import "@components/NewUi/styles/reset.css";
  .container-warpper {
    height: 100vh;
    overflow-y:auto;
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
      background: #F7FFF0;
      border: 1px solid #53BF1D;
      color: #262626;
    }
    &.el-tag--info {
      background: #F5F5F5;
      border: 1px solid #D9D9D9;
      color: #262626;
    }
    &.el-tag--warning {
      background: #FFFBE6;
      border: 1px solid #FFAE0D;
      color: #262626;
    }
  }
  .form-item_tip {
    background: #F2F9FE;
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
      border: 1px solid #D9D9D9;
      border-radius: 2px;
      border-radius: 2px;
      display: flex;
      position: relative;
      user-select:none;
      cursor: pointer;
      &:after {
        content: ' ';
        position: absolute;
        left: 50%;
        top: 4px;
        bottom: 4px;
        width: 1px;
        background-color: #E8E8E8;
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
.form-inline_top .el-form-item.addgroup-btn {
  padding: 0 16px;
  line-height: 32px;
  height: 32px;
  border-radius: 2px;
  >>> .el-button--small {
    font-size: 14px;
    padding: 7px 0 !important;
  }
}
</style>
