<template>
  <div class="form-main">
    <el-row>
      <ns-button>默认按钮</ns-button>
      <ns-button type="primary">主要按钮</ns-button>
      <ns-button type="success">成功按钮</ns-button>
      <ns-button type="info">信息按钮</ns-button>
      <ns-button type="warning">警告按钮</ns-button>
      <ns-button type="danger">危险按钮</ns-button>
      <ns-button type="text">文字按钮</ns-button>
    </el-row>
    <br>
    <el-row>
      <ns-button plain>朴素按钮</ns-button>
      <ns-button type="primary" plain>主要按钮</ns-button>
      <ns-button type="success" plain>成功按钮</ns-button>
      <ns-button type="info" plain>信息按钮</ns-button>
      <ns-button type="warning" plain>警告按钮</ns-button>
      <ns-button type="danger" plain>危险按钮</ns-button>
    </el-row>
    <br>
    <el-row>
      <ns-button round>圆角按钮</ns-button>
      <ns-button type="primary" round>主要按钮</ns-button>
      <ns-button type="success" round>成功按钮</ns-button>
      <ns-button type="info" round>信息按钮</ns-button>
      <ns-button type="warning" round>警告按钮</ns-button>
      <ns-button type="danger" round>危险按钮</ns-button>
    </el-row>
    <br>
    <el-row>
      <ns-button icon="el-icon-search" circle></ns-button>
      <ns-button type="primary" icon="el-icon-edit" circle></ns-button>
      <ns-button type="success" icon="el-icon-check" circle></ns-button>
      <ns-button type="info" icon="el-icon-message" circle></ns-button>
      <ns-button type="warning" icon="el-icon-star-off" circle></ns-button>
      <ns-save ></ns-save>
    </el-row>
    <br>
    <el-row>
      <ns-button disabled>默认按钮</ns-button>
      <ns-button type="primary" disabled>主要按钮</ns-button>
      <ns-button type="success" disabled>成功按钮</ns-button>
      <ns-button type="info" disabled>信息按钮</ns-button>
      <ns-button type="warning" disabled>警告按钮</ns-button>
      <ns-button type="danger" disabled>危险按钮</ns-button>
      <ns-button type="text" disabled>文字按钮</ns-button>
    </el-row>
    <br>
    <el-row>
      <ns-button plain disabled>朴素按钮</ns-button>
      <ns-button type="primary" plain disabled>主要按钮</ns-button>
      <ns-button type="success" plain disabled>成功按钮</ns-button>
      <ns-button type="info" plain disabled>信息按钮</ns-button>
      <ns-button type="warning" plain disabled>警告按钮</ns-button>
      <ns-button type="danger" plain disabled>危险按钮</ns-button>
    </el-row>
    <br>
    <el-row>
      <ns-button>默认按钮</ns-button>
      <ns-button size="medium">中等按钮</ns-button>
      <ns-button size="small">小型按钮</ns-button>
      <ns-button size="mini">超小按钮</ns-button>
    </el-row>
    <br>
    <el-row>
      <ns-button round>默认按钮</ns-button>
      <ns-button size="medium" round>中等按钮</ns-button>
      <ns-button size="small" round>小型按钮</ns-button>
      <ns-button size="mini" round>超小按钮</ns-button>
    </el-row>
  </div>
</template>
<script>
  export default {
    data () {
      return {}
    },
    methods: {
    },
    created () {
    },
    mounted () {
    }
  }
</script>
