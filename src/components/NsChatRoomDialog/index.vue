<!-- 员工选择左右联动组建：
  zhimin.Mo 2020-05-15 15:45:00
  使用方式：
  1.html页面引入插件
    <script>
    import edit from 'index.js'
    import NsGuideDialog from '路径/components/NsGuideDialog'
    index.components = {
      NsGuideDialog
    }
    export default index
    </script>
  2.页面内引入标签
  <NsGuideDialog btnTitle="+选择营销人群" v-model="employeeSelectData"></NsGuideDialog>
  配置参数(不配置则默认)：
  btnTitle：(btnTitle="+选择营销人群")配置按钮文本
  dialogTitle：(btnTitle="选择员工")配置弹框标题
  guideUrl: (:guideUrl=$api.guide.moreAccount.findList)查询导购列表的请求地址，不设置则默认查询sg_guide表。 后台请用GuidePageVo承接查询条件，
  validNull：(:validNull="true")true必须选择一个员工 false可以不选择员工 默认false
  v-model：接收值设置v-model="employeeSelectData"
  3.vue的data加入参数：
  employeeSelectData: [] //选中的值,如:[1,2,3,4]
-->
<template>
  <div>
    <NsButton :type="type" @click="onDialogOpen()"><Icon v-if="type === 'text'" type="plus"/>{{btnTitle}}</NsButton>
    <el-dialog :title="dialogTitle" :visible.sync="visible" :show-scroll-x="false"
               :close-on-click-modal = "false" :before-close="onDialogClose" width="940px"><!-- 按员工设置使用范围时，所选员工会优先选择使用该条欢迎语而非归属门店设置的欢迎语 -->
      <div slot="title">
        {{dialogTitle}}
      </div>
      <div>
        <div class="el-form__group">
          <el-form label-width="80px" :inline="true">
            <el-form-item label="群名称：">
              <ElInput :maxlength="20" placeholder="请输入群名称" v-model="departData.name"/>
            </el-form-item>
            <el-form-item label="工作门店：">
              <el-form-grid >
                <ns-droptree ref="shopCateTree" placeholder="请选择门店分类" :lazy="true" :load="loadShopCateNode"  :multiple="false" v-model="departData.shopCate" clearable></ns-droptree>
              </el-form-grid>
              <el-form-grid style="margin-left: 5px">
                <el-select-load v-model="departData.shopId" :options="shopOptions"  filterable clearable :page-sizes="20" placeholder="请选择门店">
                </el-select-load>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="群主部门：">
              <ns-droptree ref="employeeDepartTree" :lazy="true" :load="loadNode" :multiple="false" v-model="departData.selectedDepart" clearable></ns-droptree>
            </el-form-item>
            <el-form-item label="群主：">
              <ElInput :maxlength="20"  placeholder="请输入群主姓名" v-model="departData.ownerName"/>
            </el-form-item>
            <div class="el-form__btns">
              <ns-button type="primary" @click="getChatRoomList(1)">{{$t('operating.search')}}</ns-button>
              <ns-button @click="resetSearch">{{$t('operating.reset')}}</ns-button>
            </div>
          </el-form>
        </div>
        <el-row :gutter="24">
          <el-col :span="12">
            <ElTable v-loading="tableLoading" ref="employeeTable" :data="employeeData" height="260" @select="selectChange" @select-all="selectChange">
              <ElTableColumn type="selection" width="55"></ElTableColumn>
              <ElTableColumn :show-overflow-tooltip="true" type="default" prop="name" label="群名称" align="left"/>
              <ElTableColumn :show-overflow-tooltip="true" type="default"  label="群主" align="left">
                <template slot-scope="scope">
                  {{ scope.row.owner_name}}({{scope.row.owner_work_num }})
                </template>
              </ElTableColumn>
              <ElTableColumn :show-overflow-tooltip="true" type="default" prop="person_num" label="群成员" align="left"/>
              <ElTableColumn :show-overflow-tooltip="true" type="default" prop="workShopName" label="群主工作门店" align="left"/>
            </ElTable>
            <el-pagination v-if="_data.pagination4Emp.enable" class="template-table__pagination"
                           :page-sizes="_data.pagination4Emp.sizeOpts" :total="_data.pagination4Emp.total"
                           :current-page="_data.pagination4Emp.page" :page-size="_data.pagination4Emp.size"
                           :layout="true? 'total, sizes, prev, pager, next':'total'" @size-change="$sizeChange$"
                           @current-change="getChatRoomList">
            </el-pagination>
          </el-col>
          <el-col :span="12">
            <ElTable :data="selectedData" height="260">
              <ElTableColumn :show-overflow-tooltip="true" type="default" prop="name" :label="'已选' + selectedData.length + '个群'" align="left"/>
              <ElTableColumn :show-overflow-tooltip="true" type="default"  align="left">
                <template slot-scope="scope">
                  {{ scope.row.ownerName}}({{scope.row.ownerWorkNum }})
                </template>
              </ElTableColumn>
              <ElTableColumn :show-overflow-tooltip="true" type="default" prop="personNum"  align="left"/>
              <ElTableColumn :show-overflow-tooltip="true" type="default" prop="workShopName"  align="left"/>
              <ElTableColumn  prop="select" align="center" width="55" >
                <template slot-scope="scope">
                  <ns-button
                    :disabled="auth && scope.row.auth"
                    type="text"
                    size="mini"
                    @click="() => removeSelect(scope)"
                    class="el-table__btn--font"
                  >
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
import ElSelectLoad from '@nascent/nui/lib/select-load'
index.components = {
  NsDroptree,
  ElSelectLoad
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

  >>> .el-table th.el-table-column--selection>.cell {
    padding: 0 14px;
  }

  .el-form__group {
    position: relative;
    margin-top: 6px;
    padding-right: 230px;
    padding-bottom: 10px;
  }
  .el-form__btns {
    position: absolute;
    top: 0;
    right: 0;
  }
  .el-table__btn--font {
    padding: 0 8px;
    line-height: 1;
  }
</style>
