<template>
  <div class="catalogue-wrapper">
    <div v-if="folders.length" class="catalogue-folders">
      <div class="catalogue-header">文件夹</div>
      <div class="catalogue-folders__wrapper">
        <div class="catalogue-folders__content">
          <div class="catalogue-folders__item" :class="{'catalogue-folders__item--selected': item.selected}" v-for="item in folderList" :key="item.id">
            <div class="catalogue-folders__item--info" @click="onEnter(item)">
              <Icon type="wenjianjia-new" class="catalogue-folders__item--icon"/>
              <div class="catalogue-folders__item--name">{{item.name}}</div>
            </div>
            <div class="catalogue-folders__item--btns">
              <Icon :type="btn.icon" v-for="btn in operate_buttons" :key="btn.name" @click="btn.func(item)"/>
            </div>
            <div class="catalogue-folders__item--check">
              <Icon v-if="!item.selected" type="weixuanzhong" @click="onSelect(item)"/>
              <Icon v-else type="xuanzhong" @click="onRemove(item)"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="materials.length" class="catalogue-materials">
      <div class="catalogue-header">素材</div>
      <div class="catalogue-materials__wrapper">
        <div class="catalogue-materials__group" v-for="(itemList, index) in materialList" :key="index">
          <div class="catalogue-materials__item" :class="{'catalogue-materials__item--selected': item.selected}" v-for="item in itemList" :key="item.id">
            <div class="catalogue-materials__item--info">
              <div class="catalogue-materials__item--title catalogue-ellipsis">{{item.name}}</div>
              <div class="catalogue-materials__item--desc">
                <span>发布方：</span>
                <el-tooltip placement="top-start" :enterable="true" popper-class="table-body__tooltip">
                  <div slot="content">{{item.sourceName || '-'}}</div>
                  <span class="catalogue-ellipsis">{{item.sourceName || '-'}}</span>
                </el-tooltip>
                <span>{{item.createTime}}</span>
              </div>
              <div class="catalogue-materials__item--content catalogue-ellipsis2">
                <el-tooltip :enterable="true" popper-class="table-body__tooltip">
                  <div slot="content">{{item.content}}</div>
                  <div>{{item.content}}</div>
                </el-tooltip>
              </div>
              <div class="catalogue-materials__item--media">
                <div v-if="item.mType === 0" class="catalogue-materials__article">
                  <img alt="" :src="item.imageList[0] + '?x-oss-process=image/resize,m_mfit,h_200,w_200'" @click="showPreview(0, item)"/>
                  <el-tooltip placement="top-start" :enterable="true" popper-class="table-body__tooltip">
                    <div slot="content">{{item.title}}</div>
                    <div class="catalogue-materials__article--title catalogue-ellipsis3">{{item.title}}</div>
                  </el-tooltip>
                </div>
                <div v-else-if="item.mType === 1" class="catalogue-materials__image">
                  <img :style="{'width': imageHeight + 'px','height': imageHeight + 'px'}" alt="" :src="img + '?x-oss-process=image/resize,m_mfit,h_200,w_200'" v-for="(img, index) in item.imageList" :key="index" @click="showPreview(index, item)"/>
                </div>
                <div v-else class="catalogue-materials__video">
                  <video :src="item.imageList[0]" :style="{'height': videoHeight + 'px'}">
                    您的浏览器暂不支持播放该视频，请升级至最新版浏览器。
                  </video>
                  <div class="catalogue-materials__video--mask" @click="showPreview(0, item)">
                    <div class="catalogue-materials__video--wrapper">
                      <Icon type="begin" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="catalogue-materials__item--action clearfix">
                <el-select
                  v-model="item.subdivisionId"
                  placeholder="未打标"
                  :filter-method="subdivisionFilter"
                  @visible-change="subdivisionVisible"
                  @change="subdivisionChange(item)"
                  filterable
                  clearable
                  style="width: 150px"
                >
                  <el-option
                    v-for="obj in subdivisionList"
                    :key="obj.subdivisionId"
                    :label="obj.subdivisionName"
                    :value="obj.subdivisionId">
                  </el-option>
                </el-select>
                <Icon v-if="item.codeType" type="erweima"/>
                <span v-if="item.mType === 0" class="catalogue-materials__item--total">浏览量: {{item.pageView || 0}}</span>
              </div>
            </div>
            <div class="catalogue-materials__item--btns">
              <span class="catalogue-materials__item--btn" v-for="btn in operate_buttons" :key="btn.name" @click="btn.func(item)">
                {{btn.name}}
              </span>
            </div>
            <div class="catalogue-materials__item--check">
              <Icon v-if="!item.selected" type="weixuanzhong" @click="onSelect(item)"/>
              <Icon v-else type="xuanzhong" @click="onRemove(item)"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ns-no-data v-if="isEmpty">暂无数据</ns-no-data>
  </div>
</template>
<script>
import NsNoData from '@nascent/ecrp-ecrm/src/components/NsNoData.vue'
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
  components: { NsNoData },
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
      filterValue: ''
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
        this.materials.forEach(o => {
          let index = this.selectRows.findIndex(s => s.id === o.id)
          let height = this.baseHeight
          switch (o.m_type) {
            case 0:
              height += this.articleHeight
              break
            case 2:
              height += o.imageList && o.imageList.length ? this.videoHeight : 0
              break
            default:
              let rows = Math.ceil((o.imageList || []).length / 3)
              height += rows * (this.imageHeight + this.imageOffset) - this.imageOffset
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
      return this.labelList.filter(o => o.subdivisionName.toUpperCase().indexOf(this.filterValue) > -1)
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
    // 设置卡片容器宽度
    setWrapperW () {
      const wrapper = document.querySelector('.catalogue-wrapper')
      if (wrapper) {
        this.wrapperW = wrapper.offsetWidth
        this.columnNum = Math.floor((this.wrapperW + this.offset) / (this.width + this.offset)) || 1
        this.realWidth = (this.wrapperW + this.offset) / this.columnNum - this.offset
        this.imageHeight = Math.floor((this.realWidth - 44) / (this.width - 44) * this.originImageHeight)
        this.videoHeight = Math.floor((this.realWidth - 34) / (this.width - 34) * this.originVideoHeight)
      }
    },
    subdivisionFilter (val) {
      this.filterValue = val.toUpperCase()
    },
    subdivisionVisible (val) {
      if (!val) {
        this.filterValue = ''
      }
    },
    subdivisionChange (item) {
      this.$emit('subdivisionChange', item)
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
    showPreview (current, row) {
      let type = +row.mType === 2 ? 'video' : 'img'
      this.$emit('preview', current, row.imageList, type)
    }
  }
}
</script>
<style scoped>
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
          transition: opacity .3s;
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
        }
        @m btns {
          margin-top: 10px;
          font-size: 16px;
          color: #303133;
          opacity: 0;
          transition: opacity .3s;
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
          height: 40px;
          font-size: 12px;
          color: #606266;
          line-height: 20px;
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
          transition: opacity .3s;
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
        margin-right: -6px;
        margin-bottom: -5px;
        img {
          margin: 0 5px 5px 0;
          width: 78px;
          height: 78px;
          border-radius: 3px;
          cursor: pointer;
          object-fit: cover;
        }
      }
      @e video {
        position: relative;
        font-size: 0;
        line-height: 1;
        video {
          width: 100%;
          height: 142px;
          border-radius: 3px;
          object-fit: cover;
        }
        @m mask {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, .25);
          cursor: pointer;
          border-radius: 3px;
        }
        @m wrapper {
          position: relative;
          top: 50%;
          left: 50%;
          margin-left: -26px;
          margin-top: -26px;
          width: 52px;
          height: 52px;
          border-radius: 52px;
          background-color: rgba(255, 255, 255, .4);
          > svg {
            margin: 11px 0 0 14px;
            font-size: 30px;
            color: #fff;
          }
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
