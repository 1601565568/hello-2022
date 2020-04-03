<template>
  <div>
    <ElScrollbar ref="fullScreen" class="recruit-container">
      <div class="recruit-container__card ">
        <div class="recruit-title">导购招募海报配置</div>
        <div class="recruit-content recruit-content--flex">
          <div class="recruit-example">
            <img :src="model.recruiting_posters_image" alt="示例图片" class="recruit-example__img"/>
            <div class="background_title">特邀您成为VIP会员</div>
            <div class="background_content">长按识别二维码  添加专属导购</div>
            <div class="background_shop_guide">门店名称/导购名称</div>
            <div class="background_image">
              <ElImage
                :width="70" :height="70"
                :src="model.groupLogo||require('./images/groupLogo.png')"
                mode="fill" />
            </div>
            <div class="background_qrCode">
              <ElImage
                :width="132" :height="132"
                :src="require('./images/guide.png')"
                mode="fill" />
            </div>
          </div>
          <div class="recruit-detail">
            <div class="recruit-detail__heading">设置导购招募海报背景图：</div>
            <ElForm>
              <ElFormItem label="背景图：" required  label-width="100px" >
                <ElUpload
                  :action="this.$api.core.sgUploadFile('recruit')"
                  :show-file-list="false"
                  :on-success="handleBackgroundSuccess"
                  :before-upload="beforeAvatarUpload" class="recruit-detail__upload">
                  <img v-if="model.recruiting_posters_image" :src="model.recruiting_posters_image" class="recruit-avatar">
                  <Icon type="plus" className="recruit-tip" v-else/>
                </ElUpload>
                <div class="text-secondary">请上传格式为jpg图片，图片尺寸为750*1334,大小不超过10M</div>
              </ElFormItem>
              <ElFormItem label-width="83px">
                <span class="text-primary">
                  <Icon type="exclamation-circle"/>&nbsp;公司logo和招募码为固定位置，建议尺寸为70*70;
                </span>
              </ElFormItem>
              <ElFormItem label-width="100px">
                <span class="text-primary">
                  logo获取导购后台-公司logo；门店名称和导购姓名动态获取当前导购的信息;
                </span>
              </ElFormItem>
            </ElForm>
          </div>
        </div>
      </div>
      <div class="recruit-container__card recruit-container__card--topspace">
        <div class="recruit-title">招募链接配置</div>
        <div class="recruit-content recruit-content--flex" >
          <div class="recruit-example">
            <contentPreview :model="model"/>
          </div>
          <div class="recruit-detail">
            <div class="recruit-detail__heading">消息卡片内容：</div>
            <div class="recruit-detail__explanation">会员开卡页面：</div>
            <ElForm ref="searchform" :model="model" :rules="rules">
              <ElFormItem label="标题：" prop="title"  label-width="100px" >
                <ElInput style="width: 180px"
                         type="text"
                         clearable
                         :input="model.title=model.title.replace(/\s+/g,'')"
                         maxlength='20'
                         placeholder="请输入标题，长度在20个字符以内"
                         v-model="model.title"
                         show-word-limit
                />
              </ElFormItem>
              <ElFormItem label="摘要：" prop="content"  label-width="100px" >
                <ElInput style="width: 250px"
                         type="textarea"
                         clearable
                         maxlength='20'
                         :input="model.content=model.content.replace(/\s+/g,'')"
                         placeholder="请输入摘要，长度在20个字符以内"
                         v-model="model.content"
                         show-word-limit
                />
              </ElFormItem>
              <ElFormItem label="封面图：" prop="picture"  label-width="100px" >
                <ElUpload
                  :action="this.$api.core.sgUploadFile('recruit')"
                  :show-file-list="false"
                  :on-success="handleSurfaceSuccess"
                  :before-upload="beforeAvatarUpload" class="recruit-detail__upload">
                  <img v-if="model.picture" :src="model.picture" class="recruit-avatar">
                  <Icon type="plus" className="recruit-tip" v-else/>
                </ElUpload>
                <div class="text-secondary">请上传格式为jpg图片，长宽比例为5:4,大小不超过10M</div>
              </ElFormItem>
              <ElFormItem label-width="83px">
                <span class="text-primary">
                  <Icon type="exclamation-circle"/>&nbsp;场景说明：系统中招募链接，发送的消息卡片都根据设置的内容显示。如：门店招募、导购招募
                </span>
              </ElFormItem>
            </ElForm>
          </div>
        </div>
      </div>
    </ElScrollbar>
    <div class="form-save__unique">
      <NsButton type="primary" :loading="loading" @click="update">修改</NsButton>
    </div>
  </div>
</template>
<script>
import index from './src/index'
import contentPreview from './content/contentPreview.vue'
import ElUpload from '@nascent/nui/lib/upload'
import ElImage from '@nascent/nui/lib/image'
index.components = {
  contentPreview,
  ElUpload,
  ElImage
}
export default index
</script>

<style scoped>
  @import "@theme/variables.pcss";

  @component-namespace recruit {
    @b container {
      @e card {
        background: var(--theme-color-white);
        border-radius: var(--default-radius-mini);
        @m topspace {
          margin-top: var(--default-margin-small);
        }
      }
    }
    @b title {
      font-size: var(--default-font-size-base);
      font-weight: bold;
      padding: var(--default-padding-larger) 20px;
      border-bottom: 1px solid var(--theme-base-border-color-primary);
    }
    @b content {
      padding: 20px;
      @e caption {
        font-size: var(--default-font-size-base);
        font-weight: bold;
      }
      @e radiogroup {
        margin-top: var(--default-margin-xlarger);
      }
      @m flex {
        display: flex;
      }
    }
    @b prompt {
      @e space {
        margin-left: 17px;
      }
      >>> .el-form-item__content {
        line-height: 15px;
      }
    }
    @b example {
      width: 320px;
      max-height: 569px;
      position: relative;
      flex-shrink: 0;
      @e img {
        width: 100%;
        height: 100%;
      }
      @e btn {
        font-size: var(--default-font-size-base);
        color: var(--theme-color-white);
        text-align: center;
        padding: 13px 20px;
        width: 294px;
        position: absolute;
        bottom: 25px;
        left: 13px;
        background: #009900;
        border-radius: var(--default-radius-small);
      }
    }
    @b detail {
      flex: 1;
      margin-left: 20px;
      @e explanation {
        font-size: var(--default-font-size-base);
        margin-top: var(--default-margin-xlarger);
      }
      @e heading {
        font-size: var(--default-font-size-base);
        font-weight: bold;
      }
      @e upload {
        height: 100px;
        margin:  var(--default-margin-larger) 0;
        >>> .el-upload {
          width: 100px;
          height: 100px;
          position: relative;
          border: 1px dashed var(--theme-base-border-color-primary);
          border-radius: var(--default-radius-mini);
          &:hover {
             border-color: var(--theme-color-primary-light);
           }
        }
      }
    }
    @b tip {
      font-size: 24px;
      color: var(--theme-base-border-color-primary);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
    @b avatar {
      width: 100px;
      height: 100px;
    }
  }
  .form-save__unique {
    padding: var(--default-padding-small) 0 var(--default-padding-small) 20px;
    border-top: 1px solid var(--theme-base-border-color-primary);
    background-color: var(--theme-color-white);
    border-bottom-left-radius: var(--default-radius-mini);
    border-bottom-right-radius: var(--default-radius-mini);
  }
  .background_title{
    font-size: 10px;
    color: #fff;
    text-align: center;
    width: 294px;
    position: absolute;
    bottom: 415px;
    left: 13px;
    border-radius: 5px;
  }
  .background_content{
     font-size: 10px;
     color: #fff;
     text-align: center;
     width: 294px;
     position: absolute;
     bottom: 92px;
     left: 13px;
     border-radius: 5px;
   }
  .background_shop_guide{
    font-size: 10px;
    color: #fff;
    text-align: center;
    width: 294px;
    position: absolute;
    bottom: 78px;
    left: 13px;
    border-radius: 5px;
  }
  .background_image{
    text-align: center;
    width: 294px;
    position: absolute;
    bottom: 445px;
    left: 13px;
  }
  .background_qrCode{
     text-align: center;
     width: 294px;
     position: absolute;
     bottom: 188px;
     left: 13px;
   }
</style>
