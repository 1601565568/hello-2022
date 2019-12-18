<template>
 <div>
   <!-- <ns-table-isv ref="table" :url=$api.isv.findServiceExecutionList></ns-table-isv> -->
  <ns-page-table>
    <!-- 简单搜索 -->
    <!-- el-form 需添加 @submit.native.prevent 配置 -->
    <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
    <template slot="searchSearch">
      <el-form :model="searchModel" :inline="true" @submit.native.prevent  class="pull-right">
        <el-form-item v-show="_data._queryConfig.expand === false">
          <el-select v-model="searchModel.type" clearable  placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.value" :value="item.label"></el-option>
          </el-select>
          <!-- <el-input ref="quickText" style="width: 250px" v-model="searchModel.type" placeholder="请输入虚拟视角ID/服务状态" @keyup.enter.native="$quickSearchAction$('name')" clearable>
          </el-input> -->
          <ns-button type="primary" @click="searchAction(searchModel)">搜索</ns-button>
          <ns-button @click="resetInputAction(searchModel)">重置</ns-button>
        </el-form-item>
        <el-form-item>
        </el-form-item>
      </el-form>
    </template>
    <!-- 简单搜索-结束 -->
    <!-- 表格 -->
    <template slot="table">
      <el-table ref="table" :data="shopFindList" stripe>
        <el-table-column prop="brandId" label="虚拟视角ID" align="left" width="120">
          <template slot-scope="scope">
            {{scope.row.brandId || '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" align="left" width="180">
          <template slot-scope="scope">
            {{scope.row.startTime || '-'}}
          </template >
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" align="left" width="180">
          <template slot-scope="scope">
            {{scope.row.endTime || '-'}}
          </template >
        </el-table-column>
        <el-table-column prop="status" label="服务状态" align="left" width="120">
          <template slot-scope="scope">
            {{scope.row.status === 0?'未执行':'执行中'}}
          </template>
        </el-table-column>
        <el-table-column prop="type" label="服务类型" align="left">
          <template slot-scope="scope">
              {{scope.row.type === 0?'销售业绩':scope.row.type === 1?'招募业绩':scope.row.type === 2?'订单同步':scope.row.type === 3?'导购会员同步':scope.row.type === 4?'门店同步':scope.row.type === 5?'优惠券记录同步':'优惠券'}}
          </template>
        </el-table-column>
        <el-table-column prop='typeName' label="定时服务名称" align="left" width="180">
          <template slot-scope="scope">
              {{scope.row.typeName || '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="status,row" :show-overflow-tooltip="true" label="操作" align="right" width="120">
          <template slot-scope="scope">
            <div>
              <ns-button style="color:#0091FA" @click="onRedactFun(scope.row)" type="text">编辑</ns-button>
              <!-- <ns-button style="color:#f00" @click="onDelsTipFun(scope.row)" type="text">删除</ns-button> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 表格-结束 -->
    <!-- 分页 -->
    <template slot="pagination">
      <el-pagination v-if="_data.pagination.enable" class="template-table__pagination"
                      :page-sizes="_data.pagination.sizeOpts" :total="_data.pagination.total"
                      :current-page.sync="_data.pagination.page" :page-size="_data.pagination.size"
                      layout="total, sizes, prev, pager, next, jumper" @size-change="$sizeChange$"
                      @current-change="$pageChange$">
      </el-pagination>
    </template>
    <!-- <template slot="pagination">
    <el-pagination v-if="_data.pagination.enable" class="template-table-pagination"
                    :page-sizes="_data.pagination.sizeOpts"
                    :total="_data.pagination.total"
                    :current-page.sync="_data.pagination.page"
                    :page-size="_data.pagination.size"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="sizeChange"
                    @current-change="pageChange">
    </el-pagination>
    </template> -->
    <!-- 分页-结束 -->
  </ns-page-table>
    <el-dialog size="small" :title="titleText"
            :visible.sync="domainNameVisible"
            :modal-append-to-body="false"
            @before-close="closeDialog()">
      <el-form :model="model" ref="form" label-width="150px" :rules="rules" placement="right">
        <el-form-item label="开始时间：" prop="startTime">
          <el-input type="text" placeholder="开始时间" v-model="model.startTime"></el-input>
        </el-form-item>
        <el-form-item label="结束时间：" prop="endTime">
          <el-input type="text" placeholder="结束时间" v-model="model.endTime"></el-input>
        </el-form-item>
        <el-form-item label="服务状态：" prop="status">
          <el-input type="text" placeholder="服务状态" v-model="model.status"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="domainNameVisible = false">取消</ns-button>
        <ns-button type="primary" @click="onSave(model)">确定</ns-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import guide from './src/index'
export default guide
</script>
<style scoped>
.scope_row_count{
  color: blue;
}
</style>
