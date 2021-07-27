<template>
  <div class="catalogue-wrapper">
    <div v-if="folders.length" class="catalogue-folders">
      <div class="catalogue-header">文件夹</div>
      <div class="catalogue-folders__wrapper">
        <div class="catalogue-folders__content">
          <div
            class="catalogue-folders__item"
            :class="{ 'catalogue-folders__item--selected': item.selected }"
            v-for="item in folderList"
            :key="item.id"
          >
            <div class="catalogue-folders__item--info" @click="onEnter(item)">
              <div class="catalogue-folders__item--iconview">
                <Icon
                  type="wenjianjia-new"
                  class="catalogue-folders__item--icon"
                />
                <div
                  type="jiaobiao-new"
                  class="catalogue-folders__item--angle"
                  style=""
                >
                  99+
                </div>
              </div>
              <div class="catalogue-folders__item--name" :title="item.name">
                {{ item.name }}
              </div>
            </div>
            <div class="catalogue-folders__item--btns">
              <Icon
                :type="btn.icon"
                v-for="btn in operate_buttons.slice(0, 3)"
                :key="btn.name"
                @click="btn.func(item)"
              />
            </div>
            <div class="catalogue-folders__item--check">
              <Icon
                v-if="!item.selected"
                type="weixuanzhong"
                @click="onSelect(item)"
              />
              <Icon v-else type="xuanzhong" @click="onRemove(item)" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="materials.length" class="catalogue-materials">
      <div class="catalogue-header">素材</div>
      <div class="catalogue-materials__wrapper">
        <div
          class="catalogue-materials__group"
          v-for="(itemList, index) in materialList"
          :key="index"
        >
          <div
            class="catalogue-materials__item"
            :class="{ 'catalogue-materials__item--selected': item.selected }"
            v-for="item in itemList"
            :key="item.id"
          >
            <div class="catalogue-materials__item--info">
              <div
                class="catalogue-materials__item--title catalogue-ellipsis"
                :title="item.name"
                v-html="strToRichText(item.name)"
              >
              </div>
              <div class="catalogue-materials__item--desc">
                <span>发布方：</span>
                <el-tooltip
                  placement="top-start"
                  :enterable="true"
                  popper-class="table-body__tooltip"
                >
                  <div slot="content">{{ item.sourceName || '-' }}</div>
                  <span class="catalogue-ellipsis">{{
                    item.sourceName || '-'
                  }}</span>
                </el-tooltip>
                <span>{{ item.createTime }}</span>
              </div>
              <div
                class="catalogue-materials__item--content catalogue-ellipsis2"
              >
                <el-tooltip
                  :enterable="true"
                  popper-class="table-body__tooltip"
                >
                  <!-- <div slot="content" v-html="strToRichText(item.content)"></div> -->
                  <div class="showContent">
                    <EmojiText :text='item.content' />
                  </div>
                </el-tooltip>
              </div>
              <div class="catalogue-materials__item--media">
                <!-- <div
                  v-if="item.mType === 0"
                  class="catalogue-materials__article"
                >
                  <img
                    v-if="item.mediaList"
                    alt=""
                    :src="
                      item.mediaList[0].url +
                        '?x-oss-process=image/resize,m_mfit,h_200,w_200'
                    "
                    @click="showPreview(0, item)"
                  />
                  <el-tooltip
                    placement="top-start"
                    :enterable="true"
                    popper-class="table-body__tooltip"
                  >
                    <div slot="content">{{ item.title }}</div>
                    <div
                      class="catalogue-materials__article--title catalogue-ellipsis3"
                    >
                      {{ item.title }}
                    </div>
                  </el-tooltip>
                </div>
                <div
                  v-else-if="item.mType === 1"
                  class="catalogue-materials__image"
                >
                  <li class="test-li" v-for="(img, index) in item.mediaList" :key="index">
                    <img class="pit-img-view" v-if="img.pitType == 2" :src="defaultImgUrl"  @click="showGuideInfo(index, item)" :style="{ width: imageHeight + 'px',height: imageHeight + 'px'}">
                    <img
                      v-else
                      :style="{
                        width: imageHeight + 'px',
                        height: imageHeight + 'px'
                      }"
                      alt=""
                      :src="
                        img.url +
                          '?x-oss-process=image/resize,m_mfit,h_200,w_200'
                      "
                      @click="showPreview(index, item)"
                    />
                  </li>
                </div> -->
                <div v-for="(c_item, c_index) in item.mediaList" :key="c_index" class="catalogue-materials__image">
                  <div v-if="c_item.type === 1 || c_item.type === 0" class="v_image">
                    <img class="pit-img-view" v-if="c_item.type == 0" :src="defaultImgUrl"  @click="showGuideInfo(c_index, item)" :style="{ width: imageHeight + 'px',height: imageHeight + 'px'}">
                    <img
                      v-else
                      :style="{
                        width: imageHeight - 2 + 'px',
                        height: imageHeight - 2 + 'px'
                      }"
                      alt=""
                      :src="
                        c_item.content.image +
                          '?x-oss-process=image/resize,m_mfit,h_200,w_200'
                      "
                      @click="showPreview(c_index, c_item, item)"
                      />
                  </div>
                  <div class="v_image" v-if="c_item.type === 2">
                    <img
                      :style="{
                        width: imageHeight - 2 + 'px',
                        height: imageHeight - 2 + 'px'
                      }"
                      alt=""
                      :src="c_item.content.video + '?x-oss-process=video/snapshot,t_10000,f_jpg'"
                      />
                    <div
                      class="mask"
                      @click="showPreview(c_index, c_item, item)"
                    >
                      <div class="wrapper">
                        <Icon type="begin" />
                      </div>
                    </div>
                  </div>
                  <div v-if="c_item.type === 3" class="u_linkList">
                    <div class="u_t">{{c_item.content.title}}</div>
                    <div class="u_desc">{{c_item.content.desc}}</div>
                    <img class="u_link_img" :src='c_item.content.image || linkImage' alt="">
                    <div class="u_line"></div>
                  </div>
                  <div v-if="c_item.type === 4" class="u_appList">
                    <!-- <div class="u_t">{{item.content.title}}</div>
                    <Icon type="xiaochengxushouquan" className="icon"/>
                    <div class="u_desc">{{item.content.desc}}</div>
                    <img class="u_link_img" :src='item.content.image || defaultImgUrl' alt="">
                    <div class="u_line"></div> -->
                    <div class="u_app_title">
                      <span class="v1"></span>
                      <span class="v2">小程序名称</span>
                    </div>
                    <div class="u_content">{{c_item.content.title}}</div>
                    <img class="u_app_img" :src='c_item.content.image' alt="">
                    <div class="u_line"></div>
                    <div class="u_bottom"><Icon class="icon" type="xiaochengxushouquan" className="icon"/>小程序</div>
                  </div>
                  <!-- <div v-if="item.mediaList">
                    <video
                      :src="videoUrl(item)"
                      :style="{ height: videoHeight + 'px' }"
                    >
                      您的浏览器暂不支持播放该视频，请升级至最新版浏览器。
                    </video>
                  </div>
                  <div
                    class="catalogue-materials__video--mask"
                    @click="showPreview(0, item)"
                  >
                    <div class="catalogue-materials__video--wrapper">
                      <Icon type="begin" />
                    </div>
                  </div> -->
                </div>
                <!-- <div v-if="c_item.type === 2" class="catalogue-materials__video">
                  <div class="v_video">
                    <video
                      :src="videoUrl(item)"
                      :style="{ height: videoHeight + 'px' }"
                    >
                      您的浏览器暂不支持播放该视频，请升级至最新版浏览器。
                    </video>
                    <div
                      class="catalogue-materials__video--mask"
                      @click="showPreview(0, item)"
                    >
                      <div class="catalogue-materials__video--wrapper">
                        <Icon type="begin" />
                      </div>
                    </div>
                  </div>
                </div> -->
              </div>
              <div class="catalogue-materials__item--action clearfix">
                <el-select
                  v-model="item.subdivisionIds"
                  placeholder="未打标"
                  :filter-method="subdivisionFilter"
                  @visible-change="subdivisionVisible"
                  @change="
                    val => {
                      subdivisionChange(val, item)
                    }
                  "
                  style="width: 180px"
                  multiple
                  collapse-tags
                >
                  <el-option
                    v-for="obj in subdivisionList"
                    :key="obj.subdivisionId"
                    :label="obj.subdivisionName"
                    :value="obj.subdivisionId"
                  >
                  </el-option>
                </el-select>
                <Icon v-if="item.codeType" type="erweima" />
                <span
                  v-if="item.mType === 0"
                  class="catalogue-materials__item--total"
                  >浏览量: {{ item.pageView || 0 }}</span
                >
              </div>
            </div>
            <div
              class="catalogue-materials__item--btns"
              v-if="item.materialScriptType === 2"
            >
              <span
                class="catalogue-materials__item--btn"
                v-for="btn in operate_buttons"
                :key="btn.name"
                @click="btn.func(item)"
              >
                {{ btn.name }}
              </span>
            </div>
            <div v-else class="catalogue-materials__item--btns">
              <span
                class="catalogue-materials__item--btn"
                v-for="btn in operate_buttons.slice(0, 3)"
                :key="btn.name"
                @click="btn.func(item)"
              >
                {{ btn.name }}
              </span>
            </div>
            <div class="catalogue-materials__item--check">
              <Icon
                v-if="!item.selected"
                type="weixuanzhong"
                @click="onSelect(item)"
              />
              <Icon v-else type="xuanzhong" @click="onRemove(item)" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <ns-no-data v-if="isEmpty">暂无数据</ns-no-data>
    <GuideInfo ref="guideInfo" :info="guideInfo" />
  </div>
</template>
<script>
import NsNoData from '@nascent/ecrp-ecrm/src/components/NsNoData.vue'
import EmojiText from '@/components/NewUi/EmojiText'
import GuideInfo from './GuideInfo'
export default {
  props: {
    folders: {
      type: Array,
      default () {
        return []
      }
    },
    materials: {
      type: Array,
      default () {
        return []
      }
    },
    selectRows: {
      type: Array,
      default () {
        return []
      }
    },
    labelList: {
      type: Array,
      default () {
        return []
      }
    },
    operate_buttons: Array
  },
  components: { NsNoData, GuideInfo, EmojiText },
  data () {
    return {
      // 卡片容器宽度
      wrapperW: 0,
      // 卡片宽度
      width: 278,
      // 卡片基础高度
      baseHeight: 220,
      // 图片高度 - 82
      originImageHeight: 78,
      imageHeight: 78,
      // 图片间隔
      imageOffset: 5,
      // 文章高度
      articleHeight: 78,
      // 视频高度 - 142
      originVideoHeight: 134,
      videoHeight: 134,
      // 间距
      offset: 10,
      // 分组数
      columnNum: 0,
      // 筛选项
      filterValue: '',
      // 拍摄指南
      guideInfo: {},
      //
      materialShow: this.materials,
      //
      selectItem: {},
      linkImage: 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-APP-WEB/img/mini-icon.jpg',
      defaultImgUrl:
        'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/image/material/custom-edit.png'
    }
  },
  watch: {
    materials (val) {
      this.materialShow = val
    }
  },
  computed: {
    isEmpty () {
      return this.folders.length === 0 && this.materials.length === 0
    },
    folderList () {
      return this.folders.map(o => {
        let index = this.selectRows.findIndex(s => s.id === o.id)
        return { ...o, selected: index > -1 }
      })
    },
    materialList () {
      if (this.columnNum) {
        let list = new Array(this.columnNum)
        let sortArr = new Array(this.columnNum)
        for (let i = 0; i < this.columnNum; i++) {
          list[i] = []
          sortArr[i] = { i: i, h: 0 }
        }
        this.materialShow.forEach(o => {
          let index = this.selectRows.findIndex(s => s.id === o.id)
          let height = this.baseHeight
          switch (o.m_type) {
            case 0:
              height += this.articleHeight
              break
            case 2:
              height += o.mediaList && o.mediaList.length ? this.videoHeight : 0
              break
            default:
              let rows = Math.ceil((o.mediaList || []).length / 3)
              height +=
                rows * (this.imageHeight + this.imageOffset) - this.imageOffset
          }
          let temp = sortArr[0]
          list[temp.i].push({ ...o, selected: index > -1 })
          temp.h += height
          sortArr.sort((a, b) => {
            let dv = a.h - b.h
            return dv === 0 ? a.i - b.i : dv
          })
        })
        return list
      }
      return []
    },
    subdivisionList () {
      return this.labelList.filter(
        o => o.subdivisionName.toUpperCase().indexOf(this.filterValue) > -1
      )
    }
  },
  mounted () {
    this.setWrapperW()
    window.addEventListener('resize', this.setWrapperW)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.setWrapperW)
  },
  methods: {
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
    },
    // 设置卡片容器宽度
    setWrapperW () {
      const wrapper = document.querySelector('.catalogue-wrapper')
      if (wrapper) {
        this.wrapperW = wrapper.offsetWidth
        this.columnNum =
          Math.floor(
            (this.wrapperW + this.offset) / (this.width + this.offset)
          ) || 1
        this.realWidth =
          (this.wrapperW + this.offset) / this.columnNum - this.offset
        this.imageHeight = Math.floor(
          ((this.realWidth - 44) / (this.width - 44)) * this.originImageHeight
        )
        this.videoHeight = Math.floor(
          ((this.realWidth - 34) / (this.width - 34)) * this.originVideoHeight
        )
      }
    },
    subdivisionFilter (val) {
      this.filterValue = val.toUpperCase()
    },
    subdivisionVisible (val) {
      if (!val) {
        this.filterValue = ''
        if (this.selectItem.subdivisionIds) {
          this.$emit('subdivisionChange', this.selectItem)
          this.selectItem = {}
        }
      }
    },
    subdivisionChange (val, item) {
      item.subdivisionIds = Array.from(val)
      let arr = []
      for (let i = 0; i < this.materialShow.length; i++) {
        let dItem = this.materialShow[i]
        if (dItem.id === item.id) {
          dItem = item
        }
        arr.push(dItem)
      }
      this.materialShow = arr
      this.selectItem = item
      // this.$emit('subdivisionChange', item)
    },
    onSelect (row) {
      this.$emit('onSelect', row)
    },
    onRemove (row) {
      this.$emit('onRemove', row)
    },
    onEnter (row) {
      this.$emit('onEnter', row)
    },
    showPreview (current, row, data) {
      let type = +row.type === 2 ? 'video' : 'img'
      let item = data.mediaList[current]
      let imgs = []
      data.mediaList.forEach(item => {
        imgs.push(item.type === 1 ? item.content.image : item.content.video)
      })
      this.$emit('preview', current, imgs, type)
    },
    showGuideInfo (current, row) {
      let item = row.mediaList[current]
      this.guideInfo = item
      this.$refs.guideInfo.closeDeawer()
    },
    videoUrl (list) {
      if (list.mediaList && list.mediaList.length > 0) {
        let obj = list.mediaList.find(item => item.type === 2)
        return obj.content.video + '?x-oss-process=video/snapshot,t_10000,f_jpg'
      }
      return ''
    }
  }
}
</script>
<style scoped lang='scss'>
.u_linkList{
  width: 278px;
  height: auto;
  margin-bottom: 12px;
  padding: 6px 10px;
  background: #FFFFFF;
  border: 1px solid #EEEEEE;
  overflow: auto;
  border-radius: 4px;
  .u_t{
    width: 253.26px;
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
    width: 197.94px;
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
    width: 253.26px;
    height: 1px;
    margin-top: 5px;
    margin-bottom: 18px;
    background: #EEEEEE;
  }
}
.u_appList{
  width: 278px;
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
    width: 246px;
    height: 168px;
    margin-top: 4px;
  }
  .u_line{
    margin-top: 7.5px;
    width: 246px;
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
</style>
<style scoped>
@import '../styles/image.css';
.pit-img-view {
  border: 1px dashed #D9D9D9;
  background-color: white;
}
.v_image {
  /* display: flex;
  flex-direction: row; */
  /* width: 100px;
  height: 100px; */
  position: relative;
  list-style: none;
  margin: 0 5px 5px 0;
}
.v_video{

}
.showContent {
  word-break: break-all;
}
@component-namespace catalogue {
  @b wrapper {
    margin-bottom: 10px;
    > div:first-child {
      .catalogue-header {
        margin-top: 0;
      }
    }
  }
  @b header {
    margin: 10px 0;
    font-size: 14px;
    color: #303133;
    line-height: 22px;
  }
  @b folders {
    @e wrapper {
      overflow: hidden;
      background-color: #fff;
      border-radius: 3px;
    }
    @e content {
      margin: 0 -44px;
      padding: 0 5px;
    }
    @e item {
      position: relative;
      display: inline-block;
      margin: 5px 44px;
      padding-bottom: 8px;
      width: 128px;
      /* height: 128px; */
      text-align: center;
      border: solid 1px transparent;
      border-radius: 3px;
      vertical-align: top;
      &:hover {
        border-color: #dcdfe6;
        .catalogue-folders__item--btns,
        .catalogue-folders__item--check {
          opacity: 1;
        }
      }
      @m iconview {
        position: relative;
      }
      @m selected {
        border-color: #1a9cfb;
        &:hover {
          border-color: #1a9cfb;
        }
        .catalogue-folders__item--btns,
        .catalogue-folders__item--check {
          opacity: 1;
        }
        .catalogue-folders__item--check {
          color: #0091fa;
        }
      }
      @m check {
        position: absolute;
        top: 5px;
        right: 5px;
        font-size: 21px;
        color: #dcdfe6;
        opacity: 0;
        transition: opacity 0.3s;
        svg {
          cursor: pointer;
        }
      }
      @m icon {
        margin-top: 15px;
        font-size: 48px;
        color: #0392fb;
      }
      @m name {
        margin-top: 5px;
        font-size: 12px;
        color: #606266;
        line-height: 20px;
        word-break: break-word;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      @m btns {
        margin-top: 10px;
        font-size: 16px;
        color: #303133;
        opacity: 0;
        transition: opacity 0.3s;
        svg {
          cursor: pointer;
        }
        svg + svg {
          margin-left: 15px;
        }
      }
      @m info {
        font-size: 0;
        line-height: 1;
        cursor: pointer;
      }
      @m angle {
        position: absolute;
        bottom: 0px;
        left: 30px;
        background: #f5f5f5;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        font-size: 12px;
        color: #595959;
        text-align: center;
        line-height: 14px;
        padding: 1px;
        min-width: 16px;
        min-height: 16px;
        display: inline-block;
        display: none;
      }
    }
  }
  @b materials {
    @e wrapper {
      display: flex;
    }
    @e group {
      margin-right: 10px;
      flex: 1;
      overflow: hidden;
      &:last-child {
        margin-right: 0;
      }
    }
    @e item {
      position: relative;
      margin-top: 10px;
      min-width: 278px;
      background: #fff;
      border: solid 1px transparent;
      border-radius: 3px;
      &:first-child {
        margin-top: 0;
      }
      @m info {
        padding: 18px 16px 0;
      }
      @m title {
        font-size: 14px;
        color: #303133;
        font-weight: bolder;
        line-height: 22px;
      }
      @m desc {
        display: flex;
        margin: 10px 0;
        font-size: 12px;
        color: #909399;
        line-height: 20px;
        > span {
          &:nth-child(2) {
            flex: 1;
          }
          &:last-child {
            margin-left: 15px;
          }
        }
      }
      @m content {
        margin: 5px 0;
        font-size: 12px;
        color: #606266;
        line-height: 22px;
      }
      @m action {
        margin: 15px 0;
        svg {
          float: right;
          font-size: 24px;
          color: #262626;
        }
        >>> .el-select .el-input__inner {
          padding-right: 26px;
        }
      }
      @m total {
        float: right;
        font-size: 12px;
        color: #303133;
        line-height: 28px;
      }
      @m btns {
        display: flex;
        border-top: solid 1px #dcdfe6;
      }
      @m btn {
        position: relative;
        flex: 1;
        /* display: inline-block; */
        margin: 4px 0;
        /* width: 33.333333%; */
        font-size: 12px;
        color: #0392fb;
        line-height: 30px;
        text-align: center;
        cursor: pointer;
        &:not(:last-child) {
          border-right: solid 1px #dcdfec;
        }
      }
      &:hover {
        border-color: #dcdfe6;
        .catalogue-materials__item--check {
          opacity: 1;
        }
      }
      @m selected {
        border-color: #1a9cfb;
        &:hover {
          border-color: #1a9cfb;
        }
        .catalogue-materials__item--check {
          opacity: 1;
          color: #0091fa;
        }
      }
      @m check {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 21px;
        color: #dcdfe6;
        opacity: 0;
        transition: opacity 0.3s;
        svg {
          cursor: pointer;
        }
      }
    }
    @e article {
      position: relative;
      padding: 5px;
      background-color: #ebeef5;
      img {
        margin-right: 10px;
        width: 68px;
        height: 68px;
        border-radius: 3px;
        cursor: pointer;
        object-fit: cover;
      }
      @m title {
        position: absolute;
        top: 50%;
        left: 83px;
        right: 10px;
        font-size: 12px;
        line-height: 20px;
        color: #606266;
        transform: translate(0, -50%);
      }
    }
    @e image {
      display: inline-flex;
      flex-direction: row;
      flex-wrap: wrap;
      img {
        width: 78px;
        height: 78px;
        border-radius: 3px;
        cursor: pointer;
        object-fit: cover;
      }
      &:nth-child(3n){
        .v_image{
          margin-right: 0;
        }
      }
      .mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.25);
        cursor: pointer;
        border-radius: 3px;
      }
      .wrapper {
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
    @e video {
      position: relative;
      font-size: 0;
      line-height: 1;
      video {
        width: 100%;
        border-radius: 3px;
        object-fit: cover;
      }
    }
  }
  @b ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  @b ellipsis2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  @b ellipsis3 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
