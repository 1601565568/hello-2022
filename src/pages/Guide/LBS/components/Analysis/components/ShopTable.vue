<template>
  <div>
    <page-table class="no-padding" :tableBarShow="false">
      <template slot="table">
        <el-table
          :data="_data._table.data"
          class="new-table_border"
          :row-style="tableRowClassName"
          @sort-change="handleSort"
          style="width: 100%"
        >
          <el-table-column prop="shopName" label="参与门店">
            <template slot-scope="scope">
              <div>
                {{ scope.row.shopName
                }}{{ scope.row.state === 3 ? "（已从活动移除）" : "" }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="chatroomNum" label="群聚合码">
            <template slot-scope="scope">
              <div class="scope-title">
                <div class="scope-title_text">已聚合{{ scope.row.chatroomNum }}个群</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="adduserNum" label="新增群成员数"> </el-table-column>
          <el-table-column prop="address" width="150px" label="操作">
            <template slot-scope="scope">
              <div class="btn-context">
                <ns-button
                  type="text"
                  class="detail-btn"
                  @click="handleDetail(scope.row, scope.$index)"
                  >查看详情</ns-button
                >
                <ns-button
                  v-if="addState.includes(state)"
                  type="text"
                  class="detail-btn"
                  @click="handleAddGroup(scope.row)"
                  :loading="addiding === scope.row.shopId"
                  >添加群聊</ns-button
                >
                <!-- <NsChatRoomDialog btnTitle="添加群聊" @getChatRoomData="(list)=>{getChatRoomData(list,scope.row)}" :showIcon='false' :isLoaded='false'></NsChatRoomDialog> -->
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 页面 start -->
      <template slot="pagination">
        <el-pagination
          v-if="_data._pagination.enable"
          class="template-table__pagination"
          :page-sizes="_data._pagination.sizeOpts"
          :total="_data._pagination.total"
          :current-page="_data._pagination.page"
          :page-size="_data._pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="$sizeChange$"
          @current-change="$pageChange$"
        >
        </el-pagination>
      </template>
      <!-- 页面 end -->
    </page-table>
    <NsChatRoomDialog
      v-if="display"
      ref="nsChatRoomDialog"
      btnTitle=" "
      :selectedDataParent="activeRow.chooseChatroom"
      @getChatRoomData="getChatRoomData"
      :showIcon="false"
      :isLoaded="false"
      @onClose="display = false"
    ></NsChatRoomDialog>
    <el-drawer
      class="low-drawer"
      :modal="false"
      size="50%"
      @close="handleClose"
      :modal-append-to-body="false"
      :visible.sync="drawer"
      destroy-on-close
      :with-header="false"
    >
      <div class="master-close">
        <i class="el-icon-close" @click="handleClose"></i>
      </div>
      <GroupList
        v-if="drawer"
        :startTime="model.startTime"
        :endTime="model.endTime"
        :addState="addState"
        :shopName="shopName"
        :configId="configId"
        :shopId="shopId"
        :guid="model.guid"
        :chooseChatroom="chooseChatroom"
        @onNext="getOhter('next', handleDetail)"
        @onPrev="getOhter('prev', handleDetail)"
        @onChange="onChangeItem"
      />
    </el-drawer>
  </div>
</template>
<script>
import PageTable from '@/components/NewUi/PageTable'
import ElDrawer from '@nascent/nui/lib/drawer'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import NsChatRoomDialog from '@/components/NsChatRoomDialog/index'
import GroupList from './GroupList'
export default {
  data () {
    return {
      url: this.$api.guide.lbs.getGroupByshop,
      drawer: false,
      shopId: null,
      configId: null,
      shopName: null,
      activeIndex: -1,
      chooseChatroom: [],
      model: {},
      activeRow: {},
      addState: ['0', '1'], // 能新建群聊的状态
      state: -1,
      display: false,
      addiding: -1 // 点击添加群聊的id
    }
  },
  components: {
    PageTable,
    NsChatRoomDialog,
    ElDrawer,
    GroupList
  },
  props: {
    propsModel: {
      default () {
        return {}
      }
    }
  },
  mixins: [tableMixin],
  methods: {
    getChatRoomData (list) {
      this.$refs.nsChatRoomDialog.emptyData()
      const { shopId } = this.activeRow
      const { guid } = this.propsModel
      this.addiding = shopId
      const parmas = {
        guid,
        shopId,
        chatIdList: list.map((item) => item.chatId)
      }
      this.$http
        .fetch(this.$api.guide.lbs.addGroup, parmas)
        .then((res) => {
          if (res.success) {
            this.$notify.success('添加成功')
            this.$searchAction$()
          }
          this.addiding = -1
          this.display = false
        })
        .catch((res) => {
          this.$notify.error(res.msg)
          this.display = false
          this.addiding = -1
        })
    },
    // 查看详情
    handleDetail (row, index) {
      this.activeIndex = index
      this.shopId = +row.shopId
      this.configId = row.configId
      this.shopName = row.shopName
      this.chooseChatroom = row.chooseChatroom || []
      this.drawer = true
    },
    // 添加群聊
    handleAddGroup (row, index) {
      // this.activeRow = {
      //   chooseChatroom: [{ 'chatId': 'wraQfGDQAAQnF-VJeQkl1kb6CFRC4mOw', 'name': '未命名群聊' }, { 'chatId': 'wraQfGDQAABjU802QTmUSC2_m2ISvQbA', 'name': '未命名群聊' }]
      // }
      this.activeRow = row
      this.display = true
      this.$nextTick(() => {
        this.$refs.nsChatRoomDialog.init()
        this.$refs.nsChatRoomDialog.onDialogOpen()
      })
    },
    // 查看门店选择上一个或下一个详情
    getOhter (type, cb) {
      const { page, size, total } = this._data._pagination
      if (type === 'prev') {
        if (this.activeIndex === 0) {
          if (page === 1) {
            this.$notify.error('暂无上一个')
          } else {
            this._data._pagination.page = page - 1
            this.$queryList$(this.$generateParams$()).then(() => {
              const index = this._data._table.data.length - 1
              cb(this._data._table.data[index], index)
            })
          }
        } else {
          const index = this.activeIndex - 1
          cb(this._data._table.data[index], index)
        }
      } else if (type === 'next') {
        if ((page - 1) * size + this.activeIndex + 1 >= total) {
          this.$notify.error('暂无下一个')
        } else {
          if (this.activeIndex === size - 1) {
            this._data._pagination.page = page + 1
            this.$queryList$(this.$generateParams$()).then(() => {
              const index = 0
              cb(this._data._table.data[index], index)
            })
          } else {
            const index = this.activeIndex + 1
            cb(this._data._table.data[index], index)
          }
        }
      }
    },
    // 关闭详情弹框
    handleClose () {
      this.activeIndex = -1
      this.drawer = false
    },
    handleSort (val) {
      const { order, prop } = val
      this.$emit('onSort', { sortType: order === 'ascending' ? 1 : 0, sortName: prop })
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex === this.activeIndex) {
        return { backgroundColor: '#D9EFFE' }
      }
      return ''
    },
    onChangeItem (shopId) {
      this.$queryList$(this.$generateParams$()).then(() => {
        const item = this._data._table.data.find((item) => item.shopId === shopId)
        const index = this._data._table.data.findIndex((item) => item.shopId === shopId)
        this.handleDetail(item, index)
      })
    }
  },
  watch: {
    propsModel: {
      handler (newVal) {
        this.model = { ...newVal }
        this.$searchAction$()
      },
      immediate: true,
      deep: true
    }
  },
  mounted () {
    this.state =
      this.$route.query && this.$route.query.state
        ? this.$route.query.state.toString()
        : -1
  }
}
</script>
<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
.template-table.no-padding {
  padding: 0;
}
.btn-context {
  display: flex;
  .detail-btn {
    margin-right: 10px;
  }
}
.master-close {
  font-size: 16px;
  padding: 16px 16px 4px 16px;
  .el-icon-close {
    cursor: pointer;
  }
}
.low-drawer {
  z-index: 1050 !important;
}
</style>
