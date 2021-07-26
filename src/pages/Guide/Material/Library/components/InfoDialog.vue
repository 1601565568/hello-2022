<template>
  <div class="cus-guide-info">
    <el-dialog title="自创明细查看" :visible.sync="dialogVisible" width="658px">
      <div class="dialog-view">
        <div class="guide-info">
          <span class="right">{{ metailInfo.shopName }}</span>
          <span class="right">{{ metailInfo.guideName }}</span>
          <span>{{ metailInfo.completionTime }}</span>
        </div>
        <div class="content-view" v-html="strToRichText(metailInfo.content)"></div>
        <!-- <div class="images-view">
          <div v-for="(item, index) in metailInfo.mediaList" :key="index">
            <img class="base-one" :src="item.url" @click="showPreview(index)" />
          </div>
        </div> -->
        <div class="u_main">
          <div class="u_box" v-for="(item, index) in metailInfo.mediaList" :key="index" :class="{'t_box': item.type !== 0 && item.type !== 1}">
            <div class="u_imgList" v-if="item.type === 0">
              <img v-if="item.type == 1" :src='(item.content.pitUrl || item.content.image) || defaultImgUrl'
              @click="showPreview(index, item, metailInfo)" alt="">
              <img v-else :src="defaultImgUrl" alt="">
            </div>
            <div v-if="item.type === 2" class="u_videoList">
              <div>
                <video :src="item.content.video"></video>
              </div>
              <div
                class="video-mask"
                @click="showPreview(index, item, metailInfo)"
              >
                <div class="video-wrapper">
                  <Icon type="begin" />
                </div>
              </div>
            </div>
            <div v-if="item.type === 3" class="u_linkList">
              <div class="u_t">{{item.content.title}}</div>
              <div class="u_desc">{{item.content.desc}}</div>
              <img class="u_link_img" :src='item.content.image || linkImage' alt="">
              <div class="u_line"></div>
            </div>
            <div v-if="item.type === 4" class="u_appList">
              <!-- <div class="u_t">{{item.content.title}}</div>
              <Icon type="xiaochengxushouquan" className="icon"/>
              <div class="u_desc">{{item.content.desc}}</div>
              <img class="u_link_img" :src='item.content.image || defaultImgUrl' alt="">
              <div class="u_line"></div> -->
              <div class="u_app_title">
                <span class="v1"></span>
                <span class="v2">小程序名称</span>
              </div>
              <div class="u_content">{{item.content.title}}</div>
              <img class="u_app_img" :src='item.content.image' alt="">
              <div class="u_line"></div>
              <div class="u_bottom"><Icon class="icon" type="xiaochengxushouquan" className="icon"/>小程序</div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <preview ref="preview"></preview>
  </div>
</template>

<script>
import linkImage from '@/assets/linkImage.png'
import Preview from '@/components/NsPreview'
export default {
  components: { Preview },
  name: 'infoDialog',
  props: {
    metailInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      linkImage: linkImage,
      dialogVisible: false,
      defaultImgUrl: 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/image/material/custom-edit.png'
    }
  },
  methods: {
    showPreview (current, row, data) {
      let type = +row.type === 2 ? 'video' : 'img'
      let item = data.mediaList[current]
      let imgs = []
      let videoList = []
      data.mediaList.forEach(item => {
        if (item.type === 2) {
          videoList.push(item.content.video)
        } else if (item.type === 1) {
          imgs.push(item.content.image)
        }
      })
      if (row.type === 2) {
        this.$refs.preview.toggleShow(0, videoList.filter(item => item !== ''), type)
      } else {
        this.$refs.preview.toggleShow(0, imgs.filter(item => item !== ''), type)
      }
    },
    showDialog () {
      this.dialogVisible = true
    },
    strToRichText (text) {
      if (!text) {
        return ''
      }
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
<style lang="scss" scoped>
@import '../styles/image.css';
.dialog-view {
  padding: 8px;
}
.guide-info {
  font-size: 14px;
  color: #262626;
  line-height: 44px;
  font-weight: 400;
  .right {
    margin-right: 32px;
  }
}
.content-view {
  font-size: 14px;
  color: #595959;
  line-height: 22px;
  font-weight: 400;
  margin-bottom: 16px;
  margin-top: 16px;
}
.u_main{
    .u_box{
      display: inline-block;
      vertical-align: top;
    }
    .t_box{
      display: block;
    }
    .u_imgList, .u_videoList{
      display: inline-block;
      border-radius: 4px;
      margin-bottom: 12px;
      width: 82px;
      height: 82px;
      margin-right: 5px;
      img{
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
      video{
        width: 257px;
        height: 142px;
        object-fit: cover;
      }
      &:nth-child(3n){
        margin-right: 0;
      }
    }
    .u_videoList{
      width: 257px;
      height: 142px;
      position: relative;
      .video-mask{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.25);
        cursor: pointer;
        border-radius: 3px;
      }
      .video-wrapper{
        position: relative;
        top: 50%;
        left: 50%;
        margin-left: -26px;
        margin-top: -26px;
        width: 52px;
        height: 52px;
        border-radius: 52px;
        background-color: rgba(255, 255, 255, 0.4);
        > svg {
          margin: 11px 0 0 14px;
          font-size: 30px;
          color: #fff;
        }
      }
    }
    .u_linkList{
      width: 242px;
      height: auto;
      margin-bottom: 12px;
      padding: 6px 10px;
      background: #FFFFFF;
      border: 1px solid #EEEEEE;
      overflow: auto;
      border-radius: 4px;
      .u_t{
        width: 221.26px;
        font-size: 14px;
        color: #262626;
        line-height: 18px;
        font-weight: bold;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        word-break: break-all;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .u_desc{
        width: 165.94px;
        font-size: 12px;
        color: #262626;
        line-height: 17px;
        font-weight: 400;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        float: left;
        word-break: break-all;
        -webkit-box-orient: vertical;
      }
      .u_link_img{
        width: 45px;
        height: 45px;
        margin-left: 7px;
      }
      .u_line{
        width: 221.26px;
        height: 1px;
        margin-top: 5px;
        margin-bottom: 18px;
        background: #EEEEEE;
      }
    }
    .u_appList{
      width: 242px;
      height: 278px;
      background: #FFFFFF;
      border: 1px solid #EEEEEE;
      border-radius: 4px;
      padding: 0 16px;
      margin-bottom: 12px;
      .u_app_title{
        margin-top: 16px;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        color: #909399;
        .v1{
          margin-right: 8px;
          display: inline-block;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #D9D9D9;
        }
        .v2{
          vertical-align: top;
        }
      }
      .u_content{
        margin: 0;
        margin-top: 4px;
        width: 210px;
        height: 22px;
        font-size: 14px;
        color: #383838;
        letter-spacing: 0;
        line-height: 22px;
        font-weight: 400;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      .u_app_img{
        width: 210px;
        height: 168px;
        margin-top: 4px;
      }
      .u_line{
        margin-top: 7.5px;
        width: 210px;
        height: 1px;
        background:#EBEBEB;
      }
      .u_bottom{
        margin-top: 7.5px;
        height: 20px;
        font-size: 12px;
        color: #909399;
        line-height: 20px;
        .icon{
          font-size: 10.57px;
          margin-right: 4px;
        }
      }
    }
  }
</style>
