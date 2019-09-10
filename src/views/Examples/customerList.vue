<template>
  <div>
    <ns-button type="primary" @click="dialogVisible = true">详情</ns-button>
    <el-dialog
      title="详情"
      :visible.sync="dialogVisible"
      width="900px" height="500px" class="dialog-container">
      <div class="dialog-container__msg">
        <div class="dialog-avatar">
          <el-image mode="aspectFit" src="https://img.alicdn.com/imgextra/i4/645690921/O1CN01Q1rjbi1IfrITTcm0O_!!645690921.jpg_430x430q90.jpg"
                    width="80" height="80" bgColor="#FFF" circle="true"/>
          <div class="dialog-avatar__figure">
            <!-- 男生图标-->
            <!--<i class="iconfont icon-nan1 dialog-avatar__figure--male"></i>-->
            <!-- 女生图标-->
            <i class="iconfont icon-nv1 dialog-avatar__figure--female"></i>
          </div>
          <div class="dialog-avatar__level">
            V6会员
          </div>
        </div>
        <el-form label-width="100px">
          <el-form-item label="姓名：" class="el-inline-block">
            <el-form-grid size="xs">李晨歌</el-form-grid>
          </el-form-item>
          <el-form-item label="会员折扣：" class="el-inline-block dialog-favorable">
            <el-form-grid size="xs">
              <span>8折</span>
              <i class="iconfont icon-icon_discount dialog-favorable__text dialog-favorable__text--discount"></i>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="积分2：" class="el-inline-block dialog-favorable">
            <el-form-grid size="xs">
              <span>2460</span>
              <i class="iconfont icon-icon_integration dialog-favorable__text dialog-favorable__text--integration"></i>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="积分5：" class="el-inline-block dialog-favorable">
            <el-form-grid size="xs">
              <span>1857</span>
              <i class="iconfont icon-icon_integration dialog-favorable__text dialog-favorable__text--integration"></i>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="手机：" class="el-inline-block">
            <el-form-grid size="xs">18850568836</el-form-grid>
          </el-form-item>
          <el-form-item label="积分1：" class="el-inline-block dialog-favorable">
            <el-form-grid size="xs">
              <span>3998</span>
              <i class="iconfont icon-icon_integration dialog-favorable__text dialog-favorable__text--integration"></i>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="积分3：" class="el-inline-block dialog-favorable">
            <el-form-grid size="xs">
              <span>2120</span>
              <i class="iconfont icon-icon_integration dialog-favorable__text dialog-favorable__text--integration"></i>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="" class="el-inline-block dialog-favorable">
            <el-form-grid size="xs">
            </el-form-grid>
          </el-form-item>
          <el-form-item label="备注：" class="el-inline-block">
            <el-form-grid size="xs">
              <span v-if="remark.length<16">
                {{remark}}
              </span>
              <div v-else>
                <el-tooltip :content="remark" placement="bottom">
                  <div slot="content">{{remark}}</div>
                  <span class="dialog-hidden">{{remark}}</span>
                </el-tooltip>
              </div>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="优惠券：" class="el-inline-block dialog-favorable">
            <el-form-grid size="xs">
              <span>100</span>
              <i class="iconfont icon-icon_coupon dialog-favorable__text dialog-favorable__text--coupon"></i>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="积分4：" class="el-inline-block dialog-favorable">
            <el-form-grid size="xs">
              <span>1257</span>
              <i class="iconfont icon-icon_integration dialog-favorable__text dialog-favorable__text--integration"></i>
            </el-form-grid>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-container__tabs">
        <el-tabs v-model="selectedTabName" @tab-click="handleClick">
          <el-tab-pane label="基础信息" name="basic">
            <div class="dialog-basic">
              <div class="dialog-basic__title">基础信息</div>
              <el-form label-width="180px" class="dialog-basic__form">
                <el-form-item label="生日：" class="el-inline-block">
                  <el-form-grid size="xxmd">1994-08-07</el-form-grid>
                </el-form-item>
                <el-form-item label="公众号状态：" class="el-inline-block">
                  <el-form-grid size="xxmd">已关注</el-form-grid>
                </el-form-item>
                <el-form-item label="会员卡号：" class="el-inline-block">
                  <el-form-grid size="xxmd">12346647323683638</el-form-grid>
                </el-form-item>
                <el-form-item label="性别：" class="el-inline-block">
                  <el-form-grid size="xxmd">女</el-form-grid>
                </el-form-item>
                <el-form-item label="开卡时间：" class="el-inline-block">
                  <el-form-grid size="xxmd">2019-08-07 10:07:09</el-form-grid>
                </el-form-item>
                <el-form-item label="Email：" class="el-inline-block">
                  <el-form-grid size="xxmd">Bumblebee@yeah.net</el-form-grid>
                </el-form-item>
                <el-form-item label="所在地区：" class="el-inline-block">
                  <el-form-grid size="xxmd">福建厦门市湖里区</el-form-grid>
                </el-form-item>
                <el-form-item label="详细地址：" class="el-inline-block">
                  <el-form-grid size="xxmd">金山街道软件园二期观日路22号401
                  </el-form-grid>
                </el-form-item>
              </el-form>
            </div>
            <div class="dialog-basic">
              <div class="dialog-basic__title">自定义属性</div>
              <el-form label-width="180px" class="dialog-basic__form">
                <el-form-item label="希望在哪看到护肤小知识：" class="el-inline-block">
                  <el-form-grid size="xxmd">1994-08-07</el-form-grid>
                </el-form-item>
                <el-form-item label="公众号状态：" class="el-inline-block">
                  <el-form-grid size="xxmd">已关注</el-form-grid>
                </el-form-item>
                <el-form-item label="会员卡号：" class="el-inline-block">
                  <el-form-grid size="xxmd">12346647323683638</el-form-grid>
                </el-form-item>
                <el-form-item label="性别：" class="el-inline-block">
                  <el-form-grid size="xxmd">女</el-form-grid>
                </el-form-item>
                <el-form-item label="开卡时间：" class="el-inline-block">
                  <el-form-grid size="xxmd">2019-08-07 10:07:09</el-form-grid>
                </el-form-item>
                <el-form-item label="Email：" class="el-inline-block">
                  <el-form-grid size="xxmd">Bumblebee@yeah.net</el-form-grid>
                </el-form-item>
                <el-form-item label="所在地区：" class="el-inline-block">
                  <el-form-grid size="xxmd">福建厦门市湖里区</el-form-grid>
                </el-form-item>
                <el-form-item label="详细地址：" class="el-inline-block">
                  <el-form-grid size="xxmd">金山街道软件园二期观日路22号401
                  </el-form-grid>
                </el-form-item>
              </el-form>
            </div>
            <div class="dialog-basic">
              <div class="dialog-basic__title">基础信息</div>
              <el-form label-width="180px" class="dialog-basic__form">
                <el-form-item label="生日：" class="el-inline-block">
                  <el-form-grid size="xxmd">1994-08-07</el-form-grid>
                </el-form-item>
                <el-form-item label="公众号状态：" class="el-inline-block">
                  <el-form-grid size="xxmd">已关注</el-form-grid>
                </el-form-item>
                <el-form-item label="会员卡号：" class="el-inline-block">
                  <el-form-grid size="xxmd">12346647323683638</el-form-grid>
                </el-form-item>
                <el-form-item label="性别：" class="el-inline-block">
                  <el-form-grid size="xxmd">女</el-form-grid>
                </el-form-item>
                <el-form-item label="开卡时间：" class="el-inline-block">
                  <el-form-grid size="xxmd">2019-08-07 10:07:09</el-form-grid>
                </el-form-item>
                <el-form-item label="Email：" class="el-inline-block">
                  <el-form-grid size="xxmd">Bumblebee@yeah.net</el-form-grid>
                </el-form-item>
                <el-form-item label="所在地区：" class="el-inline-block">
                  <el-form-grid size="xxmd">福建厦门市湖里区</el-form-grid>
                </el-form-item>
                <el-form-item label="详细地址：" class="el-inline-block">
                  <el-form-grid size="xxmd">金山街道软件园二期观日路22号401
                  </el-form-grid>
                </el-form-item>
              </el-form>
            </div>
            <div class="dialog-basic">
              <div class="dialog-basic__title">自定义属性</div>
              <el-form label-width="180px" class="dialog-basic__form">
                <el-form-item label="希望在哪看到护肤小知识：" class="el-inline-block">
                  <el-form-grid size="xxmd">1994-08-07</el-form-grid>
                </el-form-item>
                <el-form-item label="公众号状态：" class="el-inline-block">
                  <el-form-grid size="xxmd">已关注</el-form-grid>
                </el-form-item>
                <el-form-item label="会员卡号：" class="el-inline-block">
                  <el-form-grid size="xxmd">12346647323683638</el-form-grid>
                </el-form-item>
                <el-form-item label="性别：" class="el-inline-block">
                  <el-form-grid size="xxmd">女</el-form-grid>
                </el-form-item>
                <el-form-item label="开卡时间：" class="el-inline-block">
                  <el-form-grid size="xxmd">2019-08-07 10:07:09</el-form-grid>
                </el-form-item>
                <el-form-item label="Email：" class="el-inline-block">
                  <el-form-grid size="xxmd">Bumblebee@yeah.net</el-form-grid>
                </el-form-item>
                <el-form-item label="所在地区：" class="el-inline-block">
                  <el-form-grid size="xxmd">福建厦门市湖里区</el-form-grid>
                </el-form-item>
                <el-form-item label="详细地址：" class="el-inline-block">
                  <el-form-grid size="xxmd">金山街道软件园二期观日路22号401
                  </el-form-grid>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="积分1信息" name="integralone">
            <div class="dialog-integral">
              <el-form class="dialog-integral__form">
                <el-form-item class="dialog-formitem">
                  <el-form-grid class="dialog-formitem__choice">
                    请选择：
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-date-picker type="datetime" placeholder="请选择" v-model="startDateTime">
                    </el-date-picker>
                  </el-form-grid>
                  <el-form-grid>
                    -
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-date-picker type="datetime" placeholder="请选择" v-model="endDateTime"></el-date-picker>
                  </el-form-grid>
                  <el-form-grid class="dialog-formitem__type">
                    变更类型：
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-select v-model="value3" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value3"
                        :label="item.label"
                        :value="item.value3">
                      </el-option>
                    </el-select>
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-select v-model="value3" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value3"
                        :label="item.label"
                        :value="item.value3">
                      </el-option>
                    </el-select>
                  </el-form-grid>
                  <el-form-grid>
                    <ns-button type="primary">搜索</ns-button>
                  </el-form-grid>
                </el-form-item>
              </el-form>
              <el-table ref="table" :data="tableData" stripe>
                <el-table-column prop="integral" label="满减积分" align="center">
                </el-table-column>
                <el-table-column prop="time" label="变更时间" align="center" :width="250">
                </el-table-column>
                <el-table-column prop="type" label="类型" align="center">
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="交易信息" name="transaction">
            <div class="dialog-transaction">
              <el-form class="dialog-transaction__form">
                <el-form-item label="当前客户累计交易额（元）">
                  <el-popover
                    placement="bottom"
                    width="200"
                    trigger="hover"
                    content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                    <i class="xiangqingyiwen-icon icon-base icon-xiangqingyiwen dialog-doubt" slot="reference"></i>
                  </el-popover>
                </el-form-item>
                <el-form-item class="dialog-merchandise">
                  <el-form-grid class="dialog-merchandise__money">¥360.00</el-form-grid>
                  <el-form-grid class="dialog-merchandise__frequency">（交易次数：1）</el-form-grid>
                </el-form-item>
                <el-form-item class="dialog-detail">
                  <el-form-grid size="md">
                    回购周期：未回购
                    <el-popover
                      placement="bottom"
                      width="200"
                      trigger="hover"
                      content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                      <i class="xiangqingyiwen-icon icon-base icon-xiangqingyiwen dialog-doubt" slot="reference"></i>
                    </el-popover>
                  </el-form-grid>
                  <el-form-grid size="md">
                    笔单价：360.00元
                    <el-popover
                      placement="bottom"
                      width="200"
                      trigger="hover"
                      content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                      <i class="xiangqingyiwen-icon icon-base icon-xiangqingyiwen dialog-doubt" slot="reference"></i>
                    </el-popover>
                  </el-form-grid>
                  <el-form-grid size="md">
                    连带率：0件
                    <el-popover
                      placement="bottom"
                      width="200"
                      trigger="hover"
                      content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                      <i class="xiangqingyiwen-icon icon-base icon-xiangqingyiwen dialog-doubt" slot="reference"></i>
                    </el-popover>
                  </el-form-grid>
                </el-form-item>
                <el-form-item label="最近交易：">
                  <el-form-grid size="xxlg">
                    <el-popover
                      placement="bottom"
                      width="200"
                      trigger="hover"
                      content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                      <i class="xiangqingyiwen-icon icon-base icon-xiangqingyiwen dialog-doubt" slot="reference"></i>
                    </el-popover>
                  </el-form-grid>
                  <el-form-grid size="xmd" class="dialog-checkbtn">
                    <ns-button type="text">查看历史</ns-button>
                  </el-form-grid>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="积分2信息" name="integraltwo">
            <div class="dialog-integral">
              <el-form class="dialog-integral__form">
                <el-form-item class="dialog-formitem">
                  <el-form-grid class="dialog-formitem__choice">
                    请选择：
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-date-picker type="datetime" placeholder="请选择" v-model="startDateTime">
                    </el-date-picker>
                  </el-form-grid>
                  <el-form-grid>
                    -
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-date-picker type="datetime" placeholder="请选择" v-model="endDateTime"></el-date-picker>
                  </el-form-grid>
                  <el-form-grid class="dialog-formitem__type">
                    变更类型：
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-select v-model="value3" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value3"
                        :label="item.label"
                        :value="item.value3">
                      </el-option>
                    </el-select>
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-select v-model="value3" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value3"
                        :label="item.label"
                        :value="item.value3">
                      </el-option>
                    </el-select>
                  </el-form-grid>
                  <el-form-grid>
                    <ns-button type="primary">搜索</ns-button>
                  </el-form-grid>
                </el-form-item>
              </el-form>
              <el-table ref="table" :data="tableData" stripe>
                <el-table-column prop="integral" label="满减积分" align="center">
                </el-table-column>
                <el-table-column prop="time" label="变更时间" align="center" :width="250">
                </el-table-column>
                <el-table-column prop="type" label="类型" align="center">
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="积分3信息" name="integralthree">
            <div class="dialog-integral">
              <el-form class="dialog-integral__form">
                <el-form-item class="dialog-formitem">
                  <el-form-grid class="dialog-formitem__choice">
                    请选择：
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-date-picker type="datetime" placeholder="请选择" v-model="startDateTime">
                    </el-date-picker>
                  </el-form-grid>
                  <el-form-grid>
                    -
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-date-picker type="datetime" placeholder="请选择" v-model="endDateTime"></el-date-picker>
                  </el-form-grid>
                  <el-form-grid class="dialog-formitem__type">
                    变更类型：
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-select v-model="value3" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value3"
                        :label="item.label"
                        :value="item.value3">
                      </el-option>
                    </el-select>
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-select v-model="value3" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value3"
                        :label="item.label"
                        :value="item.value3">
                      </el-option>
                    </el-select>
                  </el-form-grid>
                  <el-form-grid>
                    <ns-button type="primary">搜索</ns-button>
                  </el-form-grid>
                </el-form-item>
              </el-form>
              <el-table ref="table" :data="tableData" stripe>
                <el-table-column prop="integral" label="满减积分" align="center">
                </el-table-column>
                <el-table-column prop="time" label="变更时间" align="center" :width="250">
                </el-table-column>
                <el-table-column prop="type" label="类型" align="center">
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="积分4信息" name="integralfour">
            <div class="dialog-integral">
              <el-form class="dialog-integral__form">
                <el-form-item class="dialog-formitem">
                  <el-form-grid class="dialog-formitem__choice">
                    请选择：
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-date-picker type="datetime" placeholder="请选择" v-model="startDateTime">
                    </el-date-picker>
                  </el-form-grid>
                  <el-form-grid>
                    -
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-date-picker type="datetime" placeholder="请选择" v-model="endDateTime"></el-date-picker>
                  </el-form-grid>
                  <el-form-grid class="dialog-formitem__type">
                    变更类型：
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-select v-model="value3" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value3"
                        :label="item.label"
                        :value="item.value3">
                      </el-option>
                    </el-select>
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-select v-model="value3" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value3"
                        :label="item.label"
                        :value="item.value3">
                      </el-option>
                    </el-select>
                  </el-form-grid>
                  <el-form-grid>
                    <ns-button type="primary">搜索</ns-button>
                  </el-form-grid>
                </el-form-item>
              </el-form>
              <el-table ref="table" :data="tableData" stripe>
                <el-table-column prop="integral" label="满减积分" align="center">
                </el-table-column>
                <el-table-column prop="time" label="变更时间" align="center" :width="250">
                </el-table-column>
                <el-table-column prop="type" label="类型" align="center">
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="积分5信息" name="integralfive">
            <div class="dialog-integral">
              <el-form class="dialog-integral__form">
                <el-form-item class="dialog-formitem">
                  <el-form-grid class="dialog-formitem__choice">
                    请选择：
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-date-picker type="datetime" placeholder="请选择" v-model="startDateTime">
                    </el-date-picker>
                  </el-form-grid>
                  <el-form-grid>
                    -
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-date-picker type="datetime" placeholder="请选择" v-model="endDateTime"></el-date-picker>
                  </el-form-grid>
                  <el-form-grid class="dialog-formitem__type">
                    变更类型：
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-select v-model="value3" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value3"
                        :label="item.label"
                        :value="item.value3">
                      </el-option>
                    </el-select>
                  </el-form-grid>
                  <el-form-grid size="md">
                    <el-select v-model="value3" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value3"
                        :label="item.label"
                        :value="item.value3">
                      </el-option>
                    </el-select>
                  </el-form-grid>
                  <el-form-grid>
                    <ns-button type="primary">搜索</ns-button>
                  </el-form-grid>
                </el-form-item>
              </el-form>
              <el-table ref="table" :data="tableData" stripe>
                <el-table-column prop="integral" label="满减积分" align="center">
                </el-table-column>
                <el-table-column prop="time" label="变更时间" align="center" :width="250">
                </el-table-column>
                <el-table-column prop="type" label="类型" align="center">
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ElImage from 'nui-v2/lib/image'

export default {
  components: {
    ElImage
  },
  data () {
    return {
      selectedTabName: 'basic',
      dialogVisible: false,
      value1: '',
      value2: '',
      remark: '备注备注备基础信息基础信息基础信息基础信息基础信息',
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }],
      value3: '',
      startDateTime: null,
      endDateTime: null,
      tableData: [{
        integral: '增加 93',
        time: '2019-08-15 11:39:00',
        type: '赠送'
      },
      {
        integral: '增加 93',
        time: '2019-08-15 11:39:00',
        type: '赠送'
      },
      {
        integral: '增加 93',
        time: '2019-08-15 11:39:00',
        type: '赠送'
      },
      {
        integral: '增加 93',
        time: '2019-08-15 11:39:00',
        type: '赠送'
      },
      {
        integral: '增加 93',
        time: '2019-08-15 11:39:00',
        type: '赠送'
      },
      {
        integral: '增加 93',
        time: '2019-08-15 11:39:00',
        type: '赠送'
      },
      {
        integral: '增加 93',
        time: '2019-08-15 11:39:00',
        type: '赠送'
      },
      {
        integral: '增加 93',
        time: '2019-08-15 11:39:00',
        type: '赠送'
      },
      {
        integral: '增加 93',
        time: '2019-08-15 11:39:00',
        type: '赠送'
      },
      {
        integral: '增加 93',
        time: '2019-08-15 11:39:00',
        type: '赠送'
      }]
    }
  },
  methods: {
    handleClick (tab, event) {
    }
  }
}
</script>

<style scoped>
  @import "@theme/variables.pcss";

  :root {
    --dialog-font-color-red: #FF1985;
    --dialog--font-color-brown: #904B00;
  }

  @component-namespace dialog {
    @b container {
      @e msg {
        display: flex;
        padding: var(--default-padding-xlarger) 0 20px var(--default-padding-small);
        border-bottom: 1px solid var(--theme-base-border-color-primary);
      }
    }
    @b avatar {
      width: 80px;
      position: relative;
      @e figure {
        text-align: center;
        line-height: 26px;
        width: 26px;
        height: 26px;
        position: absolute;
        right: -10px;
        top: 0;
        background: var(--theme-color-white);
        border-radius: 50%;
        @m female {
          font-size: var(--default-font-size-large);
          color: var(--dialog-font-color-red);
        }
        @m male {
          font-size: var(--default-font-size-large);
          color: var(--theme-color-primary);
        }
      }
      @e level {
        font-size: var(--default-font-size-small);
        color: var(--dialog--font-color-brown);
        text-align: center;
        line-height: 20px;
        width: 64px;
        height: 20px;
        position: absolute;
        left: 8px;
        bottom: 5px;
        background-image: linear-gradient(90deg, #FFCD30 0%, #FFDD74 97%);
        border-radius: 18px;
      }
    }
    @b hidden {
      width: 105px;
      max-height: 28px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    @b favorable {
      position: relative;
      @e text {
        position: absolute;
        top: 0;
        left: -80px;
        @m discount {
          color: var(--theme-color-danger);
        }
        @m integration {
          color: var(--theme-color-warning);
        }
        @m coupon {
          color: var(--theme-color-success);
        }
      }
    }
    @b basic {
      @e title {
        line-height: 36px;
        height: 36px;
        font-weight: bold;
        padding-left: 14px;
        background: var(--default-table-strip-bg);
      }
      @e form {
        padding: var(--default-padding-xlarger) 0;
      }
    }
    @b integral {
      margin-top: var(--default-margin-xlarger);
      @e form {
        padding-left: var(--default-padding-xlarger);
      }
    }
    @b formitem {
      @e choice {
        margin-right: 0;
      }
      @e type {
        margin: 0 0 0 var(--default-margin-larger);
      }
    }
    @b transaction {
      padding: var(--default-padding-xlarger);
    }
    @b merchandise {
      @e money {
        font-size: var(--default-font-size-large);
        font-weight: bold;
      }
      @e frequency {
        color: var(--theme-font-color-secondary);
      }
    }
    @b detail {
      padding: var(--default-padding-larger) 0;
      border-bottom: 1px dashed var(--theme-base-border-color-primary);
    }
    @b checkbtn {
      text-align: right;
      width: 230px;
    }
    @b doubt {
      color: var(--theme-color-primary);
      margin-left: var(--default-margin-small);
    }
  }
  .dialog-container >>> .el-tabs__header {
    padding: var(--default-padding-xlarger) 0 0;
  }
</style>
