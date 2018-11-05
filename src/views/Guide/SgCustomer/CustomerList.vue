<template>
  <div>
    <ns-table-sg-customer ref="table" @showListDialogMain="showListDialogFun" ></ns-table-sg-customer>
    <!-- 客户详情列表 -->
    <el-dialog ref="showCustomerListDialog"  :title="title" :visible.sync="showCustomerDialogVisible" width="800px">
      <div style="overflow-x:hidden;overflow-y:auto;margin-top: 10px;">
        <el-table ref="chooseCustomer" :data="tableDataCustomer" @select="selectRow" @select-all="selectAll" stripe>
          <el-table-column prop="customerName" label="姓名" align="center" width="150"></el-table-column>
          <el-table-column prop="sex" label="性别" align="center" width="100"></el-table-column>
          <el-table-column prop="mobile" label="手机号" align="center" width="100"></el-table-column>
          <el-table-column prop="level" label="会员等级" align="center" width="100"></el-table-column>
        </el-table>
      </div>
      <!--分页开始-->
      <el-pagination v-if="_data.paginations.enable" class="template-table-pagination"
                     :page-sizes="_data.paginations.sizeOpts"
                     :total="_data.paginations.total"
                     :current-page="_data.paginations.page"
                     :page-size="_data.paginations.size"
                     layout="total, sizes, prev, pager, next, jumper"
                     @size-change="shopSizeChange"
                     @current-change="shopPageChange"
                     >
      </el-pagination>
        <!--分页结束-->
      <div slot="footer" class="dialog-footer">
        <ns-button @click="closeDialog">取消</ns-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
  import List from './src/CustomerList'
  import NsTableSgCustomer from './NsTableSgCustomer'

  List.components = {
    NsTableSgCustomer
  }
  export default List
</script>


