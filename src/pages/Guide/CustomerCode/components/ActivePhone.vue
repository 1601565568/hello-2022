<template>
  <div>
    <Phone>
      <template v-slot:content>
        <div class="content-view">
          <div>
            <img class="phone-view" src="../Images/iphoneActive.jpg"/>
          </div>
          <div class="info-view" v-show="eidtList[0].status === 1">
            <div class="user-info">
              <img :class="pageObj.headStyle === 1 ? 'user-img ': 'user-img user-img-rund'" src="../Images/iphone-1.jpg"/>
              <span>裂变大师昵称</span>
            </div>
            <div class="invitation-text">邀请好友0人</div>
          </div>
          <div class="scroll-view" :style="{background:showColor.bgColor}">
            <div class="banner-view" v-show="eidtList[1].status === 1">
              <img :src="pageObj.bannerUrl || defBanner" class="banner-img"/>
            </div>
            <div class="time-view" :style="{background:showColor.mainColor + '66'}" v-show="eidtList[2].status === 1 || eidtList[3].status === 1">
              <div class="time-title-view" :style="{color:showColor.strColor}" v-show="eidtList[2].status === 1">
                <span class="iconfont icon-julihuodongjieshuhuanyou time-icon-dian"></span>
                <span class="rules-number" :style="{background:showColor.mainColor}">
                  <span class="iconfont icon-a-0 time-icon-dian"></span>
                </span>
                <span class="rules-number" :style="{background:showColor.mainColor}">
                  <span class="iconfont icon-a-4 time-icon-dian"></span>
                </span>
                <span class="iconfont icon-tian time-icon-dian"></span>
                <span class="rules-number" :style="{background:showColor.mainColor}">
                  <span class="iconfont icon-a-2 time-icon-dian"></span>
                </span>
                <span class="rules-number" :style="{background:showColor.mainColor}">
                  <span class="iconfont icon-a-3 time-icon-dian"></span>
                </span>
                <span>:</span>
                <span class="rules-number" :style="{background:showColor.mainColor}">
                  <span class="iconfont icon-a-1 time-icon-dian"></span>
                </span>
                <span class="rules-number" :style="{background:showColor.mainColor}">
                  <span class="iconfont icon-a-4 time-icon-dian"></span>
                </span>
                <span>:</span>
                <span class="rules-number" :style="{background:showColor.mainColor}">
                  <span class="iconfont icon-a-5 time-icon-dian"></span>
                </span>
                <span class="rules-number" :style="{background:showColor.mainColor}">
                  <span class="iconfont icon-a-0 time-icon-dian"></span>
                </span>
              </div>
              <div class="time-content-view" v-show="eidtList[3].status === 1">
                <div class="goods-view">
                  <img style="width: 90px;height: 90px;border-radius: 6px;" :src="pageObj.activeInfo.image || defGoodsUrl" alt="" srcset="">
                  <div style="margin-left:8px;">
                    <div class="goods-title">{{pageObj.activeInfo.goodsName || '请输入商品名称'}}</div>
                    <div class="goods-desc">{{pageObj.activeInfo.goodsDes || '请输入商品描述'}}</div>
                  </div>
                </div>
                <div class="progress-view">
                  <div style="margin-bottom:8px;">
                    <div class="tip-view" :style="{background:showColor.mainColor}">已邀请：4人</div>
                    <div class="triangle-down" :style="{borderTopColor: showColor.mainColor}"></div>
                  </div>
                  <el-progress :percentage="50" :show-text="false" :color="showColor.mainColor"></el-progress>
                </div>
                <div class="get-number-view" v-show="parseInt(pageObj.activeInfo.number) > 0">
                  <div class="number-img">
                    <div v-for="(item,index) in imgs.slice(0,parseInt(pageObj.activeInfo.number) > 3 ? 3 : parseInt(pageObj.activeInfo.number))" :key="index">
                      <img :src="item" class="img-view"/>
                    </div>
                  </div>
                  <div class="">已有
                    <span :style="{color:showColor.mainColor}">{{pageObj.activeInfo.number}}</span>
                  人领取</div>
                </div>
                <div class="get-view" :style="{background:pageObj.activeInfo.getColor || showColor.mainColor}">领取奖励</div>
              </div>
              <div v-show="eidtList[3].status === 1 || eidtList[2].status === 1">
                <div class="rouder-bottom">
                  <div class="rounder-view" :style="{background:showColor.bgColor}"></div>
                  <div class="rounder-view" :style="{background:showColor.bgColor}"></div>
                </div>
                <div class="line-left-bottom" :style="{background:showColor.mainColor}"></div>
                <div class="line-right-bottom" :style="{background:showColor.mainColor}"></div>
              </div>
            </div>
            <div class="friends-view" :style="{background:showColor.mainColor + '66'}" v-show="eidtList[4].status === 1">
              <div v-show="eidtList[3].status === 1 || eidtList[2].status === 1">
                <div class="line-left-top" :style="{background:showColor.mainColor}"></div>
                <div class="line-right-top" :style="{background:showColor.mainColor}"></div>
                <div class="rouder-top">
                  <div class="rounder-view" :style="{background:showColor.bgColor}"></div>
                  <div class="rounder-view" :style="{background:showColor.bgColor}"></div>
                </div>
              </div>
              <div class="rules-title-view" :style="{color:showColor.strColor}">
                <span class="iconfont icon-a-000 rules-icon"></span>
                <span class="iconfont icon-chenggongyaoqinghaoyou rules-icon"></span>
                <span :style="{background:showColor.mainColor}" class="rules-number">
                  <span class="iconfont icon-a-4" style="lineHeight:20px"></span>
                </span>
                <span class="iconfont icon-ren rules-icon"></span>
                <span class="iconfont icon-a-000-copy rules-icon"></span>
              </div>
              <div class="friends-content-view">
                <div v-for="(item,index) in fiends" :key="index">
                  <div class="friends-list">
                    <div>
                      <img :src="item.url" style="width:24px;height:24px;margin-right:4px;borderRadius:50%"/>
                      <span>{{item.name}}</span>
                    </div>
                    <div style="font-size:12px;color:#8C8C8C;">{{item.time}}</div>
                  </div>
                </div>
              </div>
              <div v-show="eidtList[5].status === 1">
                <div class="rouder-bottom">
                  <div class="rounder-view" :style="{background:showColor.bgColor}"></div>
                  <div class="rounder-view" :style="{background:showColor.bgColor}"></div>
                </div>
                <div class="line-left-bottom" :style="{background:showColor.mainColor}"></div>
                <div class="line-right-bottom" :style="{background:showColor.mainColor}"></div>
              </div>
            </div>
            <div class="rules-view" :style="{background:showColor.mainColor + '66'}" v-show="eidtList[5].status === 1">
              <div v-show="eidtList[4].status === 1">
                <div class="line-left-top" :style="{background:showColor.mainColor}"></div>
                <div class="line-right-top" :style="{background:showColor.mainColor}"></div>
                <div class="rouder-top">
                  <div class="rounder-view" :style="{background:showColor.bgColor}"></div>
                  <div class="rounder-view" :style="{background:showColor.bgColor}"></div>
                </div>
              </div>
              <div class="rules-title-view" :style="{color:showColor.strColor}">
                <span class="iconfont icon-a-000 rules-icon"></span>
                <span class="iconfont icon-huodongguize rules-icon"></span>
                <span class="iconfont icon-a-000-copy rules-icon"></span>
              </div>
              <div class="rules-content-view">
                <div class="rules-context-text" ref="activePhoneRules"></div>
                <div style="margin-top:8px" v-if="model.validTimeType === 1">活动有效期：{{model.time[0]}}{{'至'}}{{model.time[1]}}</div>
                <div style="margin-top:8px" v-else>活动有效期：永久有效</div>
              </div>
            </div>
            <div class="register-view" v-show="eidtList[6].status === 1">
              <img class="register-view-img" :src="pageObj.regUrl||defRegUrl"/>
            </div>
          </div>
          <div class="share-view" v-show="eidtList[7].status === 1">
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
    showColor: Object,
    eidtList: Array,
    model: Object,
    pageObj: Object
  },
  // computed: {
  //   pageObj () {
  //     return this.value
  //   }
  // },
  watch: {
    pageObj: {
      handler (newValue, oldValue) {
        if (this.$refs.activePhoneRules) {
          this.$refs.activePhoneRules.innerHTML = newValue.rules
        }
      },
      deep: true
    }
  },
  data () {
    return {
      fiends: [
        {
          url: require('../Images/iphone-1.jpg'),
          name: '好友昵称',
          time: '2020/09/10 09:00:08'
        },
        {
          url: require('../Images/iphone-2.jpg'),
          name: '好友昵称',
          time: '2020/09/10 09:00:09'
        },
        {
          url: require('../Images/iphone-3.jpg'),
          name: '好友昵称',
          time: '2020/09/10 09:00:10'
        },
        {
          url: require('../Images/iphone-4.jpg'),
          name: '好友昵称',
          time: '2020/09/10 09:00:11'
        }
      ],
      imgs: [require('../Images/iphone-5.jpg'), require('../Images/iphone-6.jpg'), require('../Images/iphone-7.jpg')],
      defBanner: 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/image/iphoneBanner.png',
      defGoodsUrl: 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/image/defaultGoodsImg.jpg',
      defRegUrl: 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/image/regUrl.png'
    }
  },
  methods: {
    acScrollPhone (name) {
      let target = document.querySelector(`.${name}`)
      target.parentNode.scrollTop = target.offsetTop
    }
  }
}
</script>

<style scoped lang="scss">
.content-view {
  position: relative;
  height: 100%;
  width: 100%;
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
  border: 1px solid #FFFFFF;
}
.user-img-rund {
  border-radius: 50%;
}
.banner-img {
  width: 100%;
  height: 100%;
}
.scroll-view {
  max-height: calc(100% - 62px -42px -80px);
  overflow: scroll;
  position: relative;
  &::-webkit-scrollbar-thumb {
    display: none;
  }
  &::-webkit-scrollbar-track {
    display: none;
  }
  &::-webkit-scrollbar {
    display: none;
    /*height: 4px;*/
  }
}
.time-view {
  border-radius: 12px;
  margin: 8px 16px;
  padding-top: 8px;
  padding-bottom: 16px;
  position: relative;
}
.friends-view {
  border-radius: 12px;
  margin: 8px 16px;
  padding-top: 16px;
  padding-bottom: 16px;
  position: relative;
}
.rules-view {
  border-radius: 12px;
  margin: 8px 16px;
  padding-top: 16px;
  padding-bottom: 16px;
  position: relative;
}
.rules-content-view {
  padding: 16px;
  background-color: white;
  margin: 8px;
  border-radius: 8px;
  font-size: 14px;
  color: #595959;
  .rules-context-text {
    wise {
      color: #26a2ff;
      padding: 0 1px;
      white-space: nowrap;
      cursor: default;
      -webkit-user-modify: read-only !important;
    }
  }
}
.rules-title-view {
  line-height: 20px;
  width: 100%;
  text-align: center;
}
.rules-icon {
  font-size: 20px;
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
  border-radius: 11px;
  font-size: 12px;
  color: #FFFFFF;
  padding-left: 14px;
  padding-right: 14px;
  width: 100px;
}
.triangle-down {
  margin-left: 20px;
  width: 0;
  height: 0;
  border-left: 3px solid transparent;
  border-right: 3px solid transparent;
  border-top-width: 3px;
  border-top-style: solid;
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
  height: auto;
  margin-bottom: 60px;
}
.rules-number {
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 6px;
  text-align: center;
  margin-right: 1px;
}
.time-title-view {
  line-height: 20px;
  width: 100%;
  padding-left: 13px;
}

.time-icon-dian {
  font-size: 12px
}
.rouder-bottom {
  margin-left: 39px;
  margin-right: 39px;
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
}
.rouder-top {
  margin-left: 39px;
  margin-right: 39px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
}
.rounder-view {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}
.line-left-bottom {
  position: absolute;
  width: 6px;
  height: 22px;
  bottom: 0;
  left: 44px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}
.line-right-bottom {
  position: absolute;
  width: 6px;
  height: 22px;
  bottom: 0;
  right: 44px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}
.line-left-top {
  position: absolute;
  width: 6px;
  height: 38px;
  top: -16px;
  left: 44px;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
}
.line-right-top{
  position: absolute;
  width: 6px;
  height: 38px;
  top: -16px;
  right: 44px;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
}

</style>
