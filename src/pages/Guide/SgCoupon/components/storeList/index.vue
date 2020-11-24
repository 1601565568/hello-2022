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
                v-model="model.input"
            >
                <Icon
                    slot="suffix"
                    type="icon-sousuo1"
                />
            </el-input>
        </el-form>
        <el-table
            class="template-table__main"
            :data="_data._table.data"
            stripe
            ref="table"
            resizable
            v-loading.lock="_data._table.loadingtable"
            :element-loading-text="$t('prompt.loading')"
        >
            <el-table-column
                prop="couponTitle"
                label="优惠券名称"
                align="left"
                :sortable="false"
            >
            </el-table-column>
            <el-table-column
                prop="couponType"
                label="优惠券类型"
                align="left"
                :sortable="false"
            >
                <template slot-scope="scope">
                    {{scope.row.couponType == 1? '代金券': scope.row.couponType == 2? '折扣券': scope.row.couponType == 3? '兑换券': '-' }}
                </template>
            </el-table-column>
            <!-- 新增字段需要自己添加 -->
            <el-table-column
                prop="couponNumber"
                label="权益"
                :show-overflow-tooltip="true"
                align="left"
                :sortable="false"
            >
            <template slot-scope="scope" >
              <ElInput type="text"
                        @input="inputChange(scope.row)"
                        v-model="scope.row.shopCouponNumber"
                        maxlength="8"
                        style="width:80px" @focus="ChangeForbiddenStatus" @blur="delayedChangeStatus"/>
            </template>
            </el-table-column>
        </el-table>
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
