<template>
  <div>
    <!-- <ns-button type="primary" @click="onShow">选择企业微信群</ns-button> -->
    <div class="item-down" @click="onShow">
        <div class="name">企微群:</div>
        <div class="item-select">
          选择企微群
        </div>
        <div class="icon-view">
          <Icon type="ns-arrow-drowdown" :class="{ 'arrowTransform': !flag, 'arrowTransformReturn': flag}" style="color: #8C8C8C;"/>
        </div>
      </div>
  <!-- /end 选择商品结果列表 列表展开收缩切换结构-->
  <!-- 选择发送对象客户弹窗结构 -->
  <el-dialog title="选择群聊" :visible="visible" class="g-wrapper" width="960px" :show-scroll-x="false" append-to-body
             height="530px" :response-limit=false :before-close="onClose">
    <el-radio-group v-model="searchMode" style="margin-top: -6px;margin-bottom: 3px;">
      <el-radio :label="1">所选群均有该客户</el-radio>
      <el-radio :label="2" >仅需其中两个群有该客户</el-radio>
    </el-radio-group>
    <el-row class="tmp-choose__condition" :gutter="20">
      <el-col :span="24">
        <el-form ref="form" :model="model" label-width="60px" :inline="true">
          <el-form-item>
            <el-form-grid size="xmd">
              <el-select v-model="model.ChatID" placeholder="请选择群名称" filterable @change="groupChange(model.ChatID)">
                <el-option
                  label="请选择群名称"
                  value="">
                </el-option>
                <el-option
                  v-for="item in groupList"
                  :key="item.ChatID"
                  :label="item.Name"
                  :value="item.ChatID">
                </el-option>
              </el-select>
            </el-form-grid>
          </el-form-item>
          <el-form-item>
            <el-form-grid size="xmd">
              <el-select v-model="model.ownerName" placeholder="请选择群主" filterable @change="ownerNameChange(model.ownerName)">
                <el-option
                  label="请选择群主"
                  value="">
                </el-option>
                <!-- <el-option
                  v-for="item in userList"
                  :key="item.UserID"
                  :label="item.Name"
                  :value="item.Name">
                </el-option> -->
              </el-select>
            </el-form-grid>
          </el-form-item>
          <el-form-item style="margin-right: 0">
            <el-form-grid>
              <!-- <ns-button type="primary" @click="onSearch">{{$t('operating.search')}}</ns-button>
              <ns-button @click="onResetSearch">{{$t('operating.reset')}}</ns-button> -->
            </el-form-grid>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row class="tmp-choose__condition" :gutter="20">
      <el-col :span="16" class="condition-left">
        <el-table ref="table"
                  :data="table.data" stripe
                  @select="onSelectRow"
                  @select-all="onSelectAll"
                  :key="pagination.currPage"
                  v-loading="tableLoading"
                  :element-loading-text="$t('prompt.loading')">
          <el-table-column type="selection" width="45" align="center"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" width="280" type="default" prop="ChatID"
                           label="群ID" :sortable="false" align="left">
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true"  width="140" type="default" prop="Name"
                           label="群名" :sortable="false" align="left">
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true"  width="110" type="default" prop="OwnerName"
                           label="群主" :sortable="false" align="left">
          </el-table-column>
        </el-table>
        <el-pagination class="template-table-pagination"
                       layout="total, prev, pager, next, jumper"
                       :page-size="pagination.currSize"
                       :current-page="pagination.currPage"
                       :total="pagination.total"
                       @current-change="onPageChange">
        </el-pagination>
      </el-col>
      <el-col :span="8" class="condition-right">
        <div class="tmp-choose__result">
          <p class="title">已选择了<span class="text-danger padding-lr-base">{{selectedData.length}}</span>个群</p>
          <div v-if="selectedData.length>0">
            <el-scrollbar style="margin-top: 5px;">
              <ul class="tmp-choose__goods">
                <li v-for="(item,index) in selectedData" :key="index">
                  <span class="g-name">{{item.Name}}</span>
                  <a @click="onDelSelected('selectedData',index,item)" class="delete-icon">
                    <Icon type="delete" className="g-delete"/>
                  </a>
                </li>
              </ul>
            </el-scrollbar>
          </div>
          <ns-no-data height="335" v-else>请从左侧群列表中选择</ns-no-data>
        </div>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <ns-button @click="onClose">{{$t('operating.cancel')}}</ns-button>
      <ns-button type="primary" @click="onConfirm">保存</ns-button>
    </div>
  </el-dialog>
  </div>
</template>

<script>
import GroupSelectDialog from '../src/GroupSelectDialog'

export default GroupSelectDialog
</script>

<style scoped>
  @import "@theme/variables.pcss";

  >>> .el-table th {
    line-height: 1;
  }
  .item-down {
    width: 171px;
    height: 32px;
    background: #FFFFFF;
    border: 1px solid #D9D9D9;
    border-radius: 2px;
    display: flex;
    flex-direction: row;
    font-size: 14px;
    align-items: center;
    margin-left: 16px;
    cursor: pointer;
  }
  .name {
      width: 56px;
      margin-left:8px;
    }
  .icon-view {
    width: 20px;
    height: 20px;
    cursor: pointer;
    margin-left: 8px;
  }

  .tmp-choose__result .title {
    line-height: 30px;
    background: var(--theme-bg-color-base);
    padding: 0 8px;
    border-bottom: 1px solid var(--theme-base-border-color-primary);
  }

  .condition-left {
    width: 604px;
  }

  .condition-right {
    width: 346px;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  >>> .el-table--border th:first-child .cell, >>> .el-table--border td:first-child .cell {
    padding-left: 12px;
  }

  >>> .el-scrollbar {
    margin-top: 0 !important;
  }

  >>> .tmp-toggles {
    margin-top: 0 !important;
  }

  >>> .el-scrollbar__bar.is-horizontal {
    display: none;
  }

  >>> .el-scrollbar__wrap {
    height: 347px;
  }

  >>> .el-loading-spinner .circular {
    height: 22px;
    width: 22px;
    position: relative;
    top: 5px;
  }

  >>> .el-table thead th {
    background-color: var(--theme-bg-color-base);
  }

  .tmp-choose__goods {
    list-style: none;
    font-size: 12px;
    padding: var(--default-padding-base);
    background: var(--default-table-strip-bg);

  li {
    display: flex;
    flex-wrap: nowrap;
    padding: 0 3px;

  .delete-icon {
    padding: 3px 5px;
    position: relative;
    top: -3px;

  &
  :hover {
    color: var(--theme-color-warning);
  }

  }

  .g-name {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  }

  }
</style>
