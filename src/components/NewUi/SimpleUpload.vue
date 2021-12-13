<template>
  <div class='simple-updata'>
    <el-avatar v-if="value" shape="square" :size="100" fit="contain" :src="value"></el-avatar>
    <div v-else class='default-updata'>
      <Icon type="plus" className="company-upload__tip"/>
    </div>
    <div class='upload-content'>
      <div class='upload-box'>
        <Icon type="ns-deal" class='icon'/>
      </div>
      <drap-upload  v-bind="$attrs" :value='url' :drag='false' @input='(e)=>{$emit("input",e)}'>
      </drap-upload>
    </div>
  </div>
</template>
<script>
import DrapUpload from '@/components/NewUi/DrapUpload'
import ElAvatar from '@nascent/nui/lib/avatar'
export default {
  data () {
    return {
      url: ''
    }
  },
  props: {
    value: {}
  },
  components: { DrapUpload, ElAvatar },
  watch: {
    value (newVal) {
      this.url = newVal
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./styles/reset.css";
.simple-updata {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}
.simple-updata .remind-text {
  position: relative;
  top: 5px;
  margin-left: 8px;
}
.upload-content {
  position: absolute;
  top: 0;
  left: 0;
  height: 100px;
  width: 100px;
  .upload-box {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,.45);
    line-height: 100px;
    text-align: center;
    .icon {
      color:#fff;
      font-size: 16px;
    }
  }
  &:hover {
    .upload-box {
      display:block;
    }
  }
}
.simple-updata .default-updata{
  height: 100px;
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFFFFF;
  border: 1px dashed #D9D9D9;
  border-radius: 2px;
}
</style>
<style scoped>
.simple-updata .default-updata .company-upload__tip {
  font-size: 24px;
  color: #ddd;
}
.simple-updata >>> .upload-demo .el-upload {
  position: absolute;
  top:0;
  left: 0;
  right: 0;
  bottom: 0;
}
.simple-updata >>> .poster-content{
  opacity: 0;
  padding: 0;
}
.simple-updata >>> .el-upload-list {
  display: none;
}
.simple-updata >>> .poster-set_content {
  display: none
}
.simple-updata >>> .padingbottom {
  display: none;
}
</style>
