<template>
  <el-drawer
    :visible.sync="unDrawer"
    :direction="direction"
    size="720px"
    :with-header="false"
    :modal="false"
    @close="handleClose"
  >
    <div>
      <div class="close-view">
        <Icon type="close" class="close-icon" @click="closeDeawer" />
      </div>
      <div class="unDrawer-title">未完成员工</div>
      <el-form :inline="true" class="form-inline_top">
        <el-form-item label="选择门店：">
          <NsShopDialog
            :selfBtn="true"
            :appendToBody="true"
            :isButton="false"
            :auth="false"
            type="icon"
            btnTitle=""
            dialogTitle="选择门店："
            @input="handleChangeShop"
            v-model="shopIds"
          >
            <template slot="btnIcon">
              <div class="self-btn">
                {{
                  shopIds && shopIds.length
                    ? `已选择${shopIds.length}个门店`
                    : '全部门店'
                }}
                <Icon type="shop" class="shopIds-icon"></Icon>
              </div>
            </template>
          </NsShopDialog>
        </el-form-item>
      </el-form>
      <div class="unDrawer-showinfo">
        <div>
          <span>未完成员工{{ noCompletionTotal }}人</span>
        </div>
      </div>
      <page-table style="padding-top:0">
        <template slot="table">
          <el-table :data="listData" class="new-table_border unDrawer-table">
            <el-table-column prop="guideName" label="员工"> </el-table-column>
            <el-table-column prop="guideId" label="工号"> </el-table-column>
            <el-table-column prop="shopNamesStr" label="所属门店">
              <template slot-scope="scope">
                <el-popover
                  placement="top-start"
                  width="300"
                  trigger="hover"
                  :disabled="scope.row.shopNamesStr.length <= 15"
                >
                  <div>{{ scope.row.shopNamesStr }}</div>
                  <span
                    slot="reference"
                    v-if="scope.row.shopNamesStr.length <= 15"
                    >{{ scope.row.shopNamesStr }}</span
                  >
                  <span
                    slot="reference"
                    v-if="scope.row.shopNamesStr.length > 15"
                    >{{ scope.row.shopNamesStr.substr(0, 15) + '...' }}</span
                  >
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <template slot="pagination">
          <el-pagination
            class="label-dialog__pagination"
            :page-sizes="pagination.sizeOpts"
            :total="pagination.total"
            :current-page.sync="pagination.page"
            :page-size="pagination.size"
            layout="total, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </template>
      </page-table>
    </div>
  </el-drawer>
</template>
<script>
import ElDrawer from '@nascent/nui/lib/drawer'
import PageTable from '@/components/NewUi/PageTable'
import { getErrorMsg } from '@/utils/toast'
import NsShopDialog from '@/components/NsShopDialog'
export default {
  name: 'unDetailList',
  components: { ElDrawer, PageTable, NsShopDialog },
  props: {
    materialScriptId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      title: '未完成员工',
      direction: 'rtl',
      unDrawer: false,
      listData: [],
      value: '',
      guideIdsStr: '',
      isCompletion: 0,
      shopIdsStr: '',
      // 分页配置
      pagination: {
        size: 10,
        sizeOpts: [10],
        page: 1,
        total: 0
      },
      shopSelectData: [],
      shopIds: [],
      noCompletionTotal: 0
    }
  },
  methods: {
    handleChangeShop (value) {
      this.shopIds = value
      if (this.shopIds.length > 0) {
        this.shopIdsStr = this.shopIds.join(',')
      } else {
        this.shopIdsStr = ''
      }
      this.pagination = {
        size: 10,
        sizeOpts: [10],
        page: 1,
        total: 0
      }
      this.loadList()
      this.loadNum()
    },
    handleSizeChange (size) {
      this.pagination = {
        ...this.pagination,
        size,
        page: 1
      }
      this.loadList()
    },
    handleCurrentChange (page) {
      this.pagination.page = page
      this.loadList()
    },
    closeDeawer () {
      this.unDrawer = !this.unDrawer
      if (this.unDrawer) {
        this.pagination = {
          size: 10,
          sizeOpts: [10],
          page: 1,
          total: 0
        }
        this.loadList()
        this.loadNum()
      }
    },
    handleClose () {
      this.unDrawer = false
    },
    loadList () {
      const params = {
        searchMap: {
          materialScriptId: this.materialScriptId,
          guideIdsStr: this.guideIdsStr,
          isCompletion: this.isCompletion,
          shopIdsStr: this.shopIdsStr
        },
        start: (this.pagination.page - 1) * this.pagination.size,
        length: this.pagination.size
      }
      this.$http
        .fetch(this.$api.guide.findScriptCompletionDetailList, params)
        .then(resp => {
          if (resp.success) {
            this.listData = resp.result.data
            this.pagination.total = parseInt(resp.result.recordsTotal)
          }
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg(this.title, resp))
        })
        .finally(() => {})
    },
    loadNum () {
      const params = {
        materialScriptId: this.materialScriptId,
        guideIdsStr: this.guideIdsStr,
        isCompletion: this.isCompletion,
        shopIdsStr: this.shopIdsStr
      }
      this.$http
        .fetch(this.$api.guide.getScriptCompletionNumber, params)
        .then(resp => {
          if (resp.success) {
            this.noCompletionTotal = resp.result.noCompletionTotal
              ? resp.result.noCompletionTotal
              : 0
          }
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg(this.title, resp))
        })
        .finally(() => {})
    }
  }
}
</script>
<style scoped lang="scss">
@import '@components/NewUi/styles/reset.css';
@import '../styles/reset.css';
.unDrawer-title {
  height: 53px;
  font-size: 16px;
  color: #262626;
  line-height: 53px;
  padding-left: 16px;
}
.unDrawer-sub-title {
  font-size: 14px;
  color: #303133;
  line-height: 55px;
  font-weight: 500;
  padding-left: 32px;
  height: 55px;
}
.unDrawer-sub-cont {
  font-size: 14px;
  color: #606266;
  line-height: 24px;
  font-weight: 400;
  margin-left: 32px;
  margin-right: 32px;
  padding-bottom: 33px;
  border-bottom: 1px solid #e8e8e8;
}
.unDrawer-sub-img {
  width: 375px;
  height: 257px;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  margin-left: 32px;
}
.close-view {
  height: 49px;
  display: flex;
  align-items: center;
}
.close-icon {
  margin-left: 16px;
  width: 20px;
  height: 20px;
}
.unDrawer-showinfo {
  font-size: 14px;
  color: #595959;
  line-height: 22px;
  font-weight: 400;
  margin-left: 16px;
  margin-right: 16px;
  display: flex;
  justify-content: space-between;
  height: 65px;
  align-items: center;
}
.unDrawer-table {
  padding: 0;
  font-size: 14px;
  font-weight: 400;
}
.unDrawer-output {
  width: 116px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  line-height: 32px;
  text-align: center;
}
.unDrawer-select {
  margin-left: 16px;
  margin-top: 16px;
  width: 143px;
  height: 32px;
  background: #ffffff;
  border-radius: 2px;
  font-size: 14px;
  color: #262626;
}
.select-button {
  font-size: 14px;
  color: #0094fc;
  font-weight: 400;
}
.remind-text {
  color: #0091fa;
}
.self-btn {
  width: 150px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #606266;
  .shopIds-icon {
    color: #c0c4cc;
  }
}
.form-inline_top {
  margin-left: 16px;
  display: flex;
  align-items: center;
}
</style>
