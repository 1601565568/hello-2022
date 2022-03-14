
<template>
  <div>
    <div class="template-search__chooes"
         v-if="!isButton"
         :type="type"
         @click="onDialogOpen()">
      <template v-if="selfBtn">
        <!-- 需要接口返回后才展示点击按钮 start -->
        <template v-if='isOpenDialogAfterRequest'>
          <template v-if='requestLoaded'>
            <slot name='selfBtn'></slot>
          </template>
          <template v-else>
            <ns-button type='text'
                       :loading='true'
                       style='margin-right:10px'>加载中</ns-button>
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
        <Icon v-if="type === 'text'"
              type="plus" />{{btnTitle}}
      </template>
    </div>
    <NsButton v-if="isButton"
              :type="type"
              @click="onDialogOpen()">
      <Icon v-if="type === 'text'"
            type="plus" />{{btnTitle}}
    </NsButton>
    <el-dialog :title="dialogTitle"
               :visible.sync="visible"
               :show-scroll-x="false"
               :close-on-click-modal="false"
               :before-close="onDialogClose"
               width="1100px"
               :modal-append-to-body='appendToBody'
               :append-to-body='appendToBody'>
      <div>
        <div class="head-wechat">
          <el-form class='form-inline_top'
                   :model="departData"
                   @submit.native.prevent>
            <el-form-item>
              <el-input v-model.trim="departData.name"
                        placeholder="请输入企业微信成员名称"
                        @keyup.enter.native="searchEmployee(1)">
                <Icon type="ns-search"
                      slot="suffix"
                      class='search-icon'
                      @click="searchEmployee(1)"></Icon>
              </el-input>
            </el-form-item>
          </el-form>
        </div>

        <div>
          <el-row :gutter="4">
            <el-col :span="12">
              <ElTable v-loading="tableLoading"
                       ref="employeeTable"
                       :data="employeeData"
                       height="260"
                       @select="selectChange"
                       @select-all="selectAllChange"
                       class="new-table_border">
                <ElTableColumn type="selection"
                               width="55"></ElTableColumn>
                <ElTableColumn :show-overflow-tooltip="true"
                               type="default"
                               prop="name"
                               label="企业微信成员"
                               align="left" />
                <ElTableColumn :show-overflow-tooltip="true"
                               type="default"
                               prop="userId"
                               label="企微userid"
                               align="left" />
              </ElTable>
              <el-pagination v-if="_data.pagination4Emp.enable"
                             class="template-table__pagination"
                             :page-sizes="_data.pagination4Emp.sizeOpts"
                             :total="_data.pagination4Emp.total"
                             :current-page="_data.pagination4Emp.page"
                             :page-size="_data.pagination4Emp.size"
                             :layout="true? 'total, sizes, prev, pager, next':'total'"
                             @size-change="$sizeChange$"
                             @current-change="searchEmployee">
              </el-pagination>
            </el-col>
            <el-col :span="12">
              <ElTable :data="selectedData"
                       height="260"
                       class="new-table_border">
                <ElTableColumn :show-overflow-tooltip="true"
                               type="default"
                               prop="name"
                               :label="'已选' + selectedData.length + '个成员'"
                               align="left">
                </ElTableColumn>
                <ElTableColumn prop="select"
                               align="right"
                               width="100">
                  <template slot="header">
                    <span @click="clearSelection"
                          style='text-align:right'>清空</span>
                  </template>
                  <template slot-scope="scope">
                    <ns-button :disabled="auth && scope.row.auth"
                               type="text"
                               size="mini"
                               @click="() => removeEmp(scope)">
                      <Icon type="delete"
                            className="code-delete" />
                    </ns-button>
                  </template>
                </ElTableColumn>
              </ElTable>
            </el-col>
          </el-row>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <ns-button @click="onDialogClose()">{{$t('operating.cancel')}}</ns-button>
        <ns-save @loading="tableLoading"
                 @click="onSave()"></ns-save>
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
.el-input__suffix:before {
  display: none !important;
}
.head-wechat {
  width: 240px;
  margin: 20px 0 30px 0;
}
.search-icon {
  font-size: 25px;
}
.template-search__chooes {
  cursor: pointer;
  min-width: 40px; /* width改成min-width 有问题找文秀或梦芹 */
  font-size: 12px;
  color: #0392fb;
  text-align: center;
}
.template-search__box {
  width: 182px;
  height: 28px;
  background: #ffffff;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  border-radius: 3px;
  display: flex;
  span {
    width: 141px;
    height: 27px;
    margin-left: 10px;
    border-right: 1px solid #dcdfe6;
  }
  > div + span {
    margin-left: var(--default-margin-small);
  }
}
.template-search__chooes {
  cursor: pointer;
  min-width: 40px; /* width改成min-width 有问题找文秀或梦芹 */
  font-size: 12px;
  color: #0392fb;
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

>>> .el-table th.el-table-column--selection > .cell {
  padding: 0 14px;
}
.flex-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
/* input */
.suffix-input >>> .el-input__suffix:before {
  display: none;
}
.suffix-input >>> .el-input__inner {
  padding-left: 9px;
}
/* 表单 */
.form-inline_top {
  .el-form-item {
    border: 1px solid #d9d9d9;
    padding: 2px 8px;
    margin-right: 16px !important;
    margin-bottom: 8px;
    height: 35px;
    box-sizing: border-box;
    border-radius: 2px;
    >>> .el-form-item__label {
      font-size: 14px;
    }
    >>> .el-input__inner {
      border: none;
      font-size: 14px;
      min-width: 150px;
      max-width: 300px;
    }
    >>> .el-range-input {
      font-size: 14px;
    }
    >>> .el-range-editor--small .el-range-separator {
      line-height: 22px;
      font-size: 14px;
    }
    >>> .el-input__suffix:before {
      display: none;
    }
  }
  >>> .el-form__change .el-input__inner {
    min-width: 0px;
    max-width: 450px;
  }
  >>> .el-form__change.el-date-editor--datetimerange.el-input,
  .el-date-editor--datetimerange.el-input__inner {
    width: 450px;
  }
}
.normal-from {
  >>> .el-color-picker--medium .el-color-picker__trigger {
    width: 60px;
    height: 60px;
    padding: 6px;
  }
  >>> .el-color-picker--medium .el-color-picker__mask {
    width: 60px;
    height: 60px;
  }
  >>> .el-color-picker--medium {
    height: 60px;
  }
  >>> .el-table__body-wrapper {
    /* padding-bottom: 0px; */
  }
  >>> .el-form-item__label {
    font-size: 14px;
    line-height: 22px;
  }
  >>> .larger-item .el-form-item__label {
    line-height: 32px;
  }
  >>> .el-input--medium .el-input__inner {
    font-size: 14px;
    height: 32px;
    line-height: 32px;
  }
  >>> .is-controls-right .el-input--medium .el-input__inner {
    height: 36px;
    line-height: 36px;
  }
  >>> .el-form-item--medium .el-form-item__content {
    line-height: 32px;
  }
  >>> .el-form-item--mini .el-form-item__content {
    line-height: 21px;
  }
  >>> .el-form-item--mini .el-checkbox__label,
  >>> .el-form-item--mini .el-radio__label {
    font-size: 14px;
    font-weight: normal;
  }
  >>> .el-form-item {
    margin-bottom: 25px;
  }
  >>> .el-form-item--medium .el-form-item__content .el-checkbox {
    line-height: 21px;
  }

  >>> .el-form-item--medium .el-form-item__content .el-radio {
    line-height: 21px;
  }
  >>> .el-input-number.is-controls-right .el-input__inner {
    padding-right: 44px;
  }
  >>> .el-input__suffix {
    top: 1px;
    height: 30px;
    bottom: 0;
  }
}
/* 表格 */
.new-table_border {
  >>> .el-table__header th {
    background-color: #f5f5f5;
    padding: 8px 0;
    .cell {
      position: relative;
      &:after {
        content: " ";
        position: absolute;
        background: #e8e8e8;
        width: 1px;
        right: 0;
        top: 0px;
        bottom: 0px;
      }
    }
  }
}
/* 折叠 */
.customer-collapse {
  >>> .el-collapse-item__header {
    background-color: #fff;
    font-size: 16px;
    color: #262626;
    position: relative;
    padding-left: 26px;
    height: 56px;
    line-height: 56px;
    margin-bottom: 0;
    .el-collapse-item__arrow {
      position: absolute;
      left: 0;
      top: 50%;
      height: 38px;
      margin-top: -19px;
    }
  }
  >>> .el-collapse-item__wrap {
    padding-left: 26px;
  }
}
/*popover*/
.form-item_popover {
  padding: 12px 16px;
  >>> .el-popper .el-popover__title {
    padding: 0 !important;
    font-size: 14px;
    color: #8c8c8c;
    line-height: 22px;
    margin-bottom: 13px;
  }
}
/* upload */
.poster-content {
  >>> .el-upload--text {
    width: 100%;
    .el-upload-dragger {
      width: 100%;
    }
  }
  >>> .el-form-item {
    margin-bottom: 0px;
  }
}
>>> .el-popover.dwaer-popper {
  min-width: 0 !important;
}

.input-view {
  >>> .el-form-item {
    margin-bottom: 0px;
  }
}
.goods-input-view {
  >>> .el-form-item {
    margin-bottom: 0px;
  }
}

.form-item_time {
  >>> .el-form-item {
    margin-bottom: 0px;
  }
}
</style>
