
<template>
 <div>
    <ns-page-table>
     <template slot="table">
        <div >
            <el-row class="template-table__bar-base">
                <el-col :span="16" >
                商品库
                </el-col>
                <el-col :span="2" >
                    <ns-button>新建</ns-button>
                </el-col>
                <el-col :span="5">
                    <el-input placeholder="商品名称/编码" v-model="productName"></el-input>
                </el-col>
                <el-col :span="1"  @click="$searchAction$()">
                    <i class="el-icon-search"></i>
                </el-col>
            </el-row>
        </div>
        <div>
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"  @select="handleSelect">
                <el-menu-item index="1">所有</el-menu-item>
                <el-menu-item index="2">未开始</el-menu-item>
                <el-menu-item index="3">进行中</el-menu-item>
                <el-menu-item index="4">已结束</el-menu-item>
            </el-menu>
        </div>
        <div>
            <el-table :data="tableData" style="width: 100%" :row-class-name='tableRowClassName' :highlight-current-row="true">
                <el-table-column prop="date" label="活动名称"></el-table-column>
                <el-table-column prop="name" label="状态"></el-table-column>
                <el-table-column prop="address" label="有效时间"></el-table-column>
                <el-table-column prop="name" label="订单实付金额"></el-table-column>
                <el-table-column prop="address" label="操作"></el-table-column>
            </el-table>
        </div>
    </template>
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
import index from './src/index'
export default index
</script>
<style scoped>

.el-input.el-input--small .el-input__inner {text-indent: 25rpx !important;}
.template-table__bar{display:none}
.topTip {line-height: 32px;height: 32px;}
.topTip .tipInfo {padding-left: 15px;color: #333;}
.topTip span {font-size: 13px;color: #f00;}
.template-table__bar-base{height:30px;line-height:30px;}
.mt10 {margin-top: 10px;}
.el-button--small{color:#0091FA;font-size: 13px;}
.el-table .success-row {background: #f00;}
tr{height:60px;}
.el-menu-demo{background-color:#F5F5F5;height:40px}
.el-menu-demo>.el-menu-item{height:40px;line-height:40px;}
.el-menu-item:hover{background-color:#F5F5F5}
.el-input{display:inline-block}
.el-col{height:60px;}
.el-col-16{height:34px;line-height:34px;}
.el-col-1{background: #F5FBFF;border-radius: 0 3px 3px 0;width:34px;height:28px;;line-height:33px;text-align:center}
.el-col-1 i{font-size:18px;color:#53616B}
.w80{width: 76px;text-align: right; display: inline-block;}
.hover{background-color:#f5f5f5}
.PeopleSpellGroup-main{background-color:#f5f5f5}
</style>
