<template>
  <el-dialog :visible.sync="pageRewardSettingShow" width="35%">
    <div class="tipsShowTitle" slot="title">总收益</div>
    <div class="tipsShowContent">
      <el-form label-width="100px">
        <el-form-item label="设置收益来源：" required>
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
  props: {
    rewardSettingList: {
      type: Array
    }
  },
  data () {
    return {
      pageRewardSettingShow: false,
      list: []
    }
  },
  methods: {
    init () {
      this.pageRewardSettingShow = true
      this.list = JSON.parse(JSON.stringify(this.rewardSettingList))
    },
    formatLabel (status) {
      return status === 1
    },
    formatName (rewardType) {
      var name
      switch (rewardType) {
        case 0:
          name = '销售提成'
          break
        case 1:
          name = '招募会员奖励'
          break
        case 2:
          name = '加好友奖励'
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
        this.$emit('onConfirm', this.list)
        this.onCancel()
      } else {
        this.$notify.error('最少设置一项数据来源')
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
