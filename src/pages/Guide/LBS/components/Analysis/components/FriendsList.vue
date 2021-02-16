<template>
  <div>
    <page-table title='参与门店'>
      <template slot='table'>
        <div class='form-item_tip'>
          客户选择此门店时，会随机添加以下的任意一名员工
        </div>
        <el-table
          :data="_data._table.data"
          class="new-table_border"
          @sort-change="handleSort"
          style="width: 100%">
          <el-table-column
            prop="chatroomNum"
            label="员工姓名">
          </el-table-column>
          <el-table-column
            prop="guideName"
            label="工号">
          </el-table-column>
          <el-table-column
            prop="userNum"
            sortable="custom"
            label="添加好友数">
          </el-table-column>
          <el-table-column
            prop="title"
            label="好友总数">
            <template slot-scope="scope">
              <div class='btn-context'>
                <ns-button type="text" class='detail-btn' @click='handleRemove(scope.row)'>移除</ns-button>
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
                          style='width:300px'
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
      url: this.$api.guide.lbs.activityShopDetail,
      // 筛选数据
      model: {
        sortName: '', // 排序字段名称
        sortType: 0 // 排序类型  0 降序 1 升序
      }
    }
  },
  computed: {
    deleteApi () {
      return this.$api.guide.lbs.deleteGroup
    }
  },
  props: ['shopId', 'guid', 'shopName', 'configId'],
  components: {
    PageTable
  },
  mixins: [tableMixin],
  methods: {
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
      this.$http.fetch(this.deleteApi, { configId, chatId, guid: this.model.guid })
        .then(() => {
          this.$searchAction$()
        }).catch(() => {
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
        this.$searchAction$()
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "@components/NewUi/styles/reset.css";
  .search-icon {
    font-size: 22px;
    margin-top: 2px;
  }
  .scope-name_tag.el-tag {
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
    bottom: 16px;
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
