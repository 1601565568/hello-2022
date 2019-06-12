<template>
  <div>
    <ns-page-table>
      <template slot="table">
        <el-table ref="goodsTable" :data="_data._table.data" class="template-table__main"
                  stripe resizable v-loading.lock="_data._table.loadingtable"
                  :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
          <el-table-column  type="default" prop="picture_url" label="商品图片" align="center" width="80">
            <template slot-scope="{row}">
              <img :src="row.picture_url" width="40" height="40"/>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="商品名称" align="left" show-overflow-tooltip></el-table-column>
          <el-table-column prop="shopCount" label="在售门店" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="minPrice" label="最低售价" align="center" show-overflow-tooltip>
            <template slot-scope="{row}">
              <div v-if="row.minPrice != null">
                ￥{{row.minPrice}}
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="120"  v-if="showIcon">
            <template slot-scope="{row}">
              <ns-button @click="deleteGoods(row)"
                         type="text"><i
                class="el-icon-delete"></i>
              </ns-button>
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
import tableMixin from 'web-crm/src/mixins/table'
export default {
  name: 'ActivityGoodsTable',
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
      goodsInfo: null,
      url: this.$api.guide.marketing.queryActivityGoods
    }
  },
  methods: {
    // 查询选中的商品列表
    findList: function (goodsIds, activityId) {
      if (!this._data._table.searchMap) {
        this._data._table.searchMap = {}
      }
      this._data._table.searchMap.goodsIds = goodsIds
      this._data._table.searchMap.activityId = activityId
      this.$reload()
    },
    // 删除选中的商品
    deleteGoods: function (row) {
      for (let i = 0; i < this._data._table.data.length; i++) {
        if (row.sys_item_id === this._data._table.data[i].sys_item_id) {
          this._data._table.data.splice(i, 1)
          break
        }
      }
      this.$emit('delete', row.sys_item_id)
    }
  }
}
</script>
