<template>
  <div class="talk-chat">
    <el-form :inline="true" class="talk-chat__form" label-width="150px" :model="model">
      <el-form-item label="自定义时段：">
        <el-date-picker
          v-model="model.srhDate"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          align="right">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="个人号：">
        <el-select v-model="model.wid" filterable placeholder="全部" clearable>
          <el-option v-for="item in ownerData" :key="item.wid" :label="item.nick" :value="item.wid"/>
        </el-select>
      </el-form-item >
      <el-form-item label="聊天内容：">
        <el-input v-model="model.content"/>
      </el-form-item>
      <el-form-item>
        <ns-button type="primary" @click="search()">搜索</ns-button>
        <ns-button @click="reset()">重置</ns-button>
      </el-form-item>
    </el-form>
    <el-container class="talk-chat__container">
      <el-aside class="talk-aside">
        <div class="talk-aside__group">客户 / 群</div>
        <el-scrollbar class="scrollbara">
          <div class="talk-aside__item">
            <template v-for="(target, index) in targetList">
              <div class="talk-item" :class="{'talk-chosen':isCurrTarget(index)}" @click="clickTarget(index)">
                <div v-if="target.talkerType === 2" class="talk-item__avatar talk-item__avatar--bluebg">
                  <i class="iconfont icon-qun"></i>
                </div>
                <div v-else class="talk-item__avatar">
                  <img :src="target.head" class="talk-img">
                </div>
                <div class="talk-item__username">{{target.talkerName}}</div>
                <div class="talk-item__time">{{getHourMinitue(target.lastTime)}}</div>
              </div>
            </template>
          </div>
        </el-scrollbar>
      </el-aside>
      <el-main class="talk-main">
        <div v-if="currTargetIndex!=null && targetList[currTargetIndex]!=null">
          <div class="talk-main__header">
            <span class="talk-note">聊天记录 / {{targetList[currTargetIndex].talkerName}}</span>
            <ns-button type="text primary" @click="dialogVisible = true" class="talk-main__header--btn">
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
        <el-scrollbar class="scrollbarb">
          <div class="talk-main__strip">
            <template v-for="chat in chatList">
              <div :class="{'talk-strip':isChatLeft(chat.revieve), 'talk-right': !isChatLeft(chat.revieve), 'clearfix':  !isChatLeft(chat.revieve)}">
                <div :class="{'talk-strip__headportrait':isChatLeft(chat.revieve), 'talk-right__headportrait': !isChatLeft(chat.revieve), 'clearfix':  !isChatLeft(chat.revieve)}">
                  <img :src="chat.senderHead" alt="用户头像" class="talk-image">
                </div>
                <div :class="{'talk-strip__uname':isChatLeft(chat.revieve), 'talk-right__uname': !isChatLeft(chat.revieve)}">
                  <div :class="{'talk-msg':isChatLeft(chat.revieve), 'talk-rightmsg': !isChatLeft(chat.revieve)}">
                    <span :class="{'talk-msg__uname':isChatLeft(chat.revieve), 'talk-rightmsg__uname': !isChatLeft(chat.revieve)}">{{chat.senderNick}}</span>
                    <span :class="{'talk-msg__date':isChatLeft(chat.revieve), 'talk-rightmsg__date': !isChatLeft(chat.revieve)}">{{chat.createTime}}</span>
                  </div>
                  <div :class="{'talk-detail':isChatLeft(chat.revieve), 'talk-rightdetail': !isChatLeft(chat.revieve)}">
                    <div :class="{'talk-detail__record':isChatLeft(chat.revieve), 'talk-rightdetail__record': !isChatLeft(chat.revieve)}">
                      <div :class="{'talk-detail__record--circle':isChatLeft(chat.revieve), 'talk-rightdetail__record--circle': !isChatLeft(chat.revieve)}"></div>
                      {{chat.content}}
                    </div>
                    <div v-if="chat.cancel" :class="{'talk-detail__withdraw':isChatLeft(chat.revieve), 'talk-rightdetail__withdraw': !isChatLeft(chat.revieve)}">已撤回</div>
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
          <el-form-item :label="targetList[currTargetIndex].talkerName" label-width="70px">
            <el-form-grid>
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
        <div class="detail-rightside">
          <img :src="targetList[currTargetIndex].head" class="detail-rightside__img">
        </div>
      </div>
    </el-dialog>
    <!-- 详情弹窗-->
    <!-- 查询聊天内容弹窗 -->
    <el-dialog title="查看详情" :visible.sync="dialogVisible" width="442px" class="detail-dialog">
      <div class="detail-dialog__content" v-if="currTargetIndex!=null && targetList[currTargetIndex]!=null">
        <el-form label-width="80px" class="detail-leftside">
          <el-form-item :label="targetList[currTargetIndex].talkerName" label-width="70px">
            <el-form-grid>
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
        <div class="detail-rightside">
          <img :src="targetList[currTargetIndex].head" class="detail-rightside__img">
        </div>
      </div>
    </el-dialog>
    <!-- 查询聊天内容弹窗 -->
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
      width: 22%;
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
      flex: 1;
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
    }
    @b rightmsg {
      padding-top: 5px;
      float: right;
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
        float: right;
        position: relative;
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
  .scrollbara >>> .el-scrollbar__view {
    max-height: 600px;
  }
  .scrollbarb >>> .el-scrollbar__view {
    max-height: 600px;
  }
  >>> .el-main {
    padding: 0;
  }
</style>
