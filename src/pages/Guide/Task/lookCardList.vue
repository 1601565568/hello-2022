<template>
  <div>
    <div class="tips">
      单次执行的任务，将于任务开始时间的凌晨获取客户名单（当日开始，则保存任务后获取客户名单）；<br />
      每日执行的任务，将于每日凌晨获取客户名单（当日开始，则保存任务后获取当日客户名单）。
    </div>
    <ns-page-table :colButton="14">
      <template slot="table">
        <el-table
          ref="table"
          :data="_data._table.data"
          class="template-table__main"
          stripe
          resizable
          v-loading.lock="_data._table.loadingtable"
          :element-loading-text="$t('prompt.loading')"
          row-key="id"
        >
          <el-table-column prop="name" label="姓名" >
            <template slot-scope="scope">
              <ns-sg-sensitive-button type="simple" :defaultText="true" :encryptData="scope.row.encName" :sensitiveData="scope.row.name"></ns-sg-sensitive-button>
            </template>
          </el-table-column>
          <el-table-column
            label="手机"
            align="center"
            width="120"
            prop="mobile"
          >
           <template slot-scope="scope">
             <ns-sg-sensitive-button type="phone" :defaultText="true" :encryptData="scope.row.encMobile" :sensitiveData="scope.row.mobile"></ns-sg-sensitive-button>
            </template>
          </el-table-column>
          <el-table-column prop="shopName" label="门店名称">
            <template slot-scope="scope">
              {{ scope.row.shopName || '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="guideName" label="专属导购" >
            <template slot-scope="scope">
              {{ scope.row.guideName || '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="address" label="地区" >
            <template slot-scope="scope">
              <ns-sg-sensitive-button type="simple" :defaultText="true" :encryptData="scope.row.encAddress" :sensitiveData="scope.row.address"></ns-sg-sensitive-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template slot="pagination">
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
      </template>
    </ns-page-table>
  </div>
</template>
<script>
import lookCardList from './src/lookCardList'
export default lookCardList
</script>
<style scoped>
  .tips{
    width: 928px;
    height: 62px;
    background: #F2F9FE;
    border-radius: 2px;
    padding: 9px 16px;
    font-size: 14px;
    color: #595959;
    line-height: 22px;
  }
</style>
