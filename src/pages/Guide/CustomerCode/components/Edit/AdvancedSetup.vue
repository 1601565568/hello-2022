<template>
  <div class='scroll-div'>
    <el-form
      label-width="110px"
      size="medium"
      label-position="left"
      :model="model"
      class="normal-from padding-form"
      :rules="rules"
      ref="advancedsetupForm"
    >
      <el-form-item
        label="数据与安全"
        required
        class="larger-item"
      >
        <div class='item-box'>
          <div class="form-item_tip">
            活动开始后，统计方式将不可修改，请谨慎选择
          </div>
          <el-form-item
            label="去重方式"
            required
            prop="distinctType"
            class="larger-item"
          >
            <el-radio-group v-model="model.distinctType" :disabled="isStating">
              <el-radio :label="0">不去重</el-radio>
              <div class="qrcode-bottom-view">
                <span class="remind-view"></span>
                {{DEDUP_WAY[0].text}}
                <el-tooltip  placement="top" popper-class='popperClass'>
                  <ns-button type='text' class='safe-btn'>
                    示例说明
                  </ns-button>
                  <template slot='content'>
                    {{DEDUP_WAY[0].tip}}
                  </template>
                </el-tooltip>
              </div>
              <el-radio :label="2">活动内去重</el-radio>
              <div class="qrcode-bottom-view">
                <span class="remind-view"></span>
                {{DEDUP_WAY[1].text}}
                <el-tooltip  placement="top" popper-class='popperClass'>
                  <ns-button type='text' class='safe-btn'>
                    示例说明
                  </ns-button>
                  <template slot='content'>
                    {{DEDUP_WAY[1].tip}}
                  </template>
                </el-tooltip>
              </div>
              <el-radio :label="1">全局去重</el-radio>
              <div class="qrcode-bottom-view">
                <span class="remind-view"></span>
                {{DEDUP_WAY[2].text}}
                <el-tooltip  placement="top" popper-class='popperClass'>
                  <ns-button type='text' class='safe-btn'>
                    示例说明
                  </ns-button>
                  <template slot='content'>
                    {{DEDUP_WAY[2].tip}}
                  </template>
                </el-tooltip>
              </div>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="解除关系扣减"
            required
            prop="unfriendDeduction"
            class="larger-item"
          >
            <el-switch v-model="model.unfriendDeduction" :active-value='1' :inactive-value='0'  :disabled="isStating"/>
            <div class="qrcode-bottom-view">
              <span class="remind-view"></span>
              开启此功能后，活动周期内，解除好友关系时，扣除裂变好友数
              <el-tooltip  placement="top" popper-class='popperClass'>
                <ns-button type='text' class='safe-btn'>
                  示例说明
                </ns-button>
                <template slot='content'>
                  消费者张三通过裂变大师活动添加员工小A为好友并成功记录小A邀新好友+1，随后解除好友关系，原记录的邀新好友数会随之减去
                </template>
              </el-tooltip>
            </div>
          </el-form-item>
          <el-form-item
            label="统计时效"
            required
            prop="validIntervalTimeOfStatistical"
            class="larger-item"
          >
              <div class="qrcode-top-view">
              好友保持期
                <el-input :disabled="isStating" v-model="model.validIntervalTimeOfStatistical" class='middle' @input="(e)=>{inputEffectiveCycle(e,'validIntervalTimeOfStatistical')}"/>
                <!-- <input type="number" class="number-view middle"  v-model="model.validIntervalTimeOfStatistical" @input="(e)=>{inputEffectiveCycle(e,'validIntervalTimeOfStatistical',9999)}"/> -->
              小时
            </div>
            <div class="qrcode-bottom-view">
              <span class="remind-view"></span>
              添加导购为好友后，需要保持一定时间的好友关系，才会计为裂变成功，0表示添加即时生效
              <el-tooltip  placement="top" popper-class='popperClass'>
                <ns-button type='text' class='safe-btn'>
                  示例说明
                </ns-button>
                <template slot='content'>
                  消费者张三通过裂变大师活动添加员工小A为好友后，需等待好友保持期结束才会记录小A要邀新好友数
                </template>
              </el-tooltip>
            </div>
          </el-form-item>
          <el-form-item
            label="允许重复参加"
            required
            prop="repeatParticipation"
            class="larger-item"
          >
            <el-switch :disabled="isStating" v-model="model.repeatParticipation"  :active-value='0' :inactive-value='1'/>
            <div class="qrcode-bottom-view">
              <span class="remind-view"></span>
              关闭此功能后，单个活动内，不允许成为多位员工的裂变大师
              <el-tooltip  placement="top" popper-class='popperClass'>
                <ns-button type='text' class='safe-btn'>
                  示例说明
                </ns-button>
                <template slot='content'>
                  单个活动内，好友李四分享员工小A的裂变大师活动后，不允许再分享员工小B的裂变大师活动
                </template>
              </el-tooltip>
            </div>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item
        label=""
        required
        prop="effectiveCycle"
      >
        <template slot='label' class='larger-item_icon'>
          <span>
            分享二维码
            <el-tooltip content="可前往“内容管理->红包工具->红包策略”添加“员工发放”的红包"  placement="top">
              <Icon type="question-circle" class='question-circle' /><br/>
            </el-tooltip>
            过期设置
          </span>
        </template>
        <div class='item-box'>
          <div class="qrcode-top-view">
            <el-input class="middle"  v-model="model.effectiveCycle" @input="(e)=>{inputEffectiveCycle(e,'effectiveCycle')}"/>
            天内未邀请到新的好友，分享二维码将失效，裂变大师可重新下载
          </div>
          <div class="qrcode-bottom-view">
            <span class="remind-view"></span>
            因企业微信生成联系我二维码数量限制，请合理设置过期时间
          </div>
        </div>
      </el-form-item>
      <el-form-item
        label="自动打标签"
        required
        prop="effectiveCycle"
      >
        <div class='item-box'>
          <template v-for="(tagItem, tagkey) in tagConf">
            <el-form-item
              v-for="(item, index) in model.tags[tagkey]"
              :key="`${tagkey}_${index}`"
              :prop="`tags.${tagkey}.${index}`"
              class="larger-item"
            >
              <div v-if="!index" class='sub-title sub-title-color'>
                {{tagItem.tip}}
                <el-tooltip v-if="tagItem.help" class="help" :content="tagItem.help">
                  <Icon type="ns-help"/>
                </el-tooltip>
              </div>
              <div class="select-area">
                <span v-if="model.tags[tagkey].length > 1" class="select-title">
                  {{tagItem.stairPrefix}}{{staircase[index]}}
                </span>
                <div class="select-tips" @click="openAddTagDialog(`tags.${tagkey}.${index}`)">
                  <span v-if="!model.tags[tagkey][index].tagGroupId" class="un-selected">请选择标签</span>
                  <span v-else class="selected">已选择{{model.tags[tagkey][index].tagGroupId.split(',').length}}个标签</span>
                  <Icon type="tag-xia" class="icon"/>
                </div>
              </div>
            </el-form-item>
          </template>
        </div>
      </el-form-item>
    </el-form>
    <div class='costomcode-footer'>
      <div class='btn' @click="handlePrev">上一步，配置欢迎语</div>
      <div class='btn current' @click="handleSubmit">保存</div>
    </div>
    <NsAddTagDialog
        :visible.sync="NsAddTagDialogVisible"
        :tagList="tagList"
        :selectedTags="activeSelectedTags"
        @confirm="confirmSelectedTag"
      />
  </div>
</template>
<script>
import { STEP_LIST, DEFAULT_ADVANCEDSETUP_DATA, EDIT_DATA, GET_DEFAULT_TAGS_ITEM } from '../../src/const'
import NsAddTagDialog from '@/components/NsAddTagDialog'
export default {
  data () {
    return {
      model: { ...DEFAULT_ADVANCEDSETUP_DATA },
      DEDUP_WAY: EDIT_DATA.DEDUP_WAY,
      NsAddTagDialogVisible: false, // 打标模态框
      NsAddTagDialogColumn: '', // 正在打标的字段
      tagList: [],
      staircase: [ '一', '二', '三', '四', '五' ],
      rules: {
        validIntervalTimeOfStatistical: [
          {
            validator: (rule, value, callback) => {
              if ((!value && value !== 0) || value < 0 || value > 9999) {
                callback(new Error(`请输入0～9999的整数`))
              } else {
                callback()
              }
            },
            message: '请输入0～9999的整数',
            trigger: ['blur', 'change']
          }
        ],
        effectiveCycle: [
          { required: true, message: '请填写过期时间', trigger: ['blur', 'change'] }
        ]
      },
      tagConf: {
        addValidFriendTags: { label: '自动打标签', tip: '在裂变活动中，通过去重规则后新增的好友', stairPrefix: '自动打标梯度' },
        beGuestCodeTags: { tip: '成为裂变大师后自动打标签', stairPrefix: '成为大师梯度', help: '分享裂变海报的客户即自动成为裂变大师' },
        noStandardTags: { tip: '活动结束后，裂变未达标', stairPrefix: '未达标阶梯' },
        standardTags: { tip: '活动结束后，裂变达标', stairPrefix: '阶梯' },
        noReceiveRewardsTags: { tip: '活动结束后，裂变达标但未领取奖励', stairPrefix: '未领阶梯' },
        receiveRewardsTags: { tip: '通过裂变活动领取奖励打标签', stairPrefix: '领取奖励' }
      }
    }
  },
  props: ['data', 'isStating', 'isEdit', 'ladderRewardList'],
  components: { NsAddTagDialog },
  computed: {
    // 数据安全去重方式提示
    dedupWay () {
      return EDIT_DATA.DEDUP_WAY[this.model.distinctType] || {}
    },
    // 打开选择tag的模块框时，要回显选中的标签
    activeSelectedTags () {
      if (!this.NsAddTagDialogColumn) return ''
      const [ tags, tagKey, index ] = this.NsAddTagDialogColumn.split('.')
      return this.model[tags][tagKey][index].tag
    }
  },
  methods: {
    inputEffectiveCycle (e, name, max) {
      let value = ''
      if (typeof e === 'object') {
        value = e.target.value.replace(/[^\d]/g, '')
      } else {
        value = e.replace(/[^\d]/g, '')
      }
      this.model[name] = max && max < value ? max : value
    },
    openAddTagDialog (tag) {
      this.NsAddTagDialogVisible = true
      this.NsAddTagDialogColumn = tag
    },
    // 确认选择的tag
    confirmSelectedTag (info) {
      const [ tags, tagKey, index ] = this.NsAddTagDialogColumn.split('.')
      const tagItem = this.model[tags][tagKey][index]
      tagItem.tag = info.tagIds.join(',')
      tagItem.tagGroupId = info.tagGroupIds.join(',')

      this.NsAddTagDialogColumn = ''
    },
    /**
     * 生成达标
     */
    setStandardTags (ladderRewardList) {
      const { noStandardTags, standardTags, noReceiveRewardsTags } = this.model.tags
      const newNoStandardTags = []
      const newStandardTags = []
      const newNoReceiveRewardsTags = []
      for (let i = 0; i < ladderRewardList.length; i++) {
        if (!noStandardTags[i]) {
          newNoStandardTags.push(GET_DEFAULT_TAGS_ITEM(i + 1))
          newStandardTags.push(GET_DEFAULT_TAGS_ITEM(i + 1))
          newNoReceiveRewardsTags.push(GET_DEFAULT_TAGS_ITEM(i + 1))
        } else {
          newNoStandardTags.push({ ...noStandardTags[i] })
          newStandardTags.push({ ...standardTags[i] })
          newNoReceiveRewardsTags.push({ ...noReceiveRewardsTags[i] })
        }
      }
      this.model.tags = {
        ...this.model.tags,
        noStandardTags: newNoStandardTags,
        standardTags: newStandardTags,
        noReceiveRewardsTags: newNoReceiveRewardsTags
      }
    },
    handlePrev () {
      this.$emit('changeStepId', 'prev')
    },
    handleSubmit () {
      this.$refs.advancedsetupForm.validate((valid) => {
        if (valid) {
          this.$emit('changeData', {
            key: STEP_LIST[5].dataName,
            value: this.model
          })
          // this.$emit('changeStepId', 'next')
        }
      })
    }
  },
  mounted () {
    this.model = { ...this.data }
  }
}
</script>
<style scoped lang='scss'>
@import '@components/NewUi/styles/reset.css';
@import "../../styles/customcode.css";
.scroll-div {
  height: 100%;
  overflow-y: auto;
}
.padding-form {
  padding-right: 42px;
}
.qrcode-bottom-view {
  height: 20px;
  padding: 10px 0;
  box-sizing: content-box;
}
.qrcode-top-view {
  display: flex;
  flex-direction: row;
  height: 32px;
  font-size: 14px;
  color: #595959;
  .number-view {
    width: 88px;
    height: 32px;
    background: #ffffff;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    margin-right: 8px;
  }
}
.sub-title {
  font-size: 14px;
  color: #595959;
}
.select-area {
  display: flex;
  font-size: 14px;
  .select-title {
    margin-right: 15px;
    display: inline-block;
    white-space: nowrap;
  }
  .select-tips {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    width: 626px;
    height: 32px;
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
</style>
