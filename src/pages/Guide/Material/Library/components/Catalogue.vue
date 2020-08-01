<template>
  <div class="catalogue-wrapper">
    <div v-if="folders.length" class="catalogue-folders">
      <div class="catalogue-header">文件夹</div>
      <div class="catalogue-folders__wrapper">
        <div class="catalogue-folders__content">
          <div class="catalogue-folders__item" :class="{'catalogue-folders__item--selected': item.selected}" v-for="item in folderList" :key="item.id">
            <div class="catalogue-folders__item--info" @click="onEnter(item)">
              <Icon type="wenjianjia-new" class="catalogue-folders__item--icon"/>
              <div class="catalogue-folders__item--name">{{item.title}}</div>
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
        <div class="catalogue-materials__content">
          <div class="catalogue-materials__item" :class="{'catalogue-materials__item--selected': item.selected}" v-for="item in materialList" :key="item.id">
            <div class="catalogue-materials__item--info">
              <div class="catalogue-materials__item--title catalogue-ellipsis">{{item.title}}</div>
              <div class="catalogue-materials__item--desc catalogue-ellipsis">
                <span>发布方：{{item.source_name || '未知'}}</span>
                <span>{{item.create_time}}</span>
              </div>
              <div class="catalogue-materials__item--content catalogue-ellipsis2">{{item.content}}</div>
              <div class="catalogue-materials__item--media">
                <div v-if="item.m_type == 2 && item.videoUrl" class="catalogue-materials__video">
                  <video :src="item.videoUrl">
                    您的浏览器暂不支持播放该视频，请升级至最新版浏览器。
                  </video>
                  <div class="catalogue-materials__video--mask" @click="showPreview(0, item)">
                    <div class="catalogue-materials__video--wrapper">
                      <Icon type="begin" />
                    </div>
                  </div>
                </div>
                <div v-else class="catalogue-materials__images">
                  <img alt="" :src="img" v-for="(img, index) in item.imageList" :key="index" @click="showPreview(index, item)"/>
                </div>
              </div>
              <div class="catalogue-materials__item--action clearfix">
                <el-select
                  v-model="item.subdivisionId"
                  placeholder="请选择"
                  filterable
                  clearable
                  style="width: 150px"
                >
                  <el-option
                    v-for="obj in labelList"
                    :key="obj.subdivisionId"
                    :label="obj.subdivisionName"
                    :value="obj.subdivisionId">
                  </el-option>
                </el-select>
                <Icon v-if="item.m_type === 1" type="erweima"/>
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
    <no-data :is-show="isEmpty"></no-data>
  </div>
</template>
<script>
import NoData from './NoData'
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
  components: { NoData },
  data () {
    return {}
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
      // 生成瀑布数组
      return this.materials.map(o => {
        let index = this.selectRows.findIndex(s => s.id === o.id)
        return { ...o, selected: index > -1 }
      })
    }
  },
  methods: {
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
      let type = +row.m_type === 2 ? 'video' : 'img'
      let list = type === 'video' ? [row.videoUrl] : row.imageList
      this.$emit('preview', current, list, type)
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
      width: 128px;
      height: 128px;
      text-align: center;
      border: solid 1px transparent;
      border-radius: 3px;
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
        cursor: pointer;
      }
    }
  }
  @b materials {
    @e wrapper {}
    @e content {}
    @e item {
      position: relative;
      margin-top: 10px;
      width: 296px;
      background: #fff;
      border: solid 1px transparent;
      border-radius: 3px;
      &:first-child {
        margin-top: 0;
      }
      @m info {
        padding: 19px 19px 0;
      }
      @m title {
        font-size: 14px;
        color: #303133;
        font-weight: bolder;
        line-height: 22px;
      }
      @m desc {
        margin: 10px 0;
        font-size: 12px;
        color: #909399;
        line-height: 20px;
        span + span {
          margin-left: 20px;
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
      }
      @m btns {
        border-top: solid 1px #dcdfe6;
      }
      @m btn {
        position: relative;
        display: inline-block;
        margin: 4px 0;
        width: 33.333333%;
        font-size: 12px;
        color:#0392fb;
        line-height: 30px;
        text-align: center;
        /* &:nth */
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
    }
    @e images {
      margin-bottom: -5px;
      img {
        margin: 0 5px 5px 0;
        width: 82px;
        height: 82px;
        border-radius: 3px;
        cursor: pointer;
        &:nth-child(3n) {
          margin-right: 0;
        }
      }
    }
    @e video {
      position: relative;
      line-height: 1;
      video {
        width: 256px;
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
}
</style>
