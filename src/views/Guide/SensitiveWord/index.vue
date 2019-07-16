<template>
  <div calss="NsTable_main">
    <div class="template-page__row-left" v-loading="treeLoading">
      <el-input v-model="filterTreeText" placeholder="搜索分组" suffix-icon="el-icon-search"/>
      <el-tree :data="groupList" ref="groupTree" node-key="id" :expand-on-click-node="false"
               :filter-node-method="onFilterNode" @node-click="onClickNode" highlight-current>
        <span class="custom-tree-node" slot-scope="{ node, data }"
              @mouseover="setCurrentNodeId(data.id)"
              @mouseleave="setCurrentNodeId(0)">
          <span style="width:100px">
            {{ node.label }}
          </span>
          <span v-if="data.ext1!=null" v-show="isShowTreeNodePlus(data.id)">
            <i class="el-icon-plus" v-if="data.parentId==0" @click="showEditGroupMsgBox(data,true)"/>
            <i class="el-icon-edit-outline" size="mini" @click="showEditGroupMsgBox(data,false)"/>
            <i class="el-icon-delete" size="mini" @click="removeGroup(data.id)"/>
          </span>
        </span>
      </el-tree>
      <div v-show="isShowAddTreeNodePanel" style="width:200px;text-align:center;">
        <el-input placeholder="请输入分组名称" v-model="groupName" style="width:180px">
          <i slot="suffix" class="el-input__icon el-icon-check" @click="addRootGroup()"></i>
          <i slot="suffix" class="el-input__icon el-icon-close" @click="setAddTreeNodePanelDisplay(false)"></i>
        </el-input>
      </div>
      <div style="width:200px;text-align:center;">
        <i class="el-icon-plus" @click="setAddTreeNodePanelDisplay(!isShowAddTreeNodePanel)">
          新分组
        </i>
      </div>
    </div>
    <div class="template-page__row-right">
      <ns-page-table>
        <!-- 按钮 -->
        <template slot="buttons">
          <ns-table-operate-button :buttons="_data._table.table_buttons">
          </ns-table-operate-button>
        </template>
        <!-- 按钮-结束 -->

        <!-- 搜索 -->
        <template slot="searchSearch">
          <el-form :model="model" :inline="true" @submit.native.prevent class="pull-right">
            <el-form-item>
              <el-input ref="quickText" style="width: 250px" name="name" v-model="model.name" placeholder="搜索敏感词"
                        @keyup.enter.native="$searchAction$()" clearable>
              </el-input>
              <ns-button type="primary" @click="$searchAction$()">搜索</ns-button>
              <ns-button @click="$resetInputAction$()">重置</ns-button>
            </el-form-item>
          </el-form>
        </template>
        <!-- 搜索-结束 -->

        <!-- 表格 -->
        <template slot="table">
          <el-table ref="table" :data="_data._table.data" stripe v-loading="loading">
            <el-table-column prop="name" label="敏感词" align="left" width="510"/>
            <el-table-column prop="groupName" label="分组" align="left" width="300"/>
            <el-table-column prop="count" label="出现次数" align="left" width="200"/>
            <el-table-column prop="creatorName" label="创建人" align="left" width="200"/>
            <el-table-column prop="createTime" label="创建时间" align="left" width="150"/>
            <el-table-column prop="status,row" :show-overflow-tooltip="true" label="操作" align="right" width="60">
              <template slot-scope="scope">
                <div>
                  <ns-button style="color:#0091FA" @click="onRedactFun(scope.row)" type="text">删除</ns-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <!-- 表格-结束 -->

        <!-- 分页 -->
        <template slot="pagination">
          <el-pagination v-if="_data._pagination.enable" class="template-table-pagination"
                         :page-sizes="_data._pagination.sizeOpts"
                         :total="_data._pagination.total"
                         :current-page.sync="_data._pagination.page"
                         :page-size="_data._pagination.size"
                         layout="total, sizes, prev, pager, next, jumper"
                         @size-change="$sizeChange$"
                         @current-change="$pageChange$">
          </el-pagination>
        </template>
        <!-- 分页-结束 -->
      </ns-page-table>
    </div>
  </div>
</template>
<script>
import index from './src/index'
export default index
</script>
<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .template-page__row-left {
    width: 220px;
    position: absolute;
    left: 210px;
    top: 70px;
    z-index: 2;
    overflow: hidden;
  }
  .template-page__row-right {
    position: absolute;
    top: 70px;
    left: 0;
    z-index: 1;
    margin: 0;
    width: 100%;
  }
  .template-table {
    margin: 0 10px 0 440px;
  }
  @media screen and (min-width: 1624px) {
    .template-page__row-left {
      width: 220px;
      position: absolute;
      left: 210px;
      top: 90px;
      z-index: 2;
      overflow: hidden;
    }
    .template-page__row-right {
      position: absolute;
      top: 90px;
      left: 0;
      z-index: 1;
      width: 100%;
      margin: 0;
    }
  }
</style>
