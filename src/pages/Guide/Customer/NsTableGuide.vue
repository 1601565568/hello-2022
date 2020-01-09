<template>
  <div calss="NsTableGuide_main">
        <div class="template-page__row-left">
          <el-input ref="quickText" v-model="shopTreePage.shopName" placeholder="输入线下店铺名称" clearable
                    @keyup.enter.native="initShopList(1)">
            <Icon type="search" className="el-input__icon" style="padding: 5px;" slot="suffix" name="name" @click="initShopList(1)"/>
          </el-input>
          <el-scrollbar ref='shopTreeDiv' wrapStyle="overflow-x:hidden;" style="padding-bottom: 10px" >
            <el-tree class="filter-tree" ref="guideTree" :data="shopFindList" highlight-current
                     node-key="id" :default-expand-all="false" :expand-on-click-node="false" :default-checked-keys="[0]"
                     :filter-node-method="onFilterNode" @node-click="onClickNode">
              <div class="subdivision-tree-node" slot-scope="{ node }" >
                <span>{{node.label}}</span>
              </div>
            </el-tree>
          </el-scrollbar>
          <el-pagination style='text-align: center' small
                         :total="shopTreePage.total"
                         :page-size="shopTreePage.size"
                         layout="prev, slot, next, jumper"
                         :current-page.sync="shopTreePage.page"
                         @current-change="initShopList">
            <span>{{shopTreePage.page + '/' + (Math.ceil(shopTreePage.total/ shopTreePage.size) || 1)}}</span>
          </el-pagination>
        </div>
        <div  class="template-page__row-right">
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
        <el-form-item v-show="_data._queryConfig.expand === false" label="手机号：">
          <el-input ref="quickText" style="width: 180px" v-model="model.mobile" placeholder="请输入手机号" @keyup.enter.native="$searchAction$()" clearable>
            <!--<Icon type="search" className="el-input__icon" style="padding: 5px;" slot="suffix" moblie="moblie"-->
                  <!--@click="$searchAction$()"/>-->
          </el-input>
          <ns-button type="primary" @click="$searchAction$()" class="searchbtn" >搜索</ns-button>
          <ns-button @click="$resetInputAction$()" class="resetbtn">重置</ns-button>
        </el-form-item>

        <el-form-item>
          <ns-button type="text" @click="$handleTabClick">
            {{collapseText}}
            <Icon :type="_data._queryConfig.expand ? 'up' : 'down'"/>
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
            <el-input style="width:180px" autofocus=true v-model="model.customerName" placeholder="请输入姓名" clearable></el-input>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="手机号：">
          <el-form-grid size="xmd">
            <el-input style="width:180px" autofocus=true v-model="model.mobile" placeholder="请输入手机号" clearable></el-input>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="昵称：">
          <el-form-grid size="xmd">
            <el-input style="width:180px" autofocus=true v-model="model.nick" placeholder="请输入昵称" clearable></el-input>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="卡号：">
          <el-form-grid size="xmd">
            <el-input style="width:180px" autofocus=true v-model="model.cardId" placeholder="请输入卡号" clearable></el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="等级：">
          <el-form-grid style="width: 180px;">
            <el-select placeholder="请选择" v-model="model.grade" clearable filterable>
              <el-option v-for="grade in gradeInfo" :label="grade.gradeName" :value="grade.grade"
                         :key="grade.grade"></el-option>
            </el-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="入库时间：" prop="time">
          <el-date-picker
            v-model="model.time"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="请选择开始日期"
            end-placeholder="请选择结束日期"
            :default-time="['00:00:00','23:59:59']"
            align="right">
          </el-date-picker>
        </el-form-item>

      </el-form>

      <div class="template-table__more-btn">
        <ns-button type="primary" @click="$searchAction$()">搜索</ns-button>
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

      <el-table ref="table" :data="_data._table.data" stripe @selection-change="handleSelectionChange" v-loading="loading">
        <el-table-column type="selection" align="center" :width="50"></el-table-column>
        <el-table-column prop="outNick" label="姓名" align="left">
          <template slot-scope="scope">
            {{scope.row.customerName || scope.row.outNick || '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" align="left">
          <template slot-scope="scope">
            {{scope.row.mobile?scope.row.mobile:'-'}}
          </template >
        </el-table-column>
        <el-table-column prop="grade,memberCard" label="会员卡号" align="center" width="120">
          <template slot-scope="scope">
              <div v-if="scope.row.memberCard !==null || scope.row.grade !== null">
                <span>{{scope.row.memberCard === undefined ? '-':scope.row.memberCard}}</span>
              </div>
              <div v-if="scope.row.memberCard == null && scope.row.grade === null">
                未绑卡
              </div>
          </template>
        </el-table-column>
        <el-table-column prop="grade" label="等级" align="left" width="120">
          <template slot-scope="scope">
            {{scope.row.grade>0?scope.row.gradeName:'-'}}
          </template>
        </el-table-column>
        <!-- <el-table-column label="关注状态" align="left" width="180">
          <template slot-scope="scope">
            {{!scope.row.province&&!scope.row.city&&!scope.row.district?'-':scope.row.province+'/'+scope.row.city+'/'+scope.row.district}}
          </template>
        </el-table-column> -->
        <el-table-column prop="sgExclusiveGuideName" label="专属导购" align="left">
          <template slot-scope="scope">
              {{scope.row.sgExclusiveGuideName ? scope.row.sgExclusiveGuideName : "-"}}
          </template>
        </el-table-column>

        <el-table-column prop="sgExclusiveShopName" label="所属线下门店" align="left">
          <template slot-scope="scope">
            {{scope.row.sgExclusiveShopName ? scope.row.sgExclusiveShopName : "-"}}
          </template>
        </el-table-column>
        <el-table-column prop="inMemberTime" label="入库时间" align="center" width="160">
            <template slot-scope="scope">
              {{scope.row.inMemberTime?moment(scope.row.inMemberTime):'-'}}
            </template>
        </el-table-column>
        <el-table-column prop="status,row" :show-overflow-tooltip="true" label="操作" align="center" width="100">
          <template slot-scope="scope">
            <div>
              <ns-button style="color:#0091FA" @click="onRedactFun(scope.row,offLineShopId)" type="text">详情</ns-button>
              <ns-button style="color:#0091FA" @click="showTagDailog(scope.row,offLineShopId)" type="text">打标签</ns-button>
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
import NsTableGuide from './src/NsTableGuide'
export default NsTableGuide
</script>

<style scoped>
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
    .el-tree-node__content{
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

  >>> .table-header-icon {
    color: var(--theme-font-color-info);
    font-size: var(--default-font-size-base);
    font-weight: normal;
    padding-left: var(--default-padding-base);
    cursor: pointer;
  }
  .searchbtn {
    margin-left: 11px;
  }
  .resetbtn {
    margin-left: var(--default-margin-larger);
  }
</style>
<style scoped>
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
  display: inline-block;
  width: 143px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap
}
.el-tree {
  overflow-x: hidden;
}

>>> .el-pagination__jump {
  margin-left: unset !important;
}
</style>
