<template>
  <ns-page-table @open-dialog="$emit('open-dialog', 'add', '新增通道标识')" :colButton="4">
    <!-- 按钮 -->
    <template slot="buttons">
      <ns-table-operate-button :buttons="_data._table.operate_buttons"></ns-table-operate-button>
    </template>
    <!-- 按钮-结束 -->

    <!-- 简单搜索 -->
    <!-- el-form 需添加 @submit.native.prevent 配置 -->
    <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
    <template slot="searchSearch">

      <el-form ref="table_filter_form" :model="model" :inline="true" @submit.native.prevent class="pull-right">
        <el-form-item label="通道名称：">
          <el-input  v-model.trim="model.sp_name" placeholder="请输入通道名称">
          </el-input>
        </el-form-item>
        <el-form-item label="通道标识：">
          <el-form-grid>
              <el-input type="text" v-model.trim="model.channel_code" placeholder="请输入通道标识">
              </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="触达方式：" >
          <el-form-grid>
              <el-select v-model="model.channel_type" filterable  clearable :placeholder="$t('prompt.select')" :multiple="false">
                <el-option label="不限"  :value="0"></el-option>
                <el-option label="短信"  :value="1"></el-option>
                <el-option label="邮件"  :value="2"></el-option>
              </el-select>
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
    <!--<template slot="advancedSearch" v-if="_data._queryConfig.expand">
      <el-form ref="table_filter_form" label-width="80px" @keyup.enter.native="onSearch" class="surround-btn"
               :model="model" :rules="rules" :inline="true">
      </el-form>
      <div class="template-table__more-btn">
        <ns-button type="primary" @click="$searchAction$()">{{$t('operating.search')}}</ns-button>
        <ns-button @click="$resetInputAction$()">{{$t('operating.reset')}}</ns-button>
      </div>
    </template>-->
    <!-- 高级搜索-结束 -->

    <!-- 表格 -->
    <template slot="table">

      <!-- 表格 -->
      <el-table ref="table" :data="_data._table.data" class="template-table__main" stripe resizable
                v-loading.lock="_data._table.loadingtable"
                :element-loading-text="$t('prompt.loading')"
                @sort-change = "$orderChange$">
        <el-table-column :show-overflow-tooltip="true" type = "default" prop = "sp_name"
                         label = "通道名称" dbcolumn = "sp_name" column = "sp_name"
                         align = "left" :sortable = "false">
          <template slot-scope="scope">
            <template v-if="!scope.row.sp_name && scope.row.sp_name != 0">
              -
            </template>
            <template v-else>
              {{scope.row.sp_name}}
            </template>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type = "default" prop = "ys_account"
                         label = "通道账号" dbcolumn = "ys_account" column = "ys_account"
                         align = "left" :sortable = "false">
          <template slot-scope="scope">
            <template v-if="!scope.row.ys_account && scope.row.ys_account != 0">
              -
            </template>
            <template v-else>
              {{scope.row.ys_account}}
            </template>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type = "default" prop = "channel_type"
                         label = "触达方式" dbcolumn = "channel_type" column = "channel_type"
                         align = "center" :sortable = "false">
          <template slot-scope="scope">
            <template v-if="!scope.row.channel_type && scope.row.channel_type != 0">
              -
            </template>
            <template v-else>
              <span v-if='scope.row.channel_type == 1'>短信</span>
              <span v-if='scope.row.channel_type == 2'>邮件</span>
              <span v-if='scope.row.channel_type == 3'>彩信</span>
              <span v-if='scope.row.channel_type == 4'>超短信</span>
            </template>
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" type = "default" prop = "channel_code"
                         label = "通道标识" dbcolumn = "channel_code"
                         column = "channel_code" align = "left" :sortable = "false">
          <template slot-scope="scope">
            <template v-if="!scope.row.channel_code && scope.row.channel_code != 0">
              -
            </template>
            <template v-else>
              {{scope.row.channel_code}}
            </template>
          </template>
        </el-table-column>
       <el-table-column :show-overflow-tooltip="true" type = "default" prop = "send_mode"
                         label = "使用场景" dbcolumn = "send_mode"
                         column = "send_mode" align = "center" :sortable = "false">
          <template slot-scope="scope">
            <template v-if="!scope.row.send_mode && scope.row.send_mode != 0">
              -
            </template>
            <template v-else>
              <div v-if='scope.row.send_mode === 0'>不限</div>
              <div v-if='scope.row.send_mode === 1'>触达</div>
              <div v-if='scope.row.send_mode === 2'>营销</div>
            </template>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type = "default" prop = "is_default"
                         label = "默认" dbcolumn = "sp_name" column = "is_default"
                         align = "center" :sortable = "false" width="80px">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_default"  :active-value="1" :inactive-value="0"
                       :before-change="(call,currVal)=>{ onDefaultChange(call,currVal,scope.row) }">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type = "default" prop = "state"
                         label = "状态" dbcolumn = "state" column = "state" align = "center"
                         width = "80px" :sortable = "false">
          <template slot-scope="scope">
            <template v-if="scope.row.state === 1">
              <span class="dot-success">正常</span>
            </template>
            <template v-else>
              <span class="dot-danger ">停用</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="操作" align="center" width="120px">
          <template slot-scope="scope">
            <ns-table-column-operate-button :buttons="_data._table.table_buttons" :prop="scope"></ns-table-column-operate-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 表格-结束 -->

    <!-- 分页 -->
    <template slot="pagination">
      <!-- 分页 -->
      <el-pagination v-if="_data._pagination.enable" class="template-table-pagination"
                     :page-sizes = "_data._pagination.sizeOpts"
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
  import NsYsChannel from './src/NsYsChannel'
  export default NsYsChannel
</script>
