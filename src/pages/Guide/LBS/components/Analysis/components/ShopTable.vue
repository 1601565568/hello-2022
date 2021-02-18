<template>
  <div>
    <page-table class='no-padding'>
      <template slot='table'>
        <el-table
          :data="_data._table.data"
          class="new-table_border"
          :row-style="tableRowClassName"
          @sort-change="handleSort"
          style="width: 100%">
          <el-table-column
            prop="shopName"
            label="参与门店">
          </el-table-column>
          <el-table-column
            prop="chatroomNum"
            label="群聚合码">
            <template slot-scope="scope">
              <div class="scope-title">
                <div class="scope-title_text">
                  已聚合{{scope.row.chatroomNum}}个群
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="adduserNum"
            sortable="custom"
            label="新增群成员数">
          </el-table-column>
          <el-table-column
            prop="address"
            width='150px'
            label="操作">
            <template slot-scope="scope">
              <div class='btn-context'>
                <ns-button type="text" class='detail-btn' @click='handleDetail(scope.row,scope.$index)'>查看详情</ns-button>
                <ns-button type="text" class='detail-btn' @click='handleAddGroup(scope.row)'>添加群聊</ns-button>
                <!-- <NsChatRoomDialog btnTitle="添加群聊" @getChatRoomData="(list)=>{getChatRoomData(list,scope.row)}" :showIcon='false' :isLoaded='false'></NsChatRoomDialog> -->
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 页面 start -->
      <template slot='pagination'>
        <el-pagination v-if="_data._pagination.enable"
                        class="template-table__pagination"
                        :page-sizes="_data._pagination.sizeOpts"
                        :total="_data._pagination.total"
                        :current-page="_data._pagination.page"
                        :page-size="_data._pagination.size"
                        layout="total, sizes, prev, pager, next, jumper"
                        @size-change="$sizeChange$"
                        @current-change="$pageChange$">
          </el-pagination>
      </template>
      <!-- 页面 end -->
    </page-table>
    <NsChatRoomDialog ref='nsChatRoomDialog' btnTitle=" " :selectedDataParent='[]' @getChatRoomData="getChatRoomData" :showIcon='false' :isLoaded='false'></NsChatRoomDialog>
    <el-drawer
      :modal='false'
      size='50%'
      @close='handleClose'
      :visible.sync="drawer"
      :with-header="false">
      <div class='master-close'>
        <i class="el-icon-close" @click="handleClose"></i>
      </div>
      <GroupList v-if='drawer' :shopName='shopName' :configId='configId' :shopId='shopId' :guid='model.guid' @onNext='getOhter("next",handleDetail)' @onPrev='getOhter("prev",handleDetail)' />
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
      model: {},
      activeRow: {}
    }
  },
  components: {
    PageTable, NsChatRoomDialog, ElDrawer, GroupList
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
      const parmas = {
        guid,
        shopId,
        chatIdList: list.map(item => item.chatId)
      }
      this.$http.fetch(this.$api.guide.lbs.addGroup, parmas).then(res => {
        if (res.success) {
          this.$notify.success('添加成功')
          this.$searchAction$()
        }
      }).catch(res => {
        this.$notify.error(res.msg)
      })
    },
    // 查看详情
    handleDetail (row, index) {
      this.activeIndex = index
      this.shopId = +row.shopId
      this.configId = row.configId
      this.shopName = row.shopName
      this.drawer = true
    },
    // 添加群聊
    handleAddGroup (row) {
      this.activeRow = row
      this.$refs.nsChatRoomDialog.onDialogOpen()
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
        if (((page - 1) * size + this.activeIndex + 1) >= total) {
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
    this.$refs.nsChatRoomDialog.init()
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
</style>
