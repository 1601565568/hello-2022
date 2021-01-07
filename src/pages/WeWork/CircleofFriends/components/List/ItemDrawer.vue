<template>
  <div class="item-content">
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
                src="https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1575118738,3084263396&fm=111&gp=0.jpg"
              />
            </div>
            <div class="user-content">
              <div class="user-name">哈哈哈啊</div>
              <div class="user-store">
                所属门店：西湖区线下门店1、XXX门店、XXXXX门店
              </div>
              <div class="user-text">
                今天在西湖区的线下门店试穿了一件格子花纹的棉毛混纺西装，他颜色是灰白色。产品价格：¥899.00
              </div>
              <div class="user-sharePic">
                <img
                  src="https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1819216937,2118754409&fm=26&gp=0.jpg"
                />
                <img
                  src="https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1819216937,2118754409&fm=26&gp=0.jpg"
                />
                <img
                  src="https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1819216937,2118754409&fm=26&gp=0.jpg"
                />
                <img
                  src="https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1819216937,2118754409&fm=26&gp=0.jpg"
                />
                <img
                  src="https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1819216937,2118754409&fm=26&gp=0.jpg"
                />
              </div>
              <div class="user-time">
                <span>2020/07/18 12:00</span>
              </div>
            </div>
          </div>
          <div class="comment">
            <div class="givePic">
              <div class="comment-icon"><Icon type="dianzan" class="comment-icon__dianzan"/></div>
              <div class="givePic-list">
                <img
                  src="https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1575118738,3084263396&fm=111&gp=0.jpg"
                />
                <img
                  src="https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1575118738,3084263396&fm=111&gp=0.jpg"
                />
                <img
                  src="https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1575118738,3084263396&fm=111&gp=0.jpg"
                />
                <img
                  src="https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1575118738,3084263396&fm=111&gp=0.jpg"
                />
                <img
                  src="https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1575118738,3084263396&fm=111&gp=0.jpg"
                />
                <img
                  src="https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1575118738,3084263396&fm=111&gp=0.jpg"
                />
                <img
                  src="https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1575118738,3084263396&fm=111&gp=0.jpg"
                />
                <img
                  src="https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1575118738,3084263396&fm=111&gp=0.jpg"
                />
                <img
                  src="https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1575118738,3084263396&fm=111&gp=0.jpg"
                />
                <img
                  src="https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1575118738,3084263396&fm=111&gp=0.jpg"
                />
                <img
                  src="https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1575118738,3084263396&fm=111&gp=0.jpg"
                />
                <img
                  src="https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1575118738,3084263396&fm=111&gp=0.jpg"
                />
                <img
                  src="https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1575118738,3084263396&fm=111&gp=0.jpg"
                />
                <img
                  src="https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1575118738,3084263396&fm=111&gp=0.jpg"
                />
                <img
                  src="https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1575118738,3084263396&fm=111&gp=0.jpg"
                />
              </div>
            </div>
            <div class="comment-list__warpper">
              <div class="comment-list__icon"><Icon type="friendpinglun" class="comment-icon__dianzan" /></div>
              <div class="comment-list__text">
                <div class="comment-list__text__user">
                  <img
                    src="https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1575118738,3084263396&fm=111&gp=0.jpg"
                  /><span>刘炳林</span>
                </div>
                <div class="comment-list__text__time">2020/07/18 12:00</div>
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
  </div>
</template>
<script>
import closeIcon from '../../Images/close.png'
import nsEditIcon from '../../Images/ns-edit.png'
import nsPreviewIcon from '../../Images/ns-preview.png'
export default {
  data () {
    return {
      closeIcon,
      nsEditIcon,
      nsPreviewIcon
    }
  },
  props: {
    data: {
      default () {}
    }
  },
  methods: {
    handleClose () {
      this.$emit('onClose')
    },
    handlePreview () {
      // this.$emit('onPreview', this.data.guestCodeId)
    },
    handleDelect () {
      // this.$emit('onDelect', this.data.guestCodeId)
    },
    handleEdit () {
      // this.$emit('onEdit', { guestCodeId: this.data.guestCodeId })
    },
    handleNext () {
      this.$emit('onNext')
    },
    handlePrev () {
      this.$emit('onPrev')
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
        .user-time {
          margin-bottom: 16px;
          color: #606266;
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
          width: 16px;
          // background: #f00;
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
        }
        .comment-list__text {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 48px;
          flex: 1;
          padding: 8px;
          border-radius: 2px;
          &:hover {
            background: #F5F5F5;
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
          color: #8C8C8C;
        }
      }
    }
    // padding: 0px 16px
    // h4 {
    //   font-size: 14px;
    //   color: #262626;
    //   line-height: 22px;
    //   margin-top: 21px;
    //   margin-bottom: 16px;
    // }
    // .poster {
    //   background: #F5F5F5;
    //   border-radius: 4px;
    //   border-radius: 4px;
    //   padding: 32px 0;
    //   text-align: center;
    //   img {
    //     width: 188px;
    //   }
    // }
    // .content {
    //   font-size: 14px;
    //   color: #595959;
    //   text-align: justify;
    //   line-height: 28px;
    // }
  }
  // .el-tag--success {
  //   background: #F7FFF0;
  //   border: 1px solid #53BF1D;
  //   color: #262626;
  // }
  // .el-tag--info {
  //   background: #F5F5F5;
  //   border: 1px solid #D9D9D9;
  //   color: #262626;
  // }
  // .el-tag--warning {
  //   background: #FFFBE6;
  //   border: 1px solid #FFAE0D;
  //   color: #262626;
  // }
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
// .dwaer-popper {
//   min-width: 0 !important;
// }
</style>
<style lang="css">
/* .dwaer-popper {
  min-width: 0 !important;
} */
</style>
