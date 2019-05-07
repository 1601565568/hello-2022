<template>
  <div>
    <div id="box_left" style="height: 100%">
      <ns-button class="newClassification" type="primary">新增分类</ns-button>
      <div class="Quickwordtreemenu">
        <el-tree :data="wordGroupList" node-key="id" default-expand-all="false" :render-content="renderContent"
        @node-click="onClickNode" @node-drop="handleDrop" draggable :allow-drop="allowDrop" :allow-drag="allowDrag">
        </el-tree>
        <!-- <div class="subdivision-tree-node" v-for="item in wordGroupList" :key="item.id">
          <i class="iconfont icon-shanchu1" @click="deleteTheGroup()"></i>
          <i class="iconfont icon-bianji1" @click="compile()"></i>
        </div> -->
      </div>
    </div>
    <div id="box_right">
      <ns-page-table>
        <!-- 按钮 -->
        <template slot="buttons">
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
          <el-table ref="multipleTable" :data="_data._table.data" class="template-table__main"
                    stripe
                    tooltip-effect="dark"
                    @selection-change="handleSelectionChange">
            resizable v-loading.lock="_data._table.loadingtable"
            :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
            <el-table-column
              type="selection"
              width="55"></el-table-column>
            <el-table-column prop="keyWord" label="关键词" align="left"></el-table-column>
            <el-table-column prop="content" label="话术内容" align="left"></el-table-column>
            <el-table-column prop="name" label="分组" align="left"></el-table-column>
            <el-table-column align="left" label="排序">
              <template slot-scope="scope">
                <i class='iconfont icon-zhiding sort'   @click='exchangeSort(1,scope.row.id)'></i>
                <i class='iconfont icon-topArr1 sort'   @click='exchangeSort(2,scope.row.id)'></i>
                <i class='iconfont icon-downArr1 sort'   @click='exchangeSort(3,scope.row.id)'></i>
                <i class='iconfont icon-zhidi sort'  @click='exchangeSort(4,scope.row.id)'></i>
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
      <el-form :model="model" ref="form" label-width="150px" :rules="rules" placement="right">
        <el-form-item label="选择分类：" prop="wordGroupId" required>
          <el-select  v-model="model.wordGroupId" placeholder="请选择话术分类">
            <el-option v-for="wordGroup in wordGroupList" :label="wordGroup.name" :value="wordGroup.id" :key="wordGroup.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="话术内容：" prop="content" required>
            <el-input type="textarea" placeholder="输入话术内容，最多200字" v-model="model.content" maxlength="200" size="small" rows="4"></el-input>
          <div class="expressionBar_div">
            <i class="iconfont icon-biaoqing" @click="faceFace"></i>
          </div>
        </el-form-item>
        <el-form-item v-if="InternetMemeShow" label="" prop="" required>
          <!-- 表情弹窗 -->
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
        <el-form-item label="设置关键词：" prop="keyWord" >
          <el-input type="textarea" placeholder="用'，'号隔开，最多设置五个词" v-model="model.keyWord" size="small" rows="3"></el-input>
        </el-form-item>
        <el-form-item label="添加人：" prop="addName">
          <el-input v-if="model.id" type="text" v-model="model.addName"></el-input>
          <el-input v-else type="text" disabled="true" v-model="model.addName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="closeDialog()">取消</ns-button>
        <ns-button type="primary" @click="onSave">确定</ns-button>
      </div>
    </el-dialog>
    <!-- 批量管理初始弹窗结束 -->
    <el-dialog size="small" :title="批量管理"
               :visible.sync="dialogVisiblePatchChange"
               :modal-append-to-body="false"
               @before-close="closeDialog()">
      <el-form :model="model" ref="form" label-width="150px" :rules="rules" placement="right">
        <el-form-item label="移动到分类：" prop="wordGroupId" required>
          <el-select  v-model="model.wordGroupId" filterable clearable placeholder="请选择配置项类型">
            <el-option v-for="wordGroup in wordGroupList" :label="wordGroup.name" :value="wordGroup.id" :key="wordGroup.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编辑关键词：" prop="keyWord" >
          <el-input type="text" placeholder="用“，”号隔开，最多设置五个词" v-model="model.keyWord"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="closeDialog()">取消</ns-button>
        <ns-button type="primary" @click="onPatchChange">保存</ns-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import List from './src/List'
export default List
</script>
<style scoped>
  .Quickwordtreemenu .el-tree-node [class$="-tree-node"] {
    padding-right: 0 !important;
  }
  #box_left{
    width: 14%;
    height: 500px;
    float: left;
    background-color: #ffffff;
    padding:5px 0 0 5px;
  }
  #box_right{
    float: left;
    padding-left: 1%;
    width: 85%;
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
  height: 200px;
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
  margin-bottom: 20px
}
.Quickwordtreemenu{
  display: flex;
  justify-content: space-around;
}
.subdivision-tree-node i{
  font-size: 12px;
}
</style>