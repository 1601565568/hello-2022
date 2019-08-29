<template>
  <div class="template-page">
    <div class="template-page__row">
      <div class="template-page__row-right" style="margin: 0">
        <goods-table ref="table" @detail="showDetailDialog" @addIntegral="showIntegralDialog" @sendSMS="showSmsDialog" @sendSmsList="showSmsDialog2">
        </goods-table>
      </div>
    </div>
    <el-dialog ref="editDialog" :visible.sync="dialogVisible" width='400px' size="small" height='482px'>
      <div style="font-size:30px;">
        <img :src="customerInfo.customer_head_image" width="45" height="45" style="margin-left: 20px;"/>
        <span>{{customerInfo.customer_name}} {{customerInfo.gradeName}}</span>
      </div>
      <div class="white-line"></div>
      <div class='form-main'>
        <div class='customInfo fl'>
            <el-form placement="right" label-width="60px">
              <el-form-item label="姓名：">
                <el-form-grid size="md">
                  {{customerInfo.true_name}}
                </el-form-grid>
              </el-form-item>
              <el-form-item label="性别：">
                <el-form-grid size="md">
                  {{customerInfo.sex===1?'男':customerInfo.sex===0?'女':'未知'}}
                </el-form-grid>
              </el-form-item>
              <el-form-item label="积分：">
                <el-form-grid size="md">
                  {{customerInfo.integral===null?'-':customerInfo.integral}}
                </el-form-grid>
              </el-form-item>
              <el-form-item label="生日：">
                <el-form-grid size="md">
                  {{customerInfo.birthday||'-'}}
                </el-form-grid>
              </el-form-item>
              <el-form-item label="地址：">
                <el-form-grid size="md">
                  {{customerInfo.province}}{{customerInfo.city}}{{customerInfo.address}}
                </el-form-grid>
              </el-form-item>
            </el-form>

        </div>
        <div class='customInfo fl'>
          <div class="tmp-page__content">
            <el-form placement="right" label-width="60px">
              <el-form-item label="会员卡：">
                <el-form-grid size="md">
                  {{customerInfo.member_card||'-'}}
                </el-form-grid>
              </el-form-item>
              <el-form-item label="手机号：">
                <el-form-grid size="md">
                  {{customerInfo.mobile||'-'}}
                </el-form-grid>
              </el-form-item>
              <el-form-item label="优惠券：">
                <el-form-grid size="md">
                  {{customerInfo.couponCount}}
                </el-form-grid>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>

      <div class="white-line"></div>
      <div style="margin-left: 30px;">
        <span style="color:gray">当前客户累计交易额（元）</span>
        <br/>
        <span>￥{{customerInfo.trade_amount}} ( 交易次数：{{customerInfo.trade_times}} )</span>
        <br/>
        <span>回购周期：{{customerInfo.buyTimesUnit||'-'}} ，笔单价：{{customerInfo.priceUnit||'-'}} ，每笔商品：{{customerInfo.itemUnit||'-'}}</span>
      </div>
      <div class="white-line"></div>
      <span
        style="color:gray;margin-left: 30px;padding-bottom: 10px;">最近交易：{{customerInfo.last_success_time||'-'}}</span>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="dialogVisible = false">关闭</ns-button>
      </div>
    </el-dialog>
    <el-dialog size="small" :visible.sync="integralDialog" :modal-append-to-body="false" width='700px'>
      <el-form label-width="100px" placement="right">
        <el-form-item label="积分数量：" required>
          <el-form-grid size="xmd">
            <el-form-item prop="name">
              <el-input type="number" placeholder="积分数量" v-model="integral"></el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="integralDialog = false">取消</ns-button>
        <ns-save type="primary" @click="addCustomerIntegral">保存</ns-save>
      </div>
    </el-dialog>
    <el-dialog size="small" :visible.sync="smsDialog" title="发送短信" :modal-append-to-body="false" width='700px'>
      <el-form label-width="100px" placement="right">
        <el-form-item label="短信内容：" required>
          <el-form-grid size="xmd">
            <el-form-item prop="name">
              <el-input type="textarea" placeholder="短信内容" v-model="smsContent" style='width:500px'></el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item>
          <el-form-grid size="xmd">
            <ns-button @click="addSmsName">+客户名称</ns-button>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="smsDialog = false">取消</ns-button>
        <ns-save type="primary" @click="sendSms">保存</ns-save>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import GoodsTable from './table'
import index from './src/index'
import NsDroptree from 'web-crm/src/components/NsDroptree'

index.components = { GoodsTable, NsDroptree }
export default index
</script>

<style scoped >
  .white-line {
    box-sizing: border-box;
    margin: 10px 0 10px 0;
    border: 0 solid rgba(228, 228, 228, 1);
    border-bottom-width: 1px;
    border-radius: 0;
  }

 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 128px;
    height: 128px;
    line-height: 128px;
    text-align: center;
    display: inline-block;
  }

  .avatar {
    width: 128px;
    height: 128px;
    display: block;
  }

  > > > .avatar-uploader2 .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 1px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader2 .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader2 .avatar-uploader2-icon {
    font-size: 28px;
    color: #8c939d;
    width: 28px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    display: inline-block;
  }

  .avatar2 {
    width: 29px;
    height: 29px;
    display: block;
  }

  .borderClass {
    border: 1px solid rgba(228, 228, 228, 1);
    border-radius: 0px;
  }
  .el-scrollbar__thumb{
    display: none;
    visibility: hidden;
    opacity: 0;
  }
  .customInfo{
    width:50%;
    &.fl{
      float: left;
    }
  }
  .form-main{
    overflow: hidden;
  }
  .el-radio-button__inner{
    width: 95px;
  }
</style>
