<template>
  <Box :noborder='true'>
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
        <el-form-item label="参加活动人员" prop="guideIds">
          <div class="flex-box form-item_toptext">
            <span>选择的员工可以在企微侧边栏使用该裂变大师活动</span>
            <span class="form-item_toptext__length"
              >已选<span>{{ model.guideIds.length }}</span
              >人</span
            >
          </div>
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
                  请选择可以在企微侧边栏使用该活动裂变大师的员工
                </p>
              </template>
            </div>
            <template slot="suffix">
              <div class="employee-suffix">
                <NsGuideDialog
                  :selfBtn="true"
                  :appendToBody="true"
                  :isButton="false"
                  :validNull="true"
                  :auth="false"
                  btnTitle=""
                  type="text"
                  dialogTitle="选择员工"
                  v-model="model.guideIds"
                  @inputAllData="handleChangeGuide"
                >
                  <template slot="selfBtn">
                    <Icon type="geren"></Icon>
                  </template>
                </NsGuideDialog>
              </div>
            </template>
          </html-area>
        </el-form-item>
        <el-form-item label="有效时间" required prop="validTimeType">
          <div class="form-item_toptext">
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
      <div class='costomcode-footer'>
        <div class='btn current' @click="handleSubmit">下一步</div>
      </div>
    </template>
  </Box>

</template>
<script>
import Box from '@/components/NewUi/Box'
import LengthInput from '@/components/NewUi/LengthInput'
import HtmlArea from '@/components/NewUi/HtmlArea'
import NsGuideDialog from '@/components/NsGuideDialog'
import TagArea from '@/components/NewUi/TagArea'
import moment from 'moment'
import { DEFAULT_BASEINFO_DATA, STEP_LIST } from '../../src/const'
import validates from '../../src/validates'
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
          { required: true, message: '请选择参加活动人员', trigger: ['blur', 'change'] },
          { validator: validates.validateGuideIds, message: '请选择参加活动人员', trigger: ['blur', 'change'] }
        ],
        validTimeStart: [
          { required: true, message: '请选择开始日期', trigger: ['blur', 'change'] }
        ],
        validTimeEnd: [
          { required: true, message: '请选择结束日期', trigger: ['blur', 'change'] },
          { validator: validTimeEndFunc, trigger: ['blur', 'change'] }
        ]
      },
      pickerOptions: this.endDateDisable()
    }
  },
  props: ['data', 'isStating'],
  components: {
    Box, LengthInput, HtmlArea, NsGuideDialog
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
    handleSubmit () {
      this.$refs.baseDataFrom.validate((valid) => {
        if (valid) {
          this.$emit('changeData', {
            key: STEP_LIST[0].dataName,
            value: this.model
          })
          this.$emit('changeStepId', 'next')
        }
      })
    }
  },
  mounted () {
    console.log(this.data)
    this.model = { ...this.data }
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
  margin-bottom: 8px;
  .form-item_toptext__length {
    font-size: 14px;
    span {
      color: #0091fa;
    }
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
  color: #bfbfbf;
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

</style>
