<template>
  <el-row :gutter="20" class="form-main">
    <el-col :span="12" style="width: 350px;">
    <div class="tmp-page__content">
      <el-form :model="model" ref="sendEmailForm" :rules="rules" placement="right" label-width="100px">
        <el-form-item label="解密数据：" required>
          <el-form-grid size="xmd">
            <el-form-item prop="key">
              <el-input type="text"
                        v-model="model.key"
                        placeholder="请输入发件地址">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="类型：" class = "el-inline-block">
          <el-form-grid size="xmd">
            <el-form-item prop = "type" >
              <el-select v-model="model.type" :placeholder="$t('prompt.select')">
                <el-option
                  v-for="item in sendModedata"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item>
          <ns-button @click="onSendEmail" type="primary">解密</ns-button>
          <ns-button @click="resetForm">{{$t('operating.reset')}}</ns-button>
        </el-form-item>
        <el-form-item>
          <el-form-grid>
            解密结果：{{model.result}}
          </el-form-grid>
        </el-form-item>
      </el-form>
    </div>
    </el-col>
    <el-col :span="12">
    <div class="tmp-page__content">
      <el-form :model="encodeModel" ref="encodeForm" :rules="rules" placement="right" label-width="100px">
        <el-form-item label="待加密数据：" required>
          <el-form-grid size="xmd">
            <el-form-item prop="key">
              <el-input type="text"
                        v-model="encodeModel.key"
                        placeholder="请输入">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="类型：" class = "el-inline-block">
          <el-form-grid size="xmd">
            <el-form-item prop = "type" >
              <el-select v-model="encodeModel.type" :placeholder="$t('prompt.select')">
                <el-option
                  v-for="item in sendModedata"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item>
          <ns-button @click="onEncode" type="primary">加密</ns-button>
          <ns-button @click="resetForm">{{$t('operating.reset')}}</ns-button>
        </el-form-item>
        <el-form-item>
          <el-form-grid>
            加密结果：{{encodeModel.encodeResult}}
          </el-form-grid>
        </el-form-item>
      </el-form>
    </div>
    </el-col>
  </el-row>
</template>
<script>
  import index from './src/index'

  index.components = {
  }
  export default index
</script>
