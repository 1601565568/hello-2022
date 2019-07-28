<template>
  <div>
    <el-container class="talk-chat__container">
      <el-aside class="talk-aside" style="width: 65%">
        <ns-page-table>
          <!-- 按钮 -->
          <template slot="buttons">
            <ns-button type="primary" @click="dialogVisibleShow = true">发朋友圈</ns-button>
          </template>
          <!-- 按钮-结束 -->

          <!-- 简单搜索 -->
          <!-- el-form 需添加 @submit.native.prevent 配置 -->
          <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
          <template slot="searchSearch">
            <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent class="pull-right">
              <el-form-item v-show="_data._queryConfig.expand === false">
                <el-input ref="quickText" v-model="quickSearchModel.keyword" placeholder="关键字：" @keyup.enter.native="$quickSearchAction$('customerName')">
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
                  <el-select v-model="model.personalNumber" filterable clearable
                             :multiple="false">
                    <el-option v-for="number in personalNumberList" :label="number.nick" :value="number.wid" :key="number.wid">
                    </el-option>
<!--                    <el-option label="意向客户" value="1">-->
<!--                    </el-option>-->
<!--                    <el-option label="成交客户" value="2">-->
<!--                    </el-option>-->
                  </el-select>
                </el-form-grid>
              </el-form-item>
              <el-form-item label="内容类型：">
                <el-form-grid size="xmd">
                  <el-select v-model="model.userType" filterable clearable
                             :multiple="false">
                    <el-option label="视频" value="3">
                    </el-option>
                    <el-option label="图文" value="4">
                    </el-option>
                    <el-option label="链接" value="2">
                    </el-option>
                  </el-select>
                </el-form-grid>
              </el-form-item>
              <el-form-item label="排序方式：">
                <el-form-grid size="xmd">
                  <el-select v-model="model.orderType" filterable clearable
                             :multiple="false">
                    <el-option label="点赞数降序" value="0"></el-option>
                    <el-option label="评论数降序" value="1"></el-option>
                    <el-option label="点赞数升序" value="2"></el-option>
                    <el-option label="评论数升序" value="3"></el-option>
                  </el-select>
                </el-form-grid>
              </el-form-item>
              <el-form-item label="关键字：">
                <el-form-grid size="xmd">
                  <el-input v-model="model.keyword" clearable></el-input>
                </el-form-grid>
              </el-form-item>
              <el-form-item label="日期：">
                <el-form-grid size="xmd">
                  <el-date-picker
                    type="date"
                    placeholder="请选择日期" v-model="model.addTime">
                  </el-date-picker>
                </el-form-grid>
              </el-form-item>
              <el-form-item label="点赞数：">
                <el-form-grid class="widthlength">
                  <el-input v-model="model.likesMin"></el-input>
                </el-form-grid>
                <el-form-grid class="text-tips--grey">
                  ~
                </el-form-grid>
                <el-form-grid class="widthlength">
                  <el-input v-model="model.likesMax"></el-input>
                </el-form-grid>
              </el-form-item>
              <el-form-item label="评论数：">
                <el-form-grid class="widthlength">
                  <el-input v-model="model.commentsMin"></el-input>
                </el-form-grid>
                <el-form-grid class="text-tips--grey">
                  ~
                </el-form-grid>
                <el-form-grid class="widthlength">
                  <el-input v-model="model.commentsMax"></el-input>
                </el-form-grid>
              </el-form-item>
            </el-form>
            <div class="template-table__more-btn">
              <ns-button type="primary" @click="queryMomentsList()">{{$t('operating.search')}}</ns-button>
              <ns-button @click="$resetInputAction$()">{{$t('operating.reset')}}</ns-button>
            </div>
          </template>
          <!-- 高级搜索-结束 -->

          <!-- 左边内容滚动区域 -->
          <template slot="table">
            <el-scrollbar ref="fullScreen">
              <div class="talk-aside__list" ref="asd" v-for="moment in this.moments" :key="moment">
                <div class="talk-item clearfix">
                  <div class="talk-item__avatar">
                    <img :src="moment.head" class="talk-avatarimg" alt="朋友圈配图" >
                  </div>
                  <div class="talk-item__content">
                    <div class="talk-name">
                      <span class="talk-name__call colorblue">{{moment.nick}}</span>
                      <span class="talk-name__private">个人号：{{moment.nick}}（ {{moment.ownerId}} ）</span>
                    </div>
                    <div class="talk-sentence">{{moment.content}}</div>
                    <div class="talk-matching">
                      <div class="talk-matching__figurelist">
                        <div class="talk-li"  v-for="image in images" :key="image" >
                          <div :style="{backgroundImage: 'url(' + image + ')'} " class="talk-li__figure">
                            <div class="talk-li__figure--img"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="talk-time">{{moment.snsTime}}</div>
                    <div class="talk-interactive">
                      <span class="talk-interactive__like">
                        <i class="iconfont icon-dianzan"></i>
                        {{moment.likesNums}}
                      </span>
                      <span class="talk-interactive__comment">
                        <i class="iconfont icon-pinglun"></i>
                        {{moment.commentsNums}}
                      </span>
                    </div>
                    <!--点赞和评论 -->
                    <div class="talk-detail" v-if="moment.likesNums>0 || moment.commentsNums>0">
                      <div class="talk-detail__substance">
                        <div class="talk-chatmsg">
                          <i class="iconfont icon-dianzan colorblue"></i>
                          <span class="colorblue" v-if="moment.likeName" >{{moment.likeName}}</span>
                        </div>
                        <div class="talk-msg">
                          <div class="talk-msg__item clearfix">
                            <div class="talk-msglength" v-for="comment in moment.comments" :key="comment">
                              <div v-if="comment.previousId ==0">
                                <span class="colorblue">{{comment.commentator?comment.commentator:comment.ownerNick}}：</span>
                                <span>{{comment.content}}</span>
                                <span class="talk-msglength__reply colorblue">回复</span>
                              </div>
                             <div v-else-if="comment.previousId != 0">
                               <span class="colorblue">{{comment.commentator?comment.commentator:comment.ownerNick}}</span>
                               <span>回复</span>
                               <span class="colorblue">{{comment.respondent?comment.respondent:comment.owner}}：</span>
                               <span>{{comment.content}}</span>
                               <span class="colorblue talk-msglength__reply">回复</span>
                               <span class="colorblue talk-msglength__reply" v-if="comment.nick==comment.ownerNick">删除</span>
                             </div>
                            </div>
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
          <!-- 左边内容滚动区域结束-->

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
      <!--右侧互动消息模块-->
      <el-main class="talk-main">
        <div class="talk-personal clearfix">
          <div class="talk-personal__notice">
            <i class="iconfont icon-xiaoxi"></i>
          </div>
          <span class="talk-personal__msg">互动消息</span>
          <!--暂时无法获取未读消息，先注释 2019/07/26-->
<!--          <el-checkbox class="talk-personal__checkbox">只看未读</el-checkbox>-->
        </div>
        <el-scrollbar ref="fullScreenright">
          <div class="talk-main__list">
            <div class="talk-convey" v-for="msg in interationMsgs" :key="msg">
              <div class="talk-convey__name">个人号：{{msg.nick}}（ {{msg.snsOwnerId}} ）</div>
              <div class="talk-convey__content clearfix">
                <div class="talk-headportrait">
                  <img
                    :src="msg.friendHead"
                    alt="头像" class="talk-headportrait__img">
                </div>
                <div class="talk-redpoint"></div>
                <div class="talk-personmsg">
                  <div class="talk-personmsg__uname colorblue">{{msg.commentator?msg.commentator:msg.ownerNick}}</div>
                  <div class="talk-personmsg__about" v-if="msg.previousId!=0">{{msg.info}}</div>
                  <div class="talk-personmsg__about talk-personmsg__ablue--like" v-else-if="msg.previousId==0">
                    <i class="iconfont icon-dianzan colorblue"></i>
                  </div>
                  <div class="talk-personmsg__time">{{msg.createTime}}</div>
                </div>
                <div class="talk-photo">
                  <div class="talk-photo__li">
                    <div style="background-image:url(https://shopguide.oss-cn-hangzhou.aliyuncs.com/test/201907/120,910,104,359,001/a2e079dd-e605-49d3-9c10-a3893b413ba0.jpg)" class="talk-photo__li--figure">
                      <div class="talk-figureimg"></div>
                    </div>
                  </div>
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
    <!-- 发朋友圈弹窗-->
    <el-dialog
      title="发朋友圈"
      :visible.sync="dialogVisibleShow"
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
            <el-input type="textarea" :rows="8" placeholder="这一刻的想法...." v-model="textarea">
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
import ElContainer from 'nui-v2/lib/container'
import ElMain from 'nui-v2/lib/main'
import ElAside from 'nui-v2/lib/aside'
import { getErrorMsg } from '@/utils/toast'
import tableMixin from 'web-crm/src/mixins/table'
export default {
  components: {
    ElUpload,
    ElContainer,
    ElMain,
    ElAside
  },
  mixins: [tableMixin],
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
        personalNumber: null,
        addTime: null, // 发送时间
        likesMin: null, // 点赞最小数
        likesMax: null, // 点赞最大数
        commentsMin: null, // 评论最小数
        commentsMax: null, // 评论最大数
        snsType: null, // 内容类型
        keyword: null // 关键字
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
      dialogVisible: false,
      dialogVisibleShow: false,
      model: model,
      imageUrl: '',
      textarea: '',
      quickSearchModel: quickSearchModel,
      rules: Object.assign({}, {}, {}),
      _pagination: pagination,
      _queryConfig: {
        expand: false
      },
      moments: null, // 朋友圈列表
      images: ['http://img08.tooopen.com/20190724/tooopen_sy_135348534841335.jpg', 'http://img08.tooopen.com/20190724/tooopen_sy_09280628694439.jpg'],
      likeNames: null, // 点赞的名称
      interationMsgs: null, // 互动消息
      personalNumberList: null // 个人号列表
    }
  },
  mounted () {
    this.initPersonalNumberList()
    this.initMomentsList()
    this.initInteractionMsgList()
    this.$nextTick(() => {
      this.setHeight()
      window.addEventListener('resize', () => {
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
    initMomentsList () {
      var _this = this
      _this.$http.fetch(_this.$api.guide.myMoments.momentsList, this.model).then(resp => {
        if (resp.success && resp.result != null) {
          _this.moments = resp.result.data
          // 获取朋友圈图片
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    initInteractionMsgList () {
      var _this = this
      _this.$http.fetch(_this.$api.guide.myMoments.interactionMsgList, this.model).then(resp => {
        if (resp.success && resp.result != null) {
          _this.interationMsgs = resp.result.data
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    // 个人号列表
    initPersonalNumberList () {
      var _this = this
      _this.$http.fetch(_this.$api.guide.wxDeviceGuideRelation.findWidNickSelector).then(resp => {
        if (resp.success && resp.result != null) {
          _this.personalNumberList = resp.result
          console.log('ad' + _this.personalNumberList)
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败ad', resp))
      })
    },
    queryMomentsList () {
      var _this = this
      _this.$http.fetch(_this.$api.guide.myMoments.momentsList, this.model).then(resp => {
        if (resp.success && resp.result != null) {
          _this.moments = resp.result.data
          // 获取朋友圈图片
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    rest () {
      var _this = this
      _this.model = this.model
      _this.initMomentsList()
    },
    /**
     * 计算主要显示窗口的高度，动态设置页面内主要内容的高度
     */
    setHeight: function () {
      /**
       *  左侧工具栏高度&因滚动条样式margin-bottom负值17px，需要添加上17px,
       *  15px为底部10px间距和表单5px内边距
       **/
      const PAGE_TOP_SEARCH = 60 // 简单搜索的高度
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
      @e container { }
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
      padding: 10px 20px;
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
        font-size: var(--default-font-size-middle);
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
        padding-left: 20px;
      }
    }
    @b item {
      position: relative;
      padding: 15px 25px 15px 0;
      border-bottom: 1px solid var(--talk-border-color-gray);
      &:last-child {
        border: none;
      }
      @e avatar {
        width: 52px;
        height: 52px;
        position: absolute;
        top: 20px;
        left: 0;
      }
      @e content{
        width: 100%;
        float: left;
        padding-left: 72px;
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
        font-size: var(--default-font-size-base);
      }
      @e private {
        font-size: var(--default-font-size-small);
        color: var(--theme-font-color-secondary);
        float: right;
      }
    }
    @b sentence {
      font-size: var(--default-font-size-small);
      color: var(--theme-font-color-primary);
      font-weight: bold;
      width: 95%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    @b matching {
      width: 475px;
      margin-top: 20px;
      @e figurelist {
        margin: 0;
        padding: 0;
        &:after {
          content: "";
          display: block;
          clear: both;
          height: 0;
          overflow: hidden;
          visibility: hidden;
        }
      }
    }
    @b li {
      float: left;
      width: 122px;
      margin: 0 2% 2% 0;
      @e figure {
        position: relative;
        width: 100%;
        height: 0;
        overflow: hidden;
        margin: 0;
        padding-bottom: 100%; /* 关键就在这里 */
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        cursor: pointer;
        @m img {
          display: block;
          position: absolute;
          width: 100%;
          top: 0;
          bottom: 0;
        }
      }
    }
    @b time {
      font-size: var(--default-font-size-base);
      color: var(--theme-font-color-secondary);
      margin-top: 5px;
    }
    @b interactive {
      text-align: right;
      @e like {
        font-size: var(--default-font-size-middle);
        color: var(--theme-font-color-primary);
        cursor: pointer;
      }
      @e comment {
        font-size: var(--default-font-size-middle);
        color: var(--theme-font-color-primary);
        margin-left: 15px;
        cursor: pointer;
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
      position: relative;
      @e item {
        padding-bottom: 8px;
        &:last-child {
          padding-bottom: 0;
        }
      }
    }
    @b msglength {
      width: 90%;
      text-overflow : ellipsis;
      white-space : nowrap;
      overflow : hidden;
      @e reply {
        position: absolute;
        right: 15px;
        display: inline-block;
      }
    }
    @b bottom {
      padding: 5px 15px;
      border-top: 1px solid var(--talk-border-color-gray);
    }
    @b main {
      width: 30%;
      margin-left: 10px;
      @e list {
        background: var(--theme-color-white);
        padding-left: 20px;
      }
      @e bottom {
        padding: 5px 15px;
        border-top: 1px solid var(--talk-border-color-gray);
        background: var(--theme-color-white);
      }
    }
    @b convey {
      padding: 30px 15px 15px 0;
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
        min-height: 102px;
        position: relative;
        margin-top: 20px;
      }
    }
    @b headportrait {
      width: 52px;
      height: 52px;
      position: absolute;
      left: 0;
      top: 0;
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
      top: -1px;
      background: var(--talk--background-color-red);
      border-radius: 50%;
    }
    @b personmsg {
      width: 72%;
      float: left;
      padding: 5px 20px 0 77px;
      @e uname {
        font-size: var(--default-font-size-base);
        text-overflow : ellipsis;
        white-space : nowrap;
        overflow : hidden;
      }
      @e about {
        font-size: var(--default-font-size-small);
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
        text-overflow : ellipsis;
        white-space : nowrap;
        overflow : hidden;
      }
    }
    @b photo {
      position: absolute;
      right: 10px;
      bottom: 0;
      margin: 0;
      padding: 0;
      &:after {
        content: "";
        display: block;
        clear: both;
        height: 0;
        overflow: hidden;
        visibility: hidden;
      }
      @e img {
        width: 100%;
        height: 100%;
      }
      @e li {
        float: left;
        width: 102px;
        margin: 0 2% 2% 0;
        @m figure {
          position: relative;
          width: 100%;
          height: 0;
          overflow: hidden;
          margin: 0;
          padding-bottom: 100%; /* 关键就在这里 */
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          cursor: pointer;
          @m img {
            display: block;
            position: absolute;
            width: 100%;
            top: 0;
            bottom: 0;
          }
        }
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
    cursor: pointer;
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
  .widthlength {
    width: 92px;
  }
  .el-scrollbar {
    background: var(--theme-color-white);
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
