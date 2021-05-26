<template>
  <div class="template_main">
    <div class="template-page">
      <div class="page-header fl_between">
        <div class="page-header__text">
          敏感词监控
        </div>
        <div class="page-header__search">
          <el-date-picker
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            :clearable="false"
            :picker-options="pickerOptions"
            @change="handlerChangeTime"
            v-model="time"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
          <el-input
            @keyup.enter.native="onSearch"
            @clear="onSearch"
            clearable
            style="width:240px;margin-left:16px;"
            placeholder="请输入敏感词"
            v-model="model.name"
          ></el-input>
        </div>
      </div>
    </div>
    <div class="template-page__content">
      <div class="template-page__left">
        <div class="content_header">
          敏感词列表
          <img
            class="add"
            :src="nsAddBorder"
            @click="onShowAddSensitiveWords"
          />
        </div>
        <div
          v-loading="listLoading"
          class="loadMoreWrapper"
          v-infinite-scroll="handlerScroll"
          :infinite-scroll-disabled="listIsScroll"
          :infinite-scroll-distance="5"
          ref="loadMoreWrapper"
        >
          <ul class="user_list">
            <li
              v-for="item in list"
              :key="item.id"
              @click="selectUser(item.id)"
              :class="item.id === select ? 'user_list_select' : ''"
            >
              <div class="topic-text">
                {{ item.word }}
              </div>
              <div class="topic-Number">
                {{ item.count }}
              </div>
              <span class="del" @click.stop="listDeleteItem(item.id)">
                <Icon type="delete"/>
              </span>
            </li>
          </ul>
          <p class="getMoreloading" v-if="getListMore && !listLoading">
            加载中...
          </p>
          <p class="getMoreloading"
            v-if="!getListMore && !listLoading && listLoading.length !== 0">
            没有更多了
          </p>
          <NsNoData v-if="!listLoading && listLoading.length === 0"
          >暂无数据</NsNoData>
        </div>
        <div class="content_bottom"></div>
      </div>
      <div class="template-page__right">
        <div class="template-page__right__content">
          <div class="list-content_header">
            <h1>敏感词命中明细</h1>
<!--            <p>统计近3个月数据明细</p>-->
          </div>
          <div class="chat_record">
            <el-scrollbar ref="fullScreen" class="el-scrollbar__wrap__padding">
              <el-table
                ref="multipleTable"
                :data="table.tableData"
                :element-loading-text="$t('prompt.loading')"
                v-loading.lock="table.loading"
                stripe
                resizable
              >
                <el-table-column label="头像">
                  <template slot-scope="scope">
                    <img :src="scope.row.avatar" class="scope-title_img" />
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="昵称"> </el-table-column>
                <el-table-column
                  prop="content"
                  label="内容"
                  :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column label="操作" fixed="right" :width="150">
                  <template slot-scope="scope">
                    <ns-button type="text" @click="getContext(scope.row)"
                      >查看</ns-button
                    >
                  </template>
                  <!-- <template slot-scope="scope">
                  <ns-table-column-operate-button
                    :buttons="table.operate_buttons"
                    :prop="scope"
                  ></ns-table-column-operate-button>
                </template>  -->
                </el-table-column>
              </el-table>
            </el-scrollbar>
            <el-pagination
              :page-sizes="pagination.sizeOpts"
              :total="pagination.total"
              :current-page.sync="pagination.page"
              :page-size.sync="pagination.size"
              @size-change="handleSizeChange"
              @current-change="handlePageChange"
              class="template-table__pagination"
              layout="total, sizes, prev, pager, next, jumper"
            ></el-pagination>
            <!-- <ChatRecordList /> -->
          </div>
        </div>
      </div>
    </div>
    <el-drawer
      size="720px"
      :modal="false"
      :visible.sync="drawer"
      :with-header="false"
    >
      <ItemDrawer
        :dataList="weWorkChatData"
        @getMore="getMore"
        :drawer="drawer"
        @handleClose="handleClose"
        @handleScrollTop="handleScrollTop"
      />
    </el-drawer>
    <AddSensitiveWords ref="AddSensitiveWords" @add="add" />
    <!-- <el-dialog :visible.sync="delShow" width="30%">
      <div class="tipsShowTitle" slot="title">提示信息</div>
      <div class="tipsShowContent">
        <span class="ns-warm-cricle">!</span>确定要删除话题“话题名称”吗？
      </div>
      <span slot="footer" class="dialog-footer">
        <ns-button @click="delShow = false">取 消</ns-button>
        <ns-button type="primary" @click="delShow = false">确 定</ns-button>
      </span>
    </el-dialog> -->
  </div>
</template>
<script>
import Index from './src/index'
export default Index
</script>
<style>
/* .el-scrollbar__wrap__padding /deep/ .el-scrollbar__wrap {
  padding-bottom: 17px !important;
} */
/* .el-scrollbar__wrap {
  margin-bottom: 0px !important;
} */
</style>
<style lang="scss" scoped>
.fl_between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.getMoreloading {
  height: 64px;
  line-height: 64px;
  // padding: 0 16px;
  text-align: center;
}
.page-header {
  background: #ffffff;
  margin: -10px -10px 0;
  padding: 0px 16px;
  min-height: 66px;
  margin-bottom: 16px;
}
.page-header__text {
  font-size: 16px;
  color: #262626;
  font-weight: bold;
}
.page-header__search {
  display: flex;
  justify-content: space-between;
}
.content_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  padding: 0px 16px;
  height: 60px;
  line-height: 60px;
  font-size: 16px;
  background: #ffffff;
  color: #262626;
  img {
    width: 16px;
    height: 16px;
    image-rendering: -moz-crisp-edges;
    image-rendering: -o-crisp-edges;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    -ms-interpolation-mode: nearest-neighbor;
  }
  .add {
    width: 18px;
    height: 18px;
    margin-left: 8px;
  }
}
.list-content_header {
  display: flex;
  flex-flow: column;
  justify-content: center;
  padding: 0px 16px;
  height: 76px;
  background: #ffffff;
  color: #262626;
  font-weight: bold;
  h1 {
    margin: 0;
    font-size: 16px;
    line-height: 24px;
  }
  p {
    font-size: 12px;
    color: #8c8c8c;
    // line-height: 20px;
  }
}
.loadMoreWrapper {
  overflow: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
.content_bottom {
  width: 100%;
  height: 16px;
}
.user_list {
  // margin-top: 16px;
  overflow: auto;
  scrollbar-width: none;
  list-style: none;
  padding: 0px;
  li {
    position: relative;
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0px 16px;
    border-radius: 2px;
    user-select: none;
    font-size: 14px;
    color: #262626;
    .topic-text {
      width: 110px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .topic-Number {
      margin-left: 16px;
    }
    .del {
      display: none;
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    &:hover {
      background: #d9effe;
      .del {
        cursor: pointer;
        display: block;
      }
    }
  }
}
.user_list_select {
  background: #d9effe;
}
.template-page__left__children {
  position: absolute;
  left: 220px;
  top: 0px;
  z-index: 2;
  overflow: hidden;
  width: 173px;
  background: #ffffff;
  border-left: 1px solid #e8e8e8;
}
.customer_list__warpper {
  padding: 0 16px;
  .customer_list__item {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 8px;
    font-size: 14px;
    color: #262626;
    border-radius: 2px;
    line-height: 48px;
    height: 48px;
    .topic-text {
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .del {
      display: none;
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    &:hover {
      background: #f5f5f5;
      .del {
        display: block;
      }
    }
  }
}
.template-page__right__content {
  margin-left: 236px;
}
.template-page__right_content {
  margin-left: 408px;
}
.template-page__content {
  position: relative;
  display: flex;
  width: 100%;
}
.template-page__left {
  width: 220px;
  position: absolute;
  // left: 210px;
  // top: 70px;
  z-index: 2;
  background: #ffffff;
  overflow: hidden;
  // >>> .el-input {
  //     margin-bottom: var(--default-margin-base);
  // }
}
.template-page__right {
  position: absolute;
  // top: 70px;
  left: 0;
  z-index: 1;
  margin: 0;
  width: 100%;
}
// .template-table {
//     margin: 0 10px 10px 435px;
// }
@media screen and (min-width: 1624px) {
  // .el-tree-node__content {
  //     width: 210px;
  // }
  .template-page__left {
    width: 220px;
    position: absolute;
    // left: 210px;
    // top: 90px;
    z-index: 2;
    overflow: hidden;
  }
  .template-page__right {
    position: absolute;
    // top: 90px;
    left: 0;
    z-index: 1;
    width: 100%;
    margin: 0;
  }
  .template-page__left__children {
    position: absolute;
    top: 0;
    left: 220px;
  }
}
.customer_list__width {
  width: 0px;
  border-left: 0px solid #e8e8e8;
}
.tipsShowTitle {
  padding-top: 5px;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}
.tipsShowContent {
  padding: 16px 5px;
  color: #595959;
  font-size: 14px;
}
.ns-warm-cricle {
  display: inline-block;
  text-align: center;
  line-height: 14px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ffaa00;
  color: #fff;
  margin-right: 10px;
}
.scope-title_img {
  width: 32px;
  height: 32px;
  border-radius: 4px;
}
</style>
