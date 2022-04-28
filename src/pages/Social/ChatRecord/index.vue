<template>
  <div id="chatRecordPage" class="template_main">
    <div class="template-page">
      <div class="page-header fl_between">
        <div class="tabs">
          <el-tabs
            :value="activeName"
            @input="handleClick"
            :before-leave="beforeLeave"
          >
            <el-tab-pane label="好友" name="1"></el-tab-pane>
            <el-tab-pane label="群" name="2"></el-tab-pane>
            <el-tab-pane :label="this.formatTabName()" name="3"></el-tab-pane>
          </el-tabs>
        </div>
        <div>
          <el-date-picker
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            v-model="time"
            :clearable="false"
            type="date"
            @change="handlerChangeTime"
            placeholder="选择日期"
          >
          </el-date-picker>
        </div>
      </div>
    </div>
    <div class="template-page__content">
      <div class="template-page__left" :class="line">
        <div class="content_header">
          <span>{{ formatActiveName(activeName, 1) }}列表</span>
          <div @click="handlerUnfoldAndStow" v-if="activeName !== '2'">
            <img v-if="unfoldAndStow" :src="packup" />
            <img v-if="!unfoldAndStow" :src="unfold" />
          </div>
        </div>
        <div class="content_search">
          <el-input
            @keyup.enter.native="onSenderSearch"
            :placeholder="senderListPlaceholder"
            v-model="senderParams.name"
            @clear="onSenderSearch"
            clearable
          ></el-input>
        </div>
        <div
          class="loadMoreWrapper"
          v-loading="senderListLoading"
          v-infinite-scroll="handlerScroll"
          :infinite-scroll-disabled="senderIsScroll"
          :infinite-scroll-distance="5"
          :infinite-scroll-immediate="false"
          ref="loadMoreWrapper"
        >
          <ul class="user_list">
            <li
              v-for="(item, index) in senderList"
              :key="index"
              @click="handleClickChangeSender(item, index)"
              :class="(index === senderIndex && unfoldAndStow && parseInt(activeName) !== 2) ? 'user_list_select' : (index === senderIndex && !unfoldAndStow && parseInt(activeName) !== 2)? 'user_list_select_1':  (index === senderIndex  && parseInt(activeName) === 2)?'user_list_select_1':''"
            >
              <img
                class="user_pic"
                v-if="activeName !== '2'"
                :src="item.avatar"
              />
              <div class="qun_pic" v-if="activeName === '2'">
                <img src="./image/qun.png" />
              </div>
              <div class="user">
                <div class="user_name">{{ item.name }}</div>
                <div class="user_shop">{{ item.shopName }}</div>
              </div>
            </li>
          </ul>
          <p class="getMoreloading" v-if="getMoreloading && !senderListLoading">
            加载中...
          </p>
          <p
            class="getMoreloading"
            v-if="noMore && !senderListLoading && senderList.length !== 0"
          >
            没有更多了
          </p>
          <NsNoData v-if="!senderListLoading && senderList.length === 0"
            >暂无数据</NsNoData
          >
        </div>
        <div class="content_bottom"></div>
      </div>
      <div
        class="template-page__left__children"
        :class="
          !unfoldAndStow || activeName === '2' ? 'customer_list__width' : ''
        "
      >
        <div class="content_header">
          {{ formatActiveName(activeName, 2) }}列表
        </div>
        <div class="content_search">
          <el-input
            :placeholder="toListPlaceholder"
            @keyup.enter.native="onToListSearch"
            v-model="talkToGuideListParams.name"
            @clear="onToListSearch"
            clearable
          ></el-input>
        </div>
        <div
          class="loadMoreWrapper"
          ref="loadMoreWrapperChildren"
          v-infinite-scroll="handlerListScroll"
          :infinite-scroll-disabled="senderIsScroll"
          :infinite-scroll-distance="30"
          :infinite-scroll-immediate="false"
          v-loading="toListLoading"
        >
          <div class="customer_list__warpper">
            <div>
              <div
                class="customer_list__item"
                :class="
                  index === toListIndex ? 'customer_list__item_select' : ''
                "
                @click="handleClickChangeToList(item, index)"
                v-for="(item, index) in toList"
                :key="index"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
          <p class="getMoreloading" v-if="getToListloading && !toListLoading">
            加载中...
          </p>
          <p
            class="getMoreloading"
            v-if="getToListNoMore && !toListLoading && toList.length !== 0"
          >
            没有更多了
          </p>
          <NsNoData v-if="!toListLoading && toList.length === 0"
            >暂无数据</NsNoData
          >
        </div>
        <div class="content_bottom"></div>
      </div>
      <div class="template-page__right" :class="ml">
        <div class="template-page__right__content">
          <div class="content_right_content__header">聊天记录</div>
          <div
            class="loadMoreWrapper"
            ref="ChatRecordBox"
            v-loading="weWorkChatDataLoading"
          >
            <template v-if="isSetWeWorkChatData">
              <ChatRecordList
                @getMore="getMore"
                @handleScrollTop="handleScrollTop"
                :dataList="weWorkChatData"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Index from './src/index'
export default Index
</script>
<style>
#chatRecordPage .tabs /deep/ .el-tabs__header {
  border-bottom: none !important;
}
#chatRecordPage .tabs /deep/ .el-tabs__item.is-active:before {
  display: none;
}
#chatRecordPage .tabs /deep/ .el-tabs__item {
  line-height: 56px;
}
</style>
<style lang="scss" scoped>
.fl_between {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
}
.content_search {
  margin-top: 4px;
  margin-bottom: 16px;
  padding: 0px 16px;
}
.loadMoreWrapper {
  position: relative;
  overflow: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
.getMoreloading {
  height: 64px;
  line-height: 64px;
  // padding: 0 16px;
  text-align: center;
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
    display: flex;
    align-items: center;
    height: 64px;
    padding: 0px 16px;
    width: 100%;
    // border-radius: 2px;
    // user-select: none;
    &:hover {
      background: #d9effe;
    }
    .user_pic {
      width: 48px;
      height: 48px;
      border-radius: 4px;
      margin-right: 16px;
    }
    .qun_pic {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 48px;
      height: 48px;
      border-radius: 4px;
      margin-right: 16px;
      background: #d9d9d9;
      img {
        width: 30px;
        height: 30px;
      }
    }
    .user {
      width: calc(100% - 64px);
      // flex: 1;
      font-size: 14px;
      div {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .user_name {
        color: #262626;
      }
      .user_shop {
        color: #8c8c8c;
      }
    }
  }
}
.user_list_select {
  position: relative;
  background: #d9effe;
  z-index: 2;
  &::after {
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translate(0%, -50%);
    content: '';
    border-top: 7px solid transparent;
    border-right: 7px solid #fff;
    border-bottom: 7px solid transparent;
    border-left: 7px solid transparent;
  }
}
.user_list_select_1 {
  position: relative;
  background: #d9effe;
  z-index: 2;
}
.template-page__left__children {
  position: absolute;
  left: 220px;
  top: 0px;
  // z-index: 2;
  overflow: hidden;
  width: 173px;
  background: #ffffff;
  // border-left: 1px solid #e8e8e8;
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
  // margin-left: 236px;
  background: #f5f5f5;
  border: 1px solid #e8e8e8;
}
.content_right_content__header {
  background: #fff;
  border-radius: 4px 4px 0px 0px;
  font-weight: bold;
  padding: 0px 16px;
  height: 56px;
  line-height: 56px;
  font-size: 16px;
  color: #262626;
}
.template-page__content {
  position: relative;
  display: flex;
  width: 100%;
}
.template-page__left {
  width: 220px;
  position: absolute;
  background: #ffffff;
  overflow: hidden;
}
.template-page__line {
  position: relative;
  &::after {
    position: absolute;
    content: '';
    width: 1px;
    height: 100%;
    right: 0px;
    top: 0px;
    background: #e8e8e8;
    z-index: 1;
  }
}
.template-page__right {
  position: absolute;
  // top: 70px;
  left: 0;
  left: 236px;
  width: calc(100% - 236px);
}
.template-page__right_content {
  left: 408px;
  width: calc(100% - 408px);
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
    overflow: hidden;
  }
  // .template-page__right {
  //   position: absolute;
  //   left: 408px;
  //   width: calc(100% - 408px);
  //   margin: 0;
  // }
  .template-page__left__children {
    position: absolute;
    top: 0;
    left: 220px;
  }
}
.customer_list__width {
  left: 5px;
  z-index: -2;
  // width: 0px;
  border-left: 0px solid #e8e8e8;
}
.customer_list__item_select {
  background: #f5f5f5;
}
</style>
