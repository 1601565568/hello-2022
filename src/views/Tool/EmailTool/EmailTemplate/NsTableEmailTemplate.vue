<template>
  <ns-page-table  @email-add="$emit('email-add')">
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
      <el-form :model="quickSearchModel" label-width="80px" :inline="true" @submit.native.prevent class="pull-right">
        <el-form-item label="模板标题：">
          <el-form-grid>
            <el-form-item prop = "templateTitle" >
              <el-input type="text" v-model.trim = "model.templateTitle" placeholder="请输入模板标题">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <!--页面特殊，部分模板不需要在这边显示-->
        <el-form-item label="模板类型：">
          <el-form-grid>
            <el-form-item prop = "templateType" >
              <ns-select  placeholder="请选择模板类型" v-model="model.templateType" class="el-select" clearable :multiple="false" :url="$api.touch.emailTemplate.queryEmailTemplateType">
              </ns-select>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item>
          <ns-button type="primary" @click="$searchAction$()">{{$t('operating.search')}}</ns-button>
          <ns-button @click="$resetInputAction$()">{{$t('operating.reset')}}</ns-button>
        </el-form-item>
      </el-form>
    </template>
    <!-- 简单搜索-结束 -->

    <!-- 高级搜索 -->
    <!-- el-form 需添加  @keyup.enter.native="onSearch" 配置，实现回车搜索， onSearch 为搜索方法 -->
    <!-- el-form 需添加  surround-btn 类名 配置环绕按钮效果 -->

    <!-- 高级搜索-结束 -->

    <!-- 表格 -->
    <template slot="table">
      <el-table ref="table" :data="_data._table.data" class="template-table__main"
                stripe @selection-change="onHandleSelectChange"
                resizable v-loading.lock="_data._table.loadingtable"
               :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
        <!--<el-table-column type="selection" align="center" :width="45"></el-table-column>-->
        <el-table-column  type = "default" prop = "template_title" label = "模板标题"
                         align = "left" :sortable = "false" width="450">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="false" type = "default" prop = "template_type" label = "模板类型"
                         align = "left" :sortable = "false">
          <template slot-scope="scope">
            <span v-if='scope.row.template_type ==1'>营销模板</span>
            <span v-if='scope.row.template_type ==2'>下单关怀模板</span>
            <span v-if='scope.row.template_type ==3'>催付模板</span>
            <span v-if='scope.row.template_type ==4'>付款关怀模板</span>
            <span v-if='scope.row.template_type ==5'>发货提醒模板</span>
            <span v-if='scope.row.template_type ==6'>物流跟踪模板</span>
            <span v-if='scope.row.template_type ==7'>签收关怀模板</span>
            <span v-if='scope.row.template_type ==8'>确认关怀模板</span>
            <span v-if='scope.row.template_type ==10'>退款关怀模板</span>
            <span v-if='scope.row.template_type ==13'>积分触发模板</span>
            <span v-if='scope.row.template_type ==14'>升级提醒模板</span>
            <span v-if='scope.row.template_type ==15'>生日祝福模板</span>
            <span v-if='scope.row.template_type ==16'>节日关怀模板</span>
            <span v-if='scope.row.template_type ==18'>入会关怀模板</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="false" type="default" prop="user_name" label="创建人"
                         align="left" :sortable="false" width="100px">
          <template slot-scope="scope">
            <template v-if="scope.row.user_name != '' && scope.row.user_name != null">
              {{scope.row.user_name}}
            </template>
            <template v-else>
              -
            </template>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="false" type="default" prop="create_time" label="创建时间"
                         align="center" width="150px" :sortable="false">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="false" label="操作" align="center" width="100">
          <template slot-scope="scope">
            <ns-table-column-operate-button :buttons="_data._table.table_buttons" :prop="scope"></ns-table-column-operate-button>
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
  import NsTableEmailTemplate from './src/NsTableEmailTemplate'

  export default NsTableEmailTemplate
</script>
