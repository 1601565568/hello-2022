<template>
  <div>
    <ns-page-table>
      <template slot="table">
        <el-table ref="shopsTable" :data="_data._table.data" class="template-table__main"
                  stripe resizable v-loading.lock="_data._table.loadingtable"
                  :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
          <el-table-column prop="shopName" label="门店名称" align="left" show-overflow-tooltip></el-table-column>
          <el-table-column prop="address" label="区域" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" align="center" width="120" v-if="showIcon">
            <template slot-scope="{row}">
              <ns-button @click="deleteShop(row)" type="text"><Icon type="delete" /></ns-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页 -->
      <template slot="pagination">
        <el-pagination v-if="_data._pagination.enable" class="template-table__pagination"
                       :page-sizes="_data._pagination.sizeOpts" :total="_data._pagination.total"
                       :current-page.sync="_data._pagination.page" :page-size="_data._pagination.size"
                       layout="total, sizes, prev, pager, next, jumper" @size-change="$sizeChange$"
                       @current-change="$pageChange$">
        </el-pagination>
      </template>
    </ns-page-table>
  </div>
</template>

<script>
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'

export default {
  name: 'ActivityShopTable',
  mixins: [tableMixin],
  props: {
    showIcon: {
      type: Boolean,
      default () {
        return true
      }
    }
  },
  data: function () {
    return {
      url: this.$api.guide.marketing.queryActivityShops
    }
  },
  methods: {
    // 查询选中的门店列表
    findList: function (shopIds, activityId) {
      if (!this._data._table.searchMap) {
        this._data._table.searchMap = {}
      }
      this._data._table.searchMap.shopIds = shopIds
      this._data._table.searchMap.activityId = activityId
      // this.$reload()
    },
    // 删除选中的门店
    deleteShop: function (row) {
      for (let i = 0; i < this._data._table.data.length; i++) {
        if (row.id === this._data._table.data[i].id) {
          this._data._table.data.splice(i, 1)
          break
        }
      }
      this.$emit('delete', row.id)
    }
  }
}
</script>
