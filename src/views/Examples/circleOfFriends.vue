<template>
  <div class="talk-chat">
    <!--<ns-button @click="dialogVisible = true">发朋友圈</ns-button>-->
    <div class="talk-chat__header">
      <div class="talk-form">
        <el-form :inline="true" class="talk-chat__form" label-width="150px">
          <el-form-item>
            <ns-button type="primary">发朋友圈</ns-button>
          </el-form-item>
          <el-form-item label="个人号：">
            <el-select v-model="value8" filterable placeholder="全部">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item >
          <el-form-item label="日期：">
            <el-date-picker
              v-model="value1"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <ns-button type="primary">搜索</ns-button>
            <ns-button >重置</ns-button>
          </el-form-item>
          <el-form-item>
            <button type="button" class="el-button el-button--text el-button--small">
              <span>
                展开搜索
                <i class="el-icon--right el-icon-arrow-down"></i>
              </span>
            </button>
          </el-form-item>
        </el-form>
      </div>
      <div class="talk-personal"></div>
    </div>
    <el-container class="talk-chat__container">
      <el-aside class="talk-aside">
        <el-scrollbar class="scrollbar">
          <div class="talk-aside__list">
            <div class="talk-item clearfix">
              <div class="talk-item__avatar">
                <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" class="talk-avatarimg" alt="商品图片" >
              </div>
              <div class="talk-item__content">
                <div class="talk-name">
                  <span class="talk-name__call">起个名字好麻烦</span>
                  <span class="talk-name__private">个人号：微信昵称（ wechatid ）</span>
                </div>
                <div class="talk-sentence">散场总是难免的，尽兴而归就好</div>
                <div class="talk-matching clearfix">
                  <div class="talk-matching__photowall">
                    <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" class="talk-matchingimg" alt="商品图片">
                  </div>
                  <div class="talk-matching__photowall">
                    <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" class="talk-matchingimg" alt="商品图片">
                  </div>
                  <div class="talk-matching__photowall">
                    <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" class="talk-matchingimg" alt="商品图片">
                  </div>
                  <div class="talk-matching__photowall">
                    <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" class="talk-matchingimg" alt="商品图片">
                  </div>
                </div>
                <div class="talk-time">2019-06-03 17:17:00</div>
                <div class="talk-interactive">
                  <span class="talk-interactive__like">
                    <i class="iconfont icon-dianzan"></i>
                    20
                  </span>
                  <span class="talk-interactive__comment">
                    <i class="iconfont icon-pinglun"></i>
                    18
                  </span>
                </div>
              </div>
            </div>
            <div class="talk-item clearfix">
              <div class="talk-item__avatar">
                <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" class="talk-avatarimg" alt="商品图片" >
              </div>
              <div class="talk-item__content">
                <div class="talk-name">
                  <span class="talk-name__call">起个名字好麻烦</span>
                  <span class="talk-name__private">个人号：微信昵称（ wechatid ）</span>
                </div>
                <div class="talk-sentence">散场总是难免的，尽兴而归就好</div>
                <div class="talk-matching clearfix">
                  <div class="talk-matching__photowall">
                    <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" class="talk-matchingimg" alt="商品图片">
                  </div>
                  <div class="talk-matching__photowall">
                    <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" class="talk-matchingimg" alt="商品图片">
                  </div>
                  <div class="talk-matching__photowall">
                    <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" class="talk-matchingimg" alt="商品图片">
                  </div>
                  <div class="talk-matching__photowall">
                    <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" class="talk-matchingimg" alt="商品图片">
                  </div>
                </div>
                <div class="talk-time">2019-06-03 17:17:00</div>
                <div class="talk-interactive">
                  <span class="talk-interactive__like">
                    <i class="iconfont icon-dianzan colorblue"></i>
                    20
                  </span>
                  <span class="talk-interactive__comment">
                    <i class="iconfont icon-pinglun"></i>
                    18
                  </span>
                </div>
                <div class="talk-detail">
                  <div class="talk-detail__substance">
                    <div>
                      <span>
                      <i class="iconfont icon-dianzan colorblue"></i>
                      起个名字好麻烦，长安自在风
                    </span>
                    </div>
                    <div>
                      <span>起个名字好麻烦：</span>
                      <span>我也老了</span>
                      <span>回复</span>
                    </div>
                    <div>
                      <span>长安自在风</span>
                      <span>回复</span>
                      <span>起个名字好麻烦：</span>
                      <span>你还年轻</span>
                      <span>回复</span>
                    </div>
                    <div>
                      <span>起个名字好麻烦</span>
                      <span>回复</span>
                      <span>长安自在风：</span>
                      <span>你骗人</span>
                      <span>删除</span>
                    </div>
                  </div>
                  <div  class="talk-detail__circle"></div>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
        <div class="talk-bottom">
          <div class="template-table-pagination el-pagination">
            <span class="el-pagination__total">共 83 条</span>
            <span class="el-pagination__sizes">
        <div class="el-select el-select--mini">
          <div class="el-input el-input--mini el-input--suffix">
            <input type="text" readonly="readonly" autocomplete="off" placeholder="请选择" class="el-input__inner">
            <span class="el-input__suffix">
              <span class="el-input__suffix-inner">
                <i class="el-select__caret el-input__icon el-icon-arrow-up"></i>
              </span>
            </span>
          </div>
          <div class="el-select-dropdown el-popper" style="display: none; min-width: 110px;"><div class="el-scrollbar" style="">
            <div class="el-select-dropdown__wrap el-scrollbar__wrap" style="margin-bottom: -17px; margin-right: -17px;">
              <ul class="el-scrollbar__view el-select-dropdown__list">
                <li class="el-select-dropdown__item selected"><span>15条/页</span></li>
                <li class="el-select-dropdown__item"><span>25条/页</span></li>
                <li class="el-select-dropdown__item"><span>50条/页</span></li>
                <li class="el-select-dropdown__item"><span>100条/页</span></li>
              </ul>
            </div>
            <div class="el-scrollbar__bar is-horizontal">
              <div class="el-scrollbar__thumb" style="transform: translateX(0%);"></div>
            </div>
            <div class="el-scrollbar__bar is-vertical">
            <div class="el-scrollbar__thumb" style="transform: translateY(0%);"></div></div></div>
          </div></div></span><button type="button" disabled="disabled" class="btn-prev"><i class="el-icon el-icon-arrow-left"></i></button><ul class="el-pager"><li class="number active">1</li><!----><li class="number">2</li><li class="number">3</li><li class="number">4</li><li class="number">5</li><!----><li class="number">6</li></ul><button type="button" class="btn-next"><i class="el-icon el-icon-arrow-right"></i></button><span class="el-pagination__jump">前往<div class="el-input el-input--small el-pagination__editor is-in-pagination"><!----><input type="number" autocomplete="off" min="1" max="6" class="el-input__inner"><!----><!----><!----></div>页</span>
          </div>
        </div>
      </el-aside>
      <el-main class="talk-main">Main</el-main>
    </el-container>
    <!-- 发朋友圈弹窗-->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="540px"
      class="dialog-content">
      <el-form ref="form" label-width="80px">
        <el-form-item label="选择个人号：">
          <el-select placeholder="全部" class="el-block">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="朋友圈内容：" class="dialog-content__subtance">
          <div class="dialog-detail" style="padding: 10px; border: 1px solid #ddd;">
            <el-input type="textarea" :rows="8" placeholder="这一刻的想法...."  v-model="textarea">
            </el-input>
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false">
              <img v-if="imageUrl" src="" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
         <ns-button @click="dialogVisible = false">取 消</ns-button>
         <ns-button type="primary" @click="dialogVisible = false">确 定</ns-button>
      </span>
    </el-dialog>
    <!-- 发朋友圈弹窗-->
  </div>
</template>
<script>
import ElUpload from 'nui-v2/lib/upload';
export default {
  components: {
    ElUpload
  },
  data () {
    return {
      dialogVisible: false,
      textarea: '',
      value1: '',
    }
  }
}
</script>

<style scoped>
  @import "@/style/small/variables.pcss";
  :root {
    --talk-font-color-blue: #0094FC;
    --talk-border-color-gray: #F2F2F2;
  }
  @component-namespace talk {
    @b chat {
      @e header {
        display: flex;
      }
      @e container {
        display: flex;
      }
    }
    @b form {
      width: 70%;
      padding: 15px 20px;
      background: var(--theme-color-white);
      border-bottom: 1px solid var(--talk-border-color-gray);
    }
    @b personal {
      width: 30%;
      margin-left: 10px;
    }
    @b aside {
      width: 70%;
      background: var(--theme-color-white);
      @e list {
        width: 100%;
        padding: 0 20px 50px;
      }
    }
    @b item {
      padding: 30px 0;
      border-bottom: 1px solid var(--talk-border-color-gray);
      &:last-child {
        border: none;
      }
      @e avatar {
        width: 52px;
        height: 52px;
        float: left;
      }
      @e content{
        width: 90%;
        float: left;
        margin-left: 20px;
      }
    }
    @b avatarimg {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
    @b name {
      line-height: 0;
      height: 26px;
      padding: 20px 0;
      @e call {
        font-size: var(--default-font-size-middle);
        color: var(--talk-font-color-blue);
      }
      @e private {
        font-size: var(--default-font-size-small);
        color: var(--theme-font-color-secondary);
        float: right;
      }
    }
    @b sentence {
      font-size: var(--default-font-size-base);
      color: var(--theme-font-color-primary);
      font-weight: bold;
    }
    @b matching {
      margin-top: 20px;
      @e photowall {
        width: 122px;
        height: 121px;
        margin-right: 10px;
        float: left;
      }
    }
    @b matchingimg {
      width: 100%;
      height: 100%;
    }
    @b time {
      font-size: var(--default-font-size-base);
      color: var(--theme-font-color-secondary);
      margin-top: 15px;
    }
    @b interactive {
      text-align: right;
      @e like {
        font-size: var(--default-font-size-middle);
        color: var(--theme-font-color-primary);
      }
      @e comment {
        font-size: var(--default-font-size-middle);
        color: var(--theme-font-color-primary);
        margin-left: 10px;
      }
    }
    @b detail {
      background: var(--talk-border-color-gray);
      @e substance {}
      @e circle {}
    }
    @b bottom {
      padding: 15px;
      border-top: 1px solid var(--talk-border-color-gray);
    }
    @b main {
      width: 30%;
      margin-left: 10px;
      background: var(--theme-color-white);
    }
  }
  .clearfix:after {
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .scrollbar >>> .el-scrollbar__view {
    max-height: 200px;
  }
  .colorblue {
    color: var(--talk-font-color-blue);
  }
  /* 发朋友圈弹窗样式*/
  @component-namespace dialog {
    @b content {
      margin-right: 20px;
      @e subtance {
        margin-top: 20px;
      }
    }
  }
  >>> .el-dialog__header {
    padding: 10px 20px !important;
  }
  >>> .el-dialog__body {
    padding: 0 20px;
  }
  .avatar-uploader {
    padding: 0 6px;
    margin-top: 20px;
  }
  .avatar-uploader >>> .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 62px;
      height: 62px;
      line-height: 62px;
      text-align: center;
    }
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  >>> .el-textarea__inner {
    border: none;
  }
  .dialog-detail >>>.el-textarea.el-input--small .el-textarea__inner {
    resize: none;
  }
  /* 发朋友圈弹窗样式*/
</style>
