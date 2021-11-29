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
          <el-collapse v-model="activeNames">
            <div class="common-collapse">
              <!-- 配色方案 start-->
              <el-collapse-item title="配色方案" :name="0">
                <div class='flex-box flex-start color-box_custom colle-container'>
                  <el-form-item label-width="110px" label="整体配色方案" prop="guideIds">
                    <ColorView v-model="model.showColor" ref="colorView"/>
                  </el-form-item>
                  <el-form-item label-width="130px" label="领取奖励按钮颜色" prop="guideIds">
                    <el-color-picker
                      v-model="model.getBtnColor"
                    ></el-color-picker>
                  </el-form-item>
                  <el-form-item label-width="110px" label="分享按钮颜色" prop="guideIds">
                    <el-color-picker
                      v-model="model.shareBtnColor"
                    ></el-color-picker>
                  </el-form-item>
                </div>
              </el-collapse-item>
              <!-- 配色方案 end-->
              <template v-for='(item,index) in model.eidtList'>
                <el-collapse-item :title="item.itemName" :name="index+1" :key='item.itemCode'>
                  <template slot="title">
                    <div class="edit-view" @click="onShowEdit(item.itemCode,item.status)">
                      <div>
                        {{ item.itemName }}
                      </div>
                      <div  @click="onclick(item.itemCode,item.status)">
                        <el-switch active-color="#0091FA" inactive-color="#8C8C8C" v-model="item.status" :active-value="1" :inactive-value="0" :disabled="(isStating && item.itemCode ==='reward')"></el-switch>
                      </div>
                    </div>
                  </template>
                  <!-- 主图模块 start-->
                  <div v-if='item.itemCode === "banner"' class='colle-container'>
                    <el-form-item prop='bannerUrl'>
                      <div class='simple-updata'>
                        <el-avatar v-if="model.bannerUrl" shape="square" :size="100" fit="contain" :src="model.bannerUrl"></el-avatar>
                        <div v-else class='default-updata'>
                          <Icon type="plus" className="company-upload__tip"/>
                        </div>
                        <div class='upload-content'>
                          <drap-upload  :maxSize="2"  v-model='model.bannerUrl' :drag='false'>
                          </drap-upload>
                        </div>
                        <ns-button type='text' class="remind-text" @click="showDefCard('bannerUrl',defBanner)">恢复默认图片</ns-button>
                      </div>
                      <div class="qrcode-bottom-view">
                        建议：宽度750像素，高度不限，小于2M，jpg、png、jpeg格式
                      </div>
                    </el-form-item>
                  </div>
                  <!-- 主图模块 end-->
                  <!-- 活动奖品 start-->
                  <div v-if='item.itemCode === "reward" && isOpnePrize' class='colle-container'>
                    <el-tabs v-model="tabAvtive" type="card" @tab-click="handleChangeTab">
                      <template v-for='(item,index) in model.activeInfoList'>
                        <el-tab-pane :key='item.prizeGrade' :label="`阶梯${['零','一', '二', '三', '四', '五' ][item.prizeGrade]}·${item.recruitment}人`" :name="`tab${item.prizeGrade}`">
                          <div class="goods-input-view">
                            <el-form-item
                              label="奖品内容"
                              class="larger-item"
                              label-width="110px"
                            >
                              {{item.prizeType === 1 ? '优惠券':'红包'}}({{item.prizeName}})
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
                            <el-form-item :prop="'activeInfoList.' + index + '.image'" label-width="0">
                              <div class='simple-updata'>
                                <el-avatar v-if="item.image" shape="square" :size="100" fit="contain" :src="item.image"></el-avatar>
                                <div v-else class='default-updata'>
                                  <Icon type="plus" className="company-upload__tip"/>
                                </div>
                                <div class='upload-content'>
                                  <drap-upload  :maxSize="2"  :value='item.image' :drag='false' @input='(e)=>{handleChangePrize(e,index,"image")}'>
                                  </drap-upload>
                                </div>
                                <ns-button type='text' class="remind-text" @click="showDefCard('bannerUrl',defBanner)">恢复默认图片</ns-button>
                              </div>
                              <div class="qrcode-bottom-view">
                                建议：比例为1:1，小于2M，jpg、png、jpeg格式
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
                        天内未邀请到新的好友，分享二维码将失效，裂变大师可重新下载
                      </div>
                      <div class="qrcode-bottom-view">
                        <span class="remind-view"></span>
                        因企业微信生成联系我二维码数量限制，请合理设置过期时间
                      </div>
                    </el-form-item>
                  </div>
                  <!-- 活动奖品 end-->
                  <!-- 活动规则 start-->
                  <div v-if='item.itemCode === "activityRule"' class='colle-container'>
                    <el-form-item label-width="110px" label="活动规则" prop="rules" required>
                      <tag-area
                        v-model="model.rules"
                        tag="wise"
                        ref="tagAreaTextRules"
                        :maxlength="1000"
                        placeholder="请输入活动规则"
                        @input="inputLength"
                        :showEmoji="true"
                        :showTextEmoji="true"
                      />
                    </el-form-item>
                  </div>
                  <!-- 活动规则 end-->
                  <!-- 注册会员 start-->
                  <div v-if='item.itemCode === "memberRegister"' class='colle-container'>
                    <el-form-item prop='bannerUrl'>
                      <div class='simple-updata'>
                        <el-avatar v-if="model.regUrl" shape="square" :size="100" fit="contain" :src="model.regUrl"></el-avatar>
                        <div v-else class='default-updata'>
                          <Icon type="plus" className="company-upload__tip"/>
                        </div>
                        <div class='upload-content'>
                          <drap-upload :maxSize="2" v-model='model.regUrl' :drag='false'>
                          </drap-upload>
                        </div>
                        <ns-button type='text' class="remind-text" @click="showDefCard('regUrl',defRegUrl)">恢复默认图片</ns-button>
                      </div>
                      <div class="qrcode-bottom-view">
                        建议：宽度750像素，高度不限，小于2M，jpg、png、jpeg格式
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
                </el-collapse-item>
              </template>
            </div>
          </el-collapse>
        </el-form>
      </template>
      <template slot="collapse-right">
        <ActivePhone :pageObj="{}" :showColor="model.showColor" :eidtList="model.eidtList" :model="model" :validTimeType='validTimeType' ref="activePhone" :activeId='tabAvtive'/>
      </template>
    </Box>
    <div class='costomcode-footer'>
      <div class='btn' @click="handlePrev">上一步，奖品设置</div>
      <div class='btn current' @click="handleSubmit">下一步</div>
    </div>
  </div>
</template>
<script>
import Box from '@/components/NewUi/Box'
import { STEP_LIST, DEFAULT_PAGEDECORATION_DATA, DEFAULT_ACTIVEINFO_ITEM } from '../../src/const'
import { formatePageObj, formatModel, formatCustomComponent, formatPrizeModel, formatModelSave, RichText, defBanner, defGoodsUrl, defRegUrl, defPosters, defCardImg } from '../../util/Edit'
import ColorView from '../ColorView'
import validates from '../../src/validates'
import ElColorPicker from '@nascent/nui/lib/color-picker'
import ActivePhone from '../ActivePhone'
import TagArea from '@/components/NewUi/TagArea'
import LengthInput from '@/components/NewUi/LengthInput'
import DrapUpload from '@/components/NewUi/DrapUpload'
import ElAvatar from '@nascent/nui/lib/avatar'

export default {
  data () {
    return {
      input: '',
      model: { ...DEFAULT_PAGEDECORATION_DATA },
      validates,
      rules: {
        rules: [
          { required: true, message: '请输入活动规则', trigger: ['blur', 'change'] }
        ],
        shareBtnText: [
          { required: true, message: '请输入分享按钮名称', trigger: ['blur', 'change'] }
        ]
      },
      activeNames: [0, 1, 2, 3, 4, 5, 6, 7],
      defCardImg,
      defBanner,
      defRegUrl,
      tabAvtive: 'tab1',
      isOpnePrize: true // 是否开启奖励
    }
  },
  props: ['data', 'isStating', 'validTimeType', 'ladderRewardList'],
  components: {
    Box, ActivePhone, ColorView, ElColorPicker, TagArea, ElAvatar, LengthInput, DrapUpload
  },
  methods: {
    formatSettingType (code) {
      return formatCustomComponent(code)
    },
    inputLength () {
      if (this.$refs.tagAreaTextRules) {
        this.$emit('scrollPhone', 'rules-view')
      }
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
    onclick (itemCode, status) {
      let event = window.event
      event.stopPropagation()
      this.onShowEdit(itemCode, status)
      if (itemCode === 'countdown' && this.validTimeType === 0) {
        this.eidtList[MODULE_TO_INDEX_MAP.countdown].status = 0
        this.$notify.warning('活动永久有效，无需显示倒计时')
      }
    },
    // 点击获取编辑模块
    onShowEdit (itemCode, status) {
      if (itemCode === 'countdown' || itemCode === 'reward') {
        this.$refs.activePhone.acScrollPhone('time-view')
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
    handleChangeTab () {

    },
    /**
     * 根据阶梯设置奖品
     */
    setActiveInfoList (ladderRewardList, isOpnePrize) {
      this.isOpnePrize = isOpnePrize
      if (isOpnePrize) {
        const newActiveInfoList = []
        for (let i = 0; i < ladderRewardList.length; i++) {
          const item = { ...ladderRewardList[i] }
          let activeInfoItem = {}
          if (newActiveInfoList[i]) {
            activeInfoItem = Object.assign(item, newActiveInfoList[i])
          } else {
            activeInfoItem = Object.assign({}, DEFAULT_ACTIVEINFO_ITEM, item)
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
      this.$refs.pageDecorationForm.validate((valid) => {
        if (valid) {
          this.$emit('changeData', {
            key: STEP_LIST[2].dataName,
            value: this.model
          })
          this.$emit('changeStepId', 'next')
        }
      })
    }
  },
  mounted () {
    this.model = { ...this.data }
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
.edit-view {
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-between;
  width: 100%;
}
.colle-container {
    background: #FBFBFB;
    border-radius: 2px;
    padding: 16px;
}
</style>
<style scoped>
.customCode-content_box {
  >>> .collapse-right,>>> .collapse-left{
    height: 100%;
    overflow-y: auto;
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
</style>
