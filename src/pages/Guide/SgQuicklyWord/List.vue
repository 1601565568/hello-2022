<template>
  <div class="template-page__row">
    <div class="template-page__row-left">
      <ns-button type="primary" @click="onAddCategory">新增分类</ns-button>
      <div class="speech-left__search">
        <el-input
          placeholder="请输入分类名称"
          v-model="categorySearchObj.name"
          @keyup.enter.native="onFireFilter()"
          clearable
        >
          <Icon type="search" slot="suffix" class="el-input__icon" @click="onFireFilter()"/>
        </el-input>
      </div>
      <div>
        <span>分类</span>
        <el-tooltip content="拖动调整同层级下分类顺序，导购和客服端同步">
          <Icon type="question-circle" class="ml5"/>
        </el-tooltip>
      </div>
      <el-scrollbar ref="fullScreen" :class="[ENV === 'QA' && 'colorQA']">
        <ns-tree
          ref="categoryTree"
          draggable
          node-key="id"
          :showIcon="true"
          :check-strictly="true"
          :data="wordGroupList"
          :highlight-current="true"
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
          :filter-node-method="onTreeFilter"
          :default-expanded-keys="expandedKeys"
          @node-click="onTreeSelect"
          @node-drop="handleDrop"
          @icon-add-click="onAddCategory"
          @icon-edit-click="onEditCategory"
          @icon-delete-click="onRemoveCategory"
          @node-expand="onNodeExpand"
          @node-collapse="onNodeCollapse"
        >
        </ns-tree>
      </el-scrollbar>
    </div>
    <div class="template-page__row-right">
      <ns-page-table :colButton="14">
        <template slot="buttons" class="quickWordsArt">
          <ns-button type="primary" @click="onSaveOpen()" class="quickWordsArt">新增话术</ns-button>
          <ns-button type="primary" @click="ImportQuick()" >导入话术/分类</ns-button>
          <ns-button type="primary" :disabled="!batchDis" @click="onBatchSetOpen()">批量分类</ns-button>
          <ns-button type="primary" :disabled="!batchDis" @click="onBatchDelete()">批量删除</ns-button>
        </template>
        <!-- 快捷搜索 -->
        <template slot="searchSearch">
          <el-form :model="model" :inline="true" @submit.native.prevent class="pull-right">
            <el-form-item v-show="!_data._queryConfig.expand" label="话术内容：">
              <el-input
                ref="quickText"
                v-model="model.content"
                @clear="$searchAction$()"
                placeholder="请输入话术内容"
                @keyup.enter.native="$quickSearchAction$('content')"
                clearable
              ></el-input>
            </el-form-item>
            <!-- <el-form-item v-if="!_data._queryConfig.expand">
              <ns-button type="primary" @click="$quickSearchAction$('content')">{{$t('operating.search')}}</ns-button>
              <ns-button @click="$resetInputAction$()">{{$t('operating.reset')}}</ns-button>
            </el-form-item> -->
            <el-form-item>
              <ns-button type="text" @click="$handleTabClick">
                {{collapseText}}
                <Icon :type="_data._queryConfig.expand ? 'up' : 'down'"/>
              </ns-button>
            </el-form-item>
          </el-form>
        </template>
        <!-- 高级搜索 -->
        <template slot="advancedSearch" v-if="_data._queryConfig.expand">
          <el-form ref="table_filter_form" :model="model" label-width="80px" @submit.native.prevent :inline="true">
            <el-form-item label="话术内容：">
              <el-input
                @clear="$searchAction$()"
                @keyup.enter.native="$quickSearchAction$('content')"
                v-model="model.content"
                placeholder="请输入话术内容"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="添加人：">
              <el-select v-model="model.name" placeholder="请选择添加人" clearable @change="$searchAction$()">
                <el-option value="" label="全部" />
                <el-option
                  v-for="val in addNameList"
                  :key="val"
                  :label="val"
                  :value="val"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <!-- <div class="template-table__more-btn">
            <ns-button type="primary" @click="$searchAction$()">搜索</ns-button>
            <ns-button @click="$resetInputAction$()">重置</ns-button>
          </div> -->
        </template>
        <!-- 表格 -->
        <template slot="table">
          <el-scrollbar ref="tableScreen">
            <el-table
              ref="multipleTable"
              :data="_data._table.data"
              stripe
              resizable
              v-loading.lock="_data._table.loadingtable"
              :element-loading-text="$t('prompt.loading')"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" align="center" :width="50"></el-table-column>
              <el-table-column prop="content" label="话术内容" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="parentName" label="分类"></el-table-column>
              <el-table-column prop="createTime" label="添加时间" width="180"></el-table-column>
              <!-- <el-table-column align="left" v-if="showOrder">
                <template slot="header">
                  排序
                  <el-tooltip content="调整排列顺序，小程序同步">
                    <Icon type="question-circle"/>
                  </el-tooltip>
                </template>
                <template slot-scope="scope">
                  <i class='sort' :class="scope.row === _data._table.data[0]?'topHid':''"  @click='exchangeSort(1,scope.row.id)'><Icon type="zhiding"/></i>
                  <i class='sort' :class="scope.row === _data._table.data[0]?'topHid':''"   @click='exchangeSort(2,scope.row.id)'><Icon type="top-arr"/></i>
                  <i class='sort' :class="scope.row === _data._table.data[_data._table.data.length-1]?'topHid':''"   @click='exchangeSort(3,scope.row.id)'><Icon type="down-arr"/></i>
                  <i class='sort' :class="scope.row === _data._table.data[_data._table.data.length-1]?'topHid':''"  @click='exchangeSort(4,scope.row.id)'><Icon type="zhidi"/></i>
                </template>
              </el-table-column> -->
              <el-table-column prop="addName" label="添加人" align="left"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" label="操作" align="center" width="100px">
                <template slot-scope="scope">
                <span class="tmp-cell__buttons">
                  <ns-button type="text" @click="onSaveOpen(scope.row)">编辑</ns-button>
                  <ns-button type="text" @click="onDelete(scope.row)">删除</ns-button>
                </span>
                </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>
        </template>
        <!-- 表格-结束 -->
        <!-- 分页 -->
        <template slot="pagination">
          <el-pagination
            v-if="_data._pagination.enable"
            class="template-table__pagination"
            :page-sizes="_data._pagination.sizeOpts"
            :total="_data._pagination.total"
            :current-page.sync="_data._pagination.page"
            :page-size="_data._pagination.size"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="$sizeChange$"
            @current-change="$pageChange$"
          >
          </el-pagination>
        </template>
      </ns-page-table>
    </div>
    <!-- 初始弹窗开始 -->
    <el-dialog
      width="800px"
      :title="addOrEditModel.title"
      :visible.sync="addOrEditModel.visible"
      :modal-append-to-body="false"
      @before-close="closeDialog()"
    >
      <el-form ref="addOrEditForm" label-width="80px" :model="addOrEditModel.model" :rules="addOrEditModel.rules">
        <el-form-item label="选择分类：" prop="wordGroup" required>
          <ns-droptree
            :data="selectwordGroupList"
            v-model="addOrEditModel.model.wordGroup"
            placeholder="请选择分类"
            clearable
          ></ns-droptree>
        </el-form-item>
        <el-form-item label="话术内容：" prop="content">
          <el-input type="textarea" maxlength="200" placeholder="输入话术内容，最多200字" v-model="addOrEditModel.model.content" size="small" rows="4" ></el-input>
          <div v-if="productConfig.wxPlan !== 1" class="expressionBar_div">
            <i @click="faceFace" class="cursor-pointer"><Icon type="biaoqing"/></i>
          </div>
        </el-form-item>
        <!-- 表情弹窗 -->
        <el-form-item v-if="emojiShow" label="" prop="">
          <div class="emotion-list_div">
            <div class="emotion-list">
              <div class="li" v-for="list in emotionList" :key="list.ShortCut" @click="setEmotionWords(list.ShortCut)">
                <el-tooltip :content="list.Meaning">
                  <img :src="list.OriginalFile">
                </el-tooltip>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="添加人：" prop="addName">
          <el-input type="text" disabled v-model="addOrEditModel.model.addName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="closeDialog()">取消</ns-button>
        <ns-button type="primary" @loading="addOrEditModel.loading" @click="onSave">确定</ns-button>
      </div>
    </el-dialog>
    <!-- 批量设置分类 -->
    <el-dialog
      size="small"
      title="批量分类"
      :visible.sync="batchSetModel.visible"
      :modal-append-to-body="false"
      width='500px'
      @before-close="closeDialog()"
    >
      <el-form
        ref="batchSetForm"
        label-width="80px"
        :rules="batchSetModel.rules"
        :model="batchSetModel.model"
      >
        <el-form-item required label="选择分类：" prop="wordGroup" class="el-form-validate__unHide mt10">
          <ns-droptree
            :data="selectwordGroupList"
            v-model="batchSetModel.model.wordGroup"
            placeholder="请选择分类"
            clearable
          ></ns-droptree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="closeDialog()">取消</ns-button>
        <ns-button type="primary" @loading="batchSetModel.loading" @click="onBatchChange">确定</ns-button>
      </div>
    </el-dialog>
    <!-- 新增分类 -->
    <el-dialog
      size="small"
      :title="addOrEditCategory.title"
      :visible.sync="addOrEditCategory.visible"
      :modal-append-to-body="false"
      width='500px'
      @before-close="closeDialog()"
    >
      <el-form
        ref="addOrEditCategory"
        label-width="80px"
        :model="addOrEditCategory.model"
        :rules="addOrEditCategory.rules"
        @submit.native.prevent
      >
        <el-form-item label="分类名称：" prop="name" class="el-form-validate__unHide mt10">
          <el-input
            type="text"
            maxlength="10"
            placeholder="请输入分类名称，长度在1-10个字符以内"
            v-model="addOrEditCategory.model.name"
            :input="addOrEditCategory.model.name=addOrEditCategory.model.name.replace(/\s+/g,'')"
            autofocus
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="closeDialog()">取消</ns-button>
        <ns-button type="primary" @loading="addOrEditCategory.loading" @click="onSaveCategory">确定</ns-button>
      </div>
    </el-dialog>
    <importQuick ref="importQuickDialog" @outerimportexcel="importExcelClose" ></importQuick>
  </div>
</template>
<script>
import List from './src/List'
export default List
</script>
<style scoped>
@import "@theme/variables.pcss";
.colorQA >>> .custom-tree-node:hover {
  color: #2153D4;
}
.topHid {
  visibility: hidden;
}
.sort {
  font-size: var(--default-font-size-base);
  color: var(--theme-color-primary);
  cursor: pointer;
}
.expressionBar_div {
  width: 100%;
  height: 30px;
  background-color:#eee;
  border-radius: 0 0 3px 3px;
  padding-left: 5px;
}
.expressionBar_div i {
  font-size: 18px;
  position: relative;
  top: 2px;
}
.emotion-list_div {
  /* width: 350px; */
  height: 90px;
  padding-left: var(--default-padding-base);
  border: 1px solid var(--theme-base-border-color-primary);
}
.emotion-list_div .emotion-list .li {
  list-style: none;
  display: inline-block;
  margin:0 2px;
}
.emotion-list_div .emotion-list .li img {
  width: 20px;
  height: 20px;
}
.cursor-pointer,
>>> .emotion-list .li {
  cursor: pointer;
}
>>> .template-page__row {
  overflow: hidden;
}
>>> .template-page__row-left {
  flex-shrink: 0;
}
>>> .template-page__row-right {
  overflow: auto;
  .template-table {
    min-width: 720px;
  }
}
@component-namespace speech {
  @b left {
    @e search {
      margin: var(--default-margin-small) 0;
    }
  }
}
</style>
