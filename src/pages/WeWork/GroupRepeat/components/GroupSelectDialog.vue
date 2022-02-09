<template>
  <div>
    <!-- <ns-button type="primary" @click="onShow">选择企业微信群</ns-button> -->
    <div class="item-down" @click="onShow">
        <div class="name">企微群:</div>
        <div class="item-select">
          {{selectedData.length > 0 ?'已选择'+selectedData.length + '个企微群': '选择企微群'}}
        </div>
        <div class="icon-view">
          <Icon type="ns-arrow-drowdown" :class="{ 'arrowTransform': !flag, 'arrowTransformReturn': flag}" style="color: #8C8C8C;"/>
        </div>
      </div>
  <!-- /end 选择商品结果列表 列表展开收缩切换结构-->
  <!-- 选择发送对象客户弹窗结构 -->
  <el-dialog title="选择群聊" :visible="visible" class="g-wrapper" width="1228px" :show-scroll-x="false" append-to-body
             height="807px" :response-limit=false :before-close="onClose">
    <el-radio-group v-model="searchMode" style="margin-top: 17px;margin-bottom: 3px;">
      <el-radio :label="1">所选群均有该客户</el-radio>
      <el-radio :label="2" >仅需其中两个群有该客户</el-radio>
    </el-radio-group>
    <el-row class="tmp-choose__condition" :gutter="20" style="margin-top:24px!important">
      <el-col :span="24">
        <!-- 客道 -->
        <el-form ref="form" :model="model" label-width="63px" :inline="true" v-if="env==='kd'">
          <el-form-item>
            <el-form-grid size="xmd">
              <el-select v-model="model.ChatID" placeholder="请选择群名称" filterable @change="groupChange(model.ChatID)">
                <el-option
                  v-for="item in groupList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-grid>
          </el-form-item>
          <el-form-item>
            <el-form-grid size="xmd">
              <el-select v-model="model.ownerName" placeholder="请选择群主" filterable @change="ownerNameChange(model.ownerName)">
                <el-option
                  v-for="item in userList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-grid>
          </el-form-item>
        </el-form>
        <!-- scrm -->
        <el-form ref="form" :model="model" :inline="true" v-else>
          <el-form-item label="群名称：">
            <el-form-grid size="small">
              <el-input v-model="model.ChatID" placeholder="请输入群名称" @blur="groupChange(model.ChatID)"></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="工作门店：">
            <el-form-grid size="small">
              <ns-droptree
                ref="shopCateTree"
                :defaultExpandAll='true'
                placeholder="请选择区域"
                :lazy="true"
                :load="loadAreaTree"
                :multiple="false"
                v-model="shopAreaId"
                clearable
              />
            </el-form-grid>
            <el-form-grid size="small">
              <el-select-load v-model="model.workShopId" :options="shops"  filterable clearable :page-sizes="20" placeholder="请选择门店" @change="workShopChange">
              </el-select-load>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="群主部门：">
            <ns-droptree
              ref="employeeDepartTree"
              :lazy="true"
              :load="loadDepartments"
              :multiple="false"
              v-model="departmentId"
              clearable
            />
          </el-form-item>
          <el-form-item label="群主：">
            <el-form-grid size="small">
              <el-input v-model="model.ownerName" placeholder="请输入群主姓名" @blur="ownerNameChange(model.ownerName)"></el-input>
            </el-form-grid>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row class="tmp-choose__condition" :gutter="20" style="margin-top:24px!important">
      <el-col :span="16" class="condition-left">
        <el-table ref="table"
                  max-height="510"
                  :data="table.data" stripe
                  :key="pagination.currPage"
                  v-loading="tableLoading"
                  :element-loading-text="$t('prompt.loading')"
                  @select="onSelectRow"
                  @select-all="onSelectAll">
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="default" prop="name"
                           label="群名称" :sortable="false" align="left">
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true"  width="env==='kd'?170:120" type="default" prop="owner_name"
                           label="群主" :sortable="false" align="left">
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" width="env==='kd'?170:100" type="default" prop="person_num"
                           label="群成员" :sortable="false" align="left">
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" width="160" type="default" prop="workShopName"
                           label="群主工作门店" :sortable="false" align="left" v-if="env!=='kd'">
            <template scope="scope">
              <span>{{scope.row.workShopName.join(',')}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="8" class="condition-right">
        <div class="tmp-choose__result">
          <p class="title">
            已选择了
            <!-- <span class="text-danger padding-lr-base"> -->
              {{selectedData.length}}
            <!-- </span> -->
            个群
          </p>
          <div v-if="selectedData.length>0">
            <el-table
                  max-height="470"
                  :data="selectedData" stripe
                  :key="pagination.currPage"
                  v-loading="tableLoading"
                  :element-loading-text="$t('prompt.loading')"
                  :show-header="false">
              <el-table-column :show-overflow-tooltip="true" type="default" prop="name"
                               :sortable="false" align="left">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true"  width="env==='kd'?170:120" type="default" prop="owner_name"
                               :sortable="false" align="left">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" width="env==='kd'?170:100" type="default" prop="person_num"
                               :sortable="false" align="left">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" width="160" prop="workShopName"
                               :sortable="false" align="left" v-if="env!=='kd'">
                <!-- <template scope="scope">
                  <span>{{scope.row.workShopName.toString()}}</span>
                </template> -->
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" width="50" type="default"
                               :sortable="false" align="left">
                <template scope="scope">
                  <a @click="onDelSelected('selectedData',scope.$index,scope.row)" class="delete-icon">
                    <Icon type="delete" className="g-delete"/>
                  </a>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- <ns-no-data height="335" v-else>请从左侧群列表中选择</ns-no-data> -->
          <div v-else class="condition-right__empty">
            <img src="../../../../assets/empty.png" alt="">
            <span>请从左侧群列表中选择哦~</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer" style="padding:0 !important">
      <div style="borderTop:1px solid #F0F0F0; height:64px;display:flex; alignItems:center">
        <span class="demonstration" style="width:70px">单页显示：</span>
        <el-pagination class="template-table-pagination"
                      layout="sizes, prev, pager, next, jumper"
                      :page-sizes="pagination.sizeOpt"
                      :current-page="pagination.currPage"
                      :total="pagination.total"
                      @current-change="onPageChange"
                      @size-change="onSizeChange"
                      style="width:1158px; boxShadow: none;">
        </el-pagination>
      </div>
      <div style="marginTop: 16px; width:100%; display:flex; justifyContent: end;">
        <ns-button @click="onClose">{{$t('operating.cancel')}}</ns-button>
        <ns-button type="primary" @click="onConfirm">保存</ns-button>
      </div>
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
  >>> .el-table__header tr{
    height: 40px;
  }
  >>> .el-table__body tr{
    height: 48px;
    line-height: 48px;
  }
  >>> .el-scrollbar__wrap{
    overflow: hidden;
  }
  .item-down {
    /* width: 171px; */
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
  .dialog-footer{
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    align-items: center;
  }
  .el-dialog__footer{
    margin: 6px;
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
    width: 590px;
    /* line-height: 30px; */
    height: 40px;
    background: var(--theme-bg-color-base);
    padding: 0 8px;
    border-bottom: 1px solid var(--theme-base-border-color-primary);
    color: #262626;
    font-size: 14px;
    line-height: 40px;
    font-weight: 500;

  }

  .condition-left {
    width: 604px;
  }
  .has-gutter tr {
    height: 40px !important;
  }
  .condition-right {
    width: 590px;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .condition-right__empty{
    width: 590px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 14px;
    color: #8C8C8C;
    padding-top: 100px;
  }
  .condition-right__empty img{
    width: 220px;
    height: 220px;
    margin-bottom: 10px;
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
