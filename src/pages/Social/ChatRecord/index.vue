<template>
  <div id="chatRecordPage">
    <div class="template-page">
      <div class="page-header fl_between">
        <div class="tabs">
          <el-tabs v-model="activeName">
            <el-tab-pane label="客户" name="客户"></el-tab-pane>
            <el-tab-pane label="群" name="群"></el-tab-pane>
            <el-tab-pane label="导购" name="导购"></el-tab-pane>
          </el-tabs>
        </div>
        <div>
          <el-date-picker v-model="value1" type="date" placeholder="选择日期">
          </el-date-picker>
        </div>
      </div>
    </div>
    <div class="template-content">
      <div class="template-content__l">
        <div class="template-content__list">
          <div class="content_header">{{ activeName }}列表</div>
          <div class="content_search">
            <el-input :placeholder="placeholder" v-model="input1"></el-input>
          </div>
          <div class="loadMoreWarpper">
            <LoadMore @scroll="changeScroll" :scrollDistance="50">
              <ul class="user_list">
                <li
                  v-for="(i, index) in count"
                  :key="index"
                  @click="selectUser(i)"
                  :class="i === select ? 'user_list_select' : ''"
                >
                  <img
                    class="user_pic"
                    src="https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=4131746241,2477555401&fm=111&gp=0.jpg"
                  />
                  <div class="user">
                    <div class="user_name">张亮{{ i }}</div>
                    <div class="user_shop">西湖线下门店</div>
                  </div>
                </li>
              </ul>
            </LoadMore>
          </div>
        </div>
        <div class="customer_list">
          <div class="content_header">{{ activeName }}列表</div>
          <div class="content_search">
            <el-input :placeholder="placeholder" v-model="input1"></el-input>
          </div>
          <div class="loadMoreWarpper">
            <LoadMore @scroll="changeScroll" :scrollDistance="50">
              <div class="customer_list__warpper">
                <div
                  class="customer_list__item"
                  v-for="(i, index) in count"
                  :key="index"
                >
                  {{ i }}
                </div>
              </div>
            </LoadMore>
          </div>
        </div>
      </div>
      <div class="template-content__r">
        <div class="content_header">聊天记录</div>
        <div class="chat_record">
          <ChatRecordList />
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
      min-width: 200px;
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
          border-radius: 2px;
          user-select: none;
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
            flex: 1;
            font-size: 14px;
            .user_name {
              color: #262626;
            }
            .user_shop {
              color: #8c8c8c;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
      .user_list_select {
        background: #d9effe;
      }
    }
    .content_header {
      font-weight: bold;
      padding: 0px 16px;
      height: 56px;
      line-height: 56px;
      font-size: 16px;
      color: #262626;
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
      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 16px;
        left: 0px;
        bottom: 0px;
        background: #fff;
        z-index: 2;
      }
    }
    .customer_list {
      width: 173px;
      border-left: 1px solid #e8e8e8;
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
        z-index: 3;
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
