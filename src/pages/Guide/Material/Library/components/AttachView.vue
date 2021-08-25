<template>
  <div>
    <div class="tip-text">
      <div class="tip-reminder"></div>
      视频限制最大10MB，支持MP4格式；图片最大2MB，支持PNG、JPG格式；最多可添加9个附件
    </div>
    <div class="attach-list">
      <div v-for="(item, index) in lists" :key="index">
        <div class="list-base">
          <div class="list-left">
            <div class="attach-name">
              <Icon type="tupianbeifen-5" class="attach-icon"></Icon>
              文件名称XXXXXXXX.jpg
            </div>
            <div class="sort-view" v-if="index > 0 && index !== lists.length - 1">
              <Icon type="zhiding" class="sort-icon" @click="toTop" />
              <Icon type="top-arr" class="sort-icon" @click="toTopOne" />
              <Icon type="down-arr" class="sort-icon" @click="toNextOne" />
              <Icon type="zhidi" class="sort-icon" @click="toBottom" />
            </div>
            <div v-if="index === 0" class="sort-view-end">
              <Icon type="down-arr" class="sort-icon" @click="toNextOne" />
              <Icon type="zhidi" class="sort-icon" @click="toBottom" />
            </div>
            <div v-if="index === lists.length - 1" class="sort-view">
              <Icon type="zhiding" class="sort-icon" @click="toTop" />
              <Icon type="top-arr" class="sort-icon" @click="toTopOne" />
            </div>
          </div>
          <div>
            <span class="edit-text">编辑</span>
            <span class="edit-text">删除</span>
          </div>
        </div>
      </div>
    </div>
    <el-popover placement="top-start" width="400" trigger="hover" ref="popoverView">
      <div class="library-popover">
        <div class="popover-base" @click="addCustomImg">
          <Icon type="ns-edit" class="popover-icon"></Icon>
          <span class="popver-text">自建坑位</span>
        </div>
        <div>
          <el-upload
            ref="imageListUpload"
            class="library-uploader"
            :action="this.$api.core.sgUploadFile('image')"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeGuideUpload"
            accept=".jpg,.jpeg,.png"
            list-type="picture-card"
            multiple
          >
            <div class="popover-base">
              <Icon type="tupianbeifen-5" class="popover-icon"></Icon>
              <span class="popver-text">图片</span>
            </div>
          </el-upload>
        </div>
        <div class="popover-base" @click="addCustomImg">
          <Icon type="shipinbeifen-4" class="popover-icon"></Icon>
          <span class="popver-text">视频</span>
        </div>
        <div class="popover-base" @click="addCustomImg">
          <Icon type="lianjiebeifen-4" class="popover-icon"></Icon>
          <span class="popver-text">链接</span>
        </div>
        <div class="popover-base" @click="addCustomImg">
          <Icon type="xiaochengxushouquan" class="popover-icon"></Icon>
          <span class="popver-text">小程序</span>
        </div>
      </div>
      <div class="addAttach" slot="reference"><Icon type="ns-add-border" style="margin-right:5px" />添加消息内容</div>
    </el-popover>
  </div>
</template>

<script>
import ElUpload from '@nascent/nui/lib/upload'
export default {
  name: 'attachView',
  components: {
    ElUpload
  },
  data () {
    return {
      lists: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
  },
  methods: {
    addCustomImg () {},
    handleAvatarSuccess () {},
    beforeGuideUpload () {},
    toTop () {},
    toBottom () {},
    toTopOne () {},
    toNextOne () {}
  }
}
</script>

<style scoped>
@import '../styles/attach.css';
</style>
