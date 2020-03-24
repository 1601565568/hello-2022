<template>
  <div>
    <div class="message-detail">
      <ElTable :data="publishData" class="message-detail__table">
        <ElTableColumn label="基础信息">
          <template slot-scope="scope">
            <!-- type=1 文本 -->
            <div v-if="scope.row.type === 'text'" class="message-item message-item--title">{{scope.row.content}}</div>
            <!-- type=2 图片 -->
            <div v-if="scope.row.type === 'image'" class="message-item message-item--title">
              <ElImage
                :height="46"
                :width="76"
                mode="fill"
                :src="scope.row.content"
                :preview-src-list="scope.row.content.split(';')"/>
            </div>
            <!-- type=3 视频 -->
            <div v-if="scope.row.type === 'video'" @click="playVideo(scope.row)" class="message-item message-item--opposite">
              <ElImage
                :height="46"
                :width="76"
                mode="fill"
                :src="scope.row.content + '?x-oss-process=video/snapshot,t_10000,m_fast'" />
              <div class="message-item__broadcast">
                <div class="message-circle"></div>
              </div>
            </div>
            <!-- type=4 链接 -->
            <div v-if="scope.row.type === 'link'" class="message-item message-item--title">{{scope.row.title}} </div>
            <!-- type=5 小程序 -->
            <div v-if="scope.row.type === 'sendLittleProgram'" class="message-item message-item--title">{{scope.row.title}}</div>
          </template>
        </ElTableColumn>
        <ElTableColumn label="内容类型" align="center" width="80">
          <template slot-scope="scope">
            <template v-if="scope.row.type === 'text'">文字</template>
            <template v-if="scope.row.type === 'image'">图片</template>
            <template v-if="scope.row.type === 'video'">视频</template>
            <template v-if="scope.row.type === 'link'">链接</template>
            <template v-if="scope.row.type === 'sendLittleProgram'">小程序</template>
          </template>
        </ElTableColumn>
        <ElTableColumn label="发送顺序" align="center" width="100" >
          <template slot-scope="scope">
            <div class="text-primary font-size-large cursor-pointer">
              <Icon type="zhiding" @click="zIndexTop(scope.$index)" className="message-pointer" />
              <Icon type="top-arr" @click="zIndexUp(scope.$index)" className="message-pointer" />
              <Icon type="down-arr" @click="zIndexDown(scope.$index)" className="message-pointer" />
              <Icon type="zhidi" @click="zIndexBottom(scope.$index)" className="message-pointer" />
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" align="center" :width="80">
          <template slot-scope="scope">
            <NsTableColumnOperateButton :buttons="tableButtons" :prop="scope" />
          </template>
        </ElTableColumn>
      </ElTable>
      <div class="message-item message-item--add">
        <ElPopover trigger="hover">
          <div class="message-prompt">
            <div class="message-prompt__mass" @click="openText(null)">
              <Icon type="file-text" className="font-size-xlarge cursor-pointer message-hovericolor"/>
              <div class="message-prompt__mass--topspace cursor-pointer message-hovericolor">文字</div>
            </div>
            <div class="message-prompt__mass">
              <ElUpload
                :action="this.$api.core.sgUploadFile('message')"
                :show-file-list="false"
                :on-success="handleAvatarSuccessImageSave"
                :before-upload="beforeAvatarUpload">
                <Icon type="picture" className="font-size-xlarge cursor-pointer message-hovericolor"/>
                <div class="message-prompt__mass--topspace cursor-pointer message-hovericolor">图片</div>
              </ElUpload>
            </div>
            <div class="message-prompt__mass">
              <ElUpload name="file"
                        :action="this.$api.core.sgUploadFile('message')"
                        :show-file-list="false"
                        accept=".mp4"
                        :on-success="handleVideoSuccessVideoSave"
                        :before-upload="beforeUploadVideo">
                <Icon type="video-camera" className="font-size-xlarge cursor-pointer message-hovericolor"/>
                <div class="message-prompt__mass--topspace cursor-pointer message-hovericolor">视频</div>
              </ElUpload>
            </div>
            <div class="message-prompt__mass" @click="openWeb(null)">
              <Icon type="link" className="font-size-xlarge cursor-pointer message-hovericolor"/>
              <div class="message-prompt__mass--topspace cursor-pointer message-hovericolor">链接</div>
            </div>
            <div class="message-prompt__mass" @click="openApplet(null)">
              <Icon type="wechat" className="font-size-xlarge cursor-pointer message-hovericolor"/>
              <div class="message-prompt__mass--topspace cursor-pointer message-hovericolor">小程序</div>
            </div>
          </div>
          <NsButton v-if="disabled" type="text" slot="reference" disabled>+添加消息内容</NsButton>
          <NsButton v-else type="text" slot="reference">+添加消息内容</NsButton>
        </ElPopover>
        <span class="text-secondary">
          最多添加10条消息；上传视频限制大小30M，格式为MP4。
        </span>
      </div>
    </div>

    <!-- 文字弹框 start -->
    <ElDialog
      width="600px"
      title="文字"
      :visible.sync="dialogVisibleText"
      :show-scroll-x=false>
      <div>
        <ElForm label-width="100px" >
          <ElInput
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="textModel.content" />
        </ElForm>
        <ElFormItem>
          <ElFormGrid>
            <ElPopover trigger="hover" placement="bottom">
              <VEmojiPicker :pack="pack" @select="selectEmoji" style="height: 200px;"/>
              <NsButton type="text" slot="reference"><Icon type="biaoqing" className="font-size-large cursor-pointer" /></NsButton>
            </ElPopover>
          </ElFormGrid>
          <ElFormGrid>
            <ns-button class="font-size-large cursor-pointer" type="text" @click="insertPlaceHolderToText('{customerNick}')"> &lt;好友微信昵称&gt; </ns-button>
          </ElFormGrid>
          <ElFormGrid>
            <ns-button class="font-size-large cursor-pointer" type="text" @click="insertPlaceHolderToText('{employeeName}')"> &lt;员工姓名&gt; </ns-button>
          </ElFormGrid>
        </ElFormItem>
      </div>
      <span slot="footer">
        <NsButton @click="dialogVisibleText = false">{{$t('operating.cancel')}}</NsButton>
        <NsSave @click="addText"/>
      </span>
    </ElDialog>
    <!-- 文字弹框 end -->

    <!-- 图片弹框 start -->
    <ElDialog
      width="300px"
      height="300px"
      :visible.sync="dialogVisibleImage"
      :show-scroll-x=false>
      <div class="margin-lr-small">
        <ElForm>
          <ElUpload
            :action="this.$api.core.sgUploadFile('message')"
            :show-file-list="false"
            :on-success="handleAvatarSuccessImageEdit"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageModel.content" :src="imageModel.content" width="250px" height="260px">
            <Icon type="plus" className="message-upload__tip" v-else/>
          </ElUpload>
        </ElForm>
      </div>
    </ElDialog>
    <!-- 图片弹框 end -->

    <!-- 视频弹框 start -->
    <ElDialog
      width="400px"
      :visible.sync="dialogVisibleVideo"
      :show-scroll-x=false class="message-videodialog">
      <div>
        <!-- 视频上传 -->
        <ElUpload name="file" class="avatar-uploader el-upload--text"
          :action="this.$api.core.sgUploadFile('message')"
          :show-file-list="false"
          accept=".mp4"
          :on-success="handleVideoSuccessVideoEdit"
          :before-upload="beforeUploadVideo">
          <video v-if="videoModel.content !=''"
             :src="videoModel.content"
             class="avatar video-avatar"
             controls="controls">您的浏览器不支持视频播放</video>
          <NsButton class="video-btn"
             slot="trigger"
             v-if="isShowUploadVideo"
             type="primary">选取文件</NsButton>
        </ElUpload>
        <P v-if="isShowUploadVideo"
           class="text">请保证视频格式正确，且不超过20M
        </P>
      </div>
    </ElDialog>
    <!-- 视频弹框 end -->

    <!-- 链接弹框 start -->
    <ElDialog
      width="600px"
      title="链接"
      :visible.sync="dialogVisibleWeb"
      :show-scroll-x=false>
      <div class="margin-lr-small">
        <ElForm>
          <ElFormItem>
            <div class="message-headling">网站地址：</div>
          </ElFormItem>
          <ElFormItem label="链接：" required label-width="100px">
            <el-form-grid size="xxmd">
              <el-form-item prop="sex">
                <el-radio-group v-model="presetLinkSwitch">
                  <el-radio :label="2">自定义链接</el-radio>
                  <el-radio :label="1">系统预置链接</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form-grid>
          </ElFormItem>
          <ElFormItem label="网页地址：" v-if="presetLinkSwitch===2" required  label-width="100px" >
            <ElInput
              type="text"
              placeholder="请输入网页"
              v-model="linkModel.url"
            />
          </ElFormItem>
          <ElFormItem label="" v-if="presetLinkSwitch===2" label-width="100px" >
            <ElFormGrid>
              <ns-button type="text" @click="insertPlaceHolderToWeb('{groupId}')"> &lt;集团ID&gt; </ns-button>
            </ElFormGrid>
            <ElFormGrid>
              <ns-button type="text" @click="insertPlaceHolderToWeb('{chatId}')"> &lt;好友微信ID&gt; </ns-button>
            </ElFormGrid>
            <ElFormGrid>
              <ns-button type="text" @click="insertPlaceHolderToWeb('{wxId}')"> &lt;导购微信ID&gt; </ns-button>
            </ElFormGrid>
          </ElFormItem>
          <ElFormItem label="选择链接：" v-if="presetLinkSwitch===1" required  label-width="100px" >
            <el-form-grid size="md">
              <el-select v-model="linkModel.selectIndex" placeholder="请选择" @change='systemPresetChange' clearable>
              <el-option v-for="item in presetLink"
                         :key="item.id"
                         :label="item.title"
                         :value="item.id">
              </el-option>
            </el-select>
            </el-form-grid>
          </ElFormItem>
          <ElFormItem>
            <div class="message-headling">网站展示：</div>
          </ElFormItem>
          <ElFormItem label="标题：" required label-width="100px" >
            <ElInput
              type="text"
              placeholder="请输入标题"
              v-model="linkModel.title"
            />
          </ElFormItem>
          <ElFormItem label="文案：" required  label-width="100px" >
            <ElInput
              type="text"
              placeholder="请输入文案"
              v-model="linkModel.description"
            />
          </ElFormItem>
          <ElFormItem label="封面图：" required  label-width="100px" >
            <ElUpload
              :action="this.$api.core.sgUploadFile('message')"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload" class="message-upload">
              <img v-if="imageUrl" :src="imageUrl" class="message-upload__avatar">
              <Icon type="plus" className="message-upload__tip" v-else/>
            </ElUpload>
          </ElFormItem>
        </ElForm>
      </div>
      <span slot="footer">
        <NsButton @click="dialogVisibleWeb = false">{{$t('operating.cancel')}}</NsButton>
        <NsSave @click="addWeb"/>
      </span>
    </ElDialog>
    <!-- 链接弹框 end -->

    <!-- 小程序弹框 start -->
    <ElDialog
      width="600px"
      title="小程序"
      :visible.sync="dialogVisibleApplet"
      :show-scroll-x=false>
      <div class="margin-lr-small">
        <ElForm>
          <ElFormItem>
            <div class="message-headling">跳转小程序：</div>
          </ElFormItem>
          <ElFormItem label="小程序原始Id：" required label-width="100px" >
            <ElInput
              type="text"
              placeholder="请输入小程序原始Id"
              v-model="appletModel.woaId"
            />
          </ElFormItem>
          <ElFormItem label="小程序appId：" required label-width="100px" >
            <ElInput
              type="text"
              placeholder="请输入appId"
              v-model="appletModel.weappid"
            />
          </ElFormItem>
          <ElFormItem label="小程序路径：" required  label-width="100px" >
            <ElInput
              type="text"
              placeholder="请输入路径"
              v-model="appletModel.page"
            />
          </ElFormItem>
          <ElFormItem>
            <div class="message-headling">小程序卡片展示：</div>
          </ElFormItem>
          <ElFormItem label="标题：" required label-width="100px" >
            <ElInput
              type="text"
              placeholder="请输入标题"
              v-model="appletModel.title"
            />
          </ElFormItem>
          <ElFormItem label="封面图：" required  label-width="100px" >
            <ElUpload
              :action="this.$api.core.sgUploadFile('message')"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload" class="message-upload">
              <img v-if="imageUrl" :src="imageUrl" class="message-upload__avatar">
              <Icon type="plus" className="message-upload__tip" v-else/>
            </ElUpload>
          </ElFormItem>
        </ElForm>
      </div>
      <span slot="footer">
        <NsButton @click="dialogVisibleApplet=false">{{$t('operating.cancel')}}</NsButton>
        <NsSave @click="addApplet"/>
      </span>
    </ElDialog>
    <!-- 小程序弹框 end -->
  </div>
</template>
<script>
import ElUpload from '@nascent/nui/lib/upload'
import ElImage from '@nascent/nui/lib/image'
import VEmojiPicker from 'v-emoji-picker'
import packData from './../json/emojis.json'
export default {
  components: {
    ElUpload,
    ElImage,
    VEmojiPicker
  },
  props: ['publishDataFather', 'presetLinkFather'],
  data () {
    return {
      // 是否可再添加消息
      disabled: false,
      // 表情包数据
      pack: packData,
      videoUploadPercent: '',
      isShowUploadVideo: false,
      // 操作
      tableButtons: [
        {
          'name': '编辑',
          'func': function (scope) {
            this.editModel(scope.row, scope.$index)
          }
        },
        {
          'name': '删除',
          'func': function (scope) {
            this.deleteModel(scope.row, scope.$index)
          }
        }
      ],
      index: null, // 编辑的列表位置
      presetLink: this.presetLinkFather, // 系统预制链接
      presetLinkSwitch: 2, // 系统预制链接开关
      // 链接弹框上传图片的路径
      imageUrl: '',
      // 视频弹框的视频地址
      videoUrl: '',
      // 发布内容数据
      publishData: this.publishDataFather,
      // 文字弹框是否打开判断值
      dialogVisibleText: false,
      // 图片弹框是否打开判断值
      dialogVisibleImage: false,
      // 视频弹框是否打开判断值
      dialogVisibleVideo: false,
      // 链接弹框是否打开判断值
      dialogVisibleWeb: false,
      // 小程序弹框是否打开判断值
      dialogVisibleApplet: false,
      textModel: {
        type: 'text',
        sleepTime: 1000, // 休眠时间  默认1200毫秒
        content: '' // 内容
      },
      imageModel: {
        type: 'image',
        sleepTime: 2000, // 休眠时间  默认1200毫秒
        content: '', // 主图cdn地址
        contentFilename: '', // 主图在手机上的名称
        face: '', // 缩略图cdn地址
        faceFilename: '' // 缩略图在手机上的名称
      },
      videoModel: {
        type: 'video',
        sleepTime: 2000, // 休眠时间  默认1200毫秒
        content: '', // 视频cdn地址
        contentFilename: '', // 视频在手机上的名称
        face: '', // 视频封面的cdn地址
        faceFilename: '' // 视频封面在手机上的名称
      },
      linkModel: {
        type: 'link',
        selectIndex: '', // 系统预制链接索引
        sleepTime: 2000, // 休眠时间  默认1200毫秒
        url: '', // 链接地址
        image: '', // 图片的cdn地址
        imageFilename: '', // 图片在手机上的名称
        title: '', // 链接标题
        description: '' // 链接描述
      },
      appletModel: {
        type: 'sendLittleProgram',
        title: '', // 标题
        weappid: '', // 小程序apid
        woaId: '', // 小程序原始id
        face: '', // 图片封面的cdn地址
        faceFilename: '', // 图片封面名称
        url: '', // 备用网页
        page: '' // 小程序路径
      }
    }
  },

  methods: {
    // 编辑模板
    editModel (object, i) {
      this.index = i
      if (object.type === 'text') {
        this.openText(object)
      } else if (object.type === 'image') {
        this.openImage(object)
      } else if (object.type === 'video') {
        this.openVideo(object)
      } else if (object.type === 'link') {
        this.openWeb(object)
      } else if (object.type === 'sendLittleProgram') {
        this.openApplet(object)
      }
    },
    // 删除模板
    deleteModel (object, i) {
      this.publishData.splice(i, 1)
    },
    // 添加文本 type=1
    addText () {
      if (this.indexExist()) {
        this.publishData[this.index].content = this.textModel.content
      } else {
        this.publishData.push(this.textModel)
      }
      this.dialogVisibleText = false
    },
    // 打开文本 type=1
    openText (object) {
      this.dialogVisibleText = true
      if (object === null) {
        this.index = null
        this.textModel.content = ''
      } else {
        this.textModel.content = object.content
      }
    },
    // 打开图片 type=2
    openImage (object) {
      this.dialogVisibleImage = true
      if (object === null) {
        this.index = null
        this.imageModel.content = ''
        this.imageModel.contentFilename = ''
        this.imageModel.face = ''
        this.imageModel.faceFilename = ''
      } else {
        this.imageModel.content = object.content
        this.imageModel.contentFilename = object.contentFilename
        this.imageModel.face = object.face
        this.imageModel.faceFilename = object.faceFilename
      }
    },
    // 打开视频 type=3
    openVideo (object) {
      this.dialogVisibleVideo = true
      if (object === null) {
        this.index = null
        this.videoModel.content = ''
        this.videoModel.contentFilename = ''
        this.videoModel.face = ''
        this.videoModel.faceFilename = ''
      } else {
        this.videoModel.content = object.content
        this.videoModel.contentFilename = object.contentFilename
        this.videoModel.face = object.face
        this.videoModel.faceFilename = object.faceFilename
      }
    },
    // 播放视频 type=3
    playVideo (object) {
      this.dialogVisibleVideo = true
      this.videoModel.content = object.content
    },
    // 打开链接 type=4
    openWeb (object) {
      this.dialogVisibleWeb = true
      if (object === null) {
        this.index = null
        this.linkModel.url = ''
        this.linkModel.image = ''
        this.linkModel.imageFilename = ''
        this.linkModel.title = ''
        this.linkModel.description = ''
        this.linkModel.selectIndex = ''
        this.imageUrl = ''
        this.presetLinkSwitch = 2
      } else {
        this.linkModel.url = object.url
        this.linkModel.image = object.image
        this.linkModel.imageFilename = object.imageFilename
        this.linkModel.title = object.title
        this.linkModel.description = object.description
        this.linkModel.selectIndex = object.selectIndex
        this.imageUrl = object.image
        if (object.selectIndex) {
          this.presetLinkSwitch = 1
        }
      }
    },
    // 添加链接 type=4
    addWeb () {
      if (this.indexExist()) {
        this.publishData[this.index].url = this.linkModel.url
        this.publishData[this.index].image = this.imageUrl
        this.publishData[this.index].imageFilename = this.matchUrl(this.imageUrl)
        this.publishData[this.index].title = this.linkModel.title
        this.publishData[this.index].description = this.linkModel.description
        this.publishData[this.index].selectIndex = this.linkModel.selectIndex
      } else {
        this.linkModel.image = this.imageUrl
        this.linkModel.imageFilename = this.matchUrl(this.imageUrl)
        this.publishData.push(this.linkModel)
      }
      this.dialogVisibleWeb = false
    },
    systemPresetChange (e) { // 首页，分类，我的页面选择是添加codeTargetName
      var _this = this
      this.presetLinkFather.forEach(function (value, i) {
        if (e === '') {
          _this.linkModel.url = ''
          return
        }
        if (value.id === e) {
          _this.linkModel.url = value.url + '&guideWechatNo={wxId}&wechatId={chatId}&source=3'
          _this.linkModel.image = value.picture
          _this.linkModel.imageFilename = _this.matchUrl(value.picture)
          _this.linkModel.title = value.title
          _this.linkModel.description = value.content
          _this.linkModel.selectIndex = e
          _this.imageUrl = value.picture
        }
      })
      this.$set(this.saveObj, 'codeTargetName', this.wechatPageUrlList[Number(e) - 1].codeTargetName)
    },
    // 打开小程序 type=5
    openApplet (object) {
      this.dialogVisibleApplet = true
      if (object === null) {
        this.index = null
        this.appletModel.weappid = ''
        this.appletModel.woaId = ''
        this.appletModel.face = ''
        this.appletModel.faceFilename = ''
        this.appletModel.url = ''
        this.appletModel.page = ''
        this.appletModel.title = ''
        this.imageUrl = ''
      } else {
        this.appletModel.weappid = object.weappid
        this.appletModel.woaId = object.woaId
        this.appletModel.face = object.face
        this.appletModel.faceFilename = object.faceFilename
        this.appletModel.url = object.url
        this.appletModel.page = object.page
        this.appletModel.title = object.title
        this.imageUrl = object.face
      }
    },
    // 添加小程序 type=5
    addApplet () {
      if (this.indexExist()) {
        this.publishData[this.index].weappid = this.appletModel.weappid
        this.publishData[this.index].woaId = this.appletModel.woaId
        this.publishData[this.index].face = this.imageUrl
        this.publishData[this.index].faceFilename = this.matchUrl(this.imageUrl)
        this.publishData[this.index].url = this.setAppletUrl(this.appletModel.weappid)
        this.publishData[this.index].page = this.appletModel.page
        this.publishData[this.index].title = this.appletModel.title
      } else {
        this.appletModel.face = this.imageUrl
        this.appletModel.faceFilename = this.matchUrl(this.imageUrl)
        this.appletModel.url = this.setAppletUrl(this.appletModel.weappid)
        this.publishData.push(this.appletModel)
      }
      this.dialogVisibleApplet = false
    },
    // 设置小程序备份url路径
    setAppletUrl (appId) {
      return 'https://mp.weixin.qq.com/mp/waerrpage?appid=' +
        appId + '&type=upgrade&upgradetype=3#wechat_redirect'
    },
    // 表情引入
    selectEmoji (emoji) {
      if (this.textModel.content === undefined) {
        this.textModel.content = ''
      }
      this.textModel.content += emoji.emoji
    },
    // 为text文本插入预留字段
    insertPlaceHolderToText (append) {
      if (this.textModel.content === undefined) {
        this.textModel.content = ''
      }
      this.textModel.content += append
    },
    // 为链接插入预留字段
    insertPlaceHolderToWeb (append) {
      if (this.linkModel.url === undefined) {
        this.linkModel.url = ''
      }
      this.linkModel.url += append
    },
    // 视频上传是否成功事件(视频组件保存专用)
    handleVideoSuccessVideoSave (res, file) {
      let name = this.matchUrl(res.result.url)
      this.videoModel.content = res.result.url
      this.videoModel.contentFilename = name
      this.videoModel.face = this.maxVideo(res.result.url)
      this.videoModel.faceFilename = 'min' + name
      this.publishData.push(this.videoModel)
    },
    // 视频上传是否成功事件(视频组件编辑专用)
    handleVideoSuccessVideoEdit (res, file) {
      let name = this.matchUrl(res.result.url)
      this.publishData[this.index].content = res.result.url
      this.publishData[this.index].contentFilename = name
      this.publishData[this.index].face = this.maxVideo(res.result.url)
      this.publishData[this.index].faceFilename = 'min' + name
      this.dialogVisibleVideo = false
    },
    // 验证视频格式和视频大小
    beforeUploadVideo (file) {
      const isLt30M = file.size / 1024 / 1024 < 30
      if (['video/mp4'].indexOf(file.type) === -1) {
        this.$message.error('请上传正确的视频格式')
        return false
      }
      if (!isLt30M) {
        this.$message.error('上传视频大小不能超过30MB哦!')
        return false
      }
      this.isShowUploadVideo = false
    },
    // 上传图片是否成功事件
    handleAvatarSuccess (res, file) {
      this.imageUrl = res.result.url
    },
    // 上传图片是否成功事件(图片组件保存专用)
    handleAvatarSuccessImageSave (res, file) {
      let name = this.matchUrl(res.result.url)
      this.imageModel.content = res.result.url
      this.imageModel.contentFilename = name
      this.imageModel.face = this.minImage(res.result.url)
      this.imageModel.faceFilename = 'min' + name
      this.publishData.push(this.imageModel)
    },
    // 上传图片是否成功事件(图片组件编辑专用)
    handleAvatarSuccessImageEdit (res, file) {
      let name = this.matchUrl(res.result.url)
      this.publishData[this.index].content = res.result.url
      this.publishData[this.index].contentFilename = name
      this.publishData[this.index].face = this.minImage(res.result.url)
      this.publishData[this.index].faceFilename = 'min' + name
      this.dialogVisibleImage = false
    },
    // 小图
    minImage (url) {
      return url + '?x-oss-process=image/resize,l_200'
    },
    // 视频图片
    maxVideo (url) {
      return url + '?x-oss-process=video/snapshot,t_0,m_fast'
    },
    // 截取url地址后部名称
    matchUrl (url) {
      return url.match('[^\\/\\\\]+$') + ''
    },
    // 上传图片的类型和大小判断事件
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20MB!')
      }
      return isJPG && isLt2M
    },
    // 验证index是否存在
    indexExist () {
      if (this.index || this.index === 0) {
        return true
      }
      return false
    },
    // 向上移
    zIndexUp (index) {
      if (index === 0) {
        return
      }
      var a = this.publishData[index]
      this.publishData.splice(index, 1)
      this.publishData.splice(index - 1, 0, a)
    },
    // 向下移
    zIndexDown (index) {
      if ((index + 1) === this.publishData.length) {
        return
      }
      var a = this.publishData[index]
      this.publishData.splice(index, 1)
      this.publishData.splice(index + 1, 0, a)
    },
    // 置顶
    zIndexTop (index) {
      if (index === 0) {
        return
      }
      var a = this.publishData[index]
      this.publishData.splice(index, 1)
      this.publishData.unshift(a)
    },
    // 置底
    zIndexBottom (index) {
      if ((index + 1) === this.publishData.length) {
        return
      }
      var a = this.publishData[index]
      this.publishData.splice(index, 1)
      this.publishData.push(a)
    }
  },
  watch: {
    publishData () {
      this.publishData = this.publishDataFather
      if (this.publishData.length === 10) {
        this.disabled = true
      } else {
        this.disabled = false
      }
    }
  },
  mounted () {
    this.publishData = this.publishDataFather
    if (this.publishData.length === 10) {
      this.disabled = true
    } else {
      this.disabled = false
    }
  }
}
</script>

<style scoped>
  @import "@theme/variables.pcss";

  /* 视频样式设置 start */
  .avatar-uploader {
    line-height: 0;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed var(--theme-base-border-color-primary);
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: var(--theme-color-primary-light);
  }
  .avatar-uploader-icon {
    font-size: 20px;
    color: var(--theme-color-white);
  }
  .avatar {
    width: 400px;
    height: 250px;
    display: block;
  }
  .video-avatar {
    width: 400px;
    height: 250px;
    border-radius: 4px;
  }
  /* 视频样式设置 end */

  @component-namespace message {
    @b detail {
      padding: 20px 20px 0;
      margin-bottom: 20px;
      border: 1px dashed var(--theme-base-border-color-primary);
      border-radius: 6px;
      @e btn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        >>> .el-tag {
          cursor: text;
        }
      }
      @e table {
        margin-top: var(--default-margin-larger);
      }
      >>> .ElImage {
        background-color: unset;
      }
    }
    @b item {
      display: flex;
      align-items: center;
      @m title {
        line-height: 18px;
      }
      @m image {
        margin: 7px 0;
      }
      @m add {
        line-height: 60px;
        height: 60px;
      }
      @m opposite {
        width: 76px;
        height: 46px;
        position: relative;
      }
      @e broadcast {
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: 8px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, .4);
        border-radius: 50%;
      }
    }
    @b circle {
      width: 0;
      height: 0;
      border-width: 4px;
      border-style: solid;
      border-color: transparent transparent transparent var(--theme-color-white);
    }
    @b prompt {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: var(--default-margin-larger) 0;
      @e mass {
        text-align: center;
        padding: var(--default-padding-larger) 25px;
        cursor: pointer;
        border-right: 1px solid var(--theme-base-border-color-primary);
      &:hover {
        .message-hovericolor {
          color: var(--theme-color-primary);
        }
      }
    &:last-child {
       border-right: 0;
     }
      @m topspace {
        margin-top: var(--default-margin-small);
      }
    }
    >>> .el-popover {
      padding: 0;
    }
  }
  @b headling {
    font-weight: bold;
    padding: 0 var(--default-padding-larger);
    background: var(--theme-bg-color-base);
    border-radius: var(--default-radius-mini);
  }
  @b upload {
    >>> .el-upload {
      width: 100px;
      height: 100px;
      position: relative;
      border: 1px solid var(--theme-base-border-color-primary);
      border-radius: var(--default-radius-mini);
  &:hover {
     border-color: var(--theme-color-primary-light);
   }
  }
  @e tip {
    font-size: var(--default-font-size-large);
    color: var(--theme-base-border-color-primary);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  @e avatar {
    width: 100px;
    height: 100px;
    position: relative;
    top: -1px;
    left: -1px;
  }
  }
  @b videodialog {
    >>>> .el-dialog__headerbtn {
      display: none;
    }
    >>> .el-dialog__body {
      padding: 20px 0 0 0;
    }
  }
  @b spacelarger {
    margin-top: var(--default-margin-larger);
  }
  }
</style>
