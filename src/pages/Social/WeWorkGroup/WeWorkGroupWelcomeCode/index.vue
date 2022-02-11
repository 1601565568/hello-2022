<template>
  <div class="history-main">
    <div class="head-router">群欢迎语</div>
    <div class="search-content">
      <div class="search-left">
        <el-input class="serach-input" v-model="searchMap.textContent" placeholder="请输入群欢迎语"  @keyup.enter.native="searchLogList">
          <Icon type="ns-search" slot="suffix" class='search-icon' @click="searchLogList"></Icon>
        </el-input>
        <el-input class="serach-input" v-model="searchMap.createUserName" placeholder="请输入创建人姓名"  @keyup.enter.native="searchLogList">
          <Icon type="ns-search" slot="suffix" class='search-icon' @click="searchLogList"></Icon>
        </el-input>
      </div>
      <NsButton type="primary" class="add-button" size="large" @click="newCode">新建</NsButton>
    </div>
    <el-scrollbar ref="fullScreen" class="card-content">
      <div v-if="showDatas" class="card-scroll">
        <waterfall :col='waterCol' :data="dataList" ref="waterfall">
          <div class="card-item" v-for="(item, index) in dataList" :key="item.uuid">
            <div class="item-name">{{item.createUserName}}</div>
            <div class="item-time">{{item.createTime}}</div>
            <div class="item-text">
              <el-tooltip
                :enterable="true"
                popper-class="table-body__tooltip"
              >
                <div slot="content" v-html="strToRichText(item.textContent)" class="content-tooltip-view"></div>
                <div class="showContent">
                  <EmojiText :text='item.textContent' />
                </div>
              </el-tooltip>
            </div>
            <div class="item-image" v-if="item.otherMsgType + '' !== '0'">
              <div v-if="item.otherMsgType + '' === '1'" class="image-block" @click="showPreview(item, 'img')">
                <img :src="item.imageUrl + '?x-oss-process=image/resize,m_lfit,h_165,w_242'">
              </div>
              <div v-if="item.otherMsgType + '' === '2'" class="video-block" @click="showPreview(item, 'video')">
                <img :src="item.videoUrl + '?x-oss-process=video/snapshot,t_0000,f_jpg,w_242,h_152,m_fast'">
                <div class="video-mask">
                  <img src="../../../../assets/play-video.png">
                </div>
              </div>
              <div v-if="item.otherMsgType + '' === '3'" class="link-block">
                <div class="link-title">{{item.linkTitle}}</div>
                <div class="link-content">
                  <div class="link-text">{{item.linkDesc}}</div>
                  <img class="link-image" :src="item.linkPicUrl || linkImage">
                </div>
              </div>
              <div v-if="item.otherMsgType + '' === '4'" class="mini-block">
                <div class="mini-title">
                  <div class="mini-title-circle"></div>
                  <div class="mini-title-text">小程序名称</div>
                </div>
                <div class="mini-desc">{{item.miniProgramTitle}}</div>
                <div class="mini-image">
                  <img :src="item.miniProgramPicUrl">
                </div>
                <div class="mini-bottom">
                  <span class="iconfont icon-xiaochengxu2"></span>
                  <div class="mini-bottom-name">小程序</div>
                </div>
              </div>
            </div>
            <div class="item-opt">
              <span class="opt-btn" @click="editCode(item.uuid)">编辑</span>
              <span class="opt-btn" @click="lookCode(item.uuid)">查看</span>
              <span class="opt-btn" @click="deleteItem(item, index)">删除</span>
            </div>
          </div>
        </waterfall>
      </div>
      <div v-else class="no-date-area">
        <div class="no-data">
          <img src="https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-H5/component/mobile/no_data.png"/>
          <span>没有数据哦~</span>
        </div>
      </div>
    </el-scrollbar>
    <el-pagination
      :page-sizes="pagination.sizeOpts"
      :total="pagination.total"
      :current-page="pagination.page"
      :page-size="pagination.size"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
      class="template-table__pagination"
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>
    <preview ref="preview"></preview>
    <el-dialog :visible.sync="escShow" width="30%">
      <div class="tipsShowTitle" slot="title">确认删除？</div>
      <div class="tipsShowContent">
        <span class="ns-warm-cricle">!</span>
        删除后不可恢复，请再次确定是否要删除
      </div>
      <span slot="footer" class="dialog-footer">
        <ns-button @click="onEscCancel">取 消</ns-button>
        <ns-button type="primary" @click="onEscConfirm">确 定</ns-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import EmojiText from '@/components/NewUi/EmojiText'
import Preview from '@/components/NsPreview'
import { getErrorMsg } from '@/utils/toast'
export default {
  data () {
    return {
      waterCol: 2, // 瀑布流列数
      // 分页配置
      pagination: {
        size: 15,
        sizeOpts: [15, 25, 50, 100],
        page: 1,
        total: 0
      },
      searchMap: {
        createUserName: '',
        textContent: ''
      },
      escShow: false,
      deteleIndex: 0, // 需要删除的索引值
      deteleObj: {}, // 需要删除的对象
      dataList: [],
      showDatas: true,
      linkImage: 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-APP-WEB/img/mini-icon.jpg'
    }
  },
  components: { EmojiText, Preview },
  computed: {},
  created () {
    this.setWaterCol()
    this.searchLogList()
    window.addEventListener('resize', this.setWaterCol)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.setWaterCol)
  },
  methods: {
    // 设置瀑布流容器列数
    setWaterCol () {
      this.waterCol = Math.floor((document.documentElement.clientWidth - 210 - 10 - 64) / 290)
    },
    // 获取群欢迎语列表
    searchLogList () {
      const params = {
        start: (this.pagination.page - 1) * this.pagination.size,
        length: this.pagination.size,
        searchMap: { ...this.searchMap }
      }
      this.$http.fetch(this.$api.weWork.groupWelcomeCode.getList, params).then(resp => {
        this.dataList = []
        setTimeout(() => {
          this.dataList = resp.result.data
          this.$nextTick(() => {
            if (this.$refs.waterfall) {
              // console.log(this.$refs.waterfall, 'this.$refs.waterfall')
              // console.log(this.$refs.waterfall.data, 'this.$refs.waterfall.data')
              // console.log(this.$refs.waterfall.loadedIndex, 'this.$refs.waterfall.loadedIndex')
              // this.$refs.waterfall.resize()
              this.$waterfall.forceUpdate()
            }
          })
        }, 10)
        if (!resp.result.data) {
          this.showDatas = false
        } else {
          this.showDatas = true
        }
        // this.$nextTick(() => {
        //   if (this.$refs.waterfall) {
        //     console.log(this.$refs.waterfall, 'this.$refs.waterfall')
        //     console.log(this.$refs.waterfall.data, 'this.$refs.waterfall.data')
        //     console.log(this.$refs.waterfall.loadedIndex, 'this.$refs.waterfall.loadedIndex')
        //     console.log(this.dataList, 'this.dataList')
        //     // this.$refs.waterfall.resize()
        //     this.$waterfall.forceUpdate()
        //   }
        // })
        this.pagination.total = +resp.result.recordsTotal || 0
      }).catch(resp => {
        this.$notify.error(getErrorMsg('查询群欢迎语列表失败', resp))
      }).finally(() => {
      })
    },
    onEscCancel () {
      this.escShow = false
    },
    onEscConfirm () {
      this.escShow = false
      this.deleteApi()
    },
    deleteItem (obj, idx) {
      this.deteleIndex = idx
      this.deteleObj = obj
      this.escShow = true
    },
    /**
     * 图片、视频预览
     */
    showPreview (obj, type) {
      let list = []
      list.push(+obj.otherMsgType === 1 ? obj.imageUrl : obj.videoUrl)
      this.$refs.preview.toggleShow(0, list, type)
    },
    // 删除群欢迎语接口
    deleteApi () {
      const params = {
        uuid: this.deteleObj.uuid
      }
      this.$http.fetch(this.$api.weWork.groupWelcomeCode.deleteByUUID, params).then(resp => {
        this.searchLogList()
      }).catch(resp => {
        this.$notify.error(getErrorMsg('删除群欢迎语失败', resp))
      }).finally(() => {
      })
    },
    /**
     * 跳转新建群欢迎语
     */
    newCode () {
      this.$router.push({ name: 'WeWorkGroupWelcomeCodeEdit', query: { type: 'add' } })
    },
    /**
     * 跳转编辑群欢迎语
     */
    editCode (id) {
      this.$router.push({ name: 'WeWorkGroupWelcomeCodeEdit', query: { id, type: 'edit' } })
    },
    /**
     * 跳转查看群欢迎语
     */
    lookCode (id) {
      this.$router.push({ name: 'WeWorkGroupWelcomeCodeEdit', query: { id, type: 'look' } })
    },
    // 富文本转换
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
    /**
     * 每页条数发生变化
     */
    handleSizeChange (size) {
      this.pagination = {
        ...this.pagination,
        size,
        page: 1
      }
      this.searchLogList()
    },
    /**
     * 页码发生变化
     */
    handlePageChange (page) {
      this.pagination.page = page
      this.searchLogList()
    }
  }
}
</script>

<style scoped>
  @import "@theme/variables.pcss";

  @component-namespace history {
    @b main {
      position: relative;
      width: 100%;
      height: calc(100vh - var(--head-nav-height) - 31px);
      /* background-color: var(--theme-color-white); */
      border-radius: var(--default-radius-mini);
    }
    .card-content{
      height: calc(100vh - var(--head-nav-height) - 31px - 48px - 16px - 64px - 16px - 38px);
    }
    .no-date-area{
      height: calc(100vh - var(--head-nav-height) - 31px - 48px - 16px - 64px - 16px - 38px - 64px);
    }
  }
  @media screen and (max-width: 1625px) {
    .history-main {
      height: calc(100vh - var(--head-nav-height-s) - 31px);
    }
    .card-content{
      height: calc(100vh - var(--head-nav-height-s) - 31px - 48px - 16px - 64px - 16px - 38px);
    }
    .no-date-area{
      height: calc(100vh - var(--head-nav-height-s) - 31px - 48px - 16px - 64px - 16px - 38px - 64px);
    }
  }
</style>
<style lang="scss" scoped>
.head-router{
  margin: -10px -10px 16px;
  padding-left: 16px;
  height: 48px;
  line-height: 48px;
  background: #fff;
  font-size: 16px;
  color: #262626;
}
.search-content{
  width: 100%;
  height: 64px;
  margin-bottom: 16px;
  background-color: #fff;
  display: flex;
  padding: 0 16px;
  justify-content: space-between;
  align-items: center;
  .search-left{
    display: flex;
    ::v-deep .el-input--small .el-input__inner{
      width: 160px;
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      box-sizing: border-box;
    }
    .serach-input{
      margin-right: 8px;
    }
    ::v-deep .el-input__suffix:before{
      display: none;
    }
    .el-input .el-input__suffix-inner svg{
      padding: 7px;
    }
    .search-icon {
      font-size: 30px;
    }
  }
}
.card-content{
  width: 100%;
  padding: 32px;
  box-sizing: border-box;
  background-color: #fff;
  border-bottom: 1px solid #F0F0F0;
  .card-scroll{
    display: flex;
  }
  .card-item{
    width: 274px;
    // height: 325px;
    padding: 16px;
    box-sizing: border-box;
    background: #F8F9FB;
    border-radius: 4px;
    margin-right: 16px;
    margin-bottom: 16px;
    .item-name{
      font-size: 14px;
      color: #383838;
      letter-spacing: 0;
      line-height: 20px;
      font-weight: 500;
    }
    .item-time{
      font-size: 12px;
      color: #909399;
      letter-spacing: 0;
      line-height: 20px;
      font-weight: 400;
      margin: 4px 0 8px 0;
    }
    .item-text{
      width: 242px;
      margin-bottom: 8px;
      font-size: 12px;
      color: #383838;
      letter-spacing: 0;
      line-height: 20px;
      font-weight: 400;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      word-break: break-all;
      line-clamp: 2;
      .showContent {
        word-break: break-all;
      }
      .content-tooltip-view {
        max-height: 200px;
        overflow: scroll;
        &::-webkit-scrollbar-thumb {
          border-radius: 4px;
          background: #9093994d;
        }
        &::-webkit-scrollbar {
          width: 2px;
          height: 6px;
        }
      }
    }
    .item-image{
      width: 242px;
      margin-bottom: 8px;
      .link-block{
        width: 242px;
        max-height: 127px;
        background: #FFFFFF;
        border: 0.5px solid #EEEEEE;
        border-radius: 4px;
        padding: 16px;
        box-sizing: border-box;
        .link-title{
          width: 100%;
          margin-bottom: 4px;
          font-size: 12px;
          line-height: 17px;
          color: #262626;
          font-weight: 500;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          word-break: break-all;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .link-content{
          display: flex;
          height: 58px;
          .link-text{
            width: 143px;
            // line-height: 18px;
            margin-right: 8px;
            // font-size: 10px; 待处理，自动缩放最小字体
            // transform: scale(0.83);
            transform-origin: left;
            color: #8C8C8C;
            font-weight: 400;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            line-clamp: 3;
            word-break: break-all;
            -webkit-box-orient: vertical;
          }
          .link-image{
            width: 58px;
            height: 58px;
          }
        }
      }
      .image-block{
        position: relative;
        height: 165px;
      }
      .video-block{
        position: relative;
        display: inline-block;
        height: 165px;
        cursor: pointer;
        .video-mask{
          position: absolute;
          top: calc(50% - 6.5px);
          left: 50%;
          width: 60px;
          height: 60px;
          transform: translate(-50%, -50%);
          img{
            width: 60px;
            height: 60px;
          }
        }
      }
      .mini-block{
        width: 162px;
        max-height: 204px;
        background: #FFFFFF;
        border: 0.5px solid #EEEEEE;
        border-radius: 2px;
        padding: 8px 8px 4px;
        box-sizing: border-box;
        .mini-title{
          display: flex;
          align-items: center;
          width: 144px;
          margin-bottom: 4px;
          .mini-title-circle{
            width: 14px;
            height: 14px;
            background-color: #D9D9D9;
            border-radius: 50%;
            margin-right: 4px;
          }
          .mini-title-text{
            font-size: 12px;
            color: #909399;
            letter-spacing: 0;
            font-weight: 400;
          }
        }
        .mini-desc{
          width: 144px;
          font-size: 12px;
          color: #383838;
          letter-spacing: 0;
          font-weight: 400;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          word-break: break-all;
          -webkit-box-orient: vertical;
        }
        .mini-image{
          width: 144px;
          height: 107px;
          margin-bottom: 8px;
          img{
            width: 144px;
            height: 107px;
          }
        }
        .mini-bottom{
          display: flex;
          align-items: center;
          border-top: 0.5px solid #EBEBEB;
          padding-top: 4px;
          .icon-xiaochengxu2{
            font-size: 8px;
            color: #7586DB;
            letter-spacing: 0;
            font-weight: 400;
          }
          .mini-bottom-name{
            font-size: 12px;
            color: #909399;
            letter-spacing: 0;
            font-weight: 400;
          }
        }
      }
    }
    .item-opt{
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
    .opt-btn{
      font-size: 12px;
      color: #0094FC;
      letter-spacing: 0;
      line-height: 20px;
      font-weight: 400;
      cursor: pointer;
      margin-left: 8px;
    }
  }
}
.tipsShowTitle {
  padding: 6px 3px;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}
.tipsShowContent {
  padding: 16px 6px;
  color: #595959;
  font-size: 14px;
}
.ns-warm-cricle {
  display: inline-block;
  text-align: center;
  line-height: 14px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ffaa00;
  color: #fff;
  margin-right: 10px;
}
::v-deep .el-dialog__footer {
  padding: 16px !important;
}
// ::v-deep .el-scrollbar__view {
//   min-height: 100%;
// }
.no-date-area {
  width: 100%;
  // height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .no-data {
    height: 282px;
    width: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    img {
      width: 220px;
      height: 220px;
    }
    span {
      font-size: 14px;
      color: #8C8C8C;
      line-height: 22px;
    }
  }
}
</style>
