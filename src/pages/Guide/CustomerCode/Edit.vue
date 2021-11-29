<template>
  <page-edit>
    <template slot='header'>
      <div class='common-header flex-box'>
        <h3>{{editType}}裂变大师活动</h3>
        <div class='common-btn'>
          <ns-button class='customer-btn_cancel' size='large' @click='handleCancel'>取消</ns-button>
        </div>
      </div>
    </template>
    <template slot='content'>
      <div class='container'>
        <div class='customecode-step'>
          <el-steps :active="stepId" finish-status="success">
            <template v-for="item in STEP_LIST">
              <el-step :key="item.id" :title="item.name"></el-step>
            </template>
          </el-steps>
        </div>
        <div class='content-box' v-loading="!isLoaded">
          <template  v-if='isLoaded'>
            <div v-for="item in STEP_LIST" :key='item.id' v-show='stepId===item.id' class='content-div'>
              <component
                :is="item.module"
                :ref="item.module"
                :data='data[item.dataName]'
                :isStating='isStating'
                :isEdit='isEdit'
                :ladderRewardList='ladderRewardList'
                :validTimeType='validTimeType'
                @changeStepId='changeStepId'
                @changeData='changeData'
                >
              </component>
            </div>
          </template>
        </div>
      </div>
    </template>
  </page-edit>
</template>
<script>
import ElSteps from '@nascent/nui/lib/steps'
import ElStep from '@nascent/nui/lib/step'
import PageEdit from '@/components/NewUi/PageEdit'
import { STEP_LIST, DEFAULT_BASEINFO_DATA, DEFAULT_SETPRIZE_DATA, DEFAULT_SETPOSTER_DATA, DEFAULT_SETWELCOMECODE_DATA, DEFAULT_ADVANCEDSETUP_DATA, DEFAULT_PRIZE_ITEM, DEFAULT_PAGEDECORATION_DATA } from './src/const'
import { submitFormat, loadingFormat } from './util/format'
import BaseInfo from './components/Edit/BaseInfo'
import AdvancedSetup from './components/Edit/AdvancedSetup'
import PageDecoration from './components/Edit/PageDecoration'
import PrizeSet from './components/Edit/PrizeSet'
import SetPoster from './components/Edit/SetPoster'
import SetWelcomeCode from './components/Edit/SetWelcomeCode'
export default {
  components: { ElSteps, ElStep, PageEdit, BaseInfo, AdvancedSetup, PageDecoration, PrizeSet, SetPoster, SetWelcomeCode },
  data () {
    return {
      STEP_LIST,
      stepId: STEP_LIST[0].id,
      data: {
        baseInfoData: { ...DEFAULT_BASEINFO_DATA },
        prizeSetData: { ...DEFAULT_SETPRIZE_DATA },
        pageDecorationData: { ...DEFAULT_PAGEDECORATION_DATA },
        setPosterData: { ...DEFAULT_SETPOSTER_DATA },
        setWelcomeCodeData: { ...DEFAULT_SETWELCOMECODE_DATA },
        advancedSetupData: { ...DEFAULT_ADVANCEDSETUP_DATA }
      },
      isEdit: false, // 是否编辑
      isStating: false, // 是否是进行中的
      isLoaded: false, // 是否加载完成
      ladderRewardList: [], // 阶梯奖励列表
      validTimeType: DEFAULT_BASEINFO_DATA.validTimeType, // 时间类型
      guestCodeId: null,
      // 员工请求参数
      employeePage: {
        start: 0,
        length: 200
      }
    }
  },
  computed: {
    editType () {
      return this.$route.query.guestCodeId ? '编辑' : '新建'
    }
  },
  methods: {
    handleCancel () {
      this.$router.push({ name: 'CustomerCodeList' })
    },
    /**
     * 下一步或者上一步
     */
    changeStepId (type) {
      this.stepId = type === 'next' ? this.stepId + 1 : this.stepId - 1
    },
    /**
     * 修改data数据
     */
    changeData (data) {
      const { key, value } = data
      this.data[key] = { ...value }
      this.extraDeal(key, value)
    },
    // 获取员工详情
    getGuideListByGuestCodeId (guestCodeId) {
      const { start, length } = this.employeePage
      this.$http.fetch(this.$api.guide.customerCode.findGuideList, { start, length, searchMap: { guestCodeId } }).then(res => {
        const { result } = res
        this.employeePage.start += this.employeePage.length
        this.data.baseInfoData.guideDatas.push(...result.data)
        this.data.baseInfoData.guideIds.push(...result.data.map(item => item.guideId))
      })
    },
    // 获取详情
    async loadActivity (guestCodeId) {
      const json = await this.$http.fetch(this.$api.guide.customerCode.getByGuestCodeId, { guestCodeId })
      if (!json.success) return
      const result = json.result
      return result
    },
    /**
     * 修改data过程中的额外处理
     */
    extraDeal (key, value) {
      // 奖品设置中设置的阶梯奖励装修页面和高级设置需要用到，存入ladderRewardList中
      if (key === 'prizeSetData') {
        this.ladderRewardList = value.prizeRuleList
        // 重新生成页面装修中的阶梯，引用类型放在watch太不可控
        this.$refs.PageDecoration[0].setActiveInfoList(this.ladderRewardList, value.isOpnePrize)
        // 重新生成高级设置达标
        this.$refs.AdvancedSetup[0].setStandardTags(this.ladderRewardList, value.isOpnePrize)
      }
      // 页面装修需要用到时间类型
      if (key === 'baseInfoData') {
        this.validTimeType = value.validTimeType
      }
      // 高级设置完成提交
      if (key === 'advancedSetupData') {
        this.onSubmit()
      }
    },
    /**
     * 提交
     */
    onSubmit () {
      const data = submitFormat(this.data)
      this.$http.fetch(this.$api.guide.customerCode.saveOrUpdate, { ...data, guestCodeId: this.guestCodeId }).then(res => {
        this.$notify.success('保存成功')
        this.handleCancel()
      }).catch(res => {
        this.$notify.error(res.msg)
      }).finally(res => {
        // this.btnLoad = false
      })
    }
  },
  async mounted () {
    this.isLoaded = false
    const query = this.$route.query
    const { guestCodeId, copyGuestCodeId } = query
    this.guestCodeId = guestCodeId
    this.copyGuestCodeId = copyGuestCodeId
    if (guestCodeId || copyGuestCodeId) {
      this.isEdit = true
      const data = await this.loadActivity(guestCodeId || copyGuestCodeId)
      this.getGuideListByGuestCodeId(guestCodeId || copyGuestCodeId)
      if (guestCodeId) {
        this.isStating = !!(data.status === 2)
        this.isEdit = true
      } else {
        this.isStating = false
        this.isEdit = false
      }
      this.data = loadingFormat(data)
      this.isLoaded = true
    } else {
      this.isStating = false
      this.isEdit = false
      this.isLoaded = true
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
.container {
  background-color: #fff;
  padding-top: 40px;
  height: calc(100vh - 183px);
  box-sizing: border-box;
  padding-bottom: 80px;
  position: relative;
}
.customecode-step {
  width: 888px;
  margin: 0px auto 40px;
}
.content-box {
  padding-left: 42px;
  height: calc( 100% - 107px );
}
.content-div {
  height: 100%;
}
</style>
