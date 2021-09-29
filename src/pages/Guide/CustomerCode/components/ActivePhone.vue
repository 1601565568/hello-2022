<template>
  <div>
    <Phone>
      <template v-slot:content>
        <div class="content-view">
          <div>
            <img class="phone-view" src="../Images/iphoneActive.jpg"/>
          </div>
          <div class="info-view">
            <div class="user-info">
              <img :class="pageObj.headStyle === 0 ? 'user-img ': 'user-img user-img-rund'" src="https://tse1-mm.cn.bing.net/th/id/R-C.f734c09c3d6d4b144ef9677b12f48156?rik=6RhzLoO3GplZOw&riu=http%3a%2f%2fpic32.nipic.com%2f20130815%2f11947767_140701376136_2.jpg&ehk=1HM0HfhEOvCVbq91Uy9KKvYwvtb1NvtWJV30gOAy8Rs%3d&risl=&pid=ImgRaw&r=0"/>
              <span>没有毛的猫</span>
            </div>
            <div class="invitation-text">邀请好友0人</div>
          </div>
          <div class="scroll-view" :style="{background:showColor.bgColor}">
            <div class="banner-view">
              <img :src="pageObj.bannerUrl || defBanner" class="banner-img"/>
            </div>
            <div class="time-view">
              <div class="time-title-view"></div>
              <div class="time-content-view">
                <div class="goods-view">
                  <img style="width: 90px;height: 90px;border-radius: 6px;" :src="pageObj.activeInfo.image || defGoodsUrl" alt="" srcset="">
                  <div style="margin-left:8px;">
                    <div class="goods-title">{{pageObj.activeInfo.goodsName}}</div>
                    <div class="goods-desc">{{pageObj.activeInfo.goodsDes}}</div>
                  </div>
                </div>
                <div class="progress-view">
                  <div style="margin-bottom:8px;">
                    <div class="tip-view">已邀请：4人，还需邀请1人</div>
                    <div class="triangle-down"></div>
                  </div>
                  <el-progress :percentage="50" :show-text="false" color="#FF6A41"></el-progress>
                </div>
                <div class="get-number-view">
                  <div class="number-img">
                    <div v-for="(item,index) in imgs" :key="index">
                      <img :src="item" class="img-view"/>
                    </div>
                  </div>
                  <div class="">已有{{pageObj.activeInfo.number}}人领取</div>
                </div>
                <div class="get-view" :style="{background:pageObj.activeInfo.getColor || showColor.mainColor}">领取奖励</div>
              </div>
            </div>
            <div class="friends-view">
              <div class="rules-title-view">成功邀请好友4人</div>
              <div class="friends-content-view">
                <div v-for="(item,index) in fiends" :key="index">
                  <div class="friends-list">
                    <div>
                      <img :src="item.url" style="width:24px;height:24px;margin-right:4px"/>
                      <span>{{item.name}}</span>
                    </div>
                    <div style="font-size:12px;color:#8C8C8C;">{{item.time}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="rules-view">
              <div class="rules-title-view">活动规则</div>
              <div class="rules-content-view">
                <div>{{pageObj.rules}}</div>
                <div style="margin-top:8px">活动有效期：永久有效</div>
              </div>
            </div>
            <div class="register-view">
              <img class="register-view-img" :src="pageObj.regUrl||defRegUrl"/>
            </div>
          </div>
          <div class="share-view">
            <div class="share-button" :style="{background:pageObj.share.color}">{{pageObj.share.name}}</div>
          </div>
        </div>
      </template>
    </Phone>
  </div>
</template>

<script>
import Phone from './Phone'
import ElProgress from '@nascent/nui/lib/progress'
export default {
  name: 'activephone',
  components: {
    Phone,
    ElProgress
  },
  props: {
    value: Object,
    showColor: Object
  },
  computed: {
    pageObj () {
      return this.value
    }
  },
  data () {
    return {
      fiends: [
        {
          url: 'https://images.pexels.com/photos/163046/welcome-to-our-home-welcome-tablet-an-array-of-163046.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
          name: '没有毛的猫',
          time: '2020/09/10 09:00:08'
        },
        {
          url: 'https://images.pexels.com/photos/163046/welcome-to-our-home-welcome-tablet-an-array-of-163046.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
          name: '没有毛的猫',
          time: '2020/09/10 09:00:08'
        },
        {
          url: 'https://images.pexels.com/photos/163046/welcome-to-our-home-welcome-tablet-an-array-of-163046.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
          name: '没有毛的猫',
          time: '2020/09/10 09:00:08'
        },
        {
          url: 'https://images.pexels.com/photos/163046/welcome-to-our-home-welcome-tablet-an-array-of-163046.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
          name: '没有毛的猫',
          time: '2020/09/10 09:00:08'
        }
      ],
      imgs: [
        'https://images.pexels.com/photos/163046/welcome-to-our-home-welcome-tablet-an-array-of-163046.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        'https://images.pexels.com/photos/163046/welcome-to-our-home-welcome-tablet-an-array-of-163046.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        'https://images.pexels.com/photos/163046/welcome-to-our-home-welcome-tablet-an-array-of-163046.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
      ],
      defBanner: 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/image/iphoneBanner.png',
      defGoodsUrl: 'https://tse1-mm.cn.bing.net/th/id/R-C.c2a271d6ee4c369aabb236109338b926?rik=EALdV8BlkAdMyQ&riu=http%3a%2f%2fpic18.nipic.com%2f20111228%2f5252423_135810845000_2.jpg&ehk=3BgyAioO14HCKwRr0LIr2D%2fkjxgwP9s3deUTHC9lPTk%3d&risl=&pid=ImgRaw&r=0',
      defRegUrl: 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/image/regUrl.png'
    }
  }
}
</script>

<style scoped>
.content-view {
  position: relative;
  height: 100%;
}
.phone-view {
  width: 320px;
  height: 62px;
  object-fit: contain;
}
.info-view {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 8px;
  padding-right: 8px;
  background-color: white;
  height: 42px;
  align-items: center;
}
.share-view {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 68px;
  background-color: white;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.share-button {
  width: 290px;
  height: 40px;
  background: #FF6A41;
  border-radius: 20.48px;
  text-align: center;
  font-size: 14px;
  color: #FFFFFF;
  text-align: center;
  line-height: 40px;
}
.invitation-text {
  font-size: 14px;
  color: #262626;
  font-weight: 500;
}
.user-info {
  display: flex;
  flex-flow: row;
  font-size: 14px;
  color: #262626;
}
.user-img {
  width: 24px;
  height: 24px;
  background-color:white;
  margin-right: 10px;
}
.user-img-rund {
  border-radius: 50%;
}
.banner-img {
  width: 100%;
  height: 350px;
}
.scroll-view {
  max-height: calc(100% - 62px -42px -80px);
  overflow: scroll;
}
.time-view {
  background: #F57E61;
  border-radius: 12px;
  margin: 8px 16px;
  padding-top: 32px;
  padding-bottom: 16px;
}
.friends-view {
  background: #F57E61;
  border-radius: 12px;
  margin: 8px 16px;
  padding-top: 32px;
  padding-bottom: 16px;
}
.rules-view {
  background: #F57E61;
  border-radius: 12px;
  margin: 8px 16px;
  padding-top: 32px;
  padding-bottom: 16px;
}
.rules-content-view {
  padding: 16px;
  background-color: white;
  font-size: 14px;
  color: #595959;
  margin: 8px;
  border-radius: 8px;
}
.rules-title-view {
  font-size: 20px;
  color: #FFFFFF;
  line-height: 20px;
  width: 100%;
  text-align: center;
}
.friends-content-view {
  border-radius: 8px;
  margin: 8px;
  padding: 16px;
  background-color: white;
  font-size: 14px;
}

.friends-list {
  display: flex;
  flex-direction: row;
  height: 22px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.time-content-view {
  border-radius: 8px;
  margin: 8px;
  padding: 16px;
  background-color: white;
  font-size: 14px;
}
.get-view {
  margin-left: 16px;
  margin-right: 16px;
  height: 42px;
  border-radius: 24px;
  line-height: 42px;
  text-align: center;
  font-size: 17px;
  color: #FFFFFF;
}
.goods-view {
  display: flex;
  flex-direction: row;
  margin-bottom: 25px;
}
.goods-title {
  font-size: 14px;
  color: #262626;
  line-height: 22px;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
}

.goods-desc {
  font-size: 12px;
  color: #8C8C8C;
  line-height: 22px;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
}
.progress-view {
  margin-bottom: 16px;
}
.tip-view {
  width: 180px;
  background: #FF6A41;
  border-radius: 11px;
  font-size: 12px;
  color: #FFFFFF;
  line-height: 20px;
  padding-left: 14px;
  padding-right: 14px;
}
.triangle-down {
  margin-left: 20px;
  width: 0;
  height: 0;
  border-left: 3px solid transparent;
  border-right: 3px solid transparent;
  border-top: 3px solid #FF6A41;
}
.get-number-view {
  display: flex;
  flex-direction: row;
  font-size: 12px;
  color: #595959;
  margin-bottom: 16px;
  align-items: center;
}
.img-view {
  width: 24px;
  height: 24px;
  border: 1px solid #FFFFFF;
  border-radius: 50%;
  margin-left: -8px;
}
.number-img {
  display: flex;
  flex-direction: row;
  margin-right: 8px;
}
.register-view {
  margin: 8px 16px;
}
.register-view-img {
  width: 100%;
  height: 91px;
  border-radius: 12px;
}
</style>
