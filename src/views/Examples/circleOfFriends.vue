<template>
  <div class="talk-chat">
    <!--<ns-button @click="dialogVisible = true">发朋友圈</ns-button>-->
    <div class="talk-chat__header">
      <div class="talk-form">
        <el-form :inline="true" class="talk-chat__form" label-width="150px">
          <el-form-item>
            <ns-button type="primary" @click="dialogVisible = true">发朋友圈</ns-button>
          </el-form-item>
          <el-form-item label="个人号：">
            <el-select v-model="value" filterable placeholder="全部">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item >
          <el-form-item label="内容类型：">
            <el-select v-model="value" filterable placeholder="全部">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关键字：">
            <el-input v-model="input"></el-input>
          </el-form-item>
          <el-form-item label="日期：">
            <el-date-picker
              v-model="value2"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="关键字：">
            <el-input v-model="input"></el-input>
          </el-form-item>
          <el-form-item label="点赞数：">
            <el-input v-model="input"></el-input>
          </el-form-item>
          <el-form-item label="评论数：">
            <el-input v-model="input"></el-input>
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
      <div class="talk-personal clearfix">
        <el-form :inline="true" class="talk-chat__form" label-width="150px">
          <el-form-item>
            <div class="talk-personal__notice">
              <i class="iconfont icon-xiaoxi"></i>
            </div>
          </el-form-item>
          <el-form-item>
            互动消息
          </el-form-item>
          <el-form-item class="talk-personal__checkbox">
            <el-checkbox v-model="checked">只看未读</el-checkbox>
          </el-form-item >
        </el-form>
      </div>
    </div>
    <el-container class="talk-chat__container">
      <el-aside class="talk-aside">
        <el-scrollbar ref="fullScreen">
          <div class="talk-aside__list">
            <div class="talk-item clearfix">
              <div class="talk-item__avatar">
                <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" class="talk-avatarimg" alt="朋友圈配图" >
              </div>
              <div class="talk-item__content">
                <div class="talk-name">
                  <span class="talk-name__call">起个名字好麻烦起个名字好麻烦起个名字好麻烦起</span>
                  <span class="talk-name__private">个人号：微信昵称（ wechatid ）</span>
                </div>
                <div class="talk-sentence">散场总是难免的，尽兴而归就好散场总是难免的，尽兴而归就好散场总是难免的，尽兴而归就好散场总是难免的，尽兴而归就好散场总是难免的，尽兴而归就好散场总是难免的，尽兴而归就好</div>
                <div class="talk-matching clearfix">
                  <div class="talk-matching__photowall">
                    <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" class="talk-matchingimg" alt="朋友圈配图">
                  </div>
                  <div class="talk-matching__photowall">
                    <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" class="talk-matchingimg" alt="朋友圈配图">
                  </div>
                  <div class="talk-matching__photowall">
                    <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" class="talk-matchingimg" alt="朋友圈配图">
                  </div>
                  <div class="talk-matching__photowall">
                    <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" class="talk-matchingimg" alt="朋友圈配图">
                  </div>
                  <div class="talk-matching__photowall">
                    <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" class="talk-matchingimg" alt="朋友圈配图">
                  </div>
                  <div class="talk-matching__photowall">
                    <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" class="talk-matchingimg" alt="朋友圈配图">
                  </div>
                  <div class="talk-matching__photowall">
                    <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" class="talk-matchingimg" alt="朋友圈配图">
                  </div>
                  <div class="talk-matching__photowall">
                    <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" class="talk-matchingimg" alt="朋友圈配图">
                  </div>
                  <div class="talk-matching__photowall">
                    <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" class="talk-matchingimg" alt="朋友圈配图">
                  </div>
                  <div class="talk-matching__photowall">
                    <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" class="talk-matchingimg" alt="朋友圈配图">
                  </div>
                  <div class="talk-matching__photowall">
                    <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" class="talk-matchingimg" alt="朋友圈配图">
                  </div>
                  <div class="talk-matching__photowall">
                    <img src="https://img.yzcdn.cn/upload_files/2019/01/24/FhbbngOXgEqTbkda8DPNCthA5r5V.jpg" class="talk-matchingimg" alt="朋友圈配图">
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
                    <div class="talk-chatmsg">
                      <i class="iconfont icon-dianzan colorblue"></i>
                      <span class="colorblue">起个名字好麻烦，长安自在风</span>
                    </div>
                    <div class="talk-msg">
                      <div class="talk-msg__item clearfix">
                        <span class="colorblue">起个名字好麻烦：</span>
                        <span>我也老了</span>
                        <span class="talk-msg__item--reply colorblue">回复</span>
                      </div>
                      <div class="talk-msg__item clearfix">
                        <span class="colorblue">长安自在风</span>
                        <span class="colorblue">回复</span>
                        <span class="colorblue">起个名字好麻烦：</span>
                        <span>你还年轻</span>
                        <span class="colorblue talk-msg__item--reply">回复</span>
                      </div>
                      <div class="talk-msg__item clearfix">
                        <span class="colorblue">起个名字好麻烦</span>
                        <span class="colorblue">回复</span>
                        <span class="colorblue">长安自在风：</span>
                        <span>你骗人</span>
                        <span class="colorblue talk-msg__item--reply">删除</span>
                      </div>
                    </div>
                    <div  class="talk-circle"></div>
                  </div>
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
          </div></div></span><button type="button" disabled="disabled" class="btn-prev"><i class="el-icon el-icon-arrow-left"></i></button><ul class="el-pager"><li class="number active">1</li><!----><li class="number">2</li><li class="number">3</li><li class="number">4</li><li class="number">5</li><!----></ul><button type="button" class="btn-next"><i class="el-icon el-icon-arrow-right"></i></button><span class="el-pagination__jump">前往<div class="el-input el-input--small el-pagination__editor is-in-pagination"><!----><input type="number" autocomplete="off" min="1" max="6" class="el-input__inner"><!----><!----><!----></div>页</span>
          </div>
        </div>
      </el-aside>
      <el-main class="talk-main">
        <el-scrollbar ref="fullScreenright">
          <div class="talk-main__list">
            <div class="talk-convey">
              <div class="talk-convey__name">个人号：微信昵称（ wechatid ）</div>
              <div class="talk-convey__content clearfix">
                <div class="talk-headportrait">
                  <img src="https://shopguide.oss-cn-hangzhou.aliyuncs.com/test/201907/120,910,104,359,001/c436cf04-72fe-4537-9492-467d24800855.jpg"  alt="头像" class="talk-headportrait__img">
                </div>
                <div class="talk-redpoint"></div>
                <div class="talk-personmsg">
                  <div class="talk-personmsg__uname colorblue">长安自在风长安自在风长安自在风长长安自在风</div>
                  <div class="talk-personmsg__about">我上那么多年学,熬那么我上那么多年学我上那么多年学,熬那么我上那么多年学</div>
                  <div class="talk-personmsg__time">2019-05-29 上午09:46:20</div>
                </div>
                <div class="talk-photo">
                  <img src="https://shopguide.oss-cn-hangzhou.aliyuncs.com/test/201907/120,910,104,359,001/fc3960b2-57a7-4f09-a536-ad3a276ddd67.jpg"  alt="朋友圈配图" class="talk-photo__img">
                </div>
              </div>
            </div>
            <div class="talk-convey">
              <div class="talk-convey__name">个人号：微信昵称（ wechatid ）</div>
              <div class="talk-convey__content clearfix">
                <div class="talk-headportrait">
                  <img src="https://shopguide.oss-cn-hangzhou.aliyuncs.com/test/201907/120,910,104,359,001/c436cf04-72fe-4537-9492-467d24800855.jpg"  alt="头像" class="talk-headportrait__img">
                </div>
                <div class="talk-redpoint"></div>
                <div class="talk-personmsg">
                  <div class="talk-personmsg__uname colorblue">长安自在风</div>
                  <div class="talk-personmsg__about">我上那么多年学,熬那么</div>
                  <div class="talk-personmsg__time">2019-05-29 上午09:46:20</div>
                </div>
                <div class="talk-photo">
                  <img src="https://shopguide.oss-cn-hangzhou.aliyuncs.com/test/201907/120,910,104,359,001/fc3960b2-57a7-4f09-a536-ad3a276ddd67.jpg"  alt="朋友圈配图" class="talk-photo__img">
                </div>
              </div>
            </div>
            <div class="talk-convey">
              <div class="talk-convey__name">个人号：微信昵称（ wechatid ）</div>
              <div class="talk-convey__content clearfix">
                <div class="talk-headportrait">
                  <img src="https://shopguide.oss-cn-hangzhou.aliyuncs.com/test/201907/120,910,104,359,001/c436cf04-72fe-4537-9492-467d24800855.jpg"  alt="头像" class="talk-headportrait__img">
                </div>
                <div class="talk-personmsg">
                  <div class="talk-personmsg__uname colorblue">宜室宜家</div>
                  <div class="talk-personmsg__about talk-personmsg__ablue--like">
                    <i class="iconfont icon-dianzan colorblue"></i>
                  </div>
                  <div class="talk-personmsg__time">2019-05-29 上午09:46:20</div>
                </div>
                <div class="talk-photo">
                  <img src="https://shopguide.oss-cn-hangzhou.aliyuncs.com/test/201907/120,910,104,359,001/fc3960b2-57a7-4f09-a536-ad3a276ddd67.jpg"  alt="朋友圈配图" class="talk-photo__img">
                </div>
              </div>
            </div>
            <div class="talk-convey">
              <div class="talk-convey__name">个人号：微信昵称（ wechatid ）</div>
              <div class="talk-convey__content clearfix">
                <div class="talk-headportrait">s
                  <img src="https://shopguide.oss-cn-hangzhou.aliyuncs.com/test/201907/120,910,104,359,001/c436cf04-72fe-4537-9492-467d24800855.jpg"  alt="头像" class="talk-headportrait__img">
                </div>
                <div class="talk-personmsg">
                  <div class="talk-personmsg__uname colorblue">长安自在风</div>
                  <div class="talk-personmsg__about">我上那么多年学,熬那么</div>
                  <div class="talk-personmsg__time">2019-05-29 上午09:46:20</div>
                </div>
                <div class="talk-photo">
                  <img src="https://shopguide.oss-cn-hangzhou.aliyuncs.com/test/201907/120,910,104,359,001/fc3960b2-57a7-4f09-a536-ad3a276ddd67.jpg"  alt="朋友圈配图" class="talk-photo__img">
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
        <div class="talk-main__bottom">
          <div class="template-table-pagination el-pagination">
            <span class="el-pagination__total">共35条</span>
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
          </div></div></span><button type="button" disabled="disabled" class="btn-prev"><i class="el-icon el-icon-arrow-left"></i></button><ul class="el-pager"><li class="number active">1</li><!----><li class="number">2</li></ul><button type="button" class="btn-next"><i class="el-icon el-icon-arrow-right"></i></button><span class="el-pagination__jump">前往<div class="el-input el-input--small el-pagination__editor is-in-pagination"><!----><input type="number" autocomplete="off" min="1" max="6" class="el-input__inner"><!----><!----><!----></div>页</span>
          </div>
        </div>
      </el-main>
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
import ElUpload from 'nui-v2/lib/upload'
export default {
  components: {
    ElUpload
  },
  data () {
    return {
      dialogVisible: false,
      textarea: '',
      value1: '',
      checked: true,
      input: '',
      value2: '',
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
  },
  mounted () {
    this.setHeight()
    this.setEditorFullScreen()
    window.addEventListener('resize', () => {
      this.setEditorFullScreen()
      this.setHeight()
    })
  },
  methods: {
    /**
     * 计算主要显示窗口的高度，动态设置页面内主要内容的高度
     */
    setHeight: function () {
      /**
       *  左侧工具栏高度&因滚动条样式margin-bottom负值17px，需要添加上17px,
       *  15px为底部10px间距和表单5px内边距
       **/
      const PAGE_TITLE = 64 // 页面标题占据的高度
      const BTN_BOTTOM = 69 // 底部按钮占据的高度
      let limitHeight = window.innerHeight -
        document.getElementsByClassName('nav')[0].getBoundingClientRect().top - // 减去页面结构顶部的margin-top
        document.getElementsByClassName('talk-form')[0].offsetHeight - 10 - // 减去步骤条高度和marign-bottom
        BTN_BOTTOM - PAGE_TITLE + 17 - 15

      this.$refs.fullScreen.$el.children[0].style.maxHeight = limitHeight + 'px'
      this.$refs.fullScreenright.$el.children[0].style.maxHeight = limitHeight + 'px'
    },
    /**
     * 计算主要显示窗口的高度，动态设置编辑器占满全屏
     */
    setEditorFullScreen () {
      /**
       *  15px为底部10px间距和表单5px内边距
       **/
      const PAGE_TITLE = 64 // 页面标题占据的高度
      const BTN_BOTTOM = 69 // 底部按钮占据的高度
      let editorHeight = window.innerHeight -
        document.getElementsByClassName('nav')[0].getBoundingClientRect().top - // 减去页面结构顶部的margin-top
        document.getElementsByClassName('talk-form')[0].offsetHeight - 10 - // 减去步骤条高度和marign-bottom
        BTN_BOTTOM - PAGE_TITLE - 15

      // 设置main高度
      this.$refs.editorFullScreen.style.height = editorHeight + 'px'
      // 设置preview左边下面部分高度
      this.$refs.previewContent.style.height = editorHeight - 55 + 'px' // 减去的55px为上方标题

      // 设置编辑器高度
      let UEditor = document.getElementsByClassName('edui-editor-iframeholder')[0]
      // 适配小屏宽度下，编辑器工具栏换行所增加的高度
      let smallerScreen = 0
      if (window.innerWidth < 1386) {
        smallerScreen = 32
      } else if (window.innerWidth < 1482) {
        smallerScreen = 24
      }

      if (!UEditor) {
        // 初次加载
        this.ueditorConfig.initialFrameHeight = editorHeight - 120 - smallerScreen
      } else {
        // 非初次加载
        document.getElementsByClassName('edui-editor-iframeholder')[0].style.height = editorHeight - 120 - smallerScreen + 'px'
      }
    }
  }
}
</script>

<style scoped>
  @import "@/style/small/variables.pcss";
  :root {
    --talk-font-color-blue: #0094FC;
    --talk-border-color-gray: #F2F2F2;
    --talk-borderbottom-color-gray: #E3E3E3;
    --talk--background-color-red: #FF1A1A;
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
      padding: 15px 20px 5px;
      background: var(--theme-color-white);
      border-bottom: 1px solid var(--talk-border-color-gray);
    }
    @b personal {
      width: 30%;
      margin-left: 10px;
      padding: 15px 20px 5px;
      background: var(--theme-color-white);
      border-bottom: 1px solid var(--talk-border-color-gray);
      @e notice {
        text-align: center;
        line-height: 38px;
        width: 38px;
        height: 38px;
        background: var(--talk-font-color-blue);
        border-radius: 50%;
      }
      @e checkbox {
        float: right;
      }
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
        width: 93%;
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
      width: 95%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    @b matching {
      margin-top: 20px;
      @e photowall {
        width: 122px;
        height: 121px;
        margin: 0 10px 10px 0;
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
      cursor: pointer;
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
      margin-top: 10px;
      background: var(--talk-border-color-gray);
      @e substance {
        position: relative;
      }
    }
    @b chatmsg {
      padding: 16px;
      border-bottom: 1px solid var(--talk-borderbottom-color-gray);
    }
    @b answer {
      @e reply {
        text-align: right;
      }
    }
    @b circle {
      width:0;
      height:0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 8px solid var(--talk-border-color-gray);
      position: absolute;
      top: -8px;
      left: 18px;
    }
    @b msg {
      padding: 16px;
      @e item {
        padding-bottom: 8px;
        &:last-child {
          padding-bottom: 0;
        }
        @m reply {
          float: right;
        }
      }
    }
    @b bottom {
      padding: 15px;
      border-top: 1px solid var(--talk-border-color-gray);
    }
    @b main {
      width: 30%;
      margin-left: 10px;
      background: var(--theme-color-white);
      @e list {
        margin-left: 10px;
      }
      @e bottom {
        padding: 15px;
        border-top: 1px solid var(--talk-border-color-gray);
      }
    }
    @b convey {
      padding: 30px 15px 15px;
      border-bottom: 1px solid var(--talk-border-color-gray);
      &:last-child {
        border-bottom: none;
      }
      @e name {
        font-size: var(--default-font-size-base);
        color: var(--theme-font-color-secondary);
        text-overflow : ellipsis;
        white-space : nowrap;
        overflow : hidden;
      }
      @e content {
        position: relative;
        margin-top: 20px;
      }
    }
    @b headportrait {
      width: 52px;
      height: 52px;
      float: left;
      @e img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    @b redpoint {
      width: 16px;
      height: 16px;
      position: absolute;
      left: 40px;
      top: -4px;
      background: var(--talk--background-color-red);
      border-radius: 50%;
    }
    @b personmsg {
      width: 60%;
      margin-left: 15px;
      float: left;
      @e uname {
        font-size: var(--default-font-size-middle);
        text-overflow : ellipsis;
        white-space : nowrap;
        overflow : hidden;
      }
      @e about {
        font-size: var(--default-font-size-base);
        color: var(--theme-font-color-primary);
        margin-top: 10px;
        text-overflow : ellipsis;
        white-space : nowrap;
        overflow : hidden;
        @m like {
          cursor: pointer;
        }
      }
      @e time {
        font-size: var(--default-font-size-base);
        color: var(--theme-font-color-secondary);
        margin-top: 15px;
      }
    }
    @b photo {
      width: 102px;
      height: 102px;
      float: right;
      @e img {
        width: 100%;
        height: 100%;
      }
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
  .icon-xiaoxi {
    font-size: var(--dafault-font-size-xlarge);
    color: var(--theme-color-white);
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
