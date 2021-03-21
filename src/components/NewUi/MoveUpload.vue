<template>
  <div class='move-content'>
    <draggable v-model="list" animation="300"  filter=".forbid">
      <transition-group>
        <!-- 图片 start -->
        <template v-if='type==="img"'>
          <template v-for="(item, index) in list">
            <div :key='index' class="img-content">
              <template v-if='item.url'>
                <img :src='item.url'>
              </template>
              <template v-else>
                <div class='loading-box'>
                  上传中...
                </div>
              </template>
              <div class='delect-box'>
                <Icon type='ns-delete' class='delete-icon' @click='handleDelete(index)'/>
              </div>
            </div>
          </template>
        </template>
        <!-- 图片 end -->
        <!-- 视频 start -->
        <template v-else-if='type==="video" && list[0]'>
          <div class="img-content video-content" key='0'>
            <template v-if='list[0].url'>
              <video :src="list[0].url" id='upvideo'>您的浏览器暂不支持播放该视频，请升级至最新版浏览器。</video>
              <div class='delect-box'>
                <Icon type='ns-delete' class='delete-icon' @click='handleDelete(0)'/>
              </div>
            </template>
            <template v-else>
                <div class='loading-box'>
                  上传中...
                </div>
              </template>
          </div>
        </template>
        <!-- 视频 end -->
        <div :key='-1' class="img-content forbid" v-if='isShowAddBtn'>
          <Icon type='icon-ns-succeed-add' class='add-icon'/>
          <ElUpload accept=".jpg,.jpeg,.png,.mp4" :show-file-list='false' :action="$api.core.sgUploadFile('test')" :on-success="handleUploadSuccess" :before-upload="beforeUpload"/>
        </div>
      </transition-group>
    </draggable>
  </div>
</template>
<script>
import ElUpload from '@nascent/nui/lib/upload'
import draggable from 'vuedraggable'
export default {
  data () {
    return {
      list: [...this.value],
      type: '', // 第一次上传的是图片还是视频  img : 图片 video : 视频
      videoType: ['MP4'],
      imgType: ['JPG', 'PNG', 'JPEG'],
      imgSize: 1, // 图片最大1m
      videoSize: 20, // 视频最大20m
      imgMax: 9, // 图片最多久张
      videoMax: 1 // 视频最多一个
    }
  },
  props: {
    value: {
      default: []
    }
  },
  computed: {
    // 是否展示添加按钮
    isShowAddBtn () {
      if (!this.type) {
        return true
      }
      return this.list.length < this[this.type + 'Max']
    }
  },
  components: { draggable, ElUpload },
  methods: {
    /**
     * 获取type
     */
    getType () {
      return this.type
    },
    /**
     * 生产视频封面
     */
    findvideocover (src) {
      return new Promise((resolve) => {
        this.$nextTick(() => {
          const video = document.getElementById('upvideo')
          // const source = document.createElement('source')
          // // source.src = require("../../assets/5b086751dbb7af1ea8fa8d05e66fe5c3.mp4");this.formLabelAlign.video
          // source.src = src
          // source.type = 'video/mp4'
          // video.appendChild(source)
          video.addEventListener('loadeddata', function () {
            const canvas = document.createElement('canvas')
            canvas.width = '320'
            canvas.height = '320'
            canvas
              .getContext('2d')
              .drawImage(video, 0, 0, canvas.width, canvas.width)
            const img = document.createElement('img')
            const imgsrc = canvas.toDataURL('image/png')
            resolve(imgsrc)
          })
        })
      })
    },
    async handleUploadSuccess (res) {
      if (this.type === 'img') {
        const index = this.list.findIndex(item => item.key === decodeURIComponent(res.result.originalFileName))
        if (index > -1) {
          this.list[index].url = res.result.url
          this.$emit('input', { type: 'img', list: this.list.map(item => item.url) })
        }
      } else {
        if (this.list && this.list.length) {
          this.list = [{ url: res.result.url }]
          this.$emit('input', { type: 'video', list: this.list.map(item => item.url) })
          await this.findvideocover(res.result.url)
        }
      }
    },
    beforeUpload (file) {
      const { name = '' } = file
      const toUpperCaseName = name.split('.')[name.split('.').length - 1].toUpperCase()
      const type = this.videoType.includes(toUpperCaseName) ? 'video' : this.imgType.includes(toUpperCaseName) ? 'img' : ''
      if (!type) {
        this.$notify.error(`仅支持${this.imgType.join('/')}/${this.videoType.join('/')}的格式`)
        return false
      }
      if (this.type && this.type !== type) {
        this.$notify.error(`仅支持上传同类型文件`)
        return false
      }
      if (file.size / 1024 / 1024 > this[type + 'Size']) {
        this.$notify.error(`上传文件不能超过${this[type + 'Size']}M`)
        return false
      }
      this.type = type
      this.list.push({
        key: name,
        url: ''
      })
    },
    handleDelete (index) {
      this.list.splice(index, 1)
      this.$emit('input', this.list.map(item => item.url))
      if (this.list.length === 0) {
        this.type = ''
      }
    }
  },
  watch: {
    value (newVal) {
      this.list = newVal.map(url => ({
        key: null,
        url
      }))
    }
  }
}
</script>
<style lang="scss" scoped>
.move-content {
  width: 210px
}
.img-content {
  height: 60px;
  width: 60px;
  margin-right: 8px;
  margin-bottom: 8px;
  border-radius: 2px;
  float: left;
  cursor: move;
  position: relative;
  &.video-content {
    height:120px;
    width: 240px;
    display: flex;
    background-color: #d8d8d8;
    video {
      width: 100%;
      height:100%;
    }
  }
  .loading-box {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    background-color: #d8d8d8;
    border-radius: 2px;
  }
  .add-icon {
    font-size: 16px;
    color: #262626;
  }
  img {
    width:100%;
    height:100%;
  }
  &.forbid {
    background: #FFFFFF;
    border: 1px dashed #D9D9D9;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .delect-box {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0,0,0,0.45);
    border-radius: 2px;
    justify-content: center;
    align-items: center;
    .delete-icon {
      color: #fff;
      cursor: pointer;
      font-size: 16px;
    }
  }
  &:hover .delect-box{
    display: flex;
  }
}
</style>
<style scoped>
.forbid >>> .el-upload {
    width: 60px;
    height: 60px;
    position: absolute;
    top: 0;
    left: 0;
}

</style>
