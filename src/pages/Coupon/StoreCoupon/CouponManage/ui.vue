<el-form-item label="优惠卷名称：" required>
            <el-form-grid size="xmd">
              <el-form-item prop="storeCouponTitle" :rules="[{ required: true, message: '请输入优惠券名称', trigger: 'blur' }]">
                <el-input type="text" v-model="model.storeCouponTitle" placeholder="10个字以内"></el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <div v-show="model.storeCouponType===1">
            <el-form-item label="面额：" required>
              <el-form-grid size="xmd">
                <el-form-item prop="storeCouponValue">
                  <el-input v-model="model.storeCouponValue" type="number"><span slot="append">元</span></el-input>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
          </div>
          <div v-show="model.storeCouponType===2">
            <el-form-item label="折扣：" required>
              <el-form-grid size="xmd">
                <el-form-item prop="storeCouponValue">
                  <el-input v-model="model.storeCouponValue" type="number"><span slot="append">折</span></el-input>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
          </div>
          <div v-show="model.storeCouponType===3">
            <el-form-item label="兑换物品：" required>
              <el-form-grid>
                <el-form-item prop="giftJson">
                  <ns-goods-select v-model="model.giftJson"></ns-goods-select>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
          </div>
          <el-form-item label="发行量：" required>
            <el-radio-group v-model="model.issueAmountType">
              <el-radio :label="0">不限</el-radio>
              <el-radio :label="1">
                <el-form-grid size="md">
                  <el-form-item prop="maxIssueAmount">
                    <el-input v-model="model.maxIssueAmount" type="number"><span
                      slot="append">张</span></el-input>
                  </el-form-item>
                </el-form-grid>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="有效时间：" required>
            <el-form-grid>
              <el-form-item>
                <el-radio-group v-model="model.dateValidType">
                  <el-radio :label="0">固定时间</el-radio>
                  <el-radio :label="1">相对时间</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-show="model.dateValidType===0">
                <el-form-grid size="xmd">
                  <el-form-item prop="startDateTime">
                    <el-date-picker type="datetime" :picker-options="pickerOptions" placeholder="开始日期" v-model="model.startDateTime"></el-date-picker>
                  </el-form-item>
                </el-form-grid>
                <el-form-grid>至</el-form-grid>
                <el-form-grid size="xmd">
                  <el-form-item prop="endDateTime">
                    <el-date-picker type="datetime" :picker-options="pickerOptions" placeholder="结束日期" v-model="model.endDateTime"></el-date-picker>
                  </el-form-item>
                </el-form-grid>
              </el-form-item>
              <el-form-item v-show="model.dateValidType===1">
                <el-form-grid>领取后第</el-form-grid>
                <el-form-grid size="xs">
                  <el-form-item prop="afterGetValidDays">
                    <el-input v-model="model.afterGetValidDays"></el-input>
                  </el-form-item>
                </el-form-grid>
                <el-form-grid>天有效，有效期</el-form-grid>
                <el-form-grid size="xs">
                  <el-form-item prop="validDays">
                    <el-input v-model="model.validDays"><span slot="append">天</span></el-input>
                  </el-form-item>
                </el-form-grid>
              </el-form-item>
              <el-form-item v-show="model.dateValidType===1">
                <el-form-grid>有效截止日期</el-form-grid>
                <el-form-grid size="xmd">
                  <el-form-item prop="endDateTime">
                    <el-date-picker type="datetime" :picker-options="pickerOptions" placeholder="选择日期" v-model="model.endDateTime"></el-date-picker>
                  </el-form-item>
                </el-form-grid>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="使用条件：">
            <el-form-grid size="xmd">
              <el-radio-group v-model="model.useConditionType">
                <el-form-item>
                  <el-radio :label="0">无门槛</el-radio>
                </el-form-item>
                <el-form-item>
                  <el-radio :label="1" v-show="model.storeCouponType === 1 || model.storeCouponType === 2">
                    <el-form-grid>订单满</el-form-grid>
                    <el-form-grid size="xs">
                      <el-form-item prop="tradeAmount">
                        <el-input v-model="model.tradeAmount"><span slot="append">元</span></el-input>
                      </el-form-item></el-form-grid>
                    <el-form-grid size="xxs">
                      <el-select v-model="model.logic">
                        <el-option label="且" :value="'and'"></el-option>
                        <el-option label="或" :value="'or'"></el-option>
                      </el-select>
                    </el-form-grid>
                    <el-form-grid>订单商品满</el-form-grid>
                    <el-form-grid size="xs">
                      <el-form-item prop="itemAmount">
                        <el-input v-model="model.itemAmount"><span slot="append">件</span></el-input>
                      </el-form-item>
                    </el-form-grid>
                  </el-radio>
                </el-form-item>
                <el-form-item>
                  <el-radio :label="2" v-show="model.storeCouponType === 1 || model.storeCouponType === 2">
                    <el-form-grid>同一订单同一商品第</el-form-grid>
                    <el-form-grid size="xs">
                      <el-form-item prop="itemCount">
                        <el-input v-model="model.itemCount"><span slot="append">件</span></el-input>
                      </el-form-item>
                    </el-form-grid>
                    <el-form-grid></el-form-grid>
                  </el-radio>
                </el-form-item>
                <el-form-item v-show="model.storeCouponType === 3">
                  <el-radio :label="3">
                    <el-form-grid size="xs">加
                      <el-form-item prop="addAmount">
                        <el-input v-model="model.addAmount"><span slot="append">元</span></el-input>
                      </el-form-item>
                    </el-form-grid>可用
                  </el-radio>
                </el-form-item>
                <el-form-item v-show="model.storeCouponType === 3">
                  <el-radio :label="4">
                    <el-form-grid>买指定商品可用
                      <el-form-item prop="itemConditionJson">
                        <ns-goods-select v-model="model.itemConditionJson"></ns-goods-select>
                      </el-form-item>
                    </el-form-grid>
                  </el-radio>
                </el-form-item>
              </el-radio-group>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="筛选商品：" v-show="model.storeCouponType === 1 || model.storeCouponType === 2">
            <el-form-grid>
              <el-form-item>
                <el-radio-group v-model="model.itemRangeType">
                  <el-radio :label="0">不限</el-radio>
                  <el-radio :label="1">包含指定商品</el-radio>
                  <el-radio :label="2">排除指定商品</el-radio>
                </el-radio-group>
              </el-form-item>
              <div v-show="model.itemRangeType!==0">
                <el-form-item>
                  <el-form-grid size="xs">
                    <el-select v-model="model.itemContainType">
                      <el-option label="全部包含" :value="0"></el-option>
                      <el-option label="只包含" :value="1"></el-option>
                      <el-option label="部分包含" :value="2"></el-option>
                    </el-select>
                  </el-form-grid>
                </el-form-item>
                <el-form-item>
                  <el-form-grid>
                    <ns-goods-select v-model="model.itemConditionJson"></ns-goods-select>
                  </el-form-grid>
                </el-form-item>
              </div>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="指定门店：">
            <el-form-grid>
              <el-form-item>
                <el-radio-group v-model="model.shopRangeType">
                  <el-radio :label="0">不限</el-radio>
                  <el-radio :label="1">仅限所选门店</el-radio>
                  <el-radio :label="2">排除所选门店</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-show="model.shopRangeType !== 0">
                <el-form-grid>
                  <ns-shop-select v-model="shopIds"></ns-shop-select>
                </el-form-grid>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="单数限制：">
            <el-radio-group v-model="model.tradeCountValidType">
              <el-radio :label="0">不限</el-radio>
              <el-radio :label="1">
                <el-form-grid>第</el-form-grid>
                <el-form-grid size="xxs">
                  <el-form-item prop="tradeCountValid">
                    <el-input v-model="model.tradeCountValid"></el-input>
                  </el-form-item>
                </el-form-grid>
                <el-form-grid>单可用</el-form-grid>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="可用时段：">
            <el-radio-group v-model="model.validTimeType">
              <el-radio :label="0">全部时段</el-radio>
              <el-radio :label="1">部分时段</el-radio>
            </el-radio-group>
            <el-form-grid v-if="model.validTimeType===1" size="xxmd">
              <el-form-item prop="validTime">
                <el-time-picker is-range clearable arrow-control format="HH:mm:ss" v-model="model.validTime"
                                range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间">
                </el-time-picker>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="不可用日期：">
            <el-radio-group v-model="model.invalidDateType">
              <el-radio :label="0">不限制</el-radio>
              <el-radio :label="1">指定日期</el-radio>
            </el-radio-group>
            <el-form-grid v-if="model.invalidDateType===1" size="xxmd">
              <el-form-item prop="invalidDateList">
                <el-date-picker type="dates" v-model="model.invalidDateList" placeholder="选择一个或多个日期"></el-date-picker>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="领券限制：">
            <el-form-grid size="xmd">
              <el-form-item prop="maxIssueCount">
                <el-input v-model="model.maxIssueCount" type="number"><span slot="append">张</span></el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="使用说明：">
            <el-form-grid size="xlg">
              <el-form-item prop="remark">
                <el-input type="textarea" v-model="model.remark"></el-input>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
