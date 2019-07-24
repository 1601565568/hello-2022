<template>
  <el-container class="talk-chat__container">
    <el-aside class="talk-aside" style="width: 65%">
      <ns-page-table>
        <!-- 按钮 -->
        <template slot="buttons">
          <ns-button type="primary">发朋友圈</ns-button>
        </template>
        <!-- 按钮-结束 -->

        <!-- 简单搜索 -->
        <!-- el-form 需添加 @submit.native.prevent 配置 -->
        <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
        <template slot="searchSearch">
          <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent class="pull-right">
            <el-form-item v-show="_data._queryConfig.expand === false">
              <el-input ref="quickText" v-model="quickSearchModel.customerName" placeholder="关键字：" @keyup.enter.native="$quickSearchAction$('customerName')">
                <i class="el-icon-search el-input__icon" slot="suffix" name="name" @click="$quickSearchAction$('customerName')"></i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <ns-button type="text" @click="$handleTabClick">
                <!--{{collapseText}}-->
                {{!_data._queryConfig.expand ? '展开搜索' : '收起搜索'}}
                <i :class="{'el-icon--right': true, 'el-icon-arrow-down': !_data._queryConfig.expand, 'el-icon-arrow-up': _data._queryConfig.expand} ">
                </i>
              </ns-button>
            </el-form-item>
          </el-form>
        </template>
        <!-- 简单搜索-结束 -->

        <!-- 高级搜索 -->
        <!-- el-form 需添加  @keyup.enter.native="onSearch" 配置，实现回车搜索， onSearch 为搜索方法 -->
        <!-- el-form 需添加  surround-btn 类名 配置环绕按钮效果 -->
        <template slot="advancedSearch" v-if="_data._queryConfig.expand">
          <el-form ref="table_filter_form" label-width="80px" @keyup.enter.native="onSearch" class="surround-btn"
                   :model="model" :rules="rules" :inline="true">
            <el-form-item label="个人号：">
              <el-form-grid size="xmd">
                <el-select v-model="model.userType" filterable clearable
                           :multiple="false">
                  <el-option label="潜客" value="0">
                  </el-option>
                  <el-option label="意向客户" value="1">
                  </el-option>
                  <el-option label="成交客户" value="2">
                  </el-option>
                </el-select>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="内容类型：">
              <el-form-grid size="xmd">
                <el-select v-model="model.userType" filterable clearable
                           :multiple="false">
                  <el-option label="潜客" value="0">
                  </el-option>
                  <el-option label="意向客户" value="1">
                  </el-option>
                  <el-option label="成交客户" value="2">
                  </el-option>
                </el-select>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="排序方式：">
              <el-form-grid size="xmd">
                <el-select v-model="model.userType" filterable clearable
                           :multiple="false">
                  <el-option label="潜客" value="0">
                  </el-option>
                  <el-option label="意向客户" value="1">
                  </el-option>
                  <el-option label="成交客户" value="2">
                  </el-option>
                </el-select>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="关键字：">
              <el-form-grid size="xmd">
                <el-input></el-input>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="日期：">
              <el-form-grid size="xmd">
                <el-date-picker
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="点赞数：">
              <el-form-grid size="xmd">
                <el-input></el-input>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="评论数：">
              <el-form-grid size="xmd">
                <el-input></el-input>
              </el-form-grid>
            </el-form-item>
          </el-form>
          <div class="template-table__more-btn">
            <ns-button type="primary" @click="$searchAction$()">{{$t('operating.search')}}</ns-button>
            <ns-button @click="$resetInputAction$()">{{$t('operating.reset')}}</ns-button>
          </div>
        </template>
        <!-- 高级搜索-结束 -->

        <!-- 表格 -->
        <template slot="table">
          <el-scrollbar ref="fullScreen">
            <div class="talk-aside__list" ref="asd">
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
        </template>
        <!-- 表格-结束 -->

        <!-- 分页 -->
        <template slot="pagination">
          <div class="talk-bottom">
            <el-pagination v-if="_data._pagination.enable" class="template-table__pagination"
                           :page-sizes="_data._pagination.sizeOpts" :total="_data._pagination.total"
                           :current-page="_data._pagination.page" :page-size="_data._pagination.size"
                           layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
          </div>
        </template>
        <!-- 分页-结束 -->
      </ns-page-table>
    </el-aside>
    <el-main class="talk-main">
      <div class="talk-personal clearfix">
        <div class="talk-personal__notice">
          <i class="iconfont icon-xiaoxi"></i>
        </div>
        <span class="talk-personal__msg">互动消息</span>
        <el-checkbox class="talk-personal__checkbox">只看未读</el-checkbox>
      </div>
      <el-scrollbar ref="fullScreenright">
        <div class="talk-main__list">
          <div class="talk-convey">
            <div class="talk-convey__name">个人号：微信昵称（ wechatid ）</div>
            <div class="talk-convey__content clearfix">
              <div class="talk-headportrait">
                <img
                  src="https://shopguide.oss-cn-hangzhou.aliyuncs.com/test/201907/120,910,104,359,001/c436cf04-72fe-4537-9492-467d24800855.jpg"
                  alt="头像" class="talk-headportrait__img">
              </div>
              <div class="talk-redpoint"></div>
              <div class="talk-personmsg">
                <div class="talk-personmsg__uname colorblue">长安自在风长安自在风长安自在风长长安自在风</div>
                <div class="talk-personmsg__about">我上那么多年学,熬那么我上那么多年学我上那么多年学,熬那么我上那么多年学</div>
                <div class="talk-personmsg__time">2019-05-29 上午09:46:20</div>
              </div>
              <div class="talk-photo">
                <img
                  src="https://shopguide.oss-cn-hangzhou.aliyuncs.com/test/201907/120,910,104,359,001/fc3960b2-57a7-4f09-a536-ad3a276ddd67.jpg"
                  alt="朋友圈配图" class="talk-photo__img">
              </div>
            </div>
          </div>
          <div class="talk-convey">
            <div class="talk-convey__name">个人号：微信昵称（ wechatid ）</div>
            <div class="talk-convey__content clearfix">
              <div class="talk-headportrait">
                <img
                  src="https://shopguide.oss-cn-hangzhou.aliyuncs.com/test/201907/120,910,104,359,001/c436cf04-72fe-4537-9492-467d24800855.jpg"
                  alt="头像" class="talk-headportrait__img">
              </div>
              <div class="talk-redpoint"></div>
              <div class="talk-personmsg">
                <div class="talk-personmsg__uname colorblue">长安自在风</div>
                <div class="talk-personmsg__about">我上那么多年学,熬那么</div>
                <div class="talk-personmsg__time">2019-05-29 上午09:46:20</div>
              </div>
              <div class="talk-photo">
                <img
                  src="https://shopguide.oss-cn-hangzhou.aliyuncs.com/test/201907/120,910,104,359,001/fc3960b2-57a7-4f09-a536-ad3a276ddd67.jpg"
                  alt="朋友圈配图" class="talk-photo__img">
              </div>
            </div>
          </div>
          <div class="talk-convey">
            <div class="talk-convey__name">个人号：微信昵称（ wechatid ）</div>
            <div class="talk-convey__content clearfix">
              <div class="talk-headportrait">
                <img
                  src="https://shopguide.oss-cn-hangzhou.aliyuncs.com/test/201907/120,910,104,359,001/c436cf04-72fe-4537-9492-467d24800855.jpg"
                  alt="头像" class="talk-headportrait__img">
              </div>
              <div class="talk-personmsg">
                <div class="talk-personmsg__uname colorblue">宜室宜家</div>
                <div class="talk-personmsg__about talk-personmsg__ablue--like">
                  <i class="iconfont icon-dianzan colorblue"></i>
                </div>
                <div class="talk-personmsg__time">2019-05-29 上午09:46:20</div>
              </div>
              <div class="talk-photo">
                <img
                  src="https://shopguide.oss-cn-hangzhou.aliyuncs.com/test/201907/120,910,104,359,001/fc3960b2-57a7-4f09-a536-ad3a276ddd67.jpg"
                  alt="朋友圈配图" class="talk-photo__img">
              </div>
            </div>
          </div>
          <div class="talk-convey">
            <div class="talk-convey__name">个人号：微信昵称（ wechatid ）</div>
            <div class="talk-convey__content clearfix">
              <div class="talk-headportrait">s
                <img
                  src="https://shopguide.oss-cn-hangzhou.aliyuncs.com/test/201907/120,910,104,359,001/c436cf04-72fe-4537-9492-467d24800855.jpg"
                  alt="头像" class="talk-headportrait__img">
              </div>
              <div class="talk-personmsg">
                <div class="talk-personmsg__uname colorblue">长安自在风</div>
                <div class="talk-personmsg__about">我上那么多年学,熬那么</div>
                <div class="talk-personmsg__time">2019-05-29 上午09:46:20</div>
              </div>
              <div class="talk-photo">
                <img
                  src="https://shopguide.oss-cn-hangzhou.aliyuncs.com/test/201907/120,910,104,359,001/fc3960b2-57a7-4f09-a536-ad3a276ddd67.jpg"
                  alt="朋友圈配图" class="talk-photo__img">
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <div class="talk-main__bottom">
        <el-pagination
          layout="prev, pager, next"
          :total="50">
        </el-pagination>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import ElUpload from 'nui-v2/lib/upload'
import ElContainer from 'nui-v2/lib/container'
import ElMain from 'nui-v2/lib/main'
import ElAside from 'nui-v2/lib/aside'
export default {
  components: {
    ElUpload,
    ElContainer,
    ElMain,
    ElAside
  },
  name: 'circleOfFriends',
  // mixins: [tableMixin],
  props: {
    types: Object
  },
  data: function () {
    var pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    var tableButtons = [
      {
        'func': function () {},
        'icon': '$.noop',
        'name': '\u8be6\u60c5',
        'auth': ``,
        'visible': ``
      },
      {
        'func': function (obj) {
          this.$parent.trackVisible = true
          this.$parent.model.customerName = obj.row.black_type
        },
        'icon': '$.noop',
        'name': '\u8ddf\u8e2a',
        'auth': ``,
        'visible': ``
      }
    ]

    var operateButtons = [
      {
        'func': function () {
        },
        'icon': '',
        'name': '新增',
        'auth': ``,
        'visible': ``
      },
      {
        'func': function () {
        },
        'icon': '',
        'name': this.$t('operating.edit'),
        'auth': ``,
        'visible': ''
      },
      {
        'func': function () {
        },
        'icon': '',
        'name': '删除',
        'auth': ``,
        'visible': ``
      }
    ]

    var quickInput = [{
      'template': '',
      'inline': false,
      'name': 'customerName',
      'text': '姓名',
      'placeholder': '请输入姓名',
      'type': 'text',
      'value': '',
      'isConvenient': false
    }]
    var quickSearchNames = quickInput.map(x => x.name)
    var quickSearchModel = {}
    var model = Object.assign({},
      {
        customerName: '',
        outNick: '',
        mobile: '',
        address: '',
        userType: '',
        isExit: '',
        source: '',
        memberGrade: ''
      },
      {})
    var that = this

    quickInput.map(item => {
      Object.defineProperty(quickSearchModel, item.name, {
        get: function () {
          return model[item.name]
        },
        set: function (val) {
          model[item.name] = val
          // TODO 由于特殊需求导致下列写法
          if (item.type === 'radio') {
            that._data._table.quickSearchMap[item.name] = val
            that.$quickSearch$()
          }
        },
        enumerable: true
      })
    })

    return {
      model: model,
      quickSearchModel: quickSearchModel,
      rules: Object.assign({}, {}, {}),
      state: {},
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      grades: [],
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchNames: quickSearchNames,
        quickSearchMap: {}
      },
      _queryConfig: {
        expand: false
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.setHeight()
      this.setEditorFullScreen()
      window.addEventListener('resize', () => {
        this.setEditorFullScreen()
        this.setHeight()
      })
    })
  },
  methods: {
    $handleTabClick: function () {
      var expand = this._data._queryConfig.expand
      // var showCondition = this._data._queryConfig.showCondition
      if (expand) {
        this._data._queryConfig.expand = false
      } else {
        this._data._queryConfig.expand = true
      }
      this.$nextTick(() => {
        this.setHeight()
      })
    },
    /**
     * 计算主要显示窗口的高度，动态设置页面内主要内容的高度
     */
    setHeight: function () {
      /**
       *  左侧工具栏高度&因滚动条样式margin-bottom负值17px，需要添加上17px,
       *  15px为底部10px间距和表单5px内边距
       **/
      const PAGE_TOP_SEARCH = 39 // 简单搜索的高度
      const BTN_BOTTOM = 49 // 底部页码占据的高度
      let limitHeight = window.innerHeight -
        document.getElementsByClassName('nav')[0].offsetHeight -
        document.getElementsByClassName('template-table__bar-more')[0].offsetHeight - // 高级搜索
        BTN_BOTTOM - PAGE_TOP_SEARCH + 17 - 25;
      let limitHeightRight = window.innerHeight -
        document.getElementsByClassName('talk-personal')[0].offsetHeight -
        document.getElementsByClassName('nav')[0].offsetHeight -
        BTN_BOTTOM + 17 - 20;


      this.$refs.fullScreen.$el.children[0].style.maxHeight = limitHeight + 'px'
      this.$refs.fullScreenright.$el.children[0].style.maxHeight = limitHeightRight + 'px'
    },
    /**
     * 计算主要显示窗口的高度，动态设置编辑器占满全屏
     */
    setEditorFullScreen () {
      /**
       *  15px为底部10px间距和表单5px内边距
       **/
      const PAGE_TITLE = 64 // 页面标题占据的高度
      const BTN_BOTTOM = 49 // 底部按钮占据的高度
      let editorHeight = window.innerHeight -
        document.getElementsByClassName('nav')[0].getBoundingClientRect().top - // 减去页面结构顶部的margin-top
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
      }
    }
    @b form {
      width: 70%;
      padding: 15px 20px 5px;
      background: var(--theme-color-white);
      border-bottom: 1px solid var(--talk-border-color-gray);
    }
    @b personal {
      display: flex;
      align-items: center;
      position: relative;
      /*margin-left: 10px;*/
      padding: 15px 20px;
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
      @e msg {
        font-size: var(--default-font-size-large);
        color: var(--theme-font-color-primary);
        margin-left: 15px;
      }
      @e checkbox {
        position: absolute;
        right: 10px;
      }
    }
    @b aside {
      width: 70%;
      background: var(--theme-color-white);
      @e list {
        width: 100%;
        background: var(--theme-color-white);
      }
    }
    @b item {
      position: relative;
      padding: 15px 20px;
      border-bottom: 1px solid var(--talk-border-color-gray);
      &:last-child {
        border: none;
      }
      @e avatar {
        width: 52px;
        height: 52px;
        position: absolute;
        top: 27px;
        left: 25px;
      }
      @e content{
        width: 93%;
        float: left;
        margin-left: 72px;
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
      width: 48%;
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
      padding: 5px 15px;
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
        padding: 5px 15px;
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
        display: flex;
        margin-top: 20px;
      }
    }
    @b headportrait {
      width: 52px;
      height: 52px;
      float: left;
      position: relative;
      @e img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    @b redpoint {
      width: 16px;
      height: 16px;
      position: relative;
      left: -10px;
      top: 0;
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
  .el-main {
    padding: 0 !important;
  }
  >>> .template-table__bar {
    box-shadow: none;
    padding: 15px 20px;
    border-bottom: 1px solid var(--talk-border-color-gray);
  }
  >>> .el-pagination {
    box-shadow: none;
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
