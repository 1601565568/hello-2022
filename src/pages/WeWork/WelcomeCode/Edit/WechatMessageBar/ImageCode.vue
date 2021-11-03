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
            <el-radio-group v-model="codeStyle">
              <el-radio label="0">选择商品</el-radio>
              <el-radio label="1">输入小程序路径</el-radio>
            </el-radio-group>
            <div class="select-shop-view" v-show="codeStyle === '0'">
              <el-input
                placeholder="商品名称"
                v-model="goodsName"
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
                v-model="goodsPath"
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
                <el-input placeholder="请输入对应的字段参数名称" />
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
                <el-input placeholder="请输入对应的字段参数名称" />
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
                <el-input placeholder="请输入对应的字段参数名称" />
              </div>
              <div class="path-para-view">
                <div class="path-left-view">
                  <div>
                    <el-checkbox v-model="memberIdChecked">员工ID</el-checkbox>
                    <i class="iconfont icon-ns-help help-icon"></i>
                  </div>
                  <div>=</div>
                </div>
                <el-input placeholder="请输入对应的字段参数名称" />
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
                <el-input placeholder="请输入对应的字段参数名称" />
              </div>
            </div>
          </el-form-item>
          <el-form-item label="货号">
            <el-input placeholder="请输入货号" v-model="goodsId" />
          </el-form-item>
          <el-form-item label="图片" required>
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              :action="$api.core.sgUploadFile('test')"
              :on-success="handleAvatarSuccess"
              accept=".jpg,.jpeg,.png"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div class="remind-img">
              请上传格式为JPG、JPEG、PNG格式的图片，大小不超过2M
            </div>
          </el-form-item>
          <el-form-item label="名称" required>
            <el-input
              placeholder="请输入标题，长度在36个字符以内"
              v-model="goodsTitle"
            />
          </el-form-item>
          <el-form-item label="售价" required>
            <el-switch v-model="price" active-color="#0091FA"> </el-switch>
            <div class="price-view">
              <div class="sub-title">售价（元）</div>
              <el-input placeholder="请输入售价" v-model="goodsPrice" />
            </div>
          </el-form-item>
          <el-form-item label="原价" required>
            <el-switch v-model="originalPrice" active-color="#0091FA">
            </el-switch>
            <div class="price-view">
              <div class="sub-title">原价（元）</div>
              <el-input placeholder="请输入原价" v-model="goodsOrginPrice" />
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="right-view">
        <div class="show-info-view">
          <img class="image-view" :src="imageUrl || defaultUrl" crossOrigin="anonymous"/>
          <div class="content-view">
            <div class="left-view">
              <div class="title-view">
                商品标题最多显示三行商品标题最多显示三行商品标题最多显示三行商品标题最多
              </div>
              <div class="left-price-view" v-show="goodsPrice.length > 0">
                ¥{{ goodsPrice }}
              </div>
              <div class="left-orgian-view" v-show="goodsOrginPrice.length > 0">
                原价：{{ goodsOrginPrice }}
              </div>
            </div>
            <div class="code-img-view"></div>
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
      codeStyle: '0',
      price: '',
      originalPrice: '',
      imageUrl: '',
      goodsId: '',
      goodsName: '',
      goodsPrice: '',
      goodsOrginPrice: '',
      goodsTitle: '',
      goodsPath: '',
      checked: false,
      shopIdChecked: false,
      internalIdChecked: false,
      externalIdChecked: false,
      memberIdChecked: false,
      memberUserIdChecked: false,
      defaultUrl:
        'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-WEB/image/image-code-def.jpg'
    }
  },
  methods: {
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
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
      // this.$emit('handleImageCode', false)
      const view = document.querySelector('.show-info-view')
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
          })
          .catch(resp => {
          })
      })
    },
    selectShopGoods () {
      this.$refs.selectGoods.showToggle()
    },
    selectMarketBack (item) {
      this.goodsName = item.title || ''
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
