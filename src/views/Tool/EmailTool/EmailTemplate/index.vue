<template>
  <!-- start:  Page content of course! -->
  <div>
      <!-- 表格 -->
      <ns-table-email-template ref="emailTemplateTable" @email-add="onAddEmail"
                               @email-edit="onEditEmail">
      </ns-table-email-template>
      <!-- 弹框 -->
      <el-dialog size="middle" ref="emailformdialog" :title="title" :before-close="onCloseEmailDialog"
                 :visible.sync="mailtemplateformvisible" :close-on-click-modal="false" width="850px">
        <el-form :model="model"
                 ref="emailform" :rules="rules" placement="right">
          <div class="mailtemplate-header clearfix">
            <input type="hidden" id="app-id" v-model="model.id"/>
            <span class="title">编辑模板</span>
            <el-form-item label="模板类型：" label-width="100px" class="el-inline-block" style="float: right">
              <ns-select v-model="model.template_type" class="el-select"
                         :url="$api.touch.emailTemplate.queryEmailTemplateType">
              </ns-select>
            </el-form-item>
          </div>
          <!--标题占位符 开始-->
          <el-form-item label="标题占位符：" label-width="100px" class="el-block-box"
                        v-show=" model.template_type ==  '2' || model.template_type == '3' || model.template_type == '4'
                        || model.template_type ==  '5' || model.template_type == '6' || model.template_type == '7'
                        || model.template_type == '8' || model.template_type == '10'|| model.template_type == '17' ">
            <el-form-grid>
              <el-tag v-for="tag in fullTitleTags" :key="tag.index" type="gray"
                      @click.native="titleTagClick(tag.key)">{{tag.text}}
              </el-tag>
            </el-form-grid>
          </el-form-item>
          <!--升级提醒和生日关怀 标题占位符-->
          <el-form-item label="标题占位符：" label-width="100px" class="el-block-box"
                        v-show="model.template_type == '14'|| model.template_type == '15'">
            <el-form-grid>
              <el-tag v-for="tag in halfTitleTags" :key="tag.index" type="gray"
                      @click.native="titleTagClick(tag.key)">{{tag.text}}
              </el-tag>
            </el-form-grid>
          </el-form-item>
          <!--营销和节日关怀 标题占位符-->
          <el-form-item label="标题占位符：" label-width="100px" class="el-block-box"
                        v-show="model.template_type == '1' || model.template_type == '16'">
            <el-form-grid>
              <el-tag v-for="tag in miniTitleTags" :key="tag.index" type="gray"
                      @click.native="titleTagClick(tag.key)">{{tag.text}}
              </el-tag>
            </el-form-grid>
          </el-form-item>
          <!--标题占位符 结束-->
          <el-form-item label="邮件标题：" label-width="100px" class="el-block-box" prop="template_title">
            <el-form-grid class="no-margin" size="xxlg">
              <el-input type="text" placeholder="请输入模板标题，限制2-30字" v-model.trim="model.template_title"></el-input>
            </el-form-grid>
          </el-form-item>
          <!--模板内容占位符 开始-->
          <!--营销模板 模板内容占位符-->
          <el-form-item label="模板内容占位符：" label-width="100px" class="el-block-box"
                        v-show="model.template_type ==  '1' ">
            <el-form-grid>
              <el-tag v-for="tag in fullContentTags" :key="tag.index" type="gray"
                      @click.native="contentTagClick(tag.key)">{{tag.text}}
              </el-tag>
            </el-form-grid>
          </el-form-item>
          <!--节日关怀模板 模板内容占位符-->
          <el-form-item label="模板内容占位符：" label-width="100px" class="el-block-box"
                        v-show=" model.template_type ==  '16'">
            <el-form-grid>
              <el-tag v-for="tag in miniContentTags" :key="tag.index" type="gray"
                      @click.native="contentTagClick(tag.key)">{{tag.text}}
              </el-tag>
            </el-form-grid>
          </el-form-item>
          <!--模板内容占位符 结束-->
          <el-form-item class="el-block-box" label="尊敬的会员：" label-width="100"
                        v-show=" model.template_type ==  '2' || model.template_type == '3' || model.template_type == '4'
                        || model.template_type ==  '5' || model.template_type == '6' || model.template_type == '7'
                        || model.template_type == '8' || model.template_type == '10' || model.template_type == '14' || model.template_type == '15'|| model.template_type == '17'">
            <el-form-grid>{$Nick$},您好！</el-form-grid>
          </el-form-item>
          <el-form-item prop="topText"
                        v-show=" model.template_type ==  '2' || model.template_type == '3' || model.template_type == '4'
                        || model.template_type ==  '5' || model.template_type == '6' || model.template_type == '7'
                        || model.template_type == '8'  || model.template_type == '10' || model.template_type == '14' || model.template_type == '15'|| model.template_type == '17'">
            <el-form-grid class="el-block no-margin" style="margin-right:0;">
              <el-input type="textarea" placeholder="请输入邮件头部自定义内容,限500字以内" :rows="4"
                        v-model.trim="model.topText"></el-input>
            </el-form-grid>
          </el-form-item>
          <!--退款关怀有退款信息-->
          <el-form-item v-show="model.template_type == '10'">
            <table width="100%" stripe>
              <tbody>
              <tr>
                <td class="padding_10 text-warning">退款详情：</td>
              </tr>
              <tr>
                <td class="border-bottom-0">
                  <table width="100%" class="margin-5-auto">
                    <tbody>
                    <tr>
                      <td style="width:86px">退款编号：</td>
                      <td>{$refundCode$}</td>
                    </tr>
                    <tr>
                      <td style="width:86px">申请时间：</td>
                      <td>{$date$}</td>
                    </tr>
                    <tr>
                      <td style="width:86px">退款状态：</td>
                      <td>{$status$}</td>
                    </tr>
                    <tr>
                      <td style="width:86px">退款金额：</td>
                      <td>{$money$}元</td>
                    </tr>
                    <tr>
                      <td style="width:86px">退款原因：</td>
                      <td>{$refundReason$}</td>
                    </tr>
                    <tr>
                      <td style="width:86px">退款说明：</td>
                      <td>{$refundDesc$}</td>
                    </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              </tbody>
            </table>
          </el-form-item>
          <!--退款信息结束-->
          <!--发货提醒、有物流跟踪、到达提醒有物流信息-->
          <el-form-item v-show=" model.template_type == '5' || model.template_type == '6'|| model.template_type == '17'">
            <table stripe width="100%"><!-- class="mailtemplate-editor__table"-->
              <tbody>
              <tr>
                <td class="text-warning">物流信息</td>
              </tr>
              <tr>
                <td class="border-bottom-0">
                  <table width="100%" class="inner">
                    <tbody>
                    <tr>
                      <td style="width:86px">物流公司：</td>
                      <td>{$logisticsCompany$}</td>
                    </tr>
                    <tr>
                      <td style="width:86px">物流单号：</td>
                      <td>{$logisticsCode$}</td>
                    </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              </tbody>
            </table>
          </el-form-item>
          <!--物流信息 结束-->
          <!--收货人信息-->
          <el-form-item v-show="model.template_type == '4'|| model.template_type ==  '5' || model.template_type == '6' || model.template_type == '17'">
            <table stripe width="100%">
              <tbody>
              <tr>
                <td class="text-warning">收货人信息</td>
              </tr>
              <tr>
                <td class="border-bottom-0">
                  <table width="100%" class="inner">
                    <tbody>
                    <tr>
                      <td style="width:86px">姓名：</td>
                      <td>{$name$}</td>
                    </tr>
                    <tr>
                      <td style="width:86px">地址：</td>
                      <td>{$address$}</td>
                    </tr>
                    <tr>
                      <td style="width:86px">邮编：</td>
                      <td>{$postcode$}</td>
                    </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              </tbody>
            </table>
          </el-form-item>
          <!--收货人信息 结束-->
          <!-- 订单信息 开始-->
          <el-form-item v-show="model.template_type ==  '2' || model.template_type == '3' || model.template_type == '4'
                    || model.template_type ==  '5' || model.template_type == '6' || model.template_type == '7'
                    || model.template_type == '8' || model.template_type == '17'">
            <table stripe width="100%">
              <tbody>
              <tr>
                <td class="text-warning">订单信息</td>
              </tr>
              <tr>
                <td class="border-bottom-0">
                  <table width="100%" class="inner">
                    <tbody>
                    <tr>
                      <td style="width:86px">订单编号：</td>
                      <td>{$tradeid$}(点击订单号，可以查看订单详情)</td>
                    </tr>
                    <tr>
                      <td style="width:86px">订单日期：</td>
                      <td>{$date$}</td>
                    </tr>
                    <tr>
                      <td style="width:86px">实付金额：</td>
                      <td>{$money$}元</td>
                    </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              </tbody>
            </table>
          </el-form-item>
          <!--商品列表-->
          <el-form-item v-show="model.template_type ==  '2' || model.template_type == '3' || model.template_type == '4'
                    || model.template_type ==  '5' || model.template_type == '6' || model.template_type == '7'
                    || model.template_type == '8' || model.template_type == '17' ">
            <table style="width: 100%">
              <tbody>
              <tr>
                <td class="text-warning">所购商品</td>
              </tr>
              <tr>
                <td>
                  <div>
                    <el-table>
                      <el-table-column label="商品名称"></el-table-column>
                      <el-table-column label="数量" style="width: 50%"></el-table-column>
                    </el-table>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </el-form-item>
          <!-- 订单信息 结束-->
          <!--推荐商品 开始-->
          <el-form-item v-show=" model.template_type ==  '2' || model.template_type == '3' || model.template_type == '4'
                        || model.template_type ==  '5' || model.template_type == '6' || model.template_type == '7'
                        || model.template_type == '8' || model.template_type == '10' || model.template_type == '14'
                        || model.template_type == '15' || model.template_type == '17'">
            <div class="mailtemplate-header">
              <el-form-item>
                <span class="text-warning">推荐商品</span>(点击添加商品可以关联四个在售商品到{{getCommandTips(model.template_type)}}做为推荐商品)
              </el-form-item>
            </div>
            <div class="mailtemplate-select">
              <table class="mailtemplate-select__table" cellspacing="0"
                     cellpadding="0" width="100%">
                <tr>
                  <!--<td class="goods-item" v-for="(item,index) in model.items" :key="index">-->
                  <td class="goods-item" v-for="(item,index) in model.items" :key="index">
                    <div class="goods-addpic has-selected" style="height: 0;">
                      <i class="el-icon-delete goods-deletepic" @click="delGoods(item)"></i>
                      <el-input type="hidden" v-model="item.id"/>
                        <img :src="item.picture_url"/>
                    </div>
                    <div class="goods-name">{{item.title}}</div>
                    <div class="goods-price">
                      <table border="0" width="100%" class="goods-addprice">
                        <tbody>
                        <tr>
                          <td><span>{{item.price}}元</span></td>
                          <td class="text-center" width="46">
                            <ns-button type="primary" size="small">购买</ns-button>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2">
                            <el-form-item :key="item.key" :prop="'items.' + index + '.buyUrl'"
                                          :rules="{required: true, validator:urlValidator, trigger: 'blur'}">
                              <el-input placeholder="请输入商品购买地址" v-model.trim.trim="item.buyUrl"/>
                            </el-form-item>
                          </td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                  <td class="goods-item" v-show="model.items && model.items.length <4">
                    <div class="goods-addpic">
                      <ns-button type="primary" @click="onShow" class="goods-select_button">选择商品</ns-button>
                    </div>
                    <div class="goods-name">{$商品名称$}</div>
                    <div class="goods-price">
                      <table border="0" width="100%" class="goods-addprice">
                        <tbody>
                        <tr>
                          <td><span>{$商品价格$}元</span></td>
                          <td class="text-center" width="46">
                            <ns-button type="primary" size="small">购买</ns-button>
                          </td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                  <td class="goods-item" v-show="model.items && model.items.length <3">
                    <div class="goods-addpic">
                      <ns-button type="primary" @click="onShow" class="goods-select_button">选择商品</ns-button>
                    </div>
                    <div class="goods-name">{$商品名称$}</div>
                    <div class="goods-price">
                      <table border="0" width="100%" class="goods-addprice">
                        <tbody>
                        <tr>
                          <td><span>{$商品价格$}元</span></td>
                          <td class="text-center" width="46">
                            <ns-button type="primary" size="small">购买</ns-button>
                          </td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                  <td class="goods-item" v-show="model.items && model.items.length <2">
                    <div class="goods-addpic">
                      <ns-button type="primary" @click="onShow" class="goods-select_button">选择商品</ns-button>
                    </div>
                    <div class="goods-name">{$商品名称$}</div>
                    <div class="goods-price">
                      <table border="0" width="100%" class="goods-addprice">
                        <tbody>
                        <tr>
                          <td><span>{$商品价格$}元</span></td>
                          <td class="text-center" width="46">
                            <ns-button type="primary" size="small">购买</ns-button>
                          </td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                  <td class="goods-item" v-show="model.items && model.items.length <1">
                    <div class="goods-addpic">
                      <ns-button type="primary" @click="onShow" class="goods-select_button">选择商品</ns-button>
                    </div>
                    <div class="goods-name">{$商品名称$}</div>
                    <div class="goods-price">
                      <table stripe class="goods-addprice" border="0" width="100%">
                        <tbody>
                        <tr>
                          <td><span>{$商品价格$}元</span></td>
                          <td class="text-center" width="46">
                            <ns-button type="primary" size="small">购买</ns-button>
                          </td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
            <ns-goods-select-dialog ref="goods" v-model="model.items" :max-select-count="4" :trans-selected-data="transGoodsData"></ns-goods-select-dialog>
          </el-form-item>
          <!--推荐商品 结束-->
          <!--富文本框 开始-->
          <el-form-item prop="editor" v-if="mailtemplateformvisible">
            <vue-ueditor-wrap :config="myConfig" v-model="model.editor" @ready="editorReady"></vue-ueditor-wrap>
          </el-form-item>
          <!--富文本框 结束-->
          <!--选择测试通道 start -->
          <el-form-item prop="channel" label="测试发送邮件通道：" label-width="138px" class="el-inline-block el-form-validate__unHide">
            <el-form-grid size="xmd">
              <ns-select v-model="model.channel"
                         :url = "$api.touch.ysChannel.queryEmailChannelOptions"
                         filterable clearable
                         :placeholder="$t('prompt.select')" :multiple="false">
              </ns-select>
            </el-form-grid>
          </el-form-item>

          <el-form-item prop="senderEmail" class="el-inline-block el-form-validate__unHide" label-width="138px" label="接收测试邮件地址：">
            <el-form-grid size="xmd">
              <el-input type="text" placeholder="请输入接收测试邮件地址" v-model.trim="model.senderEmail"></el-input>
            </el-form-grid>
          </el-form-item>
          <!--选择测试通道 end -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-form-grid>
            <ns-button @click="onSendTestEmail">发送测试</ns-button>
          </el-form-grid>
          <ns-button @click="onCloseEmailDialog">{{$t('operating.cancel')}}</ns-button>
          <ns-save @click="onSave" ></ns-save>
        </div>
      </el-dialog>
    </div>
</template>
<script>
  import index from './src/index'
  import VueUeditorWrap from 'vue-ueditor-wrap'
  import NsTableEmailTemplate from './NsTableEmailTemplate'
  import NsGoodsSelectDialog from 'components/NsGoodsSelectDialog'

  index.components = {
    NsTableEmailTemplate,
    NsGoodsSelectDialog,
    VueUeditorWrap
  }
  export default index
</script>
<style scoped>
  @import "../../../../style/small/variables.pcss";
  .align-middle-unique{
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
  }
  .mailtemplate-editor .inner tr td:last-child {
    border-right: 1px solid var(--theme-base-border-color-primary);
  }

  .mailtemplate-editor table {
    border-collapse: collapse;
    border-spacing: 0
  }

  .mailtemplate-editor__table td {
    border: 1px solid var(--theme-base-border-color-primary);
    padding: 5px 10px;
  }

  .mailtemplate-editor__table td.title {
    border: 1px solid var(--theme-base-border-color-primary);
    border-top: 0
  }

  .mailtemplate-editor__table:first-child td.title {
    border-top: 1px solid var(--theme-base-border-color-primary);
  }

  .mailtemplate-select {
    margin-bottom: 5px
  }

  .mailtemplate-select__table {
    border-collapse: collapse;
    border-spacing: 0
  }

  .mailtemplate-select__table td {
    border: 1px solid var(--theme-base-border-color-primary);
    border-right: 0;
    font-size: var(--default-font-size-small)
  }

  .mailtemplate-select__table tr td:last-child {
    border-right: 1px solid var(--theme-base-border-color-primary);
  }

  .mailtemplate-select__table .goods-item {
    padding: 5px;
    width: 25%;
    vertical-align: top
  }

  .mailtemplate-select__table .goods-addpic {
    text-align: center;
    width: 100%;
    padding-top:100%;
    line-height: 100%;
    margin: 0 auto 5px;
    border: 1px solid var(--theme-base-border-color-primary);
    position: relative
  }

  .mailtemplate-select__table .goods-addpic img {
    position: absolute;
    left:0;
    top:0;
    width: 100%;
    height: 100%;
    vertical-align: top
  }


  .mailtemplate-select__table .goods-addpic .goods-deletepic {
    display: none;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 22;
    line-height: 1;
    color: #fff;
    font-size: 18px;
    background: rgba(0, 0, 0, .2);
    padding: 2px;
    cursor: pointer
  }

  .mailtemplate-select__table .goods-addpic .goods-deletepic:hover {
    color: var(--theme-color-error)
  }

  .mailtemplate-select__table .goods-addpic.has-selected .goods-deletepic {
    display: inline-block
  }

  .mailtemplate-select__table .goods-name {
    line-height: 18px;
    margin-bottom: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    width: 100%;
    height: 36px
  }

  .mailtemplate-select__table .goods-addprice {
    border-collapse: collapse;
    border-spacing: 0
  }

  .mailtemplate-select__table .goods-addprice td {
    padding: 5px
  }

  .mailtemplate-preview .goods-addpic {
    width: 172px;
    height: 172px;
    line-height: 172px
  }

  .mailtemplate-preview .preview-message p {
    margin: 0
  }

   >>> .el-tag {
    cursor: pointer;
  }

  >>> .edui-default {
    z-index: 1!important;
  }

  @component-namespace mailtemplate {
    @b header {
      margin-bottom: var(--default-margin-small);
      border-bottom: 1px solid var(--theme-base-border-color-primary);

      &:after, &:before {
        display: table;
        content: ""
      }

      .title {
        font-size: var(--default-font-size-base);
        line-height: 30px
      }

      label {
        font-size: var(--default-font-size-small)
      }
    }
  }
  .goods-select_button {
    position: absolute;
    left:25%;
    top:40%;
    margin-left:0px;
    margin-top:0px;
  }
</style>
