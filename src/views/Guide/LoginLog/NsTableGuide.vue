<template>
  <ns-page-table>
    <!-- 高级搜索 -->
    <!-- el-form 需添加  @keyup.enter.native="onSearch" 配置，实现回车搜索， onSearch 为搜索方法 -->
    <!-- el-form 需添加  surround-btn 类名 配置环绕按钮效果 -->
    <template slot="advancedSearch">
      <el-form ref="table_filter_form" :model="model" label-width="80px" :inline="true">
        <el-form-item label="操作人：">
          <el-form-grid>
            <el-select placeholder="员工" v-model="model.accountType" clearable filterable>
              <el-option v-for="shop in operator" :label="shop.label" :value="shop.value" :key="shop.value"></el-option>
            </el-select>
          </el-form-grid>
          <el-form-grid v-if="model.accountType === 1">
            <el-select placeholder="请选择所属门店" v-model="model.shopId" @change="staffFindList" clearable filterable>
              <el-option v-for="shop in shopFindList" :label="shop.shopName" :value="shop.id"
                         :key="shop.id"></el-option>
            </el-select>
          </el-form-grid>
          <el-form-grid v-if="model.accountType === 1">
            <el-select placeholder="请选择员工" v-model="model.operateId" clearable filterable>
              <el-option v-for="shop in staffFindLists" :label="shop.name" :value="shop.id" :key="shop.id"></el-option>
            </el-select>
          </el-form-grid>
          <el-form-grid v-if="model.accountType === 0">
            <el-input style="width:180px" autofocus=true v-model="model.operateName" placeholder="请输入品牌方姓名"
                      clearable></el-input>
          </el-form-grid>
          <el-form-grid v-if="model.accountType === 2">
            <el-input style="width:180px" autofocus=true v-model="model.operateId" placeholder="请输入操作人ID"
                      clearable></el-input>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="登录时间：" prop="time">
          <el-date-picker
            v-model="model.validTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="请选择开始日期"
            end-placeholder="请选择结束日期"
            align="right">
          </el-date-picker>
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
      <!-- 操作（只有一项文字的80px,两项文字120px,三项文字160px） -->

      <el-table ref="table" :data="_data._table.data" stripe>

        <el-table-column prop="operateName" label="操作人" align="left">
          <template slot-scope="scope">
            {{scope.row.operateName || '-'}}
          </template>
        </el-table-column>

        <el-table-column prop="operateId" label="操作人ID" align="left">
          <template slot-scope="scope">
            {{scope.row.operateId || '-'}}
          </template>
        </el-table-column>

        <el-table-column prop="terminalType" label="终端" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.terminalType === 1">PC端后台</span>
            <span v-else-if="scope.row.terminalType === 2">导购小程序</span>
            <span v-else-if="scope.row.terminalType === 3">店长小程序</span>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column prop='ipAddress' label="IP地址" align="left">
          <template slot-scope="scope">
            {{scope.row.ipAddress || '-'}}
          </template>
        </el-table-column>

        <el-table-column prop="loginTime" label="登录时间">
          <template slot-scope="scope">
            {{scope.row.loginTime || "-"}}
          </template>
        </el-table-column>

        <el-table-column prop="osBrowser" label="浏览器类型" align="left">
          <template slot-scope="scope">
            {{scope.row.osBrowser || '-'}}
          </template>
        </el-table-column>

        <el-table-column prop="loginResult" label="登录结果" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.loginResult === 0">成功</span>
            <span v-else-if="scope.row.loginResult === 1">失败</span>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column prop="loginFailureReason" label="失败原因" align="right">
          <template slot-scope="scope">
            {{scope.row.loginFailureReason || '-'}}
          </template>
        </el-table-column>

      </el-table>
    </template>
    <!-- 表格-结束 -->
    <!-- 分页 -->
    <template slot="pagination">
      <el-pagination v-if="_data._pagination.enable" class="template-table-pagination"
                     :page-sizes="_data._pagination.sizeOpts"
                     :total="_data._pagination.total"
                     :current-page="_data._pagination.page"
                     :page-size="_data._pagination.size"
                     layout="total, sizes, prev, pager, next, jumper"
                     @size-change="$sizeChange$"
                     @current-change="$pageChange$">
      </el-pagination>
    </template>
    <!-- 分页-结束 -->
  </ns-page-table>
</template>

<script>
  import guide from './src/NsTableGuide'

  export default guide
</script>
<style>
  .scope_row_count {
    color: blue;
  }
</style>
