<template>
  <el-dialog
    title="新增附码图片"
    :visible.sync="visible"
    width="960px"
    :before-close="handleCanle"
    modal-append-to-body
    append-to-body
  >
    <div class="container-view">
      <div class="left-view" id="right-originalPrice-view">
        <el-form label-width="100px" label-position="left" class="form-view" :model="content" :rules="rules" ref="ruleForm">
          <el-form-item label="">
            <label slot="label"><span style="display:inline-block;width:10px;"></span>选择小程序</label>
            <el-form-item required prop="appid">
              <el-select v-model="content.appid" placeholder="请选择小程序">
                <el-option
                  v-for="(item, index) in miniList"
                  :key="index"
                  :label="item.name"
                  :value="item.appid">
                </el-option>
              </el-select>
            </el-form-item>
            <div class="mini-view">
              <div style="color:#8C8C8C;">请先授权要选择的小程序，授权成功点击“刷新”获取</div>
              <div>
                <span @click="toBlackPage('howAuth')">如何授权&nbsp;</span>
                <span @click="toBlackPage('toAuth')">&nbsp;去授权</span>
                <span @click="refreshAppId">&nbsp;刷新</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="附码方式" required>
            <div class="custom-reaio-view">
              <div class="custom-radio-base" @click="handleCodeStyle(0)">
                <span class="iconfont icon-ns_arrow-circle-leftfuben6" style="color:#0091FA;font-size:18px" v-if="content.codeStyle === 0"></span>
                <span class="iconfont icon-ns-succeed" style="color:#D9D9D9;font-size:18px" v-else></span>
                <span class="custom-radio-base-name">选择商品</span>
              </div>
              <el-form-item prop="itemName" :rules="[
                {required:content.codeStyle === 0 ? true:false, message:'请选择商品', trigger: ['blur', 'change']},
              ]">
                <div class="select-shop-view" @click="selectShopGoods">
                  <div :class="content.itemName ? 'shop-name-text shop-true-name' : 'shop-name-text' ">{{content.itemName || '请选择商品'}}</div>
                  <div>
                    <Icon
                      type="icon-xin"
                      style="color: #8C8C8C;"
                    />
                  </div>
                </div>
              </el-form-item>
              <div class="custom-radio-base" @click="handleCodeStyle(1)">
                <span class="iconfont icon-ns_arrow-circle-leftfuben6" style="color:#0091FA;font-size:18px" v-if="content.codeStyle === 1"></span>
                <span class="iconfont icon-ns-succeed" style="color:#D9D9D9;font-size:18px" v-else></span>
                <span class="custom-radio-base-name">输入小程序路径</span>
              </div>
            </div>
            <!-- <el-radio-group v-model="content.codeStyle" @change="handleCodeStyle">
              <el-radio :label=0>选择商品</el-radio>
              <el-radio :label=1>输入小程序路径</el-radio>
            </el-radio-group> -->
            <!-- <div class="select-shop-view" v-show="content.codeStyle === 0">
              <el-form-item prop="itemName" :rules="[
                {required:content.codeStyle === 0 ? true:false, message:'请选择商品', trigger: ['blur', 'change']},
              ]">
                <el-input
                  placeholder="商品名称"
                  v-model="content.itemName"
                  :disabled="true"
                />
              </el-form-item>
              <div class="shop-button" @click="selectShopGoods">选择商品</div>
            </div> -->
            <div class="parameter-view">
              <div style="margin-bottom:8px">小程序路径</div>
              <el-form-item prop="path">
                <el-input
                  type="textarea"
                  placeholder="请输入小程序路径，长度在1-255个字"
                  :rows="2"
                  v-model="content.path"
                  maxlength="255"
                  show-word-limit
                  @input="miniPathChange"
                >
                </el-input>
              </el-form-item>
              <!-- <div style="font-size:12px;color:#8C8C8C;margin-top:-10px">移入“预览”查看映射关系的完整编译路径</div> -->
              <div class="show-path-url-view" style="margin-top:-10px">
                <span class="item-view" @click="toBlackPage('howGetPage')">如何获取路径</span>
                <el-popover
                  placement="bottom"
                  trigger="hover"
                  width="200"
                  :title="compPath"
                  :disabled="compPath.length === 0"
                >
                  <span slot="reference" class="item-view">预览完整路径</span>
                </el-popover>
              </div>
              <!-- <div>路径带参</div>
              <div class="show-path-remind-view">
                <div>SCRM字段参数名称</div>
                <div class="remid-right-view">小程序字段参数名称</div>
              </div>
              <div class="path-para-view">
                <div class="path-left-view">
                  <div>
                    <el-checkbox v-model="shopIdChecked">店铺编码</el-checkbox>
                    <el-popover
                      placement="bottom"
                      trigger="click"
                    >
                      <div>
                        <img style="width:890px;449px" src='@/assets/shopId-show.jpg'/>
                      </div>
                      <i slot="reference" class="iconfont icon-ns-help help-icon"></i>
                    </el-popover>
                  </div>
                  <div>=</div>
                </div>
                <el-input placeholder="请输入对应的字段参数名称" v-model="shopIdVal"/>
              </div>
              <div class="path-para-view">
                <div class="path-left-view">
                  <div>
                    <el-checkbox v-model="internalIdChecked"
                      >内部门店ID</el-checkbox
                    >
                    <el-popover
                      placement="bottom"
                      trigger="click"
                    >
                      <div>
                        <img style="width:890px;449px" src='@/assets/internal-Id.jpg'/>
                      </div>
                      <i slot="reference" class="iconfont icon-ns-help help-icon"></i>
                    </el-popover>
                  </div>
                  <div>=</div>
                </div>
                <el-input placeholder="请输入对应的字段参数名称" v-model="internalIdVal"/>
              </div>
              <div class="path-para-view">
                <div class="path-left-view">
                  <div>
                    <el-checkbox v-model="externalIdChecked"
                      >外部员工ID</el-checkbox
                    >
                    <el-popover
                      placement="bottom"
                      trigger="click"
                    >
                      <div>
                        <img style="width:890px;449px" src='@/assets/external-Id.jpg'/>
                      </div>
                      <i slot="reference" class="iconfont icon-ns-help help-icon"></i>
                    </el-popover>
                  </div>
                  <div>=</div>
                </div>
                <el-input placeholder="请输入对应的字段参数名称" v-model="externalIdVal"/>
              </div>
              <div class="path-para-view">
                <div class="path-left-view">
                  <div>
                    <el-checkbox v-model="memberIdChecked">员工ID</el-checkbox>
                    <el-popover
                      placement="bottom"
                      trigger="click"
                      width="200"
                      title="scrm对员工的唯一标识"
                    >
                      <i slot="reference" class="iconfont icon-ns-help help-icon"></i>
                    </el-popover>
                  </div>
                  <div>=</div>
                </div>
                <el-input placeholder="请输入对应的字段参数名称" v-model="memberIdVal"/>
              </div>
              <div class="path-para-view">
                <div class="path-left-view">
                  <div>
                    <el-checkbox v-model="memberUserIdChecked">员工userID</el-checkbox>
                    <el-popover
                      placement="bottom"
                      trigger="click"
                    >
                      <div>
                        <img style="width:890px;449px" src='@/assets/member-userId.jpg'/>
                      </div>
                      <i slot="reference" class="iconfont icon-ns-help help-icon"></i>
                    </el-popover>
                  </div>
                  <div>=</div>
                </div>
                <el-input placeholder="请输入对应的字段参数名称" v-model="memberUserIdVal"/>
              </div>
              <div class="path-para-view">
                <div class="path-left-view">
                  <div>
                    <el-checkbox v-model="materialIdChecked">素材ID</el-checkbox>
                  </div>
                  <div>=</div>
                </div>
                <el-input placeholder="请输入对应的字段参数名称" v-model="materialIdVal"/>
              </div> -->
            </div>
          </el-form-item>
          <el-form-item label="封面图" required>
            <el-form-item prop="backgroundImage">
              <div class="upload-view">
                <div class="img-url__logo">
                  <img v-if="content.backgroundImage" :src="content.backgroundImage" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <drap-upload
                    :scale='1'
                    scaleTip='1'
                    v-model='content.backgroundImage'
                    :isNeedCrop='true'
                    :showPont='false'
                    :drag='false'
                    :maxSize='2'
                    @input="handleAvatarSuccess"
                  >
                  </drap-upload>
                </div>
              </div>
            </el-form-item>
            <div class="remind-img">
              上传限制：建议比例1:1，小于2M，jpg、png、jpeg格式
            </div>
          </el-form-item>
          <el-form-item label="显示名称" required prop="title">
            <el-input
              placeholder="请输入名称，长度在36个字符以内"
              v-model="content.title"
              @input="titleChange"
            />
          </el-form-item>
          <el-form-item label="售价" required>
            <el-switch v-model="content.priceStatus" active-color="#0091FA" :active-value=1 :inactive-value=0 @change="priceStatusChange"> </el-switch>
            <div class="price-view" v-show="content.priceStatus === 1">
              <div class="sub-title">售价（元）</div>
              <el-form-item prop="price" :rules="[
                {required:content.priceStatus === 1 ? true:false, message:'请输入售价', trigger: ['blur', 'change']},
                {validator:checkPriceRules, trigger: ['blur', 'change'] }
              ]">
                <el-input placeholder="请输入售价" v-model="content.price" type="number" @input="priceChange" @keydown.native="channelInputLimit"/>
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item label="原价" required>
            <el-switch v-model="content.originalPriceStatus" active-color="#0091FA" :active-value=1 :inactive-value=0 @change="originalPriceStatusChange">
            </el-switch>
            <div class="price-view" v-show="content.originalPriceStatus === 1" style="margin-bottom:8px;">
              <div class="sub-title">原价（元）</div>
              <el-form-item prop="originalPrice" :rules="[
                {required:content.originalPriceStatus === 1 ? true:false, message:'请输入原价', trigger: ['blur', 'change']},
                {validator:checkOriginalPricRules, trigger: ['blur', 'change'] }
              ]">
                <el-input placeholder="请输入原价" v-model="content.originalPrice" type="number" @input="originalPriceChange" @keydown.native="channelInputLimit"/>
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item label="">
            <label slot="label"><span style="display:inline-block;width:10px;"></span>货号</label>
            <el-input placeholder="请输入货号" v-model="content.outerId" @input="outerIdChange"/>
          </el-form-item>
        </el-form>
      </div>
      <div class="right-view">
        <div class="show-info-view" id="show-info-view">
          <img class="image-view" :src="content.backgroundImage" v-if="content.backgroundImage.length > 0"/>
          <img class="image-view" :src="defaultUrl" v-else/>
          <div class="content-view">
            <div class="conent-left-view">
              <div class="title-view" v-if="content.title.length > 0">{{content.title}}</div>
              <div class="title-view" v-else>显示名称</div>
              <div class="left-price-view" v-show="content.priceStatus === 1">
                <span v-if="content.price">
                  <span style="font-size: 14px;display:inline-block;margin-right:4px">¥</span>{{ content.price}}
                </span>
                <span v-else>
                  <span>售价</span>
                </span>
              </div>
              <div class="left-orgian-view" v-show="content.originalPriceStatus === 1">
                <span v-if="content.originalPrice">原价：¥{{ content.originalPrice }}</span>
                <span v-else>原价</span>
              </div>
            </div>
            <div class="code-img-view">
              <div class="code-img" id="code-img-view">
                <img class="code-img" :src="defaultCodeUrl" style="width:112px;height:108px;"/>
              </div>
              <div class="code-title">长按查看详情</div>
            </div>
          </div>
        </div>
      </div>
      <div class="line-view"></div>
    </div>
    <span slot="footer" class="dialog-footer">
      <NsButton @click="handleCanle">取 消</NsButton>
      <NsButton type="primary" @click="handleSure" :loading="saveLoad">保 存</NsButton>
    </span>
    <SelectGoods ref="selectGoods" :callBack="selectMarketBack" :showMall="false" :showShop="true"/>
  </el-dialog>
</template>
<script>
import SelectGoods from '@/pages/Guide/Material/components/selectGoods'
import html2canvas from 'html2canvas'
import DrapUpload from '@/components/NewUi/DrapUpload'
export default {
  components: {
    SelectGoods,
    DrapUpload
  },
  data () {
    return {
      visible: false,
      saveLoad: false,
      maxSize: 2,
      maxPrice: 999999999,
      miniList: [],
      // shopIdChecked: false,
      // shopIdVal: '',
      // internalIdChecked: false,
      // internalIdVal: '',
      // externalIdChecked: false,
      // externalIdVal: '',
      // memberIdChecked: false,
      // memberIdVal: '',
      // memberUserIdChecked: false,
      // memberUserIdVal: '',
      // materialIdChecked: false,
      // materialIdVal: '',
      defaultCodeUrl: 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/message/202111/80000002/defaultCodeUrl@@32f02ec7-a959-4b02-b893-bf7f6d5fe423.jpg',
      defaultUrl:
        'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/message/202111/80000002/image-code-def@@e321db41-7eec-4269-bde8-53fcea0c7865.jpg',
      content: {
        path: '',
        title: '',
        image: '',
        price: '',
        originalPrice: '',
        priceStatus: 0,
        originalPriceStatus: 0,
        outerId: '',
        bankId: '',
        sysItemId: '',
        itemName: '',
        watermarkSetting: {
          resizeW: 112,
          resizeH: 108,
          gSeX: 0,
          gSeY: 0
        },
        backgroundImage: '',
        appid: '',
        codeStyle: 0,
        presetParams: []
      },
      urlObj: {
        howAuth: 'https://oa.nascent.cn/zhiku/detail?parent_ids=null30,777,779,788,&id=3809&title=',
        toAuth: 'https://sandboxecloudv5.vecrp.com/basic/wxApplets/index',
        howGetPage: 'https://oa.nascent.cn/zhiku/detail?parent_ids=null30,777,783,922,&id=3955&title='
      },
      parmaStrBottom: '1.需要添加参数时,需在路径后添加“?”,多个参数时用“&”隔开，如pages/member/test?id={userID}&number={workNumber}',
      goodsCache: {
        path: '',
        outerId: '',
        title: '',
        backgroundImage: '',
        price: '',
        originalPrice: '',
        priceStatus: 0,
        originalPriceStatus: 0
      },
      miniCache: {
        path: '',
        outerId: '',
        title: '',
        backgroundImage: '',
        price: '',
        originalPrice: '',
        priceStatus: 0,
        originalPriceStatus: 0
      },
      rules: {
        title: [
          { required: true, trigger: ['blur', 'change'], message: '请输入名称，长度在36个字符以内' },
          { validator: (rule, value, callback) => {
            if (value.length > 36) {
              callback(new Error('名称长度在36个字符以内'))
            } else {
              callback()
            }
          },
          trigger: ['blur', 'change'] }
        ],
        appid: [
          { required: true, trigger: ['blur', 'change'], message: '请选择小程序' }
        ],
        path: [
          { required: true, trigger: ['blur', 'change'], message: '请输入小程序路径，长度在1-255个字' }
        ]
      },
      appIdRefresh: false
    }
  },
  watch: {
    // shopIdVal (newValue, oldValue) {
    //   this.shopIdVal = this.shopIdVal.replace(/\s+/g, '')
    // },
    // internalIdVal (newValue, oldValue) {
    //   this.internalIdVal = this.internalIdVal.replace(/\s+/g, '')
    // },
    // externalIdVal (newValue, oldValue) {
    //   this.externalIdVal = this.externalIdVal.replace(/\s+/g, '')
    // },
    // memberIdVal (newValue, oldValue) {
    //   this.memberIdVal = this.memberIdVal.replace(/\s+/g, '')
    // },
    // memberUserIdVal (newValue, oldValue) {
    //   this.memberUserIdVal = this.memberUserIdVal.replace(/\s+/g, '')
    // },
    // materialIdVal (newValue, oldValue) {
    //   this.materialIdVal = this.materialIdVal.replace(/\s+/g, '')
    // }
  },
  computed: {
    compPath () {
      // const shopId = this.shopIdChecked && this.shopIdVal ? 'shopId=' + this.shopIdVal : ''
      // const internalId = this.internalIdChecked && this.internalIdVal ? 'workNumber=' + this.internalIdVal : ''
      // const outShopId = this.externalIdChecked && this.externalIdVal ? 'outShopId=' + this.externalIdVal : ''
      // const guideId = this.memberIdChecked && this.memberIdVal ? 'guideId=' + this.memberIdVal : ''
      // const guideUserId = this.memberUserIdChecked && this.memberUserIdVal ? 'guideUserId=' + this.memberUserIdVal : ''
      // const materialId = this.materialIdChecked && this.materialIdVal ? 'materialId=' + this.materialIdVal : ''
      // let arr = [shopId, internalId, outShopId, guideId, guideUserId, materialId]
      // arr = arr.filter(item => item.length > 0)
      // if (arr.length > 0) {
      //   if (this.content.path.includes('?')) {
      //     return this.content.path + '&' + arr.join('&')
      //   } else {
      //     return this.content.path + '?' + arr.join('&')
      //   }
      // }
      return this.content.path
    }
  },
  mounted () {
    this.loadAppIds()
  },
  methods: {
    checkOriginalPricRules (rule, value, callback) {
      if (this.content.originalPriceStatus === 1) {
        const regex = /^(\d+)(.\d{0,2})?$/g
        if (!regex.test(value)) {
          callback(new Error(`最多输入2位小数`))
        }
        if (parseFloat(value) > 999999999) {
          callback(new Error(`原价最大金额为999999999`))
        } else {
          callback()
        }
      }
    },
    checkPriceRules (rule, value, callback) {
      if (this.content.priceStatus === 1) {
        const regex = /^(\d+)(.\d{0,2})?$/g
        if (!regex.test(value)) {
          callback(new Error(`最多输入2位小数`))
        }
        if (parseFloat(value) > 999999999) {
          callback(new Error(`售价最大金额为999999999`))
        } else {
          callback()
        }
      }
    },
    refreshAppId () {
      this.appIdRefresh = true
      this.loadAppIds()
    },
    originalPriceStatusChange (e) {
      if (this.content.codeStyle === 0) {
        this.goodsCache.originalPriceStatus = e
      } else if (this.content.codeStyle === 1) {
        this.miniCache.originalPriceStatus = e
      }
      setTimeout(() => {
        let target = document.getElementById('right-originalPrice-view')
        target.scrollTop = target.scrollHeight
      }, 0)
    },
    priceStatusChange (e) {
      if (this.content.codeStyle === 0) {
        this.goodsCache.priceStatus = e
      } else if (this.content.codeStyle === 1) {
        this.miniCache.priceStatus = e
      }
      setTimeout(() => {
        let target = document.getElementById('right-originalPrice-view')
        target.scrollTop = target.scrollHeight
      }, 0)
    },
    channelInputLimit (e) {
      let key = e.key
      if (key === 'e') {
        e.returnValue = false
        return false
      }
      return true
    },
    originalPriceChange (e) {
      if (this.content.codeStyle === 0) {
        this.goodsCache.originalPrice = e
      } else if (this.content.codeStyle === 1) {
        this.miniCache.originalPrice = e
      }
    },
    priceChange (e) {
      if (this.content.codeStyle === 0) {
        this.goodsCache.price = e
      } else if (this.content.codeStyle === 1) {
        this.miniCache.price = e
      }
    },
    titleChange (e) {
      if (this.content.codeStyle === 0) {
        this.goodsCache.title = e
      } else if (this.content.codeStyle === 1) {
        this.miniCache.title = e
      }
    },
    outerIdChange (e) {
      // const str = e.replace(/[\u4e00-\u9fa5]/ig, '')
      // this.content.outerId = str
      if (this.content.codeStyle === 0) {
        this.goodsCache.outerId = e
      } else if (this.content.codeStyle === 1) {
        this.miniCache.outerId = e
      }
    },
    miniPathChange (e) {
      if (this.content.codeStyle === 0) {
        this.goodsCache.path = e
      } else if (this.content.codeStyle === 1) {
        this.miniCache.path = e
      }
    },
    handleCodeStyle (index) {
      this.content.codeStyle = index
      let cacheObj = {}
      if (index === 0) {
        cacheObj = this.goodsCache
      } else if (index === 1) {
        cacheObj = this.miniCache
        this.content.itemName = ''
      }
      this.content.path = cacheObj.path
      this.content.outerId = cacheObj.outerId
      this.content.title = cacheObj.title
      this.content.backgroundImage = cacheObj.backgroundImage
      this.content.price = cacheObj.price
      this.content.originalPrice = cacheObj.originalPrice
      this.content.priceStatus = cacheObj.priceStatus
      this.content.originalPriceStatus = cacheObj.originalPriceStatus
    },
    showImageCode (item) {
      this.visible = true
      this.loadAppIds()
      if (item) {
        this.content = { ...item.content }
        if (this.content.codeStyle === 0) {
          this.goodsCache = { ...this.content }
        } else if (this.content.codeStyle === 1) {
          this.miniCache = { ...this.content }
        }
        // console.log(item.content)
      }
      // if (this.miniList.length > 0) {
      //   this.content.appid = this.miniList[0].appid
      // }
    },
    toBlackPage (key) {
      window.open(this.urlObj[key], '_blank')
    },
    initData () {
      this.saveLoad = false
      // this.shopIdChecked = false
      // this.shopIdVal = ''
      // this.internalIdChecked = false
      // this.internalIdVal = ''
      // this.externalIdChecked = false
      // this.externalIdVal = ''
      // this.memberIdChecked = false
      // this.memberIdVal = ''
      // this.memberUserIdChecked = false
      // this.memberUserIdVal = ''
      // this.materialIdChecked = false
      // this.materialIdVal = ''
      this.content = {
        path: '',
        title: '',
        image: '',
        price: '',
        originalPrice: '',
        priceStatus: 0,
        originalPriceStatus: 0,
        outerId: '',
        bankId: '',
        sysItemId: '',
        itemName: '',
        watermarkSetting: {
          resizeW: 112,
          resizeH: 108,
          gSeX: 0,
          gSeY: 0
        },
        backgroundImage: '',
        appid: '',
        codeStyle: 0,
        presetParams: []
      }
      this.appIdRefresh = false
      this.goodsCache = {
        path: '',
        outerId: '',
        title: '',
        backgroundImage: '',
        price: '',
        originalPrice: '',
        priceStatus: 0,
        originalPriceStatus: 0
      }
      this.miniCache = {
        path: '',
        outerId: '',
        title: '',
        backgroundImage: '',
        price: '',
        originalPrice: '',
        priceStatus: 0,
        originalPriceStatus: 0
      }
    },
    beforeUpload (file) {
      if (file.size / 1024 / 1024 > this.maxSize) {
        this.$notify.warning(`上传图片不能超过${this.maxSize}M`)
        return false
      }
    },
    loadAppIds () {
      this.miniList = []
      this.content.appid = ''
      let that = this
      this.$http
        .fetch(this.$api.guide.findWxAppletsList, {})
        .then(resp => {
          const list = resp.result || []
          list.forEach((item) => {
            const obj = {
              name: item.nickName,
              appid: item.appId
            }
            that.miniList.push(obj)
          })
          if (list.length > 0) {
            that.content.appid = that.miniList[0].appid
          }
          if (that.appIdRefresh) {
            this.$notify.success('刷新成功')
          }
          that.appIdRefresh = false
        })
        .catch(resp => {
          that.appIdRefresh = false
        })
    },
    handleAvatarSuccess (url) {
      // this.content.backgroundImage = url
      if (this.content.codeStyle === 0) {
        this.goodsCache.backgroundImage = url
      } else if (this.content.codeStyle === 1) {
        this.miniCache.backgroundImage = url
      }
    },
    handleCanle () {
      this.visible = false
      this.initData()
      this.$refs.ruleForm.resetFields()
      // this.$emit('handleImageCode', false)
    },
    dataURLtoFile (dataURI, type) {
      let binary = atob(dataURI.split(',')[1])
      let array = []
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i))
      }
      return new Blob([new Uint8Array(array)], { type: type })
    },
    async handleSure () {
      const title = new Promise((resolve, reject) => {
        this.$refs.ruleForm.validateField('title', vaild => {
          if (!vaild) {
            resolve(true)
          }
        })
      })
      const appid = new Promise((resolve, reject) => {
        this.$refs.ruleForm.validateField('appid', vaild => {
          if (!vaild) {
            resolve(true)
          }
        })
      })
      const path = new Promise((resolve, reject) => {
        this.$refs.ruleForm.validateField('path', vaild => {
          if (!vaild) {
            resolve(true)
          }
        })
      })

      let arr = [title, appid, path]
      // itemName
      if (this.content.codeStyle === 0) {
        const price = new Promise((resolve, reject) => {
          this.$refs.ruleForm.validateField('itemName', vaild => {
            if (!vaild) {
              resolve(true)
            }
          })
        })
        arr.push(price)
      }
      if (this.content.priceStatus === 1) {
        const price = new Promise((resolve, reject) => {
          this.$refs.ruleForm.validateField('price', vaild => {
            if (!vaild) {
              resolve(true)
            }
          })
        })
        arr.push(price)
      }
      if (this.content.originalPriceStatus === 1) {
        const originalPrice = new Promise((resolve, reject) => {
          this.$refs.ruleForm.validateField('originalPrice', vaild => {
            if (!vaild) {
              resolve(true)
            }
          })
        })
        arr.push(originalPrice)
      }

      const allRules = await Promise.all(arr)
      const checkRules = allRules.length === arr.length
      if (this.content.outerId && this.content.outerId.length > 48) {
        this.$notify.warning('货号字符上限为48位')
        return
      }
      if (checkRules) {
        this.content.price = Number(this.content.price)
        this.content.originalPrice = Number(this.content.originalPrice)
        const view = document.getElementById('show-info-view')
        const codeImg = document.querySelector('#code-img-view').getBoundingClientRect()
        const showInfo = document.querySelector('#show-info-view').getBoundingClientRect()
        this.content.watermarkSetting.gSeX = showInfo.right - codeImg.right + 1
        this.content.watermarkSetting.gSeY = showInfo.bottom - codeImg.bottom
        // this.content.presetParams = []
        // let guideId = {
        //   paramCode: 'guideId',
        //   paramName: this.memberIdVal,
        //   status: this.memberIdChecked ? 1 : 0
        // }
        // let shopId = {
        //   paramCode: 'shopId',
        //   paramName: this.shopIdVal,
        //   status: this.shopIdChecked ? 1 : 0
        // }
        // let workNumber = {
        //   paramCode: 'workNumber',
        //   paramName: this.internalIdVal,
        //   status: this.internalIdChecked ? 1 : 0
        // }
        // let outShopId = {
        //   paramCode: 'outShopId',
        //   paramName: this.externalIdVal,
        //   status: this.externalIdChecked ? 1 : 0
        // }
        // let guideUserId = {
        //   paramCode: 'guideUserId',
        //   paramName: this.memberUserIdVal,
        //   status: this.memberUserIdChecked ? 1 : 0
        // }
        // let materialId = {
        //   paramCode: 'materialId',
        //   paramName: this.materialIdVal,
        //   status: this.materialIdChecked ? 1 : 0
        // }
        // this.content.presetParams.push(guideId)
        // this.content.presetParams.push(shopId)
        // this.content.presetParams.push(workNumber)
        // this.content.presetParams.push(outShopId)
        // this.content.presetParams.push(guideUserId)
        // this.content.presetParams.push(materialId)
        let that = this
        this.saveLoad = true
        // let canvas = document.createElement('canvas')
        // let targetWidth = view.offsetWidth
        // let targetHeight = view.offsetHeight
        // let scale = window.devicePixelRatio
        // canvas.width = targetWidth * scale
        // canvas.height = targetHeight * scale
        // canvas.style.width = targetWidth * scale + 'px'
        // canvas.style.height = targetHeight * scale + 'px'
        // canvas.getContext('2d').scale(scale, scale)
        html2canvas(view, {
          useCORS: true
        }).then(canvas => {
          const file = canvas.toDataURL('image/jpeg')
          let blob = this.dataURLtoFile(file, 'image/jpeg')
          let param = new FormData()
          let fileOfBlob = new File([blob], Date.now() + '.jpg')
          param.append('file', fileOfBlob)
          this.$http
            .fetch(this.$api.guide.customImage, param, { headers: { 'Content-Type': 'image/jpg' } })
            .then(resp => {
              const json = resp.result
              that.content.image = json.url || ''
              that.$emit('confirm', { type: 'imagecode', content: { ...that.content } })
              that.$emit('handleImageCode', false)
              that.visible = false
              that.initData()
              that.$refs.ruleForm.resetFields()
            })
            .catch(resp => {
              that.saveLoad = false
            })
        })
      }
    },
    selectShopGoods () {
      if (this.content.codeStyle === 1) return
      let obj = { codeTarget: this.content.sysItemId }
      this.$refs.selectGoods.showToggle(obj)
    },
    selectShopInit () {
      this.content.bankId = ''
      this.content.sysItemId = ''
      this.content.itemName = ''
      this.content.backgroundImage = ''
      this.goodsCache.backgroundImage = ''
      this.content.title = ''
      this.goodsCache.title = ''
      this.content.path = ''
      this.goodsCache.path = ''
      this.content.price = ''
      this.content.priceStatus = 0
      this.goodsCache.price = ''
      this.goodsCache.priceStatus = 0
      this.content.originalPrice = ''
      this.content.originalPriceStatus = 0
      this.goodsCache.originalPrice = ''
      this.goodsCache.originalPriceStatus = 0
    },
    selectMarketBack (item) {
      this.selectShopInit()
      this.content.bankId = Number(item.bankId)
      this.content.sysItemId = item.sysItemId
      this.content.itemName = item.title
      this.content.backgroundImage = item.pictureUrl || ''
      this.goodsCache.backgroundImage = item.pictureUrl || ''
      this.content.title = item.title || ''
      this.goodsCache.title = item.title || ''
      this.content.path = item.itemUrl || ''
      this.goodsCache.path = item.itemUrl || ''
      if (parseFloat(item.suggestPrice, 10) > 0) {
        this.content.price = item.suggestPrice
        this.content.priceStatus = 1
        this.goodsCache.price = item.suggestPrice
        this.goodsCache.priceStatus = 1
      }
      if (parseFloat(item.markedPrice, 10) > 0) {
        this.content.originalPrice = item.markedPrice
        this.content.originalPriceStatus = 1
        this.goodsCache.originalPrice = item.markedPrice
        this.goodsCache.originalPriceStatus = 1
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import './styles/imageCode.css';
.custom-reaio-view {
  display: flex;
  flex-direction: row;
  font-size: 14px;
  color: #303133;
  // margin-bottom: 20px;
  .custom-radio-base {
    display: flex;
    flex-direction: row;
    cursor: pointer;
    margin-right: 8px;
    .custom-radio-base-name {
      display: inline-block;
      margin-left: 8px;
    }
  }
  .select-shop-view {
    width: 141px;
    height: 32px;
    background: #FFFFFF;
    border: 1px solid #D9D9D9;
    border-radius: 2px;
    margin-right: 8px;
    display: flex;
    flex-direction: row;
    font-size: 14px;
    align-items: center;
    justify-content: space-between;
    padding: 0 9px;
    cursor: pointer;
    .shop-name-text {
      font-size: 14px;
      color: #BFBFBF;
      overflow: hidden;
      word-break: break-all;
      -webkit-line-clamp: 1;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
    }
    .shop-true-name {
      color: #595959;
    }
  }
}
.container-view {
  display: flex;
  flex-direction: row;
  position: relative;
}
.line-view {
  position: absolute;
  left: 55%;
  width: 1px;
  height: 100%;
  top: 0;
  background-color: #E8E8E8;
}
.left-view {
  width: 55%;
  height: 650px;
  overflow: scroll;
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: #9093994d;
  }
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
}
.right-view {
  width: 45%;
  position: relative;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  .show-info-view {
    position: absolute;
    top: 100px;
    left: 20px;
    background: #ffffff;
    border-radius: 6px;
    width: 380px;
    box-shadow: 2px 2px 5px #d8d8d8;
    .image-view {
      width: 100%;
      height: 380px;
      border-radius: 6px 6px 0px 0px;
    }
    .content-view {
      padding: 16px;
      background: #ffffff;
      border-radius: 0px 0px 6px 6px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .conent-left-view {
        display: flex;
        flex-direction: column;
        justify-content: center;
        .title-view {
          font-size: 16px;
          color: rgba(0, 0, 0, 0.85);
          line-height: 24px;
          max-height: 72px;
          font-weight: 600;
          width: 204px;
          margin-bottom: 8px;
          // position: relative;
          overflow: hidden;
          text-align: justify;
          text-overflow: ellipsis;
          // display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          // &::before{
          //   content: '...';
          //   position: absolute;
          //   right: 0;
          //   bottom: 0;
          // }
          // &::after{
          //   content: "";
          //   position: absolute;
          //   right: 0;
          //   width: 35px;
          //   height: 35px;
          //   background-color: white;
          // }
        }
        .left-price-view {
          font-size: 20px;
          color: #f7454e;
          line-height: 28px;
          font-weight: 600;
        }
        .left-orgian-view {
          font-size: 12px;
          color: #8c8c8c;
          line-height: 20px;
          font-weight: 400;
          text-decoration-color: '#8c8c8c';
          text-decoration-line: line-through;
          text-decoration-style: 'solid';
        }
      }
      .code-img-view {
        .code-img {
          width: 112px;
          height: 108px;
        }
        .code-title {
          margin-top: 5px;
          font-size: 12px;
          color: #8C8C8C;
          text-align: center;
          line-height: 20px;
        }
      }
    }
  }
}
.mini-view {
  font-size: 12px;
  color: #0094fc;
  line-height: 22px;
  font-weight: 400;
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  margin-top: 5px;
  cursor: pointer;
}
.select-shop-view {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
  .shop-button {
    width: 88px;
    height: 32px;
    background: #0094fc;
    border-radius: 2px;
    text-align: center;
    font-size: 14px;
    color: #ffffff;
    box-sizing: content-box;
    line-height: 32px;
    cursor: pointer;
  }
}
.price-view {
  margin-top: 10px;
  background: #f5f5f5;
  border-radius: 2px;
  width: 100%;
  padding: 16px;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-between;
  .sub-title {
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    color: #595959;
  }
}
.parameter-view {
  background: #f5f5f5;
  width: 100%;
  padding: 16px 16px 16px 16px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #595959;
  line-height: 22px;
  .show-path-url-view {
    color: #0094fc;
    display: flex;
    flex-direction: row;
    font-size: 12px;
    cursor: pointer;
    // margin-bottom: 16px;
    .item-view {
      display: inline-block;
      margin-right: 8px;
    }
  }
  // .path-para-view {
  //   display: flex;
  //   flex-direction: row;
  //   font-size: 14px;
  //   color: #595959;
  //   justify-content: space-between;
  //   align-content: center;
  //   .path-left-view {
  //     display: flex;
  //     flex-direction: row;
  //     justify-content: space-between;
  //     align-items: center;
  //     width: 130px;
  //     height: 32px;
  //     line-height: 32px;
  //     .help-icon {
  //       color: #8c8c8c;
  //       margin-left: 5px;
  //     }
  //   }
  // }
  // .show-path-remind-view {
  //   margin-top: 8px;
  //   display: flex;
  //   flex-direction: row;
  //   font-size: 12px;
  //   color: #303133;
  //   justify-content: space-between;
  //   margin-bottom: 8px;
  //   .remid-right-view {
  //     width: 60%;
  //     text-align: center;
  //   }
  // }
}
.remind-img {
  font-size: 14px;
  color: #8c8c8c;
  line-height: 22px;
  font-weight: 400;
  margin-bottom: 16px;
  margin-top: 8px;
}
.img-url__logo {
  position: relative;
  height: 110px;
  overflow: hidden;
}
.img-url__logo >>> .upload-demo .el-upload {
  position: absolute;
  top:0;
  left: 0;
  right: 0;
  bottom: 0;
}
.img-url__logo >>> .poster-content{
  opacity: 0;
  padding: 0;
}
.img-url__logo >>> .el-upload-list {
  display: none;
}
.img-url__logo >>> .poster-set_content {
  display: none
}
.img-url__logo >>> .padingbottom {
  display: none;
}
</style>
