<template>
  <div class="form" v-loading="loading" element-loading-text="数据保存中...">
    <el-form label-width="140px"
             class="form-main"
             :model="dynamicValidateForm"
             ref="dynamicValidateForm">
      <el-form-item label="使用说明："><p class="text-warning">el-input及el-date-picker需要添加el-form-grid父标签，属性值size="xmd"，保证组件宽度一致</p></el-form-item>

      <el-form-item
        label="邮箱："
        prop='email'
        :rules="[
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
    ]">
        <el-form-grid size="xmd">
          <el-input v-model="dynamicValidateForm.email" placeholder="请输入邮箱地址"></el-input>
        </el-form-grid>
      </el-form-item>

      <el-form-item
        label="数字型验证："
        prop='age'
        :rules="
      [ {type: 'number', message: '金额必须为数字值', trigger: ['blur', 'change']}]
    ">
        <el-form-grid size="xmd">
          <el-input placeholder="请输入数字" type="age" v-model.number="dynamicValidateForm.age" auto-complete="off"></el-input>
        </el-form-grid>
      </el-form-item>

      <el-form-item
        label="普通文本："
        prop='name'>
        <el-form-grid size="xmd">
          <el-input
            :disabled='dynamicValidateForm.id ? true : false'
            v-model="dynamicValidateForm.name"
            placeholder='姓名'></el-input>
        </el-form-grid>
      </el-form-item>
      <el-form-item label="倒计时：">
        <el-form-grid>
          <ns-count-down date="2018-09-12 12:02:00" type="HMS" format="HH:MM:SS" :callback="timeOut"></ns-count-down>
        </el-form-grid>

        <el-form-grid>支持倒计时超过一天配置</el-form-grid>
        <el-form-grid>
          <!-- format="DD:HH:MM:SS" 显示为： 01:02:16:47 -->
          <ns-count-down date="2018-12-10 12:02:00" type="DHMS" :callback="timeOut"></ns-count-down>
        </el-form-grid>
      </el-form-item>
      <el-form-item
        label="上传文件："
        prop='name'>
        <el-form-grid block size="xmd">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-change="handleChange"
            :file-list="fileList3">
            <el-button type="primary">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">
              <div class="tmp-tips text-warning"><i class="el-icon-warning"></i>
                只能上传csv文件<a class="text-primary">下载模板</a>
              </div>
            </div>
          </el-upload>
        </el-form-grid>
      </el-form-item>

      <el-form-item label="年月日：">
        <el-form-grid size="xmd">
          <el-date-picker type="date" placeholder="选择日期" v-model="dynamicValidateForm.date1"
          ></el-date-picker>
        </el-form-grid>
      </el-form-item>
      <el-form-item label="时分秒：">
        <el-form-grid size="xmd">
          <el-date-picker type="datetime" placeholder="选择日期" v-model="dynamicValidateForm.birthday"
          ></el-date-picker>
        </el-form-grid>
      </el-form-item>
      <el-form-item label="时分秒联动：">
        <el-form-grid size="xmd">
          <el-date-picker type="datetime" placeholder="开始日期" v-model="dynamicValidateForm.startDateTime"
          ></el-date-picker>
        </el-form-grid>
        <el-form-grid>
          至
        </el-form-grid>
        <el-form-grid size="xmd">
          <el-date-picker type="datetime" placeholder="结束日期" v-model="dynamicValidateForm.endDateTime"
          ></el-date-picker>
        </el-form-grid>
      </el-form-item>

      <el-form-item
        label="前置示例：">
        <el-form-grid size="xmd">
          <el-input>
            <template slot="prepend">前</template>
          </el-input>
        </el-form-grid>
      </el-form-item>

      <el-form-item
        label="后置示例：">
        <el-form-grid size="xmd">
          <el-input>
            <template slot="append">后</template>
          </el-input>
        </el-form-grid>
      </el-form-item>

      <el-form-item
        label="前后置示例：">
        <el-form-grid size="xmd">
          <el-input>
            <template slot="prepend">前</template>
            <template slot="append">后</template>
          </el-input>
        </el-form-grid>
      </el-form-item>
      <el-form-item label="H5互动模板：" prop="H5TemplateId">
        <el-form-grid size="xmd">
          <ns-select-relevance :clearable= true v-model="dynamicValidateForm.H5TemplateId" :data="form_related_dynamicValidateForm.interactiveTemplate"
                               ></ns-select-relevance>
        </el-form-grid>
      </el-form-item>
      <el-form-item label="彩旗标记：">
        <el-radio-group v-model="dynamicValidateForm.sex">
          <el-radio :label="1"><i class="iconfont icon-flag-red"></i></el-radio>
          <el-radio :label="2"><i class="iconfont icon-flag-yellow"></i></el-radio>
          <el-radio :label="3"><i class="iconfont icon-flag-blue"></i></el-radio>
          <el-radio :label="4"><i class="iconfont icon-flag-green"></i></el-radio>
          <el-radio :label="5"><i class="iconfont icon-flag-purple"></i></el-radio>
          <el-radio :label="6"><i class="iconfont icon-flag-gray"></i></el-radio>
        </el-radio-group>
        <div class="tmp-tips text-info"><i class="el-icon-info"></i>
          彩旗图标类名为icon-flag-red ( yellow、blue、green、purple、gray )
        </div>
      </el-form-item>

      <el-form-item label="评价级别：">
        <el-radio-group v-model="dynamicValidateForm.evaluate">
          <el-radio :label="1">
            <i class="small-icon high-opinion"></i>
          </el-radio>
          <el-radio :label="2">
            <i class="small-icon middle-opinion"></i>
          </el-radio>
          <el-radio :label="3">
            <i class="small-icon negative-opinion"></i>
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="会员等级：">
        <el-radio-group v-model="dynamicValidateForm.level">
          <el-radio :label="1">
            <i class="small-icon gradeZero-icon"></i>
          </el-radio>
          <el-radio :label="2">
            <i class="small-icon gradeOne-icon"></i>
          </el-radio>
          <el-radio :label="3">
            <i class="small-icon gradeTwo-icon"></i>
          </el-radio>
          <el-radio :label="4">
            <i class="small-icon gradeThree-icon"></i>
          </el-radio>
          <el-radio :label="5">
            <i class="small-icon gradeFour-icon"></i>
          </el-radio>
          <el-radio :label="6">
            <i class="small-icon gradeFive-icon"></i>
          </el-radio>
          <el-radio :label="7">
            <i class="small-icon gradeSix-icon"></i>
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="优惠券：">
        <el-form-grid>
          <div class="coupons">
            <div class="coupon-block">
              <span class="coupon-cor top"></span>
              <div class="coupon-content">
                <div class="coupon-price">50</div>
                <div class="coupon-word">
                  <div class="coupon-word__rule">无门槛使用</div>
                  <div class="coupon-word__tip">元优惠券</div>
                </div>
              </div>
              <span class="coupon-cor bottom"></span>
              <div class="coupon-shade">
                <span>已过期</span>
              </div>
            </div>
          </div>
        </el-form-grid>
        <el-form-grid>
          <div class="coupons is-deadline">
            <div class="coupon-block">
              <span class="coupon-cor top"></span>
              <div class="coupon-content">
                <div class="coupon-price">50</div>
                <div class="coupon-word">
                  <div class="coupon-word__rule">无门槛使用</div>
                  <div class="coupon-word__tip">元优惠券</div>
                </div>
              </div>
              <span class="coupon-cor bottom"></span>
              <div class="coupon-shade">已过期</div>
            </div>
          </div>
        </el-form-grid>
      </el-form-item>

      <el-form-item label="有效期(分栏)：">
        <el-radio-group v-model="dynamicValidateForm.point">
          <el-radio label="1">
            <el-form-grid>
              积分生效后
            </el-form-grid>
            <el-form-grid size="xxs">
              <el-input></el-input>
            </el-form-grid>
            <el-form-grid>
              天之后过期
            </el-form-grid>
          </el-radio>
          <el-radio label="2">
            <el-form-grid>
              积分生效后
            </el-form-grid>
            <el-form-grid size="xxs">
              <el-input></el-input>
            </el-form-grid>
            <el-form-grid>
              天之后过期
            </el-form-grid>
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="有效期(分行)：">
        <el-radio-group v-model="dynamicValidateForm.point2">
          <el-form-item>
            <el-radio label="1">
              <el-form-grid>
                积分生效后
              </el-form-grid>
              <el-form-grid size="xxs">
                <el-input></el-input>
              </el-form-grid>
              <el-form-grid>
                天之后过期
              </el-form-grid>
            </el-radio>
          </el-form-item>
          <el-form-item>
            <el-radio label="2">
              <el-form-grid>
                积分生效后
              </el-form-grid>
              <el-form-grid size="xxs">
                <el-input></el-input>
              </el-form-grid>
              <el-form-grid>
                天之后过期
              </el-form-grid>
            </el-radio>
          </el-form-item>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="复选：">
          <el-checkbox v-model="dynamicValidateForm.isUrgeOne">多笔订单只催一笔
            <el-tooltip effect="light" content="当天只催付一笔当天只催付一笔当天只催付一笔当天只催付一笔当天只催付一笔当天只催付一笔当天只催付一笔当天只催付一笔当天只催付一笔"><i class="el-icon-info"></i></el-tooltip>
          </el-checkbox>
          <el-checkbox v-model="dynamicValidateForm.isExcludePayed">排除多笔订单中，但有支付的客户
            <el-tooltip effect="light" content="3天内有支付不催付3天内有支付不催付3天内有支付不催付3天内有支付不催付" placement="right"><i class="el-icon-info"></i></el-tooltip>
          </el-checkbox>
      </el-form-item>
      <el-form-item
        label="内联表单元素：" class="el-inline-block">
        <el-form-grid size="xmd">
          <el-input
            placeholder='输入1'></el-input>
        </el-form-grid>
        <el-form-grid size="xmd">
          <el-input
            placeholder='输入2'></el-input>
        </el-form-grid>
        <el-form-grid size="xmd">
          <el-input
            placeholder='输入3'></el-input>
        </el-form-grid>
      </el-form-item>

      <el-form-item label="开关：">
        <el-switch active-text="启用" inactive-text="禁用"
                   v-model="dynamicValidateForm.status"></el-switch>
      </el-form-item>
      <el-form-item label="短信内容：">
        <el-form-grid size="xlg" block>
          <div class="tmp-fieldset__tags">
            <el-tag>会员姓名
            </el-tag>
            <el-tag>
              客户积分
            </el-tag>
            <el-tag>短信退订
            </el-tag>
          </div>
        </el-form-grid>
        <el-form-grid size="xlg" class="form-textarea">
          <el-input type="textarea" :rows="4"></el-input>
        </el-form-grid>
      </el-form-item>
      <el-form-item>
        <ns-button type="primary" @click="submitForm('dynamicValidateForm')">保存</ns-button>
        <ns-button @click="resetForm('dynamicValidateForm')">{{$t('operating.reset')}}</ns-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import ElButton from '../../../node_modules/nui-v2/packages/button/src/button.vue'
import NsSelectRelevance from '../../components/NsSelectRelevance'

export default {
  components: { ElButton, NsSelectRelevance },
  name: 'edit',
  data () {
    return {
      authTime: '2018-09-13 12:02:00',
      fileList3: [{
        name: '第一份上传文件.txt',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }, {
        name: '第二份上传文件.txt',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }],
      dynamicValidateFormBak: null,
      loading: false,
      // 表单数据
      dynamicValidateForm: {
        name: 'admin',
        status: true,
        isUrgeOne: false,
        isExcludePayed: false,
        H5TemplateId: [],
        birthday: '1992-11-5',
        date1: null,
        startDateTime: null,
        endDateTime: null,
        email: '',
        age: '',
        point: '',
        point2: '',
        sex: 1,
        evaluate: 1,
        level: 1
      },
      form_related_dynamicValidateForm: {
        // 互动模板1
        interactiveTemplate: [
          {
            value: '电脑电脑电脑电脑电脑电脑电脑电脑电脑电脑电脑电脑电脑电脑电脑电脑2',
            label: '电脑电脑电脑电脑电脑电脑电脑电脑电脑电脑电脑电脑电脑电脑电脑电脑',
            relevance: true
          }, {
            value: 'iPad',
            label: 'iPad',
            relevance: true
          }, {
            value: 'phone1311',
            label: '手3机434500',
            relevance: false
          }, {
            value: 'p3h3one22',
            label: '手机533p32手机23',
            relevance: false
          }
        ],
        options: [{
          value: '选项1',
          label: '选项11'
        }, {
          value: '选项2',
          label: '选项2'
        }, {
          value: '选项3',
          label: '选项3'
        }, {
          value: '选项4',
          label: '选项4'
        }, {
          value: '选项5',
          label: '选项5'
        }],
        value5: []
      },
      // 表单校验规则
      form_rules: {
        name: [{
          required: true,
          message: '姓名不能为空！',
          trigger: 'blur'
        }],
        email: [{
          required: true,
          message: '邮箱不能为空！',
          trigger: 'blur'
        }, {
          type: 'email',
          message: '邮箱格式不正确！',
          trigger: 'blur'
        }]
      },
      // 催付时间（选择时间段）
      analysisExpectTime: []
    }
  },
  methods: {
    timeOut () {
      console.log('倒计时结束！')
    },
    handleChange (file, fileList) {
      this.fileList3 = fileList.slice(-3)
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  mounted () {
    this.authTime = new Date(new Date().setDate(new Date().getDate() + 1)).toString()
  },
  watch: {}
}
</script>
<style scoped>
  @import "../../style/small/variables.pcss";
  /* 优惠券结构 */
  .coupons {
    overflow:hidden;
    display: inline-block;
    vertical-align: middle;
  }
  .coupon-block {
    position: relative;
    border: 1px solid var(--theme-color-danger);
    padding: var(--default-padding-base) var(--default-padding-small);
    background: var(--theme-color-white);
    line-height: 18px;
  }
  .coupon-cor:before,
  .coupon-cor:after {
    content: '';
    position: absolute;
    display:inline-block;
    background: var(--theme-color-white);
    width: 10px;
    height: 10px;
    border-radius: 10px;
    border:1px solid var(--theme-color-danger);
  }
  .coupon-cor.top:before {
    left: -5px;
    top: -5px;
    border-top:1px solid var(--theme-color-white);
    border-left:1px solid var(--theme-color-white);
  }
  .coupon-cor.top:after{
    right:-5px;
    top:-5px;
    border-top:1px solid var(--theme-color-white);
    border-right:1px solid var(--theme-color-white);
  }
  .coupon-cor.bottom:before {
    left:-5px;
    bottom:-5px;
    border-bottom:1px solid var(--theme-color-white);
    border-left:1px solid var(--theme-color-white);
  }
  .coupon-cor.bottom:after{
    right:-5px;
    bottom:-5px;
    border-bottom:1px solid var(--theme-color-white);
    border-right:1px solid var(--theme-color-white);
  }
  .coupon-content {
    display: table;
  }

  .coupon-price {
    display: table-cell;
    vertical-align: middle;
    font-size: 26px;
    font-weight: bold;
    padding-right: 5px;
    color: var(--theme-color-danger);
  }

  .coupon-word {
    display: table-cell;
  }

  .coupon-word__rule {
    background: var(--theme-color-danger);
    color: var(--theme-color-white);
    padding: 1px 2px;
  }

  .coupon-word__tip {
    font-size: 14px;
    color: var(--theme-color-danger);
    font-weight: bold;
  }
  /* 扩展配置 */
  .cell .coupons {
    /* margin: var(--theme-margin-small) 0;*/
  }
  .is-gray-bg .coupon-cor:before,
  .is-gray-bg .coupon-cor:after{
    background: var(--theme-base-border-color-primary);
  }

  .el-table--enable-row-hover .el-table__body tr:hover>td .coupon-cor:before,
  .el-table--enable-row-hover .el-table__body tr:hover>td .coupon-cor:after{
    background-color: var(--theme-base-border-color-primary);
  }
  /* 已过期 */
  .coupons.is-deadline {
    .coupon-shade{
      display: inline-block;
    }
    .coupon-block,
    .coupon-cor:before,
    .coupon-cor:after{
      border:1px solid var(--theme-base-border-color-primary);
    }
    .coupon-price,
    .coupon-word__tip{
      color:#999;
    }
    .coupon-word__rule{
      background-color: #ccc;
    }
  }

  .coupon-shade {
    position: absolute;
    border: 3px solid var(--theme-color-danger);
    color: var(--theme-color-danger);
    font-size: 16px;
    font-weight: bold;
    top: 10px;
    right: 5px;
    display: none;
    padding: 2px;
    transform: rotate(-10deg);
    -ms-transform: rotate(-10deg);
    -moz-transform: rotate(-10deg);
    -webkit-transform: rotate(-10deg);
    -o-transform: rotate(-10deg);
  }

</style>
