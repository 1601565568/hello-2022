<template>
  <div v-loading="saveLoading" style="background-color: white" class="base-border-radius border-line">
    <el-scrollbar ref="fullScreen" outsider :class="{ 'el-scrollbar-border': memberManagePlan === 1 }">
    <el-row class="qrcode-content">
    <el-col :span="16" class="qrcode-content_edit">
      <el-form label-width="100px" label-position="left" ref="form">
        <!-- 会员招募码配置开始 -->
        <div class="form-grid">
          <div class="form-grid__title">
            <div :class="[bluePillar==='QA'?bluePillarQA:bluepill]"></div>
            {{ title }}
          </div>
          <div class="form-grid__content">
            <el-form-item label="聚合码名称" required>
              <el-form-grid size="xlg">
                <el-input
                  type="text"
                  placeholder="请输入聚合码名称"
                  v-model="personalQrcode.name"
                  maxlength="30"
                  show-word-limit
                  onkeyup="this.value=this.value.replace(/\s+/g,'')"
                />
              </el-form-grid>
            </el-form-item>
            <el-form-item label="聚合码类型" required>
              <el-form-grid size="small" :class="[bluePillar==='QA'?gridQA:gridChecks]" >
                <el-form-item prop="sex">
                  <el-radio-group v-model="personalQrcode.type" @change="checkChange()">
                    <el-radio v-for="(typeName, index) in QrCodeTypeNames"  :key="typeName" :label="index" >{{typeName === '员工' && cloudPlatformType === 'kd' ? '成员' : typeName}} </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
            <el-form-item :label="cloudPlatformType === 'ecrp' ? '使用员工' : '使用成员'" required>
              <el-form-grid v-if="personalQrcode.type != 0">
                <ns-button type='text' @click="choosePersonnel(personalQrcode.type)">+ 选择{{QrCodeTypeNames[personalQrcode.type]}}</ns-button>
              </el-form-grid>
              <el-form-grid v-if="personalQrcode.type === 0">
                <NsGuideDialog v-if="cloudPlatformType !== 'kd'" btnTitle="选择员工" :guideUrl="this.$api.guide.sgPersonalQrcode.queryGuideMsg" v-model="employeeSelectData"></NsGuideDialog>
                <NsGuideWeChatDialog :selfBtn='true'
                                    :appendToBody='true'
                                    :isButton="false"
                                    :auth="false"
                                    type="primary"
                                    btnTitle=""
                                    dialogTitle="选择企业微信成员"
                                    v-model="employeeSelectData"
                                    v-else>
                  <template slot='selfBtn'>
                    <div class='self-btn'>
                    +选择企业微信成员
                    </div>
                  </template>
                </NsGuideWeChatDialog>
              </el-form-grid>
              <ElFormGrid v-if="personalQrcode.type === 0">
                已选择<span class="text-primary">{{employeeSelectData.length}}</span>个{{cloudPlatformType ==='kd' ? '成员' : '员工'}}
              </ElFormGrid>
            </el-form-item>
            <ElFormItem :rules="rules">
              <div class="message-detail" >
                <ElTable :data="tableData" class="message-detail__table">
                  <ElTableColumn prop="style" label="名称">
                    <template slot-scope="scope">
                      {{ scope.row.name }}
                    </template>
                  </ElTableColumn>
                  <ElTableColumn prop="style" label="微信账号" v-if="memberManagePlan == 1 && personalQrcode.type == 0" align="center" width="150">
                    <template slot-scope="scope">
                      {{ scope.row.userName?scope.row.userName:'-' }}({{ scope.row.userId?scope.row.userId:'-' }})
                    </template>
                  </ElTableColumn>
                  <ElTableColumn prop="style" label="   " align="center" width="0">
                  </ElTableColumn>
                  <ElTableColumn prop="num" v-if="memberManagePlan == 2  || (memberManagePlan == 1 && personalQrcode.type != 0)" align="center" width="150">
                    <template slot="header">
                      每日子码扫描上限
                      <el-tooltip content="聚合二维码被扫描后，该子码每日内能出现的次数。">
                        <Icon type="question-circle"/>
                      </el-tooltip>
                    </template>
                    <template slot-scope="scope">
                      <el-input  autofocus=true v-model="scope.row.num" onkeyup="this.value=this.value.replace(/\D|^0/g,'')" onafterpaste="this.value=this.value.replace(/\D|^0/g,'')" placeholder="" clearable></el-input>

                    </template>
                  </ElTableColumn>

                  <ElTableColumn prop="style" label="子码" align="center" width="150">
                    <template slot-scope="scope">
                      <img v-if="scope.row.image" :src="scope.row.image" width="50px" height="50px" class="company-upload__avatar">
                    </template>
                  </ElTableColumn>
                  <ElTableColumn label="操作" align="center" :width="70">
                    <template slot-scope="scope">
                      <ns-button type="text" size="small" @click="handleDelete(scope)">删除</ns-button>
                    </template>
                  </ElTableColumn>
                </ElTable>
              </div>
            </ElFormItem>
            <el-form-item label="好友验证" v-if="personalQrcode.type == 0">
              <el-form-grid size="small">
                <el-form-item prop="sex">
                  <el-switch v-model="personalQrcode.isvalidate" />
                </el-form-item>
              </el-form-grid>
              <div class="sub-title" style="color: #595959;">
                <span class="yellow-point" style="background: #F2AA18;display: inline-block;height: 8px;width: 8px;border-radius: 50%;margin-right: 8px;"></span>
                开启后，无需好友验证即可添加好友
              </div>
            </el-form-item>
            <el-form-item label="渠道设置：" v-if="memberManagePlan == 1 && personalQrcode.type == 0">
              <el-form-grid>
                <el-select v-model="personalQrcode.channel_code" filterable placeholder="请选择">
                  <el-option
                    v-for="item in channelList"
                    :key="item.channel_code"
                    :label="item.channel_name"
                    :value="item.channel_code">
                  </el-option>
                </el-select>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="子码展示方式：" v-if="memberManagePlan == 2" required>
              <el-form-grid size="xxmd">
                <el-form-item prop="sex">
                  <el-radio-group v-model="personalQrcode.showType">
                    <el-radio :label="1">随机展示</el-radio>
                    <el-radio :label="2">轮流展示</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
            <el-form-item label="打标签：" v-if="memberManagePlan == 1 && personalQrcode.type == 0">
              <el-form-grid>
                <ns-button type='text' @click="switchTagDialog(true)">+ 选择标签</ns-button>
              </el-form-grid>
              <el-form-grid v-if="selectedTagGroup.length">
                已选择<span class="text-primary">{{selectedTagGroup.length}}</span>个标签
              </el-form-grid>
              <el-form-grid v-else>
                未选择标签
              </el-form-grid>
              <div class="sub-title" style="color: #595959;">
                <span class="yellow-point" style="background: #F2AA18;display: inline-block;height: 8px;width: 8px;border-radius: 50%;margin-right: 8px;"></span>根据使用场景设置标签，给扫码添加的好友，自动打此标签
              </div>
            </el-form-item>
            <el-form-item label="海报" v-if="memberManagePlan == 1">
              <div class="poster-content">
                <drap-upload tip='（请上传格式为jpg、jpeg或png的图片，大小不超过10M）' v-model='personalQrcode.poster_background_url' :maxWidth='750' :maxHeight='1334' :showPont='false' :maxSize='10' :isNeedCrop='true'>
                </drap-upload>
                <!-- <el-upload
                  size="xlg"
                  drag
                  :action="$api.core.sgUploadFile('test')"
                  accept=".jpg,.png"
                  :multiple="false"
                  :on-success="uploadPosterSuccess"
                  :on-error="uploadPosterError"
                  :on-remove="uploadPosterRemove"
                  :before-upload="uploadPosterBefore"
                  :file-list="uploadPosterFileList"
                >
                    <i class="el-icon-upload" style="color:#0094FC;"></i>
                    <div class="el-upload__text">点击或拖拽上传海报图</div>
                    <div class="el-upload__tip" slot="tip">（请上传格式为jpg、jpeg或png的图片，图片尺寸为750*1334，大小不超过10M）</div>
                </el-upload> -->
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-col>
      <!-- 效果展示开始 -->
      <el-col v-if="memberManagePlan === 1" :span="8" class="qrcode-content_show">
        <PosterPreviewPanel
          :showQrcode="showPosterQrcode"
          :posterBackgroundUrl="personalQrcode.poster_background_url"
          :qrcodeX="personalQrcode.qrcode_x"
          :qrcodeY="personalQrcode.qrcode_y"
          :qrcodeSize="personalQrcode.qrcode_size"
          @posterQrcode="getPosterQrcodeInfo"
        />
      </el-col>
      <!-- 效果展示结束 -->
    </el-row>
    </el-scrollbar>
    <div class="message-container">
    <!---->
    <!--选择好友弹窗开始-->
    <ElDialog width="600px" height="500px" title="选择子码" :visible.sync="dialogVisible" :before-close="employeeTreeClose" :show-scroll-x=false>
      <div v-if="personalQrcode.type === 1">
        <div class="giveaway-add__item--info">
          <ns-button type="text" @click="handleAdd()">添加自定义图片</ns-button>
        </div>
        <template>
          <el-table :data="addTableData" style="width: 100%">
            <el-table-column label="名称" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.name" maxlength="15" placeholder="请输入二维码名称，限15字"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="子码" width="120">
              <template slot-scope="scope">
                  <el-upload
                    :action="sgUploadFile('test')"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="scope.row.image" :src="scope.row.image" @click='setCurrentUploadRowIndex(scope.row.index)' width="50px" height="50px" class="company-upload__avatar">
                    <Icon type="plus" @click='setCurrentUploadRowIndex(scope.row.index)' className="company-upload__tip" v-else/>
                  </el-upload>
              </template>
            </el-table-column>
            <el-table-column width="200">
              <template slot="header">
                失效时间
                <el-tooltip content="子码的失效时间，失效后将不再展示，不设置默认时效为永久。">
                  <Icon type="question-circle"/>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.date"
                  type="datetime"
                  placeholder="选择日期时间"
                  style="width: 190px">
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <ns-button type="text" size="small" @click="deleteChildQrcode(scope, scope.row)">删除</ns-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <template slot="footer">
        <ns-button @click="employeeTreeClose">取消</ns-button>
        <ns-button type="primary" @click="onSaveChildQrcode()">确定</ns-button>
      </template>
    </ElDialog>
    <!--选择好友弹窗结束-->

    <!-- 打标签弹窗开始 -->
    <AddTagsDialog
      :visible="addTagDialogVisible"
      :tagList="tagList"
      :selectedTags="personalQrcode.tag_list"
      @hide="switchTagDialog(false)"
      @confirm="selectedTags"
    />
    <!-- 打标签弹窗结束 -->
    </div>
    <div class="form-save__unique">
      <ns-button type="primary" @click="onSave()" :disabled="disableSaveBtn">保存</ns-button>
      <ns-button @click="cancel()">取消</ns-button>
    </div>
  </div>
</template>
<script>

import Edit from './src/Edit'
import index from './src/List'
import ElTree from '@nascent/nui/lib/tree'
import ElUpload from '@nascent/nui/lib/upload'
import NsGuideDialog from '@/components/NsGuideDialog'
import AddTagsDialog from './components/AddTagsDialog/index.vue'
import PosterPreviewPanel from './components/PosterPreviewPanel'
import DrapUpload from '@/components/NewUi/DrapUpload'
import NsGuideWeChatDialog from '@/components/NsGuideWeChatDialog'

Edit.components = {
  index,
  ElTree,
  ElUpload,
  NsGuideDialog,
  AddTagsDialog,
  PosterPreviewPanel,
  DrapUpload,
  NsGuideWeChatDialog
}
export default Edit
</script>
<style scoped>
  @import "@theme/variables.pcss";

  @component-namespace message {
    @b container {
      @e card {
        margin-top: var(--default-margin-base);
      }
    }
    @b composition {
      display: flex;
      @e left {
        width: 68%;
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
    @b detail {
      padding: 20px 20px 0;
      margin-bottom: 20px;
      border: 1px dashed var(--theme-base-border-color-primary);
      border-radius: 6px;
      width: 559px;
      @e btn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        >>> .el-tag {
          cursor: text;
        }
      }
      @e table {
        margin-top: var(--default-margin-larger);
      }
      >>> .ElImage {
        background-color: unset;
      }
    }
    @b item {
      display: flex;
      align-items: center;
      @m title {
        line-height: 18px;
      }
      @m image {
        margin: 7px 0;
      }
      @m add {
        line-height: 60px;
        height: 60px;
      }
      @m opposite {
        width: 76px;
        height: 46px;
        position: relative;
      }
      @e broadcast {
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: 8px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, .4);
        border-radius: 50%;
      }
    }
    @b circle {
      width: 0;
      height: 0;
      border-width: 4px;
      border-style: solid;
      border-color: transparent transparent transparent var(--theme-color-white);
    }
    @b prompt {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: var(--default-margin-larger) 0;
      @e mass {
        text-align: center;
        padding: var(--default-padding-larger) 25px;
        cursor: pointer;
        border-right: 1px solid var(--theme-base-border-color-primary);
      &:hover {
        .message-hovericolor {
          color: var(--theme-color-primary);
        }
      }
    &:last-child {
       border-right: 0;
     }
      @m topspace {
        margin-top: var(--default-margin-small);
      }
    }
    >>> .el-popover {
      padding: 0;
    }
  }
  }
  .dialog_mian_topText p sapn{
    color:grey;
  }
  .dialog_mian_topText p{
    line-height: 30px;
    height: 30px;
  }
  .form-grid__title {
    font-size: var(--default-font-size-base);
    padding: var(--default-padding-larger) 0;
    font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
    font-weight: 700;
    display: flex;
    align-items: center;
  }
  /* .form-grid__content {
    margin-left: 150px;
  } */
  .bluepillar {
    width: 4px;
    height: 12px;
    margin-right: var(--default-margin-small);
    background-color: #0091FA;
  }
  .bluepillarQA {
    width: 4px;
    height: 12px;
    margin-right: var(--default-margin-small);
    background-color: #0C4CFF;
  }
  .form-save__unique {
    padding: var(--default-padding-small) 0 var(--default-padding-small) 61px;
    border-top: 1px solid var(--theme-base-border-color-primary);
    background-color: var(--theme-color-white);
    border-bottom-left-radius: var(--default-radius-mini);
    border-bottom-right-radius: var(--default-radius-mini);
  }
  >>> .template-table__bar {
    margin-bottom: 0;
  }
  .form-grid {
    border-radius: var(--default-radius-mini);
  }
  .el-radiobox .is-checked >>>  .el-radio__inner{
    background-color:#41a2e8;
    border-color:#41a2e8;
  }
  .el-radioboxQA .is-checked >>> .el-radio__inner{
    background-color:#2153D4 ;
    border-color:#2153D4 ;
  }
  .el-radiobox .is-checked >>> .el-radio__label{
    color:#41a2e8;
  }
  .el-radioboxQA .is-checked >>> .el-radio__label{
    color:#2153D4 ;
  }

  @component-namespace code {
    @b container {
      padding: 0 var(--default-padding-small);
    }
    @b title {
      font-weight: bold;
      line-height: 30px;
      background: var(--theme-bg-color-base);
      padding: 0 8px;
      border-radius: var(--default-radius-mini);
    }
    @b delete {
      margin-left: var(--default-margin-small);
    }
    @b space {
      margin-top: var(--default-margin-base);
    }
    @b detail {
      display: flex;
      align-items: center;
      @e text {
        max-width: 188px;
        margin-right: var(--default-margin-small);
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
  .scoll_left{
    height: 338px;
    overflow: auto;
  }
  .scoll_left::-webkit-scrollbar{
    display:none;
  }

  .el-scrollbar-border::before {
    content: '';
    border-right: 1px solid #E8E8E8;
    position: absolute;
    left: 66.666%;
    height: 100%;
    top:0;
    bottom: 0;
  }

  .poster-content {
    /* width: 580px;
    padding: 16px;
    padding-bottom: 0;
    background-color: #F5F5F5; */
    >>> .el-upload--text {
      height: 112px;
      width: 100%;
      .el-upload-dragger {
        width: 100%;
        height: 112px;
        .el-icon-upload {
          width: 30px;
          height: 23px;
          margin: 21px 0 13px;
          font-size: 30px;
          line-height: 23px;
        }
        .el-upload__text {
          color: #8C8C8C;
        }
      }
    }
  }
</style>
