<template>
  <el-dialog :visible.sync="pageRewardSettingShow" width="35%">
    <div class="tipsShowTitle" slot="title">设置</div>
    <div class="tipsShowContent">
      <el-form label-width="4px">
        <el-form-item label="" required>
          <el-checkbox
            v-for="(item, index) in list"
            :label="item.status"
            :key="index"
            :value="formatLabel(item.status)"
            @change="handleCheckChange(item, index)"
            >{{ formatName(item.rewardType) }}</el-checkbox
          >
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <ns-button @click="onCancel">取 消</ns-button>
      <ns-button type="primary" @click="onConfirm">确 定</ns-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      pageRewardSettingShow: false,
      list: [],
      type: ''
    }
  },
  methods: {
    init (item, type) {
      this.pageRewardSettingShow = true
      this.type = type
      this.list = JSON.parse(JSON.stringify(item))
    },
    formatLabel (status) {
      return status === 1
    },
    formatName (rewardType) {
      var name
      switch (rewardType) {
        case 0:
          name = '设置指标'
          break
        case 1:
          name = '修改信息'
          break
        case 2:
          name = '重置密码'
          break
        case 3:
          name = '更换手机'
          break
        case 4:
          name = '工作统计'
          break
        case 5:
          name = '离职'
          break
        case 6:
          name = '修改密码'
          break
        case 7:
          name = '离职'
          break
      }
      return name
    },
    handleCheckChange (item, index) {
      let changItem = {
        rewardType: item.rewardType,
        status: item.status === 1 ? 0 : 1
      }
      this.$set(this.list, index, changItem)
    },
    onConfirm () {
      let index = 0
      this.list.forEach(item => {
        if (item.status === 1) {
          index = index + 1
        }
      })
      if (index > 0) {
        this.$emit('onConfirm', this.list, this.type)
        this.onCancel()
      } else {
        this.$notify.error('最少设置一项')
      }
    },
    onCancel () {
      this.pageRewardSettingShow = false
    }
  }
}
</script>

<style scoped>
.tipsShowTitle {
  padding-top: 5px;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}
.tipsShowContent {
  padding: 16px 0;
  color: #595959;
  font-size: 14px;
}
.ns-warm-cricle {
  display: inline-block;
  text-align: center;
  line-height: 14px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ffaa00;
  color: #fff;
  margin-right: 10px;
}
</style>
