<!-- 店铺选择左右联动组建：
  zhimin.Mo 2020-06-12 09:56:00
  使用方式：
  1.html页面引入插件
    <script>
    import edit from 'index.js'
    import NsShopDialog from '路径/components/NsShopDialog'
    index.components = {
      NsShopDialog
    }
    export default index
    </script>
  2.页面内引入标签
  <NsShopDialog btnTitle="+选择适用门店" v-model="shopSelectData"></NsShopDialog>
  配置参数(不配置则默认)：
  btnTitle：(btnTitle="+选择适用门店")配置按钮文本
  dialogTitle：(btnTitle="选择适用门店")配置弹框标题
  url: (:guideUrl=$api.guide.moreAccount.findList)查询导购列表的请求地址，不设置则默认查询sg_guide表。 后台请用GuidePageVo承接查询条件，
  plan: 默认方案：1：企微 2：个号 会带入到url的请求参数中
  validNull：(:validNull="true")true必须选择一个门店 false可以不选择门店 默认false
  v-model：接收值设置v-model="shopSelectData"
  3.vue的data加入参数：
  shopSelectData: [] //选中的值,如:[1,2,3,4]
-->
<template>
  <div>
    <template v-if="type === 'icon'">
      <div  @click="onDialogOpen()" style="cursor: pointer"><slot name='btnIcon'></slot></div>
    </template>
    <template v-else>
      <NsButton :type="type" @click="onDialogOpen()"><Icon v-if="type === 'text'" type="plus"/>{{btnTitle}}</NsButton>
    </template>
    <el-dialog :visible.sync="visible" :show-scroll-x="false"
               :close-on-click-modal = "false" appendToBody :before-close="onDialogClose" width="940px">
      <div slot="title">
        {{dialogTitle}}
        <el-tooltip  content="按门店设置使用范围时，所选门店下所有导购都会使用该欢迎语">
          <Icon type="question-circle"></Icon>
        </el-tooltip>
      </div>
      <div>
        <el-form>
          <input name="hidden" type="text" hidden/>
          <el-form-item>
            <el-form-grid><div style="margin-left: 20px;">工作门店：</div></el-form-grid>
            <el-form-grid >
              <ns-droptree ref="shopCateTree" :defaultExpandAll='true' placeholder="请选择区域" :lazy="true" :load="loadShopAreaNode" :multiple="false" v-model="param.shopArea" clearable></ns-droptree>
            </el-form-grid>
            <el-form-grid style="margin-left:10px">
              <el-select-load v-model="param.shopId" :options="shopOptions"  filterable clearable :page-sizes="20" placeholder="选择门店">
              </el-select-load>
            </el-form-grid>
            <el-form-grid><div style="margin-left: 10px;">店铺名称：</div></el-form-grid>
            <el-form-grid>
              <ElInput style="width:100px" :maxlength="20" v-model="param.name" @keyup.enter.native="searchEmployee(1)"/>
            </el-form-grid>
            <el-form-grid><div style="margin-left: 10px;"></div></el-form-grid>
            <el-form-grid>
              <ns-button type="primary" @click="searchEmployee(1)">{{$t('operating.search')}}</ns-button>
              <ns-button @click="resetSearch">{{$t('operating.reset')}}</ns-button>
              <ns-button @click="handleSelectAll">{{isCheckAll ? '取消全选' : '全选'}}</ns-button>
            </el-form-grid>
          </el-form-item>
        </el-form>
        <el-row :gutter="24">
          <el-col :span="12">
            <ElTable v-loading="tableLoading" ref="employeeTable" :data="listData" height="260" @select="selectChange" @select-all="selectAllChange">
              <ElTableColumn type="selection" width="55" />
              <ElTableColumn :show-overflow-tooltip="true" type="default" prop="shop_name" label="店铺名称" align="left"/>
              <ElTableColumn :show-overflow-tooltip="true" type="default" prop="shopStatus" label="店铺状态" align="left">
                <template slot-scope="scope">
                  {{scope.row.shopStatus === -2 ? '暂停' : ''}}
                  {{scope.row.shopStatus === -1 ? '关店' : ''}}
                  {{scope.row.shopStatus === -0 ? '删除' : ''}}
                  {{scope.row.shopStatus === 1 ? '正常' : ''}}
                </template>
              </ElTableColumn>
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
              <ElTableColumn :show-overflow-tooltip="true" type="default" prop="shop_name" :label="'已选' + selectedData.length + '家门店'" align="left"/>
              <ElTableColumn  prop="select" align="center" width="55" >
                <template slot='header' v-if='isFix'>
                  <ns-button
                    type="text"
                    size="mini"
                    @click="() => removeAll()">
                    清空
                  </ns-button>
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
</style>
