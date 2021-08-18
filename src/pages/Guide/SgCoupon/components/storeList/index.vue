<template>
    <div class='form'>
        <el-form
            class='form-content'
            ref="form"
            :inline="true"
            @submit.native.prevent
            :model="model"
            label-width="80px"
        >
          <el-form-item>
            <el-input
                class="search"
                style='width:263px;'
                placeholder="请输入门店名称"
                v-model="model.shop_name"
            >
                <Icon
                    type="search"
                    className="el-input__icon"
                    style="padding: 5px;"
                    slot="suffix"
                    name="name"
                />
            </el-input>
          </el-form-item>
          <el-form-item v-if='activityModel.type===1'>
            <ns-button @click="handleDevide" class='sharing'>{{devideText}}</ns-button>
          </el-form-item>
        </el-form>
        <el-table
            class="new-table_border drawer-table"
            :data="pageData"
            ref="table"
            resizable
            v-loading.lock="_data._table.loadingtable"
            :element-loading-text="$t('prompt.loading')"
            :header-row-style="{'height': '35px'}"
        >
            <el-table-column
                prop="shopName"
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
                        @input="(e)=>{inputChange(e,scope.row)}"
                        :value="scope.row.shopCouponNumber"
                        :disabled='activityModel.type===0'
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
@import '@components/NewUi/styles/reset.css';
.search {
  width: 360px;
  /* margin-bottom: 16px; */
}
.form {
  position: relative;
}
.form-content {
  position: absolute;
  right: 0;
  top: -35px;
}
.form-content >>> .el-form-item--small.el-form-item {
  margin-bottom:0 !important;
  margin-left: 16px;
}
.form-content .sharing {
  width: 72px;
  text-align: center;
  padding-left: 0;
  padding-right: 0;
  font-weight: normal;
}
</style>
<style>
.custom-dialog {
  .el-message-box__title {
    font-size: 16px;
    font-weight: 700;
    color: rgb(48, 49, 51);
  }
  .el-message-box__status {
    font-size: 16px !important;
  }
  .el-message-box__status + .el-message-box__message {
    padding-left: 24px;
  }
}
.drawer-table {
  padding: 0;
  font-size: 14px;
  font-weight: 400;
}
</style>
