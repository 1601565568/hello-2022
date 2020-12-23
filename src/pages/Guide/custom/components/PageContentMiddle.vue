<template>
  <div class="PageContentMiddle">
    <div class="iphone" ref="iphone" id="iphone">
      <div :class="pageTopBg">
        <div class="iphone-status">
          <img class="image" src="../image/iphonexcx_status.png" />
        </div>
        <div class="navigation">
          {{ menuListTitle }}
          <img src="../image/share.png" />
        </div>
      </div>
      <div class="iphone-content" refs="iphoneContent">
        <Component
          :settingCode="settingCode"
          :is="PageName"
          :editData="editData"
        ></Component>
        <!-- <Work /> -->
      </div>
      <div class="iphone-tabber">
        <img :src="pageTabBarImage" />
      </div>
    </div>
  </div>
</template>
<script>
import PageContentMiddle from './src/PageContentMiddle.js'
import Work from './guide/work'
import Achievement from './guide/achievement'
import My from './guide/my'
import SAchievement from './shoper/sAchievement'
import ManageMember from './shoper/manageMember'
PageContentMiddle.components = {
  Work,
  Achievement,
  My,
  SAchievement,
  ManageMember
}
export default PageContentMiddle
</script>

<style scoped lang="scss">
.PageContentMiddle {
  min-height: calc(100vh - 183px);
}
@media screen and (max-width: 1625px) {
  .PageContentMiddle {
    min-height: calc(100vh - 163px);
  }
}
.daogou {
  background: #0091fa;
}
.dianzhang {
  background: #ff532a;
}
.PageContentMiddle {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fbfbfb;
  border-left: 1px solid #e8e8e8;
  border-right: 1px solid #e8e8e8;
  img {
    image-rendering: -moz-crisp-edges;
    image-rendering: -o-crisp-edges;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    -ms-interpolation-mode: nearest-neighbor;
  }
  .iphone {
    margin: 40px 0;
    width: 375px;
    height: 667px;
    background: #f5f5f5;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.08);
    .image {
      width: 375px;
    }
    .iphone-status {
      height: 20px;
    }
    .navigation {
      position: relative;
      height: 44px;
      text-align: center;
      line-height: 44px;
      color: #fff;
      font-size: 17px;
      img {
        position: absolute;
        top: 50%;
        right: 16px;
        transform: translate(0%, -50%);
        width: 81px;
        height: 31px;
      }
    }
    .iphone-content {
      height: 559px;
      overflow: auto;
      scrollbar-width: none;
      // &::-webkit-scrollbar {
      //   display: none;
      //   /*滚动条整体样式*/
      //   width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
      //   height: 1px;
      // }
      // &::-webkit-scrollbar-thumb {
      //   /*滚动条里面小方块*/
      //   border-radius: 100px;
      //   // background: rgba(0, 0, 0, 0.45);
      //   background: rgba(38, 38, 38, 0);
      // }
      // &::-webkit-scrollbar-track {
      //   /*滚动条里面轨道*/
      //   display: none;
      //   // border-radius: 100px;
      // }
      // &:hover::-webkit-scrollbar-thumb {
      //   background: rgba(38, 38, 38, 0.45);
      // }
    }
    .iphone-tabber {
      img {
        width: 100%;
        height: 50px;
      }
    }
  }
}
</style>
