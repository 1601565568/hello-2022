<template>
  <ns-page-table @add-user="$emit('add_user')" @update-user="$emit('update-user')">
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
      <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent class="pull-right">
        <el-form-item v-show="_data._queryConfig.expand === false">
          <el-input ref="quickText" v-model.trim="quickSearchModel.name" placeholder="请输入用户名(或姓名)" @keyup.enter.native="$quickSearchAction$('name')">
            <i class="el-icon-search el-input__icon" slot="suffix" name="name" @click="$quickSearchAction$('name')"></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <ns-button type="text" @click="$handleTabClick">
            {{collapseText}}
            <i :class="{'el-icon--right': true, 'el-icon-arrow-down': !_data._queryConfig.expand, 'el-icon-arrow-up': _data._queryConfig.expand} ">
            </i>
          </ns-button>
        </el-form-item>
      </el-form>
    </template>
    <!-- 简单搜索-结束 -->

    <!-- 高级搜索 -->
    <!-- el-form 需添加  @keyup.enter.native="onSearch" 配置，实现回车搜索， onSearch 为搜索方法 -->
    <template slot="advancedSearch" v-if="_data._queryConfig.expand">
      <el-form ref="table_filter_form" label-width="100px" @keyup.enter.native="onSearch" class="surround-btn"
               :model="model" :rules="rules" :inline="true">
        <el-form-item label="账号或姓名：">
          <el-form-grid size="xmd">
            <el-input  type="text" v-model.trim="model.name">
            </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="部门：" label-width="90px">
          <el-form-grid size="xmd">
            <ns-droptree v-model="model.department" :data="department" clearable></ns-droptree>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="角色：" label-width="90px">
          <el-form-grid>
            <el-select v-model="model.roleId"  clearable :placeholder="$t('prompt.select')">
              <el-option v-for="role in role" :key="role.value" :label="role.label" :value="role.value"></el-option>
            </el-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="启用状态：">
          <el-form-grid>
            <el-select  v-model="model.userStatus" filterable clearable
                          placeholder="" :multiple="false">
                <el-option label="启用" value="1">
                </el-option>
                <el-option label="未启用" value="0">
                </el-option>
              </el-select>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div class="template-table__more-btn">
        <ns-button type="primary" @click="$searchAction$()">{{$t('operating.search')}}</ns-button>
        <ns-button @click="$resetInputAction$()">{{$t('operating.reset')}}</ns-button>
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
                resizable v-loading.lock="_data._table.loadingtable" @selection-change="onHandleSelectChange"
               :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
        <el-table-column type="selection" align="center" :width="45">

        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="login_account"
                         label="用户名" dbcolumn="login_account" column="login_account" align="left"
                         :sortable="false">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="user_name"
                         label="姓名"  dbcolumn="user_name" column="user_name" align="left" :sortable="false">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="department_name"
                         label="部门" dbcolumn="department_name" column="department_name" align="left" :sortable="false">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="role_name"
                         label="角色" dbcolumn="role_name" column="role_name" align="left"
                         :sortable="false">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" label="启用状态"
                         align="center" :sortable="false" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.user_status"
              :active-value="1"
              :inactive-value="0" @change="changeStatus(scope.row)">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" label="操作" align="center"
                         width="100">
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
  import NsTableUserManage from './src/NsTableUserManage'

  export default NsTableUserManage
</script>
