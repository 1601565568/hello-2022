<template>
  <div class="template-page__row">
    <div class="template-page__row-left">
      <ns-button type="primary" @click="onAddCategory">新增分类</ns-button>
      <div class="speech-left__search">
        <el-input
          placeholder="请输入分类名称"
          v-model="categoryModel.name"
          @keyup.enter.native="findQuicklyWordGroupList()"
        >
          <Icon type="search" slot="suffix" class="el-input__icon" @click="findQuicklyWordGroupList()"/>
        </el-input>
      </div>
      <div>
        <span>分类</span>
        <el-tooltip content="拖动调整同层级下分类顺序，导购和客服端同步">
          <Icon type="question-circle" class="ml5"/>
        </el-tooltip>
      </div>
      <el-scrollbar ref="fullScreen">
        <ns-tree
          draggable
          node-key="id"
          :data="wordGroupList"
          :highlight-current="true"
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
          :showIcon="true"
          @node-click="onTreeSelect"
          @node-drop="handleDrop"
          @icon-add-click="onAddCategory"
          @icon-edit-click="onEditCategory"
          @icon-delete-click="onRemoveCategory"
        >
        </ns-tree>
      </el-scrollbar>
    </div>
    <div class="template-page__row-right">
      <ns-page-table>
        <template slot="buttons" class="quickWordsArt">
          <ns-button type="primary" @click="onSaveOpen()" class="quickWordsArt">新增话术</ns-button>
          <ns-button type="primary" :disabled="!batchDis" @click="onPatchChangeOpen()">批量分类</ns-button>
          <ns-button type="primary" :disabled="!batchDis" @click="onPatchDelete()">批量删除</ns-button>
        </template>
        <!-- 快捷搜索 -->
        <template slot="searchSearch">
          <el-form :model="model" :inline="true" @submit.native.prevent class="pull-right">
            <el-form-item v-show="!_data._queryConfig.expand" label="标题：">
              <el-input
                ref="quickText"
                v-model="model.name"
                placeholder="请输入文件夹或素材标题"
                @keyup.enter.native="quickSearch()"
                style="width: 180px"
                clearable
              >
                <!-- <Icon type="search" slot="suffix" class="el-input__icon" @click="quickSearch()"/> -->
              </el-input>
            </el-form-item>
            <el-form-item v-if="!quickObj.expanded">
              <ns-button type="primary" @click="quickSearch">{{$t('operating.search')}}</ns-button>
              <ns-button @click="resetAction">{{$t('operating.reset')}}</ns-button>
            </el-form-item>
            <el-form-item>
              <ns-button type="text" @click="handleSearchType">
                {{quickObj.collapseText}}
                <Icon :type="quickObj.expanded ? 'up' : 'down'"/>
              </ns-button>
            </el-form-item>
          </el-form>
        </template>
        <!-- 简单搜索 -->
        <!-- el-form 需添加 @submit.native.prevent 配置 -->
        <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
        <template slot="searchSearch">
          <el-form :model="model" :inline="true" @submit.native.prevent  class="pull-right">
            <el-form-item label="添加人/分类：">
              <el-input ref="quickText" porp="" style="width: 200px" v-model="model.searchValue" @input="searchLength" placeholder="请输入添加人/分类" @keyup.enter.native="$searchAction$()" clearable>
              </el-input>
              <ns-button type="primary" @click="$searchAction$()" class="searchbtn">搜索</ns-button>
              <ns-button @click="reset()" class="resetbtn">重置</ns-button>
            </el-form-item>
          </el-form>
        </template>
        <!-- 简单搜索-结束 -->
        <!-- 表格 -->
        <template slot="table">
          <el-table
            ref="multipleTable"
            :data="_data._table.data"
            stripe
            resizable
            v-loading.lock="_data._table.loadingtable"
            :element-loading-text="$t('prompt.loading')"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" align="center"  :width="50"></el-table-column>
            <el-table-column prop="content" label="话术内容" :show-overflow-tooltip="true" align="left"></el-table-column>
            <el-table-column prop="name" label="分类" align="left"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" align="left" ></el-table-column>
            <el-table-column align="left" v-if="showOrder">
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
            </el-table-column>
            <el-table-column prop="addName" label="创建人" align="left"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="操作" align="center" width="100px">
              <template slot-scope="scope">
              <span class="tmp-cell__buttons">
                <ns-button type="text" @click="onSaveOpen(scope.row)">编辑</ns-button>
                <ns-button type="text" @click="onDelete(scope.row)">删除</ns-button>
              </span>
              </template>
            </el-table-column>
          </el-table>
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
    <el-dialog width="800px" :title="titleText"
               :visible.sync="dialogFormVisible"
               :modal-append-to-body="false"
               @before-close="closeDialog()">
      <el-form :model="model" ref="form" label-width="90px" :rules="rules" placement="right">
        <el-form-item label="选择分类：" prop="wordGroupId" required>
          <el-select  v-model="model.wordGroupId" placeholder="请选择话术分类">
            <el-option v-for="wordGroup in selectwordGroupList" :label="wordGroup.name" :value="wordGroup.id" :key="wordGroup.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="话术内容：" prop="content" required>
            <el-input type="textarea" placeholder="输入话术内容，最多200字" @input="contentCheck" v-model="model.content"  size="small" rows="4" ></el-input>
          <div class="expressionBar_div">
            <i @click="faceFace" class="cursor-pointer"><Icon type="biaoqing"/></i>
          </div>
        </el-form-item>
        <el-form-item v-if="InternetMemeShow" label="" prop="">
          <!-- 表情弹窗 -->
          <div v-if="InternetMemeShow" class="emotion-list_div">
            <div class="emotion-list">
              <div class="li" v-for="list in emotionList" :key="list.ShortCut" @click="setEmotionWords(list.ShortCut)">
                <el-tooltip :content="list.Meaning">
                  <img :src="list.OriginalFile">
                </el-tooltip>
              </div>
            </div>
          </div>
        </el-form-item>
<!--        <el-form-item label="设置关键词："  prop="keyWord">-->
<!--          <el-input type="textarea" placeholder="用'，'号隔开，最多设置五个词" @input="keyWordCheck" v-model="model.keyWord" size="small" rows="3"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="添加人：" prop="addName">
          <el-input type="text" disabled v-model="model.addName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="closeDialog()">取消</ns-button>
        <ns-button type="primary" @click="onSave">确定</ns-button>
      </div>
    </el-dialog>
    <!-- 批量管理初始弹窗结束 -->
    <el-dialog size="small" title="批量分类"
               :visible.sync="dialogVisiblePatchChange"
               :modal-append-to-body="false"
               width='600px'
               @before-close="closeDialog()">
      <el-form :model="model" ref="form" label-width="90px" :rules="rules"   placement="right">
        <el-form-item label="选择分类：" prop="wordGroupId"  required>
<!--          :required="model.wordGroupId ? true : false"-->
          <el-select  v-model="model.wordGroupId" filterable clearable placeholder="请选择配置项类型">
            <el-option v-for="wordGroup in selectwordGroupList" :label="wordGroup.name" :value="wordGroup.id" :key="wordGroup.id"></el-option>
          </el-select>
        </el-form-item>
<!--        <el-form-item label="编辑关键词：" prop="keyWord">-->
<!--          <el-input type="text" placeholder="如果未输入内容，则保持原有关键词不变。用“，”号隔开，最多设置五个词" v-model="model.keyWord"></el-input>-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="closeDialog()">取消</ns-button>
        <ns-button type="primary" @click="onPatchChange">保存</ns-button>
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
            placeholder="请输入分类名称，长度在1-10个字符以内"
            v-model="addOrEditCategory.model.name"
            autofocus
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="closeDialog()">取消</ns-button>
        <ns-button type="primary" @loading="addOrEditCategory.loading" @click="onSaveCategory">保存</ns-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import List from './src/List'
import ElMenu from '@nascent/nui/lib/menu'
import ElMenuItem from '@nascent/nui/lib/menu-item'
import NsTree from '@nascent/ecrp-ecrm/src/components/NsTree'
List.components = { NsTree, ElMenu, ElMenuItem }
export default List
</script>
<style scoped>
@import "@theme/variables.pcss";
.quickButtonsAdd{
  color: #FFFFFF;
  background-color: #1a9cfb;
  border-color: #0091fa;
}
.quickButtons{
  color: #FFFFFF;
  background-color: #80c8fd;
  border-color: #80c8fd;
}
.topHid {
    visibility: hidden;
}
.el-col-8 .template-table-buttons .el-form-grid{
  margin-right: 8px
}
.el-tooltip__popper{
  max-width: 78% !important
}
  >>> .template-table__bar .template-table-buttons .el-form-grid {
    margin-right: var(--default-margin-base);
  }

.dialog_mian_topText p sapn{
  color:grey;
}
.dialog_mian_topText p{
  height: 30px;
  line-height: 30px;
}
.sort{
  font-size: var(--default-font-size-base);
  color: var(--theme-color-primary);
  cursor: pointer;
}
.expressionBar_div{
  width: 100%;
  height: 30px;
  background-color:#eee;
  border-radius: 0 0 3px 3px;
  padding-left: 5px;
}
.expressionBar_div i{
  font-size: 18px;
  position: relative;
  top: 2px;
}
.emotion-list_div {
  width: 350px;
  height: 147px;
  padding-left: var(--default-padding-base);
  border: 1px solid var(--theme-base-border-color-primary);
}
.emotion-list_div .emotion-list .li{
  list-style: none;
  display: inline-block;
  margin:0 2px;
}
.emotion-list_div .emotion-list .li img{
  width: 20px;
  height: 20px;
}
.subdivision-tree-node i{
  font-size: 12px;
}
@component-namespace menu {
  @b item {
    height: 40px;line-height:40px;
    &.is-active {
      background-color: var(--default-menu-active-border);

      .item-title {
        color: var(--head-nav-bg);
        line-height: 45px;
      }
    }

    &:hover {
      background-color: var(--default-menu-active-border);
    }
  }

}
@component-namespace navTree {
  .navTree{
    @b item{
      flex: 1;
      padding:0 5px;
    }
  }

}

  .deleteicon {
    font-size: var(--default-font-size-middle);
    position: relative;
    top: 1px;
  }
  .controlstatus {
    display: none;
  }
  .navTree-item:hover {
    .dataName {
      color: var(--theme-color-primary);
    }
    .controlstatus {
      color: var(--theme-color-primary);
      display: block;
    }
  }
 .searchbtn {
   margin-left: 11px;
 }
 .resetbtn {
   margin-left: var(--default-margin-larger);
 }

/* 表情包新增手型 start */
.cursor-pointer, >>> .emotion-list .li  {
  cursor: pointer;
}
/* 表情包新增手型 end */
@component-namespace speech {
  /* 左侧分类 start */
  @b left {
    @e search {
      margin: var(--default-margin-small) 0;
    }
  }
  /* 右侧列表 start */
}
</style>
