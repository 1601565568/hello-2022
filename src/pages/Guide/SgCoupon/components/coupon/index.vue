<template>
    <div>
        <el-dialog
            title="选择优惠券"
            width="960px"
            :visible.sync="chooseCouponDialogVisible"
        >
            <el-form
                ref="model"
                :inline="true"
                :model="model"
                label-width="90px"
                class="form-main"
            >
                <el-form-item label="卡券类型：">
                    <el-select
                        v-model="model.couponType"
                        placeholder="请选择"
                        @change="$searchAction$()"
                    >
                        <el-option
                            v-for="item in couponTypeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="优惠券名称：">
                    <el-input
                        @keyup.enter.native="onChangeInput()"
                        v-model="model.couponTitle"
                        placeholder="请输入优惠券名称"
                    >
                        <Icon
                            type="search"
                            className="el-input__icon"
                            style="padding: 5px;"
                            slot="suffix"
                            name="name"
                            @click="onChangeInput()"
                        />
                    </el-input>
                </el-form-item>
                <el-form-item label="优惠券编码：">
                    <el-input
                        @keyup.enter.native="onChangeInput()"
                        v-model="model.couponCode"
                        placeholder="请输入优惠券编码"
                    >
                        <Icon
                            type="search"
                            className="el-input__icon"
                            style="padding: 5px;"
                            slot="suffix"
                            name="name"
                            @click="onChangeInput()"
                        />
                    </el-input>
                </el-form-item>
            </el-form>
            <div class="warpper">
                <el-table
                    class="template-table__main"
                    :data="_data._table.data"
                    stripe
                    ref="table"
                    resizable
                    v-loading.lock="_data._table.loadingtable"
                    :element-loading-text="$t('prompt.loading')"
                >
                    <el-table-column width="40">
                        <template slot-scope="scope">
                            <div class="customerManage">
                                <el-radio
                                    :label="scope.row.id"
                                    v-model="couponRadio"
                                    @change.native="getCurrentRow(scope.row)"
                                ></el-radio>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="storeCouponTitle"
                        label="优惠券名称"
                        align="left"
                        :sortable="false"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="storeCouponType"
                        label="优惠券类型"
                        align="left"
                        :sortable="false"
                    >
                        <template slot-scope="scope">
                            {{scope.row.storeCouponType == 1? '代金券': scope.row.storeCouponType == 2? '折扣券': scope.row.storeCouponType == 3? '兑换券': '-' }}
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
                        <template slot-scope="scope">
                            <!-- 代金券 -->
                            <ns-button
                                type="text"
                                v-if="scope.row.storeCouponType == 3"
                                @click="getCommodityByCoupon(scope.row)"
                            >兑换商品</ns-button>
                            <!-- 折扣券 -->
                            <span v-if="scope.row.storeCouponType == 2">{{getCouponValue(scope.row.storeCouponValue)}}折</span>
                            <!-- 兑换券 -->
                            <span v-if="scope.row.storeCouponType == 1">{{scope.row.storeCouponValue}}元</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="剩余数量"
                        align="right"
                    >
                        <template slot-scope="scope">
                            <span v-if="scope.row.maxIssueAmount < 0">{{scope.row.maxIssueAmount}}</span>
                            <span v-if="scope.row.channelConfigType == 1 && scope.row.maxIssueAmount >= 0">{{scope.row.limitAmount  - scope.row.channelFreezeAmount}}</span>
                            <span v-if="scope.row.channelConfigType == 0 && scope.row.maxIssueAmount > 0"> {{scope.row.maxIssueAmount - scope.row.hadIssueAmount - scope.row.couponFreezeAmount}}</span>
                            <span v-if="scope.row.channelConfigType == 0 && scope.row.maxIssueAmount == 0">不限量</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="创建人"
                        align="right"
                    >
                    <template slot-scope="scope">
                        <span>{{scope.row.loginAccount || '-'}}</span>
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
            <div
                slot="footer"
                class="dialog-footer"
            >
                <ns-button @click="closeDialog()">取消</ns-button>
                <ns-button
                    @click="confirmDialog()"
                    type="primary"
                >确定</ns-button>
            </div>
        </el-dialog>
        <ExchangeList ref="exchange"></ExchangeList>
    </div>
</template>
<script>
import index from './src/index'
export default index
</script>
<style scoped>
.warpper{
  padding:0 10px;
}
/* 去掉更换导购列表弹框单选组多余数字 */
.customerManage >>> .el-radio__label {
  display: none !important;
}
</style>
