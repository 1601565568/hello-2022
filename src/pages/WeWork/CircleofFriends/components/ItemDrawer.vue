<template>
  <div class="item-content" v-loading="loading"
      element-loading-text="数据导入中，请稍等…">>
    <div class="item-wrapper">
      <div class="item-header">
        <div class="master-close" @click="handleClose">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="content">
        <div class="content-header">
          <h1 class="content-header__title">朋友圈详情</h1>
          <!-- <h1>
            <h3>朋友圈详情</h3>
          </h1> -->
        </div>
        <div class="content-detail">
          <div class="user-friend">
            <div class="user-pic">
              <img
                :src="drawerDate.guidePic || defaultPic"
              />
            </div>
            <div class="user-content">
              <div class="user-name">{{drawerDate.guideName}}</div>
              <div class="user-store">
                {{drawerDate.shopName}}
              </div>
              <div class="user-text">
              {{drawerDate.textContent}}
              </div>
              <div class="user-sharePic" v-if="drawerDate.imageMediaId && drawerDate.linkTitle == null">
                <img
                  v-for="(picitem, picindex) in drawerDate.imageMediaId"
                  :key="picindex"
                  :src="picitem || defaultPic"
                  @click="togglePreview(0, drawerDate.imageMediaId, 'img')"
                />
              </div>
              <!-- 视频   -->
              <div
              v-if="drawerDate.videoMediaId"
                class="user-video"
                @click="
                  togglePreview(
                    0,
                    [
                      `${drawerDate.videoMediaId}`
                    ],
                    'video'
                  )
                "
              >
                <video
                   :src="drawerDate.videoMediaId"
                   :poster="drawerDate.videoThumbMediaId"
                >
                  您的浏览器暂不支持播放该视频，请升级至最新版浏览器。
                </video>
                <div class="tableItem-video__mask">
                  <div class="tableItem-video__wrapper">
                    <Icon type="begin" />
                  </div>
                </div>
              </div>
              <div class="user-card" v-if="drawerDate.linkTitle">
                <a
                    class="Abox"
                    :href="drawerDate.linkUrl"
                    target="_blank"
                >
                 <div class="friendPic" v-if="drawerDate.imageMediaId">
                    <img
                      :src="drawerDate.imageMediaId[0]"
                      class="scope-title_img"
                    />
                  </div>
                <p>
                  {{drawerDate.linkTitle}}
                </p>
                </a>
              </div>
              <div class="user-time">
                <span>{{drawerDate.createTime}}</span>
                <el-popover placement="bottom-start" trigger="click" @show="showPopver" v-if="drawerDate.visibleType == 0">
                  <div class="canSee">
                    <h3>可见客户</h3>
                    <div class="canSee-userList">
                      <div
                        class="userimageList"
                        v-for="(item, index) in visibleList"
                        :key="index"
                      >
                        <img :src="item.pic || defaultPic" />
                        <p>{{ item.name }}</p>
                      </div>
                    </div>
                  </div>
                  <span slot="reference"
                    ><span class="previewIcon">
                      <Icon
                        type="kejiankehu"
                        class="comment-icon__dianzan"
                      /> </span
                  ></span>
                </el-popover>
              </div>
            </div>
          </div>
          <div class="comment"  v-if="drawerDate.likeList.length > 0 || drawerDate.commentList.length > 0">
            <div class="givePic" v-if="drawerDate.likeList.length > 0">
              <div class="comment-icon">
                <Icon type="dianzan" class="comment-icon__dianzan" />
                <!-- <img :src="dianzanIcon" class="comment-icon__dianzan" /> -->
              </div>
              <div class="givePic-list">
                <img
                v-for="(likeItem, likeIndex) in drawerDate.likeList" :key="likeIndex"
                :src="likeItem.pic || defaultPic"
                />
              </div>
            </div>
            <div class="comment-list__warpper"  v-for="(commentItem,commentindex) in drawerDate.commentList"  :key="commentindex">
              <div class="comment-list__icon">
                <Icon type="friendpinglun" class="comment-icon__dianzan" v-if="commentindex === 0" />
                <!-- <img :src="pinglunIcon" class="comment-icon__dianzan" /> -->
              </div>
              <div class="comment-list__text">
                <div class="comment-list__text__user">
                  <img
                    :src="commentItem.pic || defaultPic "
                  /><span>{{commentItem.name}}</span>
                </div>
                <div class="comment-list__text__time">{{commentItem.sendTime}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="pagecontent-left">
          <div class="content-item" @click="handlePrev">
            <i class="el-icon-arrow-left"></i>上一个
          </div>
          <div class="content-item" @click="handleNext">
            下一个<i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>
    <Preview ref="preview" />
  </div>
</template>
<script>
import Preview from '@/components/NsPreview'
export default {
  components: { Preview },
  data () {
    return {
      visible: false,
      visibleList: [],
      defaultPic: 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/app/default-user.png',
      loading: false // 防重复提交
    }
  },
  props: {
    // 点击查看可用客户
    momentIdSend: {
      type: String,
      default: ''
    },
    // 弹窗数据
    drawerDate: {
      type: Object
    }
  },
  methods: {
    handleClose () {
      this.$emit('onClose')
    },
    handleNext () {
      this.$emit('onNext')
    },
    handlePrev () {
      this.$emit('onPrev')
    },
    /**
     * 图片、视频预览
     */
    togglePreview (current, list, type) {
      this.$refs.preview.toggleShow(current, list, type)
    },
    // 可见客户弹窗
    showPopver () {
      this.loading = true
      const momentId = this.momentIdSend
      this.$http.fetch(this.$api.guide.momentList.getVisibleUser, { momentId }).then(res => {
        this.visibleList = res.result
        this.loading = false
      }).catch((err) => {
        this.loading = false
        this.$notify.error(err, '操作失败')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.item-content {
  height: 100vh;
  overflow-y: auto;
}
.item-wrapper {
  position: relative;
  padding: 12px 16px;
  min-height: 100vh;
  padding-bottom: 50px;
  .item-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
    .master-close {
      font-size: 16px;
    }
    .icon-item {
      height: 24px;
      width: 24px;
      border: 1px solid #d9d9d9;
      border-radius: 2px;
      border-radius: 2px;
      text-align: center;
      line-height: 24px;
      float: left;
      margin-left: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        height: 12px;
        width: 12px;
      }
    }
  }
  .content {
    height: calc(100vh - 125px);
    overflow: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .content-header {
    margin-bottom: 32px;
    .content-header__title {
      margin: 0;
      font-size: 16px;
      color: #262626;
    }
  }
  .content-detail {
    color: #262626;
    font-size: 14px;
    line-height: 22px;
    .user-friend {
      display: flex;
      .user-pic {
        width: 48px;
        margin-right: 8px;
        img {
          width: 48px;
          height: 48px;
          border-radius: 4px;
          object-fit: cover;
        }
      }
      .user-content {
        flex: 1;
        .user-name {
          font-weight: bold;
          margin-bottom: 4px;
        }
        .user-store {
          color: #8c8c8c;
          margin-bottom: 12px;
        }
        .user-text {
          margin-bottom: 8px;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .user-text:hover{
          margin-bottom: 8px;
          // text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 999;
          line-clamp: 999;
          -webkit-box-orient: vertical;
        }
        .user-sharePic {
          margin-bottom: 8px;
          display: flex;
          flex-wrap: wrap;
          img {
            width: 122px;
            height: 122px;
            margin-bottom: 4px;
            margin-right: 4px;
            object-fit: cover;
            &:nth-of-type(3n) {
              margin-right: 0px;
            }
          }
        }
        .user-video {
          position: relative;
          width: 214px;
          height: 160px;
          margin-bottom: 12px;
          > video {
            width: 100%;
            height: 100%;
            border-radius: 3px;
            -o-object-fit: cover;
            object-fit: cover;
          }
          .tableItem-video__mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.25);
            cursor: pointer;
            border-radius: 3px;
          }
          .tableItem-video__wrapper {
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
        .user-card {
          display: flex;
          align-items: center;
          background: #f5f5f5;
          padding: 8px;
          height: 80px;
          font-size: 12px;
          color: #606266;
          margin-bottom: 12px;
       .Abox {
          display: flex;
          align-items: center;
      .friendPic {
          width: 64px;
          height: 64px;
          margin-right: 8px;
      img {
          width: 100%;
        }
     }
    }
          img {
            width: 64px;
            height: 64px;
            border-radius: 3px;
            margin-right: 8px;
          }
        }
        .user-time {
          margin-bottom: 16px;
          color: #606266;
          display: flex;
        }
      }
    }
    .comment {
      background: #fbfbfb;
      border-radius: 4px;
      padding: 8px;
      .givePic {
        display: flex;
        margin-bottom: 8px;
        .comment-icon {
          // padding-top: 26px;
          width: 16px;
          // background: #f00;
          color: #0091FA;
          margin-top: 13px;
        }
        .givePic-list {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          padding: 8px 8px 4px 8px;
          img {
            width: 32px;
            height: 32px;
            margin-right: 4px;
            border-radius: 4px;
            object-fit: cover;
          }
        }
      }
      .comment-list__warpper {
        display: flex;
        .comment-list__icon {
          width: 16px;
          color: #0091FA;
          margin-top: 13px;
        }
        .comment-list__text {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 48px;
          flex: 1;
          padding: 8px;
          border-radius: 2px;
          flex-wrap: nowrap;
          &:hover {
            background: #f5f5f5;
          }
        }
        .comment-list__text__user {
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #595959;
          img {
            margin-right: 8px;
            width: 32px;
            height: 32px;
            border-radius: 4px;
          }
        }
        .comment-list__text__time {
          font-size: 12px;
          color: #8c8c8c;
        }
      }
    }
  }
  .footer {
    position: absolute;
    right: 16px;
    bottom: 12px;
  }
  .pagecontent-left {
    width: 223px;
    height: 32px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    border-radius: 2px;
    display: flex;
    position: relative;
    user-select: none;
    cursor: pointer;
    &:after {
      content: ' ';
      position: absolute;
      left: 50%;
      top: 4px;
      bottom: 4px;
      width: 1px;
      background-color: #e8e8e8;
    }
    .content-item {
      width: 50%;
      font-size: 14px;
      color: #595959;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.canSee {
  // width: 460px;
  width: 460px;
  padding: 8px 11px 5px 11px;
  h3 {
    font-size: 14px;
    color: #8c8c8c;
    margin-bottom: 13px;
  }
  .canSee-userList {
    display: flex;
    flex-wrap: wrap;
    .userimageList {
      width: 36px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-right: 20px;
      margin-bottom: 16px;
      &:nth-of-type(8n) {
        margin-right: 0px;
      }
    }
    img {
      width: 32px;
      height: 32px;
      border-radius: 3px;
      margin-bottom: 8px;
    }
    p {
      width: 36px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 12px;
      line-height: 12px;
      color: #262626;
    }
  }
}
.previewIcon {
  cursor: pointer;
  display: inline-block;
  margin-left: 16px;
  color: #8c8c8c;
  width: 20px;
  height: 20px;
}
.comment-icon__dianzan {
  font-size: 16px;
  color: #0091fa;
}
</style>
