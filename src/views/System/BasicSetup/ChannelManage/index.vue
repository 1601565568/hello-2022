<template>
  <div class="template-page">
    <div class="template-page__row">
      <div class="template-page__row-left">
        <el-aside v-loading="loading" :element-loading-text="$t('prompt.loading')" width="200">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
          <el-scrollbar ref="pageLeft">
            <ns-tree ref="tree" :data="treeData" node-key="id"
                     :empty-text="emptyText"
                     show-icon
                     :expand-on-click-node="false"
                     check-on-click-node
                     auto-expand-parent
                     highlight-current
                     :filter-node-method="filterNode"
                     @node-click="onEditClick"
                     @icon-add-click="onAddClick"
                     @icon-edit-click="onEditClick"
                     @icon-delete-click="onDeleteClick">
            </ns-tree>
          </el-scrollbar>
        </el-aside>
      </div>
      <div class="template-page__row-right form-content">
        <el-form ref="form" label-width="120px" :model="model" :rules="rules">
          <el-form-item label="渠道路径：">
            <el-form-grid size="xmd">
              {{pathNames}}
            </el-form-grid>
          </el-form-item>
          <el-form-item label="渠道名称：" required>
            <el-form-grid size="xmd">
              <el-form-item prop="tag_name">
                <el-input type="text" v-model.trim="model.tag_name" placeholder="请输入渠道名称，限制30字"></el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="备注：">
            <el-form-grid size="xmd">
              <el-form-item prop="remark">
                <el-input type="textarea"  class="text-right" v-model.trim="model.remark" placeholder="请输入备注,限制200字"></el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item>
            <ns-save @click="onSaveMenu" ></ns-save>
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
