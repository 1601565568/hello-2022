<template>
  <ns-page-table @add="$emit('add')">
    <!-- 按钮 -->
    <template slot="buttons">
      <ns-table-operate-button :buttons="_data._table.operate_buttons">
      </ns-table-operate-button>
    </template>
    <!-- 按钮-结束 -->

    <!-- 表格 -->
    <template slot="table">
      <!-- 表格配置 不能添加 border 配置 -->
      <!-- 表格配置 需添加 stripe （实现斑马线效果） -->

      <!-- 表格单元格宽度配置规范 -->
      <!-- 复选框/单选框 :width="45" -->
      <!-- 日期 年月日 :width="100"   年月日时分秒 :width="150" -->
      <!-- 手机号 :width="120" -->
      <!-- 操作栏 单个按钮 :width="80"  多个按钮 :width="120" -->

      <el-table ref = "table" :data="gradeBenefitTypeList" class="template-table__main"
                stripe
                :element-loading-text="$t('prompt.loading')"
                resizable v-loading.lock="_data._table.loadingtable">
        <el-table-column :show-overflow-tooltip="true" type="default" prop="gradeBenefitName"
                         label="权益名称" :sortable="false" :width="200">
        </el-table-column>

        <el-table-column :show-overflow-tooltip="false" v-for="(list, $index) in gradeNameList" :key="$index" align="center"
                         :label="list.gradeName"  v-if="gradeRuleState === 1">
          <template slot-scope="scope">
            {{dataFormatter(scope.row, $index)}}
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" type="default"
                         label="是否启用">
          <template slot-scope="scope">
            <el-switch :active-value="1" :inactive-value="0"
                       v-model="scope.row.ruleState" prop="ruleState"
                       :before-change="(call,currVal)=>{onRuleStateChange(call,currVal,scope.row)}"
                       ></el-switch>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="操作" align="center"
                         width="160">
          <template slot-scope="scope">
            <ns-table-column-operate-button :buttons="_data._table.table_buttons"
                                            :prop="scope">
            </ns-table-column-operate-button>
          </template>
        </el-table-column>
    </el-table>
    </template>
    <!-- 表格-结束 -->
  </ns-page-table>
</template>

<script>
  import NsTableGradeBenefitSetting from './src/NsTableGradeBenefitSetting'

  export default NsTableGradeBenefitSetting
</script>
<style scoped>
  @import "../../../../style/small/variables.pcss";
  >>> .template-table__main{
    border-radius: var(--default-radius-mini);
  }
</style>
