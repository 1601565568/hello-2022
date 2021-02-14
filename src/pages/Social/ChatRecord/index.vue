<template>
  <div id="chatRecordPage" class="template_main">
    <div class="template-page">
      <div class="page-header fl_between">
        <div class="tabs">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="客户" name="1"></el-tab-pane>
            <el-tab-pane label="群" name="2"></el-tab-pane>
            <el-tab-pane label="导购" name="3"></el-tab-pane>
          </el-tabs>
        </div>
        <div>
          <el-date-picker
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            v-model="time"
            type="date"
            @change="handlerChangeTime"
            placeholder="选择日期"
          >
          </el-date-picker>
        </div>
      </div>
    </div>
    <div class="template-page__content">
      <div class="template-page__left">
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
          :infinite-scroll-distance="30"
          :infinite-scroll-immediate="false"
          ref="loadMoreWrapper"
        >
          <ul class="user_list">
            <li
              v-for="(item, index) in senderList"
              :key="index"
              @click="handleClickChangeSender(item, index)"
              :class="index === senderIndex ? 'user_list_select' : ''"
            >
              <img
                class="user_pic"
                v-if="activeName !== '2'"
                :src="item.avatar"
              />
              <div class="user">
                <div class="user_name">{{ item.name }}</div>
                <div class="user_shop">{{ item.shopName }}</div>
              </div>
            </li>
          </ul>
          <NsNoData v-if="!senderListLoading && toList.length === 0"
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
            <div class="customer_list__warpper">
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
          <NsNoData v-if="!toListLoading && senderList.length === 0"
            >暂无数据</NsNoData
          >
        </div>
        <div class="content_bottom"></div>
      </div>
      <div class="template-page__right">
        <div class="template-page__right__content" :class="ml">
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
  background: #f5f5f5;
  border: 1px solid #e8e8e8;
}
.template-page__right_content {
  margin-left: 408px;
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
  left: 5px;
  z-index: -2;
  // width: 0px;
  border-left: 0px solid #e8e8e8;
}
.customer_list__item_select {
  background: #f5f5f5;
}
</style>
