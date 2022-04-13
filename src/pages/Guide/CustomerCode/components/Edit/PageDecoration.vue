<template>
  <div class='customCode-content_box__PageDecoration customCode-content_box'>
    <Box>
      <template slot='collapse-left'>
        <el-form
          size="medium"
          label-position="left"
          :model="model"
          class="normal-from padding-form"
          ref="pageDecorationForm"
          label-width="16px"
          :rules="rules"
        >
          <!-- <el-collapse v-model="activeNames" :disabled='true'> -->
            <div class="common-collapse">
              <!-- 配色方案 start-->
              <div title="配色方案" class='itemCode'>
                <div class="edit-view" @click="onShowEdit(item.itemCode,item.status)">
                  <div>配色方案</div>
                </div>
                <div class='flex-box flex-start color-box_custom colle-container'>
                  <el-form-item label-width="110px" label="整体配色方案" prop="guideIds">
                    <ColorView v-model="model.showColor" ref="colorView" @input='handleChangeColor'/>
                  </el-form-item>
                  <el-form-item label-width="130px" label="领取奖励按钮颜色" prop="guideIds">
                    <el-color-picker
                      v-model="model.getBtnColor"
                      class='costomCode-color'
                    ></el-color-picker>
                  </el-form-item>
                  <el-form-item label-width="110px" label="分享按钮颜色" prop="guideIds">
                    <el-color-picker
                      v-model="model.shareBtnColor"
                      class='costomCode-color'
                    ></el-color-picker>
                  </el-form-item>
                </div>
              </div>
              <!-- 配色方案 end-->
              <template v-for='item in model.eidtList'>
                <div v-if='!item.isHide' :key='item.itemCode' class='itemCode'>
                  <div class="edit-view" :class="[btnNext==='QA'? stateQA : stateIcon]" @click="onShowEdit(item.itemCode,item.status)">
                    <div >{{ item.itemName }}</div>
                    <!-- 时间类型为所有时间，按钮禁用 start-->
                    <template v-if="item.itemCode ==='countdown' && validTimeType === 0">
                      <el-tooltip :content="item.id==='friend'?inviteFriendTip:item.tip" placement="top" popper-class='popperClass'>
                        <el-switch active-color="#0091FA" inactive-color="#8C8C8C" :value='false'></el-switch>
                        <template slot='content'>
                          活动永久有效，无需显示倒计时
                        </template>
                      </el-tooltip>
                    </template>
                     <!-- 时间类型为所有时间，按钮禁用 end-->
                    <template v-else-if="item.itemCode ==='reward' || item.itemCode ==='activityRule' || item.itemCode ==='shareButton'"></template>
                    <template v-else>
                       <el-switch active-color="#0091FA" inactive-color="#8C8C8C" v-model="item.status" :active-value="1" :inactive-value="0" ></el-switch>
                    </template>
                    <!-- <div @click="(e)=>{handleClickTime(e,item.itemCode)}">
                      <el-switch active-color="#0091FA" inactive-color="#8C8C8C" v-model="item.status" :active-value="1" :inactive-value="0" :disabled="(isStating && item.itemCode ==='reward' || validTimeType === 0)"></el-switch>
                    </div> -->
                  </div>
                  <div class="item-container">
                    <div class="noEdit" v-if="item.status === 0">
                      开启后可编辑内容
                    </div>
                    <!-- 主图模块 start-->
                    <div v-if='item.itemCode === "banner"' class='colle-container'>
                      <el-form-item prop='bannerUrl'>
                        <div class='updata-box' :class="[btnNext==='QA'? updataQA : updata]">
                          <SimpleUpload v-model='model.bannerUrl' :maxSize="2" :drag='false'/>
                          <div class='updata-option'>
                            <ns-button type='text' class="remind-text" @click="showDefCard('bannerUrl',defBanner)">恢复默认图片</ns-button>
                            <div class="qrcode-bottom-view">
                              建议：小于2M，jpg、png、jpeg格式
                            </div>
                          </div>
                        </div>
                      </el-form-item>
                    </div>
                    <!-- 主图模块 end-->
                    <!-- 活动奖品 start-->
                    <div v-if='item.itemCode === "reward" && isOpnePrize' class='colle-container customCode-tab' :class="[btnNext==='QA'?tagTextQA:tagText]">
                      <el-tabs v-model="tabAvtive" type="card" @tab-click="handleChangeTab(item.itemCode,item.status)">
                        <template v-for='(item,index) in model.activeInfoList'>
                          <el-tab-pane :key='item.prizeGrade' :label="`阶梯${['零','一', '二', '三', '四', '五' ][item.prizeGrade]}·${item.recruitment}人`" :name="`tab${item.prizeGrade}`">
                            <div class="goods-input-view">
                              <el-form-item
                                class="larger-item"
                                label-width="0px"
                              >
                                <div class='formin-text'>奖品内容：{{item.prizeType === 1 ? '优惠券':'红包'}}({{item.prizeName}})</div>
                              </el-form-item>
                              <el-form-item
                                :prop="'activeInfoList.' + index + '.goodsName'"
                                label-width="0"
                                :rules="[
                                  {
                                    required: true,
                                    message: '请输入奖品名称',
                                    trigger: ['blur', 'change']
                                  },
                                  { validator: validates.goodsName, trigger: ['blur', 'change'] }
                                ]"
                              >
                                <length-input
                                  :value='model.activeInfoList[index].goodsName'
                                  placeholder="请输入奖品名称"
                                  :length="20"
                                  :disabled="isStating"
                                  @input='(e)=>{handleChangePrize(e,index,"goodsName")}'
                                />
                              </el-form-item>
                              <el-form-item
                                :prop="'activeInfoList.' + index + '.goodsDes'"
                                label-width="0"
                                :rules="[
                                  {
                                    required: true,
                                    message: '请输入奖品简介',
                                    trigger: ['blur', 'change']
                                  },
                                  { validator: validates.goodsDesc, trigger: ['blur', 'change'] }
                                ]"
                              >
                                <length-input
                                  :value="item.goodsDes"
                                  placeholder="请输入奖品简介"
                                  :disabled="isStating"
                                  :length="50"
                                  @input='(e)=>{handleChangePrize(e,index,"goodsDes")}'
                                />
                              </el-form-item>
                              <el-form-item  :prop="'activeInfoList.' + index + '.image'" label-width="0">
                                <div  class='updata-box' :class="[btnNext==='QA'? updataQA : updata]">
                                  <SimpleUpload  :scale='1' scaleTip='1'  :isNeedCrop='true'  :maxSize="2"  :value='item.image' :drag='false' @input='(e)=>{handleChangePrize(e,index,"image")}' />
                                  <div class='updata-option' >
                                    <ns-button type='text' class="remind-text" @click="showDefCardByImage(index)">恢复默认图片</ns-button>
                                    <div class="qrcode-bottom-view">
                                       建议：比例为1:1，小于2M，jpg、png、jpeg格式
                                    </div>
                                  </div>
                                </div>
                              </el-form-item>
                            </div>
                          </el-tab-pane>
                        </template>
                      </el-tabs>
                      <el-form-item
                        label="虚拟完成人数"
                        class="larger-item"
                        label-width="110px"
                      >
                        <div class="qrcode-top-view">
                          <el-input class="middle"  v-model="model.virtualFinishedCount" @input='inputNumber'/>
                          人
                        </div>
                        <div class="qrcode-bottom-view align-with-form">
                          <span class="remind-view"></span>
                          填写已完成活动的虚拟人数，营造火爆的场景，以吸引用户参与，完成人数为空或为0时则不显示
                        </div>
                      </el-form-item>
                    </div>
                    <!-- 活动奖品 end-->
                    <!-- 活动规则 start-->
                    <div v-if='item.itemCode === "activityRule"' class='colle-container'>
                      <el-form-item
                        label-width="110px"
                        label="活动规则"
                        prop="rules"
                        required
                        :rules="[
                          { required: true, message: '请输入活动规则', trigger: ['blur', 'change'] },
                          { validator: validates.validateActivityIntroductionLeast.bind(this,activityIntroductionLength), message: '请输入活动规则', trigger: ['blur', 'change'] },
                          { validator: validates.validateActivityIntroduction.bind(this,activityIntroductionLength), message: '活动规则最多1000个字', trigger: ['blur', 'change'] }
                        ]"
                        :class="[btnNext==='QA'?tagTextQA:tagText]"
                      >
                        <tag-area
                          v-model="model.rules"
                          tag="wise"
                          ref="tagAreaTextRules"
                          :maxlength="1000"
                          placeholder="请输入活动规则"
                          @inputLength="inputLength"
                          :showEmoji="true"
                          :showTextEmoji="true"
                        />
                      </el-form-item>
                    </div>
                    <!-- 活动规则 end-->
                    <!-- 注册会员 start-->
                    <div v-if='item.itemCode === "memberRegister" && memberRegisterenv' class='colle-container'>
                      <el-form-item prop='bannerUrl'>
                        <div class='updata-box' :class="[btnNext==='QA'? updataQA : updata]">
                          <SimpleUpload :maxSize="2" v-model='model.regUrl' :drag='false' />
                          <div class='updata-option'>
                            <ns-button type='text' class="remind-text" @click="showDefCard('regUrl',defRegUrl)">恢复默认图片</ns-button>
                            <div class="qrcode-bottom-view">
                              建议：小于2M，jpg、png、jpeg格式
                            </div>
                          </div>
                        </div>
                      </el-form-item>
                    </div>
                    <!-- 注册会员 end-->
                    <!-- 分享按钮模块 start-->
                    <div v-if='item.itemCode === "shareButton"' class='colle-container'>
                      <el-form-item label="分享按钮名称"
                        class="larger-item"
                        label-width="110px"
                        prop="shareBtnText"
                      >
                        <length-input
                          v-model="model.shareBtnText"
                          placeholder="请输入分享按钮名称"
                          :length="10"
                        />
                      </el-form-item>
                    </div>
                    <!-- 分享按钮模块 end-->
                  </div>
                </div>
              </template>
            </div>
          <!-- </el-collapse> -->
        </el-form>
      </template>
      <template slot="collapse-right">
        <ActivePhone :pageObj="{}" :showColor="model.showColor" :eidtList="model.eidtList" :model="model" :validTimeType='validTimeType' ref="activePhone" :activeId='tabAvtive' @onChangeActiveId='(id)=>{tabAvtive = "tab"+id}' :isOpnePrize='isOpnePrize'/>
      </template>
    </Box>
    <div :class="[btnNext !=='QA'? foot: footQA]">
      <div class="btn" @click="handlePrev">上一步，奖品设置</div>
      <div class='current' :class="[btnNext==='QA'?btnQA:btn]" @click="handleSubmit">下一步</div>
    </div>
  </div>
</template>
<script>
import Box from '@/components/NewUi/Box'
import { STEP_LIST, DEFAULT_PAGEDECORATION_DATA, GET_DEFAULT_ACTIVEINFO_ITEM, defaultCoupon, defaultRedpack } from '../../src/const'
import { formatePageObj, formatModel, formatCustomComponent, formatPrizeModel, formatModelSave, RichText, defBanner, defGoodsUrl, defRegUrl, defPosters, defCardImg } from '../../util/Edit'
import ColorView from '../ColorView'
import validates from '../../src/validates'
import ElColorPicker from '@nascent/nui/lib/color-picker'
import ActivePhone from '../ActivePhone'
import TagArea from '@/components/NewUi/TagArea'
import LengthInput from '@/components/NewUi/LengthInput'
import SimpleUpload from '@/components/NewUi/SimpleUpload'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      model: { ...DEFAULT_PAGEDECORATION_DATA },
      validates,
      activityIntroductionLength: 0,
      rules: {
        rules: [
          { required: true, message: '请输入活动规则', trigger: ['blur', 'change'] },
          { validator: validates.validateActivityIntroduction.bind(this, this.activityIntroductionLength), message: '活动规则最多1000个字', trigger: ['blur', 'change'] }
        ],
        shareBtnText: [
          { required: true, message: '请输入分享按钮名称', trigger: ['blur', 'change'] },
          { validator: validates.shareName, message: '分享按钮名称最多10个字', trigger: ['blur', 'change'] }
        ]
      },
      activeNames: [0, 1, 2, 3, 4, 5, 6, 7],
      defCardImg,
      defBanner,
      defRegUrl,
      tabAvtive: 'tab1',
      isOpnePrize: true, // 是否开启奖励
      btnNext: process.env.VUE_APP_THEME,
      btnQA: 'btnQA',
      btn: 'btn',
      stateQA: 'stateQA',
      stateIcon: 'stateIcon',
      updata: 'updata',
      updataQA: 'updataQA',
      tagText: 'tagText',
      tagTextQA: 'tagTextQA',
      foot: 'costomcode-footer',
      footQA: 'costomcodeQA-footer'
    }
  },
  props: ['data', 'isStating', 'validTimeType', 'ladderRewardList'],
  computed: {
    ...mapState({
      // 环境判断
      cloudPlatformType: state => state.user.remumber.remumber_login_info.productConfig.cloudPlatformType,
      memberRegisterenv () {
        return !!(this.cloudPlatformType === 'ecrp')
      }
    })
  },
  components: {
    Box, ActivePhone, ColorView, ElColorPicker, TagArea, LengthInput, SimpleUpload
  },
  methods: {
    handleChangeColor (value) {
      if (value.mainColor) {
        this.model.getBtnColor = value.mainColor
        this.model.shareBtnColor = value.mainColor
      }
    },
    formatSettingType (code) {
      return formatCustomComponent(code)
    },
    inputLength (length) {
      if (this.$refs.tagAreaTextRules) {
        this.$emit('scrollPhone', 'rules-view')
      }
      this.activityIntroductionLength = length
      this.$refs.pageDecorationForm && this.$refs.pageDecorationForm.validateField('rules')
    },
    inputNumber (value) {
      let str = value
      str = str.replace(/[^\d]/g, '')
      if (str.length > 10) {
        str = str.substr(0, 10)
      }
      this.model.virtualFinishedCount = str
    },
    // 恢复默认图
    showDefCard (key, src) {
      this.model[key] = src
    },
    // 奖品模块恢复默认图
    showDefCardByImage (index) {
      const item = this.model.activeInfoList[index]
      const { prizeType } = item
      item.image = prizeType === 1 ? defaultCoupon : defaultRedpack
      this.$set(this.model.activeInfoList, index, item)
    },
    // 点击获取编辑模块
    onShowEdit (itemCode, status) {
      if (itemCode === 'reward') {
        this.$refs.activePhone.acScrollPhone('time-view')
      }
      if (itemCode === 'countdown') {
        this.$refs.activePhone.acScrollPhone('time-title-view')
      }
      if (itemCode === 'banner') {
        this.$refs.activePhone.acScrollPhone('banner-view')
      }
      if (itemCode === 'invitedFriend') {
        if (status === 0) {
          this.$refs.activePhone.acScrollPhone('rules-view')
        } else {
          this.$refs.activePhone.acScrollPhone('friends-view')
        }
      }
      if (itemCode === 'memberRegister') {
        this.$refs.activePhone.acScrollPhone('register-view')
      }
      if (itemCode === 'activityRule') {
        this.$refs.activePhone.acScrollPhone('rules-view')
      }
      this.$emit('onShowEdit', itemCode)
    },
    /**
     *  设置奖品
     */
    handleChangePrize (e, index, key) {
      this.$set(this.model.activeInfoList, index, { ...this.model.activeInfoList[index], [key]: e })
    },
    /**
     * 切换tab栏
     */
    handleChangeTab (itemCode, status) {
      this.onShowEdit(itemCode, status)
    },
    isDefaultImg (img) {
      // return (type === 2 && img === defaultRedpack) || (defaultCoupon === 1 && img === defaultCoupon)
      return img === defaultRedpack || img === defaultCoupon
    },
    setDefaultImg (type) {
      return type === 2 ? defaultRedpack : defaultCoupon
    },
    /**
     * 根据阶梯重新设置奖品
     */
    setActiveInfoList (ladderRewardList, isOpnePrize) {
      this.isOpnePrize = isOpnePrize
      if (isOpnePrize) {
        const newActiveInfoList = []
        for (let i = 0; i < ladderRewardList.length; i++) {
          const item = { ...ladderRewardList[i] }
          let activeInfoItem = {}
          if (this.model.activeInfoList[i]) {
            // 根据奖品类型重新选择默认图
            let image = ''
            if (this.isDefaultImg(this.model.activeInfoList[i].image)) {
              image = this.setDefaultImg(item.prizeType)
            } else {
              image = this.model.activeInfoList[i].image
            }
            activeInfoItem = Object.assign({}, this.model.activeInfoList[i], item, { goodsDes: this.model.activeInfoList[i].goodsDes, goodsName: this.model.activeInfoList[i].goodsName, image })
          } else {
            activeInfoItem = Object.assign({}, GET_DEFAULT_ACTIVEINFO_ITEM(item.prizeType), item)
          }
          newActiveInfoList.push(activeInfoItem)
        }
        this.tabAvtive = 'tab1'
        this.model.activeInfoList = newActiveInfoList
      }
    },
    handlePrev () {
      this.$emit('changeStepId', 'prev')
    },
    handleSubmit () {
      this.$refs.pageDecorationForm.validate((valid, error) => {
        if (valid) {
          this.$emit('changeData', {
            key: STEP_LIST[2].dataName,
            value: this.model
          })
          this.$emit('changeStepId', 'next')
        } else {
          const items = Object.keys(error).find(item => item.indexOf('activeInfoList') > -1)
          if (items) {
            this.tabAvtive = `tab${parseInt(items.split('.')[1]) + 1}`
          }
        }
      })
    }
  },
  mounted () {
    this.model = JSON.parse(JSON.stringify(this.data))
  }
}
</script>
<style lang="scss" scoped>
@import '@components/NewUi/styles/reset.css';
@import "../../styles/customcode.css";
@import '../../styles/leftview.css';
.customCode-content_box {
  height: 100%;
  .collapse-content  {
    height: 100%;
  }
}
.preview-img {
  background-color: #F5F5F5;
}
.flex-start {
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: flex-start;
}
.colle-container {
    background: #FBFBFB;
    border-radius: 2px;
    padding: 16px;
}
.formin-text {
  font-size: 14px;
  color: #303133;
  line-height: 22px;
}
.itemCode {
  margin-bottom: 16px;
  .edit-view {
    height: 48px;
    background: #F5F5F5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    font-size: 14px;
    color: #303133;
    line-height: 22px;
    font-weight: 500;
    padding: 0 16px;
    border-bottom: 1px solid #E8E8E8;
  }
}
.align-with-form {
  margin-left: -100px;
}
.item-container {
  position: relative;
  .noEdit {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #fff;
    left: 0;
    top: 0;
    z-index:10;
    opacity: 0;
    transition: opacity 0.5s;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    font-size: 14px;
    color: #595959;
  }
  &:hover .noEdit {
    opacity: 0.85;
  }
}
</style>
<style scoped>
.customCode-content_box {
  >>> .el-avatar > img {
    width: 100%;
  }
  >>> .collapse-right,>>> .collapse-left{
    height: 100%;
    overflow-y: auto;
    &::-webkit-scrollbar{
      width: 5px;
      height: 5px;
    }
    &::-webkit-scrollbar-thumb{
      border-radius: 1em;
      background-color: rgba(144, 147, 153, .3);
      cursor: pointer;
    }
    &::-webkit-scrollbar-track{
      border-radius: 1em;
      background-color: rgba(50,50,50,0);
      cursor: pointer;
    }
  }
  >>> .collapse-content {
    padding-bottom: 0;
  }
  >>> .collapse-right::before {
    display: none
  }
}
.poster-set_content {
  >>> .el-col {
    margin-bottom: 12px;
  }
  >>> .el-radio {
    margin-right: 4px;
  }
}
.color-box_custom {
  >>> .el-color-picker--medium .el-color-picker__trigger {
    height: 60px;
    width: 60px;
    border: 2px solid #EEEEEE;
    padding:6px;
    .el-color-picker__color-inner{
      border: 2px solid #979797;
    }
  }
}
.customCode-content_box__PageDecoration {
  >>> .el-form-item {
    margin-bottom: 0 !important;
  }
  .goods-input-view >>> .el-form-item {
    margin-bottom: 16px !important;
  }
  >>> .w-textarea {
    background-color: #fff;
  }
}
.customCode-tab {
  >>> .el-tabs__content {
    background-color: #fff;
    border: 1px solid #D9D9D9;
    border-top: none;
    border-radius: 0px 0px 2px 2px;
    padding: 16px;
    margin-bottom: 16px;
  }
  >>> .el-tabs--card > .el-tabs__header {
    border: none;
    background: transparent;
  }
  >>> .el-tabs__nav {
    border:none;
  }
  >>> .el-tabs__nav-scroll {
    position: relative;
    &:after {
      content: ' ';
      position: absolute;
      bottom:0;
      left:0;
      right:0;
      border-bottom:1px solid #D9D9D9;
    }
  }
  >>> .el-tabs--card > .el-tabs__header .el-tabs__item {
    position: relative;
    border: 1px solid #D9D9D9;
    &::before {
      /* position: absolute;
      height: 2px;
      left: 0;
      right: 0;
      bottom: 0px;
      border-bottom:1px solid #D9D9D9; */
      display: none;
    }
    &.is-active {
      border-bottom: none;
      &::before {
        display: block;
        content: ' ';
        position: absolute;
        height: 2px;
        left: 0;
        right: 0;
        bottom: -1px;
        border:none;
        background: #fff;
      }
    }
  }
  >>> .el-tabs__item {
    padding: 6px 20px;
    background: #fff;
    font-size: 12px;
    color: rgba(0,0,0,0.65);
    font-weight: 400;
    text-align: center;
    line-height: 20px;
    border-radius: 8px 8px 0 0;
    margin-right: 4px;
    &.is-active {
      font-weight: 600;
      color: #0094FC;
    }
  }
}
.costomcode-footer .current{
  background-color: #0091FA;
  color: #FFFFFF;
  border: 1px solid #0091FA;
}
.costomcodeQA-footer .btnQA.current{
  background-color: #2153D4;
  color: #FFFFFF;
  width: 160PX;
  height: 40px;
  border: 1px solid #2153D4;
  text-align: center;
  line-height: 40px;
  border-radius: 2px;
  cursor: pointer;
  margin-right: 16px;
}
.stateQA >>>.el-switch.is-checked .el-switch__core{
  width: 40px;
  border-color: #2153D4!important;
  background-color: #2153D4!important;
}
.stateIcon >>>.el-switch.is-checked .el-switch__core{
  width: 40px;
  border-color: rgb(0, 145, 250)!important;
  background-color: rgb(0, 145, 250)!important;
}
.updataQA >>> .updata-option .remind-text{
   color: #2153D4;
    font-weight: 400;
}
.updata >>> .updata-option .remind-text{
   color: #0392FB;
    font-weight: 400;
}
.tagTextQA >>> .emoji-icon{
  color: #2153D4;
}
.tagText >>> .emoji-icon{
  color: #26a2ff;
}
.tagTextQA >>> .el-tabs__item.is-active{
    font-weight: 600;
    color: #2153D4;
}
.tagText >>>.el-tabs__item.is-active{
    font-weight: 600;
    color: #0094FC;
}
</style>
