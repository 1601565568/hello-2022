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
      <div class="left-view">
        <el-form label-width="100px" label-position="left" class="form-view">
          <el-form-item label="小程序" required>
            <el-select v-model="miniList" placeholder="请选择小程序">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
            <div class="mini-view">
              <div>已授权未显示？点此刷新</div>
              <div>
                <span>如何授权&nbsp;</span>
                <span>&nbsp;去授权</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="附码方式" required>
            <el-radio-group v-model="content.codeStyle">
              <el-radio label="0">选择商品</el-radio>
              <el-radio label="1">输入小程序路径</el-radio>
            </el-radio-group>
            <div class="select-shop-view" v-show="content.codeStyle === '0'">
              <el-input
                placeholder="商品名称"
                v-model="content.itemName"
                :disabled="true"
              />
              <div class="shop-button" @click="selectShopGoods">选择商品</div>
            </div>
            <div class="parameter-view">
              <div style="margin-bottom:8px">小程序路径</div>
              <el-input
                type="textarea"
                placeholder="请输入小程序路径，长度在1-255个字"
                :rows="2"
                v-model="content.path"
                maxlength="255"
                show-word-limit
              >
              </el-input>
              <div class="show-path-url-view">
                <span class="item-view">带参配置说明</span>
                <span class="item-view">如何获取路径</span>
                <span class="item-view">预览</span>
              </div>
              <div>路径带参</div>
              <div class="show-path-remind-view">
                <div>SCRM字段参数名称</div>
                <div class="remid-right-view">小程序字段参数名称</div>
              </div>
              <div class="path-para-view">
                <div class="path-left-view">
                  <div>
                    <el-checkbox v-model="shopIdChecked">店铺编码</el-checkbox>
                    <i class="iconfont icon-ns-help help-icon"></i>
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
                    <i class="iconfont icon-ns-help help-icon"></i>
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
                    <i class="iconfont icon-ns-help help-icon"></i>
                  </div>
                  <div>=</div>
                </div>
                <el-input placeholder="请输入对应的字段参数名称" v-model="externalIdVal"/>
              </div>
              <div class="path-para-view">
                <div class="path-left-view">
                  <div>
                    <el-checkbox v-model="memberIdChecked">员工ID</el-checkbox>
                    <i class="iconfont icon-ns-help help-icon"></i>
                  </div>
                  <div>=</div>
                </div>
                <el-input placeholder="请输入对应的字段参数名称" v-model="memberIdVal"/>
              </div>
              <div class="path-para-view">
                <div class="path-left-view">
                  <div>
                    <el-checkbox v-model="memberUserIdChecked"
                      >员工userID</el-checkbox
                    >
                    <i class="iconfont icon-ns-help help-icon"></i>
                  </div>
                  <div>=</div>
                </div>
                <el-input placeholder="请输入对应的字段参数名称" v-model="memberUserIdVal"/>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="货号">
            <el-input placeholder="请输入货号" v-model="content.outerId" />
          </el-form-item>
          <el-form-item label="图片" required>
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              :action="$api.core.sgUploadFile('test')"
              :on-success="handleAvatarSuccess"
              accept=".jpg,.jpeg,.png"
            >
              <img v-if="content.backgroundImage" :src="content.backgroundImage" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div class="remind-img">
              请上传格式为JPG、JPEG、PNG格式的图片，大小不超过2M
            </div>
          </el-form-item>
          <el-form-item label="名称" required>
            <el-input
              placeholder="请输入标题，长度在36个字符以内"
              v-model="content.title"
            />
          </el-form-item>
          <el-form-item label="售价" required>
            <el-switch v-model="content.priceStatus" active-color="#0091FA"> </el-switch>
            <div class="price-view">
              <div class="sub-title">售价（元）</div>
              <el-input placeholder="请输入售价" v-model="content.price" />
            </div>
          </el-form-item>
          <el-form-item label="原价" required>
            <el-switch v-model="content.originalPriceStatus" active-color="#0091FA">
            </el-switch>
            <div class="price-view">
              <div class="sub-title">原价（元）</div>
              <el-input placeholder="请输入原价" v-model="content.originalPrice" />
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="right-view">
        <div class="show-info-view" id="show-info-view">
          <img class="image-view" :src="content.backgroundImage || defaultUrl" crossOrigin="anonymous"/>
          <div class="content-view">
            <div class="left-view">
              <div class="title-view">
                {{content.title || '这是标题'}}
              </div>
              <div class="left-price-view" v-show="content.price.length > 0">
                <span style="font-size: 14px;display:inline-block;margin-right:4px">¥</span>{{ content.price }}
              </div>
              <div class="left-orgian-view" v-show="content.originalPrice.length > 0">
                原价：¥{{ content.originalPrice }}
              </div>
            </div>
            <div class="code-img-view">
              <div class="code-img" id="code-img-view">
                <img class="code-img" src="https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/guideApplet/80000002/1123181/1039937/1/1.jpg"/>
              </div>
              <div class="code-title">长按查看商品详情</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <NsButton @click="handleCanle">取 消</NsButton>
      <NsButton type="primary" @click="handleSure">保 存</NsButton>
    </span>
    <SelectGoods ref="selectGoods" :callBack="selectMarketBack" />
  </el-dialog>
</template>
<script>
import ElUpload from '@nascent/nui/lib/upload'
import SelectGoods from '@/pages/Guide/Material/components/selectGoods'
import html2canvas from 'html2canvas'
export default {
  components: {
    ElUpload,
    SelectGoods
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      miniList: ['shanghai', 'beijing'],
      shopIdChecked: false,
      shopIdVal: '',
      internalIdChecked: false,
      internalIdVal: '',
      externalIdChecked: false,
      externalIdVal: '',
      memberIdChecked: false,
      memberIdVal: '',
      memberUserIdChecked: false,
      memberUserIdVal: '',
      defaultUrl:
        'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/image/image-code-def.jpg',
      content: {
        path: '',
        title: '',
        image: '',
        price: '',
        originalPrice: '',
        priceStatus: false,
        originalPriceStatus: false,
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
        codeStyle: '0',
        presetParams: []
      }
    }
  },
  methods: {
    handleAvatarSuccess (res, file) {
      this.content.backgroundImage = res.result.url || ''
    },
    handleCanle () {
      this.$emit('handleImageCode', false)
    },
    dataURLtoFile (dataURI, type) {
      let binary = atob(dataURI.split(',')[1])
      let array = []
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i))
      }
      return new Blob([new Uint8Array(array)], { type: type })
    },
    handleSure () {
      // console.log(this.content)
      // this.$emit('handleImageCode', false)
      const view = document.querySelector('.show-info-view')
      const codeImg = document.querySelector('#code-img-view').getBoundingClientRect()
      const showInfo = document.querySelector('#show-info-view').getBoundingClientRect()
      this.content.watermarkSetting.gSeX = showInfo.right - codeImg.right
      this.content.watermarkSetting.gSeY = showInfo.bottom - codeImg.bottom
      this.content.presetParams = []
      let guideId = {
        paramCode: 'guideId',
        paramName: this.memberIdVal,
        status: this.memberIdChecked ? 1 : 0
      }
      let shopId = {
        paramCode: 'shopId',
        paramName: this.shopIdVal,
        status: this.shopIdChecked ? 1 : 0
      }
      let workNumber = {
        paramCode: 'workNumber',
        paramName: this.internalIdVal,
        status: this.internalIdChecked ? 1 : 0
      }
      let outShopId = {
        paramCode: 'outShopId',
        paramName: this.externalIdVal,
        status: this.externalIdChecked ? 1 : 0
      }
      let guideUserId = {
        paramCode: 'guideUserId',
        paramName: this.memberUserIdVal,
        status: this.memberUserIdChecked ? 1 : 0
      }
      this.content.presetParams.push(guideId)
      this.content.presetParams.push(shopId)
      this.content.presetParams.push(workNumber)
      this.content.presetParams.push(outShopId)
      this.content.presetParams.push(guideUserId)
      let that = this
      html2canvas(view, {
        useCORS: true
      }).then(canvas => {
        const file = canvas.toDataURL('image/jpeg')
        let blob = this.dataURLtoFile(file, 'image/jpeg')
        let param = new FormData()
        let fileOfBlob = new File([blob], Date.now() + '.jpg')
        param.append('file', fileOfBlob)
        this.$http
          .fetch(this.$api.guide.customImage, param)
          .then(resp => {
            const json = resp.result
            that.content.image = json.url || ''
            that.$emit('confirm', { type: 'imagecode', content: { ...that.content } })
            that.$emit('handleImageCode', false)
            console.log(this.content)
          })
          .catch(resp => {
          })
      })
    },
    selectShopGoods () {
      this.$refs.selectGoods.showToggle()
    },
    selectMarketBack (item) {
      this.content.outerId = item.outerId
      this.content.bankId = item.bankId
      this.content.sysItemId = item.sysItemId
      this.content.itemName = item.title
    }
  }
}
</script>
<style lang="scss" scoped>
@import './styles/imageCode.css';
.container-view {
  display: flex;
  flex-direction: row;
}
.left-view {
  width: 55%;
}
.right-view {
  width: 45%;
  display: flex;
  align-items: center;
  justify-content: center;
  .show-info-view {
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
      .left-view {
        display: flex;
        flex-direction: column;
        justify-content: center;
        .title-view {
          font-size: 16px;
          color: rgba(0, 0, 0, 0.85);
          line-height: 24px;
          font-weight: 600;
          width: 204px;
          margin-bottom: 8px;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
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
          text-decoration: line-through;
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
  font-size: 14px;
  color: #0094fc;
  line-height: 22px;
  font-weight: 400;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 25px;
  margin-top: 5px;
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
  margin-top: 16px;
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
  padding: 16px 16px 8px 16px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #595959;
  line-height: 22px;
  .show-path-url-view {
    color: #0094fc;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    .item-view {
      display: inline-block;
      margin-left: 8px;
    }
  }
  .path-para-view {
    display: flex;
    flex-direction: row;
    font-size: 14px;
    color: #595959;
    justify-content: space-between;
    align-content: center;
    .path-left-view {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 130px;
      height: 32px;
      line-height: 32px;
      .help-icon {
        color: #8c8c8c;
        margin-left: 5px;
      }
    }
  }
  .show-path-remind-view {
    margin-top: 8px;
    display: flex;
    flex-direction: row;
    font-size: 12px;
    color: #303133;
    justify-content: space-between;
    margin-bottom: 8px;
    .remid-right-view {
      width: 60%;
      text-align: center;
    }
  }
}
.remind-img {
  font-size: 14px;
  color: #8c8c8c;
  line-height: 22px;
  font-weight: 400;
  margin-bottom: 16px;
  margin-top: 8px;
}
</style>
