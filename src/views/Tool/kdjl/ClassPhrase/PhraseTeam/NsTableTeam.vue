<template>
  <ns-page-table @update="$emit('update')" @add="$emit('add')" @import="$emit('import')" @open="$emit('open')" @update-trans="$emit('update-trans')" @export-file="$emit('export-file')">
    <!-- 按钮 -->
    <template slot="buttons">
      <ns-table-operate-button :buttons="_data._table.operate_buttons">
      </ns-table-operate-button>
    </template>
    <!-- 按钮-结束 -->

    <!-- 简单搜索 -->
    <!-- el-form 需添加 @submit.native.prevent 配置 -->
    <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
    <template slot="searchSearch">
      <el-form :model="quickSearchModel" :inline="true"  label-width="80px" @submit.native.prevent class="pull-right">
        <el-form-item label="关键字：">
          <el-form-grid>
            <el-form-item prop="signatureName">
              <el-input type="text" v-model.trim="model.classPhrase" placeholder="请输入内容" > </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item>
          <ns-button type="primary" @click="$searchAction$()">{{$t('operating.search')}}</ns-button>
          <ns-button @click="resetInputAction()">{{$t('operating.reset')}}</ns-button>
        </el-form-item>
      </el-form>
    </template>
    <!-- 简单搜索-结束 -->

    <!-- 表格 -->
    <template slot="table">
      <!-- 表格配置 不能添加 border 配置 -->
      <!-- 表格配置 需添加 stripe （实现斑马线效果） -->

      <!-- 表格单元格宽度配置规范 -->
      <!-- 复选框/单选框 :width="45" -->
      <!-- 日期 年月日 :width="100"   年月日时分秒 :width="150" -->
      <!-- 手机号 :width="120" -->
      <!-- 操作栏 单个按钮 :width="80"  多个按钮 :width="120" -->

      <!-- 操作按钮 -->
      <div class="padding-base">
        <ns-button type="text" @click="deleteClick">删除</ns-button>
        <ns-button type="text" @click="transClick">转移</ns-button>
        <ns-button type="text" @click="exportSelect">导出选中</ns-button>
        <ns-button type="text" @click="exportAll">导出所有</ns-button>
      </div>

      <el-table ref="table" :data="_data._table.data" class="template-table__main"
                stripe
                resizable v-loading.lock="_data._table.loadingtable" @selection-change="onHandleSelectChange"
                :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
        <el-table-column type="selection" align="center" :width="45"></el-table-column>

        <el-table-column :show-overflow-tooltip="true" type="default" prop="class_phrase"
                         label="内容" dbcolumn="class_phrase" column="class_phrase" align="left"
                         :sortable="false">
        </el-table-column>

        <el-table-column :show-overflow-tooltip="false" label="操作" align="center"
                         width="120">
          <template slot-scope="scope">
            <ns-table-column-operate-button :buttons="_data._table.table_buttons"
                                            :prop="scope">
            </ns-table-column-operate-button>
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
  import NsTableTeam from './src/NsTableTeam'

  export default NsTableTeam
</script>
