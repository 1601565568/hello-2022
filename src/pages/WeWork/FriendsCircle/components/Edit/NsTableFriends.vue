
<template>
    <ns-page-table ref='table' :colButton="10"> <!-- :visible.sync="this.model.visible" -->
      <!-- 表格 -->
      <template slot="table">
        <el-table ref="table"  :data="_data._table.data" stripe
          v-loading.lock="_data._table.loadingtable"
          :element-loading-text="$t('prompt.loading')">
          <el-table-column align="left" width='50px'>
            <template slot-scope="scope">
              <el-radio v-model="checked.id" :label="scope.row.id" class='no-label' @change='handleCheck(scope.row)'></el-radio>
              <!-- <el-checkbox :checked='checked === scope.row.id' @change='handleCheck(scope.row.id)'></el-checkbox>{{checked === scope.row.id}} -->
            </template>
          </el-table-column>
          <el-table-column prop="name" label="对外信息名称" align="left">
          </el-table-column>
          <el-table-column prop="style" label="样式" align="left">
            <template slot-scope="scope">
              <span>{{styleList[scope.row.style]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="创建人" align="left">
          </el-table-column>
        </el-table>
      </template>

      <!-- 分页 -->
      <template slot="pagination">
        <el-pagination v-if="_data._pagination.enable" class="template-table-pagination"
                        :page-sizes="_data._pagination.sizeOpts"
                        :total="_data._pagination.total"
                        :current-page.sync="_data._pagination.page"
                        :page-size="_data._pagination.size"
                        layout="total, sizes, prev, pager, next, jumper"
                        @size-change="$sizeChange$"
                        @current-change="$pageChange$">
        </el-pagination>
      </template>
    </ns-page-table>
    <!-- <div slot="footer"
         class="dialog-footer">
      <ns-button @click.native.prevent="alert('ok')">关闭</ns-button>
    </div>
  </el-dialog> -->
</template>

<script>
/*
 * @Descripttion: 使用员工组件
 * @Author: yuye.huang
 * @Date: 2020-03-09 13:55:17
 * @LastEditors: yuye.huang
 * @LastEditTime: 2020-03-09 14:26:02
 */
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'

export default {
  props: {
    id: {
    }
  },
  mixins: [tableMixin],
  data () {
    return {
      url: this.$api.weWork.friendsCircle.profileList,
      checked: { id: this.id },
      styleList: { // 样式枚举
        0: '朋友圈样式',
        1: '设计师样式',
        2: '多媒体样式'
      }
    }
  },
  methods: {
    handleCheck (item) {
      this.checked = item
    }
  },
  mounted () {
    this.$searchAction$()
  }
}

</script>
<style scoped>
.no-label >>> .el-radio__label {
  display: none;
}
</style>
