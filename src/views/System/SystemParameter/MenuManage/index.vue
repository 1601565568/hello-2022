<template>
  <div class="template-page">
    <div class="template-page__row">
      <div class="template-page__row-left">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText">
        </el-input>
        <el-scrollbar ref="pageLeft">
          <ns-tree ref="tree"
                   :data="treeData"
                   node-key="id"
                   :empty-text="emptyText"
                   :default-expanded-keys="defaultExpandedKeys"
                   show-icon
                   :expand-on-click-node="false"
                   check-on-click-node
                   :filter-node-method="filterNode"
                   draggable
                   auto-expand-parent
                   highlight-current
                   :allow-drag="onAllowDrag"
                   :allow-drop="onAllowDrop"
                   @node-drag-end="onNodeDragEnd"
                   @node-collapse="onCloseNode"
                   @node-click="onEditClick"
                   @icon-add-click="onAddClick"
                   @icon-edit-click="onEditClick"
                   @icon-delete-click="onDeleteClick">
          </ns-tree>
        </el-scrollbar>
      </div>
      <div class="template-page__row-right form-content">
        <el-form ref="form" label-width="100px" :model="model" :rules="rules"  @submit.native.prevent>
          <el-form-item label="菜单路径：" >
            <el-form-grid size="xxlg">
                <span>{{pathNames}}</span>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="菜单名称：" prop="menu_name" required>
            <el-form-grid size="xmd">
                <el-input type="text" v-model.trim="model.menu_name" placeholder="请输入菜单名称，限制50字"></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="编码：" prop="menu_code" required>
            <el-form-grid size="xmd">
                <el-input type="text" v-model.trim="model.menu_code" placeholder="请输入编码，限制50字"></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="所属类型：" prop="menu_type">
            <el-form-grid size="xmd">
                <el-select v-model="model.menu_type" filterable="" :placeholder="$t('prompt.select')" :multiple="false">
                  <el-option label="菜单" :value="1"></el-option>
                  <el-option label="按钮" :value="2"></el-option>
                  <!--<el-option label="tab" :value="3"></el-option>-->
                </el-select>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="菜单URL：" prop="menu_url" required>
            <el-form-grid size="xmd">
                <el-input type="text" v-model.trim="model.menu_url" placeholder="请输入URL"></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="菜单图标：" prop="menu_icon_css">
            <el-form-grid size="xmd">
                <el-input type="text" v-model.trim="model.menu_icon_css" placeholder="请输入菜单图标，限制50字"></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="序号：" prop="menu_sort">
            <el-form-grid size="xmd" >
                <el-input type="number" :min="1" class="text-right" v-model.number="model.menu_sort" placeholder="请输入序号"></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-form-grid size="xmd">
                <el-input type="textarea"  class="text-right" v-model.trim="model.remark" placeholder="请输入备注，限制250字"></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="启用状态：" prop="menu_status">
            <el-form-grid size="xmd">
                <el-switch v-model="model.menu_status" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-grid>
          </el-form-item>
          <el-form-item>
            <!--<ns-button @click="onReset">{{$t('operating.reset')}}</ns-button>-->
            <ns-save :loadin="saveBtnLoading" @click="onSaveMenu" ></ns-save>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import index from './src/index'
  import NsTree from 'components/NsTree'
  index.components = {
    NsTree
  }
  export default index
</script>
