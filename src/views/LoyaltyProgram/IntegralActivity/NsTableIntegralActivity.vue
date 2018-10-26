<template>
  <ns-page-table @update-activity="$emit('update-activity')" @add-activity="$emit('add-activity')">
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
          <el-input ref="quickText" v-model="quickSearchModel.activityName" placeholder="请输入活动名称" @keyup.enter.native="$quickSearchAction$('activityName')">
            <i class="el-icon-search el-input__icon" slot="suffix" name="name" @click="$quickSearchAction$('activityName')"></i>
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
    <!-- el-form 需添加  surround-btn 类名 配置环绕按钮效果 -->
    <template slot="advancedSearch" v-if="_data._queryConfig.expand">
      <el-form ref="table_filter_form" label-width="80px" @keyup.enter.native="onSearch" class="surround-btn"
               :model="model" :rules="rules" :inline="true">
        <el-form-item label="活动名称：" prop="activityName">
          <el-form-grid size="xmd">
            <el-input  type="text" v-model="model.activityName">
            </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="目标人群：" prop="type">
          <el-form-grid size="xmd">
            <el-select  v-model="model.isAllCrowd" filterable clearable placeholder=""
                        :multiple="false">
              <el-option label="所有人" value="1"></el-option>
              <el-option label="定向人群" value="0"></el-option>
            </el-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="起止时间：" class="el-inline-block">
          <el-form-grid>
            <ns-datetime startPlaceholder="" endPlaceholder="" v-model="model.time"></ns-datetime>
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
                resizable v-loading.lock="_data._table.loadingtable"
                :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">

        <el-table-column :show-overflow-tooltip="true" type="default" prop="integral_activities_name"
                         label="活动名称" dbcolumn="integral_activities_name" column="integral_activities_name" align="left"
                         :sortable="false" width="200">
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" type="default" prop="start_time"
                         label="有效时间" dbcolumn="start_time" column="start_time" align="center" :sortable="false">
          <template slot-scope="scope">
            <p>{{scope.row.start_time}}</p>
            <p>{{scope.row.end_time}}</p>
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" type="default" prop="is_all_crowd"
                         label="活动类型"  dbcolumn="is_all_crowd" column="is_all_crowd" align="center" :sortable="false">
          <template slot-scope="scope">
            <template v-if="scope.row.integral_activities_type == 0">
              交易送积分
            </template>
            <template v-else-if="scope.row.integral_activities_type == 1">
              互动赚积分
            </template>
            <template v-else>
              互动花积分
            </template>
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" type="default" prop="is_all_crowd"
                         label="目标人群"  dbcolumn="is_all_crowd" column="is_all_crowd" align="center" :sortable="false">
          <template slot-scope="scope">
             {{scope.row.is_all_crowd == 1? '所有人': '定向人群'}}
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" type="default" prop="integral_activities_rule"
                         label="活动规则" dbcolumn="integral_activities_rule" column="integral_activities_rule" align="left"
                         :sortable="false" width="300">
          <template slot-scope="scope">
            <template v-for="(rule, index) of scope.row.conditionDetail">
              <template v-if="index >0 ">且 </template>{{rule}}<br>
            </template>
          </template>
        </el-table-column>


        <el-table-column :show-overflow-tooltip="true" type="default" label="启用状态"
                         align="center" :sortable="false" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.integral_activities_stauts"
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
  import NsTableIntegralActivity from './src/NsTableIntegralActivity'

  export default NsTableIntegralActivity
</script>
