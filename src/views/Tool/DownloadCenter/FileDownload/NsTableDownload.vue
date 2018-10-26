<template>
  <ns-page-table @download = "$emit('download')">
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
      <el-form :model="quickSearchModel"  label-width="80px" :inline="true" @submit.native.prevent class="pull-right">
        <el-form-item label="文件名称："  prop = "fileName" >
          <el-form-grid>
            <el-input  type="text" v-model.trim = "model.fileName" placeholder="请输入文件名称">
            </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="创建人：" prop = "user_name" >
          <el-form-grid>
              <el-input  type="text" v-model.trim = "model.user_name"  placeholder="请输入创建人">
              </el-input>
          </el-form-grid>
        </el-form-item>
      <!--  <el-form-item label="生成状态：">
          <el-form-grid prop = "export_status" >
              <el-select v-model="model.export_status"
                         filterable  clearable
                         placeholder="请选择生成状态" :multiple="false">
                <el-option label="未生成"  value="0"></el-option>
                <el-option label="生成中"  value="1"></el-option>
                <el-option label="生成完成"  value="2"></el-option>
                <el-option label="生成失效"  value="-1"></el-option>
                <el-option label="文件不存在"  value="-2"></el-option>
                <el-option label="取消"  value="-3"></el-option>
              </el-select>
          </el-form-grid>
        </el-form-item>-->
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
      <el-table ref="table" :data="_data._table.data" class="template-table__main" stripe resizable
                v-loading.lock="_data._table.loadingtable"
                 :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
        <el-table-column  type = "default" prop = "alias_file_name" label = "文件名称" align = "left"
                         width="400" :sortable = "false">
          <template slot-scope="scope">
            <template v-if="!scope.row.alias_file_name && scope.row.alias_file_name != ''">
              -
            </template>
            <template v-else>
              {{scope.row.alias_file_name}}
            </template>
          </template>
        </el-table-column>
        <el-table-column  type = "default" prop = "user_name"
                         label = "创建人" align = "left" :sortable = "false">
          <template slot-scope="scope">
            <template v-if="!scope.row.user_name && scope.row.user_name == ''">
              -
            </template>
            <template v-else>
              {{scope.row.user_name}}
            </template>
          </template>
        </el-table-column>
        <el-table-column  type = "default" prop = "create_time" label = "创建时间"
                         align = "center" :sortable = "false">
          <template slot-scope="scope">
            <template v-if="!scope.row.create_time && scope.row.create_time != 0">
              -
            </template>
            <template v-else>
              {{scope.row.create_time}}
            </template>
          </template>
        </el-table-column>
        <!--<el-table-column  type = "default" prop = "create_time"
                         label = "文件生成时间" align = "center" width = "170":sortable = "false">
          <template slot-scope="scope">
            <template v-if="!scope.row.create_time && scope.row.create_time != 0">
              -
            </template>
            <template v-else>
              {{scope.row.create_time}}
            </template>
          </template>
        </el-table-column>-->
        <el-table-column  type = "default" prop = "result_state" label = "生成状态"
                         align = "center" :sortable = "false">
          <template slot-scope="scope">
            <template v-if="!scope.row.export_status && scope.row.export_status != 0">
              -
            </template>
            <template v-else>
              <span v-if='scope.row.export_status ==0' class="text-error">未生成</span>
              <span v-if='scope.row.export_status ==1' class="text-primary">生成中</span>
              <span v-if='scope.row.export_status ==2' class="text-success">生成完成</span>
              <span v-if='scope.row.export_status ==-1' class="text-error">生成失败</span>
              <span v-if='scope.row.export_status ==-2' class="text-error">文件不存在</span>
              <span v-if='scope.row.export_status ==-3' class="text-error">取消</span>
              <el-tooltip class="item" effect="light"  placement="right" v-if='scope.row.export_status ==-1'>
                <i class="el-icon-info el-tooltip"></i>
                <div slot="content">错误信息：{{scope.row.export_desc}}</div>
              </el-tooltip>
            </template>
          </template>
        </el-table-column>
        <el-table-column  type = "default" label = "操作"
                         align = "center" :sortable = "false">
          <template slot-scope="scope">
            <ns-table-column-operate-button :buttons="_data._table.table_buttons"
                                            :prop="scope"></ns-table-column-operate-button>
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
  import NsTableDownload from './src/NsTableDownload'

  export default NsTableDownload
</script>
