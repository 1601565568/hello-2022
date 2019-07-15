<template>
  <div class="groupData">
    <el-row style="margin-top: 20px">
      <ns-button type="primary" @click="dialogVisible = true">新建群聊</ns-button>
    </el-row>
    <el-row style="margin-top: 20px">
      <ns-button type="primary" @click="dialogVisible1 = true">新建群聊下一步</ns-button>
    </el-row>
    <el-row style="margin-top: 20px">
      <ns-button type="primary"  @click="dialogVisible2 = true">好友排重筛选</ns-button>
    </el-row>
    <el-row style="margin-top: 20px">
      <ns-button type="primary"  @click="dialogVisible3 = true">详情</ns-button>
    </el-row>
    <!-- 新建群聊弹窗-->
    <el-dialog
      title="新建群聊"
      :visible.sync="dialogVisible"
      width="663px" class="dialog-chat">
      <div class="dialog-chat__content">
        <div class="dialog-left">
          <div class="dialog-left__input">
            <el-input
              placeholder="输入个人号"
              prefix-icon="el-icon-search"
              v-model="input"
              clearable>
            </el-input>
          </div>
          <div class="dialog-left__checkbox">
            <div class="dialog-choice">可选择个人号（408）</div>
            <el-scrollbar  class="scrollbara">
              <el-checkbox-group v-model="checkList" class="checkbox">
                <div class="dialog-checkbox__item">
                  <el-checkbox label="淘宝优惠群淘宝优惠群淘宝优惠群淘宝优惠群"></el-checkbox>
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
            </el-scrollbar>
          </div>
        </div>
        <div class="dialog-right">
          <div class="dialog-right__title">已选择个人号（1）</div>
          <div class="dialog-right__content">
            <el-scrollbar class="scrollbara">
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup">淘宝优惠群淘宝优惠群淘宝优惠群淘宝优惠群</span>
                <i class="iconfont icon-shanchu2"></i>
              </div>
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup"> 淘宝优惠群（1）</span>
                <i class="iconfont icon-shanchu2"></i>
              </div>
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup"> 淘宝优惠群（1）</span>
                <i class="iconfont icon-shanchu2"></i>
              </div>
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup">淘宝优惠群淘宝优惠群淘宝优惠群淘宝优惠群</span>
                <i class="iconfont icon-shanchu2"></i>
              </div>
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup"> 淘宝优惠群（1）</span>
                <i class="iconfont icon-shanchu2"></i>
              </div>
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup"> 淘宝优惠群（1）</span>
                <i class="iconfont icon-shanchu2"></i>
              </div>
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup">淘宝优惠群淘宝优惠群淘宝优惠群淘宝优惠群</span>
                <i class="iconfont icon-shanchu2"></i>
              </div>
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup"> 淘宝优惠群（1）</span>
                <i class="iconfont icon-shanchu2"></i>
              </div>
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup"> 淘宝优惠群（1）</span>
                <i class="iconfont icon-shanchu2"></i>
              </div>
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup">淘宝优惠群淘宝优惠群淘宝优惠群淘宝优惠群</span>
                <i class="iconfont icon-shanchu2"></i>
              </div>
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup"> 淘宝优惠群（1）</span>
                <i class="iconfont icon-shanchu2"></i>
              </div>
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup"> 淘宝优惠群（1）</span>
                <i class="iconfont icon-shanchu2"></i>
              </div>
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup">淘宝优惠群淘宝优惠群淘宝优惠群淘宝优惠群</span>
                <i class="iconfont icon-shanchu2"></i>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-btn">
        <ns-button @click="dialogVisible = false">取消</ns-button>
        <ns-button @click="dialogVisible = false" class="dialog-btn__next">下一步</ns-button>
      </span>
    </el-dialog>
    <!-- 新建群聊弹窗-->

    <!-- 新建群聊下一步弹窗-->
    <el-dialog
      title="新建群聊"
      :visible.sync="dialogVisible1"
      width="663px" class="dialog-chat">
      <el-row  class="dialog-chat__header">
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
              prefix-icon="el-icon-search"
              v-model="input"
              clearable>
            </el-input>
          </div>
          <div class="dialog-left__checkbox">
            <div class="dialog-choice">可选择个人号（408）</div>
            <el-scrollbar class="scrollbarb">
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
            </el-scrollbar>
          </div>
        </div>
        <div class="dialog-right">
          <div class="dialog-right__title">已选择个人号（1）</div>
          <div class="dialog-right__content">
            <el-scrollbar class="scrollbarb">
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup"> 淘宝优惠群（1）</span>
                <i class="iconfont icon-shanchu2"></i>
              </div>
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup">淘宝优惠群淘宝优惠群淘宝优惠群淘宝优惠群</span>
                <i class="iconfont icon-shanchu2"></i>
              </div>
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup"> 淘宝优惠群（1）</span>
                <i class="iconfont icon-shanchu2"></i>
              </div>
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup"> 淘宝优惠群（1）</span>
                <i class="iconfont icon-shanchu2"></i>
              </div>
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup">淘宝优惠群淘宝优惠群淘宝优惠群淘宝优惠群</span>
                <i class="iconfont icon-shanchu2"></i>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <el-row class="dialog-chat__bulletin">
        <el-col :span="3">
          <div class="dialog-bulletin">
            群名称：
          </div>
        </el-col>
        <el-col :span="21">
          <div class="dialog-edit">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请编辑群公告"
              v-model="textarea">
            </el-input>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-btn">
        <ns-button @click="dialogVisible = false">上一步</ns-button>
        <ns-button @click="dialogVisible = false" class="dialog-btn__next">确定</ns-button>
      </span>
    </el-dialog>
    <!-- 新建群聊下一步弹窗-->

    <!-- 好友排重筛选弹窗-->
    <el-dialog
      title="好友排重筛选"
      :visible.sync="dialogVisible2"
      width="663px" class="dialog-chat">
      <el-row class="dialog-chat__header">
        <el-col :span="10">
          <div class="dialog-person">
            <spn class="dialog-person__start">*</spn>
            <span>选择个人号：</span>
            <el-select v-model="value" placeholder="全部" class="dialog-person__select">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="11">
          <div class="dialog-searchname">
            <span  class="dialog-searchname__text">搜索微信群：</span>
            <el-input
              placeholder="输入群名称"
              prefix-icon="el-icon-search"
              v-model="input"
              clearable>
            </el-input>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="dialog-find">
            <ns-button type="primary" class="dialog-find__btn">搜索</ns-button>
          </div>
        </el-col>
      </el-row>
      <div class="dialog-chat__content dialog-chat__content--top">
        <div class="dialog-left">
          <div class="dialog-left__checkbox">
            <div class="dialog-choice dialog-marginzero">可选择微信群</div>
            <el-scrollbar class="scrollbarc">
              <el-checkbox-group v-model="checkList" class="checkbox">
                <div class="dialog-checkbox__item">
                  <el-checkbox label="易也难易也难易也难易也难易也难易也难易也难"></el-checkbox>
                </div>
                <div class="dialog-checkbox__item">
                  <el-checkbox label="易也难"></el-checkbox>
                </div>
                <div class="dialog-checkbox__item">
                  <el-checkbox label="孟轻舟"></el-checkbox>
                </div>
                <div class="dialog-checkbox__item">
                  <el-checkbox label="易也难"></el-checkbox>
                </div>
                <div class="dialog-checkbox__item">
                  <el-checkbox label="孟轻舟"></el-checkbox>
                </div>
                <div class="dialog-checkbox__item">
                  <el-checkbox label="易也难"></el-checkbox>
                </div>
                <div class="dialog-checkbox__item">
                  <el-checkbox label="孟轻舟"></el-checkbox>
                </div>
                <div class="dialog-checkbox__item">
                  <el-checkbox label="易也难"></el-checkbox>
                </div>
                <div class="dialog-checkbox__item">
                  <el-checkbox label="孟轻舟"></el-checkbox>
                </div>
                <div class="dialog-checkbox__item">
                  <el-checkbox label="易也难"></el-checkbox>
                </div>
                <div class="dialog-checkbox__item">
                  <el-checkbox label="孟轻舟"></el-checkbox>
                </div>
              </el-checkbox-group>
            </el-scrollbar>
          </div>
        </div>
        <div class="dialog-right">
          <div class="dialog-right__title dialog-paddingtop">已选择微信群</div>
          <div class="dialog-right__content">
            <el-scrollbar class="scrollbarc">
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup">易也难易也难易也难易也难易也难易也难易也难</span>
                <i class="iconfont icon-shanchu2"></i>
              </div>
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup">易也难</span>
                <i class="iconfont icon-shanchu2"></i>
              </div>
              <div class="dialog-selectitem">
                <span class="dialog-selectitem__discountgroup">易也难</span>
                <i class="iconfont icon-shanchu2"></i>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-btn">
        <ns-button @click="dialogVisible = false">上一步</ns-button>
        <ns-button @click="dialogVisible = false" class="dialog-btn__next">确定</ns-button>
      </span>
    </el-dialog>
    <!-- 好友排重筛选弹窗-->

    <!-- 详情弹窗-->
    <el-dialog
      title="详情"
      :visible.sync="dialogVisible3"
      width="504px" class="detail-dialog">
      <div class="detail-dialog__content">
        <el-form label-width="80px" class="detail-leftside">
          <el-form-item label="微信号：" class="detail-leftside__item">
            <el-form-grid  class="detail-leftside__item--blackcolor detail-leftside__item--rowheight">baiyu19900408</el-form-grid>
          </el-form-item>
          <el-form-item label="微信昵称：" class="detail-leftside__item">
            <el-form-grid class="detail-leftside__item--blackcolor">长安自在风</el-form-grid>
          </el-form-item>
          <el-form-item label="性别：" class="detail-leftside__item">
            <el-form-grid class="detail-leftside__item--blackcolor">男</el-form-grid>
          </el-form-item>
          <el-form-item label="地区：" class="detail-leftside__item">
            <el-form-grid class="detail-leftside__item--blackcolor">中国 / 浙江 / 杭州市</el-form-grid>
          </el-form-item>
          <el-form-item label="所属微信群：" class="detail-leftside__item">
            <el-form-grid class="detail-leftside__item--blackcolor">易也难</el-form-grid>
          </el-form-item>
          <el-form-item label="群公告：" class="detail-leftside__item">
            <el-form-grid class="detail-leftside__item--blackcolor">天王盖地虎，八月十五号三周年店庆2029优惠多多</el-form-grid>
          </el-form-item>
          <el-form-item label="入会时间：" class="detail-leftside__item">
            <el-form-grid class="detail-leftside__item--blackcolor">2019-06-27 11:50:06</el-form-grid>
          </el-form-item>
          <el-form-item label="专属导购：" class="detail-leftside__item">
            <el-form-grid class="detail-leftside__item--blackcolor">易也难</el-form-grid>
          </el-form-item>
          <el-form-item label="是否与专属导购成为好友关系：" label-width="180px" class="detail-leftside__item">
            <el-form-grid class="delete-leftside__item--blackcolor">是</el-form-grid>
          </el-form-item>
        </el-form>
        <div class="detail-rightside">
          <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" class="detail-rightside__img" alt="商品图片">
        </div>
      </div>
    </el-dialog>
    <!-- 详情弹窗-->
  </div>
</template>
<script>
export default {
  data () {
    return {
      radio1: '今天',
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      input: '',
      radiogroup: '1',
      checkList: ['选中且禁用', '淘宝优惠群'],
      textarea: '',
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
      value: ''
    }
  }
}
</script>
<style scoped>
  @import "@/style/small/variables.pcss";
  :root {
    --theme-font-color-gray: #BBBBBB;
    --theme-font-color-blue: #1789FB;
    --theme-font-color-red: #FA3E2E;
    --theme-font-color-black: #343940;
    --theme-background-color-blue: #0091FA;
  }
  @component-namespace dialog {
    @b chat {
      @e header {
        line-height: 36px;
        padding: 0 10px;
        margin: 5px 0 15px;
      }
      @e content{
        display: flex;
        margin: 20px 10px 0;
        @m boderbottom {
          border-bottom: 1px solid  #F2F2F2;;
        }
        @m top {
          margin-top: 30px !important;
        }
      }
      @e bulletin {
        margin: 25px 0 15px;
        padding-right: 10px;
      }
    }
    @b left {
      width: 55%;
      padding: 0 15px 25px 0;
      border-right: 1px solid #F2F2F2;
      @e input {
        font-size: var(--default-font-size-base);
        color: var(--theme-font-color-primary);
        padding-right: 30%;
      }
      @e checkbox {
        @b choice {
          font-size: var(--default-font-size-base);
          color: var(--theme-font-color-primary);
          font-weight: bold;
          margin-top: 25px;
        }
        @b checkbox {
          @e item {
            color: var(--theme-font-color-primary);
            position: relative;
            margin-top: 10px;
            padding-right: 5px;
          }
        }
      }
    }
    @b right {
      width: 45%;
      padding: 0  0 25px 15px;
      @e title {
        font-size: var(--default-font-size-base);
        color: var(--theme-font-color-primary);
        font-weight: bold;
        padding-top: 53px;
      }
      @e content {  }
    }
    @b selectitem {
      font-size: var(--default-font-size-small);
      color: var(--theme-font-color-primary);
      position: relative;
      margin: 10px 15px 0 0;
      cursor: pointer;
      @e discountgroup {
        display: inline-block;
        width: 83%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    @b btn {
      @e next {
        color: var( --theme-color-white);
        background: var(--theme-background-color-blue);
      }
    }
    @b name {
      @e start {
        font-size: var(--default-font-size-small);
        color: var(--theme-font-color-red);
      }
      @e group {}
    }
    @b inputname {
      margin-left: -10px;
    }
    @b max {
      text-align: center;
      line-height: 36px;
      width: 123px;
      height: 36px;
      margin-left: 10px;
      background: #f1f8ff;
      @e length {
        font-size: var(--default-font-size-small);
        color: var(--theme-font-color-blue);
      }
    }
    @b bulletin {
      padding-left: 10px;
      margin-top: 5px;
    }
    @b edit {
      margin-left: -20px;
    }
    @b person {
      font-size: var(--default-font-size-base);
      color: var(--theme-font-color-black);
      @e start {
        font-size: var(--default-font-size-small);
        color: var(--theme-font-color-red);
        margin-top: 10px;
      }
    }
    @b searchname {
      display: flex;
      @e text {
        font-size: var(--default-font-size-base);
        color: var(--theme-font-color-black);
        width: 46%;
      }
    }
    @b find {
      @e btn {
        margin-left: 15px;
      }
    }
    @b marginzero {
      margin-top: 0 !important;
    }
    @b paddingtop {
      padding-top: 0;
    }
  }
  @component-namespace detail {
    @b dialog {
      @e content {
        position: relative;
        padding-bottom: 20px;
      }
    }
    @b leftside {
      width: 65%;
      padding-top: 10px;
      @e item {
        font-size: var(--default-font-size-base);
        color: var(--theme-font-color-secondary);
      }
      @m blackcolor {
        font-size: var(--default-font-size-base);
        color: var(--theme-font-color-primary);
      }
    }
    @b rightside {
      width: 84px;
      height: 84px;
      position: absolute;
      top: 0;
      right: 14px;
      @e img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
 .icon-shanchu2 {
   font-size: var(--default-font-size-base);
   color: var(--theme-font-color-gray);
   position: absolute;
   top: 0;
   right: 0;
 }
  >>> .el-checkbox-group .el-checkbox {
    display: block;
  }
  >>> .el-checkbox__input {
    position: absolute;
    right: 0;
    top: 3px;
  }
  .icon-tishi {
    font-size: var(--default-font-size-base);
    color: var(--theme-font-color-blue);
  }
  >>> .el-checkbox__input.is-checked + .el-checkbox__label {
    width: 55%;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
  >>> .el-checkbox__label {
    width: 55%;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
  >>> .el-input--prefix .el-input__inner {
    padding-left: 30px;
  }
  >>> .el-input__suffix {
    top: 5px;
  }
  .scrollbara >>> .el-scrollbar__view {
    max-height: 400px;
  }
  .scrollbarb >>> .el-scrollbar__view {
    max-height: 300px;
  }
  .scrollbarc >>> .el-scrollbar__view {
    max-height: 400px;
  }
</style>
