<template>
  <div>
  <DuplicateTable :visible.sync='duplicateTableDialog.visible' :wxGroups.sync='duplicateTableDialog.data'/>
  <el-dialog
    title="重复群成员筛选"
    :visible.sync="sVisible"
    width="663px" class="dialog-chat"
    @closed="onClose">
    <el-form  class="dialog-chat__form" inline>
      <el-form-item label="选择个人号：">
        <el-form-grid size="md">
          <el-select v-model="searchModel.ownerId" placeholder="全部" class="dialog-person__select" size='small'>
            <el-option
              v-for="item in privateAccountSelect"
              :key="item.wid"
              :label="item.nick"
              :value="item.wid">
            </el-option>
          </el-select>
        </el-form-grid>
      </el-form-item>
      <el-form-item label="搜索微信群：">
        <el-form-grid size="xmd">
          <el-input
            placeholder="输入群名称"
            prefix-icon="el-icon-search"
            v-model="searchModel.displayname"
            clearable>
          </el-input>
        </el-form-grid>
        <el-form-grid>
          <ns-button type="primary" @click='search'>搜索</ns-button>
        </el-form-grid>
      </el-form-item>
    </el-form>
    <div class="dialog-chat__content dialog-chat__content--top">
      <div class="dialog-left">
        <div class="dialog-left__checkbox">
          <el-table ref="wxGroupTable" :data="wxGroupData" class="template-table__main"
                    stripe
                    resizable v-loading.lock="loadingWxGroupTable"
                    :element-loading-text="$t('prompt.loading')"
                    row-key="id"
                    @selection-change="onWxGroupSelectionChange"
                    :reserve-selection='true'>
            <el-table-column :show-overflow-tooltip="true" type="default" prop="displayname"
                             label="可选择微信群" :sortable="false">
              <template slot-scope="scope">
                {{scope.row.displayname || '-'}}
              </template>
            </el-table-column>
            <el-table-column type="selection" align="right" :width="50"></el-table-column>
          </el-table>
          <el-pagination class="template-table__pagination"
                         :total="pagination.total"
                         :current-page="pagination.page" :page-size="pagination.size"
                         layout="total, prev, pager, next, jumper"
                         @current-change="onCurrentChange">
          </el-pagination>
        </div>
      </div>
      <div class="dialog-right">
        <div class="dialog-right__title dialog-paddingtop">已选择微信群</div>
        <div class="dialog-right__content">
          <el-scrollbar class="scrollbarc">
            <div class="dialog-selectitem" v-for='item of wxGroupSelection' :key='item.chatroomname'>
              <span class="dialog-selectitem__discountgroup">{{item.displayname || '-'}}</span>
              <i @click='onRemoveSelectedWxGroup(item)' class="text-primary font-size-middle delete"><Icon type="delete" /></i>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-btn">
        <ns-button @click="sVisible = false">取消</ns-button>
        <ns-button @click="onConfirm" type='primary' :disabled='nextBtnDisabled'>确定</ns-button>
      </span>
  </el-dialog>
  </div>
</template>
<script>
import Index from './src/duplicate'

export default Index
</script>
<style scoped>
  @import '../src/dialog.pcss';
</style>
