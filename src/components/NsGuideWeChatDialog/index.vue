
<template>
  <div>
    <el-dialog :title="dialogTitle" :visible.sync="visible" :show-scroll-x="false"
               :close-on-click-modal = "false" :before-close="onDialogClose" width="1100px" :modal-append-to-body='appendToBody' :append-to-body='appendToBody'>
      <div>
        <el-form>
          <el-form-item>
            <el-input v-model="seachVal" placeholder="请输入企业微信成员名称"  @keyup.enter.native="searchEmployee(1)">
              <Icon type="ns-search" slot="suffix" class='search-icon' @click="searchEmployee(1)"></Icon>
            </el-input>
          </el-form-item>
        </el-form>
        <div>
          <!-- <el-row :gutter="24"> -->
            <el-col :span="12">
              <ElTable v-loading="tableLoading" ref="employeeTable" :data="employeeData" height="260" @select="selectChange" @select-all="selectAllChange">
                <ElTableColumn type="selection" width="55"></ElTableColumn>
                <ElTableColumn :show-overflow-tooltip="true" type="default" prop="name" label="企业微信成员" align="left"/>
                <ElTableColumn :show-overflow-tooltip="true" type="default" prop="shopNames" label="企微userid" align="left"/>
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
                <ElTableColumn :show-overflow-tooltip="true" type="default" prop="name" :label="'已选' + selectedData.length + '个成员'" align="left">
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
  .template-search__chooes{
    cursor: pointer;
    min-width: 40px;/* width改成min-width 有问题找文秀或梦芹 */
    font-size: 12px;
    color: #0392FB;
    text-align: center;
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
