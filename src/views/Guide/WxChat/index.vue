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
              <ns-button type="primary" @click="search()" :disabled="btnSearchDisabled">搜索</ns-button>
              <ns-button @click="reset()">重置</ns-button>
            </el-form-item>
            <el-form-item>
              <ns-button type="text" @click="$handleTabClick">
                {{collapseText}}
                <i :class="{'el-icon--right': true, 'el-icon-arrow-down': !_data._queryConfig.expand, 'el-icon-arrow-up': _data._queryConfig.expand} "></i>
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
          <el-form-item label="聊天内容：" v-if="false">
            <el-input v-model="model.content" style="width:200px" :disabled="isContentDiabled" @keyup.enter.native="search()" clearable placeholder="按聊天内容查询请先选择个人号"/>
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
      <el-aside class="talk-aside" style="width: 22%;">
        <div class="talk-aside__group">客户 / 群</div>
        <el-scrollbar ref="fullScreen" v-loading.lock="targetLoading" :element-loading-text="$t('prompt.loading')">
          <div class="talk-aside__item">
            <template v-for="(target, index) in targetList">
              <div class="talk-item" :class="{'talk-chosen':isCurrTarget(index)}" @click="clickTarget(index)">
                <div v-if="target.talkerType === 2" class="talk-item__avatar talk-item__avatar--bluebg">
                  <i class="iconfont icon-qun"></i>
                </div>
                <div v-else class="talk-item__avatar">
                  <img :src="target.head||'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/app/WECHAT_DEFAULT_HEAD.png'" class="talk-img">
                </div>
                <div class="talk-item__username">{{target.talkerName||target.talker}}</div>
                <div class="talk-item__time">{{getHourMinitue(target.lastTime)}}</div>
              </div>
            </template>
          </div>
        </el-scrollbar>
      </el-aside>
      <el-main class="talk-main">
        <div v-if="currTargetIndex!=null && targetList[currTargetIndex]!=null">
          <div class="talk-main__header">
            <span class="talk-note">聊天记录 / {{targetList[currTargetIndex].talkerName||targetList[currTargetIndex].talker}}</span>
            <ns-button v-show="targetList[currTargetIndex].talkerType === 0 && targetList[currTargetIndex].talkerName !== null" type="text primary" @click="dialogVisible = true" class="talk-main__header--btn">
              查看详情
              <span class="rightarrow"> > </span>
            </ns-button>
            <span class="talk-person">个人号：{{targetList[currTargetIndex].ownerName}}
              （<font color="#0091FA">{{targetList[currTargetIndex].ownerId}}</font>)
            </span>
          </div>
        </div>
        <div v-else>
          <div class="talk-main__header">
            <span class="talk-note">聊天记录</span>
          </div>
        </div>
        <el-scrollbar ref="fullScreenright" v-loading.lock="chatLoading" :element-loading-text="$t('prompt.loading')">
          <div class="talk-main__strip">
            <div style="text-align: center;margin-top:10px">
              <font size="3">
                <template v-if="isChatLoadEnd">
                  暂无数据
                </template>
                <template v-else>
                  <a @click="loadChatLog(false)">查看更多</a>
                </template>
              </font>
            </div>
            <template v-for="(chat,index) in chatList">
              <div :id="'chatLog0' + index" ref="'chatLog0' + index" :class="{'talk-strip':isChatLeft(chat.receive), 'talk-right': !isChatLeft(chat.receive), 'clearfix':  chat.cancel||chat.delete}">
                <div :class="{'talk-strip__headportrait':isChatLeft(chat.receive), 'talk-right__headportrait': !isChatLeft(chat.receive), 'clearfix':  chat.cancel||chat.delete}">
                  <img :src="chat.senderHead||'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/app/WECHAT_DEFAULT_HEAD.png'" alt="用户头像" class="talk-image">
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
    <el-dialog title="查看详情" :visible.sync="dialogVisible" width="442px" class="detail-dialog">
      <div class="detail-dialog__content" v-if="currTargetIndex!=null && targetList[currTargetIndex]!=null">
        <el-form label-width="80px" class="detail-leftside">
          <el-form-item label-width="32px">
            <el-form-grid>
              <span style="font-size: 14px;color:#909399">{{targetList[currTargetIndex].talkerName}}</span>
              <!-- 男生图标-->
              <i class="iconfont icon-nan1" v-if="targetList[currTargetIndex].gender===1"></i>
              <!-- 女生图标-->
              <i class="iconfont icon-nv1" v-if="targetList[currTargetIndex].gender===0"></i>
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
          <img :src="targetList[currTargetIndex].head||'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/app/WECHAT_DEFAULT_HEAD.png'" class="detail-rightside__img">
        </div>
      </div>
    </el-dialog>
    <!-- 详情弹窗-->
  </div>
</template>
<script>
import index from './src/index'
export default index
</script>

<style scoped>
  @import "@/style/small/variables.pcss";
  :root {
    --theme-font-color-blue: #0094FC;
    --theme-font-color-red: #FE2D59;
  }
  @component-namespace talk {
    @b chat {
      @e form {
        padding: 15px 20px 10px 20px;
        background: var(--theme-color-white);
        @m marginright {
          margin-right: 4% !important;
        }
      }
      @e container {
        margin-top: 10px;
        background: var(--theme-color-white);
      }
    }
    @b aside {
      border-right: 1px solid #EEEEEE;
      @e group {
        font-size: 16px;
        color: #33393E;
        line-height: 50px;
        width: 100%;
        height: 50px;
        padding: 0 15px;
        border-bottom: 1px solid #EEEEEE;
      }
    }
    @b item {
      line-height: 73px;
      height: 73px;
      position: relative;
      padding: 0 20px;
      border-bottom: 1px solid #EEEEEE;
      cursor: pointer;
      @e avatar {
        width: 30px;
        height: 30px;
        float: left;
        margin-top: 10px;
        @m bluebg {
          text-align: center;
          line-height: 30px;
          margin-top: 20px;
          background: #0091FA;
          border-radius: 50%;
        }
      }
      @e username {
        font-size: 16px;
        color: #33393E;
        width: 55%;
        margin-left: 45px;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }
      @e time {
        font-size: 14px;
        color: #909399;
        position: absolute;
        right: 20px;
        top: 0;
      }
    }
    @b img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
    @b main {
      @e header {
        font-size: 16px;
        color: #33393E;
        line-height: 50px;
        height: 50px;
        padding: 0 20px;
        border-bottom: 1px solid #EEEEEE;
        @m btn {
          position: relative;
        }
      }
      @e strip {

      }
    }
    @b note {
      font-size: 16px;
      color: #33393E;
    }
    @b person {
      font-size: 16px;
      color: #33393E;
      float: right;
    }
    @b strip {
      padding: 20px;
      width: 100%;
      display: flex;
      @e headportrait {
        width: 52px;
        height: 52px;
        cursor: pointer;
      }
      @e uname {
        flex: 1;
        margin-left: 18px;
      }
    }
    @b chosen {
      background: #F8F9FB;
      border-bottom: none;
    }
    @b right {
      padding: 20px;
      width: 50%;
      position: relative;
      float: right;
      clear: both;
      @e headportrait {
        width: 52px;
        height: 52px;
        float: right;
      }
      @e uname {
        margin-right: 70px;
      }
    }
    @b msg {
      padding-top: 5px;
      @e uname {
        font-size: 14px;
        color: #606266;
      }
      @e date {
        font-size: 14px;
        color: #909399;
        margin-left: 10px;
      }
    }
    @b detail {
      display: inline-block;
      @e record {
        font-size: 14px;
        color: #33393E;
        padding: 15px;
        margin-top: 8px;
        background: #F2F4F6;
        border-radius: 5px;
        position: relative;
        @m circle {
          width: 0;
          height: 0;
          position: absolute;
          left: -15px;
          top: 10px;
          border-width: 8px;
          border-style: solid;
          border-color: transparent #F2F4F6 transparent transparent;
        }
      }
      @e withdraw {
        font-size: 12px;
        color: #FF1A1A;
        text-align: center;
        line-height: 26px;
        height: 26px;
        display: inline-block;
        float: left;
        margin-top: 15px;
        padding: 0 10px;
        border-radius: 30px;
        background: rgba(255,44,44,.06);
        clear: both;
      }
    }
    @b rightmsg {
      text-align: right;
      padding-top: 5px;
      @e uname {
        font-size: 14px;
        color: #606266;
      }
      @e date {
        font-size: 14px;
        color: #909399;
        margin-left: 10px;
      }
    }
    @b rightdetail {
      @e record {
        font-size: 14px;
        color: #33393E;
        padding: 15px;
        margin-top: 8px;
        background: #F2F4F6;
        border-radius: 5px;
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
          border-left: 8px solid #F2F4F6;
          border-radius: 20px;
        }
      }
      @e withdraw {
        font-size: 12px;
        color: #FF1A1A;
        text-align: center;
        line-height: 26px;
        height: 26px;
        display: inline-block;
        float: right;
        margin-top: 15px;
        padding: 0 10px;
        border-radius: 30px;
        background: rgba(255,44,44,.06);
        clear: both;
      }
    }
    @b image {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  @component-namespace detail {
    @b dialog {
      @e content {
        position: relative;
        padding: 20px 0 40px;
      }
    }
    @b leftside {
      width: 65%;
      padding-top: 10px;
    }
    @b rightside {
      width: 82px;
      height: 82px;
      position: absolute;
      top: 25px;
      right: 25px;
      @e img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
  >>> .el-form-item__label {
    font-size: var(--default-font-size-base);
    color: var(--theme-font-color-secondary);
  }
  >>>.el-dialog__body {
    color: var(--theme-font-color-primary);
  }
  .icon-qun {
    color: var(--theme-color-white);
  }
  .icon-geren {
    color: var(--theme-color-white);
  }
  .icon-nan1 {
    font-size: 18px;
    color: var(--theme-font-color-blue);
    margin-left: 10px;
  }
  .icon-nv1 {
    font-size: 18px;
    color: var(--theme-font-color-red);
    margin-left: 10px;
  }
  .clearfix:after{
    content:"";
    display:block;
    height:0;
    clear:both;
  }
  .clearfix{zoom:1;}
  .rightarrow {
    font-size: 20px;
    color: #0078FF;
    position: absolute;
    top: 3px;
    right: -18px;
  }
  >>> .el-main {
    padding: 0;
  }
</style>
