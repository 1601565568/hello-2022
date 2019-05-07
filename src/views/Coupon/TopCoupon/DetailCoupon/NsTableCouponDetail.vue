<template>
  <ns-page-table @add-coupon="$emit('add-coupon')" @update-coupon="$emit('update-coupon')">

    <!-- 高级搜索 -->
    <!-- el-form 需添加  @keyup.enter.native="onSearch" 配置，实现回车搜索， onSearch 为搜索方法 -->
    <template slot="advancedSearch">
      <el-form ref="table_filter_form" label-width="65px" @keyup.enter.native="onSearch" class="surround-btn"
               :model="model" :rules="rules" :inline="true">
        <el-form-item label="淘宝昵称：" class = "el-inline-block">
          <el-form-grid size="sm">
            <el-input  type="text" v-model.trim="model.out_nick">
            </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="使用情况：" class = "el-inline-block">
          <el-form-grid size="sm">
            <el-select v-model="model.coupon_state" placeholder="请选择" clearable>
              <el-option label="未使用" value="unused" :key="0"></el-option>
              <el-option label="使用中" value="using" :key="1"></el-option>
              <el-option label="已使用" value="used" :key="2"></el-option>
            </el-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="状态：" class = "el-inline-block">
          <el-form-grid size="sm">
            <el-select v-model="model.send_status" placeholder="请选择" clearable>
              <el-option label="未发送" value="0" :key="0"></el-option>
              <el-option label="发送成功" value="1" :key="1"></el-option>
              <el-option label="发送失败" value="2" :key="2"></el-option>
              <el-option label="店铺客户" value="3" :key="3"></el-option>
              <el-option label="超过五张" value="4" :key="4"></el-option>
            </el-select>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div class="template-table__more-btn">
        <ns-button type="primary" @click="$searchAction$()">搜索</ns-button>
        <ns-button @click="$resetInputAction$()">重置</ns-button>
      </div>
    </template>
    <!-- 高级搜索-结束 -->

    <!-- 表格 -->
    <template slot="table">
      <!-- 表格配置 不能添加 border 配置 -->
      <!-- 表格配置 需添加 stripe （实现斑马线效果） -->

      <!-- 表格单元格宽度配置规范 -->
      <!-- 复选框/单选框 :width="45" -->
      <!-- 日期 年月日 :width="100"   年月日时分秒 :width="150" -->
      <!-- 手机号 :width="120" -->
      <!-- 操作栏 单个按钮 :width="80"  多个按钮 :width="120" -->

      <el-table ref="table" :data="_data._table.data" class="template-table__main"
                stripe
                resizable v-loading.lock="_data._table.loadingtable"
                :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
        <el-table-column :show-overflow-tooltip="true" type="default" prop="outNick"
                         label="淘宝昵称" dbcolumn="outNick" column="outNick" align="left"
                         :sortable="false">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="coupon_state"
                         label="使用情况"  dbcolumn="coupon_state" column="coupon_state" align="center" :sortable="false">
          <template slot-scope="scope">
            <template v-if="scope.row.coupon_state == 'unused'">未使用</template>
            <template v-else-if="scope.row.coupon_state == 'using'">使用中</template>
            <template v-else>已使用</template>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="send_time"
                         label="发送时间" dbcolumn="send_time" column="send_time" align="center"
                         :sortable="false">
          <template slot-scope="scope">
           {{scope.row.send_time == null? '-': scope.row.send_time}}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" label="发放结果"
                         align="center" :sortable="false" width="100">
          <template slot-scope="scope">
            <template v-if="scope.row.send_status == 0">未发送</template>
            <template v-else-if="scope.row.send_status == 1">发送成功</template>
            <template v-else-if="scope.row.send_status == 2">发送失败</template>
            <template v-else-if="scope.row.send_status == 3">店铺客户</template>
            <template v-else-if="scope.row.send_status == 4">超过五张</template>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 表格-结束 -->

    <!-- 分页 -->
    <template slot="pagination">
      <el-pagination v-if="_data._pagination.enable" class="template-table__pagination"
                     :page-sizes="_data._pagination.sizeOpts" :total="_data._pagination.total"
                     :current-page="_data._pagination.page" :page-size="_data._pagination.size"
                     layout="total, sizes, prev, pager, next, jumper" @size-change="$sizeChange$"
                     @current-change="$pageChange$">
      </el-pagination>
    </template>
    <!-- 分页-结束 -->
  </ns-page-table>
</template>

<script>
import NsTableCouponDetail from './src/NsTableCouponDetail'

export default NsTableCouponDetail
</script>
