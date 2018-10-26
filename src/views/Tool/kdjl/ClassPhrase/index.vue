<template>
  <div class="template-page">
      <div class="template-page__row">
        <div class="template-page__row-left">
          <el-form>
            <el-form-item label="淘宝店铺名：">
                <el-select v-model="shopId" :placeholder="$t('prompt.select')" @change="changeShop">
                  <el-option v-for="item in shops" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
          </el-form>
          <el-aside v-loading="treeLoading" :element-loading-text="$t('prompt.loading')" width="200">
            <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
            <ns-tree ref="tree" :data="treeData" node-key="id"
                     :empty-text="emptyText"
                     show-icon
                     default-expand-all
                     :expand-on-click-node="false"
                     check-on-click-node
                     auto-expand-parent
                     highlight-current
                     :filter-node-method="filterNode"
                     @node-click="onNodeClick"
                     @icon-add-click="onAddClick"
                     @icon-edit-click="onEditClick"
                     @icon-delete-click="onDeleteClick">
            </ns-tree>
          </el-aside>
        </div>
        <div class="template-page__row-right">
          <el-tabs v-model="remarkSelect" @tab-click="changeSelect">
            <el-tab-pane label="私有短语" name="private">
               <ns-table-private ref="private" @update="update" @add="add" @import="importFile" @open="transOpen" @update-trans="updateTrans" @export-file="exportFile"></ns-table-private>
            </el-tab-pane>
            <el-tab-pane label="团队短语" name="team">
              <ns-table-team ref="team" @update="update" @add="add" @import="importFile" @open="transOpen" @update-trans="updateTrans" @export-file="exportFile"></ns-table-team>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

    <!--添加短语-->
    <el-dialog :title="typeTitle" :visible.sync="typeVisible"
               :close-on-click-modal = "false" :before-close="onTypeClose" width="400px" height="150px">
      <el-form label-width="100px" style="padding-top: 3px;" ref="typeForm" :model="phraseType" :rules="TypeRules">
        <el-form-item label="短语分类名：" prop="type_name">
          <el-form-grid size="xmd">
            <el-input type="text" v-model.trim="phraseType.type_name" placeholder="请输入短语分类名" > </el-input>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onTypeClose()">{{$t('operating.cancel')}}</ns-button>
        <ns-save @click="onTypeSave()" :loading="typeLoading"></ns-save>
      </div>
    </el-dialog>

    <!--添加短语-->
    <el-dialog :title="title" :visible.sync="visible"
               :close-on-click-modal = "false" :before-close="onClose" width="650px">
      <el-row>
        <el-col :span="12">
          <el-form label-width="100px" style="padding-top: 3px;" ref="form" :model="model" :rules="rules">
            <el-form-item label="分类短语类型：" class = "el-inline-block" required>
              <el-form-grid size="xmd">
                <el-form-item prop = "class_type">
                  <ns-droptree v-model="model.class_type" :data="classType" :show-checkbox="false"></ns-droptree>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="快捷内容：" prop="class_phrase" class="el-form-validate__unHide">
              <el-form-grid size="xmd">
                <el-input type="textarea"
                          ref="classPhrase"
                          :rows="16"
                          v-model.trim="model.class_phrase" placeholder="请输入快捷内容" > </el-input>
              </el-form-grid>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <ul class="emotion-list">
            <li v-for="list in emotionList" @click="setEmotionWords(list.ShortCut)">
              <el-tooltip :content="list.Meaning">
                <img :src="'../../../static/emotions/bmp/' + list.OriginalFile">
              </el-tooltip>
            </li>
          </ul>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <ns-button @click="onClose()">{{$t('operating.cancel')}}</ns-button>
        <ns-save @click="onSave()" :loading="loading"></ns-save>
      </div>
    </el-dialog>

    <!--导入-->
    <el-dialog ref="dialog" title="导入分类短语" :visible.sync="importVisible"
               :close-on-click-modal = "false" :before-close="onCloseImportDialog"  width="500px">
      <el-form ref="importForm" placement="right" label-width="100px" :model="transDaTa" :rules="transDaTaRules">
        <el-form-item label="分类短语类型：" class = "el-inline-block" required>
          <el-form-grid size="xmd">
            <el-form-item prop = "class_type">
              <ns-droptree v-model="transDaTa.class_type" :data="classType" :show-checkbox="false"></ns-droptree>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="上传文件：" required>
          <el-form-grid size="xmd">
            <el-form-item >
              <el-upload
                ref="file"
                :limit-file-list="true"
                :limit="1"
                :auto-upload="false"
                :before-upload="beforeUpload"
                action=""
                :http-request="uploadFile"
                accept=".xlsx,.xls" name="file" >
                <ns-button size="small"  type="primary">选择文件</ns-button>
              </el-upload>
            </el-form-item>
          </el-form-grid>
          <el-form-grid block class="text-warning">
            <div class="tmp-tips text-warning"><i class="el-icon-warning"></i>
              只能上传execl文件<a class="el-button el-button--text"  href="/static/fileTemplates/短语导入模板.xls">
                <i class="fa fa-cloud-download">
                </i> 下载模板</a>
            </div>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onCloseImportDialog">{{$t('operating.cancel')}}</ns-button>
        <ns-save @click="onImportSave" :loading="loading"></ns-save>
      </div>
    </el-dialog>

    <!--添加短语-->
    <el-dialog :title="title" :visible.sync="transferVisible"
               :close-on-click-modal = "false" :before-close="onTransClose" width="400px" height="200px">
      <el-form label-width="100px" style="padding-top: 3px;" ref="transForm" :model="transDaTa" :rules="transDaTaRules">
        <el-form-item label="分类短语类型：" class = "el-inline-block" required>
          <el-form-grid size="xmd">
            <el-form-item prop = "class_type">
              <ns-droptree v-model="transDaTa.class_type" :data="classType" :show-checkbox="false"></ns-droptree>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onTransClose()">{{$t('operating.cancel')}}</ns-button>
        <ns-save @click="onSaveTrans()" :loading="loading"></ns-save>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import index from './src/index'
  import NsTablePrivate from './PhrasePrivate/NsTablePrivate'
  import NsTableTeam from './PhraseTeam/NsTableTeam'
  import NsTree from 'components/NsTree'
  import NsDroptree from 'components/NsDroptree'
  index.components = {
    NsTablePrivate,
    NsTableTeam,
    NsTree,
    NsDroptree
  }
  export default index
</script>

<style scoped>
  .emotion-list {
    min-height: 350px;
    padding: 0;
    list-style: none;
    li {
      display: inline-block;
      padding: 3px;
    }
  }
</style>
