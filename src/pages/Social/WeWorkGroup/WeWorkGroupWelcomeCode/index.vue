<template>
  <div class="history-main">
    <div class="head-router">群欢迎语</div>
    <div class="search-content">
      <div class="search-left">
        <el-input class="serach-input" v-model="model.code" placeholder="请输入群欢迎语"  @keyup.enter.native="searchLogList">
          <Icon type="ns-search" slot="suffix" class='search-icon' @click="searchLogList"></Icon>
        </el-input>
        <el-input class="serach-input" v-model="model.name" placeholder="请输入创建人姓名"  @keyup.enter.native="searchLogList">
          <Icon type="ns-search" slot="suffix" class='search-icon' @click="searchLogList"></Icon>
        </el-input>
      </div>
      <NsButton type="primary" class="add-button" size="large" @click="newCode">新建</NsButton>
    </div>
    <el-scrollbar ref="fullScreen" class="card-content">
      <div class="card-scroll">
        <div class="card-item">
          <div class="item-name">创建人姓名</div>
          <div class="item-time">2010-02-17 12:33:44</div>
          <div class="item-text">
            <el-tooltip
              :enterable="true"
              popper-class="table-body__tooltip"
            >
              <div slot="content" v-html="strToRichText('这是文本消息样式这是文本消息样式这是文本消息样式这是文本消息样式这是文本消息样消息样消息样')" class="content-tooltip-view"></div>
              <div class="showContent">
                <EmojiText text='这是文本消息样式这是文本消息样式这是文本消息样式这是文本消息样式这是文本消息样消息样消息样' />
              </div>
            </el-tooltip>
          </div>
          <div class="item-image">
            <div class="image-block">
              <!-- '+ ?x-oss-process=image/resize,m_lfit,h_165,w_242' -->
              <img class="" src="https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/test/202112/80000002/1@@f049f87f-3bf8-4ec7-b9db-754422a18f4f(2)@@eb4adcb1-a034-4d2b-8781-abfc6e3bb496.jpg?x-oss-process=image/resize,m_lfit,h_165,w_242" alt="">
            </div>
            <div v-if="false" class="video-block">
              <img class="" src="https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/test/202112/80000002/1@@f049f87f-3bf8-4ec7-b9db-754422a18f4f(2)@@eb4adcb1-a034-4d2b-8781-abfc6e3bb496.jpg?x-oss-process=image/resize,m_lfit,h_165,w_242" alt="">
              <div class="video-mask">
                <img src="../../../../assets/play-video.png" alt="">
              </div>
            </div>
            <div v-if="false" class="link-block">
              <div class="link-title">分享邀好友，赢取橘朵PUCK15色飞鱼盘。画出梦幻氧气感，清冷梦幻氧气感，清冷</div>
              <div class="link-content">
                <div class="link-text">你好～恭喜你成功参与本次福利活动，分享下方海报，邀请5位好友扫码助力邀请5位好友扫码助力邀请5位好友扫码助力</div>
                <img class="link-image" src="" alt="">
              </div>
            </div>
          </div>
          <div class="item-opt">
            <span class="opt-btn">编辑</span>
            <span class="opt-btn">查看</span>
            <span class="opt-btn">删除</span>
          </div>
        </div>
        <div class="card-item">
          <div class="item-name">创建人姓名</div>
          <div class="item-time">2010-02-17 12:33:44</div>
          <div class="item-text">这是文本消息样式这是文本消息样式这是文本消息样式这是文本消息样式这是文本消息样消息样消息样</div>
          <div class="item-image">
            <div class="image-block">
              <!-- '+ ?x-oss-process=image/resize,m_lfit,h_165,w_242' -->
              <img class="" src="https://codoorcdn.oss-cn-hangzhou.aliyuncs.com/magic-cube/images/home/guess-answer.png?x-oss-process=image/resize,m_lfit,h_165,w_242" alt="">
            </div>
          </div>
          <div class="item-opt">
            <span class="opt-btn">编辑</span>
            <span class="opt-btn">查看</span>
            <span class="opt-btn">删除</span>
          </div>
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
  </div>
</template>
<script>
import EmojiText from '@/components/NewUi/EmojiText'
import Preview from '@/components/NsPreview'
export default {
  data () {
    return {
      model: {
        code: '',
        name: ''
      },
      // 分页配置
      pagination: {
        size: 15,
        sizeOpts: [15, 25, 50, 100],
        page: 1,
        total: 0
      }
    }
  },
  components: { EmojiText, Preview },
  methods: {
    searchLogList () {},
    /**
     * 跳转新建群欢迎语
     */
    newCode () {
      this.$router.push({ name: 'WeWorkGroupWelcomeCodeEdit', params: { type: 'add' } })
    },
    /**
     * 图片、视频预览
     */
    showPreview (current, row, data) {
      let type = +row.type === 2 ? 'video' : 'img'
      let item = data.mediaList[current]
      let imgs = []
      data.mediaList.forEach(item => {
        imgs.push(item.type === 1 || item.type === 5 ? item.content.image : item.content.video)
      })
      this.$refs.preview.toggleShow(current, imgs, type, true)
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
      // this.reloadList()
    },
    /**
     * 页码发生变化
     */
    handlePageChange (page) {
      this.pagination.page = page
      // this.reloadList()
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
  }
  @media screen and (max-width: 1625px) {
    .history-main {
      height: calc(100vh - var(--head-nav-height-s) - 31px);
    }
    .card-content{
      height: calc(100vh - var(--head-nav-height-s) - 31px - 48px - 16px - 64px - 16px - 38px);
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
      height: 165px;
      margin-bottom: 8px;
      .link-block{
        width: 242px;
        height: 127px;
        background: #FFFFFF;
        border: 0.5px solid #EEEEEE;
        border-radius: 4px;
        padding: 16px;
        box-sizing: border-box;
        .link-title{
          width: 100%;
          font-size: 12px;
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
            margin-right: 8px;
            font-size: 10px;
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
      }
      .video-block{
        position: relative;
        display: inline-block;
        .video-mask{
          position: absolute;
          top: 50%;
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
</style>
