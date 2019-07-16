<template>
  <div class="talk-chat">
    <el-form :inline="true" class="demo-form-inline talk-chat__form">
      <el-form-item>
        <el-radio-group v-model="radio1">
          <el-radio-button label="今天"></el-radio-button>
          <el-radio-button label="昨天"></el-radio-button>
          <el-radio-button label="近7天"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <span>自定义时段：</span>
        <el-time-picker
          v-model="value2"
          :picker-options="{
          selectableRange: '18:30:00 - 20:30:00'}"
          placeholder="任意时间点">
        </el-time-picker>
        <el-time-picker
          arrow-control
          v-model="value3"
          :picker-options="{
          selectableRange: '18:30:00 - 20:30:00'}"
          placeholder="任意时间点">
        </el-time-picker>
      </el-form-item>
      <el-form-item>
        <span>个人号：</span>
        <el-select v-model="value8" filterable placeholder="全部">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-form-item label="聊天内容：">
          <el-input></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <ns-button type="primary">搜索</ns-button>
        <ns-button >重置</ns-button>
      </el-form-item>
    </el-form>
    <el-container class="talk-chat__container">
      <el-aside width="30%" class="talk-aside">
          <div class="talk-aside__group">客户 / 群</div>
          <div class="talk-aside__item">
            <div class="talk-item">
              <div class="talk-item__avatar">
                <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" alt="用户头像" class="talk-img">
              </div>
              <div class="talk-item__username">顾青</div>
              <div class="talk-item__time">13:18</div>
            </div>
            <div class="talk-item">
              <div class="talk-item__avatar">
                <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" alt="用户头像" class="talk-img">
              </div>
              <div class="talk-item__username">天猫粉丝促销群天猫粉丝促销群天猫粉丝促销群天猫粉丝促销群天猫粉丝促销群</div>
              <div class="talk-item__time">13:18</div>
            </div>
            <div class="talk-item">
              <div class="talk-item__avatar">
                <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" alt="用户头像" class="talk-img">
              </div>
              <div class="talk-item__username">顾青</div>
              <div class="talk-item__time">13:18</div>
            </div>
            <div class="talk-item">
              <div class="talk-item__avatar">
                <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" alt="用户头像" class="talk-img">
              </div>
              <div class="talk-item__username">顾青</div>
              <div class="talk-item__time">13:18</div>
            </div>
            <div class="talk-item">
              <div class="talk-item__avatar">
                <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" alt="用户头像" class="talk-img">
              </div>
              <div class="talk-item__username">顾青</div>
              <div class="talk-item__time">13:18</div>
            </div>
            <div class="talk-item">
              <div class="talk-item__avatar">
                <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" alt="用户头像" class="talk-img">
              </div>
              <div class="talk-item__username">顾青</div>
              <div class="talk-item__time">13:18</div>
            </div>
            <div class="talk-item">
              <div class="talk-item__avatar">
                <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" alt="用户头像" class="talk-img">
              </div>
              <div class="talk-item__username">顾青</div>
              <div class="talk-item__time">13:18</div>
            </div>
            <div class="talk-item">
              <div class="talk-item__avatar">
                <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" alt="用户头像" class="talk-img">
              </div>
              <div class="talk-item__username">顾青</div>
              <div class="talk-item__time">13:18</div>
            </div>
          </div>
      </el-aside>
      <el-main class="talk-main">
        <div class="talk-main__header">
          <span class="talk-note">聊天记录 / 顾青</span>
          <ns-button type="text primary">查看详情></ns-button>
          <span class="talk-person">个人号：昵称（ cpk201807 )</span>
        </div>
        <div class="talk-main__strip">
          <div class="talk-strip">
            <div class="talk-strip__headportrait">
              <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" alt="用户头像" class="talk-image">
            </div>
            <div class="talk-strip__uname">
              <div class="talk-msg">
                <span class="talk-msg__uname">顾青</span>
                <span class="talk-msg__date">2019-05-29 13:01</span>
              </div>
              <div class="talk-detail">
                <div class="talk-detail__record">早上好啊，该起床了</div>
                <div class="talk-detail__circle"></div>
              </div>
            </div>
          </div>
          <div class="talk-strip">
            <div class="talk-strip__headportrait">
              <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" alt="用户头像" class="talk-image">
            </div>
            <div class="talk-strip__uname">
              <div class="talk-msg">
                <span class="talk-msg__uname">顾青</span>
                <span class="talk-msg__date">2019-05-29 13:01</span>
              </div>
              <div class="talk-detail">
                <div class="talk-detail__record">2019过去了一半了，你还不起床吗？</div>
                <div class="talk-detail__circle"></div>
              </div>
            </div>
          </div>
          <div class="talk-right clearfix">
            <div class="talk-right__headportrait">
              <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" alt="用户头像" class="talk-image">
            </div>
            <div class="talk-right__uname">
              <div class="talk-rightmsg">
                <span class="talk-rightmsg__uname">顾青</span>
                <span class="talk-rightmsg__date">2019-05-29 13:01</span>
              </div>
              <div class="talk-rightdetail">
                <div class="talk-rightdetail__record">大中午的不睡觉，你是不是很闲的？大中午的不睡觉，你是不是很闲的？大中午的不睡觉，你是不是很闲的？大中午的不睡觉，你是不是很闲的？大中午的不睡觉，你是不是很闲的？大中午的不睡觉，你是不是很闲的？大中午的不睡觉，你是不是很闲的？大中午的不睡觉，你是不是很闲的？</div>
                <div class="talk-rightdetail__circle"></div>
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formInline: {
        user: '',
        region: ''
      },
      radio1: '今天',
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value8: '',
      input10: '',
      value2: new Date(2016, 9, 10, 18, 40),
      value3: new Date(2016, 9, 10, 18, 40)
    }
  }
}
</script>

<style scoped>
  @import "@/style/small/variables.pcss";
  @component-namespace talk {
    @b chat {
      @e form {}
      @e container {
        width: 100%;
        display: flex;
        background: #FFFFFF;
      }
    }
    @b aside {
      width: 410px;
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
      @e avatar {
        width: 30px;
        height: 30px;
        float: left;
        margin-top: 10px;
      }
      @e username {
        font-size: 16px;
        color: #33393E;
        width: 75%;
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
      width: 50%;
      @e headportrait {
        width: 52px;
        height: 52px;
        float: left;
      }
      @e uname {
        margin-left: 70px;
      }
    }
    @b right {
      padding: 20px;
      width: 50%;
      position: relative;
      float: right;
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
      width: 58%;
      position: relative;
      @e record {
        font-size: 14px;
        color: #33393E;
        text-align: center;
        padding: 15px;
        margin-top: 8px;
        background: #F2F4F6;
        border-radius: 5px;
      }
      @e circle {
        width: 0;
        height: 0;
        position: absolute;
        left: -15px;
        top: 20%;
        border-width: 8px;
        border-style: solid;
        border-color: transparent #F2F4F6 transparent transparent;
      }
    }
    @b rightmsg {
      padding-top: 5px;
      float: right;
      @e rightuname {
        font-size: 14px;
        color: #606266;
      }
      @e rightdate {
        font-size: 14px;
        color: #909399;
        margin-left: 10px;
      }
    }
    @b rightdetail {
      position: absolute;
      right: 90px;
      top: 45px;
      @e record {
        font-size: 14px;
        color: #33393E;
        text-align: center;
        padding: 15px;
        margin-top: 8px;
        background: #F2F4F6;
        border-radius: 5px;
        float: right;
      }
      @e circle {
        width:0;
        height:0;
        position: absolute;
        right: -7px;
        top: 25%;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-left: 8px solid #F2F4F6;
        border-radius: 5px;
      }
    }
    @b image {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
</style>
