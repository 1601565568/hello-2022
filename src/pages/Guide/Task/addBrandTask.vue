<template>
  <div>
    <!-- 页面顶部内容 - 标题、保存按钮、面包屑 -->
    <div class='newTask-head'>
      <ElBreadcrumb separator='/'>
        <ElBreadcrumbItem>业绩指标</ElBreadcrumbItem>
        <ElBreadcrumbItem>任务管理</ElBreadcrumbItem>
        <ElBreadcrumbItem>{{ titleText }}</ElBreadcrumbItem>
      </ElBreadcrumb>
      <div class='clearfix newTask-head__title'>
        <span class='newTask-head__title-content'> {{ titleText }} </span>
        <div class='float-right'>
          <NsButton @click='handleClose'>取消</NsButton>
          <NsButton type='primary' :loading="loading" @click="saveFun">保存</NsButton>
        </div>
      </div>
    </div>
    <!--  表单内容  -->
    <div class='newTask-content'>
      <ElScrollbar ref='fullScreen'>
        <ElForm ref="form" label-width='136px' :rules='rules' :model='model'>
          <ElCollapse v-model='activeNames'>
            <ElCollapseItem title='基础信息' name='1'>
              <ElFormItem label='任务名称' prop='name'>
                <div class='newTask-content__item'>
                  <ElInput
                    v-model='model.name'
                    show-word-limit
                    maxlength='25'
                  />
                </div>
              </ElFormItem>
              <ElFormItem label='执行时间' required>
                <div class='newTask-content__item'>
                  <ElDatePicker
                    v-model='model.activityTime'
                    type='datetimerange'
                    range-separator='至'
                    start-placeholder='开始日期'
                    @change='timeFun'
                    :picker-options='pickerOptions0'
                    end-placeholder='结束日期'
                    :default-time="['00:00:00', '23:59:59']"
                  />
                </div>
              </ElFormItem>
              <ElFormItem label='执行次数' prop='runType' required>
                <ElRadioGroup v-model='model.runType'>
                  <ElRadio :label='0'>单次执行</ElRadio>
                  <ElRadio :label='1'>每日执行</ElRadio>
                </ElRadioGroup>
                <span class='newTask-content__item-tip'
                  >设为每日执行时，执行时间内每天都会重新通知店长、已分配指标的导购，同时重新计算统计执行情况</span
                >
              </ElFormItem>
            </ElCollapseItem>
            <ElCollapseItem title='任务内容' name='2'>
              <ElFormItem label='任务类型'>
                <ElRadioGroup v-model='model.type'>
                  <ElRadio :label='0'>营销任务</ElRadio>
                  <ElRadio :label='1'>回访任务</ElRadio>
                  <ElRadio :label='3'>日常任务</ElRadio>
                  <ElRadio :label='2'>分享任务</ElRadio>
                </ElRadioGroup>
              </ElFormItem>
              <ElFormItem label='执行门店'>
                <ElRadioGroup v-model='model.shopRangeType'>
                  <ElRadio :label='0'>全部门店</ElRadio>
                  <ElRadio :label='1'>指定门店</ElRadio>
                </ElRadioGroup>
                <span v-if='model.shopRangeType === 1'>
                  <shopSelect icon='el-icon-circle-plus-outline' @callBack="selectShopBack" :hasShopArr="hasShopArr"
                    >选择门店</shopSelect
                  ><span class='chose-data-tip'
                    >已选择 <span class='text-info'>0</span> 家门店
                  </span>
                </span>
              </ElFormItem>
              <ElFormItem label='会员分组' class='special-layout'>
                <div class='newTask-content__item'>
                  <el-select
                    v-model='model.viewId'
                    placeholder='请选择视角'
                    @change='chooseView'
                  >
                    <el-option
                      v-for='item in options'
                      :key='item.value'
                      :label='item.label'
                      :value='item.value'
                    >
                    </el-option>
                  </el-select>
                  <el-select
                    :value='model.subgroupId'
                    placeholder='请选择会员分组'
                    @change='chooseSubgroup'
                  >
                    <el-option
                      v-for='item in subgroups'
                      :key='item.id'
                      :label='item.name'
                      :value='item.id'
                    >
                    </el-option>
                  </el-select>
                </div>
                <span class='newTask-content__item-tip'>
                  选择运营视角后，可选择零售CRM客户洞察中的会员分组
                </span>
              </ElFormItem>
              <ElFormItem label='任务简述' prop="remark" required>
                <div class='newTask-content__item'>
                  <ElInput
                    type='textarea'
                    :rows='5'
                    placeholder='请输入任务简述'
                    show-word-limit
                    maxlength='1000'
                    v-model="model.remark"
                  />
                </div>
              </ElFormItem>
              <template v-if="model.type === 2">
                <ElFormItem label='素材'>
                  <div>
                    <NsButton icon='el-icon-circle-plus-outline' @click='selectMaterialShowFun()'
                      >选择素材</NsButton
                    >
                  </div>
                  <div class='newTask-content__item catalogue-materials'>
                    <p class='catalogue-materials__content'>
                      <el-input style="width:200px;" disabled v-model="model.materialTitle">{{model.materialTitle}}</el-input>
                    </p>
                    <div class='catalogue-materials__item--media'>
                      <!-- 视频、图片预览请使用SG项目中组件：NsPreview，可参照实例：https://test-sg.ecrpcloud.com/Guide/Material/Library -->
                      <!-- 展示图片结构 -->
                      <!-- <div class='catalogue-materials__image'>-->
                      <!-- <img src='https://shopguide.oss-cn-hangzhou.aliyuncs.com/image/202009/10000146/3aaf0732-4f73-4052-b808-8e34975778da.png?x-oss-process=image/resize,m_mfit,h_200,w_200' />-->
                      <!-- </div>-->
                      <div class='catalogue-materials__video'>
                        <video
                          src='https://shopguide.oss-cn-hangzhou.aliyuncs.com/video/202008/10000146/30d72b50-dca3-479c-9b6a-bb1975efa879.mp4'
                          style='width: 60px; height: 107px'
                        >
                          您的浏览器暂不支持播放该视频，请升级至最新版浏览器。
                        </video>
                        <div class='catalogue-materials__video--mask'>
                          <div class='catalogue-materials__video--wrapper'>
                            <Icon type='begin' />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ElFormItem>
              </template>
            </ElCollapseItem>
          </ElCollapse>
        </ElForm>
      </ElScrollbar>
    </div>
    <selectMaterialListModal :callBack="selectMaterialBack" ref="selectDialogDom"></selectMaterialListModal>
  </div>
</template>
<script>
import scrollHeight from '@nascent/ecrp-ecrm/src/mixins/scrollHeight'
import ElBreadcrumb from '@nascent/nui/lib/breadcrumb'
import ElBreadcrumbItem from '@nascent/nui/lib/breadcrumb-item'
import ElCollapse from '@nascent/nui/lib/collapse'
import ElCollapseItem from '@nascent/nui/lib/collapse-item'
import selectMaterialListModal from './selectMaterialListModal'
import shopSelect from '../components/selectShops'
import { getErrorMsg } from '@/utils/toast'
import moment from 'moment'
export default {
  props: {
    callBack: Function
  },
  mixins: [scrollHeight],
  components: {
    ElBreadcrumb,
    ElBreadcrumbItem,
    ElCollapse,
    ElCollapseItem,
    selectMaterialListModal,
    shopSelect
  },
  data () {
    var validateMaterial = (rule, value, callback) => {
      if (this.$refs.form.model.type === 2) {
        if (!this.$refs.form.model.materialId) {
          callback(new Error('请选择素材'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      pickerOptions0: {
        // disabledDate (time) {
        //   return time.getTime()
        // }
      },
      pickerOptions2: {
        onPick: function (e) {}
      },
      // 页面滚动条内容高度配置
      scrollBarDeploy: {
        ref: 'fullScreen', // 页面滚动条ref的名称
        excludeHeight: 104
      },
      titleText: '新建任务',
      loading: false, // 防重复提交
      activeNames: ['1', '2'],
      hasShopArr: [], // 已选择门店
      model: {
        name: '',
        type: 0,
        activityTime: [
          new Date(2000, 10, 10, 10, 10),
          new Date(2000, 10, 11, 10, 10)
        ],
        remark: '',
        shopRangeType: 0,
        runType: 0,
        viewId: '',
        viewName: '',
        subgroupId: '',
        subgroupName: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
          { min: 4, max: 25, message: '长度在4-25以内', trigger: 'blur' }
        ],
        activityTime: [
          { required: true, message: '请选择执行时间', trigger: 'blur' }
        ],
        type: [{ required: true, message: '请选择类型' }],
        shopRangeType: [{ required: true, message: '请选择门店' }],
        remark: [{ required: true, message: '请输入简述' }],
        runType: [{ required: true, message: '请选择执行次数' }],
        materialTitle: [{ validator: validateMaterial, trigger: 'blur' }]
      },
      options: [], // 视角集合
      subgroups: [], // 视角下分组集合
      selectMaterial: {
        // 当前选择的素材对象
      }
    }
  },
  methods: {
    timeFun (val) {},
    selectShopBack (val) {
      this.hasShopArr = val
    },
    // 页面取消跳转列表
    handleClose () {
      this.hasShopArr = []
      this.$router.push('/Guide/Task/List')
    },
    // 选择视角
    chooseView (obj) {
      var param = {}
      param.viewId = obj
      this.subgroups = []
      this.model.subgroupId = null
      this.$http.fetch(this.$api.guide.querySubgroup, param).then(resp => {
        if (resp.success) {
          for (var i = 0; i < resp.result.length; i++) {
            var subgroupmsg = resp.result[i]
            var subgroupJson = {}
            subgroupJson.id = subgroupmsg.id
            subgroupJson.name = subgroupmsg.subdivisionName
            this.subgroups.push(subgroupJson)
          }
        }
      }).catch(resp => {
        this.$notify.error('查询视角分组信息失败', resp)
      })
    },
    // 选择分组
    chooseSubgroup (subgroupId) {
      this.model = Object.assign({}, this.model, { subgroupId })
    },
    // 选择素材
    selectMaterialShowFun () {
      this.$nextTick(() => {
        this.$refs.selectDialogDom.showToggle(this.selectMaterial)
      })
    },
    // 选择素材回调
    selectMaterialBack (obj) {
      this.model.materialId = obj.id
      this.model.materialTitle = obj.name
      this.selectMaterial = obj
    },
    // 提交保存
    saveFun () {
      var that = this
      this.$refs.form.validate(valid => {
        if (valid) {
          if (that.model.activityTime.length === 2) {
            that.model.startTime = moment(that.model.activityTime[0]).format(
              'YYYY-MM-DD HH:mm:ss'
            )
            that.model.endTime = moment(that.model.activityTime[1]).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          }
          // 指定门店
          if (that.model.shopRangeType === 1) {
            if (that.hasShopArr.length === 0) {
              that.$notify.error('请至少选择一家门店')
              return
            }
            that.model.targetIds = that.hasShopArr.join(',')
          } else {
            that.model.targetIds = 0
          }
          // 选择视角
          if (!that.model.viewId) {
            that.$notify.error('请选择视角')
            return
          }
          // 选择视角
          if (!that.model.subgroupId) {
            that.$notify.error('请选择分组')
            return
          }
          that.doSave()
        }
      })
    },
    async doSave () {
      this.loading = true
      await this.$http
        .fetch(this.$api.guide.taskEdit, this.model)
        .then(resp => {
          // 置空已经选择的素材
          this.selectMaterial = {}
          this.handleClose()
          this.$notify.success(resp.msg)
          // 回调刷新列表
          this.$props.callBack()
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
      this.loading = false
    },
    showToggle (obj) {
      this.model = {
        name: '',
        type: 0,
        remark: '',
        shopRangeType: 0,
        runType: 0,
        shopIds: [],
        activityTime: []
      }
      this.selectMaterial = {}
      this.dialogVisible = true
    }
  },
  // watch: {
  //   'model.subgroupId' (newval) {
  //     console.log(newval)
  //   },
  //   'model.viewId' () {
  //     this.model.subgroupId = ''
  //   }
  // },
  mounted: function () {
    this.model = {
      name: '',
      type: 0,
      remark: '',
      shopRangeType: 0,
      runType: 0,
      shopIds: [],
      activityTime: []
    }
    this.$http
      .fetch(this.$api.guide.queryView)
      .then(resp => {
        if (resp.success) {
          this.options = []
          for (var i = 0; i < resp.result.length; i++) {
            var view = resp.result[i]
            var viewJson = {}
            viewJson.value = view.viewId
            viewJson.label = view.viewName
            this.options.push(viewJson)
          }
        }
      })
      .catch(resp => {
        this.$notify.error('查询视角失败', resp)
      })
    const id = this.$route.params.id
    if (parseInt(id) > 0) {
      var params = {}
      params.taskId = parseInt(id)
      this.$http.fetch(this.$api.guide.queryTask, params).then(resp => {
        if (resp.success) {
          var obj = resp.result
          this.titleText = '编辑任务'
          this.model.id = obj.id
          this.model.type = obj.type
          this.model.runType = obj.runType
          this.model.remark = obj.remark
          this.model.name = obj.name
          this.model.activityTime.push(new Date(obj.startTime))
          this.model.activityTime.push(new Date(obj.endTime))
          this.model.viewId = obj.viewId
          this.model.subgroupId = obj.subgroupId
          this.chooseView(obj.viewId)
          this.chooseSubgroup(obj.subgroupId)
          // 指定门店
          if (obj.targetIds === '0') {
            this.model.shopRangeType = 0
          } else {
            this.model.shopRangeType = 1
            this.hasShopArr = obj.targetIds.split(',')
          }
          // 素材任务时
          if (obj.materialId) {
            this.selectMaterial.id = obj.materialId
            this.selectMaterial.materialTitle = obj.materialTitle
            this.model.materialId = obj.materialId
            this.model.materialTitle = obj.materialTitle
          }
        }
      }).catch(resp => {
        this.$notify.error(getErrorMsg('获取任务详情失败', resp))
        this.$router.push('/Guide/Task/List')
      })
    }
  },
  created: function () {}
}
</script>
<style scoped>
@import '@theme/variables.pcss';
.newTask-head {
  padding: 16px 16px 12px;
  background: var(--theme-color-white);
  margin: -10px -10px 0;

  .newTask-head__title {
    margin-top: 12px;
    .newTask-head__title-content {
      line-height: 32px;
      color: #262626;
      font-size: var(--default-font-size-middle);
    }
    .float-right {
      padding-top: 2px;
      .el-button + .el-button {
        margin-left: 16px;
      }
    }
  }
}
.newTask-content {
  background: var(--theme-color-white);
  margin-top: var(--default-margin-larger);
}
>>> .newTask-head {
  .el-breadcrumb {
    line-height: 22px;
  }
  .el-breadcrumb__item:not(:last-child) {
    .el-breadcrumb__inner,
    .el-breadcrumb__separator {
      color: var(--theme-font-color-secondary);
    }
  }
  .el-breadcrumb__separator {
    margin: 0 var(--default-margin-larger) 0 var(--default-margin-small);
  }
}
>>> .newTask-content {
  .el-collapse-item:last-child {
    margin-bottom: 0;
  }
  .el-collapse-item__header {
    position: relative;
    font-size: var(--default-font-size-middle);
    height: 56px;
    line-height: 56px;
    color: #262626;
    background: var(--theme-color-white);
    margin-bottom: 0;
    padding-left: 40px;
    .el-collapse-item__arrow {
      position: absolute;
      left: 16px;
    }
  }
  .el-collapse-item__wrap {
    padding: 16px 0;
  }
  .el-form-item .el-form-item__label {
    padding-right: 36px;
    color: #595959;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 24px;
  }
  .el-form-item--small.el-form-item:last-child {
    margin-bottom: 0;
  }
  .el-radio-group > .el-radio {
    margin-right: 16px;
  }
  .newTask-content__item {
    display: inline-block;
    width: 626px;
    margin-right: 16px;
    > * {
      width: 100%;
    }
    > *:not(:last-child) {
      margin-bottom: 16px;
    }
    .el-date-editor .el-range-input {
      width: auto;
    }
  }
  .newTask-content__item-tip {
    position: relative;
    padding-left: 16px;
    height: var(--default-form-item-small-height);
    color: #595959;
  }
  .newTask-content__item-tip:before {
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
  .chose-data-tip {
    margin-left: 16px;
  }
  .special-layout .el-form-item__content {
    display: flex;
  }
}

@component-namespace catalogue {
  @b materials {
    padding: 16px;
    margin-top: 8px;
    background: #f5f5f5;
    border-radius: 2px;
    @e image {
      margin-right: -6px;
      margin-bottom: -5px;
      vertical-align: middle;
      img {
        margin: 0 5px 5px 0;
        width: 78px;
        height: 78px;
        border-radius: 3px;
        cursor: pointer;
        object-fit: cover;
      }
    }
    @e content {
      margin-bottom: 8px !important;
      line-height: 22px;
      color: #595959;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    @e video {
      display: inline-block;
      position: relative;
      font-size: 0;
      line-height: 1;
      vertical-align: middle;
      video {
        width: 100%;
        height: 142px;
        border-radius: 3px;
        object-fit: cover;
      }

      @m mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.25);
        cursor: pointer;
        border-radius: 3px;
      }
      @m wrapper {
        position: relative;
        top: 50%;
        left: 50%;
        margin-left: -20px;
        margin-top: -20px;
        width: 40px;
        height: 40px;
        border-radius: 40px;
        background-color: rgba(255, 255, 255, 0.4);
        > svg {
          margin: 5px 0 0 9px;
          font-size: 25px;
          color: #fff;
        }
      }
    }
  }
}
</style>
