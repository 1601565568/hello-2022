<template>
  <div>
    <el-container class="talk-chat__container">
      <el-aside class="talk-aside" style="width: 65%">
        <ns-page-table>

          <!-- 简单搜索 -->
          <!-- el-form 需添加 @submit.native.prevent 配置 -->
          <!-- el-inpu 需添加  @keyup.enter.native="$quickSearchAction$" 配置，实现回车搜索 -->
          <template slot="searchSearch">
            <el-form :model="quickSearchModel" :inline="true" @submit.native.prevent class="pull-right">
              <el-form-item v-show="_data._queryConfig.expand === false">
                <el-input ref="quickText" v-model="model.keyword" placeholder="关键字"
                          @keyup.enter.native="$quickSearchAction$(model.keyword)">
                  <i class="el-icon-search el-input__icon" slot="suffix" name="name"
                     @click="$quickSearchAction$(model.keyword)"></i>
                </el-input>
              </el-form-item>
              <el-form-item>
                <ns-button type="text" @click="$handleTabClick">
                  <!--{{collapseText}}-->
                  {{!_data._queryConfig.expand ? '展开搜索' : '收起搜索'}}
                  <i
                    :class="{'el-icon--right': true, 'el-icon-arrow-down': !_data._queryConfig.expand, 'el-icon-arrow-up': _data._queryConfig.expand} ">
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
                     :model="model" :inline="true">
              <el-form-item label="个人号：">
                <el-form-grid size="xmd">
                  <el-select v-model="model.owner" filterable clearable
                             :multiple="false">
                    <el-option v-for="number in personalNumberList" :label="number.nick" :value="number.wid"
                               :key="number.wid">
                    </el-option>
                  </el-select>
                </el-form-grid>
              </el-form-item>
              <el-form-item label="内容类型：">
                <el-form-grid size="xmd">
                  <el-select v-model="model.snsType" filterable clearable
                             :multiple="false">
                    <el-option label="全部" value="all"></el-option>
                    <el-option label="图文" value="image"></el-option>
                    <el-option label="文字" value="text"></el-option>
                    <el-option label="分享链接" value="link"></el-option>
                    <el-option label="视频" value="video"></el-option>
                  </el-select>
                </el-form-grid>
              </el-form-item>
              <el-form-item label="排序方式：">
                <el-form-grid size="xmd">
                  <el-select v-model="model.orderType" filterable clearable
                             :multiple="false">
                    <el-option label="点赞数降序" value="likesDesc"></el-option>
                    <el-option label="评论数降序" value="commentsDesc"></el-option>
                    <el-option label="点赞数升序" value="likesAsc"></el-option>
                    <el-option label="评论数升序" value="commentsAsc"></el-option>
                  </el-select>
                </el-form-grid>
              </el-form-item>
              <el-form-item label="关键字：">
                <el-form-grid size="xmd">
                  <el-input v-model="model.keyword" clearable></el-input>
                </el-form-grid>
              </el-form-item>
              <el-form-item label="日期：" class="choicedate">
                <el-form-grid size="xmd">
                  <!--                  <el-date-picker-->
                  <!--                    type="date"-->
                  <!--                    placeholder="请选择日期" v-model="model.addTime">-->
                  <!--                  </el-date-picker>-->
                  <el-date-picker
                    v-model="model.time"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-grid>
              </el-form-item>
<!--              <el-form-item label="点赞数：">-->
<!--                <el-form-grid class="widthlength">-->
<!--                  <el-input v-model="model.likesMin"></el-input>-->
<!--                </el-form-grid>-->
<!--                <el-form-grid class="text-tips&#45;&#45;grey">-->
<!--                  ~-->
<!--                </el-form-grid>-->
<!--                <el-form-grid class="widthlength">-->
<!--                  <el-input v-model="model.likesMax"></el-input>-->
<!--                </el-form-grid>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="评论数：">-->
<!--                <el-form-grid class="widthlength">-->
<!--                  <el-input v-model="model.commentsMin"></el-input>-->
<!--                </el-form-grid>-->
<!--                <el-form-grid class="text-tips&#45;&#45;grey">-->
<!--                  ~-->
<!--                </el-form-grid>-->
<!--                <el-form-grid class="widthlength">-->
<!--                  <el-input v-model="model.commentsMax"></el-input>-->
<!--                </el-form-grid>-->
<!--              </el-form-item>-->
            </el-form>
            <div class="template-table__more-btn">
              <ns-button type="primary" @click="queryMomentsList()">{{$t('operating.search')}}</ns-button>
              <ns-button @click="rest()">{{$t('operating.reset')}}</ns-button>
            </div>
          </template>
          <!-- 高级搜索-结束 -->

          <!-- 左边内容滚动区域 -->
          <template slot="table" ref="mainTable">
            <el-scrollbar ref="fullScreen">
              <div class="talk-aside__list" ref="asd" v-for="moment in moments" :key="moment.id">
                <div class="talk-item clearfix">
                  <div class="talk-item__avatar">
                    <img :src="moment.head" class="talk-avatarimg" alt="个人号头像">
                  </div>
                  <div class="talk-item__content">
                    <div class="talk-name">
                      <span class="talk-name__call colorblue">{{moment.nick}}</span>
                      <span class="talk-name__private">个人号：{{moment.personalNum}}（ {{moment.ownerId}} ）</span>
                    </div>
                    <div class="talk-sentence">{{moment.content}}</div>
                    <div class="talk-matching">
                      <div class="talk-matching__figurelist" v-if="moment.images">
                        <div class="talk-li" v-for="image in moment.images" :key="image">
                          <div :style="{backgroundImage: 'url(' + image + ')'} " class="talk-li__figure">
                            <div class="talk-li__figure--img"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="talk-time">{{moment.snsTime}}</div>
                    <div class="talk-interactive">
                      <span class="talk-interactive__like">
                        <i class="iconfont icon-dianzan" @click="like(moment)"></i>
                        {{moment.likesNum}}
                      </span>
                      <span class="talk-interactive__comment">
                        <i class="iconfont icon-pinglun" @click="replyComment(moment)"></i>
                        {{moment.commentsNum}}
                      </span>
                    </div>
                    <!--点赞和评论 -->
                    <div class="talk-detail" v-if="moment.likesNum>0 || moment.commentsNum>0">
                      <div class="talk-detail__substance">
                        <div class="talk-chatmsg" v-if="moment.likeName">
                          <i class="iconfont icon-dianzan colorblue"></i>
                          <span class="colorblue">{{moment.likeName}}</span>
                        </div>
                        <div class="talk-msg" v-if="moment.comments">
                          <div class="talk-msg__item clearfix">
                            <div class="talk-msglength" v-for="comment in moment.comments" :key="comment.id">
                              <div v-if="comment.previousOwnerNick ===''">
                                <span
                                  class="colorblue">{{comment.commentator?comment.commentator:comment.ownerNick}}：</span>
                                <span>{{comment.content}}</span>
                                <span class="talk-msglength__reply colorblue" v-if="comment.ownerId !== moment.ownerId"
                                      @click="replyComment(moment,comment)">回复</span>
                              </div>
                              <div v-else-if="comment.previousOwnerNick !== ''">
                                <span
                                  class="colorblue">{{comment.commentator?comment.commentator:comment.ownerNick}}</span>
                                <span>回复</span>
                                <span class="colorblue">{{comment.friendNick?comment.friendNick:comment.owner}}：</span>
                                <span>{{comment.content}}</span>
                                <span class="colorblue talk-msglength__reply" v-if="comment.ownerId !== moment.ownerId"
                                      @click="replyComment(moment,comment)">回复</span>
                                <!-- 暂无删除评论接口，以下一行代码先注释 -->
                                <!--                               <span class="colorblue talk-msglength__reply" v-if="comment.nick==comment.ownerNick">删除</span>-->
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="talk-circle"></div>
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
                             layout="total, sizes, prev, pager, next, jumper"
                             @size-change="sizeChange"
                             @current-change="pageChange">
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
            <div class="talk-convey" v-for="msg in interationMsgs" :key="msg.id">
              <div class="talk-convey__name">个人号：{{msg.nick}}（ {{msg.snsOwnerId}} ）</div>
              <div class="talk-convey__content clearfix">
                <div class="talk-headportrait">
                  <img
                    :src="msg.head?msg.head:msg.friendHead"
                    alt="头像" class="talk-headportrait__img">
                </div>
                <!--                <div class="talk-redpoint"></div>-->
                <div class="talk-personmsg">
                  <div class="talk-personmsg__uname colorblue">{{msg.commentator?msg.commentator:msg.ownerNick}}</div>
                  <div class="talk-personmsg__about" v-if="msg.type==2">{{msg.content}}</div>
                  <div class="talk-personmsg__about talk-personmsg__ablue--like" v-else-if="msg.type==1">
                    <i class="iconfont icon-dianzan colorblue"></i>
                  </div>
                  <div class="talk-personmsg__time">{{msg.addTime}}</div>
                </div>
                <div class="talk-say" v-if="msg.content">
                  {{msg.content}}
                </div>
                <div class="talk-photo"v-if="!msg.content">
                  <div class="talk-photo__li">
                    <div
                      style="background-image:url(https://shopguide.oss-cn-hangzhou.aliyuncs.com/test/201907/120,910,104,359,001/a2e079dd-e605-49d3-9c10-a3893b413ba0.jpg)"
                      class="talk-photo__li--figure">
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
            :page-sizes="interactionPagination.sizeOpts" :total="interactionTotal"
            :current-page="interactionPagination.page" :page-size="interactionPagination.size"
            @current-change="interactionPageChange" :url="interactionUrl">
          </el-pagination>
        </div>
      </el-main>
    </el-container>

    <!-- 回复弹窗-->
    <el-dialog
      title="回复"
      :visible.sync="dialogVisibleReply"
      width="460px"
      class="dialog-content" :before-close="closeDialog">
      <el-form ref="form">
        <el-form-item>
          <div class="dialog-content__reply" v-if="otherComment">{{otherComment.ownerNick}}：</div>
          <div class="dialog-content__reply" v-else-if="otherMoment ">{{otherMoment.nick}}：</div>
        </el-form-item>
        <el-form-item class="dialog-content__subtance dialog-content__subtance--margintop">
          <div class="dialog-detail dialog-detail--paddingbtm">
            <el-input type="textarea" :rows="8" placeholder="请输入评论内容" v-model="content">
            </el-input>
            <i class="iconfont icon-biaoqing"></i>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <ns-button @click="closeDialog">取 消</ns-button>
        <ns-button type="primary" @click="reply()" :disabled="isHidden">确 定</ns-button>
      </span>
    </el-dialog>
    <!-- 回复弹窗-->
  </div>
</template>
<script>
import ElUpload from 'nui-v2/lib/upload'
import ElContainer from 'nui-v2/lib/container'
import ElMain from 'nui-v2/lib/main'
import ElAside from 'nui-v2/lib/aside'
import { getErrorMsg } from '@/utils/toast'
import tableMixin from 'web-crm/src/mixins/table'
import moment from 'moment'

export default {
  components: {
    ElUpload,
    ElContainer,
    ElMain,
    ElAside
  },
  mixins: [tableMixin],
  props: {
    types: Object,
    comment: Object,
    moment: Object
  },
  data: function () {
    var pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    var interactionPagination = {
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
    let rules = {
      'likesMin': [
        { type: 'number', message: '必须为数字值' }
      ],
      'likesMax': [
        { type: 'number', message: '必须为数字值' }
      ],
      'commentsMin': [
        { type: 'number', message: '必须为数字值' }
      ],
      'commentsMax': [
        { type: 'number', message: '必须为数字值' }
      ]
    }
    var quickSearchNames = quickInput.map(x => x.name)
    var quickSearchModel = {}
    var model = Object.assign({},
      {
        owner: null, // 个人号id
        likesMin: null, // 点赞最小数
        likesMax: null, // 点赞最大数
        commentsMin: null, // 评论最小数
        commentsMax: null, // 评论最大数
        snsType: null, // 内容类型
        keyword: null, // 关键字
        orderType: null, // 排序方式
        timeEnd: null,
        timeStart: null,
        time: null // 发朋友圈时间
      },
      {})
    var _this = this

    quickInput.map(item => {
      Object.defineProperty(quickSearchModel, item.name, {
        get: function () {
          return model[item.name]
        },
        set: function (val) {
          model[item.name] = val
          // TODO 由于特殊需求导致下列写法
          if (item.type === 'radio') {
            _this._data._table.quickSearchMap[item.name] = val
            _this.$quickSearch$()
          }
        },
        enumerable: true
      })
    })

    return {
      dialogVisible: false,
      dialogVisibleReply: false,
      isHidden: false,
      model: model,
      imageUrl: '',
      textarea: '',
      quickSearchModel: quickSearchModel,
      rules: rules,
      _pagination: pagination,
      // eslint-disable-next-line vue/no-reserved-keys
      interactionPagination: interactionPagination,
      momentsTotal: 0,
      _queryConfig: {
        expand: false
      },
      moments: null, // 朋友圈列表
      // images: [],
      likeNames: null, // 点赞的名称
      interationMsgs: null, // 互动消息
      personalNumberList: null, // 个人号列表
      content: null, // 回复内容
      wid: null, // 朋友圈id
      url: null,
      interactionUrl: {
        url: '/moments/list/interaction/MINE',
        method: 'post'
      },
      otherMoment: null,
      otherComment: null,
      interactionTotal: 0,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一天',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
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
    this.setState()
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
    // 初始化朋友圈信息
    initMomentsList () {
      var _this = this
      console.log('获取朋友圈内容')
      _this.url = _this.$api.guide.friendMoments.momentsList
      let params = _this.$generateParams$()
      _this.$http.fetch(_this.url, params).then(resp => {
        if (resp.success && resp.result != null) {
          _this.moments = resp.result.data
          _this._data._pagination.total = parseInt(resp.result.recordsTotal)
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    initInteractionMsgList () {
      var _this = this
      console.log('获取互动消息内容')
      let interactionUrl = _this.$api.guide.friendMoments.interactionMsgList
      var limit = {
        start: (_this.interactionPagination.page - 1) * _this.interactionPagination.size,
        length: _this.interactionPagination.size
      }
      _this.$http.fetch(interactionUrl, limit).then(resp => {
        if (resp.success && resp.result != null) {
          _this.interationMsgs = resp.result.data
          _this.interactionTotal = parseInt(resp.result.recordsTotal)
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    sizeChange (size) {
      var _this = this
      var pagination = _this._data._pagination
      pagination.size = size
      pagination.page = 1
      let params = this.$generateParams$()
      _this.$http.fetch(_this.$api.guide.friendMoments.momentsList, params).then(resp => {
        if (resp.success && resp.result != null) {
          _this.moments = resp.result.data
          _this._data._pagination.total = parseInt(resp.result.recordsTotal)
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    pageChange (page) {
      var _this = this
      var pagination = _this._data._pagination
      pagination.page = page
      let params = this.$generateParams$()
      _this.$http.fetch(_this.$api.guide.friendMoments.momentsList, params).then(resp => {
        if (resp.success && resp.result != null) {
          _this.moments = resp.result.data
          _this._data._pagination.total = parseInt(resp.result.recordsTotal)
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    // 互动消息分页查询-页面跳转
    interactionPageChange (page) {
      var _this = this
      let changePage = page
      var limit = {
        start: (changePage - 1) * _this.interactionPagination.size,
        length: _this.interactionPagination.size
      }
      _this.$http.fetch(_this.$api.guide.friendMoments.interactionMsgList, limit).then(resp => {
        if (resp.success && resp.result != null) {
          _this.interationMsgs = resp.result.data
          _this.interactionTotal = parseInt(resp.result.recordsTotal)
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    reloadList () {
      setTimeout(this.initMomentsList(), 4000)
      setTimeout(this.initInteractionMsgList(), 4000)
    },
    // 个人号列表
    initPersonalNumberList () {
      var _this = this
      _this.$http.fetch(_this.$api.guide.wxDeviceGuideRelation.findWidNickSelector).then(resp => {
        if (resp.success && resp.result != null) {
          _this.personalNumberList = resp.result
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    closeDialog () {
      this.dialogVisibleReply = false
      this.otherComment = null
      this.otherMoment = null
      this.content = null
      this.isHidden = false
    },
    // 查询朋友圈列表
    queryMomentsList () {
      var _this = this
      if (_this.model.time !== '' && _this.model.time != null) {
        _this.model.timeStart = moment(_this.model.time[0]).format('YYYY-MM-DD HH:mm:ss')
        _this.model.timeEnd = moment(_this.model.time[1]).format('YYYY-MM-DD 23:59:59')
      }
      _this._data._pagination.page = 1
      let params = _this.$generateParams$()
      params.start = 0
      params.page = 1
      _this.$http.fetch(_this.$api.guide.friendMoments.momentsList, params).then(resp => {
        if (resp.success && resp.result != null) {
          _this.moments = resp.result.data
          _this._data._pagination.total = parseInt(resp.result.recordsTotal)
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    // 快速查询
    $quickSearchAction$ (keyword) {
      var _this = this
      let params = _this.$generateParams$()
      params.searchMap.keyword = keyword
      _this.$http.fetch(_this.$api.guide.friendMoments.momentsList, params).then(resp => {
        if (resp.success && resp.result != null) {
          _this.moments = resp.result.data
          _this._data._pagination.total = parseInt(resp.result.recordsTotal)
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    // 回复评论
    reply () {
      var _this = this
      _this.content = _this.content.replace(/\s*/g, '')
      if (_this.content == null || _this.content.length === 0) {
        _this.$notify.error('内容不能为空')
        return
      }
      if (_this.content.length > 800) {
        _this.$notify.error('评论内容不能超过800字')
        return
      }
      _this.isHidden = true
      let commentType = 0
      let replyToNick = null
      if (_this.otherComment) {
        if (_this.otherComment.ownerId === _this.otherMoment.ownerId) {
          console.log('评论人等于发布人')
          commentType = 0
          replyToNick = null
        } else {
          console.log('评论人不等于发布人')
          replyToNick = _this.otherComment.ownerNick
          commentType = 1
        }
      }
      let replyMomentVo = {
        wid: _this.otherMoment.ownerId,
        snsId: _this.otherMoment.snsId,
        author: _this.otherMoment.owner,
        content: _this.content,
        replyTo: _this.otherComment ? _this.otherComment.ownerId : _this.otherMoment.owner,
        commentType: commentType,
        replyToNick: replyToNick,
        commentId: _this.otherComment ? _this.otherComment.cid : null
      }
      _this.$http.fetch(_this.$api.guide.myMoments.replyComment, replyMomentVo).then(resp => {
        if (resp.success) {
          _this.$notify.success('评论成功')
          _this.closeDialog()
          _this.reloadList()
        }
      }).catch((resp) => {
        _this.isHidden = false
        _this.$notify.error(getErrorMsg('评论失败', resp))
      })
    },
    // 回复评论-打开弹窗并初始化参数
    replyComment (moment, comment) {
      var _this = this
      _this.dialogVisibleReply = true
      console.log('发布人：' + moment.nick)
      _this.otherMoment = moment
      if (comment) {
        console.log('评论人：' + comment.ownerNick)
        _this.otherComment = comment
      }
    },
    // 点赞朋友圈
    like (moment) {
      var _this = this
      let replyMomentVo = {
        wid: moment.ownerId,
        snsId: moment.snsId,
        author: moment.owner
      }
      _this.$http.fetch(_this.$api.guide.myMoments.like, replyMomentVo).then(resp => {
        if (resp.success) {
          _this.$notify.success('点赞成功')
          _this.reloadList()
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('点赞失败', resp))
      })
    },
    // 重置
    rest () {
      var _this = this
      _this.url = _this.$api.guide.myMoments.momentsList
      let keys = Object.keys(_this.model)
      for (let i = 0; i < keys.length; i++) {
        this.model[keys[i]] = null
      }
      // _this.$resetInputAction$()
      _this.initMomentsList()
    },
    beforeAvatarUpload (file) {
      if (file.size / 1024 > 5000) {
        this.$notify.error('上传图片不得大于5M')
        return false
      }
      // 图片格式判断
      if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG|JPEG)$/.test(file.name)) {
        this.$notify.error('不支持的图片格式')
        return false
      }
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
          BTN_BOTTOM - PAGE_TOP_SEARCH + 17 - 25
      let limitHeightRight = window.innerHeight -
          document.getElementsByClassName('talk-personal')[0].offsetHeight -
          document.getElementsByClassName('nav')[0].offsetHeight -
          BTN_BOTTOM + 17 - 20
      this.$refs.fullScreen.$el.children[0].style.maxHeight = limitHeight + 'px'
      this.$refs.fullScreenright.$el.children[0].style.maxHeight = limitHeightRight + 'px'
    },
    setState () {
      this.list.map((item, index) => {
        let descHeight = this.$refs.asideList.children[index].children[1].children[1].clientHeight
        if (descHeight > 40) {
          this.$set(this.list[index], 'showState', 2)
        } else {
          this.$set(this.list[index], 'showState', 0)
        }
      })
    }
  },
  watch: {
    content (newValue) {
      this.content = newValue
      if (this.content != null && this.content.replace(/\s*/g, '').length !== 0) {
        this.isHidden = false
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
      display: flex  ;
      align-items: center  ;
      position: relative  ;
      padding:  10px  20px  ;
      background:
    var(--theme-color-white  );
      border-bottom:  1px solid  var(--talk-border-color-gray  );
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
      width:  70%;
      background:  var(--theme-color-white  );
      @e list {
        width: 100%;
        background: var(--theme-color-white);
        padding-left: 20px;
      }
    }
    @b item {
      position: relative  ;
      padding:  15px  25px  15px  0;
      border-bottom:  1px solid  var(--talk-border-color-gray  );
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
      @e content {
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
      line-height:  0;
      height:  26px  ;
      padding:  20px  0;
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
      width:  475px  ;
      margin-top:  20px  ;
      @e figurelist {
        margin:  0;
        padding:  0;
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
      float: left  ;
      width:  122px  ;
      margin:  0 2% 2% 0;
      @e figure {
        position: relative  ;
        width:  100%;
        height:  0;
        overflow: hidden  ;
        margin:  0;
        padding-bottom:  100%; /* 关键就在这里 */
        background-position: center  ;
        background-repeat: no-repeat  ;
        background-size: cover  ;
        cursor: pointer  ;
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
      text-align: right

    ;
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
      margin-top:  10px  ;
      background:  var(--talk-border-color-gray  );
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
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 8px solid var(--talk-border-color-gray);
      position: absolute;
      top: -8px;
      left: 18px;
    }
    @b msg {
      padding:  16px  ;
      position: relative  ;
      @e item {
        padding-bottom:  8px  ;
      &:last-child {
         padding-bottom: 0;
       }
      }
    }
    @b msglength {
      width:  90%;
      text-overflow : ellipsis  ;
      white-space : nowrap  ;
      overflow : hidden  ;
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
      width:  30%;
      margin-left:  10px  ;
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
      padding:  30px  15px  15px  0;
      border-bottom:  1px solid  var(--talk-border-color-gray  );
    &:last-child {
       border-bottom: none;
     }

      @e name {
        font-size: var(--default-font-size-base);
        color: var(--theme-font-color-secondary);
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      @e content {
        min-height: 102px;
        position: relative;
        margin-top: 20px;
      }
    }
    @b headportrait {
      width:  52px  ;
      height:  52px  ;
      position: absolute  ;
      left:  0;
      top:  0;
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
      width:  72%;
      float: left  ;
      padding:  5px  20px  0 77px  ;
      @e uname {
        font-size: var(--default-font-size-base);
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      @e about {
        font-size:  var(--default-font-size-small);
        color:  var(--theme-font-color-primary);
        margin-top:  10px  ;
        text-overflow : ellipsis  ;
        white-space : nowrap  ;
        overflow : hidden  ;
        @m like {
          cursor: pointer;
        }
      }
      @e time {
        font-size: var(--default-font-size-base);
        color: var(--theme-font-color-secondary);
        margin-top: 15px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
    @b photo {
      position: absolute  ;
      right:  10px  ;
      bottom:  0;
      margin:  0;
      padding:  0;
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
        float: left  ;
        width:  102px  ;
        margin:
      0 2% 2% 0;
        @m figure {
          position: relative  ;
          width:  100%;
          height:  0;
          overflow: hidden  ;
          margin:  0;
          padding-bottom:  100%; /* 关键就在这里 */
          background-position: center  ;
          background-repeat: no-repeat  ;
          background-size: cover  ;
          cursor: pointer  ;
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
    @b say {
      width: 102px;
      min-height: 102px;
      position: absolute;
      right: 10px;
      bottom: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 5;
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
      @e reply {
        color: var(--theme-font-color-secondary);
        @m text {
          margin-left: 5px;
        }
      }
      @e subtance {
        margin: 20px 0;
        @m margintop {
          margin: 0 0 10px;
        }
      }
    }
    @b detail {
      padding: 10px;
      border: 1px solid #DDD;
      @m paddingbtm {
        padding: 10px 10px 0;
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
    border: 1px dashed #D9D9D9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  &:hover {
     border-color: #409EFF;
   }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8C939D;
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
  >>> .el-dialog__title {
    font-size: var(--default-font-size-base);
  }
  .icon-biaoqing {
    font-size: 22px;
    cursor: pointer;
  }
  .dialog-content >>> .el-dialog__header {
    padding: 10px 20px 2px !important;
  }
  .dialog-content >>> .el-dialog__footer {
    padding: 10px 20px !important;
  }
  /* 发朋友圈弹窗样式结束*/
  .choicedate >>> .el-date-editor .el-range-separator {
    width: 17%;
  }
</style>
