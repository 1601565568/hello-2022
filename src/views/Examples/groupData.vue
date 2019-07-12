<template>
  <div class="groupData">
    <el-row>
      <ns-button type="primary" @click="dialogVisible = true">新建群聊</ns-button>
      <ns-button type="primary" @click="dialogVisible1 = true">新建群聊下一步</ns-button>
      <ns-button type="primary">详情</ns-button>
      <ns-button type="primary">好友排重筛选</ns-button>
    </el-row>
    <!-- 新建群聊弹窗-->
    <el-dialog
      title="删除商品"
      :visible.sync="dialogVisible"
      width="663px" class="dialog-chat">
      <div class="dialog-chat__content">
        <div class="dialog-left">
          <div class="dialog-left__input">
            <el-input
                      placeholder="输入个人号"
                      v-model="input">
              <i slot="suffix" class="el-input__icon el-icon-error"></i>
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
          <div class="dialog-left__checkbox">
            <div class="dialog-choice">可选择个人号（408）</div>
            <el-checkbox-group v-model="checkList" class="checkbox">
              <div class="dialog-checkbox__item">
                <el-checkbox label="淘宝优惠群"></el-checkbox>
              </div>
              <div class="dialog-checkbox__item">
                <el-checkbox label="天猫打折群"></el-checkbox>
              </div>
              <div class="dialog-checkbox__item">
                <el-checkbox label="东方1号门店会员群"></el-checkbox>
              </div>
              <div class="dialog-checkbox__item">
                <el-checkbox label="东方2号门店会员群"></el-checkbox>
              </div>
              <div class="dialog-checkbox__item">
                <el-checkbox label="天猫打折群"></el-checkbox>
              </div>
              <div class="dialog-checkbox__item">
                <el-checkbox label="东方1号门店会员群"></el-checkbox>
              </div>
              <div class="dialog-checkbox__item">
                <el-checkbox label="东方2号门店会员群"></el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
        </div>
        <div class="dialog-right">
          <div class="dialog-right__select">已选择个人号（1）</div>
          <div class="dialog-right__selected">
            淘宝优惠群（1）
            <i class="iconfont icon-shanchu2"></i>
          </div>
        </div>
      </div>
      <div class="dialog-chat__footer">
        <span slot="footer" class="dialog-btn">
          <ns-button @click="dialogVisible = false">取消</ns-button>
          <ns-button @click="dialogVisible = false" class="dialog-btn__next">下一步</ns-button>
        </span>
      </div>
    </el-dialog>
    <!-- /新建群聊下一步弹窗-->
    <!-- 新建群聊弹窗-->
    <el-dialog
      title="删除商品"
      :visible.sync="dialogVisible1"
      width="663px" class="dialog-chat">
      <el-row :gutter="20" class="dialog-chat__header">
        <el-col :span="3">
          <div class="dialog-name">
            <spn class="dialog-name__start">*</spn>
            <span class="dialog-name__group">群名称：</span>
          </div>
        </el-col>
        <el-col :span="13">
          <div class="dialog-inputname">
            <el-input v-model="input" placeholder="输入群名称"></el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="dialog-max">
            <i class="iconfont icon-tishi"></i>
            <span class="dialog-max__length">字数最多15字</span>
          </div>
        </el-col>
      </el-row>
      <div class="dialog-chat__content dialog-chat__content--boderbottom">
        <div class="dialog-left">
          <div class="dialog-left__input">
            <el-input
              placeholder="输入微信号/昵称"
              v-model="input">
              <i slot="suffix" class="el-input__icon el-icon-error"></i>
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
          <div class="dialog-left__checkbox">
            <div class="dialog-choice">可选择个人号（408）</div>
            <el-checkbox-group v-model="checkList" class="checkbox">
              <div class="dialog-checkbox__item">
                <el-checkbox label="淘宝优惠群"></el-checkbox>
              </div>
              <div class="dialog-checkbox__item">
                <el-checkbox label="天猫打折群"></el-checkbox>
              </div>
              <div class="dialog-checkbox__item">
                <el-checkbox label="东方1号门店会员群"></el-checkbox>
              </div>
              <div class="dialog-checkbox__item">
                <el-checkbox label="东方2号门店会员群"></el-checkbox>
              </div>
              <div class="dialog-checkbox__item">
                <el-checkbox label="天猫打折群"></el-checkbox>
              </div>
              <div class="dialog-checkbox__item">
                <el-checkbox label="东方1号门店会员群"></el-checkbox>
              </div>
              <div class="dialog-checkbox__item">
                <el-checkbox label="东方2号门店会员群"></el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
        </div>
        <div class="dialog-right">
          <div class="dialog-right__select">已选择个人号（1）</div>
          <div class="dialog-right__selected">
            淘宝优惠群（1）
            <i class="iconfont icon-shanchu2"></i>
          </div>
        </div>
      </div>
      <el-row :gutter="20" class="dialog-chat__bulletin">
        <el-col :span="3">
          <div class="dialog-bulletin">
            群名称：
          </div>
        </el-col>
        <el-col :span="21">
          <div class="dialog-edit">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请编辑群公告"
              v-model="textarea" class="dialog-edit__input">
            </el-input>
          </div>
        </el-col>
      </el-row>
      <div class="dialog-chat__footer">
        <span slot="footer" class="dialog-btn">
          <ns-button @click="dialogVisible = false">上一步</ns-button>
          <ns-button @click="dialogVisible = false" class="dialog-btn__next">确定</ns-button>
        </span>
      </div>
    </el-dialog>
    <!-- /新建群聊下一步弹窗-->
  </div>
</template>
<script>
  export default {
    data () {
      return {
        radio1: '今天',
        dialogVisible: false,
        dialogVisible1: false,
        input: '',
        radiogroup: '1',
        checkList: ['选中且禁用','淘宝优惠群'],
        textarea: ''
      }
    }
  }
</script>
<style scoped>
  @import "@/style/small/variables.pcss";
  @component-namespace dialog {
    @b chat {
      @e header {
        line-height: 36px;
        padding: 0 10px;
        margin: 5px 0 15px;
      }
      @e content{
        display: flex;
        margin: 0 10px;
        @m boderbottom {
          border-bottom: 1px solid  #F2F2F2;;
        }
      }
      @e bulletin {
        margin-top: 25px;
        padding-right: 10px;
      }
      @e footer{
        text-align: right;
        margin: 30px 0;
        padding: 0 10px;
      }
    }
    @b left {
      width: 60%;
      padding: 0 15px 25px 0;
      border-right: 1px solid #F2F2F2;
      @e input {
        font-size: var(--default-font-size-middle);
        color: var(--theme-font-color-primary);
        padding-right: 30%;
        margin-top: 10px;
      }
      @e checkbox {
        @b choice {
          font-size: var(--default-font-size-middle);
          color: var(--theme-font-color-primary);
          font-weight: bold;
          margin-top: 25px;
        }
        @b checkbox {
          @e item {
            color: var(--theme-font-color-primary);
            position: relative;
            margin-top: 25px;
          }
        }
      }
    }
    @b right {
      width: 40%;
      padding: 71px  0 25px 15px;
      @e select {
        font-size: var(--default-font-size-middle);
        color: var(--theme-font-color-primary);
        font-weight: bold;
      }
      @e selected {
        font-size: var(--default-font-size-small);
        color: var(--theme-font-color-primary);
        margin-top: 25px;
        padding-bottom: 25px;
      }
    }
    @b btn {
      @e next {
        color: var( --theme-color-white);
        background: #0091FA;
      }
    }
    @b name {
      @e start {
        font-size: 12px;
        color: #FA3E2E;
      }
      @e group {}
    }
    @b inputname {
      margin-left: -20px;
    }
    @b max {
      text-align: center;
      line-height: 36px;
      width: 123px;
      height: 36px;
      margin-left: -5px;
      background: #f1f8ff;
      @e length {
        font-size: 12px;
        color: #1789FB;
      }
    }
    @b bulletin {
      padding-left: 5px;
      margin-top: 5px;
    }
    @b edit {
      margin-left: -20px;
      @e input {
        height: 62px !important;

      }
    }
  }
  >>> .el-input--small .el-input__inner {
    line-height: 36px;
    height: 36px;
  }
  >>> .el-input__suffix:before {
    border: none;
  }
  >>> .el-icon-error {
    font-size: var(--default-font-size-base);
    color:  #BBBBBB;
    margin-top: 5px;
  }
 >>> .el-icon-search {
   font-size: var(--default-font-size-middle);
   color: var(--theme-font-color-secondary);
   margin-top: 5px;
 }
 .icon-shanchu2 {
   font-size: var(--default-font-size-base);
   color: #BBBBBB;
   float: right;
 }
  >>> .el-checkbox-group .el-checkbox {
    display: block;
  }
  >>> .el-checkbox__input {
    position: absolute;
    right: 0;
    top: 0;
  }
  >>> .el-input.el-input--small .el-input__inner {
    font-size: var(--default-font-size-base);
  }
  >>> .el-dialog__header {
    padding: 15px 20px !important;
  }
  .icon-tishi {
    font-size: var(--default-font-size-base);
    color: #1789FB;
  }
  >>> .el-textarea__inner {
    height: 62px;
  }
</style>
