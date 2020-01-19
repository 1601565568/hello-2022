<template>
  <div>
    <Add :visible.sync="addDialog.visible" />
    <GroupDetail
      :visible.sync="groupDetailDialog.visible"
      :group-detail.sync="groupDetailDialog.groupDetail"
    />
    <MemberDetail
      :visible.sync="memberDetailDialog.visible"
      :member-detail.sync="memberDetailDialog.memberDetail"
    />
    <Duplicate :visible.sync="duplicateDialog.visible" />
    <div class="template-page__row-left">
      <el-input ref="quickText" v-model="filterGroup" placeholder="搜索群名">
        <Icon type="search" className="el-input__icon" style="padding: 5px;" slot="suffix" @click="onFilterGroup"/>
      </el-input>
      <div class="elTree">
        <el-scrollbar ref='shopTreeDiv' wrapStyle="overflow-x:hidden;">
          <el-tree
            class="filter-tree"
            ref="groupTree"
            :data="groupList"
            highlight-current
            node-key="id"
            :default-expand-all="false"
            :expand-on-click-node="false"
            :default-checked-keys="[0]"
            :filter-node-method="onFilterGroupNode"
          @node-click="onClickGroupNode"
          >
          <div slot-scope="{ node, data }">
            <el-tooltip :content="(node.label || data.wid) + (data.chatroomname ? '('+data.quantity + ')' : ' / ' + data.quantity)"
                        popper-class="table-body__tooltip" >
              <div class="treelength">
                {{wordLimit((node.label || data.wid) + (data.chatroomname ? '('+data.quantity + ')' : ' / ' + data.quantity))}}
              </div>
            </el-tooltip>
          </div>
        </el-tree>
        </el-scrollbar>
      </div>
    </div>
    <div class="template-page__row-right">
      <ns-page-table>
        <template slot="buttons">
          <ns-table-operate-button :buttons="_data._table.operate_buttons"></ns-table-operate-button>
        </template>
        <template slot="searchSearch">
          <el-form :model="model" :inline="true" @submit.native.prevent class="pull-right">
            <el-form-item v-show="_data._queryConfig.expand === false" label="微信昵称：">
              <el-input
                ref="quickText"
                v-model="model.nick"
                placeholder="请输入微信昵称"
                @keyup.enter.native="$quickSearchAction$('nick')"
              >
                <Icon
                  type="search"
                  className="el-input__icon"
                  slot="suffix" style="padding: 5px;"
                  @click="$quickSearchAction$('nick')"
                />
              </el-input>
            </el-form-item>
            <el-form-item>
              <ns-button type="text" @click="$handleTabClick">
                {{collapseText}}
                <Icon :type="_data._queryConfig.expand ? 'up' : 'down'"/>
              </ns-button>
            </el-form-item>
          </el-form>
        </template>
        <template slot="advancedSearch" v-if="_data._queryConfig.expand">
          <el-form
            ref="table_filter_form"
            label-width="80px"
            @keyup.enter.native="searchAction"
            class="surround-btn"
            :model="model"
            :rules="rules"
            :inline="true"
          >
            <el-form-item label="群名称：">
              <el-form-grid size="xmd">
                <el-input type="text" v-model="model.displayname"></el-input>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="微信昵称：">
              <el-form-grid size="xmd">
                <el-input type="text" v-model="model.nick"></el-input>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="是否好友：">
              <el-form-grid size="xmd">
                <el-select v-model="model.isFriend">
                  <el-option value label="不限" />
                  <el-option value="0" label="否" />
                  <el-option value="1" label="是" />
                </el-select>
              </el-form-grid>
            </el-form-item>
          </el-form>
          <div class="template-table__more-btn">
            <ns-button type="primary" @click="$searchAction$">{{$t('operating.search')}}</ns-button>
            <ns-button @click="$resetInputAction$">{{$t('operating.reset')}}</ns-button>
          </div>
        </template>
        <template slot="table">
          <el-table
            ref="table"
            :data="_data._table.data"
            class="template-table__main"
            stripe
            resizable
            v-loading.lock="_data._table.loadingtable"
            :element-loading-text="$t('prompt.loading')"
            @sort-change="$orderChange$"
            row-key="id"
            @selection-change="$selectionChange"
          >
            <el-table-column
              :show-overflow-tooltip="true"
              type="default"
              prop="title"
              label="头像"
              width="70px"
              :sortable="false"
              align='center'
            >
              <template slot-scope="scope">
                <div class="avatar-name clearfix">
                  <div class="avatar-name__avatar">
                    <img
                      :src="scope.row.isOwner == '1' ? (scope.row.ownerHead || NoImg) : (scope.row.head || NoImg)"
                      alt="会员头像"
                    />
                  </div>
                  <div class="avatar-name__name"></div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              type="default"
              prop="nick"
              label="微信昵称"
              :sortable="false"
              width="200px"
            >
              <template
                slot-scope="scope"
              >{{scope.row.isOwner == "1" ? (scope.row.ownerNick || '-') : (scope.row.nick || '-')}}</template>
            </el-table-column>
            <!--            todo-zsf 暂无以下数据-->
            <el-table-column
              :show-overflow-tooltip="true"
              type="default"
              prop
              label="性别"
              :sortable="false"
              align="center"
              width="80px"
            >
              <template slot-scope="scope"><span :fixScopeBug="scope.testId">-</span></template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              type="default"
              prop
              label="地区"
              :sortable="false"
              width="80px"
            >
              <template slot-scope="scope"><span :fixScopeBug="scope.testId">-</span></template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              type="default"
              prop="displayname"
              label="所属微信群"
              :sortable="false"
            >
              <template slot-scope="scope">
                <el-row>
                  <ns-button
                    type="text"
                    @click="onShowGroupDetail(scope.row)"
                  >{{scope.row.displayname}}</ns-button>
                </el-row>
                <el-row>
                  <span>{{scope.row.chatroomnotice || ''}}</span>
                </el-row>
              </template>
              <template slot="header" scope="header">
                <span>
                  <span>{{header.column.label}}</span>
                  <el-tooltip content="点击群名称，可查看此群下所有微信">
                    <Icon type="question-circle"/>
                  </el-tooltip>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              type="default"
              prop
              label="是否好友"
              :sortable="false"
              width="80px"
              align="center"
            >
              <template
                slot-scope="scope"
              >{{scope.row.rId || scope.row.isOwner == "1" ? '是' : '否' }}</template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="操作" align="center" width="60px">
              <template slot-scope="scope">
                <ns-table-column-operate-button :buttons="_data._table.table_buttons" :prop="scope"></ns-table-column-operate-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <template slot="pagination">
          <el-pagination
            v-if="_data._pagination.enable"
            class="template-table__pagination"
            :page-sizes="_data._pagination.sizeOpts"
            :total="_data._pagination.total"
            :current-page="_data._pagination.page"
            :page-size="_data._pagination.size"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="$sizeChange$"
            @current-change="$pageChange$"
          ></el-pagination>
        </template>
      </ns-page-table>
    </div>
  </div>
</template>
<script>
import Index from './src/index'

export default Index
</script>
<style scoped>
@import "./src/style.pcss";
@import "@theme/variables.pcss";

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
  margin: 0 10px 10px 435px;
}
@media screen and (min-width: 1624px) {
  .el-tree-node__content {
    width: 210px;
  }
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
  .template-table {
    margin: 0 10px 10px 435px;
  }
}

.elTree {
  overflow-y: auto;
  overflow-x: hidden;
}
.elTrees {
  overflow-y: hidden;
  overflow-x: hidden;
}
.elTree::-webkit-scrollbar {
  width: 3px;
}
.elTrees .navTree-item .dataName {
  display: inline-block;
  width: 143px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.elTree .navTree-item .dataName {
  display: inline-block;
  width: 143px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

>>> .table-header-icon {
  font-size: var(--default-font-size-base);
  font-weight: normal;
  padding-left: var(--default-padding-base);
  cursor: pointer;
}
.treelength {
  width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.el-tree {
  overflow-x: hidden;
}
</style>
