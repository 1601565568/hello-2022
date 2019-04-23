<template>
  <div class="form-main">
      <h1>弹窗类型</h1>
    <p class="text-primary" style="padding-bottom:10px;">1、自适应高度，弹窗内滚动：</p>
    <p>表现形式——<span class="text-warning">自适应高度，弹窗高度不会超出一屏，弹窗内滚动</span></p>
    <p>应用场景——<span class="text-warning">内容没有操作数据影响排版高度变化</span></p>
    <p>配置方法——<span class="text-warning">无需配置</span></p>
    <span>示例查看——</span> <ns-button @click="onOpendialog">默认弹窗</ns-button>
    <p class="text-primary" style="padding:10px 0;">2、自适应高度，页面滚动：</p>
    <p>表现形式——<span class="text-warning">自适应高度，弹窗高度超出一屏，页面滚动</span></p>
    <p>应用场景——<span class="text-warning">内容没有操作数据影响排版高度变化，内容较多，不想弹窗内滚动，不要求一屏展示</span></p>
    <p>配置方法——<span class="text-warning">配置参数：:response-limit = false</span></p>
    <span>示例查看——</span> <ns-button @click="dialogVisible2 = true">自适应高度</ns-button>
    <p class="text-primary" style="padding:10px 0;">3、固定高度：</p>
    <p>表现形式——<span class="text-warning">固定高度，弹窗内滚动</span></p>
    <p>应用场景——<span class="text-warning">内容有操作数据会影响排版高度变化</span></p>
    <p>配置方法——<span class="text-warning">配置参数 height="400px" height为弹窗整体高度，非内容高度</span></p>
    <span>示例查看——</span> <ns-button @click="dialogVisible1 = true">固定高度</ns-button>
      <h1>项目实例</h1>
        <ns-button @click="dialogVisible3 = true">新增优惠券发放demo</ns-button>
        <ns-button @click="dialogVisible4 = true">关联店铺</ns-button>
        <ns-button @click="dialogVisible6 = true">催付效果</ns-button>
        <ns-button @click="dialogVisible5 = true">信息弹窗</ns-button>

        <ns-button @click="dialogVisible7 = true">弹窗不垂直居中-带tab切换</ns-button>
    <!-- 默认弹窗 -->
    <el-dialog
      title="默认弹窗"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="800px">
      <!-- 弹窗内容 -->
      <el-form label-width="120px"
               class="form-main"
               :model="dynamicValidateForm"
               ref="dynamicValidateForm">
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
        <el-form-item label="单选：">
          <el-radio-group v-model="dynamicValidateForm.sex">
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
            <el-radio label="3">保密</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="有效期(分栏)：">
          <el-radio-group v-model="dynamicValidateForm.sex">
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
          <el-radio-group v-model="dynamicValidateForm.sex">
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
        <el-form-item label="复选2：">
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
        <el-form-item label="H5互动模板：" prop="H5TemplateId">
          <el-select v-model="dynamicValidateForm.H5TemplateId" :placeholder="$t('prompt.select')" multiple>
            <el-option
              v-for="item in form_related_dynamicValidateForm.interactiveTemplate"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 弹窗内容-结束 -->

      <span slot="footer" class="dialog-footer">
         <ns-button @click="dialogVisible = false">取 消</ns-button>
         <ns-save @click="dialogVisible = false" ></ns-save>
      </span>
    </el-dialog>

    <!-- 固定高度 -->
    <!-- 配置参数 height="400px" 这边的height为弹窗整体高度（非内容高度） -->
    <el-dialog
      title="固定高度"
      :visible.sync="dialogVisible1"
      width="800px"
      height="400px">
      <!-- 弹窗内容 -->
      <el-form label-width="120px"
               class="form-main"
               :model="dynamicValidateForm"
               ref="dynamicValidateForm">
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
        <el-form-item label="单选：">
          <el-radio-group v-model="dynamicValidateForm.sex">
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
            <el-radio label="3">保密</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="有效期(分栏)：">
          <el-radio-group v-model="dynamicValidateForm.sex">
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
          <el-radio-group v-model="dynamicValidateForm.sex">
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
        <el-form-item label="复选2：">
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
        <el-form-item label="H5互动模板：" prop="H5TemplateId">
          <el-select v-model="dynamicValidateForm.H5TemplateId" :placeholder="$t('prompt.select')" multiple>
            <el-option
              v-for="item in form_related_dynamicValidateForm.interactiveTemplate"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 弹窗内容-结束 -->

      <span slot="footer" class="dialog-footer">
         <ns-button @click="dialogVisible1 = false">取 消</ns-button>
         <ns-save @click="dialogVisible1 = false" ></ns-save>
      </span>
    </el-dialog>

    <!-- 页面滚动 -->
    <!-- 配置参数：:response-limit=false -->
    <el-dialog
      title="页面滚动"
      :visible.sync="dialogVisible2"
      width="800px"
      :response-limit=false>
      <!-- 弹窗内容 -->
      <el-form label-width="120px"
               class="form-main"
               :model="dynamicValidateForm"
               ref="dynamicValidateForm">
        <el-form-item
          label="邮箱："
          prop='email'
          :rules="[{ required: true, message: '请输入邮箱地址', trigger: 'blur' },{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]">
          <el-form-grid size="xmd">
            <el-input v-model="dynamicValidateForm.email" placeholder="请输入邮箱地址"></el-input>
          </el-form-grid>
        </el-form-item>

        <el-form-item
          label="数字型验证："
          prop='age'
          :rules="[ {type: 'number', message: '金额必须为数字值', trigger: ['blur', 'change']}]">
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
        <el-form-item label="单选：">
          <el-radio-group v-model="dynamicValidateForm.sex">
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
            <el-radio label="3">保密</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="有效期(分栏)：">
          <el-radio-group v-model="dynamicValidateForm.sex">
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
          <el-radio-group v-model="dynamicValidateForm.sex">
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
        <el-form-item label="复选2：">
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
        <el-form-item label="H5互动模板：" prop="H5TemplateId">
          <el-select v-model="dynamicValidateForm.H5TemplateId" :placeholder="$t('prompt.select')" multiple>
            <el-option
              v-for="item in form_related_dynamicValidateForm.interactiveTemplate"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 弹窗内容-结束 -->
      <span slot="footer" class="dialog-footer">
        <ns-button @click="dialogVisible2 = false">取 消</ns-button>
        <ns-save @click="dialogVisible2 = false" ></ns-save>
      </span>
    </el-dialog>

    <!-- 新增优惠券发放demo-->
    <el-dialog
      title="新增优惠券发放"
      :visible.sync="dialogVisible3"
      width="800px"
      :modal-append-to-body="false"
      >

      <el-form label-width="120px"
               class="form-main"
               :model="dynamicValidateForm"
               ref="dynamicValidateForm">

        <el-form-item label="优惠券：" prop="H5TemplateId">
          <el-form-grid size="xmd">
            <el-select v-model="dynamicValidateForm.H5TemplateId" :placeholder="$t('prompt.select')">
              <el-option
                v-for="item in form_related_dynamicValidateForm.coupon"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="配额：">
          <el-form-grid size="xmd">
            <el-input placeholder="请输入数字" type="number" v-model="dynamicValidateForm.number"
                      auto-complete="off"></el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="分配方式：">
          <el-form-grid>
            <el-radio-group v-model="dynamicValidateForm.pattern">
              <el-radio label="1">公用</el-radio>
              <el-radio label="2">自由分配</el-radio>
            </el-radio-group>
          </el-form-grid>
          <el-form-grid block class="text-info"><i class="el-icon-info"></i>公用则所有门店共享配额，自由分配为默认均分，可再行调整</el-form-grid>
        </el-form-item>
        <div class="coupon">
          <div class="coupon-preview">
          <div class="coupon-preview-amount text-error">￥<span class="coupon-amount__large">20</span></div>
          <div class="coupon-preview-title">
            20元代金券<span class="coupon-decorate">代金券</span>
            <p class="text-secondary">2018.06.05至2018.06.05</p>
          </div>
        </div>
          <div class="coupon-preview-bottom">
            订单满100可用
          </div>
        </div>
      </el-form>
      <div class="border-top"></div>
        <el-form label-width="60px" @keyup.enter.native="onSearch" class="text-right margin-larger-t"
                 :inline="true">
          <el-form-item label="所属地区：">
            <ns-area @change="onChange"
                     :props="key"
                     v-model="selectedOptions3">
            </ns-area>
          </el-form-item>
          <el-form-item label="门店名称：">
            <el-form-grid size="xmd">
              <el-input type="text" v-model="shopName">
              </el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item><ns-button type="primary">{{$t('operating.search')}}</ns-button></el-form-item>
        </el-form>
      <ns-page-table>
        <!-- 表格 -->
        <template slot="table">
          <!-- 表格配置 不能添加 border 配置 -->
          <!-- 表格配置 需添加 stripe （实现斑马线效果） -->

          <!-- 表格单元格宽度配置规范 -->
          <!-- 复选框/单选框 :width="45" -->
          <!-- 日期 年月日 :width="100"   年月日时分秒 :width="150" -->
          <!-- 手机号 :width="120" -->
          <!-- 操作（只有一项文字的80px,两项文字120px,三项文字160px） -->
          <el-table ref="table" :data="tableData" class="template-table__main"
                    stripe
                    resizable v-loading.lock="_data._table.loadingtable"
                    :element-loading-text="$t('prompt.loading')">
            <el-table-column :show-overflow-tooltip="true" type="default" prop="shopNameTable"
                             label="门店名称" :sortable="false">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" type="default" prop="areaName"
                             label="所属地区" :sortable="false">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" type="default"
                             label="配额" :sortable="false" :width="150" align="center">
              <template slot-scope="scope">
                <el-input-number v-model="num1" @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <!-- 表格-结束 -->

        <!-- 分页 -->
        <template slot="pagination">
          <el-pagination v-if="_data._pagination.enable" class="template-table__pagination"
                         :page-sizes="_data._pagination.sizeOpts" :total="_data._pagination.total"
                         :current-page="_data._pagination.page" :page-size="_data._pagination.size"
                         layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </template>
        <!-- 分页-结束 -->

      </ns-page-table>
      <span slot="footer" class="dialog-footer">
        <ns-button @click="dialogVisible3 = false">取 消</ns-button>
         <ns-save @click="dialogVisible3 = false" ></ns-save>
      </span>
    </el-dialog>
    <!-- /新增优惠券发放demo-->

    <!-- 关联店铺demo-->
   <el-dialog
    title="关联店铺"
    :visible.sync="dialogVisible4"
    width="850px">
    <p class="relevance-shop__title"><i class="iconfont icon-shop"></i>
      品牌名称<span style="padding-left: 10px;">已选<span class="text-danger padding-lr-base">0</span>家</span>
      <el-form class="float-right clearfix" :inline=true>
        <el-form-item><el-select  :clearable=true v-model="value" :placeholder="$t('prompt.select')">
          <el-option value="渠道名称">
          </el-option>
        </el-select></el-form-item>
        <el-form-item><el-input
          placeholder='输入店铺名称'></el-input></el-form-item>
        <el-form-item>
          <ns-button type="primary">{{$t('operating.search')}}</ns-button>
        </el-form-item>
      </el-form></p>
    <div class="relevance-shop__main">
      <div class="relevance-shop__content">
        <el-checkbox-group v-model="shopNames">
          <el-checkbox label="1">店铺名称</el-checkbox>
          <el-checkbox label="2">店铺名称店铺名称</el-checkbox>
          <el-checkbox label="3">店铺名称店铺名称</el-checkbox>
          <el-checkbox label="4">店铺名称店铺名称店铺名称</el-checkbox>
          <el-checkbox label="5">店铺名称店铺名称店铺名称店铺名称</el-checkbox>
          <el-checkbox label="6">店铺名称店铺名称</el-checkbox>
          <el-checkbox label="7">店铺名称店铺名称店铺名称</el-checkbox>
          <el-checkbox label="8">店铺名称店铺名称</el-checkbox>
          <el-checkbox label="9" title="店铺名称店铺名称店铺名称店铺名称">店铺名称店铺名称店铺名称店铺名称店铺名称店铺名称</el-checkbox>
          <el-checkbox label="10">店铺名称店铺名称店铺名称店铺名称</el-checkbox>
          <el-checkbox label="11">店铺名称店铺名称</el-checkbox>
          <el-checkbox label="12">店铺名称店铺名称店铺名称店铺名称</el-checkbox>
          <el-checkbox label="13">店铺名称店铺名称店铺名称店铺名称</el-checkbox>
          <el-checkbox label="14">店铺名称店铺名称</el-checkbox>
          <el-checkbox label="15">店铺名称店铺名称店铺名称店铺名称</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="relevance-shop__footer">
        <el-checkbox v-model="currentAll" class="padding-r-base">本页全选
        </el-checkbox>
        <el-checkbox v-model="isAll">全部全选
        </el-checkbox>
        <el-pagination
          class="float-right clearfix"
          :current-page="currentPage4"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400">
        </el-pagination>
      </div>
    </div>
     <span slot="footer" class="dialog-footer">
        <ns-button @click="dialogVisible4 = false">取 消</ns-button>
         <ns-save @click="dialogVisible4 = false" ></ns-save>
      </span>
  </el-dialog>
    <!-- /关联店铺demo-->

    <!-- 催付效果demo-->
    <el-dialog
      title="催付效果"
      :visible.sync="dialogVisible6"
      width="1000px"
      :modal-append-to-body="false"
    >
      <ns-page-charts>
        <!--搜索区域-->
        <template slot="search">
          <el-form :inline="true" label-width="80px">
            <el-form-item label="催付时间：">
              <ns-datetime type="date"
                           v-model="create_time">
              </ns-datetime>
            </el-form-item>
            <el-form-item>
              <ns-button type="primary">{{$t('operating.search')}}</ns-button>
              <ns-button>{{$t('operating.reset')}}</ns-button>
            </el-form-item>
          </el-form>
        </template>
        <!-- /搜索区域-->
        <!--图表区域-->
        <template slot="charts">
          <p class="page-title">数据图表</p>
          <div style="width:100%;height:400px;">
           <!-- 图表无数据时-->
           <!-- <ns-no-data height="400">{{$t('prompt.noData')}}</ns-no-data>-->
            <!-- 图表无数据时-->
            <el-row>
              <el-col :span="9">
                <business-echarts :options="option" auto-resize></business-echarts>
              </el-col>
              <el-col :span="15">
                <business-echarts :options="option2" auto-resize></business-echarts>
              </el-col>
            </el-row>
          </div>
        </template>
        <!-- /图表区域-->
        <!--表格区域-->
        <template slot="table">
          <p class="page-title">数据报表 <ns-button type="text" class="float-right clearfix"><i class="el-icon-download"></i>导出报表</ns-button></p>
          <el-table :data="tableData3" style="width:100%;">
              <el-table-column align="center"
                               label="日期"
                               prop="date">
              </el-table-column>
              <el-table-column label="催款金额"
                               prop="date1"
                               width="80"
                               align="right">
              </el-table-column>
            <el-table-column label="回款金额"
                             prop="date2"
                             width="80"
                             align="right">
            </el-table-column>
            <el-table-column label="回款金额比例"
                             prop="date3"
                             width="120"
                             align="right">
            </el-table-column>
            <el-table-column label="催款订单数"
                             prop="date4"
                             width="100"
                             align="right">
            </el-table-column>
            <el-table-column label="回款订单数"
                             prop="date5"
                             width="100"
                             align="right">
            </el-table-column>
            <el-table-column label="回款订单比例"
                             prop="date6"
                             width="120"
                             align="right">
            </el-table-column>
            <el-table-column label="催款客户数"
                             prop="date7"
                             width="100"
                             align="right">
            </el-table-column>
            <el-table-column label="回款客户数"
                             prop="date8"
                             width="100"
                             align="right">
            </el-table-column>
            </el-table>
        </template>
        <!-- /表格区域-->
      </ns-page-charts>
      <span slot="footer" class="dialog-footer">
        <ns-button @click="dialogVisible6 = false">关闭</ns-button>
      </span>
    </el-dialog>
    <!-- /催付效果demo-->

    <!-- 信息型弹窗-->
    <el-dialog
      title="信息型弹窗"
      :visible.sync="dialogVisible5"
      width="850px">
      <el-alert class="border-info__unique"
        title=""
        type="info"
        :closable="false">
        <p>1、规则说明说明说明说明说明说明说明说明说明说明</p>
        <p>2、规则说明说明说明说明说明说明</p>
        <p>3、规则说明说明说明说明说明说明说明</p>
        <p>4、规则说明说明说明说明说明说明说明</p>
      </el-alert>
      <!--信息详情的表单添加text-form-unique类名-->
      <el-form label-width="128px" class="text-form-unique">
        <el-form-item label="投入产出比(ROI)：" class="el-inline-block">
          <el-form-grid size="xxs" class="text-danger">0</el-form-grid>
        </el-form-item>
        <el-form-item label="意向客户数：" class="el-inline-block">
          <el-form-grid size="xxs" class="text-danger">￥0.00</el-form-grid>
        </el-form-item>
        <el-form-item label="成交客户数：" class="el-inline-block">
          <el-form-grid size="xxs" class="text-danger">10件</el-form-grid>
        </el-form-item>
        <el-form-item label="货到付款客户数：" class="el-inline-block">
          <el-form-grid size="xxs" class="text-danger">5</el-form-grid>
        </el-form-item>
        <el-form-item label="在线支付客户数：" class="el-inline-block">
          <el-form-grid size="xxs" class="text-danger">0</el-form-grid>
        </el-form-item>
        <el-form-item label="总响应率：" class="el-inline-block">
          <el-form-grid size="xxs" class="text-danger">0</el-form-grid>
        </el-form-item>
        <el-form-item label="互动人数：" class="el-inline-block">
          <el-form-grid size="xxs" class="text-danger">10%</el-form-grid>
        </el-form-item>
        <el-form-item label="任务覆盖客户数：" class="el-inline-block">
          <el-form-grid size="xxs" class="text-danger">5%
          </el-form-grid>
        </el-form-item>
        <el-form-item label="营销方式：" class="el-inline-block">
          <el-form-grid size="xxs" class="text-danger">
            6%
          </el-form-grid>
        </el-form-item>
        <el-form-item label="意向件数：" class="el-inline-block">
          <el-form-grid size="xxs" class="text-danger">200件</el-form-grid>
        </el-form-item>
        <el-form-item label="成交件数：" class="el-inline-block">
          <el-form-grid size="xxs" class="text-danger">200件</el-form-grid>
        </el-form-item>
        <el-form-item label="回购响应率：" class="el-inline-block">
          <el-form-grid size="xxs" class="text-danger">200件</el-form-grid>
        </el-form-item>
        <el-form-item label="互动次数：" class="el-inline-block">
          <el-form-grid size="xxs" class="text-danger">0</el-form-grid>
        </el-form-item>
        <el-form-item label="积分消耗：" class="el-inline-block">
          <el-form-grid size="xxs" class="text-danger">0</el-form-grid>
        </el-form-item>
        <el-form-item label="营销成本：" class="el-inline-block">
          <el-form-grid size="xxs" class="text-danger">0</el-form-grid>
        </el-form-item>
        <el-form-item label="意向总额：" class="el-inline-block">
          <el-form-grid size="xxs" class="text-danger">0</el-form-grid>
        </el-form-item>
        <el-form-item label="成交总额：" class="el-inline-block">
          <el-form-grid size="xxs" class="text-danger">0</el-form-grid>
        </el-form-item>
        <el-form-item label="意向响应率：" class="el-inline-block">
          <el-form-grid size="xxs" class="text-danger">0</el-form-grid>
        </el-form-item>
        <el-form-item label="积分发送：" class="el-inline-block">
          <el-form-grid size="xxs" class="text-danger">0</el-form-grid>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <ns-button @click="dialogVisible5 = false">关闭</ns-button>
      </span>
    </el-dialog>
    <!-- /信息型弹窗-->

    <!-- 弹窗不垂直居中-带tab切换-->
    <el-dialog
      title="弹窗不垂直居中-带tab切换"
      :visible.sync="dialogVisible7"
      top="20px"
      :vetically=false
      width="850px">
      <p class="text-info">如需使用页面滚动，需配置： <span class="text-success">:response-limit=false</span></p>
      <p class="text-info">如需调整弹窗位置，可调整： <span class="text-success">top="20px"</span></p>
      <el-tabs class="tab-center--two" v-model="activeName">
        <el-tab-pane label="节点设置" name="first">
          <el-alert class="border-info__unique"
                    title=""
                    type="info"
                    :closable="false">
            <p>1、规则说明说明说明说明说明说明说明说明说明说明</p>
            <p>2、规则说明说明说明说明说明说明</p>
            <p>3、规则说明说明说明说明说明说明说明</p>
            <p>4、规则说明说明说明说明说明说明说明</p>
          </el-alert>
          <!--信息详情的表单添加text-form-unique类名-->
          <el-form label-width="128px" class="text-form-unique">
            <el-form-item label="投入产出比(ROI)：" class="el-inline-block">
              <el-form-grid size="xxs" class="text-danger">0</el-form-grid>
            </el-form-item>
            <el-form-item label="意向客户数：" class="el-inline-block">
              <el-form-grid size="xxs" class="text-danger">￥0.00</el-form-grid>
            </el-form-item>
            <el-form-item label="成交客户数：" class="el-inline-block">
              <el-form-grid size="xxs" class="text-danger">10件</el-form-grid>
            </el-form-item>
            <el-form-item label="货到付款客户数：" class="el-inline-block">
              <el-form-grid size="xxs" class="text-danger">5</el-form-grid>
            </el-form-item>
            <el-form-item label="在线支付客户数：" class="el-inline-block">
              <el-form-grid size="xxs" class="text-danger">0</el-form-grid>
            </el-form-item>
            <el-form-item label="总响应率：" class="el-inline-block">
              <el-form-grid size="xxs" class="text-danger">0</el-form-grid>
            </el-form-item>
            <el-form-item label="互动人数：" class="el-inline-block">
              <el-form-grid size="xxs" class="text-danger">10%</el-form-grid>
            </el-form-item>
            <el-form-item label="任务覆盖客户数：" class="el-inline-block">
              <el-form-grid size="xxs" class="text-danger">5%
              </el-form-grid>
            </el-form-item>
            <el-form-item label="营销方式：" class="el-inline-block">
              <el-form-grid size="xxs" class="text-danger">
                6%
              </el-form-grid>
            </el-form-item>
            <el-form-item label="意向件数：" class="el-inline-block">
              <el-form-grid size="xxs" class="text-danger">200件</el-form-grid>
            </el-form-item>
            <el-form-item label="成交件数：" class="el-inline-block">
              <el-form-grid size="xxs" class="text-danger">200件</el-form-grid>
            </el-form-item>
            <el-form-item label="回购响应率：" class="el-inline-block">
              <el-form-grid size="xxs" class="text-danger">200件</el-form-grid>
            </el-form-item>
            <el-form-item label="互动次数：" class="el-inline-block">
              <el-form-grid size="xxs" class="text-danger">0</el-form-grid>
            </el-form-item>
            <el-form-item label="积分消耗：" class="el-inline-block">
              <el-form-grid size="xxs" class="text-danger">0</el-form-grid>
            </el-form-item>
            <el-form-item label="营销成本：" class="el-inline-block">
              <el-form-grid size="xxs" class="text-danger">0</el-form-grid>
            </el-form-item>
            <el-form-item label="意向总额：" class="el-inline-block">
              <el-form-grid size="xxs" class="text-danger">0</el-form-grid>
            </el-form-item>
            <el-form-item label="成交总额：" class="el-inline-block">
              <el-form-grid size="xxs" class="text-danger">0</el-form-grid>
            </el-form-item>
            <el-form-item label="意向响应率：" class="el-inline-block">
              <el-form-grid size="xxs" class="text-danger">0</el-form-grid>
            </el-form-item>
            <el-form-item label="积分发送：" class="el-inline-block">
              <el-form-grid size="xxs" class="text-danger">0</el-form-grid>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <ns-button @click="dialogVisible7 = false">关闭</ns-button>
          </span>
        </el-tab-pane>
        <el-tab-pane label="保存报告" name="second">
          <el-form label-width="120px"
                   class="form-main"
                   :model="dynamicValidateForm"
                   ref="dynamicValidateForm">
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
            <el-form-item label="单选：">
              <el-radio-group v-model="dynamicValidateForm.sex">
                <el-radio label="1">男</el-radio>
                <el-radio label="2">女</el-radio>
                <el-radio label="3">保密</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="有效期(分栏)：">
              <el-radio-group v-model="dynamicValidateForm.sex">
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
              <el-radio-group v-model="dynamicValidateForm.sex">
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
            <el-form-item label="复选2：">
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
            <el-form-item label="H5互动模板：" prop="H5TemplateId">
              <el-select v-model="dynamicValidateForm.H5TemplateId" :placeholder="$t('prompt.select')" multiple>
                <el-option
                  v-for="item in form_related_dynamicValidateForm.interactiveTemplate"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
         <ns-button @click="dialogVisible7 = false">取 消</ns-button>
         <ns-save @click="dialogVisible7 = false" ></ns-save>
      </span>
    </el-dialog>
    <!-- /弹窗不垂直居中-带tab切换-->
  </div>
</template>
<script>
import NsArea from 'components/NsArea'
import NsDatetime from 'components/NsDatetime'
import NsButton from '../../components/global/NsButton.vue'
import businessEcharts from 'components/NsEcharts'

export default {
  components: {
    NsButton,
    NsArea,
    NsDatetime,
    businessEcharts
  },
  data () {
    var pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    return {
      // 回款/未回款饼图
      option: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          x: 'center',
          y: 'bottom',
          data: ['回款金额', '未回款金额']
        },
        calculable: false,
        series: [
          {
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            data: [{
              value: 30,
              name: '回款金额'
            }, { value: 70,
              name: '未回款金额' }]
          }
        ],
        color: ['#4fcc8d', '#41a2e8']
      },
      // 回款/未回款饼图-end
      // 回款/未回款图表
      option2: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        color: ['#41a2e8', '#4fcc8d', '#ff6e71'],
        legend: {
          x: 'center',
          y: 'bottom',
          data: ['催款金额', '回款金额', '回款成功率']
        },
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '金额',
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: '{value} 元'
            }
          },
          {
            type: 'value',
            name: '比例',
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: [
          {
            name: '催款金额',
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2]
          },
          {
            name: '回款金额',
            type: 'bar',
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2]
          },
          {
            name: '回款成功率',
            type: 'line',
            yAxisIndex: 1,
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4]
          }
        ]
      },
      // 回款/未回款图表-end
      activeName: 'first',
      create_time: [],
      value: '',
      currentAll: false,
      isAll: false,
      currentPage4: 4,
      shopNames: '',
      num1: '',
      shopName: '',
      areaName: '',
      numberSet: '',
      shopNameTable: '',
      // 地区选择
      key: {
        children: 'children',
        label: 'label',
        value: 'id',
        disabled: 'disabled'
      },
      selectedOptions3: [110000, 110100],
      // 表格数据
      tableData: [{
        shopNameTable: '九堡东方电子商务园店',
        areaName: '浙江省杭州市江干区'
      },
      {
        shopNameTable: '杭州砂之船店',
        areaName: '浙江省杭州市江干区'
      },
      {
        shopNameTable: '厦门瑞景商业广场店',
        areaName: '福建省厦门市思明区'
      }],
      url: this.$api.database.black.queryTable,
      _pagination: pagination,
      _table: {
        quickSearchMap: {}
      },
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      dialogVisible5: false,
      dialogVisible6: false,
      dialogVisible7: false,
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
        number: '',
        pattern: 2
      },
      form_related_dynamicValidateForm: {
        // 优惠券类型
        coupon: [
          {
            value: '10元无门槛优惠券',
            label: '10元无门槛优惠券'
          },
          {
            value: '优惠券2',
            label: '优惠券2'
          }
        ],
        // 互动模板
        interactiveTemplate: [
          {
            value: '电脑电脑电脑电脑电脑电脑电脑电脑电脑电脑电脑电脑电脑电脑电脑电脑2',
            label: '电脑电脑电脑电脑电脑电脑电脑电脑电脑电脑电脑电脑电脑电脑电脑电脑'
          }, {
            value: 'iPad',
            label: 'iPad'
          }, {
            value: 'phone1311',
            label: '手3机434500'
          }, {
            value: 'p3h3one22',
            label: '手机533p32手机23'
          },
          {
            value: 'phonet33',
            label: '1手机3手机3'
          },
          {
            value: 'phon2e111',
            label: '手机'
          }, {
            value: 'phone222',
            label: '手机2手机6'
          },
          {
            value: 'phone333',
            label: '手机3'
          }
        ],
        options: [{
          value: '选项1',
          label: '选项1'
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
      analysisExpectTime: [],
      tableData3: [
        {
          date: '2016-03-03',
          date1: 0,
          date2: 1,
          date3: 2,
          date4: 0,
          date5: 1,
          date6: 2,
          date7: 0,
          date8: 1
        },
        {
          date: '2016-04-03',
          date1: 0,
          date2: 1,
          date3: 2,
          date4: 0,
          date5: 1,
          date6: 2,
          date7: 0,
          date8: 1
        },
        {
          date: '2016-05-03',
          date1: 0,
          date2: 1,
          date3: 2,
          date4: 0,
          date5: 1,
          date6: 2,
          date7: 0,
          date8: 1
        }
      ]
    }
  },
  methods: {
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    onOpendialog () {
      var that = this
      that.dialogVisible = true
    },
    onSearch () {
      console.log('搜索响应')
    },
    onChange (data) {
      console.log(data)
    },
    handleChange (value) {
      console.log(value)
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>

<style scoped>
  @import "../../style/small/variables.pcss";
 /* 关联店铺的样式*/
 .relevance-shop__title{
   padding:var(--default-margin-base) var(--default-margin-base) var(--default-margin-larger);
   i{
     background: var(--theme-color-primary);
     width: 24px;
     height:24px;
     border-radius: 100%;
     color:#fff;
     display: inline-block;
     margin-right: 3px;
     &:before{
       font-size: 14px;
       line-height: 22px;
       position: relative;
       left: 4px;
       top: 0;
     }
   }
 }
 .relevance-shop__main{
   >>> .el-form{
     padding:var(--default-margin-base);
   }
   width:100%;
   border:1px solid var(--theme-base-border-color-primary);
   .relevance-shop__content{
     padding:var(--default-margin-base);
     width:100%;
     >>> .el-checkbox{
       width:32.7%;
       overflow: hidden;
       white-space: nowrap;
       text-overflow: ellipsis;
       margin-right:var(--default-margin-base);
       &+.el-checkbox{
         margin-left:0;
       }
     }
   }
   .relevance-shop__footer{
     border-top:1px solid var(--theme-base-border-color-primary);
     padding:var(--default-margin-base);
     >>> .el-checkbox{
       line-height: var(--default-form-item-small-height);
     }
     >>> .el-pagination{
       padding:0;
       display: inline-block;
     }
   }
 }
 /* 关联店铺的样式-end*/

  /* 发放优惠券样式 */
  .border-top{
    width:100%;
    height: 0;
    border-top:1px solid var(--theme-base-border-color-primary);
  }
  .coupon{
    position: absolute;
    top:5px;
    right:60px;
    font-size:13px;
  }
  .coupon-preview{
     display: flex;
     flex-direction: row;
     align-items: center;
     border-radius:5px;
     border:1px solid var(--theme-base-border-color-primary);
     border-bottom-style:dashed;
    padding:10px;
  }
  .coupon-amount__large{
    font-size: 28px;
  }
  .coupon-preview-title{
    padding-left:15px;
  }
  .coupon-decorate{
    background: var(--theme-color-warning);
    color:#fff;
    margin-left: 10px;
    padding: 3px 6px 2px;
    font-size: 12px;
  }
  .coupon-preview-bottom{
    font-size: 12px;
    border-radius:5px;
    border:1px solid var(--theme-base-border-color-primary);
    border-top-style:dashed;
    padding:3px 10px;
    color:var(--theme-font-color-secondary);
    margin-top: -1px;
  }
  /* 发放优惠券样式-end */

  /* tab样式 */
  .tab-center--two .tab-line-reset >>> .el-tabs__header{
    background: #fff;
  }
  .tab-center--two .tab-line-reset  >>> .el-tabs__nav{
    border:none;
    border-radius: 0;
    float:left;
  }
  .tab-center--two .tab-line-reset  >>> .el-tabs__item.is-active{
    background: none;
    color:var(--theme-color-primary);
  }
  .tab-center--two .tab-line-reset  >>> .el-tabs__item, .tab-line-reset  >>> .el-tabs__item{
    padding:var(--tab-center-two-vertical-padding) var(--tab-center-two-horizontal-padding);
    font-size:var(--tab-center-two-font-size);
    color:var(--theme-font-color-regular);
  }
  .tab-center--two {
    >>> .el-tabs__header{
      background: none;
      text-align: center;
      border: none;
      margin-bottom:var(--default-margin-xlarger);
    }
  }
  .tab-center--two  >>> .el-tabs__nav{
    border:1px solid var(--theme-color-primary);
    border-radius: var(--default-radius-mini);
    display: inline-block;
    float:none;
  }
  .tab-center--two  >>> .el-tabs__item.is-active{
    background: var(--theme-color-primary);
    color:var(--theme-bg-color-base);
  }
  .tab-center--two  >>> .el-tabs__item, .tab-center--two  >>> .el-tabs__item{
    padding:var(--tab-center-two-vertical-padding) var(--tab-center-two-horizontal-padding);
    font-size:var(--tab-center-two-font-size);
    color:var(--theme-color-primary);
  }
  .el-tabs--top >>> .el-tabs__item.is-top:last-child{
    padding-right:var(--tab-center-two-horizontal-padding);
  }
  .el-tabs--top >>> .el-tabs__item.is-top:nth-child(2){
    padding-left:var(--tab-center-two-horizontal-padding);
  }
</style>
