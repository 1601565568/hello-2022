<template>
  <ns-page-table>
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
          <el-input ref="quickText" v-model="quickSearchModel.customerName" placeholder="请输入姓名" @keyup.enter.native="$quickSearchAction$('customerName')">
            <i class="el-icon-search el-input__icon" slot="suffix" name="name" @click="$quickSearchAction$('customerName')"></i>
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
        <el-form-item label="积分来源：">
          <el-form-grid size="xmd">
            <el-select v-model="model.integralSource" placeholder="" @change="change">
              <el-option
                v-for="item in sourceOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="积分类型：">
          <el-form-grid size="xmd">
            <el-select v-model="model.integralType" placeholder="">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="姓名：" prop="customerName">
          <el-form-grid size="xmd">
            <el-input  type="text" v-model="model.customerName">
            </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="手机号：" prop="mobile">
          <el-form-grid size="xmd">
            <el-input  type="text" v-model="model.mobile">
            </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="会员卡号：" prop="memberCard">
          <el-form-grid size="xmd">
            <el-input  type="text" v-model="model.memberCard">
            </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="积分加减：" prop="type">
          <el-form-grid size="xmd">
            <el-select  v-model="model.operation" filterable clearable placeholder=""
                        :multiple="false">
              <el-option label="加积分" value="1"></el-option>
              <el-option label="减积分" value="2"></el-option>
            </el-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="变更时间：" class="el-inline-block" prop="time">
          <el-form-grid>
            <ns-datetime startPlaceholder="" endPlaceholder="" v-model="model.time"></ns-datetime>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div class="template-table__more-btn">
        <ns-button type="primary" @click="$searchAction$()">{{$t('operating.search')}}</ns-button>
        <ns-button @click="resetInputAction()">{{$t('operating.reset')}}</ns-button>
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
        <el-table-column :show-overflow-tooltip="true" type="default" prop="name"
                         label="加减积分" :sortable="false" align="right" width="130">
          <template slot-scope="scope">
            <template v-if="scope.row.operation == 1">
              +{{scope.row.integral}}
            </template>
            <template v-else> -{{scope.row.integral}}</template>
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" type="default" prop="time"
                         label="变更时间" :sortable="false" align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.integral_create_time">
              {{scope.row.integral_create_time}}
            </template>
            <template v-else>
              -
            </template>
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" type="default" prop="customerName"
                         label="客户姓名" :sortable="false"  align="left">
          <template slot-scope="scope">
            <template v-if="scope.row.customerName">
              {{scope.row.customerName}}
            </template>
            <template v-else>
              -
            </template>
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" type="default" prop="mobile"
                         label="手机号" :sortable="false"  align="left" width = "120">
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" type="default" prop="member_card"
                         label="会员卡号" :sortable="false"  align="left" width = "120">
          <template slot-scope="scope">
            <template v-if="scope.row.member_card">
              {{scope.row.member_card}}
            </template>
            <template v-else>
              -
            </template>
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" type="default" prop="integralTypeName"
                         label="积分类型" :sortable="false"  align="center" width = "200">
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
  import NsTableIntegral from './src/NsTableIntegral'

  export default NsTableIntegral
</script>
