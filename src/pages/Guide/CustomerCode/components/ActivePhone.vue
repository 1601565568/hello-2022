<template>
  <div>
    <Phone>
      <template v-slot:content>
        <div class="content-view" :style="{background:showColor.bgColor}">
          <div>
            <img class="phone-view" src="../Images/iphoneActive.jpg"/>
          </div>
          <div class="scroll-view">
            <div class="info-view" v-show="eidtList[0].status === 1">
              <div class="user-info">
                <img :class="'user-img user-img-rund'" src="../Images/iphone-1.jpg"/>
                <span>裂变大师昵称</span>
              </div>
              <div class="invitation-text">邀请好友0人</div>
            </div>
            <div class="banner-view" v-show="eidtList[MODULE_TO_INDEX_MAP.banner].status === 1">
              <img :src="model.bannerUrl || defBanner" class="banner-img"/>
            </div>
            <div class="time-title-view" :style="{color:showColor.strColor}" v-show="eidtList[MODULE_TO_INDEX_MAP.countdown].status === 1 && validTimeType === 1">
              <span class="iconfont icon-julihuodongjieshuhuanyou time-icon-dian"></span>
              <span class="rules-number" :style="{background:showColor.mainColor}">
                <span class="iconfont icon-a-0 time-icon-number"></span>
              </span>
              <span class="rules-number" :style="{background:showColor.mainColor}">
                <span class="iconfont icon-a-4 time-icon-number"></span>
              </span>
              <span class="iconfont icon-tian time-icon-dian"></span>
              <span class="rules-number" :style="{background:showColor.mainColor}">
                <span class="iconfont icon-a-2 time-icon-number"></span>
              </span>
              <span class="rules-number" :style="{background:showColor.mainColor}">
                <span class="iconfont icon-a-3 time-icon-number"></span>
              </span>
              <span>:</span>
              <span class="rules-number" :style="{background:showColor.mainColor}">
                <span class="iconfont icon-a-1 time-icon-number"></span>
              </span>
              <span class="rules-number" :style="{background:showColor.mainColor}">
                <span class="iconfont icon-a-4 time-icon-number"></span>
              </span>
              <span>:</span>
              <span class="rules-number" :style="{background:showColor.mainColor}">
                <span class="iconfont icon-a-5 time-icon-number"></span>
              </span>
              <span class="rules-number" :style="{background:showColor.mainColor}">
                <span class="iconfont icon-a-0 time-icon-number"></span>
              </span>
            </div>
            <div class="time-view" :style="{background:showColor.mainColor + '66'}" v-show="isOpnePrize">
              <div class='ranklist' v-if='model.activeInfoList && model.activeInfoList.length > 1'>
                <template v-for='item in model.activeInfoList'>
                  <div :class='"rankitem " + (activeId=== `tab${item.prizeGrade}` ? "active":"")' :key='item.prizeGrade' :style="{ color : activeId=== `tab${item.prizeGrade}` ? showColor.bgColor: '#fff'}" @click='handleChangeActiveId(item.prizeGrade)'>
                    <div class='rankname'>{{`阶梯${['零','一', '二', '三', '四', '五' ][item.prizeGrade]}`}}</div>
                    <div class='ranknum'>邀请{{item.recruitment}}人</div>
                  </div>
                </template>
              </div>
              <div class="time-content-view" v-show="isOpnePrize" :style="{ borderRadius : model.activeInfoList && model.activeInfoList.length > 1?'0 0 12px 12px':'12px' }">
                <div class="goods-view">
                  <img style="width: 90px;height: 90px;border-radius: 6px;" :src="activeInfo.image || defGoodsUrl" alt="" srcset="">
                  <div style="margin-left:8px;">
                    <div class="goods-title">{{activeInfo.goodsName || '请输入商品名称'}}</div>
                    <div class="goods-desc">{{activeInfo.goodsDes || '请输入商品描述'}}</div>
                  </div>
                </div>
                <div class="progress-view">
                  <div style="margin-bottom:0px;">
                    <div class="tip-view" :style="{background:showColor.mainColor}">已邀请5人</div>
                    <div class="triangle-down" :style="{borderTopColor: showColor.mainColor}"></div>
                  </div>
                  <div class="cus-progress-view">
                    <div class="progress-view-bar" :style="{background:showColor.mainColor}">
                      <template v-for='(prize,prizeIndex) in model.activeInfoList'>
                        <img :key='prize.prizeGrade' src='https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-H5/page/customCode/arrived.svg'
                          class='invite_icon' :style="{left:(prizeIndex+1)/model.activeInfoList.length * 100 +'%'}" />
                      </template>
                    </div>
                    <div>
                      <span :style="{color:showColor.mainColor,fontSize:'13px'}">5</span>
                      <span style="color:#8C8C8C;font-size:13px">/5</span>
                    </div>
                  </div>
                </div>
                <div class="get-view" :style="{background:model.getBtnColor || showColor.mainColor}">领取奖励</div>
                <div class="get-number-view" v-show="parseInt(model.virtualFinishedCount) > 0">
                  <div class="number-img">
                    <div v-for="(item,index) in imgs.slice(0,parseInt(model.virtualFinishedCount) > 3 ? 3 : parseInt(model.virtualFinishedCount))" :key="index">
                      <img :src="item" class="img-view"/>
                    </div>
                  </div>
                  <div class="">已有
                    <span :style="{color:showColor.mainColor}">{{model.virtualFinishedCount}}</span>
                  人领取</div>
                </div>
              </div>
              <!-- <div v-show="eidtList[MODULE_TO_INDEX_MAP.reward].status === 1">
                <div class="rouder-bottom">
                  <div class="rounder-view" :style="{background:showColor.bgColor}"></div>
                  <div class="rounder-view" :style="{background:showColor.bgColor}"></div>
                </div>
                <div class="line-left-bottom" :style="{background:showColor.mainColor,height:'16px'}"></div>
                <div class="line-right-bottom" :style="{background:showColor.mainColor,height:'16px'}"></div>
              </div> -->
            </div>
            <div class="friends-view" :style="{background:showColor.mainColor + '66'}" v-show="eidtList[MODULE_TO_INDEX_MAP.invitedFriend].status === 1">
              <!-- <div v-show="eidtList[MODULE_TO_INDEX_MAP.reward].status === 1">
                <div class="line-left-top" :style="{background:showColor.mainColor}"></div>
                <div class="line-right-top" :style="{background:showColor.mainColor}"></div>
                <div class="rouder-top">
                  <div class="rounder-view" :style="{background:showColor.bgColor}"></div>
                  <div class="rounder-view" :style="{background:showColor.bgColor}"></div>
                </div>
              </div> -->
              <div class="rules-title-view" :style="{color:showColor.strColor}">
                <span class="iconfont icon-a-000 rules-icon"></span>
                <span class="iconfont icon-chenggongyaoqinghaoyou rules-icon"></span>
                <span :style="{background:showColor.bgColor}" class="rules-number">
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
              <!-- <div v-show="eidtList[MODULE_TO_INDEX_MAP.activityRule].status === 1">
                <div class="rouder-bottom">
                  <div class="rounder-view" :style="{background:showColor.bgColor}"></div>
                  <div class="rounder-view" :style="{background:showColor.bgColor}"></div>
                </div>
                <div class="line-left-bottom" :style="{background:showColor.mainColor}"></div>
                <div class="line-right-bottom" :style="{background:showColor.mainColor}"></div>
              </div> -->
            </div>
            <div class="rules-view" :style="{background:showColor.mainColor + '66'}" v-show="eidtList[MODULE_TO_INDEX_MAP.activityRule].status === 1">
              <!-- <div v-show="eidtList[MODULE_TO_INDEX_MAP.invitedFriend].status === 1 || eidtList[MODULE_TO_INDEX_MAP.reward].status === 1">
                <div class="line-left-top" :style="{background:showColor.mainColor}"></div>
                <div class="line-right-top" :style="{background:showColor.mainColor}"></div>
                <div class="rouder-top">
                  <div class="rounder-view" :style="{background:showColor.bgColor}"></div>
                  <div class="rounder-view" :style="{background:showColor.bgColor}"></div>
                </div>
              </div> -->
              <div class="rules-title-view" :style="{color:showColor.strColor}">
                <span class="iconfont icon-a-000 rules-icon"></span>
                <span class="iconfont icon-huodongguize rules-icon"></span>
                <span class="iconfont icon-a-000-copy rules-icon"></span>
              </div>
              <div class="rules-content-view" v-if="model.rules">
                <div class="welcome-info-view" v-html="model.rules"></div>
                <!-- <div style="margin-top:8px" v-if="model.validTimeType === 1">
                  <div v-if="model.time.length > 0">活动有效期：{{model.time[0]}}{{'至'}}{{model.time[1]}}</div>
                  <div v-else>活动有效期：</div>
                </div> -->
                <!-- <div style="margin-top:8px" v-else>活动有效期：永久有效</div> -->
              </div>
            </div>
            <div class="register-view" v-show="eidtList[MODULE_TO_INDEX_MAP.memberRegister].status === 1">
              <img class="register-view-img" :src="model.regUrl||defRegUrl"/>
            </div>
          </div>
          <div class="share-view" v-show="eidtList[MODULE_TO_INDEX_MAP.shareButton].status === 1">
            <div class="share-button" :style="{background:model.shareBtnColor}">{{model.shareBtnText}}</div>
          </div>
        </div>
      </template>
    </Phone>
  </div>
</template>

<script>
import { FileExclamationFill } from '@ant-design/icons'
import Phone from './Phone'
// import ElProgress from '@nascent/nui/lib/progress'
import { defBanner, defGoodsUrl, defRegUrl } from '../util/Edit'
import { MODULE_TO_INDEX_MAP } from '../src/const'
export default {
  name: 'activephone',
  components: {
    Phone
    // ElProgress
  },
  computed: {
    activeInfo () {
      const { activeInfoList } = this.model
      return activeInfoList[this.activeId.split('tab')[1] - 1] || {}
    }
  },
  props: {
    value: Object,
    showColor: Object,
    eidtList: Array,
    model: Object,
    pageObj: Object,
    validTimeType: {},
    activeId: {},
    isOpnePrize: {}
  },
  // computed: {
  //   pageObj () {
  //     return this.value
  //   }
  // },
  // watch: {
  //   pageObj: {
  //     handler (newValue, oldValue) {
  //       if (this.$refs.activePhoneRules) {
  //         if (newValue.rules) {
  //           this.$refs.activePhoneRules.innerHTML = newValue.rules.replace(/\n/g, '<br/>')
  //         }
  //       }
  //     },
  //     deep: true
  //   }
  // },
  data () {
    return {
      MODULE_TO_INDEX_MAP,
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
      defBanner: defBanner,
      defGoodsUrl: defGoodsUrl,
      defRegUrl: defRegUrl
    }
  },
  methods: {
    handleChangeActiveId (id) {
      this.$emit('onChangeActiveId', id)
    },
    acScrollPhone (name) {
      let target = document.querySelector(`.${name}`)
      target.parentNode.scrollTop = target.offsetTop
    },
    setItemText () {
      return () => {
        return ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
.welcome-info-view {
  padding: 0;
  margin-left: 0;
  font-size: 14px;
  color: #595959;
  width: 100%;
  word-break: break-all;
}
.content-view {
  position: relative;
  height: 100%;
  width: 100%;
}
.phone-view {
  width: 320px;
  height: 62px;
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
  max-height: calc(100% - 62px -80px);
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
.ranklist {
  display: flex;
  margin:0 8px;
  .rankitem {
    flex:1;
    text-align: center;
    color:#fff;
    padding: 9px 0;
    .rankname {
      font-size: 14px;
      line-height: 22px;
    }
    .ranknum {
      font-size: 10px;
      line-height: 20px;
    }
    &.active {
      background: #fff;
      border-radius: 8px 8px 0 0;
      &::before,&:after {

      }
    }
  }
}
.time-view {
  border-radius: 12px;
  margin: 0px 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  position: relative;
  background: transparent !important;
}
.friends-view {
  border-radius: 12px;
  margin: 0px 16px;
  // padding-top: 16px;
  padding-bottom: 16px;
  position: relative;
  background: transparent !important;
}
.rules-view {
  border-radius: 12px;
  margin: 0px 16px;
  // padding-top: 16px;
  padding-bottom: 16px;
  position: relative;
  background: transparent !important;
}
.rules-content-view {
  padding: 16px;
  background-color: white;
  margin: 8px;
  border-radius: 8px;
  font-size: 14px;
  color: #595959;
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
  padding: 8px;
  margin: 8px;
  background-color: white;
  font-size: 14px;
  color: #8C8C8C;
}

.friends-list {
  display: flex;
  flex-direction: row;
  // height: 22px;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  margin-bottom: 8px;
  // margin-bottom: 8px;
}
.time-content-view {
  border-radius: 8px;
  margin:0 8px 8px;
  padding: 16px;
  background-color: white;
  font-size: 14px;
}
.get-view {
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
  padding-bottom: 16px;
  border-bottom: 1px dashed #959595;
  margin-bottom: 16px;
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
  padding-left: 11px;
  padding-right: 11px;
  height: 22px;
  width: 85px;
  margin-left: 150px;
  text-align: center;
}
.triangle-down {
  margin-left: 185px;
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
  margin-top: 16px;
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
  position: relative;
}
.time-title-view {
  // line-height: 20px;
  padding: 8px 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  // padding-left: 13px;
}

.time-icon-dian {
  font-size: 12px;
}

.time-icon-number {
  width: 16px;
  height: 16px;
  font-size: 12px;
  position: absolute;
  top: -1px;
  left: 1px;
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

.cus-progress-view {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.progress-view-bar {
  width: 190px;
  height: 8px;
  border-radius: 4px;
  position: relative;
}
.invite_icon {
  position: absolute;
  height: 20px;
  width: 20px;
  margin-left: -10px;
  top: 50%;
  margin-top: -10px;
  border-radius: 50%;
  box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.1);
}
</style>
