<template>
  <div id='SgQuicklyWordPage'>
    <div id="box_left">
      <ns-button type="primary" @click="onSaveQuicklyWordGroupOpen">新增分类</ns-button>
      <div class='ptb5 bg-white pl5' >
        <span class="demonstration">分类</span>
        <el-tooltip content="拖动调整分类排序，导购和客服端同步">
          <Icon type="question-circle"/>
        </el-tooltip>
      </div>
<!--      <el-scrollbar wrapStyle="overflow-x:hidden;" style="max-height: 300px; overflow-y: auto;    margin-bottom: 0px; margin-right: 0px;">-->
        <div :class="offsetHeight?'elTrees':'elTree'" ref="elTree">
          <el-tree :data="wordGroupList" default-expand-all @node-click="onClickNode" @node-drop="handleDrop" draggable :allow-drop="allowDrop"
          :allow-drag="allowDrag"
          node-key="id"
          :current-node-key='null'
          :highlight-current = 'true'
          class='navTree'
          >
          <div class="navTree-item flex flex-between" slot-scope="{ node, data }" >
            <span class="dataName">{{ data.name }}</span>
            <span v-if='data.id' class="controlstatus">
              <Icon type="delete" @click="deleteTheGroup(data)" className="deleteicon" />
              <Icon type="bianji-1" @click="onSaveQuicklyWordGroupOpen(data)"/>
            </span>
          </div>
          </el-tree>
        </div>
<!--      </el-scrollbar>-->
    </div>
    <div id="box_right">
      <ns-page-table>
        <!-- 按钮 -->
<!--        <template slot="buttons" class="quickWordsArt" >-->
<!--          <ns-table-operate-button :buttons="_data._table.table_buttons"></ns-table-operate-button>-->
<!--        </template>-->
<!--        <template slot="buttons">-->
<!--          <template v-for="btnItem in _data._table.table_buttons" >-->
<!--            <ns-button v-if="btnItem.name === '新增话术'" :key="btnItem.name" class="quickButtonsAdd" :type="btnItem.type" v-on:click="btnItem.func">{{btnItem.name}}</ns-button>-->
<!--            <ns-button v-else-if="btnItem.name === '批量删除'" id="batchDelete"  :key="btnItem.name" class="quickButtons" :disabled="btnItem.disabled" :type="btnItem.type" v-on:click="btnItem.func">{{btnItem.name}}</ns-button>-->
<!--            <ns-button v-else-if="btnItem.name === '批量管理'" id="batchChange"  :key="btnItem.name" class="quickButtons" :disabled="btnItem.disabled" :type="btnItem.type" v-on:click="btnItem.func">{{btnItem.name}}</ns-button>-->
<!--          </template>-->
<!--        </template>-->
        <template slot="buttons" slot-scope = "scope" class="quickWordsArt">
          <ns-button type="primary" @click="onSaveOpen(scope)" class="quickWordsArt" >新增话术</ns-button>

          <ns-button type="primary" v-if="batchDis"  ref="batchChange"  @click="onPatchChangeOpen()"  style="border-color: #80c8fd; background-color: #80c8fd" >批量管理</ns-button>
          <ns-button type="primary" disabled v-else   ref="batchChange"  style="border-color: #80c8fd; background-color: #80c8fd" >批量管理</ns-button>
          <ns-button type="primary" v-if="batchDis"      ref="batchDelete"  @click="onPatchDelete()"    style="border-color: #80c8fd; background-color: #80c8fd" >批量删除</ns-button>
          <ns-button type="primary" disabled v-else   ref="batchDelete"    style="border-color: #80c8fd; background-color: #80c8fd" >批量删除</ns-button>
        </template>
<!--        <el-col :span="7">-->
<!--          <ns-button type="primary" v-if="color" @click="setGroudShowToggle">批量设置分组</ns-button>-->
<!--          <ns-button type="primary" disabled v-else  >批量设置分组</ns-button>-->
<!--          <ns-button type="primary" v-if="color" @click="deleteSubdivision">删除</ns-button>-->
<!--          <ns-button disabled type="primary" v-else >删除</ns-button>-->
<!--        </el-col>-->
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
          <el-table ref="multipleTable" :data="_data._table.data"
                    stripe
                    tooltip-effect="dark"
                    @selection-change="handleSelectionChange"
            resizable v-loading.lock="_data._table.loadingtable"
            :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
            <el-table-column type="selection" align="center"  :width="50"></el-table-column>
<!--            <el-table-column prop="keyWord" class-name="keyword" width="130" :show-overflow-tooltip="true" label="关键词" align="left"></el-table-column>-->
            <el-table-column prop="content" label="话术内容" :show-overflow-tooltip="true" align="left"></el-table-column>
            <el-table-column prop="name" label="分类" align="left"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" align="left" ></el-table-column>
            <el-table-column align="left" v-if="showOrder">
              <template slot="header">
                排序
                <el-tooltip content="调整排列顺序小程序同步">
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
          <el-pagination v-if="_data._pagination.enable" class="template-table__pagination"
                         :page-sizes="_data._pagination.sizeOpts" :total="_data._pagination.total"
                         :current-page.sync="_data._pagination.page" :page-size="_data._pagination.size"
                         layout="total, sizes, prev, pager, next, jumper" @size-change="$sizeChange$"
                         @current-change="$pageChange$">
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
            <i @click="faceFace"><Icon type="biaoqing"/></i>
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
          <el-input type="text" disabled="true" v-model="model.addName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="closeDialog()">取消</ns-button>
        <ns-button type="primary" @click="onSave">确定</ns-button>
      </div>
    </el-dialog>
    <!-- 批量管理初始弹窗结束 -->
    <el-dialog size="small" title="批量管理"
               :visible.sync="dialogVisiblePatchChange"
               :modal-append-to-body="false"
               width='600px'
               @before-close="closeDialog()">
      <el-form :model="model" ref="form" label-width="90px" :rules="rules" placement="right">
        <el-form-item label="移动到分类：" prop="wordGroupIds">
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
    <el-dialog size="small" :title="titleText"
      :visible.sync="dialogVisibleSaveQuicklyWordGroup"
      :modal-append-to-body="false"
      width='400px'
      @before-close="closeDialog()">
      <el-form :model="addOrEditModel" ref="addOrEditForm" label-width="80px" :rules="addOrEditRules" placement="right">
        <el-form-item label="分类名称：" prop="name" required class="el-form-validate__unHide">
        <el-input type="text" placeholder="请输入分类名称" @input="accountInput"  v-model="addOrEditModel.name" autofocus="autofocus"></el-input>
<!--        <el-input type="text" placeholder="请输入分类名称" @input="accountInput"  :value="addOrEditModel.name" autofocus="autofocus"></el-input>-->
        </el-form-item>
        <el-input style='display:none'></el-input>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="closeDialog()">取消</ns-button>
        <ns-button type="primary" @click="saveOrUpdateQuicklyWordGroup">保存</ns-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import List from './src/List'
import ElMenu from '@nascent/nui/lib/menu'
import ElMenuItem from '@nascent/nui/lib/menu-item'

List.components = {
  ElMenu,
  ElMenuItem
}
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
.elTree{
  overflow-y: auto;
  overflow-x: hidden
}
.elTrees{
  overflow-y: hidden;
  overflow-x: hidden
}
.elTree::-webkit-scrollbar{
  width: 3px;
}
.elTrees .navTree-item .dataName{
  display: inline-block;
  width: 143px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap
}
.elTree .navTree-item .dataName{
  color: var(--theme-font-color-regular);
  display: inline-block;
  width: 136px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap
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

  #box_left{
    width: 220px;
    margin-right: var(--default-margin-small);
    padding: var(--default-padding-base);
    float: left;
    background-color: #ffffff;
    border-radius: 0 0 3px 3px;
  }
  #box_right{
    overflow: hidden;
    background-color: #ffffff
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

  #SgQuicklyWordPage .el-tree-node{
    &.is-current{
      background-color: var(--default-menu-active-border);
    }
    &:hover {
        background-color: var(--default-menu-active-border);
      }
  }
  #SgQuicklyWordPage .el-tree-node__expand-icon{
    display: none;
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
</style>
