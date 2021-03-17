<template>
  <div>
    <!-- 页面顶部内容 - 标题、保存按钮、面包屑 -->
    <div class="nonMember-head">
      <div class="clearfix nonMember-head__title">
        <span class="nonMember-head__title-content"> 侧边栏会员招募 </span>
        <div class="float-right">
          <NsButton type="primary" @click="save()">保存</NsButton>
        </div>
      </div>
    </div>
    <el-scrollbar ref="fullScreen">
      <div class="nonMember-config">
        <div class="nonMember-config__left">
          <div class="nonMember-config__head">配置功能</div>
          <div class="nonMember-config__left-content">
            <div class="nonMember-config__left-content-otherInfo">
              <h5 class="content-otherInfo__head">功能介绍</h5>
              <p>
                1、好友聊天窗口，好友是会员时，直接进入会员详情；好友不是会员时，可发放配置的招募链接
              </p>
              <p>2、群聊窗口时，可发送配置的招募链接</p>
            </div>
            <el-form
              ref="form"
              :rules="rules"
              label-width="100px"
              :model="model"
              :label-position="labelPosition"
            >
              <el-form-item label="发送招募链接">
                <div class="ml">
                  <el-switch v-model="model.memberShowSwitch" />
                </div>
                <div class="ml">
                  <span class="nonMember-config__left-content-tip"
                    >聊天对象为非会员或群聊时支持发送招募链接</span
                  >
                </div>
              </el-form-item>
              <el-form-item v-if="model.memberShowSwitch" label="设置招募链接">
                <div class="ml">
                  <el-radio-group v-model="model.recruitLinkType" @change="handleChange">
                    <el-radio :label="1">系统预置链接</el-radio>
                    <el-radio :label="2">自定义链接</el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>
              <el-form-item v-if="model.recruitLinkType === 1 && model.memberShowSwitch">
                <div class="ml content">
                  <el-form-item label="选择链接" prop="sysLink">
                    <el-select
                      v-model="model.sysLink"
                      placeholder="请选择链接"
                      style="width:100%"
                    >
                      <el-option
                        v-for="item in presetLink"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-form-item>
              <template v-if="model.recruitLinkType === 2 && model.memberShowSwitch">
                <el-form-item>
                  <div class="ml content">
                    <el-form-item label="链接类型">
                      <div class="ml">
                        <el-radio-group
                          v-model="model.linkType"
                          @change="handleChange"
                        >
                          <el-radio :label="1">h5</el-radio>
                          <el-radio :label="2">小程序</el-radio>
                        </el-radio-group>
                      </div>
                    </el-form-item>
                    <!-- H5链接配置开始 -->
                    <template v-if="model.linkType === 1">
                      <el-form-item
                        label="网页地址"
                        required
                        prop="linkModel.link"
                        :rules="[
                          {
                            required: true,
                            message: '请输入网页地址',
                            trigger: ['blur', 'change']
                          },
                          {
                            validator: validates.pageUrl,
                            trigger: ['blur', 'change']
                          },
                          {
                            validator: validates.validateActivityIntroduction.bind(
                              this,
                              pageUrlLength
                            ),
                            trigger: ['blur', 'change']
                          }
                        ]"
                      >
                        <div class="ml">
                          <p>必须以http://或https://开头</p>
                          <tag-area
                            v-model.trim="model.linkModel.link"
                            tag="wise"
                            ref="testText"
                            :tools="tools"
                            :maxlength="1000"
                            @handleBlur="handleBlur"
                            @inputLength="inputLength"
                          >
                          </tag-area>
                        </div>
                      </el-form-item>
                      <el-form-item label="消息展示内容" prop="linkModel.image">
                        <div class="msg-content">
                          <div class="msg-content__input">
                            <el-form-item prop="linkModel.title">
                              <el-input
                                type="text"
                                maxlength="20"
                                minlength="1"
                                clearable
                                placeholder="请输入标题"
                                v-model="model.linkModel.title"
                                show-word-limit
                              />
                            </el-form-item>
                          </div>
                          <div class="msg-content__input">
                            <el-form-item prop="linkModel.desc">
                              <el-input
                                type="text"
                                maxlength="50"
                                minlength="1"
                                clearable
                                placeholder="请输入文案"
                                v-model="model.linkModel.desc"
                                show-word-limit
                              />
                            </el-form-item>
                          </div>
                          <div class="NotMemberPageConfig-poster__content">
                            <el-form-item>
                              <el-upload
                                class="upload-demo"
                                ref="upload"
                                drag
                                accept=".jpg,.jpeg,.png"
                                :action="$api.core.sgUploadFile('test')"
                                :on-remove="handleRemove"
                                :before-upload="beforeUpload"
                                :on-success="handleUploadSuccess"
                              >
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">
                                  将文件拖到此处，或<em>点击上传</em>
                                </div>
                                <div class="el-upload__tip" slot="tip">
                                  （请上传格式为jpg的图片，建议长宽比例为5:4，大小不超过10M）
                                </div>
                              </el-upload>
                            </el-form-item>
                          </div>
                        </div>
                      </el-form-item>
                    </template>
                    <!-- H5链接配置结束 -->

                    <!-- 小程序链接配置开始 -->
                    <template v-if="model.linkType === 2">
                      <el-form-item label="小程序appID" prop="appModel.appid">
                        <el-input
                          type="text"
                          maxlength="30"
                          minlength="1"
                          clearable
                          placeholder="请输入文案"
                          v-model="model.appModel.appid"
                          show-word-limit
                        />
                      </el-form-item>
                      <el-form-item label="小程序路径" prop="appModel.path">
                        <div class="ml">
                          <p>
                            小程序路径后需要带上.html，如
                            pages/member/test.html?id=1
                          </p>
                          <tag-area
                            className='w-textarea--input'
                            v-model.trim="model.appModel.path"
                            tag="wise"
                            ref="testText"
                            :tools="tools"
                            placeholder="请输入路径"
                          >
                          </tag-area>
                        </div>
                      </el-form-item>
                      <el-form-item label="消息展示内容" prop="appModel.image">
                        <div class="app-msg__content">
                          <el-form-item prop="appModel.title">
                            <div class="msg-content__input">
                              <el-input
                                type="text"
                                maxlength="20"
                                minlength="1"
                                clearable
                                placeholder="请输入标题1"
                                v-model="model.appModel.title"
                                show-word-limit
                              />
                            </div>
                          </el-form-item>
                          <div class="NotMemberPageConfig-poster__content">
                            <el-upload
                              class="upload-demo"
                              ref="upload"
                              drag
                              accept=".jpg,.jpeg,.png"
                              :action="$api.core.sgUploadFile('test')"
                              :on-remove="handleRemoveApp"
                              :before-upload="beforeUpload"
                              :on-success="handleSuccessUpload"
                            >
                              <i class="el-icon-upload"></i>
                              <div class="el-upload__text">
                                将文件拖到此处，或<em>点击上传</em>
                              </div>
                              <div class="el-upload__tip" slot="tip">
                                <span class="nonMember-config__left-content-tip"
                                  >请上传格式为jpg的图片，建议长宽比例为5:4，大小不超过10M</span
                                >
                              </div>
                            </el-upload>
                          </div>
                        </div>
                      </el-form-item>
                    </template>
                    <!-- 小程序链接配置结束 -->
                  </div>
                </el-form-item>
              </template>
            </el-form>
          </div>
        </div>
        <div class="nonMember-config__right">
          <div class="nonMember-config__head text-center">效果展示</div>
          <div class="nonMember-config__right-content">
            <div class="nonMember-config__right-content-phone">
              <div class="nonMember-config__right-content-phone-info"></div>
              <div
                v-if="model.memberShowSwitch"
                class="nonMember-config__right-content-phone-btn"
              >
                发送招募链接
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
import Index from './src/index.js'
export default Index
</script>
<style>
.NotMemberPageConfig-poster__content {
  /* padding: 16px; */
  padding-bottom: 0;
  /* background-color: #f5f5f5; */
  /deep/ .el-upload--text {
    width: 100%;
    .el-upload-dragger {
      width: 100%;
    }
  }
}
</style>

<style scoped lang="scss">
.nonMember-head {
  padding: 12px 16px;
  background: #fff;
  margin: -10px -10px 10px;

  .nonMember-head__title {
    .nonMember-head__title-content {
      line-height: 32px;
      color: #262626;
      font-size: 16px;
    }
    .float-right {
      padding-top: 2px;
    }
  }
}
.nonMember-config {
  display: flex;
  background: #fff;
  .nonMember-config__head {
    line-height: 54px;
    padding: 0 40px;
    font-size: 16px;
    color: #262626;
  }
  .nonMember-config__left {
    flex: 1;
    >>> .nonMember-config__left-content {
      padding: 16px 40px 40px;
      .el-form-item__label {
        color: #595959;
      }
      .el-form-item__content {
        padding-left: 16px;
      }
      .nonMember-config__left-content-tip {
        position: relative;
        padding-left: 16px;
        height: 28px;
        color: #595959;
        &::before {
          position: absolute;
          left: 0;
          top: 50%;
          margin-top: -5px;
          content: ' ';
          width: 8px;
          height: 8px;
          border-radius: 100%;
          background: #f2aa18;
        }
      }
      .nonMember-config__left-content-otherInfo {
        // margin-top: 26px;
        margin-bottom: 20px;
        padding: 10px 16px;
        background: #f2f9fe;
        border-radius: 2px;
        .content-otherInfo__head {
          color: #262626;
          font-size: 14px;
        }
        p {
          color: #595959;
        }
      }
    }
    .ml {
      p {
        font-size: 12px;
        color: #595959;
      }
    }
    .content {
      border: 1px solid #d9d9d9;
      border-radius: 2px;
      padding: 16px;
    }
    .msg-content {
      padding: 16px;
      background: #f5f5f5;
      border-radius: 2px;
      .msg-content__input {
        margin-bottom: 16px;
      }
    }
    .app-msg__content {
      width: 50%;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 2px;
      .msg-content__input {
        margin-bottom: 16px;
      }
    }
  }
  .nonMember-config__right {
    width: 400px;
    min-width: 400px;
    border-left: 1px solid #e8e8e8;
    .nonMember-config__right-content {
      padding: 16px 0 40px;
      .nonMember-config__right-content-phone {
        position: relative;
        margin: 0 auto;
        padding-top: 45px;
        width: 346px;
        height: 660px;
        background: url('./src/images/phone.png') 0 0 no-repeat;
        background-size: 100% 100%;
        .nonMember-config__right-content-phone-info {
          width: 321px;
          height: 571px;
          margin: 0 auto;
          background: url('./src/images/phone-info.png') 0 0 no-repeat;
          background-size: 100%;
        }
        .nonMember-config__right-content-phone-btn {
          position: absolute;
          top: 340px;
          left: 110px;
          // right: 44px;
          width: 122px;
          height: 36px;
          line-height: 36px;
          font-size: 16px;
          text-align: center;
          color: #ffffff;
          background: #0d5dff;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
