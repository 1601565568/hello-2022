<template>
  <div>
    <div class="Tips">通过一客一码添加导购成功后，系统根据设置自动发放奖励</div>
    <el-form
      label-width="100px"
      label-position="left"
      :model="model"
      size="medium"
      class="normal-from"
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item class="larger-item" label="奖励机制">
        <el-switch
          active-color="#0091FA"
          inactive-color="#8C8C8C"
          v-model="model.type"
        >
        </el-switch>
      </el-form-item>
      <template v-if="model.type">
        <el-form-item class="larger-item" label="发放设置" prop="prizeType">
          <el-select v-model="model.prizeType" placeholder="请选择奖励">
            <el-option
              v-for="item in prizeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-table ref="table" class="new-table_border" :data="model.setList">
            <el-table-column type="default" label="助力人数" :sortable="false">
              <template slot-scope="scope">
                <el-input-number
                  style="width:118px;"
                  size="medium"
                  v-model="scope.row.exchangeStock"
                  controls-position="right"
                  :min="1"
                  :step="1"
                  step-strictly
                  controls
                  onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column
              type="default"
              label="助力人数"
              :sortable="false"
              class="el-form__change"
            >
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.prizeType"
                  placeholder="请选择奖励"
                >
                  <el-option
                    v-for="item in prizeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column type="default" label="奖励内容" :sortable="false">
              <template slot-scope="scope">
                <div class="coupon">
                  <p v-if="scope.row.coupon_id">请选择优惠券</p>
                  <p v-else class="text">{{ scope.row.coupon_id }}1111</p>
                  <Icon type="couponicon" />
                </div>
              </template>
            </el-table-column>
            <el-table-column type="default" label="剩余数量" :sortable="false">
              <template>
                <p>123123123</p>
              </template></el-table-column
            >
            <el-table-column type="default" label="发放类型" :sortable="false">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.aaa"
                  maxlength="10"
                  class="appended-table-setting__input"
                  placeholder=""
                  type="number"
                  :disabled="isDisabled"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>
<script>
import ElInputNumber from '@nascent/nui/lib/input-number'
export default {
  components: { ElInputNumber },
  data () {
    return {
      model: {
        type: true,
        effectiveCycle: 1,
        prizeType: 1,
        setList: [{ exchangeStock: 1, coupon_id: '', aaa: '' }]
      },
      rules: {
        prizeType: [
          {
            required: true,
            message: '请选择发放类型',
            trigger: ['blur', 'change']
          }
        ]
      },
      prizeList: [
        {
          label: '普通奖励',
          value: 1
        }
      ]
    }
  }
}
</script>
<style scoped>
@import '../styles/reset.css';
.Tips {
  padding: 0 16px;
  line-height: 40px;
  color: #595959;
  background: #f2f9fe;
  height: 40px;
  border-radius: 2px;
  margin-bottom: 16px;
}
.coupon {
  width: 118px;
  height: 36px;
  border: 1px solid #d9d9d9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 3px;
  border: 1px solid #d9d9d9;
  padding: 0 5px;
}
</style>
