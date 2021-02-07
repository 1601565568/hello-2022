<template>
  <div id="chatRecordPage">
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
    <div class="template-content">
      <div class="template-content__l">
        <div class="template-content__list">
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
          <div class="loadMoreWarpper" v-loading="senderListLoading">
            <LoadMore
              @scroll="handlerScroll"
              :isScoll="senderIsScroll"
              :scrollDistance="30"
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
            </LoadMore>
          </div>
        </div>
        <div
          class="customer_list"
          v-if="activeName !== '2'"
          :class="!unfoldAndStow ? 'customer_list__width' : ''"
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
          <div class="loadMoreWarpper" v-loading="toListLoading">
            <LoadMore @scroll="changeScroll" :scrollDistance="50">
              <div class="customer_list__warpper">
                <div
                  class="customer_list__item"
                  :class="
                    index === toListIndex ? 'customer_list__item_select' : ''
                  "
                  v-for="(item, index) in toList"
                  :key="index"
                >
                  {{ item.name }}
                </div>
              </div>
            </LoadMore>
          </div>
        </div>
      </div>
      <div class="template-content__r">
        <div class="content_header">聊天记录</div>
        <div class="chat_record" v-loading="weWorkChatDataLoading">
          <template v-if="isSetWeWorkChatData">
            <ChatRecordList
              @handleScrollTop="handleScrollTop"
              :dataList="weWorkChatData"
            />
          </template>
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
.template-content {
  display: flex;
  overflow: hidden;
  height: calc(100vh - 183px);
  .template-content__l {
    background: #fff;
    display: flex;
    // width: 30%;
    .template-content__list {
      // width: 60%;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        right: 0px;
        top: 0px;
        width: 1px;
        height: 100%;
        z-index: 1001;
        background: #e8e8e8;
      }
      width: 200px;
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
    }
    .content_header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: bold;
      padding: 0px 16px;
      height: 56px;
      line-height: 56px;
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
      padding: 0px 16px;
    }
    .loadMoreWarpper {
      position: relative;
      margin-top: 16px;
      padding-bottom: 16px;
      overflow: hidden;
      height: calc(100vh - 283px);
      // &::before {
      //   content: '';
      //   position: absolute;
      //   width: 100%;
      //   height: 16px;
      //   left: 0px;
      //   bottom: 0px;
      //   background: #fff;
      //   z-index: 2;
      // }
    }
    .customer_list {
      width: 173px;
      // border-left: 1px solid #e8e8e8;
    }
    .customer_list__width {
      width: 0px;
    }
    .customer_list__warpper {
      padding: 0 16px;
      .customer_list__item {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0 8px;
        font-size: 14px;
        color: #262626;
        border-radius: 2px;
        line-height: 48px;
        height: 48px;
        &:hover {
          background: #f5f5f5;
        }
      }
      .customer_list__item_select {
        background: #f5f5f5;
      }
    }
  }
  .template-content__r {
    margin-left: 16px;
    flex: 1;
    .content_header {
      background: #fff;
      border-radius: 4px 4px 0px 0px;
      font-weight: bold;
      padding: 0px 16px;
      height: 56px;
      line-height: 56px;
      font-size: 16px;
      color: #262626;
    }
    .chat_record {
      position: relative;
      border-left: 1px solid #e8e8e8;
      border-right: 1px solid #e8e8e8;
      border-bottom: 1px solid #e8e8e8;
      background: #f5f5f5;
      border-radius: 0px 0px 4px 0px;
      overflow: hidden;
      height: calc(100vh - 238px);
      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 16px;
        left: 0px;
        bottom: 0px;
        background: #f5f5f5;
        border-bottom: 1px solid #e8e8e8;
        z-index: 1;
      }
    }
  }
}
@media screen and (max-width: 1625px) {
  .template-content {
    height: calc(100vh - 163px);
  }
  .loadMoreWarpper {
    height: calc(100vh - 263px);
  }
  .chat_record {
    height: calc(100vh - 218px);
  }
}
</style>
