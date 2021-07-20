<template>
  <div class="tableItem">
    <div class="tableItem-content">
      <div class="tableItem-content__text">
        <el-tooltip
          placement="top-start"
          :enterable="true"
          popper-class="table-body__tooltip"
        >
          <div slot="content" v-html="strToRichText(data.content)"></div>
          <div v-html="strToRichText(data.content)" class="tableItem-content__ellipsis"></div>
          <!-- <div class="tableItem-content__ellipsis">{{ data.content }}</div> -->
        </el-tooltip>
      </div>
      <div class="tableItem-content___box">
        <template v-if="isBoolean || isFlag">
          <div v-for="(c_item, c_index) in data.mediaList && data.mediaList.slice(0, 3)" :key="c_index" class="tableItem-content__image">
            <div v-if="c_item.type === 1 || c_item.type === 0" class="v_image">
              <img class="pit-img-view" v-if="c_item.type == 0" :src="defaultImgUrl"  @click="showGuideInfo(c_index, data)">
              <img
                v-else
                alt=""
                :src="
                  c_item.content.image +
                    '?x-oss-process=image/resize,m_mfit,h_200,w_200'
                "
                @click="showPreview(c_index, c_item, data)"
                />
            </div>
          </div>
        </template>
        <div class="tableItem-content__video" v-if="!isBoolean && data.mediaList && data.mediaList[0].type === 2">
          <div>
            <video
              :src="videoUrl(data)"
            >
              您的浏览器暂不支持播放该视频，请升级至最新版浏览器。
            </video>
          </div>
          <div
            class="tableItem-content__video--mask"
            @click="showPreview(0, data.mediaList[0], data)"
          >
            <div class="tableItem-content__video--wrapper">
              <Icon type="begin" />
            </div>
          </div>
        </div>
        <div v-if="!isBoolean && data.mediaList && data.mediaList[0].type === 3" class="u_linkList">
          <div class="u_t">{{data.mediaList[0].content.title}}</div>
          <div class="u_desc">{{data.mediaList[0].content.desc}}</div>
          <img class="u_link_img" :src='data.mediaList[0].content.image' alt="">
          <div class="u_line"></div>
        </div>
        <div v-if="!isBoolean && data.mediaList && data.mediaList[0].type === 4" class="u_appList">
          <div class="u_app_title">
            <span class="v1"></span>
            <span class="v2">小程序名称</span>
          </div>
          <div class="u_content">{{data.mediaList[0].content.title}}</div>
          <img class="u_app_img" :src='data.mediaList[0].content.image' alt="">
          <div class="u_line"></div>
          <div class="u_bottom"><Icon class="icon" type="xiaochengxushouquan" className="icon"/>小程序</div>
        </div>
        <Icon class="icon_ty" v-if="lengths > 3" type="qitas" />
        <Icon class="icon_tys" v-if="data.codeType" type="erweima" />
      </div>
      <!-- 图文素材
      <div v-if="data.mType === 1" class="tableItem-content__imageBox">
        <ul>
          <li v-for="(item, index) in imageList" :key="index">
            <img
              :src="defaultImgUrl"
              alt=""
              v-if="item.pitType == 2"
              @click="showGuideInfo(index, item)"
              class="pit-img-view"
            />
            <img
              :src="item.url + '?x-oss-process=image/resize,m_mfit,h_200,w_200'"
              alt=""
              @click="showPreview(index)"
              v-else
            />
          </li>
          <li v-if="data.codeType">
            <Icon type="erweima" />
          </li>
        </ul>
      </div> -->
      <!-- 视频素材
      <div v-if="data.mType === 2" class="tableItem-content__vedioBox">
        <video  -->
      <!-- 文章素材
      <div v-if="data.mType === 0" class="tableItem-content__articleBox">
        <img
          alt=""
          :src="
            imageList[0].url + '?x-oss-process=image/resize,m_mfit,h_200,w_200'
          "
          @click="showPreview(0)"
        />
        <el-tooltip
          placement="top-start"
          :enterable="true"
          popper-class="table-body__tooltip"
        >
          <div slot="content">{{ data.title }}</div>
          <div class="tableItem-content__ellipsis">{{ data.title }}</div>
        </el-tooltip>
      </div> -->
    </div>
    <GuideInfo ref="guideInfo" :info="guideInfo" />
  </div>
</template>
<script>
import GuideInfo from './GuideInfo'
export default {
  components: { GuideInfo },
  props: {
    data: Object,
    lengths: Number
  },
  data () {
    return {
      defaultImgUrl:
        'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/image/material/custom-edit.png',
      // 拍摄指南
      guideInfo: {}
    }
  },
  computed: {
    isBoolean () {
      return this.data.mediaList && this.data.mediaList.slice(0, 3).every(item => item.type === 0 || item.type === 1)
    },
    isFlag () {
      return this.data.mediaList && this.data.mediaList.slice(0, 2).some(item => item.type === 0 || item.type === 1) && (this.data.mediaList[0].type === 1 || this.data.mediaList[0].type === 0)
    }
  },
  mounted () {
  },
  methods: {
    videoUrl (list) {
      if (list.mediaList && list.mediaList.length > 0) {
        let obj = list.mediaList.find(item => item.type === 2)
        return obj.content.video
      }
      return ''
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
    },
    showGuideInfo (index, item) {
      this.guideInfo = item
      this.$refs.guideInfo.closeDeawer()
    },
    showPreview (current, row, data) {
      let type = +row.type === 2 ? 'video' : 'img'
      let item = data.mediaList[current]
      let imgs = []
      data.mediaList.forEach(item => {
        if (item.type === 2) {
          imgs.push(item.content.video)
        } else {
          imgs.push(item.content.image)
        }
      })
      this.$emit('preview', current, imgs, type)
    }
  }
}
</script>
<style scoped lang='scss'>
.tableItem-content___box{
  position: relative;
}
.tableItem{
  max-width: 274px;
  display: inline-block;
}
.icon_ty, .icon_tys{
  margin-left: 12px;
  position: absolute;
  left: 104%;
  top: 0;
  bottom: 0;
  margin: auto;
}
.icon_tys{
  left: 113%;
}
.u_linkList{
  display: inline-block;
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
  display: inline-block;
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
.v_image {
  width: 60px;
  height: 60px;
  list-style: none;
  margin: 0 5px 5px 0;
}
</style>
<style scoped>
.pit-img-view {
  border: 1px dashed #D9D9D9;
  background-color: white;
}
@component-namespace tableItem {
  @b content {
    @e tooltip {
      max-width: 400px;
    }
    @e text {
      margin-bottom: 5px;
    }
    @e ellipsis {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
      visibility: visible;
    }
    @e image {
      display: inline-flex;
      flex-direction: row;
      flex-wrap: wrap;
      img {
        width: 60px;
        height: 60px;
        border-radius: 3px;
        cursor: pointer;
        object-fit: cover;
      }
      &:nth-child(3n){
        .v_image{
          margin-right: 0;
        }
      }
    }
    @e video {
      position: relative;
      display: inline-block;
      font-size: 0;
      width: 107px;
      height: 60px;
      line-height: 1;
      video {
        width: 100%;
        height: 60px;
        border-radius: 3px;
        object-fit: cover;
      }
      @m mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.25);
        cursor: pointer;
        border-radius: 3px;
      }
      @m wrapper {
        position: relative;
        top: 50%;
        left: 50%;
        margin-left: -10px;
        margin-top: -10px;
        width: 22px;
        height: 22px;
        border-radius: 22px;
        background-color: rgba(255, 255, 255, 0.4);
        > svg {
          margin: 5px 0 0 7px;
          font-size: 11px;
          color: #fff;
        }
      }
    }
    @e articleBox {
      position: relative;
      padding: 5px;
      background: #ebeef5;
      img {
        width: 50px;
        height: 50px;
        border-radius: 3px;
        cursor: pointer;
        object-fit: cover;
      }
      > div {
        position: absolute;
        top: 50%;
        right: 7px;
        left: 60px;
        transform: translate(0, -50%);
      }
    }
  }
  @b video {
    @e mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.25);
      cursor: pointer;
      border-radius: 3px;
    }
    @e wrapper {
      position: relative;
      top: 50%;
      left: 50%;
      margin-left: -11px;
      margin-top: -11px;
      width: 22px;
      height: 22px;
      border-radius: 22px;
      background-color: rgba(255, 255, 255, 0.4);
      > svg {
        margin: 5px 0 0 6px;
        font-size: 12px;
        color: #fff;
      }
    }
  }
}
</style>
