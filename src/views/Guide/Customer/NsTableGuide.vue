<template>
  <el-row class="overview-content__grid" :gutter="15">
      <el-col :span="4">
        <div class="template-page__row-left">
          <el-input ref="quickText" style="width: 250px" v-model="model.name" placeholder="输入姓名或工号" @keyup.enter.native="$quickSearchAction$('name')" clearable>
            <i class="el-icon-search el-input__icon" slot="suffix" name="name" @click="$quickSearchAction$('name')"></i>
          </el-input>
          <!-- <el-scrollbar ref="subdivisionLftHeight">
            <el-tree class="filter-tree" ref="subTree" :data="treeData" :props="defaultProps"  default-expand-all :filter-node-method="onFilterNode"
                     node-key="id" highlight-current :expand-on-click-node="false"
                     @node-collapse="onCloseNode" @node-click="onClickNode">
              <div class="subdivision-tree-node" slot-scope="{ node, data }" @mouseover="onNodeHover(node,data)"  @mouseout="onNodeHover(node,data)">
                <span>{{ node.label }}</span>
                <span v-show="data.extData.showIcon" class="subdivision-tree-node-icon">
                  <span>
                    <i v-show="data.extData.showAddIcon" class="el-icon-circle-plus" @click="onAppendNode(node,data)"></i>
                  </span>
                  <span>
                    <i v-show="data.extData.showEditIcon" class="el-icon-edit" @click="onEditNode(node,data)"></i>
                  </span>
                  <span>
                    <i v-show="data.extData.showDeleteIcon" class="el-icon-delete" @click="onDeleteNode(node, data)"></i>
                  </span>
                </span>
              </div>
            </el-tree>
          </el-scrollbar> -->
            <el-tree class="filter-tree" :data="shopFindList">
              <div class="subdivision-tree-node" slot-scope="{ node, data }" >
                <span>{{node.label}}</span> 
                <!-- <span class="numberOfPeople">{{data.children.length}}人</span> -->
                <!-- <span>{{node.parentId}}</span> -->
                <span class="subdivision-tree-node-icon">
                  <span>
                    
                  </span>
                  <span>
                    
                  </span>
                  <span>
                    
                  </span>
                </span>
              </div>
            </el-tree>
        </div>
      </el-col>
      <el-col :span="20">
        <ns-page-table @add="$emit('add')"  @shopEdit="$emit('shopEdit')" >
    <!-- 按钮 -->
    <template slot="buttons">
      <ns-table-operate-button :buttons="_data._table.table_buttons">
      </ns-table-operate-button>
    </template>
    <!-- 按钮-结束 -->

    <!-- 简单搜索 -->
    <!-- el-form 需添加 @submit.native.prevent 配置 -->
    <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
    <template slot="searchSearch">
      <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent  class="pull-right">
        <el-form-item v-show="_data._queryConfig.expand === false">
          <el-input ref="quickText" style="width: 250px" v-model="model.name" placeholder="姓名/手机号/会员卡号" @keyup.enter.native="$quickSearchAction$('name')" clearable>
            <i class="el-icon-search el-input__icon" slot="suffix" name="name" @click="$quickSearchAction$('name')"></i>
          </el-input>
        </el-form-item>

        <el-form-item>
          <ns-button type="text" @click="$handleTabClick">
            {{collapseText}}
            <i :class="{'el-icon--right': true, 'el-icon-arrow-down': !_data._queryConfig.expand, 'el-icon-arrow-up': _data._queryConfig.expand} ">
            </i>
          </ns-button>
        </el-form-item>
      </el-form>
    </template>
    <!-- 简单搜索-结束 -->

    <!-- 高级搜索 -->
    <!-- el-form 需添加  @keyup.enter.native="onSearch" 配置，实现回车搜索， onSearch 为搜索方法 -->
    <!-- el-form 需添加  surround-btn 类名 配置环绕按钮效果 -->
    <template slot="advancedSearch" v-if="_data._queryConfig.expand">
      <el-form ref="table_filter_form" :model="model" label-width="80px" :inline="true">

        <el-form-item label="姓名：">
          <el-form-grid size="xmd">
            <el-input style="width:180px" autofocus=true v-model="model.name" placeholder="请输入姓名" clearable></el-input>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="手机号：">
          <el-form-grid size="xmd">
            <el-input style="width:180px" autofocus=true v-model="model.name" placeholder="请输入手机号" clearable></el-input>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="昵称：">
          <el-form-grid size="xmd">
            <el-input style="width:180px" autofocus=true v-model="model.name" placeholder="请输入昵称" clearable></el-input>
          </el-form-grid>
        </el-form-item>
      </el-form>

      <div class="template-table__more-btn">
        <ns-button type="primary" @click="search">搜索</ns-button>
        <ns-button @click="$resetInputAction$()">重置</ns-button>
      </div>
    </template>
    <!-- 高级搜索-结束 -->

    <!-- 表格 -->
    <template slot="table">
      <!-- 表格配置 不能添加 border 配置 -->
      <!-- 表格配置 需添加 stripe （实现斑马线效果） -->

      <!-- 表格单元格宽度配置规范 -->
      <!-- 复选框/单选框 :width="45" -->
      <!-- 日期 年月日 :width="100"   年月日时分秒 :width="150" -->
      <!-- 手机号 :width="120" -->
      <!-- 操作（只有一项文字的80px,两项文字120px,三项文字160px） -->

      <el-table ref="table" :data="_data._table.data" stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="42"></el-table-column>
        <el-table-column prop="name" label="客户姓名" align="left" width="180">
          <template slot-scope="scope">
            {{scope.row.name?scope.row.name:'-'}}
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" align="left" width="120">
          <template slot-scope="scope">
            {{scope.row.mobile?scope.row.mobile:'-'}}
          </template >
        </el-table-column>
        <el-table-column prop="grade,memberCard" label="客户类型/卡号" align="left" >
          <template slot-scope="scope">
              <div v-if="scope.row.memberCard != null && scope.row.grade">
                {{scope.row.grade?scope.row.grade:'-' +'/'+scope.row.memberCard}}
              </div>
              <div v-else>
                非会员
              </div>
          </template>
        </el-table-column>
        <el-table-column prop="nickName" label="昵称" align="left" width="180">
          <template slot-scope="scope">
            {{scope.row.nickName?scope.row.nickName:'-'}}
          </template>
        </el-table-column>
        <!-- <el-table-column label="关注状态" align="left" width="180">
          <template slot-scope="scope">
            {{!scope.row.province&&!scope.row.city&&!scope.row.district?'-':scope.row.province+'/'+scope.row.city+'/'+scope.row.district}}
          </template>
        </el-table-column> -->
        <el-table-column prop="guideName" label="专属导购" align="left" width="120">
          <template slot-scope="scope">
              {{scope.row.guideName ? scope.row.guideName : "-"}}
          </template>
        </el-table-column>
        <el-table-column prop="registerTime" label="招募时间" align="left" width="180">
            <template slot-scope="scope">
              {{scope.row.registerTime?scope.row.registerTime:'-'}}
            </template>
        </el-table-column>
        <el-table-column prop="status,row" :show-overflow-tooltip="true" label="操作" align="right" width="120">
          <template slot-scope="scope">
            <div>
              <ns-button style="color:#0091FA" @click="onRedactFun(scope.row)" type="text">详情</ns-button>
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
                     :current-page="_data._pagination.page"
                     :page-size="_data._pagination.size"
                     layout="total, sizes, prev, pager, next, jumper"
                     @size-change="$sizeChange$"
                     @current-change="$pageChange$">
      </el-pagination>
    </template>
    <!-- 分页-结束 -->
  </ns-page-table>
      </el-col>    
  </el-row> 
</template>

<script>
  import guide from './src/NsTableGuide'

  export default guide
</script>

<style scoped>
  .subdivision-tree-node{
    position: felx;
    justify-content:space-between;
  }
  .template-page__row-left{
    height:685px;
  }

</style>
