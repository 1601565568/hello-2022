<template>
  <div id='SgQuicklyWordPage'>
    <div id="box_left">
      <ns-button class="newClassification ml10" type="primary" @click="onSaveQuicklyWordGroupOpen">新增分类</ns-button>
      <div class='ptb10 bg-white pl15' style='background-color:#efefef;'>
        <span class="demonstration">分类</span>
        <el-popover
          placement="bottom"
          trigger="hover">
          <el-row class="overview-popover">
            拖动调整分类排序，小程序同步
          </el-row>
          <i slot="reference" class="el-icon-question ml5 fz13" style='color:#999'></i>
        </el-popover>
      </div>
      <el-tree :data="wordGroupList" default-expand-all @node-click="onClickNode" @node-drop="handleDrop" draggable :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      node-key="id"
      :current-node-key='null'
      :highlight-current = 'true'
      class='navTree'>
      <div class="navTree-item flex flex-between" slot-scope="{ node, data }" >
        <span>{{ data.name }}</span>
        <span v-if='data.id'>
          <i class="iconfont icon-shanchu1 " @click="deleteTheGroup(data)" style='font-size:18px'></i>
          <i class="iconfont icon-bianji1 ml5" @click="onSaveQuicklyWordGroupOpen(data)"></i>
        </span>
      </div>
      </el-tree>
    </div>
    <div id="box_right">
      <ns-page-table>
        <!-- 按钮 -->
        <template slot="buttons" class="quickWordsArt">
          <ns-table-operate-button :buttons="_data._table.table_buttons"></ns-table-operate-button>
        </template>
        <!-- 简单搜索 -->
        <!-- el-form 需添加 @submit.native.prevent 配置 -->
        <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
        <template slot="searchSearch">
          <el-form :model="model" :inline="true" @submit.native.prevent  class="pull-right">
            <el-form-item>
              <el-input ref="quickText" style="width: 250px" v-model="model.searchValue" placeholder="请输入关键词/添加人/分类" @keyup.enter.native="$quickSearchAction$('code')" clearable>
              </el-input>
              <ns-button type="primary" @click="$searchAction$()">搜索</ns-button>
              <ns-button @click="$resetInputAction$()">重置</ns-button>
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
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="keyWord" class-name="keyword" width="130" :show-overflow-tooltip="true" label="关键词" align="left"></el-table-column>
            <el-table-column prop="content" label="话术内容" width="228" :show-overflow-tooltip="true" align="left"></el-table-column>
            <el-table-column prop="name" label="分类" align="left"></el-table-column>
            <el-table-column prop="createTime" label="添加时间" align="left"></el-table-column>
            <el-table-column align="left" v-if="showOrder" :render-header="renderHeader">
              <template slot-scope="scope">
                <i class='iconfont icon-zhiding sort' :class="scope.row === _data._table.data[0]?'topHid':''"  @click='exchangeSort(1,scope.row.id)'></i>
                <i class='iconfont icon-topArr1 sort' :class="scope.row === _data._table.data[0]?'topHid':''"   @click='exchangeSort(2,scope.row.id)'></i>
                <i class='iconfont icon-downArr1 sort' :class="scope.row === _data._table.data[_data._table.data.length-1]?'topHid':''"   @click='exchangeSort(3,scope.row.id)'></i>
                <i class='iconfont icon-zhidi sort' :class="scope.row === _data._table.data[_data._table.data.length-1]?'topHid':''"  @click='exchangeSort(4,scope.row.id)'></i>
              </template>
            </el-table-column>
            <el-table-column prop="addName" label="添加人" align="left"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="操作" align="right">
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
                         :current-page="_data._pagination.page" :page-size="_data._pagination.size"
                         layout="total, sizes, prev, pager, next, jumper" @size-change="$sizeChange$"
                         @current-change="$pageChange$">
          </el-pagination>
        </template>
      </ns-page-table>
    </div>
    <!-- 初始弹窗开始 -->
    <el-dialog size="small" :title="titleText"
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
            <el-input type="textarea" placeholder="输入话术内容，最多200字" v-model="model.content" maxlength="200" size="small" rows="4"></el-input>
          <div class="expressionBar_div">
            <i class="iconfont icon-biaoqing" @click="faceFace"></i>
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
        <el-form-item label="设置关键词：" prop="keyWord">
          <el-input type="textarea" placeholder="用'，'号隔开，最多设置五个词" v-model="model.keyWord" size="small" rows="3"></el-input>
        </el-form-item>
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
        <el-form-item label="移动到分类：" prop="wordGroupIds" style="margin:25px 0">
          <el-select  v-model="model.wordGroupId" filterable clearable placeholder="请选择配置项类型">
            <el-option v-for="wordGroup in selectwordGroupList" :label="wordGroup.name" :value="wordGroup.id" :key="wordGroup.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编辑关键词：" prop="keyWord" style="margin-bottom:30px">
          <el-input type="text" placeholder="如果未输入内容，则保持原有关键词不变。用“，”号隔开，最多设置五个词" v-model="model.keyWord"></el-input>
        </el-form-item>
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
      width='500px'
      @before-close="closeDialog()">
      <el-form :model="addOrEditModel" ref="addOrEditForm" label-width="80px" :rules="addOrEditRules" placement="right" class='addOrEditForm'>
        <el-form-item label="分类名称：" prop="name" required >
          <el-input type="text" placeholder="请输入分类名称" v-model="addOrEditModel.name" ></el-input>
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
import ElMenu from 'nui-v2/lib/menu'
import ElMenuItem from 'nui-v2/lib/menu-item'

List.components = {
  ElMenu,
  ElMenuItem
}
export default List
</script>
<style>
.topHid {
    visibility: hidden;
}
.el-col-8 .template-table-buttons .el-form-grid{
  margin-right: 8px
}
.el-tooltip__popper{
  max-width: 78% !important
}
</style>
<style scoped>
 @import "@/style/small/variables.pcss";
  #box_left{
    width: 220px;
    margin-right: 10px;
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
  color:#0091FA;
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
}
.emotion-list_div {
  width: 350px;
  height: 160px;
  margin-top: 10px;
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
.newClassification{
  margin-bottom: 10px
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
@component-namespace addOrEditForm {
  .addOrEditForm{
    padding: 30px 0 !important
  }

}
@component-namespace navTree {
  .navTree{
    @b item{
      flex: 1;
      height:40px;
      line-height:40px;
      padding:0 15px;
    }
  }

}
</style>
<style lang='scss'>
 @import "@/style/small/variables.pcss";
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
</style>
