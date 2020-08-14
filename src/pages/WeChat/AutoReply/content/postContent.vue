<template>
  <div>
    <div class="message-detail">
      <ElTable :data="publishData" class="message-detail__table">
        <ElTableColumn label="基础信息">
          <template slot-scope="scope">
            <!-- type=1 文本 -->
            <div v-if="scope.row.type === 'text'" class="message-item message-item--title"><span :title="scope.row.content">{{scope.row.content.substring(0,24) + '...'}}</span></div>
            <!-- type=2 图片 -->
            <div v-if="scope.row.type === 'image'" class="message-item message-item--title">
              <ElImage
                :height="46"
                :width="76"
                mode="mfit"
                :src="scope.row.content"
                :preview-src-list="scope.row.content.split(';')"/>
            </div>
            <!-- type=3 视频 -->
            <div v-if="scope.row.type === 'video'" @click="playVideo(scope.row)" style="cursor:pointer" class="message-item message-item--opposite">
              <ElImage
                :height="46"
                :width="76"
                mode="mfit"
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
        <ElTableColumn label="操作" align="center" :width="120">
          <template slot-scope="scope">
            <template v-if="scope.row.type == 'image'" style="display: inline-block;">
              <ElUpload
                :action="uploadPicUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccessImageEdit"
                :before-upload="beforeAvatarUpload" style="display: inline-block;">
                <ns-button type="text" size="small" style="margin-right: 5px"
                           @click="setIndex(scope.$index)">编辑</ns-button>
              </ElUpload>
            </template>
            <template v-else-if="scope.row.type == 'video'" style="display: inline-block;">
              <ElUpload name="file"
                        :action="uploadPicUrl"
                        :show-file-list="false"
                        accept=".mp4"
                        :on-success="handleVideoSuccessVideoEdit"
                        :before-upload="beforeUploadVideo" style="display: inline-block;">
                <ns-button type="text" size="small" style="margin-right: 5px"
                           @click="setIndex(scope.$index)">编辑</ns-button>
              </ElUpload>
            </template>
            <template v-else>
              <ns-button type="text" size="small"
                         @click="editModel(scope.row, scope.$index)">编辑</ns-button>
            </template>
            <template>
              <ns-button type="text" size="small"
                         @click="deleteModel(scope.row, scope.$index)">删除</ns-button>
            </template>
          </template>
        </ElTableColumn>
      </ElTable>
      <div class="message-item message-item--add">
        <ElPopover v-if="!disabled" trigger="hover">
          <div class="message-prompt">
            <div class="message-prompt__mass" @click="openText(null)">
              <Icon type="file-text" className="font-size-xlarge cursor-pointer message-hovericolor"/>
              <div class="message-prompt__mass--topspace cursor-pointer message-hovericolor">文字</div>
            </div>
            <div class="message-prompt__mass">
              <ElUpload
                :action="uploadPicUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccessImageSave"
                :before-upload="beforeAvatarUpload">
                <Icon type="picture" className="font-size-xlarge cursor-pointer message-hovericolor"/>
                <div class="message-prompt__mass--topspace cursor-pointer message-hovericolor">图片</div>
              </ElUpload>
            </div>
            <div class="message-prompt__mass">
              <ElUpload name="file"
                        :action="uploadPicUrl"
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
          <NsButton type="text" slot="reference"><Icon type="plus" />添加消息内容</NsButton>
        </ElPopover>
        <span class="text-secondary left-space">
          最多添加10条消息；上传视频限制大小30M，格式为MP4。
        </span>
      </div>
    </div>

    <!-- 文字弹框 start -->
    <textDialog @addText="addText" @close="close" :dialogVisibleText="dialogVisibleText" :textModel="textModel"/>
    <!-- 文字弹框 end -->

    <!-- 图片弹框 start -->
    <imageDialog @handleAvatarSuccessImageEdit="handleAvatarSuccessImageEdit"  @close="close" :dialogVisibleImage="dialogVisibleImage" :imageModel="imageModel"/>
    <!-- 图片弹框 end -->

    <!-- 视频弹框 start -->
    <videoDialog @handleVideoSuccessVideoEdit="handleAvatarSuccessImageEdit"  @close="close" :dialogVisibleVideo="dialogVisibleVideo" :videoModel="videoModel"/>
    <!-- 视频弹框 end -->

    <!-- 链接弹框 start -->
    <linkDialog ref="linkDialog" @addWeb="addWeb"  @close="close" :presetLink="presetLink" :dialogVisibleWeb="dialogVisibleWeb" :linkModel="linkModel"/>
    <!-- 链接弹框 end -->

    <!-- 小程序弹框 start -->
    <appletDialog @addApplet="addApplet"  @close="close" :dialogVisibleApplet="dialogVisibleApplet" :appletModel="appletModel"/>
    <!-- 小程序弹框 end -->
  </div>
</template>
<script>
import ElUpload from '@nascent/nui/lib/upload'
import ElImage from '@nascent/nui/lib/image'
import textDialog from '../dialog/text'
import imageDialog from '../dialog/image'
import videoDialog from '../dialog/video'
import linkDialog from '../dialog/link'
import appletDialog from '../dialog/applet'
export default {
  components: {
    ElUpload,
    ElImage,
    textDialog,
    imageDialog,
    videoDialog,
    linkDialog,
    appletDialog
  },
  props: ['publishDataFather', 'presetLinkFather'],
  data () {
    return {
      // 文件下载地址
      uploadPicUrl: this.$api.core.sgUploadFile('message'),
      // 是否可再添加消息
      disabled: false,
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
        linkSwitch: 2,
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
    // 编辑模板
    setIndex (index) {
      this.index = index
    },
    // 关闭编辑模板
    close (type) {
      if (type === 'text') {
        this.dialogVisibleText = false
      } else if (type === 'image') {
        this.dialogVisibleImage = false
      } else if (type === 'video') {
        this.dialogVisibleVideo = false
      } else if (type === 'link') {
        this.dialogVisibleWeb = false
      } else if (type === 'sendLittleProgram') {
        this.dialogVisibleApplet = false
      }
    },
    // 删除模板
    deleteModel (object, i) {
      this.publishData.splice(i, 1)
    },
    // 添加文本 type=1
    addText (model) {
      if (this.indexExist()) {
        this.publishData[this.index].content = model.content
      } else {
        var textModel = {}
        textModel.type = 'text'
        textModel.sleepTime = 1000
        textModel.content = model.content
        this.publishData.push(textModel)
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
    // 保存图片(图片组件保存专用)
    handleAvatarSuccessImageSave (res, file) {
      let name = this.matchUrl(res.result.url)
      var imageModel = {}
      imageModel.type = 'image'
      imageModel.sleepTime = 2000
      imageModel.content = res.result.url
      imageModel.contentFilename = name
      imageModel.face = this.minImage(res.result.url)
      imageModel.faceFilename = 'min' + name
      this.publishData.push(imageModel)
    },
    // 修改图片(图片组件编辑专用)
    handleAvatarSuccessImageEdit (res, file) {
      let url = res.result.url
      let name = this.matchUrl(url)
      this.publishData[this.index].content = url
      this.publishData[this.index].contentFilename = name
      this.publishData[this.index].face = this.minImage(url)
      this.publishData[this.index].faceFilename = 'min' + name
      this.dialogVisibleImage = false
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
    // 视频上传是否成功事件(视频组件保存专用)
    handleVideoSuccessVideoSave (res, file) {
      var videoModel = {}
      videoModel.type = 'video'
      videoModel.sleepTime = 2000
      let name = this.matchUrl(res.result.url)
      videoModel.content = res.result.url
      videoModel.contentFilename = name
      videoModel.face = this.maxVideo(res.result.url)
      videoModel.faceFilename = 'min' + name
      this.publishData.push(videoModel)
    },
    // 视频上传是否成功事件(视频组件编辑专用)
    handleVideoSuccessVideoEdit (res, file) {
      let url = res.result.url
      let name = this.matchUrl(url)
      this.publishData[this.index].content = url
      this.publishData[this.index].contentFilename = name
      this.publishData[this.index].face = this.maxVideo(url)
      this.publishData[this.index].faceFilename = 'min' + name
      this.dialogVisibleVideo = false
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
        this.linkModel.linkSwitch = 2
      } else {
        this.linkModel.url = object.url
        this.linkModel.image = object.image
        this.linkModel.imageFilename = object.imageFilename
        this.linkModel.title = object.title
        this.linkModel.description = object.description
        this.linkModel.selectIndex = object.selectIndex
        this.linkModel.linkSwitch = object.linkSwitch
      }
      this.$refs.linkDialog.initRadio(this.linkModel.linkSwitch)
    },
    // 添加链接 type=4
    addWeb (model) {
      if (this.indexExist()) {
        this.publishData[this.index].url = model.url
        this.publishData[this.index].image = model.image
        this.publishData[this.index].imageFilename = this.matchUrl(model.image)
        this.publishData[this.index].title = model.title
        this.publishData[this.index].description = model.description
        this.publishData[this.index].selectIndex = model.selectIndex
        this.publishData[this.index].linkSwitch = model.linkSwitch
      } else {
        var linkModel = {}
        linkModel.type = 'link'
        linkModel.sleepTime = 2000
        linkModel.url = model.url
        linkModel.image = model.image
        linkModel.imageFilename = this.matchUrl(model.image)
        linkModel.title = model.title
        linkModel.description = model.description
        linkModel.selectIndex = model.selectIndex
        linkModel.linkSwitch = model.linkSwitch
        this.publishData.push(linkModel)
      }
      this.dialogVisibleWeb = false
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
    addApplet (model) {
      if (this.indexExist()) {
        this.publishData[this.index].weappid = model.weappid
        this.publishData[this.index].woaId = model.woaId
        this.publishData[this.index].face = model.face
        this.publishData[this.index].faceFilename = this.matchUrl(model.face)
        this.publishData[this.index].url = this.setAppletUrl(model.weappid)
        this.publishData[this.index].page = model.page
        this.publishData[this.index].title = model.title
      } else {
        var appletModel = {}
        appletModel.type = 'sendLittleProgram'
        appletModel.weappid = model.weappid
        appletModel.woaId = model.woaId
        appletModel.face = model.face
        appletModel.faceFilename = this.matchUrl(model.face)
        appletModel.url = this.setAppletUrl(model.weappid)
        appletModel.page = model.page
        appletModel.title = model.title
        this.publishData.push(appletModel)
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
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG|PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
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
      >>> .el-image-viewer__close {
        color: var(--theme-color-white);
      }
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
  .left-space {
    margin-left: var(--default-margin-small);
  }
</style>
