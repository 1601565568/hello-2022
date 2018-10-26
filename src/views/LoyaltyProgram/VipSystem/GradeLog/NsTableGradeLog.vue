<template>
  <ns-page-table @edit="$emit('edit')" @batch-edit="$emit('batch-edit')">
    <!-- 按钮 -->
    <template slot="buttons">
      <ns-table-operate-button :buttons="_data._table.operate_buttons"></ns-table-operate-button>
    </template>

    <!-- 简单搜索 -->
    <template slot="searchSearch">
      <el-form :model="quickSearchModel" :inline="true" class="pull-right" @submit.native.prevent>
        <el-form-item v-show="_data._queryConfig.expand === false">
          <el-input ref="quickText" @keyup.enter.native="$quickSearchAction$('customerName')"
                    v-model.trim="model.customerName" placeholder="请输入客户姓名">
            <i class="el-icon-search el-input__icon" slot="suffix" @click="$quickSearchAction$('customerName')"></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <ns-button type="text" @click="$handleTabClick">
            {{collapseText}}<i
            :class="{'el-icon--right': true, 'el-icon-arrow-down': !_data._queryConfig.expand, 'el-icon-arrow-up': _data._queryConfig.expand} "></i>
          </ns-button>
        </el-form-item>
      </el-form>
    </template>


    <!-- 高级搜索 -->
    <template slot="advancedSearch" v-if="_data._queryConfig.expand">
            <el-form ref="table_filter_form" @keyup.enter.native="$searchAction$"  placement="right" label-width="90px" :model="model" :rules="rules"
                     :inline="true">
              <el-form-item label="变更类型：">
                <el-form-grid size="xmd">
                  <el-select v-model="model.type" clearable placeholder="">
                    <el-option label="升级" :value="1"></el-option>
                    <el-option label="降级" :value="2"></el-option>
                  </el-select>
                </el-form-grid>
              </el-form-item>
              <el-form-item label="客户姓名：">
                <el-form-grid size="xmd">
                  <el-input type="text" v-model.trim="model.customerName">
                  </el-input>
                </el-form-grid>
              </el-form-item>
              <el-form-item label="手机号：">
                <el-form-grid size="xmd">
                  <el-input type="text" v-model.trim="model.mobile">
                  </el-input>
                </el-form-grid>
              </el-form-item>
              <el-form-item label="会员卡号：">
                <el-form-grid size="xmd">
                  <el-input type="text" v-model.trim="model.memberCard">
                  </el-input>
                </el-form-grid>
              </el-form-item>
              <el-form-item label="原等级：">
                <el-form-grid size="xmd">
                  <el-select v-model="model.oldGrade" clearable placeholder="">
                    <el-option v-for="(option,index) in gradeData" :key="index" :label="option.label"
                               :value="option.value"></el-option>
                  </el-select>
                </el-form-grid>
              </el-form-item>
              <el-form-item label="新等级：">
                <el-form-grid size="xmd">
                  <el-select v-model="model.newGrade" clearable placeholder="">
                    <el-option v-for="(option,index) in gradeData" :key="index" :label="option.label"
                               :value="option.value"></el-option>
                  </el-select>
                </el-form-grid>
              </el-form-item>
              <el-form-item label="变更方式：">
                <el-form-grid size="xmd">
                  <el-select v-model="model.operateType" clearable placeholder="">
                    <el-option label="自动修改" :value="0"></el-option>
                    <el-option label="手动修改" :value="1"></el-option>
                  </el-select>
                </el-form-grid>
              </el-form-item>
              <el-form-item label="变更时间：">
                <el-form-grid size="xlg">
                  <ns-datetime v-model="model.changeRange" start-placeholder="" end-placeholder=""></ns-datetime>
                </el-form-grid>
              </el-form-item>
            </el-form>
            <div class="template-table__more-btn">
              <ns-button type="primary" @click="$searchAction$()">{{$t('operating.search')}}</ns-button>
              <ns-button @click="$resetInputAction$()">{{$t('operating.reset')}}</ns-button>
            </div>
    </template>
    <template slot="table">
      <!-- 表格 -->
    <el-table ref="table" :data="_data._table.data" class="template-table__main" stripe resizable
              v-loading.lock="_data._table.loadingtable"
              :element-loading-text="$t('prompt.loading')"
              @sort-change="$orderChange$">
      <el-table-column :show-overflow-tooltip="true"
                       type="default"
                       prop="type"
                       label="类型"
                       dbcolumn="type"
                       column="type"
                       align="center"
                       :sortable="false">
        <template slot-scope="{row}">
          <span v-if="row.oldGrade < row.newGrade" class="text-success">升级</span>
          <span v-if="row.oldGrade > row.newGrade" class="text-error">降级</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true"
                       type="default"
                       prop="customerName"
                       label="客户姓名"
                       dbcolumn="customerName"
                       column="customerName"
                       align="center"
                       :sortable="false">
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true"
                       type="default"
                       prop="mobile"
                       label="手机号"
                       dbcolumn="mobile"
                       column="mobile"
                       align="center"
                       :sortable="false">
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true"
                       type="default"
                       prop="memberCard"
                       label="会员卡号"
                       dbcolumn="memberCard"
                       column="memberCard"
                       align="left"
                       :sortable="false">
        <template slot-scope="{row}">
          {{row.memberCard ? row.memberCard : "-"}}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true"
                       type="default"
                       prop="oldGradeName"
                       label="原等级"
                       dbcolumn="oldGradeName"
                       column="oldGradeName"
                       align="center"
                       :sortable="false">
        <template slot-scope="{row}">
          {{row.oldGradeName ? row.oldGradeName : '店铺客户'}}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true"
                       type="default"
                       prop="newGradeName"
                       label="新等级"
                       dbcolumn="newGradeName"
                       column="newGradeName"
                       align="center"
                       :sortable="false">
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true"
                       type="default"
                       prop="operateType"
                       label="变更方式"
                       dbcolumn="operate_type"
                       column="operateType"
                       align="center"
                       :sortable="false">
        <template slot-scope="{row}">
          {{row.operateType === 0 ? "自动修改" : "手动修改"}}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true"
                       type="default"
                       prop="modifyTime"
                       label="变更时间"
                       dbcolumn="modifyTime"
                       column="modifyTime"
                       align="center"
                       width="160"
                       :sortable="false">
      </el-table-column>
    </el-table>
    </template>
    <template slot="pagination">
      <!-- 分页 -->
    <el-pagination v-if="_data._pagination.enable" class="template-table__pagination"
                   :page-sizes="_data._pagination.sizeOpts"
                   :total="_data._pagination.total"
                   :current-page="_data._pagination.page"
                   :page-size="_data._pagination.size"
                   layout="total, sizes, prev, pager, next, jumper"
                   @size-change="$sizeChange$"
                   @current-change="$pageChange$">
    </el-pagination>
    </template>
  </ns-page-table>
</template>

<script>
  import NsTableGradeLog from './src/NsTableGradeLog'
  import NsDatetime from 'components/NsDatetime'

  NsTableGradeLog.components = {
    NsDatetime
  }
  export default NsTableGradeLog
</script>
