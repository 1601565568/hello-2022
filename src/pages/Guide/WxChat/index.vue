<template>
  <div class="talk-chat" style="text-align: left">

    <ns-page-table>
      <!-- 搜索 -->
      <template slot="searchSearch" >
        <el-form :model="model" :inline="true" @submit.native.prevent class="pull-right talk-chat__form">
            <el-form-item label="自定义时段：" v-show="_data._queryConfig.expand === false">
              <el-date-picker
                v-model="model.srhDate"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                align="right"
                :clearable="false"
                :editable="false"
                style="width: 225px"/>
              <ns-button type="primary" @click="search()" :disabled="btnSearchDisabled" class="searchbtn">搜索</ns-button>
              <ns-button @click="reset()" class="resetbtn">重置</ns-button>
            </el-form-item>
            <el-form-item>
              <ns-button type="text" @click="$handleTabClick">
                {{collapseText}}
                <Icon :type="_data._queryConfig.expand ? 'up' : 'down'"/>
              </ns-button>
            </el-form-item>
          </el-form>
      </template>
      <!-- 搜索-结束 -->

      <!-- 高级搜索 -->
      <!-- el-form 需添加  @keyup.enter.native="onSearch" 配置，实现回车搜索， onSearch 为搜索方法 -->
      <!-- el-form 需添加  surround-btn 类名 配置环绕按钮效果 -->
      <template slot="advancedSearch" v-if="_data._queryConfig.expand">
        <el-form :model="model" :inline="true" @submit.native.prevent>
          <el-form-item label="自定义时段：">
            <el-date-picker
              v-model="model.srhDate"
              type="daterange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              align="right"
              :clearable="false"
              :editable="false"
              style="width: 225px"/>
          </el-form-item>
          <el-form-item label="个人号：">
            <el-select v-model="model.ownerId" filterable placeholder="全部" clearable @change="widChanged">
              <el-option v-for="item in ownerData" :key="item.wid" :label="item.nick" :value="item.wid"/>
            </el-select>
          </el-form-item >
          <el-form-item label="聊天内容：">
            <el-input v-model="model.content" style="width:200px" :disabled="isContentDisabled" @keyup.enter.native="search()" clearable placeholder="按聊天内容查询请先选择个人号"/>
          </el-form-item>
        </el-form>
        <div class="template-table__more-btn">
          <ns-button type="primary" @click="search()">搜索</ns-button>
          <ns-button @click="reset()">重置</ns-button>
        </div>
      </template>
      <!-- 高级搜索-结束 -->
    </ns-page-table>

    <el-container class="talk-chat__container">
      <el-aside class="talk-aside" style="width: 25%;">
        <div class="talk-aside__group">客户 / 群</div>
        <el-scrollbar ref="fullScreen" v-loading.lock="targetLoading" :element-loading-text="$t('prompt.loading')">
          <div class="talk-aside__item">
            <template v-for="(target, index) in targetList">
              <div :key="index" class="talk-item" :class="{'talk-chosen':isCurrTarget(index)}" @click="clickTarget(index)">
                <div v-if="target.talkerType === 2" class="talk-item__avatar talk-item__avatar--bluebg">
                  <Icon className="crowd" type="qun"/>
                </div>
                <div v-else class="talk-item__avatar">
                  <el-image
                    :width="30" :height="30"
                    :src="target.head||require('./src/images/avartar.png')"
                    mode="cover" :circle="true"></el-image>
                </div>
                <div class="talk-item__username">{{target.talkerName||target.talker}}</div>
                <div class="talk-item__time">{{getHourMinute(target.lastTime)}}</div>
              </div>
            </template>
          </div>
        </el-scrollbar>
      </el-aside>
      <el-main class="talk-main">
        <div v-if="currTargetIndex!=null && targetList[currTargetIndex]!=null">
          <div class="talk-main__header">
            <div>
              聊天记录 / {{targetList[currTargetIndex].talkerName||targetList[currTargetIndex].talker}}
              <ns-button v-show="targetList[currTargetIndex].talkerType === 0 && targetList[currTargetIndex].talkerName !== null" type="text" @click="dialogVisible = true" class="talk-main__header--btn">
                查看详情
                <i class="rightarrow">
                  <Icon type="right" className="text-primary"/>
                </i>
              </ns-button>
            </div>
            <div>个人号：{{targetList[currTargetIndex].ownerName}}
              （<font color="#0091FA">{{targetList[currTargetIndex].ownerId}}</font>)
            </div>
          </div>
        </div>
        <div v-else>
          <div class="talk-main__header">
            <div>聊天记录</div>
          </div>
        </div>
        <el-scrollbar ref="fullScreenright" v-loading.lock="chatLoading" :element-loading-text="$t('prompt.loading')">
          <div class="talk-main__strip">
            <div style="text-align: center;margin-top:10px">
              <font size="3">
                <template v-if="isChatLoadEnd && chatList.length === 0">
                  <ns-no-data size="full">{{$t('prompt.noData')}}</ns-no-data>
                </template>
                <template v-if="!isChatLoadEnd">
                  <ns-button type="primary" @click="loadChatLog(false)" class="talk-main__header--btn talk-main__header--seemore">
                    查看更多
                  </ns-button>
                </template>
              </font>
            </div>
            <template v-for="(chat) in chatList">
              <div :id="'chatLog_' + chat.id" :key="chat.id" ref="'chatLog0' + index" :class="{'talk-strip':isChatLeft(chat.receive), 'talk-right': !isChatLeft(chat.receive), 'clearfix':  chat.cancel||chat.delete}">
                <div :class="{'talk-strip__headportrait':isChatLeft(chat.receive), 'talk-right__headportrait': !isChatLeft(chat.receive), 'clearfix':  chat.cancel||chat.delete}">
                  <el-image
                    :width="52" :height="52"
                    :src="chat.senderHead||require('./src/images/avartar.png')"
                    mode="cover" :circle="true"></el-image>
                </div>
                <div :class="{'talk-strip__uname':isChatLeft(chat.receive), 'talk-right__uname': !isChatLeft(chat.receive)}">
                  <div :class="{'talk-msg':isChatLeft(chat.receive), 'talk-rightmsg': !isChatLeft(chat.receive)}">
                    <template v-if="isChatLeft(chat.receive)">
                      <span class="talk-msg__uname">{{chat.senderNick}}</span>
                      <span class="talk-msg__date">{{chat.createTime}}</span>
                    </template>
                    <template v-else>
                      <span class="talk-rightmsg__date">{{chat.createTime}}</span>
                      <span class="talk-rightmsg__uname">{{chat.senderNick}}</span>
                    </template>
                  </div>
                  <div :class="{'talk-detail':isChatLeft(chat.receive), 'talk-rightdetail': !isChatLeft(chat.receive)}">
                    <div :class="{'talk-detail__record':isChatLeft(chat.receive), 'talk-rightdetail__record': !isChatLeft(chat.receive)}" class="clearfix">
                      <div :class="{'talk-detail__record--circle':isChatLeft(chat.receive), 'talk-rightdetail__record--circle': !isChatLeft(chat.receive)}"></div>
                      {{chat.content}}
                    </div>
                    <div v-if="chat.cancel" :class="{'talk-detail__withdraw':isChatLeft(chat.receive), 'talk-rightdetail__withdraw': !isChatLeft(chat.receive)}">已撤回</div>
                    <div v-if="chat.delete" :class="{'talk-detail__withdraw':isChatLeft(chat.receive), 'talk-rightdetail__withdraw': !isChatLeft(chat.receive)}">已删除</div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </el-scrollbar>
      </el-main>
    </el-container>
    <!-- 详情弹窗-->
    <el-dialog title="查看详情" :visible.sync="dialogVisible" width="500px" class="detail-dialog">
      <div class="detail-dialog__content" v-if="currTargetIndex!=null && targetList[currTargetIndex]!=null">
        <el-form label-width="80px" class="detail-leftside">
          <el-form-item :label="targetList[currTargetIndex].talkerName" label-width="100px" class="detail-leftside__username">
            <el-form-grid>
              <!-- 男生图标-->
              <i v-if="targetList[currTargetIndex].gender===1"><Icon className="men" type="men"/></i>
              <!-- 女生图标-->
              <i v-if="targetList[currTargetIndex].gender===0"><Icon className="women" type="women"/></i>
            </el-form-grid>
          </el-form-item>
            <el-form-item label="备注：">
              <el-form-grid></el-form-grid>
            </el-form-item>
            <el-form-item label="地区：">
              <el-form-grid>{{targetList[currTargetIndex].areaName}}</el-form-grid>
            </el-form-item>
          <el-form-item label="微信号：">
            <el-form-grid>{{targetList[currTargetIndex].talker}}</el-form-grid>
          </el-form-item>
        </el-form>
        <div class="detail-rightside" v-show="targetList[currTargetIndex].talkerType===0">
          <el-image
            :width="82" :height="82"
            :src="targetList[currTargetIndex].head||require('./src/images/avartar.png')"
            mode="cover" :circle="true"></el-image>
        </div>
      </div>
      <div slot="footer">
        <ns-button @click="dialogVisible = false">关闭</ns-button>
      </div>
    </el-dialog>
    <!-- 详情弹窗-->
    <!-- 搜索内容弹窗-->
    <el-dialog
      title="搜索内容"
      :visible.sync="dialogVisibleSearcher"
      width="635px" height="500px" class="search-dialog">
      <div class="search-dialog__title" >
        <div class="search-avatar">
          <el-image
            :width="64" :height="64"
            :src="currentOwner.head||require('./src/images/avartar.png')"
            mode="cover" :circle="true"></el-image>
        </div>
        <div class="search-username">
          {{currentOwner.nick}}（{{currentOwner.wid}}）
        </div>
      </div>
      <div class="search-input" style="width: 600px">
        <el-input ref="quickText" v-model="contentKeyWord" placeholder="请输入内容" @keyup.enter.native="searchByContent">
          <i class="el-input__icon" slot="suffix" name="name" :disabled="btnSearchContentDisabled" @click="searchByContent">
            <Icon type="search" style="width: 30px"/>
          </i>
        </el-input>
      </div>
      <el-scrollbar class="scrollbarseacher" v-loading.lock="contentLoading">
        <div class="search-dialog__content" v-if="contentList.length > 0" style="width: 600px">
          <template v-for="chat in contentList">
            <div class="search-item" :key="chat.id" @click="locateKeyWord(chat.id, chat.createTime)">
              <div class="search-item__avatar">
                <el-image
                  :width="48" :height="48"
                  :src="chat.senderHead||require('./src/images/avartar.png')"
                  mode="cover" :circle="true"></el-image>
              </div>
              <div class="search-msg">
                <div  class="search-msg__uname">{{chat.senderNick}}</div>
                <div class="search-msg__text" v-html="renderContent(chat.content)"></div>
                <span class="search-msg__time">{{chat.createTime}}</span>
              </div>
            </div>
          </template>
        </div>
        <div class="search-dialog__content" style="width: 600px" v-else>
          <div class="search-item">
            <div class="search-item__avatar" style="text-align: center;width: 100%;">无相关搜索内容</div>
          </div>
        </div>
      </el-scrollbar>
      <div style="height: 3px;">
        &nbsp;
      </div>
    </el-dialog>
    <!-- 搜索内容弹窗-->
  </div>
</template>
<script>
import index from './src/index'
export default index
</script>

<style scoped>
  @import "@theme/variables.pcss";
  :root {
    --talk-font-color-red: #FF1A1A;
    --search-font-bg-gray: #F9F9F9;
    --talk-bg-color-darkgray: #F2F4F6;
  }
  @component-namespace talk {
    @b chat {
      @e form {
        background: var(--theme-color-white);
      }
      @e container {
        margin-top: var(--default-margin-base);
        background: var(--theme-color-white);
        border-radius: var(--default-radius-mini);
      }
    }
    @b aside {
      border-right: 1px solid var(--theme-base-border-color-primary);
      @e group {
        padding: var(--default-padding-larger);
        border-bottom: 1px solid var(--theme-base-border-color-primary);
      }
    }
    @b item {
      position: relative;
      display: flex;
      align-items: center;
      padding: var(--default-padding-larger);
      border-bottom: 1px solid var(--theme-base-border-color-primary);
      cursor: pointer;
      @e avatar {
        width: 30px;
        height: 30px;
        float: left;
        flex-shrink: 0;
        @m bluebg {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--theme-color-primary);
          border-radius: 50%;
        }
      }
      @e username {
        width: 80%;
        margin-left: var(--default-margin-larger);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      @e time {
        color: var(--theme-font-color-secondary);
        position: absolute;
        right: 10px;
        top: 15px;
      }
    }
    @b main {
      @e header {
        height: 41px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 var(--default-padding-larger);
        border-bottom: 1px solid var(--theme-base-border-color-primary);
        @m btn {
          position: relative;
        }
        @m seemore {
          margin-bottom: 10px;
        }
      }
    }
    @b strip {
      padding: var(--default-padding-larger);
      width: 100%;
      display: flex;
      @e headportrait {
        width: 52px;
        height: 52px;
        cursor: pointer;
        flex-shrink: 0;
      }
      @e uname {
        margin-left: var(--default-margin-xlarger);
        padding-right: 69px;
      }
    }
    @b chosen {
      background: #F8F9FB;
    }
    @b right {
      padding: var(--default-padding-larger);
      width: 100%;
      position: relative;
      float: right;
      @e headportrait {
        width: 52px;
        height: 52px;
        position: absolute;
        top: 10px;
        right: 10px;
      }
      @e uname {
        float: right;
        margin-right: 69px;
        padding-left: 69px;
      }
    }
    @b msg {
      @e uname {
        color: var(--theme-font-color-regular);
      }
      @e date {
        color: var(--theme-font-color-secondary);
        margin-left: var(--default-margin-larger);
      }
    }
    @b detail {
      display: inline-block;
      @e record {
        padding: var(--default-padding-larger);
        margin-top: var(--default-margin-base);
        background: var(--talk-bg-color-darkgray);
        border-radius: var(--default-radius-small);
        position: relative;
        @m circle {
          width: 0;
          height: 0;
          position: absolute;
          left: -15px;
          top: 10px;
          border-width: 8px;
          border-style: solid;
          border-color: transparent var(--talk-bg-color-darkgray) transparent transparent;
        }
      }
      @e withdraw {
        color: var(--talk-font-color-red);
        text-align: center;
        line-height: 26px;
        height: 26px;
        display: inline-block;
        float: left;
        margin-top: var(--default-margin-xlarger);
        padding: 0 var(--default-padding-larger);
        border-radius: 30px;
        background: rgba(255,44,44,.06);
        clear: both;
      }
    }
    @b rightmsg {
      text-align: right;
      @e uname {
        color: var(--theme-font-color-regular);
        margin-left: var(--default-margin-larger);
      }
      @e date {
        color: var(--theme-font-color-secondary);
      }
    }
    @b rightdetail {
      @e record {
        padding: var(--default-padding-larger);
        margin-top: var(--default-margin-base);
        background: var(--talk-bg-color-darkgray);
        border-radius: var(--default-radius-small);
        position: relative;
        float: right;
        @m circle {
          width:0;
          height:0;
          position: absolute;
          right: -8px;
          top: 10px;
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
          border-left: 8px solid var(--talk-bg-color-darkgray);
          border-radius: 20px;
        }
      }
      @e withdraw {
        color: var(--talk-font-color-red);
        text-align: center;
        line-height: 26px;
        height: 26px;
        display: inline-block;
        float: right;
        margin-top: var(--default-margin-xlarger);
        padding: 0 var(--default-padding-larger);
        border-radius: 30px;
        background: rgba(255,44,44,.06);
        clear: both;
      }
    }
  }
  @component-namespace detail {
    @b dialog {
      @e content {
        position: relative;
      }
    }
    @b leftside {
      width: 65%;
      padding-top: var(--default-padding-larger);
    }
    @b rightside {
      width: 82px;
      height: 82px;
      position: absolute;
      top: 25px;
      right: 25px;
    }
  }
  .crowd {
    font-size: var(--default-font-size-large);
    color: var(--theme-color-white);
  }
  .men {
    font-size: var(--default-font-size-large);
    color: var(--theme-color-primary);
    margin-left: var(--default-margin-small);
  }
  .women {
    font-size: var(--default-font-size-large);
    margin-left: var(--default-margin-small);
  }
  .clearfix:after{
    content:"";
    display:block;
    height:0;
    clear:both;
  }
  .clearfix{zoom:1;}
  .rightarrow {
    position: relative;
    top: 1px;
  }
  >>> .el-main {
    padding: 0;
  }
  /* 搜索内容弹窗样式*/
  @component-namespace search {
    @b dialog {
      padding-bottom: var(--default-padding-larger);
      @e title {
        display: flex;
        align-items: center;
      }
      @e content {
        margin-top: var(--default-margin-xlarger);
        border: 1px solid var(--theme-base-border-color-primary);
        border-radius: var(--default-radius-mini);
      }
    }
    @b avatar {
      width: 64px;
      height: 64px;
    }
    @b username {
      font-size: var(--default-font-size-middle);
      color: var(--theme-font-color-primary);
      width: 85%;
      margin-left: var(--default-margin-larger);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    @b input {
      margin-top: var(--default-margin-larger);
    }
    @b item {
      display: flex;
      align-items: center;
      padding: var(--dialog-padding-base);
      border-bottom: 1px solid var(--theme-base-border-color-primary);
      &:last-child {
        border-bottom: none;
      }
      @e avatar {
        width: 47px;
        height: 47px;
      }
      &:hover {
        background: var(--search-font-bg-gray);
      }
    }
    @b msg {
      width: 85%;
      position: relative;
      margin-left: var(--default-margin-xlarger);
      @e uname {
        font-size: var(--default-font-size-base);
        color: var(--theme-font-color-primary);
        width: 66%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      @e text {
        font-size: var(--default-font-size-small);
        color: var(--theme-font-color-secondary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        @m checked {
          color: var(--theme-color-primary);
          margin-right: var(--default-margin-small);
        }
      }
      @e time {
        font-size: var(--default-font-size-small);
        color: var(--theme-font-color-secondary);
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }
  .searchbtn {
    margin-left: 11px;
  }
  .resetbtn {
    margin-left: var(--default-margin-larger);
  }
</style>
