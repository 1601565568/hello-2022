<template>
  <div class="modify-card">
    <div class="page-title">
      {{ model.welcomeCodeUuid ? "修改" : "新增" }}智能欢迎语
    </div>
    <ElScrollbar ref="fullScreen">
      <ElCard shadow="never">
        <div slot="header">
          基本信息
          <!-- <span class="welcome-aside__set text-primary"><Icon type="exclamation-circle" />配置后，客户将在添加成员为联系人后收到该欢迎语</span> -->
        </div>
        <div class="message-message">
          <!-- 最外层 -->
          <el-container class="message-message__content">
            <!-- <el-row :gutter="20"> -->
            <!-- <el-col :span="12"> -->
            <!-- 左侧开始 -->
            <el-aside width="60%" class="message-aside">
              <!-- <div class="welcome-aside__set text-primary">
                    <Icon type="exclamation-circle" />
                    配置后，客户将在添加成员为联系人后收到该欢迎语
                  </div> -->
              <ElForm
                ref="form"
                :model="model"
                label-width="100px"
                class="pull-right"
              >
                <!-- <el-form-item label="是否启用：" required>
                      <el-form-grid size="xxmd">
                        <el-form-item prop="sex">
                          <el-radio-group v-model="model.status">
                            <el-radio :label="0">关闭</el-radio>
                            <el-radio :label="1">开启</el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </el-form-grid>
                    </el-form-item> -->
                <ElFormItem
                  label="欢迎语："
                  prop="content"
                  :rules="commonRules.content"
                  ><!-- :rules="commonRules.content" -->
                  <ElFormGrid size="xlg" class="message-plan">
                    <!-- <ElInput
                      ref="input"
                      type="textarea"
                      :cols="28"
                      :rows="6"
                      placeholder="请输入欢迎语"
                      v-model="model.content"
                      autofocus
                      >
                    </ElInput> -->
                    <!-- maxlength="100" show-word-limit -->
                    <ns-textarea ref="input" :replaceOptions="replaceOptions" placeholder="请输入欢迎语" v-model="model.content"></ns-textarea>
                  </ElFormGrid>
                </ElFormItem>
                <ElFormItem>
                  <ElFormGrid>
                    <ns-button
                      type="text"
                      @click="insertPlaceHolder('{EmployeeNick}')"
                    >
                      +插入企业微信员工姓名
                    </ns-button>
                  </ElFormGrid>
                  <ElFormGrid>
                    <ns-button
                      type="text"
                      @click="insertPlaceHolder('{CustomerNick}')"
                    >
                      +插入客户微信昵称
                    </ns-button>
                  </ElFormGrid>
                </ElFormItem>
                <el-form-item>
                  <el-form-grid>
                    <div class="tmp-tips text-info">
                      <Icon type="info-circle" theme="filled" />
                      欢迎语内容最多可含<span class="span-yellow">1000</span
                      >字,当前已输入<span
                        v-bind:class="[
                          wordCount <= 1000 ? 'span-yellow' : 'span-red'
                        ]"
                      >
                        {{ wordCount }}</span
                      >字，占位符默认占10个字
                    </div>
                  </el-form-grid>
                </el-form-item>
                <ElFormItem label="附件：">
                  <ElFormGrid>
                    <span
                      class="message-square hand"
                      :class="[
                        model.annexType === 0 ? 'message-square__active' : ''
                      ]"
                      @click="onSubmitAnnex(0)"
                    >
                      <!-- <Icon
                          type="picture"
                          className="message-square__icon message-square__tupian"
                        /> -->
                      无附件
                    </span>
                  </ElFormGrid>
                  <ElFormGrid>
                    <span class="message-or">或</span>
                  </ElFormGrid>
                  <ElFormGrid>
                    <span
                      class="message-square hand"
                      :class="[
                        model.annexType === 1 ? 'message-square__active' : ''
                      ]"
                    >
                      <el-upload
                        class="avatar-uploader"
                        :action="$api.core.sgUploadFile('image')"
                        accept="image/jpeg,image/gif,image/png"
                        :before-upload="beforeAvatarUpload"
                        :on-success="handleAnnexAvatarSuccess"
                        :show-file-list="false"
                      >
                        <Icon
                          type="picture"
                          className="message-square__icon message-square__tupian"
                        />
                        图片
                      </el-upload>
                    </span>
                  </ElFormGrid>
                  <ElFormGrid>
                    <span class="message-or">或</span>
                  </ElFormGrid>
                  <ElFormGrid>
                    <span
                      class="message-square hand"
                      :class="[
                        model.annexType === 2 ? 'message-square__active' : ''
                      ]"
                      @click="showAnnex(2)"
                    >
                      <Icon
                        type="wangye"
                        className="message-square__icon message-square__wangye"
                      />
                      网页
                    </span>
                  </ElFormGrid>
                  <ElFormGrid>
                    <span class="message-or">或</span>
                  </ElFormGrid>
                  <ElFormGrid>
                    <span
                      class="message-square hand"
                      :class="[
                        model.annexType === 3 ? 'message-square__active' : ''
                      ]"
                      @click="showAnnex(3)"
                    >
                      <Icon
                        type="xiaochengxu"
                        className="message-square__icon message-square__xiaochengxu"
                      />
                      小程序
                    </span>
                  </ElFormGrid>
                  <ElFormGrid>
                    <span class="message-or">或</span>
                  </ElFormGrid>
                  <ElFormGrid>
                    <span
                      class="message-square hand"
                      :class="[
                        model.annexType === 4 ? 'message-square__active' : ''
                      ]"
                      @click="showAnnex(4)"
                    >
                      <Icon
                        type="poster"
                        className="message-square__icon message-square__xiaochengxu"
                      />
                      二维码海报
                    </span>
                  </ElFormGrid>
                </ElFormItem>
                <ElFormItem v-if="model.type !== 9" label="使用范围：">
                  <ElFormGrid>
                    <NsShopDialog
                      btnTitle="选择店铺"
                      v-model="model.shopIds"
                    ></NsShopDialog>
                  </ElFormGrid>
                  <ElFormGrid>
                    {{
                      this.model.shopIds && this.model.shopIds.length > 0
                        ? "已选择" + this.model.shopIds.length + "家店铺"
                        : ""
                    }}
                    <!-- 已选择<span class="text-primary">{{shopSelectData? shopSelectData.length: 0}}</span>家店铺 -->
                  </ElFormGrid>
                </ElFormItem>
                <ElFormItem v-if="model.type !== 9">
                  <ElFormGrid>
                    <NsGuideDialog
                      :guideUrl="this.$api.weWork.guide.findGuideList"
                      btnTitle="选择员工"
                      dialogTitle="选择员工"
                      v-model="model.employeeIds"
                    ></NsGuideDialog>
                  </ElFormGrid>
                  <ElFormGrid>
                    {{
                      this.model.employeeIds &&
                      this.model.employeeIds.length > 0
                        ? "已选择" + this.model.employeeIds.length + "名员工"
                        : ""
                    }}
                  </ElFormGrid>
                </ElFormItem>
                <el-form-item v-if="model.type !== 9">
                  <ElFormGrid>
                    <ns-button type="text" @click="showChannel()"
                      ><Icon type="plus" />选择渠道</ns-button
                    >
                  </ElFormGrid>
                  <ElFormGrid v-if="this.model.channelCodes">
                    {{ channelSelectMsg }}
                  </ElFormGrid>
                </el-form-item>
              </ElForm>
            </el-aside>
            <!-- 左侧结束 -->
            <!-- </el-col> -->
            <!-- <el-col :span="12"> -->
            <!-- 右侧预览页 -->
            <el-main class="message-main">
              <div class="message-main__exampleimg">
                <ElScrollbar>
                  <div class="message-msg clearfix">
                    <div class="message-msg__avatar">
                      <el-image
                        :width="98"
                        :height="100"
                        style="width: 32px; height: 32px"
                        src="https://img.alicdn.com/imgextra/i4/645690921/O1CN01Q1rjbi1IfrITTcm0O_!!645690921.jpg_430x430q90.jpg"
                        mode="mfit"
                      >
                      </el-image>
                    </div>
                    <div class="message-msg__text">
                      <div class="message-news">
                        <!-- word-break:break-all -->
                        我通过了你的朋友验证，现在我们可以开始聊天了
                      </div>
                      <div class="message-circle"></div>
                    </div>
                  </div>
                  <div class="message-msg clearfix">
                    <div class="message-msg__avatar">
                      <el-image
                        :width="98"
                        :height="100"
                        style="width: 32px; height: 32px"
                        src="https://img.alicdn.com/imgextra/i4/645690921/O1CN01Q1rjbi1IfrITTcm0O_!!645690921.jpg_430x430q90.jpg"
                        mode="mfit"
                      >
                      </el-image>
                    </div>
                    <div class="message-msg__text">
                      <div class="message-news" style="white-space: pre-wrap;">
                        <!-- <div v-html="htmlvalue"></div> -->
                        {{
                          model.content
                            ? model.content
                            : "欢迎您！这是一段自动回复消息～"
                        }}
                      </div>
                      <div class="message-circle"></div>
                    </div>
                  </div>
                  <!--图片开始-->
                  <div
                    class="message-msg clearfix"
                    v-if="model.annexType === 1"
                  >
                    <div class="message-msg__avatar">
                      <el-image
                        :width="98"
                        :height="100"
                        style="width: 32px; height: 32px"
                        src="https://img.alicdn.com/imgextra/i4/645690921/O1CN01Q1rjbi1IfrITTcm0O_!!645690921.jpg_430x430q90.jpg"
                        mode="mfit"
                      >
                      </el-image>
                    </div>
                    <div class="message-image">
                      <div class="message-figurelist clearfix">
                        <el-image
                          :width="175"
                          :height="213"
                          style="width: 175px; height: 213px"
                          :src="model.image"
                        >
                        </el-image>
                      </div>
                    </div>
                  </div>
                  <!--图片 结束-->
                  <!--网页 开始-->
                  <!-- todo -->
                  <div
                    class="message-msg clearfix"
                    v-else-if="model.annexType === 2"
                  >
                    <div class="message-msg__avatar">
                      <el-image
                        :width="98"
                        :height="100"
                        style="width: 32px; height: 32px"
                        src="https://img.alicdn.com/imgextra/i4/645690921/O1CN01Q1rjbi1IfrITTcm0O_!!645690921.jpg_430x430q90.jpg"
                        mode="mfit"
                      >
                      </el-image>
                    </div>
                    <div class="message-msg__text">
                      <div class="message-web">
                        <div class="message-web__slogan">
                          <!-- word-break:break-all -->
                          {{ model.title }}
                        </div>
                        <div class="message-web__propagate clearfix">
                          <!-- display： flex -->
                          <div class="message-leftside">
                            <!-- 去掉宽度，加下flex：1 -->
                            {{ model.desc }}
                          </div>
                          <!-- 右边图片加下flex-shrink:0, 上面的宽高去掉 -->
                          <el-image
                            :width="46"
                            :height="46"
                            style="width: 46px; height: 46px"
                            :src="model.image"
                            mode="fill"
                            class="message-rightside"
                          >
                          </el-image
                          ><!-- mode="fill" contain cover none scale-down -->
                        </div>
                      </div>
                      <div class="message-circle"></div>
                    </div>
                  </div>
                  <!--网页 结束-->
                  <!--小程序 开始-->
                  <div
                    class="message-msg clearfix"
                    v-else-if="model.annexType === 3"
                  >
                    <div class="message-msg__avatar">
                      <el-image
                        :width="98"
                        :height="100"
                        style="width: 32px; height: 32px"
                        src="https://img.alicdn.com/imgextra/i4/645690921/O1CN01Q1rjbi1IfrITTcm0O_!!645690921.jpg_430x430q90.jpg"
                        mode="fill"
                      >
                      </el-image>
                    </div>
                    <div class="message-msg__text message-msg__text--bgcolor">
                      <div class="message-applets">
                        <div class="message-applets__logo">
                          <el-image
                            :width="98"
                            :height="100"
                            style="width: 20px; height: 20px"
                            src="https://img.alicdn.com/imgextra/i4/645690921/O1CN01Q1rjbi1IfrITTcm0O_!!645690921.jpg_430x430q90.jpg"
                            mode="mfit"
                            class="message-applets__logo--img"
                          >
                          </el-image>
                        </div>
                        <div class="message-applets__name">小程序名</div>
                      </div>
                      <div class="message-program">
                        <div class="message-program__name">
                          {{ model.title }}
                        </div>
                        <div class="message-program__logo">
                          <el-image
                            :width="98"
                            :height="100"
                            style="width: 98px; height: 100px"
                            :src="model.image"
                            mode="fill"
                            class="message-program__logo--img"
                          >
                          </el-image>
                        </div>
                      </div>
                      <div class="message-circle message-circle--topleft"></div>
                    </div>
                  </div>
                  <!--小程序 结束-->
                  <!--二维码海报 开始-->
                  <div
                    class="message-msg clearfix"
                    v-if="model.annexType === 4"
                  >
                    <div class="message-msg__avatar">
                      <el-image
                        :width="98"
                        :height="100"
                        style="width: 32px; height: 32px"
                        src="https://img.alicdn.com/imgextra/i4/645690921/O1CN01Q1rjbi1IfrITTcm0O_!!645690921.jpg_430x430q90.jpg"
                        mode="mfit"
                      >
                      </el-image>
                    </div>
                    <div class="message-image">
                      <div class="message-figurelist clearfix">
                        <el-image
                          :width="175"
                          :height="213"
                          style="width: 175px; height: 213px"
                          :src="model.placard"
                        >
                        </el-image>
                      </div>
                    </div>
                  </div>
                  <!--维码海报 结束-->
                </ElScrollbar>
              </div>
              <div class="message-main__text">会员看到的界面</div>
            </el-main>
            <!-- 右侧预览页 -->
            <!-- </el-col> -->
            <!-- </el-row> -->
          </el-container>
        </div>
      </ElCard>
      <!-- <ElCard shadow="never">
        <div slot="header">使用范围</div>
      </ElCard> -->
    </ElScrollbar>
    <div class="form-save__unique">
      <ns-save @click="saveOrUpdate"></ns-save>
      <ns-button @click="back">取消</ns-button>
    </div>
    <!-- 网页 -->
    <el-dialog
      ref="linkDialog"
      width="600px"
      :visible.sync="linkModel.visible"
      title="链接"
      :show-scroll-x="false"
      :close-on-click-modal="false"
      @close="onCloseHandleModel(2)"
      ><!-- :before-close="onCloseHandleModel(2)" -->
      <el-form
        ref="linkForm"
        label-width="100px"
        placement="right"
        :model="linkModel"
      >
        <el-form-item label="跳转链接：" class="code-title"> </el-form-item>
        <el-form-item label="链接：" prop="custom" label-width="100px">
          <el-radio-group v-model="linkModel.custom" @change="linkRadioChange">
            <el-radio :label="1" size="xxs">自定义链接</el-radio>
            <el-radio :label="2" size="xxs">系统预置链接</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="linkModel.custom === 2"
          label="选择链接："
          prop="settingId"
          :rules="commonRules.selectOne"
        >
          <el-select
            v-model="linkModel.settingId"
            @change="systemPresetChange"
            placeholder="请选择"
          >
            <el-option
              v-for="item in presetLink"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item
          v-if="linkModel.custom === 2 && viewRange === 1"
          label="选择品牌："
          prop="settingId"
          :rules="commonRules.selectOne"
        >
          <el-select
            v-model="linkModel.brandId"
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in brandList"
              :key="item.brandId"
              :label="item.brandName"
              :value="item.brandId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="网页地址："
          prop="link"
          :rules="commonRules.link"
          clearable
          show-word-limit
        >
          <el-form-grid>
            <el-input
              ref="linkModelLink"
              type="textarea"
              :disabled="linkModel.custom === 2"
              v-model="linkModel.link"
            />
            <span v-for="(item, index) in placeholderLink" :key="index">
               <ns-button v-if="linkModel.custom === 1" type="text"  @click="insertPlaceHolderLink(item.value)">&lt;{{item.label}}&gt;</ns-button>
            </span>
            <span v-if="viewRange === 1">
               <ns-button v-if="linkModel.custom === 1" type="text" @click="openBrandDialog">&lt;品牌id&gt;</ns-button>
            </span>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="消息展示内容：" class="code-title"> </el-form-item>
        <el-form-item
          label="标题："
          prop="title"
          :rules="commonRules.title"
          label-width="100px"
        >
          <el-form-grid size="xxmd">
            <el-input
              :disabled="edit"
              type="text"
              maxlength="20"
              minlength="1"
              clearable
              show-word-limit
              placeholder="请输入标题,长度在1-20个字符以内"
              v-model.trim="linkModel.title"
            />
          </el-form-grid>
        </el-form-item>
        <el-form-item
          label="文案："
          prop="desc"
          :rules="commonRules.desc"
          label-width="100px"
        >
          <el-form-grid size="xxmd">
            <el-input
              :disabled="edit"
              type="text"
              maxlength="50"
              minlength="1"
              clearable
              show-word-limit
              placeholder="请输入文案,长度在1-50个字符以内"
              v-model.trim="linkModel.desc"
            />
          </el-form-grid>
        </el-form-item>
        <el-form-item label="封面图：" prop="image" :rules="commonRules.image">
          <el-form-grid class="company-upload">
            <el-upload
              :disabled="edit"
              class="avatar-uploader"
              :action="$api.core.sgUploadFile('test')"
              accept="image/jpeg,image/gif,image/png"
              :before-upload="beforeAvatarUpload"
              :on-success="handleLinkAvatarSuccess"
              :show-file-list="false"
            >
              <img
                v-if="linkModel.image"
                :src="linkModel.image"
                class="company-upload__avatar"
              />
              <Icon v-else type="plus" className="company-upload__tip" />
            </el-upload>
          </el-form-grid>
        </el-form-item>
        <el-form-item v-show="linkModel.custom === 1">
          <div class="text-secondary">请上传格式为JPG、JPEG、PNG的图片，建议长宽比例为5:4，大小不超过10M</div>
          <!-- 长宽比例为5:4, -->
        </el-form-item>
        <el-form-item v-show="linkModel.custom === 2">
          <el-form-grid>
            <span class="tmp-tips text-info">
              <Icon type="info-circle" theme="filled" />
            </span>
            招募链接编辑位置为获客引流-会员引流-招募页面配置
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onCloseAnnex(2), onCloseHandleModel(2)"
          >取消</ns-button
        >
        <ns-button @click="onSubmitAnnex(2)" type="primary">确定</ns-button>
      </div>
    </el-dialog>
    <!-- 小程序 -->
    <el-dialog
      ref="appDialog"
      width="520px"
      :visible.sync="appModel.visible"
      title="小程序"
      @close="onCloseHandleModel(3)"
      ><!-- :before-close="onCloseHandleModel(3)" -->
      <el-form
        ref="appForm"
        label-width="100px"
        placement="right"
        :model="appModel"
      >
        <el-form-item label="跳转小程序：" class="code-title"> </el-form-item>
        <template v-if="appModel.custom === 1">
          <el-form-item
            label="小程序appid："
            prop="appid"
            :rules="commonRules.appid"
          >
            <el-form-grid size="xxmd">
              <el-input
                type="text"
                maxlength="30"
                minlength="5"
                clearable
                placeholder="请输入小程序appId,长度在5-30个字符以内"
                show-word-limit
                v-model.trim="appModel.appid"
              />
            </el-form-grid>
          </el-form-item>
          <!-- 请确认小程序配置信息输入正确！ 小程序原始id（gh_开头）、小程序aapid（wx开头）需正确，否则错误警告，提示文案为“输入格式错误”-->
          <el-form-item
            label="小程序路径："
            prop="path"
            :rules="commonRules.path"
          >
            <el-form-grid size="xxmd">
              <el-input
                ref="appModelPath"
                type="text"
                maxlength="255"
                minlength="1"
                clearable
                placeholder="请输入小程序路径,长度在1-255个字符以内"
                show-word-limit
                v-model.trim="appModel.path"
              />
              <ns-button type="text" v-for="(item, index) in placeholderLink" :key="index" @click="insertAppModelPath(item.value)">&lt;{{item.label}}&gt;</ns-button>
              <ns-button v-if="viewRange === 1" type="text" @click="openBrandDialog">&lt;品牌id&gt;</ns-button>
            </el-form-grid>
          </el-form-item>
          <el-form-item>
            <el-form-grid>
              <div class="tmp-tips text-info">
                <Icon type="info-circle" theme="filled" />
                请先在企业微信后台将小程序配置到工作台
                <MiniConfigHelp/>
              </div>
            </el-form-grid>
          </el-form-item>
          <el-form-item>
            <el-form-grid>
              <div class="tmp-tips text-info">
                注:小程序路径后需要带上.html，如 pages/member/test.html?id=1
              </div>
            </el-form-grid>
          </el-form-item>
        </template>
        <template>
          <el-form-item
            v-if="appModel.custom === 2"
            label="选择链接："
            prop="link"
            :rules="commonRules.selectOne"
          >
            <el-form-grid size="xxmd">
              <el-select v-model="appModel.settingId" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-grid>
          </el-form-item>
        </template>
        <el-form-item label="小程序卡片展示：" class="code-title">
        </el-form-item>
        <el-form-item label="标题：" prop="title" :rules="commonRules.title">
          <el-form-grid size="xxmd">
            <el-input
              type="text"
              maxlength="20"
              minlength="1"
              clearable
              placeholder="请输入标题,长度在1-20个字符以内"
              show-word-limit
              v-model.trim="appModel.title"
            />
          </el-form-grid>
        </el-form-item>
        <el-form-item label="封面图：" prop="image" :rules="commonRules.image">
          <el-form-grid class="company-upload">
            <el-upload
              class="avatar-uploader"
              :action="$api.core.sgUploadFile('test')"
              accept="image/jpeg,image/gif,image/png"
              :before-upload="beforeAvatarUpload"
              :on-success="handleAppAvatarSuccess"
              :show-file-list="false"
            >
              <img
                v-if="appModel.image"
                :src="appModel.image"
                class="company-upload__avatar"
              />
              <Icon v-else type="plus" className="company-upload__tip" />
            </el-upload>
          </el-form-grid>
        </el-form-item>
        <!-- “招募链接编辑位置为系统设置-招募设置-招募页面配置，去修改” -->
         <el-form-item>
          <div class="text-secondary">请上传格式为JPG、JPEG、PNG的图片，建议长宽比例为5:4，大小不超过10M</div>
          <!-- 长宽比例为5:4, -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onCloseAnnex(3), onCloseHandleModel(3)"
          >取消</ns-button
        >
        <ns-button @click="onSubmitAnnex(3)" type="primary">确定</ns-button>
      </div>
    </el-dialog>
    <!-- 选择品牌弹窗 -->
    <NsBrandDialog :visible.sync="brandDialogVisible" @confirm="insertBrandId"/>
    <!-- 渠道弹框 -->
    <el-dialog
      ref="channelDialog"
      width="640px"
      :visible.sync="channelModel.visible"
      title="选择渠道"
    >
      <el-form ref="channelForm" label-width="100px" placement="right">
        <el-select
          multiple
          v-model="channelModel.channelCodes"
          style='width:600px'
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in channelList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="channelModel.visible = false">取消</ns-button>
        <ns-button @click="selectChannel" type="primary">确定</ns-button>
      </div>
    </el-dialog>
    <!-- 选择好友弹框 -->
    <ElDialog
      width="550px"
      title="选择员工"
      :visible.sync="employeeModel.visible"
      :show-scroll-x="false"
      ><!-- :before-close="closeEmployeeDialog" -->
      <ElRow :gutter="10" class="code-container">
        <ElCol :span="12" class="code-container__item">
          <div class="code-title">可选员工</div>
          <!-- <div class="code-title">可选员工</div> -->
          <ElInput
            placeholder="输入员工姓名以过滤"
            v-model="filterText"
            class="code-space"
          >
            <!-- suffix-icon="el-icon-search" -->
          </ElInput>
          <div class="text-primary code-space">
            <span style="cursor: pointer;" @click="setAllEmployee">全部</span>
          </div>
          <ElScrollbar>
            <ElTree
              ref="tree"
              :data="leftTreeData"
              show-checkbox
              node-key="id"
              :default-checked-keys="model.employeeIds"
              :filter-node-method="filterNode"
              :props="leftDefaultProps"
              class="code-space"
              @check-change="handleUnSubmitCheckChange"
              ><!-- :default-expanded-keys="[1, 2]" @check-change="handleCheckChange"-->
              <span class="code-detail clearfix" slot-scope="{ node, data }">
                <span class="code-detail__text">{{ node.label }}</span>
                <span>{{
                  data.children ? "/" + data.children.length : ""
                }}</span>
              </span>
            </ElTree>
          </ElScrollbar>
        </ElCol>
        <ElCol :span="12" class="code-container__item">
          <div class="code-title">已选员工</div>
          <div class="scoll_left">
            <ElScrollbar>
              <ElTree
                :data="rightTreeData"
                ref="selectedTree"
                node-key="id"
                :expand-on-click-node="false"
                class="code-space"
                ><!-- :filter-node-method="tree.selectedFilterNode" -->
                <span class="code-detail clearfix" slot-scope="{ node, data }">
                  <span class="code-detail__text">{{ node.label }}</span>
                  <span>
                    <ns-button
                      type="text"
                      size="mini"
                      @click="() => remove(node, data)"
                    >
                      <Icon type="delete" className="code-delete" />
                    </ns-button>
                  </span>
                </span>
              </ElTree>
            </ElScrollbar>
          </div>
        </ElCol>
      </ElRow>
      <template slot="footer">
        <ns-button @click="closeEmployeeDialog">取消</ns-button>
        <ns-save @click="selectEmployee" />
      </template>
    </ElDialog>
    <!--选择好友弹窗结束-->
    <!-- 二维码start -->
    <el-dialog
      ref="linkDialog"
      width="1000px"
      :visible.sync="qrcodeModel.visible"
      title="选择二维码海报"
      :show-scroll-x="false"
      :close-on-click-modal="false"
      @close="onCloseHandleModel(2)"
    >
      <Qrcode v-if='qrcodeModel.visible' :qrcodeModel='qrcodeModel' ref='qrcode'/>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onCloseAnnex(4)">取消</ns-button>
        <ns-button @click="handleSureQrcode" type="primary">确定</ns-button>
      </div>
    </el-dialog>
    <!-- 二维码end -->
  </div>
</template>
<script>
import Edit from './src/edit.js'
export default Edit
</script>

<style scoped>
@import "@theme/variables.pcss";

:root {
  --welcome-background-color-blue: #e5f4ff;
  --welcome-background-color-gray: #fcfcfc;
}
@component-namespace message {
  @b container {
    @e card {
      margin-top: var(--default-margin-base);
    }
  }
  /* 迁移 */
  @b main {
    margin: 0 auto;
    @e exampleimg {
      width: 303px;
      height: 573px;
      margin: 0 auto;
      padding: 80px 40px 20px;
      background-image: url("./src/images/bgImg2019.7.29.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    @e text {
      color: var(--theme-font-color-secondary);
      text-align: center;
      margin-top: -5px;
    }
    >>> .el-scrollbar__wrap {
      height: 460px;
    }
  }
  @b msg {
    padding: var(--default-padding-larger) 0;
    display: flex;
    overflow: hidden;
    @e avatar {
      width: 32px;
      height: 32px;
      margin-top: var(--default-margin-small);
    }
    @e text {
      position: relative;
      @m bgcolor {
        width: 78%;
        position: relative;
        padding: var(--default-padding-xlarger);
        margin-left: var(--default-margin-xlarger);
        background: #fff;
        border-radius: 10px;
      }
    }
    @m margintop {
      margin-top: var(--default-margin-larger);
    }
  }
  @b or {
    font-size: var(--default-font-size-base);
    color: var(--theme-font-color-secondary);
    margin-left: var(--default-margin-larger);
  }
  @b message {
    padding: var(--default-padding-small);
    background: var(--theme-color-white);
    border-radius: var(--default-radius-mini);
  }
  @b aside {
    @e set {
      display: inline-block;
      padding: var(--default-padding-small);
    }
    @e input {
      margin-top: var(--default-margin-small);
      background: var(--welcome-background-color-gray);
    }
    @e upload {
      display: flex;
      align-items: center;
      padding: var(--default-padding-small);
      background: var(--welcome-background-color-gray);
      border-left: 1px solid var(--theme-base-border-color-primary);
      border-right: 1px solid var(--theme-base-border-color-primary);
      border-bottom: 1px solid var(--theme-base-border-color-primary);
      border-radius: 0 0 var(--default-radius-mini) var(--default-radius-mini);
    }
  }
  @b square {
    text-align: center;
    margin-left: var(--default-margin-larger);
    padding: var(--default-padding-small);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--theme-base-border-color-primary);
    border-radius: var(--default-radius-mini);
    &:hover {
      color: vavr(--theme-color-primary);
      background: var(--welcome-background-color-blue);
      .welcome-square__icon {
        color: var(--theme-color-primary);
      }
    }
    @e active {
      color: vavr(--theme-color-primary);
      background: var(--welcome-background-color-blue);
      color: var(--theme-color-primary);
    }
    @e icon {
      color: var(--theme-font-color-secondary);
      margin-right: var(--default-margin-small);
    }
    @e tupian {
      font-size: var(--default-font-size-middle);
    }
    @e wangye {
      font-size: var(--default-font-size-middle);
    }
    @e xiaochengxu {
      font-size: var(--default-font-size-large);
    }
  }
  @b msg {
    padding: var(--default-padding-larger) 0;
    display: flex;
    overflow: hidden;
    @e avatar {
      width: 32px;
      height: 32px;
      margin-top: var(--default-margin-small);
    }
    @e text {
      position: relative;
      @m bgcolor {
        width: 78%;
        position: relative;
        padding: var(--default-padding-xlarger);
        margin-left: var(--default-margin-xlarger);
        background: #fff;
        border-radius: 10px;
      }
    }
    @m margintop {
      margin-top: var(--default-margin-larger);
    }
  }
  @b news {
    flex: 1;
    padding: 8px 12px;
    margin-left: var(--default-margin-xlarger);
    background: var(--theme-color-white);
    border-radius: 8px;
    word-break: break-all;
  }
  @b web {
    min-width: 47%;
    padding: 8px var(--default-padding-xlarger);
    margin-left: var(--default-margin-xlarger);
    background: #fff;
    border-radius: 10px;
    @e slogan {
      font-size: var(--default-font-size-base);
      width: 146px;
      display: inline-block;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      word-break: break-all;
    }
    @e propagate {
      margin-top: var(--default-margin-small);
      width: 146px;
      display: flex;
    }
  }
  @b leftside {
    font-size: 10px;
    color: var(--theme-font-color-secondary);
    /* width: 50%; */
    flex: 1;
    max-height: 60px;
    float: left;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    word-break: break-all;
  }
  @b rightside {
    width: 58px;
    height: 58px;
    margin-left: var(--default-margin-xlarger);
    flex-shrink: 0;
  }
  @b image {
    margin-left: var(--default-margin-xlarger);
    @e img {
      width: 175px;
      height: 213px;
      border-radius: 10px;
    }
  }
  @b circle {
    width: 0;
    height: 0;
    position: absolute;
    left: 0px;
    top: 10px;
    border-width: 8px;
    border-style: solid;
    border-color: transparent #fff transparent transparent;
    @m topleft {
      top: 15px;
      left: -15px;
    }
  }
  @b applets {
    display: flex;
    @e logo {
      @m img {
        border-radius: 7px;
      }
    }
    @e name {
      color: var(--theme-font-color-regular);
      margin-left: var(--default-margin-larger);
    }
  }
  @b program {
    @e name {
      font-size: var(--default-font-size-base);
      margin-top: 8px;
    }
    @e logo {
      text-align: center;
      margin-top: var(--default-margin-xlarger);
      @m img {
        border-radius: 20px;
      }
    }
  }
  /* 迁移结束 */

  @b composition {
    display: flex;
    @e left {
      width: 68%;
      margin-right: var(--default-margin-xlarge);
    }
    @e right {
      flex-shrink: 0;
      margin: 0 auto;
      >>> .el-scrollbar__wrap {
        height: 410px;
        padding-bottom: 20px;
      }
    }
  }
  @b plan {
    >>> .el-input__suffix {
      border-bottom: 0.5px solid var(--theme-base-border-color-primary);
      &:before {
        border-left: 0;
      }
    }
  }
}
@component-namespace code {
  @b title {
    font-weight: bold;
    line-height: 30px;
    background: var(--theme-bg-color-base);
    padding: 0 8px;
    border-radius: var(--default-radius-mini);
  }
}
@component-namespace company {
  @b upload {
    >>> .el-upload {
      width: 100px;
      height: 100px;
      position: relative;
      border: 1px solid var(--theme-base-border-color-primary);
      border-radius: var(--default-radius-mini);
      &:hover {
        border-color: var(--theme-color-primary-light);
      }
    }
    @e tip {
      font-size: var(--default-font-size-large);
      color: var(--theme-base-border-color-primary);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    @e avatar {
      width: 100px;
      height: 100px;
      position: relative;
      top: -1px;
      left: -1px;
    }
  }
}

/* 页面结构标题样式 start*/
.page-title {
  font-size: var(--default-font-size-base);
  padding-bottom: var(--default-padding-larger);
  font-weight: bold;
}
/* 页面结构标题样式 end*/

/* 底部按钮样式 start*/
.form-save__unique {
  padding: var(--default-padding-small) 0 var(--default-padding-small) 121px;
  border-top: 1px solid var(--theme-base-border-color-primary);
  background-color: var(--theme-color-white);
  border-bottom-left-radius: var(--default-radius-mini);
  border-bottom-right-radius: var(--default-radius-mini);
}
/* 底部按钮样式 end*/
/* 迁移 */
.hand {
  cursor: pointer;
}
.message-aside__input >>> .el-textarea.el-input--small .el-textarea__inner {
  resize: none;
}
.message-aside__upload >>> .avatar-uploader .el-upload {
  border: none;
}
>>> .el-main {
  padding: 0 !important;
}
>>> .el-upload--text {
  display: flex;
  align-items: center;
}
.span-yellow {
  color: #fbb72e;
}
.span-red {
  color: #ff0000;
}
>>> .el-card .el-card__header {
  font-size: var(--default-font-size-base);
  padding: var(--default-padding-larger) 20px;
}
/* 修改el-card的默认样式 start */
.modify-card {
  >>> .el-card {
    border: 0;
    border-radius: var(--default-radius-mini);
  }
}
/* 修改el-card的默认样式 end */
</style>
