<template>
  <div class="template-page">
      <div class="template-page__row form-main">
        <el-form label-width="150px" style="padding-top: 3px;" ref="form">
          <el-form-item label-width="0">
            <el-form-grid>
              <div class="text-info">配置『{{shopName}}』专属客道精灵:</div>
            </el-form-grid>
          </el-form-item>

          <el-form-item label="淘系店铺：" label-with="0">
            <el-form-grid size="xmd">
              <el-select v-model="shopId" :placeholder="$t('prompt.select')" @change="changeShop">
                <el-option v-for="item in shops" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-grid>
          </el-form-item>

          <el-form-item label="多客户报警功能开关：">
            <el-form-grid size="xxlg">
              <el-radio v-model="model.is_most_service_warn" label="1">开</el-radio>
              <el-radio v-model="model.is_most_service_warn" label="0">关</el-radio>
            </el-form-grid>
          </el-form-item>

          <el-form-item label="订单智能称重：">
            <el-form-grid size="xxlg">
              <el-radio v-model="model.is_trade_weigh" label="1">开</el-radio>
              <el-radio v-model="model.is_trade_weigh" label="0">关</el-radio>
              <div class="tmp-tips text-info el-inline-block"><i class="el-icon-info"></i>通过商品信息中设置的宝贝重量，自动计算每笔订单总重量，方便邮费计算</div>
            </el-form-grid>
          </el-form-item>

          <el-form-item label="转发地址附带订单备注：">
            <el-form-grid size="xxlg">
              <el-radio v-model="model.is_send_addr_with_memo" label="1">是</el-radio>
              <el-radio v-model="model.is_send_addr_with_memo" label="0">否</el-radio>
              <div class="tmp-tips text-info el-inline-block"><i class="el-icon-info"></i>给买家发送收货地址核对，同时转发订单备注（自动过滤客服签名）</div>
            </el-form-grid>
          </el-form-item>

          <el-form-item label="附加客服昵称：">
            <el-form-grid size="xxlg">
              <el-radio v-model="model.is_with_service_nick" label="1">是</el-radio>
              <el-radio v-model="model.is_with_service_nick" label="0">否</el-radio>
              <div class="tmp-tips text-info el-inline-block"><i class="el-icon-info"></i>订单备注附加客服昵称，自动添加在备注内容最后</div>
            </el-form-grid>
          </el-form-item>

          <el-form-item label="附加时间：">
            <el-form-grid size="xxlg">
              <el-radio v-model="model.is_with_time" label="1">是</el-radio>
              <el-radio v-model="model.is_with_time" label="0">否</el-radio>
              <div class="tmp-tips text-info el-inline-block"><i class="el-icon-info"></i>订单备注附加当前时间，自动添加在备注内容最后</div>
            </el-form-grid>
          </el-form-item>

          <el-form-item label="自动插旗：">
            <el-form-grid size="xxlg">
              <el-radio-group v-model="model.auto_flag">
              <el-radio :label="0"><i class="iconfont icon-flag-gray"></i></el-radio>
              <el-radio :label="1"><i class="iconfont icon-flag-red"></i></el-radio>
              <el-radio :label="2"><i class="iconfont icon-flag-yellow"></i></el-radio>
              <el-radio :label="3"><i class="iconfont icon-flag-green"></i></el-radio>
              <el-radio :label="4"><i class="iconfont icon-flag-blue"></i></el-radio>
              <el-radio :label="5"><i class="iconfont icon-flag-purple"></i></el-radio>
            </el-radio-group>
              <div class="tmp-tips text-info el-inline-block"><i class="el-icon-info"></i>订单备注自动插旗，设置灰色不自动插旗</div>
            </el-form-grid>
          </el-form-item>

          <el-form-item label="自动生成备注信息：">
            <el-form-grid size="xxlg">
              <el-radio v-model="model.is_auto_generate_memo" label="1">是</el-radio>
              <el-radio v-model="model.is_auto_generate_memo" label="0">否</el-radio>
            </el-form-grid>
          </el-form-item>

          <el-form-item label="精灵公告：">
            <el-form-grid size="xxlg">
              <el-form-item class="el-inline-block">
                <el-form-grid size="xmd">
                  <el-input placeholder="请输入精灵公共" v-model="model.jingling_bulletin" class="input-with-select">
                    <template slot="prepend"><el-checkbox v-model="model.isOpenBulletin">启用</el-checkbox></template>
                  </el-input>
                </el-form-grid>
              </el-form-item>
              <el-form-item class="el-inline-block">
                <el-form-grid size="xmd">
                  <div class="tmp-tips text-info el-inline-block"><i class="el-icon-info"></i>在精灵工作台显示公告信息</div>
                </el-form-grid>
              </el-form-item>
            </el-form-grid>
          </el-form-item>

          <el-form-item label="地址核对附加：">
            <el-form-grid size="xxlg">
              <el-form-item class="el-inline-block">
                <el-form-grid size="xmd">
                  <el-input placeholder="请输入地址核对附加" v-model="model.check_addr_with_memo" class="input-with-select">
                    <template slot="prepend"><el-checkbox v-model="model.isCheckAddrWithMemo">启用</el-checkbox></template>
                  </el-input>
                </el-form-grid>
              </el-form-item>
              <el-form-item class="el-inline-block">
                <el-form-grid width="300px">
                  <div class="tmp-tips text-info el-inline-block"><i class="el-icon-info"></i>在点击发送地址进行核对时，附加设置的短语</div>
                </el-form-grid>
              </el-form-item>
            </el-form-grid>
          </el-form-item>

          <el-form-item label="乡镇自治区地址确认：">
            <el-form-grid width="600px">
              <el-form-item class="el-inline-block">
                <el-form-grid size="xmd">
                  <el-input placeholder="请输入乡镇自治区地址确认" v-model="model.town_addr_confirm_context" class="input-with-select">
                    <template slot="prepend"><el-checkbox v-model="model.isTownAddrConfirm">启用</el-checkbox></template>
                  </el-input>
                </el-form-grid>
              </el-form-item>
              <el-form-item class="el-inline-block">
                <el-form-grid width="300px">
                  <div class="tmp-tips text-info el-inline-block"><i class="el-icon-info"></i>对收货地址中含有 村、镇、乡、自治区...的地址进行提示</div>
                </el-form-grid>
              </el-form-item>
            </el-form-grid>
          </el-form-item>

          <el-form-item label-width="0">
            <el-form-grid>
              <div class="text-info">设置本店铺发货所在地区，用于查询快递可达区域：</div>
            </el-form-grid>
          </el-form-item>
          <template v-for="(data, index) of area">
            <el-form-item label="所在地区：">
              <el-form-grid>
                <el-form-item class="el-inline-block">
                  <el-form-grid size="xxmd">
                    <ns-area refs="area" :props="key" v-model="data.area"></ns-area>
                  </el-form-grid>
                </el-form-item>
                <el-form-item v-if="index != 0" class="el-inline-block">
                  <el-form-grid>
                    <a href="javascript:void(0);" @click="setDefault(data.area, index)">设为默认地址</a>
                  </el-form-grid>
                </el-form-item>
                <el-form-item v-if="area.length >= 2" class="el-inline-block">
                  <el-form-grid>
                    <ns-button type="text" @click="deleteArea(index)">
                      <i class="el-icon-remove"></i>
                    </ns-button>
                  </el-form-grid>
                </el-form-item>
                <el-form-item v-if="area.length-1 == index" class="el-inline-block">
                  <el-form-grid>
                    <ns-button type="text" @click="add()">
                      <i class="el-icon-circle-plus"></i>
                    </ns-button>
                  </el-form-grid>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
          </template>

          <el-form-item label="合作物流：">
            <el-form-grid width="600px">
              <ns-button type="primary" @click="showCompany">选择</ns-button>
            </el-form-grid>
          </el-form-item>

          <el-form-item>
            <el-form-grid size="xxlg">
              <div class="content-style">
                <el-tag
                  :key="tag.code"
                  v-for="(tag , index) in companyTag"
                  closable
                  :disable-transitions="false"
                  @close="closeCompany(index)">
                  {{tag.name}}<i class="el-icon-edit" @click="showSetting(tag)"></i>
                </el-tag>
              </div>
            </el-form-grid>
          </el-form-item>

          <el-form-item label="">
            <el-form-grid>
              <div class="tmp-tips text-info el-inline-block"><i class="el-icon-info"></i>点击<i class="el-icon-edit"></i>设置本店铺的合作物流公司，查询快递时将优先显示</div>
            </el-form-grid>
          </el-form-item>

          <el-form-item>
            <el-form-grid size="xxlg">
              <ns-save @click="onSave()" :loading="loading"></ns-save>
            </el-form-grid>
          </el-form-item>

        </el-form>

        <el-dialog ref="dialog" :title="title" :visible="show"
                   :close-on-click-modal = "false" :before-close="saveCompany" :width="width">
          <div v-if="showProvince">
            <el-form label-width="100px" style="padding-top: 3px;" ref="form">

              <el-form-item label="起始地区：">
                <el-form-grid size="xxmd">
                  <el-select v-model="checkProvince" placeholder="请选择" @change="change">
                    <el-option v-for="province in checkProvinces" :key="province.key" :label="province.label" :value="province.key" >
                    </el-option>
                  </el-select>
                </el-form-grid>
              </el-form-item>

              <el-form-item label="送达地区：">
              </el-form-item>
              <el-form-item label-width="40px">
                <el-form-grid width="700">
                  <el-table :data="provinceTable" class="template-table__main" stripe resizable>
                    <el-table-column prop="province" label="省份" align="center" width="110"></el-table-column>
                    <el-table-column prop="first_weight" label="首重（kg）" align="right" width="90">
                      <template slot-scope="scope">
                        <template v-if="scope.row.first_weight == ''">
                          -
                        </template>
                        <template v-else>
                          {{scope.row.first_weight}}
                        </template>
                      </template>
                    </el-table-column>
                    <el-table-column prop="first_weight_price" label="首重价（元）" align="right" width="100">
                      <template slot-scope="scope">
                        <template v-if="scope.row.first_weight_price == ''">
                          -
                        </template>
                        <template v-else>
                          {{scope.row.first_weight_price}}
                        </template>
                      </template>
                    </el-table-column>
                    <el-table-column prop="continue_weight_price" label="续重价（元/kg）" align="right" width="120">
                      <template slot-scope="scope">
                        <template v-if="scope.row.continue_weight_price == ''">
                          -
                        </template>
                        <template v-else>
                          {{scope.row.continue_weight_price}}
                        </template>
                      </template>
                    </el-table-column>
                    <el-table-column prop="transportation" label="运输方式" width="100" align="center">
                      <template slot-scope="scope">
                        <template v-if="scope.row.transportation == ''">
                          -
                        </template>
                        <template v-else>
                          {{scope.row.transportation}}
                        </template>
                      </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态" width="100" align="center">
                      <template slot-scope="scope">
                        <template v-if="scope.row.status == ''">
                          -
                        </template>
                        <template v-else>
                          {{scope.row.status}}
                        </template>
                      </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="80">
                      <template slot-scope="scope">
                        <ns-button @click="handleClick(scope.row)" type="text" size="small">修改</ns-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-grid>
              </el-form-item>

            </el-form>
          </div>

          <div v-else>
              <el-transfer style="text-align: left; display: inline-block" v-model="company" :data="companyData" :titles="['所有物流公司', '店铺合作物流']"></el-transfer>
          </div>
          <div slot="footer" class="dialog-footer" v-if="!showProvince">
            <ns-button @click="saveCompany">{{$t('operating.cancel')}}</ns-button>
            <ns-save @click="saveCompany"></ns-save>
          </div>
        </el-dialog>

        <el-dialog ref="dialog" title="修改送达地区信息" :visible="feeShow"
                   :close-on-click-modal = "false" :before-close="closeFee" width="500px">
            <el-form label-width="120px" style="padding-top: 3px;" ref="fee" :model="fee" :rules="rules">

              <el-form-item label="省份：">
                <el-form-grid size="xmd">
                   {{fee.province}}
                </el-form-grid>
              </el-form-item>

              <el-form-item label="首重（kg）：" prop = "first_weight">
                <el-form-grid size="xmd" >
                  <el-input v-model="fee.first_weight" class="text-right">
                    <template slot="append">kg</template>
                  </el-input>
                </el-form-grid>
              </el-form-item>

              <el-form-item label="首重价（元）：" prop = "first_weight_price">
                <el-form-grid size="xmd" >
                  <el-input v-model="fee.first_weight_price" class="text-right">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-grid>
              </el-form-item>

              <el-form-item label="续重价（元/kg）：" prop = "continue_weight_price">
                <el-form-grid size="xmd" >
                  <el-input v-model="fee.continue_weight_price" class="text-right">
                    <template slot="append">元/kg</template>
                  </el-input>
                </el-form-grid>
              </el-form-item>

              <el-form-item label="运输方式：" prop = "transportation">
                <el-form-grid size="xmd">
                  <el-input v-model="fee.transportation" placeholder="请输入内容"></el-input>
                </el-form-grid>
              </el-form-item>

              <el-form-item label="状态：" prop = "status">
                <el-form-grid size="xmd">
                  <el-input v-model="fee.status" placeholder="请输入内容"></el-input>
                </el-form-grid>
              </el-form-item>

            </el-form>

          <div slot="footer" class="dialog-footer">
            <ns-button @click="closeFee">{{$t('operating.cancel')}}</ns-button>
            <ns-save @click="saveFee"></ns-save>
          </div>
        </el-dialog>

     </div>
  </div>
</template>

<script>
import index from './src/index'
import NsArea from 'web-crm/src/components/NsArea'
index.components = {
  NsArea
}
export default index
</script>

<style scoped>
  @import "@/style/small/variables.pcss";
  .content-style {
    min-height: 38px;
    padding: var(--default-padding-base) var(--default-padding-base) 0;
    box-shadow: none;
    border: 1px solid var(--theme-base-border-color-primary);
    >>> .el-tag {
      margin: 0 var(--default-margin-base) var(--default-margin-base) 0;
    }
  }
</style>
