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
  guideUrl: (:guideUrl="this.$api.guide.moreAccount.findList")查询导购列表的请求地址，不设置则默认查询sg_guide表。 后台请用GuidePageVo承接查询条件，
  validNull：(:validNull="true")true必须选择一个员工 false可以不选择员工 默认false
  v-model：接收值设置v-model="employeeSelectData"
  3.vue的data加入参数：
  employeeSelectData: [] //选中的值,如:[1,2,3,4]
  4.appendToBody
  dialog框是否直接添加到body下解决样式污染
-->
<template>
  <div>
    <div :class="[isChooseC==='QA'?chooseQA:choose]" v-if="!isButton" :type="type" @click="onDialogOpen()">
      <template v-if="selfBtn">
        <!-- 需要接口返回后才展示点击按钮 start -->
        <template v-if='isOpenDialogAfterRequest'>
          <template v-if='requestLoaded'>
            <slot name='selfBtn'></slot>
          </template>
          <template v-else>
            <ns-button type='text' :loading='true' style='margin-right:10px'>加载中</ns-button>
          </template>
        </template>
        <!-- 需要接口返回后才展示点击按钮 end -->
        <!-- 老版逻辑直接显示点击按钮 start -->
        <template v-else>
          <slot name='selfBtn'></slot>
        </template>
        <!-- 老版逻辑直接显示点击按钮 start -->
      </template>
      <template v-else>
       <Icon v-if="type === 'text'" type="plus"/>{{btnTitle}}
      </template>
    </div>
    <NsButton v-if="isButton" :type="type" @click="onDialogOpen()">
      <Icon v-if="type === 'text'" type="plus"/>{{btnTitle}}
    </NsButton>
    <el-dialog :title="dialogTitle" :visible.sync="visible" :show-scroll-x="false"

               :close-on-click-modal = "false" :before-close="onDialogClose" width="1100px" :modal-append-to-body='appendToBody' :append-to-body='appendToBody'><!-- 按员工设置使用范围时，所选员工会优先选择使用该条欢迎语而非归属门店设置的欢迎语 -->
      <div slot="title">
        {{dialogTitle}}
        <el-tooltip  v-if='showTitleTip' content="按员工设置使用范围时，所选员工会优先选择使用该条欢迎语而非归属门店设置的欢迎语">
          <Icon type="question-circle"></Icon>
        </el-tooltip>
      </div>
      <div>
        <el-form >
          <el-form-item>
            <el-form-grid><div style="margin-left: 20px;">工作门店：</div></el-form-grid>
            <el-form-grid >
              <ns-droptree ref="shopCateTree" :loading="loading" placeholder="请选择区域" :lazy="true" :load="loadShopAreaNode" :multiple="false" v-model="departData.shopArea" :clearable='false' :defaultExpandAll='true'></ns-droptree>
            </el-form-grid>
            <el-form-grid style="margin-left:10px">
              <el-select-load v-model="departData.shopId" :options="shopOptions"  filterable clearable :page-sizes="20" placeholder="选择门店">
              </el-select-load>
            </el-form-grid>
            <el-form-grid><div style="margin-left: 10px;">选择部门：</div></el-form-grid>
            <el-form-grid>
              <ns-droptree ref="employeeDepartTree" :defaultExpandAll='true' :lazy="true" :load="loadNode" :multiple="false" v-model="departData.selectedDepart" clearable></ns-droptree>
            </el-form-grid>
            <el-form-grid><div style="margin-left: 10px;">员工类型：</div></el-form-grid>
            <el-form-grid>
              <el-select style="width:100px" v-model="departData.job" clearable >
                <el-option label="全部" :value=null></el-option>
                <el-option label="店长" :value="1"></el-option>
                <el-option label="导购" :value="0"></el-option>
              </el-select>
            </el-form-grid>
          </el-form-item>
          <el-form-item>
            <el-form-grid><div style="margin-left: 20px;">员工姓名：</div></el-form-grid>
            <el-form-grid>
              <ElInput :maxlength="20" v-model="departData.name"/>
            </el-form-grid>
            <el-form-grid><div style="margin-left: 10px;">手机号：</div></el-form-grid>
            <el-form-grid>
              <ElInput :maxlength="20" v-model="departData.mobile"/>
            </el-form-grid>
            <el-form-grid><div style="margin-left: 10px;">导入员工：</div></el-form-grid>
            <el-form-grid>
              <div class="template-search__box" >
                <span>
                  已导入{{successCount}}个员工
                </span>
                <div style="float: right;" :class="[isChooseC==='QA'? chooseQA :choose]"><NsImportDialog ref="import" @acceptImport="acceptImport" :isButton="false" :validNull="true" :auth="false" type="primary" dialogTitle="导入员工"></NsImportDialog></div>
              </div>
            </el-form-grid>
            <el-form-grid><div style="margin-left: 10px;"></div></el-form-grid>
            <el-form-grid>
              <ns-button type="primary" @click="searchEmployee(1)">{{$t('operating.search')}}</ns-button>
              <ns-button @click="resetSearch">{{$t('operating.reset')}}</ns-button>
              <ns-button @click="onSelectAllData">全部选择</ns-button>
            </el-form-grid>
          </el-form-item>
        </el-form>
        <div>
          <!-- <el-row :gutter="24"> -->
            <el-col :span="12">
              <ElTable v-loading="tableLoading" ref="employeeTable" :data="employeeData" height="260" @select="selectChange" @select-all="selectAllChange">
                <ElTableColumn  type="selection" width="55"></ElTableColumn>
                <ElTableColumn :show-overflow-tooltip="true" type="default" prop="name" label="员工姓名" align="left"/>
                <ElTableColumn :show-overflow-tooltip="true" type="default" prop="shopNames" label="工作门店" align="left"/>
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
                <ElTableColumn :show-overflow-tooltip="true" type="default" prop="name" :label="'已选' + selectedData.length + '个员工'" align="left">
                </ElTableColumn>
                <ElTableColumn  prop="select" align="right" width="100" >
                  <template slot="header">
                    <span @click="clearSelection" style='text-align:right'>清空</span>
                  </template>
                  <template slot-scope="scope">
                    <ns-button
                      :disabled="auth && scope.row.auth"
                      type="text"
                      size="mini"
                      @click="() => removeEmp(scope)">
                      <Icon type="delete" className="code-delete"/>
                    </ns-button>
                  </template>
                </ElTableColumn>
              </ElTable>
            </el-col>
          <!-- </el-row> -->
        </div>
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
import NsDroptree from '../NsDroptree'
import ElSelectLoad from '@nascent/nui/lib/select-load'
import NsImportDialog from '../NsImportDialog/index'
index.components = {
  NsDroptree,
  ElSelectLoad,
  NsImportDialog
}
export default index
</script>

<style scoped>
  @import "@theme/variables.pcss";
  .template-search__chooes{
    cursor: pointer;
    min-width: 40px;/* width改成min-width 有问题找文秀或梦芹 */
    font-size: 12px;
    color: #0392FB;
    text-align: center;
  }
  .template-search__chooesQA {
    cursor: pointer;
    min-width: 40px;/* width改成min-width 有问题找文秀或梦芹 */
    font-size: 12px;
    text-align: center;
    color: #2153D4;
  }
  .template-search__chooesQA >>>.btn-import{
    cursor: pointer;
    min-width: 40px;
    font-size: 12px;
    color: #2153D4;
    text-align: center;
  }
   .template-search__chooesQA >>>.el-checkbox__input.is-checked .el-checkbox__inner{
      color: #2153D4;
   }
  .template-search__box {
    width: 182px;
    height: 28px;
    background: #FFFFFF;
    border: 1px solid #DCDFE6;
    border-radius: 3px;
    border-radius: 3px;;
    display: flex;
  span{
    width: 141px;
    height: 27px;
    margin-left: 10px;
    border-right: 1px solid #DCDFE6;;
  }
  > div + span {
    margin-left: var(--default-margin-small);
  }
  }
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
</style>
