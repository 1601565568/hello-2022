<template>
  <div class="template-page">
    <div class="template-page__row">
      <div class="template-page__row-left">
        <el-aside v-loading="loading" :element-loading-text="$t('prompt.loading')" width="180">
          <ns-tree ref="tree" :data="treeData" :highlight-current="true"
                   :empty-text="$t('prompt.noData')"
                   default-expand-all
                   :expand-on-click-node="false"
                   show-icon
                   show-icon-up
                   show-icon-down
                   show-add-limit="3"
                   @icon-up-click="onUpClick"
                   @icon-down-click="onDownClick"
                   @icon-add-click="onAddClick"
                   @icon-edit-click="onEditClick"
                   @icon-delete-click="onDeleteClick">
          </ns-tree>
        </el-aside>
      </div>
    </div>
    <el-dialog ref="categoryDialog" :title="categoryTitle" width="400px" :visible.sync="categoryDialogVisible">
      <el-form ref="categoryForm" label-width="120px" class="form-main" :model="categoryData" :rules="rules">
        <el-form-item label="分类名称：" required>
          <el-form-grid size="xmd">
            <el-form-item prop="name">
              <el-input v-model="categoryData.name"></el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <ns-button @click="categoryDialogVisible = false">取 消</ns-button>
        <ns-save @click="saveCategory"></ns-save>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import GoodsCategory from './src/GoodsCategory'
  import NsTree from 'components/NsTree'

  GoodsCategory.components = {NsTree}
  export default GoodsCategory
</script>
<style scoped>
</style>
