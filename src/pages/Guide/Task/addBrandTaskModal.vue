<template>
<!-- 新增任务弹窗  wanrengang 201800803 -->
<div class="addSCBox">
  <el-dialog
  :title="titleText"
  :close-on-click-modal='false'
  :close-on-press-escape='true'
  :visible.sync="dialogVisible"
  width="520px"
  :before-close="handleClose">
    <div class="comDialogBoxCon">
      <el-form ref="form" :rules="rules" placement="right" label-width="80px"
               :model="model">
        <el-form-item label="任务名称：" prop="name">
          <el-input style="width:400px;" v-model="model.name" clearable placeholder='请输入任务名称,在4-25个长度以内'></el-input>
        </el-form-item>
        <el-form-item label="执行时间：" prop="activityTime">
          <el-date-picker
              v-model="model.activityTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              @change="timeFun"
              :picker-options="pickerOptions0"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="类型：" prop="type">
          <el-form-grid>
            <el-radio-group v-model="model.type">
                <el-radio class="radio" :label="0">营销任务</el-radio>
                <el-radio class="radio" :label="1">回访任务</el-radio>
                <el-radio class="radio" :label="3">日常任务</el-radio>
                <el-radio class="radio" :label="2">分享任务</el-radio>
            </el-radio-group>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="指派门店："  prop="shopRangeType">
          <el-radio-group v-model="model.shopRangeType">
            <el-radio :label="0">全部门店</el-radio>
            <el-radio :label="1">指定门店</el-radio>
          </el-radio-group>
          <el-form-grid v-if="model.shopRangeType===1"  size="xxmd">
            <shopSelect @callBack="selectShopBack" :hasShopArr="hasShopArr"></shopSelect>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="简述：" prop="remark">
        <el-input style="width:400px;" type="textarea" v-model="model.remark" placeholder='请输入简述'></el-input>
      </el-form-item>
        <el-form-item label="执行次数：" prop="runType">
          <el-radio-group v-model="model.runType">
            <el-radio class="radio" :label="0">一次性</el-radio>
            <el-radio class="radio" :label="1">每日执行</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="model.type === 2">
          <el-form-item class="is-required" label="分享素材："  prop="materialTitle">
            <el-input style="width:200px;" disabled v-model="model.materialTitle"></el-input>
            <a href="javascript:" @click="selectMaterialShowFun()" class="left-space">
              <span v-if="selectMaterial.id">重新选择</span>
              <span v-else>选择素材</span></a>
          </el-form-item>

        </template>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <ns-button @click="handleClose">取 消</ns-button>
      <ns-button type="primary" :loading="loading" @click="saveFun">确 定</ns-button>
    </span>
  </el-dialog>
  <selectMaterialListModal :callBack="selectMaterialBack" ref="selectDialogDom"></selectMaterialListModal>
</div>
</template>
<script>
import moment from 'moment'
import selectMaterialListModal from './selectMaterialListModal'
import shopSelect from '../components/selectShops'
import { getErrorMsg } from '@/utils/toast'
export default {
  props: {
    callBack: Function
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
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      pickerOptions2: {
        onPick: function (e) {}
      },
      titleText: '新增任务',
      loading: false, // 防重复提交
      dialogImageUrl: '',
      selectMaterial: {
        // 当前选择的素材对象
      },
      hasShopArr: [],
      model: {
        name: '',
        type: 0,
        activityTime: [
          new Date(2000, 10, 10, 10, 10),
          new Date(2000, 10, 11, 10, 10)
        ],
        remark: '',
        shopRangeType: 0,
        runType: 0
      },
      shopList: [],
      dialogVisible: false,
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
      }
    }
  },
  created: function () {
  },
  methods: {
    timeFun (val) {
    },
    selectShopBack (val) {
      this.hasShopArr = val
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
      // 编辑
      if (obj.id) {
        this.titleText = '编辑任务'
        this.model.id = obj.id
        this.model.type = obj.type
        this.model.runType = obj.runType
        this.model.remark = obj.remark
        this.model.name = obj.name
        // this.model.activityTime = [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)]
        this.model.activityTime.push(new Date(obj.startTime))
        this.model.activityTime.push(new Date(obj.endTime))
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
      } else {
        this.titleText = '新增任务'
      }
      this.dialogVisible = true
    },
    // 提交保存
    saveFun () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.model.activityTime.length === 2) {
            this.model.startTime = moment(this.model.activityTime[0]).format(
              'YYYY-MM-DD HH:mm:ss'
            )
            this.model.endTime = moment(this.model.activityTime[1]).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          }
          // 指定门店
          if (this.model.shopRangeType === 1) {
            if (this.hasShopArr.length === 0) {
              this.$notify.error('请至少选择一家门店')
              return
            }
            this.model.targetIds = this.hasShopArr.join(',')
          } else {
            this.model.targetIds = 0
          }
          this.doSave()
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
    handleClose () {
      // 置空已选择门店
      this.hasShopArr = []
      this.dialogVisible = false
      this.$refs.form.resetFields()
    }
  },
  components: {
    selectMaterialListModal,
    shopSelect
  }
}
</script>
<style scoped>
  @import "@theme/variables.pcss";

  .left-space {
    margin-left: var(--default-margin-base);
  }
</style>
