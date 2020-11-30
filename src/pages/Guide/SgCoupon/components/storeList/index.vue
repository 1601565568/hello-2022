<template>
    <div>
        <el-form
            ref="form"
            :model="model"
            label-width="80px"
        >
            <el-input
                class="search"
                placeholder="请输入门店名称"
                v-model="model.shop_name"
            >
                <Icon
                    slot="suffix"
                    type="icon-sousuo1"
                />
            </el-input>
        </el-form>
        <el-table
            class="template-table__main"
            :data="shopList"
            stripe
            ref="table"
            resizable
            v-loading.lock="_data._table.loadingtable"
            :element-loading-text="$t('prompt.loading')"
        >
            <el-table-column
                prop="address"
                label="门店名称"
                align="left"
                :sortable="false"
            >
            </el-table-column>
            <el-table-column label="所属地区" align="left" >
            <template slot-scope="scope">
              <span>{{scope.row.province}}/{{scope.row.city}}/{{scope.row.district}}</span>
            </template>
          </el-table-column>>
            <!-- 新增字段需要自己添加 -->
            <el-table-column
                prop="couponNumber"
                label="配额"
                :show-overflow-tooltip="true"
                align="left"
                :sortable="false"
            >
            <template slot-scope="scope" >
              <ElInput type="text"
                        @input="inputChange(scope.row)"
                        v-model="scope.row.shopCouponNumber"
                        maxlength="8"
                        show-word-limit
                        style="width:80px"/>
            </template>
            </el-table-column>
        </el-table>
        <!--分页开始-->
        <el-pagination v-if="_data.paginations.enable" class="template-table-pagination"
                       :page-sizes="_data.paginations.sizeOpts"
                       :total="_data.paginations.total"
                       :current-page.sync="_data.paginations.page"
                       :page-size="_data.paginations.size"
                       layout="total, sizes, prev, pager, next, jumper"
                       @size-change="shopSizeChange"
                       @current-change="shopPageChange"
                       >
        </el-pagination>
        <!--分页结束-->
    </div>
</template>
<script>
import index from './src/index'
export default index
</script>
<style scoped>
.search {
  width: 360px;
  margin-bottom: 16px;
}
</style>
