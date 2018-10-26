<template>
  <div class="template-page">
    <ns-table-integral-activity ref="table" @update-activity="updateActivity" @add-activity="addActivity"></ns-table-integral-activity>
    <el-dialog :title="title" :visible.sync="visible"   :modal-append-to-body ="false"
               :close-on-click-modal = "false"  :before-close="onClose" width="700px" height="520px">
      <el-form ref="form" placement="right" label-width="100px" :model="activity" :rules="rules">

        <el-form-item label="活动类型：" required>
          <el-form-grid>
            <el-form-item prop = "activityType" >
              <el-radio-group v-model="activity.activityType" @change="change">
                <el-radio :label="0">交易送积分</el-radio>
                <el-radio :label="1">互动赚积分</el-radio>
                <el-radio :label="2">互动花积分</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="活动名称：" required>
          <el-form-grid size="xmd">
            <el-form-item prop = "activityName" >
              <el-input type="text"
                        v-model.trim = "activity.activityName"
                        placeholder="请输入活动名称">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="开始时间：" required>
          <el-form-grid size="xmd">
            <el-form-item prop = "startTime" >
              <el-date-picker v-model="activity.startTime" popper-class="date-hideNow" type="datetime" placeholder="选择开始时间" :picker-options="pickerOptions0" @change="startChange"></el-date-picker>
            </el-form-item>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="结束时间：" required>
          <el-form-grid size="xmd">
            <el-form-item prop = "endTime" >
              <el-date-picker v-model="activity.endTime" popper-class="date-hideNow" type="datetime" placeholder="选择结束时间" :picker-options="pickerOptions1" @change="endChange"></el-date-picker>
            </el-form-item>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="活动频率：" required>
          <el-form-grid>
            <el-form-item prop = "activityTimes" >
              <el-radio-group v-model="activity.activityTimes">
                <el-radio :label="0">一次性</el-radio>
                <el-radio :label="1">每周</el-radio>
                <el-radio :label="2">每月</el-radio>
                <el-radio :label="3">每年</el-radio>
              </el-radio-group>
              <template v-if="activity.activityTimes == 1">
                <el-form-grid size="xs">
                  <el-select v-model="weekValue" placeholder="请选择">
                    <el-option
                      v-for="indexWeek in week"
                      :key="indexWeek.value"
                      :label="indexWeek.label"
                      :value="indexWeek.value">
                    </el-option>
                  </el-select>
                </el-form-grid>
              </template>
              <template v-if="activity.activityTimes == 2">
                <el-form-grid size="xs">
                  <el-select v-model="dayValue" placeholder="请选择">
                    <el-option
                      v-for="indexWeek in day"
                      :key="indexWeek.value"
                      :label="indexWeek.label"
                      :value="indexWeek.value">
                    </el-option>
                  </el-select>
                </el-form-grid>
              </template>
              <template v-if="activity.activityTimes == 3">
                <el-form-grid size="sm">
                  <el-date-picker
                    v-model="monthDay"
                    type="dateday"
                    placeholder="选择月日" :clearable="false">
                  </el-date-picker>
                </el-form-grid>
              </template>
            </el-form-item>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="目标人群：" required>
          <el-form-grid>
            <el-form-item prop = "isAllCrowd" >
              <el-radio-group v-model="activity.isAllCrowd">
                <el-radio :label="1">所有人</el-radio>
                <el-radio :label="0">定向人群</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="活动规则：" required>
          <el-form-grid>
            <template v-if="activity.activityType == 0">
                每笔交易
                <el-form-grid size="xs">
                  <el-select  v-model="activity.tradeRlue" @change="tradeChange">
                    <el-option label="倍送" value="0"></el-option>
                    <el-option label="多送" value="1"></el-option>
                  </el-select>
                </el-form-grid>
                <el-form-item prop = "tradeIntegral"  class="el-inline-block">
                  <el-form-grid size="sm">
                    <el-input placeholder="请输入" maxlength="12" class="text-right" v-model.number="activity.tradeIntegral" width="20px">
                      <template slot="append">{{tradeTitle}}</template>
                    </el-input>
                  </el-form-grid>
                </el-form-item>
            </template>
            <template v-if="activity.activityType == 1">
                每个赚积分的活动
                <el-form-grid size="xs">
                  <el-select  v-model="activity.getRlue" @change="getChange">
                    <el-option label="倍送" value="0"></el-option>
                    <el-option label="多送" value="1"></el-option>
                  </el-select>
                </el-form-grid>
                <el-form-item class="el-inline-block" prop = "getIntegral">
                  <el-form-grid size="sm">
                    <el-input placeholder="请输入" class="text-right" maxlength="12" v-model="activity.getIntegral" width="20px">
                      <template slot="append">{{getTitle}}</template>
                    </el-input>
                  </el-form-grid>
                </el-form-item>
            </template>
            <template v-if="activity.activityType == 2">
                每个花积分的活动
                <el-form-grid size="xs">
                  <el-select  v-model="activity.putRlue" @change="putChange">
                    <el-option label="折扣" value="0"></el-option>
                    <el-option label="少花" value="1"></el-option>
                  </el-select>
                </el-form-grid>
                <el-form-item prop = "putIntegral" class="el-inline-block">
                  <el-form-grid size="sm">
                    <el-input placeholder="请输入" class="text-right" maxlength="12" v-model="activity.putIntegral" width="20px">
                      <template slot="append">{{putTitle}}</template>
                    </el-input>
                  </el-form-grid>
                </el-form-item>
            </template>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="活动条件：" required>
          <el-form-grid>
            <template v-if="activity.activityType == 0">
              <el-form-item prop = "checked" class = "el-inline-block">
                <el-checkbox-group v-model="activity.checked">
                  <el-checkbox label="1">
                    <el-form-item class="el-inline-block"  prop = "tradePrice" label-width="0">
                      <el-form-grid>每笔交易满</el-form-grid>
                      <el-form-grid size="sm"><el-input class="text-right" maxlength="12" v-model.number = "activity.tradePrice">
                        <template slot="append">元</template>
                      </el-input></el-form-grid>
                    </el-form-item>
                  </el-checkbox>
                  <br>
                  <el-checkbox label="2" >
                    <el-form-item class="el-inline-block"  prop = "tradeNum" label-width="0">
                      <el-form-grid>单笔交易满</el-form-grid>
                    <el-form-grid size="sm"><el-input class="text-right" maxlength="12" v-model.number = "activity.tradeNum">
                      <template slot="append">件</template>
                    </el-input>
                    </el-form-grid>
                    </el-form-item>
                  </el-checkbox>
                  <el-form-grid>
                    <el-tooltip content="选择多个条件为“并且”关系" placement="right" effect="light"><i class="el-icon-info"></i></el-tooltip>
                  </el-form-grid>
                  <br>
                  <el-checkbox label="3">
                    <el-form-item class="el-inline-block" prop="shopSelect" label-width="0">
                      <el-form-grid>
                        订单中必须
                      </el-form-grid>
                    </el-form-item>
                  </el-checkbox>
                  <el-form-item class="el-inline-block">
                    <el-form-grid size="sm">
                      <el-select  v-model="activity.shopSelect">
                        <el-option label="全部包含" value="0"></el-option>
                        <el-option label="部分包含" value="1"></el-option>
                      </el-select>
                    </el-form-grid>
                  </el-form-item>
                  <el-form-item class="el-inline-block">
                    <el-form-grid size="xxs">以下商品</el-form-grid>
                  </el-form-item>
                </el-checkbox-group>
                <el-form-item prop="items">
                  <ns-goods-select v-model="activity.items"></ns-goods-select>
                </el-form-item>
              </el-form-item>
            </template>

            <template v-if="activity.activityType == 1">
              <el-form-item   prop = "getChecked" class="el-form-validate__unHide">
                <el-checkbox-group v-model="activity.getChecked">
                  <el-checkbox label="1">
                    <el-form-item class="el-inline-block"  prop = "getNum" label-width="0">
                      <el-form-grid>
                        每人每天每个活动最多赠送
                      </el-form-grid>
                      <el-form-grid size="sm"><el-input class="text-right" maxlength="12" v-model.number = "activity.getNum">
                        <template slot="append">次</template>
                      </el-input></el-form-grid>
                    </el-form-item>
                  </el-checkbox>
                  <br>
                  <el-checkbox label="2" >
                    <el-form-item class="el-inline-block"  prop = "getGive" maxlength="12" label-width="0">
                      <el-form-grid>
                        每人每天最高赠送额度
                      </el-form-grid>
                      <el-form-grid size="sm"><el-input class="text-right" maxlength="12" v-model.number = "activity.getGive">
                        <template slot="append">积分</template>
                      </el-input>
                      </el-form-grid>
                    </el-form-item>
                  </el-checkbox>
                  <br>
                  <el-checkbox label="3" >
                  <el-form-item class="el-inline-block"  prop = "getTop" label-width="0">
                    <el-form-grid>
                      每人总计最高赠送额度
                    </el-form-grid>
                    <el-form-grid size="sm"><el-input class="text-right" maxlength="12" v-model.number = "activity.getTop">
                      <template slot="append">积分</template>
                    </el-input>
                    </el-form-grid>
                  </el-form-item>
                  </el-checkbox>
                  <el-form-grid>
                    <el-tooltip content="选择多个条件为“并且”关系" placement="right" effect="light"><i class="el-icon-info"></i></el-tooltip>
                  </el-form-grid>
                </el-checkbox-group>
              </el-form-item>
            </template>

            <template v-if="activity.activityType == 2">
              <el-form-item prop = "putChecked" class="el-form-validate__unHide">
                <el-checkbox-group v-model="activity.putChecked">
                  <el-checkbox label="1">
                    <el-form-item class="el-inline-block"  prop = "putNum" label-width="0">
                      <el-form-grid>
                        每人每天每个活动最多优惠
                      </el-form-grid>
                      <el-form-grid size="sm"><el-input class="text-right" maxlength="12" v-model.number = "activity.putNum">
                        <template slot="append">次</template>
                      </el-input></el-form-grid>
                    </el-form-item>
                  </el-checkbox>
                  <br>
                  <el-checkbox label="2" >
                    <el-form-item class="el-inline-block"  prop = "putGive" label-width="0">
                      <el-form-grid>
                        每人每天最高优惠额度
                      </el-form-grid>
                      <el-form-grid size="sm"><el-input class="text-right" maxlength="12" v-model.number = "activity.putGive">
                        <template slot="append">积分</template>
                      </el-input>
                      </el-form-grid>
                    </el-form-item>
                  </el-checkbox>
                  <br>
                  <el-checkbox label="3" >
                    <el-form-item class="el-inline-block"  prop = "putTop" label-width="0">
                      <el-form-grid>
                        每人总计最高优惠额度
                      </el-form-grid>
                      <el-form-grid size="sm"><el-input class="text-right" maxlength="12" v-model.number = "activity.putTop">
                        <template slot="append">积分</template>
                      </el-input>
                      </el-form-grid>
                    </el-form-item>
                  </el-checkbox>
                  <el-form-grid>
                    <el-tooltip content="选择多个条件为“并且”关系" placement="right" effect="light"><i class="el-icon-info"></i></el-tooltip>
                  </el-form-grid>
                </el-checkbox-group>
              </el-form-item>
            </template>

          </el-form-grid>
        </el-form-item>

        <template v-if="activity.activityType == 0">
          <el-form-item label="活动范围：">
            <el-form-grid>
              <el-form-item>
                  <ns-shop-select v-model="shops"></ns-shop-select>
                <div class="tmp-tips text-info"><i class="el-icon-info"></i>不选则默认全部店铺。</div>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
        </template>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onClose()">取消</ns-button>
        <ns-save @click="onSave()" :loading="saveLoading"></ns-save>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import index from './src/index'
  import NsTableIntegralActivity from './NsTableIntegralActivity'
  import NsShopSelect from 'components/NsShopSelect'
  import NsGoodsSelect from 'components/NsGoodsSelect'
  index.components = {
    NsTableIntegralActivity,
    NsShopSelect,
    NsGoodsSelect
  }
  export default index
</script>
