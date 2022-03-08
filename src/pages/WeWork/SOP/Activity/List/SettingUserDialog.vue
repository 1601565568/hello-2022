<template>
  <el-dialog
    width="842px"
    height="210px"
    :visible="visible"
    @close="cancel"
    @open="open"
    :show-close="!loading"
  >
    <template slot="title">
      <h3 class="title">设置使用人员</h3>
    </template>
    <el-form class="setting-user el-form-reset" label-width="100px" label-position="left">
      <el-form-item label="选择人员">
        <el-radio-group v-model="type">
          <el-radio
          :class="[ENV === 'QA'? colorQA:colorNormal ]"
            v-for="item in authTypeOptions"
            :key="item.label"
            :label="item.label"

          >
            {{item.name}}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 选择店铺 -->
      <el-form-item v-if="type === SOPAuthRangeType.Shop">
        <div class="select-area">
          <span class="select-title">选择店铺</span>
          <NsShopDialog
            :selfBtn='true'
            :appendToBody='true'
            :isButton="false"
            :auth="false"
            type="icon"
            btnTitle=""
            dialogTitle="选择店铺"
            v-model="shops"
          >
            <template slot='btnIcon'>
              <div class="select-tips">
                <span v-if="!shops.length" class="un-selected">请选择店铺</span>
                <span v-else class="selected">已选择{{shops.length}}个店铺</span>
                <Icon type="shop" class="icon"/>
              </div>
            </template>
          </NsShopDialog>
        </div>
      </el-form-item>
      <!-- 选择员工 -->
      <el-form-item v-if="type === SOPAuthRangeType.Guide">
        <div class="select-area">
          <span class="select-title">选择员工</span>
          <NsGuideDialog
            :selfBtn='true'
            :appendToBody='true'
            :isButton="false"
            :auth="false"
            type="primary"
            btnTitle=""
            dialogTitle="选择员工"
            v-model="guides"
          >
            <template slot='selfBtn'>
              <div class="select-tips">
                <span v-if="!guides.length" class="un-selected">请选择员工</span>
                <span v-else class="selected">已选择{{guides.length}}个员工</span>
                <Icon type="ns-people" class="icon"/>
              </div>
            </template>
          </NsGuideDialog>
        </div>
      </el-form-item>
      <SettingUserFailedDialog
        :visible.sync="settingUserFailedDialogVisible"
        :info="setFailedInfo"
      />
    </el-form>
    <span slot="footer" class="dialog-footer">
      <NsButton @click="cancel" size="medium" :loading="loading">取 消</NsButton>
      <NsButton type="primary" size="medium" @click="confirm" :loading="loading">确 定</NsButton>
    </span>
  </el-dialog>
</template>

<script>
import NsGuideDialog from '@/components/NsGuideDialog'
import NsShopDialog from '@/components/NsShopDialog'
import SettingUserFailedDialog from './SettingUserFailedDialog'
import { SOPAuthRangeType } from '../../types'

export default {
  components: {
    NsGuideDialog,
    NsShopDialog,
    SettingUserFailedDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      settingUserFailedDialogVisible: false,
      loading: false,
      SOPAuthRangeType: SOPAuthRangeType,
      authTypeOptions: [
        {
          label: SOPAuthRangeType.All,
          name: '全部员工'
        },
        {
          label: SOPAuthRangeType.Shop,
          name: '按店铺'
        },
        {
          label: SOPAuthRangeType.Guide,
          name: '按员工'
        }
      ],
      type: '',
      shops: [],
      guides: [],
      setFailedInfo: {
        taskNames: [],
        guideNames: []
      },
      ENV: process.env.VUE_APP_THEME,
      colorQA: 'colorQA',
      colorNormal: 'colorNormal'
    }
  },
  methods: {
    cancel () {
      this.shops = []
      this.guides = []
      this.setFailedInfo = {
        taskNames: [],
        guideNames: []
      }
      this.$emit('update:visible', false)
    },
    open () {
      this.loading = true
      // 获取使用范围
      this.$http.fetch(this.$api.weWork.sop.getAuthRange)
        .then(resp => {
          const { type, value } = resp.result

          this.type = type
          if (type === SOPAuthRangeType.Shop) {
            this.shops = value
          } else if (type === SOPAuthRangeType.Guide) {
            this.guides = value
          }
        }).catch((respErr) => {
          this.$message.error('获取使用范围失败')
        }).finally(() => {
          this.loading = false
        })
    },
    confirm () {
      if (!this.type) {
        this.$message.error('请选择使用人员')
        return
      } else if (this.type === SOPAuthRangeType.Shop && !this.shops.length) {
        this.$message.error('请选择店铺')
        return
      } else if (this.type === SOPAuthRangeType.Guide && !this.guides.length) {
        this.$message.error('请选择员工')
        return
      }

      this.loading = true

      let value = []
      if (this.type === SOPAuthRangeType.Shop) {
        value = this.shops
      } else if (this.type === SOPAuthRangeType.Guide) {
        value = this.guides
      }

      this.$http.fetch(this.$api.weWork.sop.setAuthRange, {
        type: this.type,
        value
      })
        .then(resp => {
          if (resp.code === '1024') {
            this.settingUserFailedDialogVisible = true
            this.setFailedInfo = resp.result
          } else {
            this.$message.success(`设置使用成功`)
            this.cancel()
          }
        }).catch((respErr) => {
          this.$message.error(`设置使用失败`)
          this.cancel()
        }).finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style scoped>
  .colorQA >>>.el-radio__input.is-checked + .el-radio__label{
    color: #2153D4;
  }
  .colorQA >>>.el-radio__input.is-checked .el-radio__inner{
    border-color: #2153D4;
    background: #2153D4;
  }
</style>
<style lang="scss" scoped>
@import "./styles/reset.css";
.title {
  font-size: 16px;
}

.setting-user {
  .select-area {
    margin-top: 11px;
    width: 90%;
    height: 64px;
    background: #F5F5F5;
    font-size: 14px;
    display: flex;
    align-items: center;
    .select-title {
      margin-left: 24px;
      display: inline-block;
    }

    .select-tips {
      width: 500px;
      height: 32px;
      margin-left: 36px;
      background: #fff;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        font-size: 14px;
        padding: 0 25px 0 9px;
        line-height: 32px;
      }
      .un-selected {
        color: #BFBFBF;
      }
      .selected {
        color: #606266;
      }
      .icon {
        color: #BFBFBF;
        font-size: 14px;
        margin-right: 9px;
      }
    }
  }
}
</style>
