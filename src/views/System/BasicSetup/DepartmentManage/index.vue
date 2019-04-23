<template>

  <div class="template-page">
    <div class="template-page__row">
      <div class="template-page__row-left">
        <el-aside v-loading="loading" :element-loading-text="$t('prompt.loading')" width="200">
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
                   @node-click="onEditClick"
                   @node-collapse="onCloseNode"
                   @icon-add-click="onAddClick"
                   @icon-edit-click="onEditClick"
                   @icon-delete-click="onDeleteClick">
            </ns-tree>
          </el-scrollbar>
        </el-aside>
      </div>
      <div class="template-page__row-right form-content">
        <el-form ref="form" placement="right" label-width="100px" :model="model" :rules="rules"  @submit.native.prevent>
          <el-form-item label="部门路径：" >
            <el-form-grid size="xxlg">
              <span>{{pathNames}}</span>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="部门名称：" prop="departmentName" required>
            <el-form-grid size="xmd">
                <el-input type="text" v-model.trim="model.departmentName" placeholder="请输入部门名称，限制30字"></el-input>
            </el-form-grid>
          </el-form-item>
          <!--<el-form-item label="编码：" required>-->
          <!--<el-form-grid size="xmd">-->
          <!--<el-form-item prop="menu_code">-->
          <!--<el-input type="text" v-model="model.menu_code" placeholder="请输入编码，限制50字"></el-input>-->
          <!--</el-form-item>-->
          <!--</el-form-grid>-->
          <!--</el-form-item>-->
          <el-form-item label="备注："  prop="remark">
            <el-form-grid size="xmd">
                <el-input type="textarea"  class="text-right" v-model.trim="model.remark" placeholder="请输入备注,限制250字"></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item>
            <!--<ns-button @click="onReset">{{$t('operating.reset')}}</ns-button>-->
            <ns-save :loading="saveBtnLoading" @click="onSave" ></ns-save>
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
