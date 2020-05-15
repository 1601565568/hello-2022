<!-- 员工左右选择组建：
  zhimin.Mo 2020-05-15 15:45:00
  使用方式：
  1.html页面引入插件
    <script>
    import edit from 'index.js'
    import NsEmployeeOrCustGroupDialog from '路径/components/NsGuideDialog'
    index.components = {
      NsEmployeeOrCustGroupDialog
    }
    export default index
    </script>
  2.页面内引入标签
  <NsEmployeeOrCustGroupDialog btnTitle="+选择营销人群" v-model="employeeSelectData"></NsEmployeeOrCustGroupDialog>
  配置参数：
  不配置则默认两种情况可选
  btnTitle：配置按钮文本
  dialogTitle：配置弹框标题
  validNull：true必须选择一个员工 false可以不选择员工 默认false
  v-model：接收值设置v-model="employeeSelectData"
  3.vue的data加入参数：
  employeeSelectData: [] //选中的值,如:[1,2,3,4]
-->
<template>
  <div>
    <NsButton type="text" @click="onDialogOpen()"><Icon type="plus"/>{{btnTitle}}</NsButton>
    <el-dialog :title="dialogTitle" :visible.sync="visible" :show-scroll-x="false"
               :close-on-click-modal = "false" :before-close="onDialogClose" width="700px">
      <div>
        <el-form>
          <el-form-item>
            <el-form-grid><div style="margin-left: 20px;">选择部门：</div></el-form-grid>
            <el-form-grid>
              <ns-droptree ref="employeeDepartTree" :lazy="true" :load="loadNode" :multiple="false" v-model="departData.selectedDepart" clearable></ns-droptree>
            </el-form-grid>
            <el-form-grid><div style="margin-left: 20px;">员工姓名：</div></el-form-grid>
            <el-form-grid>
              <ElInput :maxlength="20" v-model="departData.name"/>
            </el-form-grid>
            <el-form-grid><div style="margin-left: 10px;"></div></el-form-grid>
            <el-form-grid>
              <ns-button type="primary" @click="searchEmployee(1)">{{$t('operating.search')}}</ns-button>
              <ns-button @click="resetSearch">{{$t('operating.reset')}}</ns-button>
            </el-form-grid>
          </el-form-item>
        </el-form>
        <el-row :gutter="24">
          <el-col :span="12">
            <ElTable v-loading="tableLoading" ref="employeeTable" :data="employeeData" height="260" @select="selectChange" @select-all="selectAllChange">
              <ElTableColumn type="selection" width="55" />
              <ElTableColumn :show-overflow-tooltip="true" type="default" prop="name" label="员工姓名" align="left"/>
              <ElTableColumn :show-overflow-tooltip="true" type="default" prop="departName" label="所属部门" align="left"/>
            </ElTable>
            <el-pagination v-if="_data.pagination4Emp.enable" class="template-table__pagination"
                           :page-sizes="_data.pagination4Emp.sizeOpts" :total="_data.pagination4Emp.total"
                           :current-page="_data.pagination4Emp.page" :page-size="_data.pagination4Emp.size"
                           :layout="true? 'total, sizes, prev, pager, next':'total'" @size-change="$sizeChange$"
                           @current-change="searchEmployee">
            </el-pagination>
          </el-col>
          <el-col :span="12">
            <ElTable :data="selectedData" height="260">
              <ElTableColumn :show-overflow-tooltip="true" type="default" prop="name" label="已选员工" align="left"/>
              <ElTableColumn  prop="select" align="center" width="55" >
                <template slot-scope="scope">
                  <ns-button
                    type="text"
                    size="mini"
                    @click="() => removeEmp(scope)">
                    <Icon type="delete" className="code-delete"/>
                  </ns-button>
                </template>
              </ElTableColumn>
            </ElTable>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onDialogClose()">{{$t('operating.cancel')}}</ns-button>
        <ns-save @loading="tableLoading" @click="onSave()"></ns-save>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import index from './src/index.js'
import NsDroptree from '@nascent/ecrp-ecrm/src/components/NsDroptree'
index.components = {
  NsDroptree
}
export default index
</script>

<style scoped>
  @import "@theme/variables.pcss";

  @component-namespace code {
    @b container {
      padding: 0 var(--default-padding-small);
      @e item {
        >>> .el-scrollbar__wrap {
          height: 200px;
        }
      }
    }
    @b title {
      font-weight: bold;
      line-height: 30px;
      background: var(--theme-bg-color-base);
      padding: 0 8px;
      border-radius: var(--default-radius-mini);
    }
    @b delete {
      margin-left: var(--default-margin-small);
    }
    @b space {
      margin-top: var(--default-margin-base);
    }
    @b detail {
      display: flex;
      align-items: center;
      @e text {
        max-width: 188px;
        margin-right: var(--default-margin-small);
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
</style>
