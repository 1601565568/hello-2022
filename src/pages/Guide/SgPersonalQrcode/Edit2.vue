<template>
  <div class="qrcode-container">
    <div class="qrcode-header">
      <h3>新建聚合二维码</h3>
      <div class='qrcode-header-btn'>
        <!-- <ns-button :loading='btnLoad' @click='handleCancel'>取消</ns-button>
        <ns-button class="save-btn" type="primary" @click='handleSave' :loading='btnLoad'>保存</ns-button> -->
        <ns-button>取消</ns-button>
        <ns-button class="save-btn" type="primary">保存</ns-button>
      </div>
    </div>
    <el-row class="qrcode-content">
      <el-col :span="16" class="qrcode-content_edit">
        <el-form label-width="100px" label-position='left' class="el-form-custom">
          <h3>基本信息</h3>
          <el-form-item label="聚合码名称" required>
            <el-input
              type="text"
              placeholder="请输入聚合码名称"
              v-model="formData.name"
              maxlength="30"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="聚合码类型" required>
            <el-radio-group v-model="formData.type">
              <el-radio :label="0">员工</el-radio>
              <el-radio :label="1">自定义图片</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="使用员工" required prop='name'>
            <el-input
              type="text"
              placeholder="请选择员工"
              show-word-limit
              :value="selectedEmployeeVal"
            >
              <Icon slot="suffix" style="color: #8C8C8C" type="geren" class="el-input__icon" @click="showEmployeeDialog"/>
            </el-input>
          </el-form-item>
          <el-form-item label="投放渠道">
            <el-select v-model="formData.channel_code" filterable placeholder="请选择">
              <el-option
                v-for="item in channelList"
                :key="item.channel_code"
                :label="item.channel_name"
                :value="item.channel_code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="打标签">
            <div class='sub-title sub-title-color'>
              根据使用场景设置标签，给扫码添加的好友，自动打此标签
            </div>
            <el-input
              type="text"
              placeholder="请选择标签"
              show-word-limit
            >
              <Icon slot="suffix" style="color: #8C8C8C" type="geren" class="el-input__icon" @click="showAddTags"/>
            </el-input>
          </el-form-item>
          <el-form-item label="海报">
            <div class="poster-content">
              <el-upload
                drag
                action="https://jsonplaceholder.typicode.com/posts/"
                multiple>
                  <i class="el-icon-upload" style="color:#0094FC;"></i>
                  <!-- <Icon type="ns-cloud-uploading" /> -->
                  <div class="el-upload__text">点击或拖拽上传海报图</div>
                  <div class="el-upload__tip" slot="tip">（请上传格式为jpg或png的图片，图片尺寸为750*1334，大小不超过10M）</div>
              </el-upload>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8" class="qrcode-content_show">
        <PosterPreviewPanel/>
      </el-col>
    </el-row>

    <!-- 选择员工 -->
    <NsGuideDialog btnTitle="选择员工" :guideUrl="this.$api.guide.sgPersonalQrcode.queryGuideMsg" v-model="selectedEmployee"/>
    <!-- 打标签Dialog -->
    <AddTagsDialog
      :visible="addTagDialogVisible"
      @hide="hideAddTagsDialog"
    />
  </div>
</template>

<script>
import ElUpload from '@nascent/nui/lib/upload'
import PosterPreviewPanel from './components/PosterPreviewPanel'
import AddTagsDialog from './components/AddTagsDialog/index.vue'
import NsGuideDialog from '@/components/NsGuideDialog'

export default {
  components: {
    ElUpload,
    PosterPreviewPanel,
    NsGuideDialog,
    AddTagsDialog
  },
  computed: {
    selectedEmployeeVal () {
      if (this.selectedEmployee.length) {
        return `已选择${this.selectedEmployee.length}个员工`
      } else {
        return ''
      }
    }
  },
  data () {
    return {
      addTagDialogVisible: false,
      employeeDialogVisible: false,
      selectedEmployee: [],
      name: '',
      channelList: [
        {
          channel_code: 1,
          channel_name: '吃饭'
        },
        {
          channel_code: 2,
          channel_name: '睡觉'
        }
      ],
      tableData: [
        {
          index: 0,
          name: null,
          image: null,
          guideId: null,
          date: null,
          num: null,
          userName: null,
          userId: null
        },
        {
          index: 0,
          name: '名字',
          image: 'touxiang',
          guideId: '123234454',
          date: '231984932',
          num: '90',
          userName: '用户名字',
          userId: 'userId'
        }
      ],
      formData: {
        id: null,
        guid: null,
        creatorId: null,
        nickname: null,
        creatorName: null,
        name: null,
        personnels: null,
        prersonelIds: '',
        type: 0,
        num: null,
        image: '',
        createTime: '',
        showType: 1,
        isvalidate: 1,
        keyword: null,
        channel_code: null,
        child_qrcodes: []
      }
    }
  },
  methods: {
    showAddTags () {
      this.addTagDialogVisible = true
    },
    hideAddTagsDialog () {
      this.addTagDialogVisible = false
    },
    showEmployeeDialog () {
      this.employeeDialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./styles/reset.css";

.qrcode-container {
  min-width: 1046px;
  .qrcode-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    margin: -10px -10px 0;
    padding-left: 6px;
    height: 42px;
    h3 {
      font-size: 16px;
      color: #262626;
      font-weight: bold;
      margin-left: 16px;
    }

    .qrcode-header-btn {
      margin-right: 16px;
      .save-btn {
        margin-left: 16px;
      }
    }
  }

  .qrcode-content {
    margin-top: 16px;
    background: #fff;
    &::before {
      content: '';
      border-right: 1px solid #E8E8E8;
      position: absolute;
      left: 66.666%;
      top:0;
      height: 100%;
      bottom:0;
    }

    .qrcode-content_edit {
      box-sizing: border-box;
      padding: 0 40px 44px 16px;

      h3 {
        height: 56px;
        font-size: 16px;
        line-height: 56px;
      }

      .sub-title-color {
        color: #595959;
      }

      .poster-content {
        padding: 16px;
        padding-bottom: 0;
        background-color: #F5F5F5;
      }
    }
  }
}
</style>
