<template>
  <div class='move-content'>
    <draggable v-model="list" animation="300"  filter=".forbid">
      <transition-group>
        <template v-for="(item, index) in list">
          <div :key='index' class="img-content">
            <img :src='item'>
            <div class=''></div>
          </div>
        </template>
        <div :key='-1' class="img-content forbid">
          <ElUpload accept=".jpg,.jpeg,.png,.mp4" :show-file-list='false' :action="$api.core.sgUploadFile('test')" :on-success="handleUploadSuccess"/>
        </div>
      </transition-group>
    </draggable>
  </div>
</template>
<script>
import ElUpload from '@nascent/nui/lib/upload'
import draggable from 'vuedraggable'
export default {
  data () {
    return {
      list: [...this.value]
    }
  },
  props: {
    value: {
      default: []
    }
  },
  components: { draggable, ElUpload },
  methods: {
    handleUploadSuccess (res) {
      this.$emit('input', [...this.list, res.result.url])
    }
  },
  watch: {
    value (newVal) {
      this.list = [...newVal]
    }
  }
}
</script>
<style lang="scss" scoped>
.move-content {
  width: 210px
}
.img-content {
  height: 60px;
  width: 60px;
  margin-right: 8px;
  margin-bottom: 8px;
  border-radius: 2px;
  float: left;
  cursor: move;
  img {
    width:100%;
    height:100%;
  }
  &.forbid {
    background: #FFFFFF;
    border: 1px dashed #D9D9D9;
    cursor: pointer;
  }
}
</style>
<style scoped>
.forbid >>> .el-upload {
    width: 60px;
    height: 60px;
}

</style>
