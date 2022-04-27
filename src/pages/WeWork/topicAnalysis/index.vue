<template>
  <div class="template_main">
    <div class="template-page">
      <div class="page-header fl_between">
        <div class="page-header__text">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item
              :to="{ path: '/Social/WeWorkGroup/ChatRecord' }"
            >
              会话管理
            </el-breadcrumb-item>
            <el-breadcrumb-item>话题分析</el-breadcrumb-item>
          </el-breadcrumb>
          <div v-if="!isDetails" style="margin-top: 16px">话题分析</div>
          <div v-else class="member-back" @click="handleRowJump()">
            <img src="./image/icon-fanhuishangyiji.svg" />
            <span>{{ userTypeText }}发送次数</span>
          </div>
        </div>
      </div>
    </div>
    <div class="template-page__content">
      <MemberList
        v-show="isDetails"
        ref="memberList"
        :memberData="memberData"
        @getContext="getContext"
      />
      <div v-show="!isDetails">
        <div class="template-page__left">
          <div class="content_header">
            <div>
              话题列表
              <img class="add" :src="nsAddBorder" @click="addKeyWordTopic" />
            </div>
            <!-- <div @click="handlerUnfoldAndStow" style="cursor: pointer;">
              <img v-if="unfoldAndStow" :src="packup" />
              <img v-if="!unfoldAndStow" :src="unfold" />
            </div> -->
          </div>
          <div
            v-loading="listLoading"
            class="loadMoreWrapper"
            v-infinite-scroll="handlerScroll"
            :infinite-scroll-disabled="listIsScroll"
            :infinite-scroll-distance="5"
            ref="loadMoreWrapper"
          >
            <div class="customer_list__warpper">
              <div
                class="customer_list__item"
                v-for="i in list"
                :key="i.topicId"
                @click="onChangeList(i)"
                :class="i.topicId === select ? 'user_list_select' : ''"
              >
                <!-- <div class="topic-text">{{ i.topicName }}</div> -->
                 <NsTextOverFlow maxWidth="180px" :content="i.topicName" />
                <span class="del" @click.stop="del(1, i.topicName, i.topicId)">
                  <Icon type="delete"
                /></span>
              </div>
            </div>
            <p class="getMoreloading" v-if="getListMore && !listLoading">
              加载中...
            </p>
            <p
              class="getMoreloading"
              v-if="!getListMore && !listLoading && list.length !== 0"
            >
              没有更多了
            </p>
            <NsNoData v-if="!listLoading && list.length === 0"
              >暂无数据</NsNoData
            >
          </div>
          <div class="content_bottom"></div>
        </div>
        <div class="template-page__right">
          <div class="template-page__right__content" :class="ml">
            <KeyWordList
              ref="keyWordList"
              :topicId="select"
              @addKeyWordDialog="addKeyWordDialog"
              @handleRowJump="handleRowJump"
            />
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
        :userInfo="userInfo"
        :dataList="weWorkChatData"
        @getMore="getMore"
        :drawer="drawer"
        @handleClose="handleClose"
        @handleScrollTop="handleScrollTop"
      />
    </el-drawer>
    <!-- 添加话题 -->
    <AddKeyWordTopic ref="addKeyWordTopic" @add="add" />
    <!-- 添加关键词 -->
    <AddKeyWord ref="addKeyWord" @add="addKeyWord" @addTopic="add" />
    <!-- 删除确认弹窗 -->
    <Message ref="message" :text="text" @confirm="messageConfirm()" />
  </div>
</template>
<script>
import Index from './src/index'
export default Index
</script>
<style lang="scss" scoped>
.fl_between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.page-header {
  background: #ffffff;
  margin: -10px -10px 0;
  padding: 16px;
  margin-bottom: 16px;
}
.page-header__text {
  font-size: 16px;
  color: #262626;
  line-height: 24px;
  font-weight: bold;
}
.page-header__search {
  display: flex;
  justify-content: space-between;
}
.getMoreloading {
  height: 64px;
  line-height: 64px;
  // padding: 0 16px;
  text-align: center;
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
    cursor: pointer;
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
.user_list_select {
  position: relative;
  background: #d9effe;
  font-weight: 600;
  z-index: 2;
}
.user_list_select__keyWord {
  background: #f5f5f5;
}
.customer_list__warpper {
  .customer_list__item {
    padding: 0 16px;
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
      max-width: 180px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .del {
      display: none;
      position: absolute;
      right: 10px;
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
.template-page__right__content {
  margin-left: 239px;
}
.template-page__content {
  position: relative;
  display: flex;
  width: 100%;
}
.template-page__left {
  width: 223px;
  position: absolute;
  z-index: 2;
  background: #ffffff;
  overflow: hidden;
}
.template-page__right {
  position: absolute;
  left: 0;
  z-index: 1;
  margin: 0;
  width: 100%;
}
@media screen and (min-width: 1624px) {
  .template-page__left {
    width: 223px;
    position: absolute;
    z-index: 2;
    overflow: hidden;
  }
  .template-page__right {
    position: absolute;
    left: 0;
    z-index: 1;
    width: 100%;
    margin: 0;
  }
}
.customer_list__width {
  width: 0px;
  border-left: 0px solid #e8e8e8;
}
.scope-title_img {
  width: 32px;
  height: 32px;
  border-radius: 4px;
}
.member-back {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #262626;
  line-height: 24px;
  font-weight: bold;
  margin-top: 16px;
  cursor: pointer;
  img {
    width: 16px;
    height: 16px;
  }
  span {
    margin-left: 16px;
  }
}
</style>
