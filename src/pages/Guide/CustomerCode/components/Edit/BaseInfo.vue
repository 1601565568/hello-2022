<template>
  <Box :noborder='true' :col='17'>
    <template slot='collapse-left'>
      <el-form
        label-width="110px"
        size="medium"
        label-position="left"
        :model="model"
        class="normal-from"
        :rules="rules"
        ref="baseDataFrom"
      >
        <el-form-item
          label="活动名称"
          required
          prop="name"
          class="larger-item"
        >
          <length-input
            v-model="model.name"
            placeholder="请输入名称"
            :length="20"
          />
        </el-form-item>
        <el-form-item :label="guideNamesEnv" prop="guideIds">
          <html-area>
            <div class="employee-list">
              <template v-if="model.guideDatas.length > 0">
                <template v-for="(item, index) in model.guideDatas">
                  <div class="employee-list_item" :key="item.id">
                    {{ item.name }}
                    <i
                      class="el-icon-close"
                      @click="handleDelect(index)"
                    ></i>
                  </div>
                </template>
                <span
                  class="employee-list_all"
                  v-if="model.guideDatas.length > 0"
                >
                  <i class="el-icon-close" @click="handleDelectAll()"></i>
                </span>
              </template>
              <template v-else>
                <p class="employee-text">
                  请选择可以在企微侧边栏使用该活动裂变大师的{{guideName}}
                </p>
              </template>
            </div>
            <template slot="suffix">
              <div class="employee-suffix">
                <GuideDialog
                  :selfBtn="true"
                  :appendToBody="true"
                  :isButton="false"
                  :validNull="true"
                  :auth="false"
                  :isOpenDialogAfterRequest='false'
                  btnTitle=""
                  type="text"
                  :dialogTitle="`选择${guideName}`"
                  v-model="model.guideIds"
                  @inputAllData="handleChangeGuide"
                  @input="handleChangeGuide"
                >
                  <template slot="selfBtn">
                      <Icon type="geren"></Icon>
                    </template>
                </GuideDialog>
              </div>
            </template>
          </html-area>
          <div class="flex-box form-item_toptext">
            <div class="qrcode-bottom-view">
              <span class="remind-view"></span>
              {{guideTipEnv}}
            </div>
            <span class="form-item_toptext__length"
              >已选<span :class="[btnNext==='QA'?numberQA:number]">{{ model.guideIds.length }}</span
              >人</span
            >
          </div>
        </el-form-item>
        <el-form-item label="有效时间" required prop="validTimeType" class='larger-item'>
          <div class="form-item_toptext" :class="[btnNext==='QA'?radioQA:radio]">
            <el-radio
              v-model="model.validTimeType"
              :label="1"
              :disabled="isStating"
              >固定时间</el-radio
            >
            <el-radio
              v-model="model.validTimeType"
              :label="0"
              :disabled="isStating"
              >永久有效</el-radio
            >
          </div>
          <div class="form-item_time" v-if="model.validTimeType === 1">
            <div>时间范围</div>
            <el-form-item
              label-width="8px"
              label=" "
              prop="validTimeStart"
            >
              <el-date-picker
                v-model="model.validTimeStart"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请输入开始时间"
                :disabled="isStating"
              >
              </el-date-picker>
            </el-form-item>
            <span class="time-line-view">~</span>
            <el-form-item
              label-width="8px"
              label=" "
              prop="validTimeEnd"
            >
              <el-date-picker
                v-model="model.validTimeEnd"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请输入结束时间"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
          </div>
        </el-form-item>
      </el-form>
      <div :class="[btnNext !=='QA'? foot: footQA]">
        <div class='current' :class="[btnNext==='QA'?btnQA:btn]" @click="handleSubmit">下一步</div>
      </div>
    </template>
  </Box>

</template>
<script>
import Box from '@/components/NewUi/Box'
import LengthInput from '@/components/NewUi/LengthInput'
import HtmlArea from '@/components/NewUi/HtmlArea'
import moment from 'moment'
import { mapState } from 'vuex'
import { DEFAULT_BASEINFO_DATA, STEP_LIST, GUIDE_MAX } from '../../src/const'
import validates from '../../src/validates'
import GuideDialog from '@/components/NewUi/GuideDialog'
export default {
  data () {
    const validTimeEndFunc = (rule, value, callback) => {
      const isBefore = moment(this.model.validTimeEnd).isBefore(this.model.validTimeStart)
      const isSame = moment(this.model.validTimeEnd).isSame(this.model.validTimeStart)
      if (isBefore || isSame) {
        callback(new Error('结束时间不能大于等于开始时间'))
      } else {
        callback()
      }
    }
    return {
      model: { ...DEFAULT_BASEINFO_DATA },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: ['blur', 'change'] },
          { validator: validates.validateName, trigger: ['blur', 'change'] }
        ],
        guideIds: [
          { required: true, message: `请选择`, trigger: ['blur', 'change'] },
          { validator: validates.validateGuideIds, message: `请选择`, trigger: ['blur', 'change'] }
        ],
        validTimeStart: [
          { required: true, message: '请选择开始日期', trigger: ['blur', 'change'] }
        ],
        validTimeEnd: [
          { required: true, message: '请选择结束日期', trigger: ['blur', 'change'] },
          { validator: validTimeEndFunc, trigger: ['blur', 'change'] }
        ]
      },
      pickerOptions: this.endDateDisable(),
      btnNext: process.env.VUE_APP_THEME,
      foot: 'costomcode-footer',
      footQA: 'costomcodeQA-footer',
      btnQA: 'btnQA',
      btn: 'btn',
      radioQA: 'radioQA',
      radio: 'radio',
      numberQA: 'numberQA',
      number: 'number'

    }
  },
  props: ['data', 'isStating'],
  computed: {
    ...mapState({
      // 环境判断
      cloudPlatformType: state => state.user.remumber.remumber_login_info.productConfig.cloudPlatformType
    }),
    guideNamesEnv () {
      return this.cloudPlatformType === 'ecrp' ? '参与活动人员' : '参与活动成员'
    },
    guideTipEnv () {
      return this.cloudPlatformType === 'ecrp' ? '请选择可以在企微侧边栏使用该活动裂变大师的员工' : '选择的成员可以在企微侧边栏发送该裂变大师活动'
    },
    guideName () {
      return this.cloudPlatformType === 'ecrp' ? '人员' : '成员'
    }
  },
  components: {
    Box, LengthInput, HtmlArea, GuideDialog
  },
  methods: {
    handleChangeGuide (value) {
      this.model.guideDatas = value
      this.$refs.baseDataFrom && this.$refs.baseDataFrom.validateField('guideIds')
    },
    // 删除所选员工
    handleDelect (index) {
      this.model.guideDatas.splice(index, 1)
      this.model.guideIds.splice(index, 1)
      this.$refs.baseDataFrom && this.$refs.baseDataFrom.validateField('guideIds')
    },
    // 删除所有员工
    handleDelectAll () {
      this.model.guideIds = []
      this.model.guideDatas = []
      this.$refs.baseDataFrom && this.$refs.baseDataFrom.validateField('guideIds')
    },
    endDateDisable () {
      let that = this
      return {
        disabledDate (time) {
          if (that.isEdit) {
            return time.getTime() < that.model.validTimeStart
          } else {
            return false
          }
        }
      }
    },
    // 编辑时 参加活动人员超过GUIDE_MAX确认 设置裂变海报 -> 聚合码禁用
    codeDisableCheck () {
      return new Promise((resolve, reject) => {
        if (!this.$route.query.guestCodeId || this.model.guideIds.length <= GUIDE_MAX) {
          // 非编辑 或 参加活动人员小与GUIDE_MAX
          return resolve(true)
        }

        this.$confirm(`参加活动员工大于${GUIDE_MAX}，第四步中裂变大师的海报聚合码将自动为您转为单员工二维码，是否继续 `, '提示', {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          resolve(true)
        }).catch(() => {
          resolve(false)
        })
      })
    },
    handleSubmit () {
      this.$refs.baseDataFrom.validate(async (valid) => {
        if (valid) {
          const codeDisabled = await this.codeDisableCheck()
          if (codeDisabled) {
            this.$emit('changeData', {
              key: STEP_LIST[0].dataName,
              value: this.model
            })
            this.$emit('changeStepId', 'next')
          }
        }
      })
    }
  },
  mounted () {
    this.model = { ...this.data }
    this.rules.guideIds = [
      { required: true, message: `请选择${this.guideNamesEnv}`, trigger: ['blur', 'change'] },
      { validator: validates.validateGuideIds, message: `请选择${this.guideNamesEnv}`, trigger: ['blur', 'change'] }
    ]
  }
}
</script>
<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
@import "../../styles/customcode.css";
.form-item_toptext {
  line-height: 22px;
  font-size: 12px;
  color: #595959;
  margin-top: 5px;
  .form-item_toptext__length {
    font-size: 12px;
    color: rgba(0,0,0,0.45);
    line-height: 20px;
  }
  >>> .el-radio {
    line-height: 21px;
  }
}
.employee-list {
    display: flex;
    padding: 8px 0 0 8px;
    flex-direction: row;
    flex-wrap: wrap;
  }
.employee-list_item {
  display: inline-block;
  align-items: center;
  background: #f5f5f5;
  margin-right: 4px;
  margin-bottom: 8px;
  height: 24px;
  line-height: 24px;
  padding: 0 8px;
  border-radius: 12px;
  font-size: 14px;
  i {
    margin-left: 4px;
    cursor: pointer;
    display: inline;
  }
}
.employee-list_all {
  display: inline-block;
  height: 18px;
  line-height: 18px;
  color: #fff;
  width: 18px;
  text-align: center;
  border-radius: 50%;
  background: #8c8c8c;
  margin-top: 3px;
  cursor: pointer;
}
.employee-selected-text {
  font-size: 14px;
  padding-bottom: 8px;
}
.employee-text {
  font-size: 14px;
  color: #bfbfbf;
  padding-bottom: 8px;
}
.prompt-text {
  display: flex;
  align-items: center;
  .yellow-point {
    background: #f2aa18;
    display: inline-block;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    margin-right: 8px;
  }
}
.question-circle {
  position: relative;
  top: 1px;
  left: 5px;
}
.form-item_time {
  display: flex;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 2px;
}
.employee-suffix {
  cursor: pointer;
  min-width: 40px;
  font-size: 12px;
  color: #0392FB;
  text-align: center;
}
.time-line-view {
  display: inline-block;
  margin-left: 8px;
}
</style>
<style scoped>
.form-item_time {
  >>> .el-form-item__label:before {
    display: none !important ;
  }
  >>> .el-form-item {
    margin-bottom: 0px;
  }
  >>> .el-form-item.is-error .el-input__inner {
    border-color: #F56C6C !important;
  }
}
.costomcode-footer .current{
  background-color: #0091FA;
  color: #FFFFFF;
  border: 1px solid #0091FA;
}
.costomcodeQA-footer .btnQA.current{
  background-color: #2153D4;
  color: #FFFFFF;
  width: 160PX;
  height: 40px;
  border: 1px solid #2153D4;
  text-align: center;
  line-height: 40px;
  border-radius: 2px;
  cursor: pointer;
  margin-right: 16px;
}
.radioQA>>> .el-radio__input.is-checked .el-radio__inner{
  border-color: #2153D4;
  background: #2153D4;
}
.radio>>> .el-radio__input.is-checked .el-radio__inner{
  border-color: #0091FA;
  background: #0091FA;
}
.radioQA>>> .el-radio__input.is-checked + .el-radio__label{
  color: #2153D4;
}
.radio>>> .el-radio__input.is-checked + .el-radio__label{
  color: #0091FA;
}
.number{
  color: #0091FA;
}
.numberQA{
  color: #2153D4;
}
</style>
