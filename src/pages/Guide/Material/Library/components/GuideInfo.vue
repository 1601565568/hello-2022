<template>
  <div>
    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      size="720px"
      :with-header="false"
      :modal="false"
      @close="handleClose"
    >
      <div>
        <div class="close-view">
          <Icon type="close" class="close-icon" @click="closeDeawer" />
        </div>
        <div class="drawer-title">拍摄指南</div>
        <div v-if="info.content">
          <div v-if="info.content.pitText">
            <div class="drawer-sub-title">坑位拍摄指南</div>
            <div class="drawer-sub-cont" v-html="strToRichText(info.content.pitText)"></div>
          </div>
          <div class="drawer-sub-title" v-if="info.content.pitUrl">示意图</div>
          <img class="drawer-sub-img" :src="info.content.pitUrl + '?x-oss-process=image/resize,m_mfit,h_200,w_200'" v-if="info.content.pitUrl"  @click="showPreview(info.content.pitUrl)"/>
        </div>
        <div v-else class="noddata-view">
          <img :src="noDataUrl" class="nodata-img" />
          <div class="nodata-text">暂无指南～</div>
        </div>
      </div>
    </el-drawer>
    <preview ref="preview"></preview>
  </div>
</template>
<script>
import ElDrawer from '@nascent/nui/lib/drawer'
import Preview from '@/components/NsPreview'
export default {
  name: 'guideInfo',
  components: { ElDrawer, Preview },
  props: {
    info: {
      type: Object,
      default () {
        return {
          content: {}
        }
      }
    }
  },
  data () {
    return {
      direction: 'rtl',
      drawer: false,
      noDataUrl:
        'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/image/material-nodata.png'
    }
  },
  methods: {
    showPreview (url) {
      let imgs = [url]
      this.$refs.preview.toggleShow(0, imgs, 'img')
    },
    closeDeawer () {
      this.drawer = !this.drawer
    },
    handleClose () {
      this.drawer = false
    },
    strToRichText (text) {
      const preRegexp = new RegExp('\\{' + 'EMOJI_' + '\\[', 'g')
      const afterRegexp = new RegExp(']}', 'g')
      const str = text
        .replace(
          preRegexp,
          '<img src="https://kedaocdn.oss-cn-zhangjiakou.aliyuncs.com/ecrm/wxemoji/v1/'
        )
        .replace(afterRegexp, '.png"/>')
        .replace(/\n/g, '<br/>')
      return str
    }
  }
}
</script>
<style scoped>
.drawer-title {
  height: 53px;
  font-size: 16px;
  color: #262626;
  line-height: 53px;
  padding-left: 16px;
  font-weight: 500;
}
.drawer-sub-title {
  font-size: 14px;
  color: #303133;
  line-height: 55px;
  font-weight: 500;
  padding-left: 32px;
  height: 55px;
}
.drawer-sub-cont {
  font-size: 14px;
  color: #606266;
  line-height: 24px;
  font-weight: 400;
  margin-left: 32px;
  margin-right: 32px;
  padding-bottom: 33px;
  border-bottom: 1px solid #e8e8e8;
  max-height: 350px;
  overflow: auto;
  word-break: break-all;
  word-wrap: break-word;
}
.drawer-sub-cont::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.drawer-sub-cont::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #9093994d;
}
.drawer-sub-img {
  width: 375px;
  height: 257px;
  border-radius: 2px;
  margin-left: 32px;
  object-fit: contain;
}
.close-view {
  height: 49px;
  display: flex;
  align-items: center;
}
.close-icon {
  margin-left: 16px;
  width: 20px;
  height: 20px;
}

.noddata-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 126px;
}
.nodata-img {
  width: 220px;
  height: 220px;
}
.nodata-text {
  font-size: 14px;
  color: #8c8c8c;
  text-align: center;
  line-height: 22px;
  font-weight: 400;
  margin-top: 40px;
}
</style>
