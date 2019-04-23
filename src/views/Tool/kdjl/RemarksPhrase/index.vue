<template>
  <div class="template-page">
    <el-tabs v-model="remarkSelect" @tab-click="handleClick">
      <el-tab-pane label="公有备注短语" name="public">
        <ns-table-public ref="public" @update-pubic="update" @add-pubic="add"></ns-table-public>
      </el-tab-pane>
      <el-tab-pane label="私有备注短语" name="private">
        <ns-table-private ref="private" @update-private="update" @add-private="add"></ns-table-private>
      </el-tab-pane>
    </el-tabs>

    <!--添加短语-->
    <el-dialog :title="title" :visible.sync="visible"
               :close-on-click-modal = "false" :before-close="onClose" width="400px">
          <el-form label-width="100px" style="padding-top: 3px;" ref="form" :model="model" :rules="rules">
            <el-form-item label="店铺：" class = "el-inline-block" required>
              <el-form-grid size="xmd">
                <el-form-item prop = "shop_id" >
                  <el-select v-model="model.shop_id" :placeholder="$t('prompt.select')">
                    <el-option v-for="item in shops" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="备注短语：" prop="memo_phrase">
              <el-form-grid size="xmd">
                <el-input type="text" v-model.trim="model.memo_phrase" placeholder="请输入备注短语" > </el-input>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="类型：">
              <el-form-grid size="xmd">
                <el-form-item>
                    <el-radio v-model="model.is_public" label="1">公有短语</el-radio>
                    <el-radio v-model="model.is_public" label="0">私有短语</el-radio>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
          </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onClose()">{{$t('operating.cancel')}}</ns-button>
        <ns-save @click="onSave()" :loading="loading"></ns-save>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import index from './src/index'
import NsTablePrivate from './RemarksPhrasePrivate/NsTablePrivate'
import NsTablePublic from './RemarksPhrasePublic/NsTablePublic'
index.components = {
  NsTablePrivate,
  NsTablePublic
}
export default index
</script>
