<template>
  <el-dialog
    ref="channelDialog"
    width="640px"
    :visible="visible"
    title="选择渠道"
    @open="open"
  >
    <el-form ref="channelForm" label-width="100px" placement="right">
      <el-select
        multiple
        v-model="channelIds"
        style="width:600px"
        filterable
        placeholder="请选择"
      >
        <el-option
          v-for="item in channelList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <ns-button @click="cancel" size="medium" :loading="loading">取 消</ns-button>
      <ns-button type="primary" size="medium" @click="confirm" :loading="loading">确 定</ns-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    content: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      loading: false,
      channelIds: [],
      channelList: []
    }
  },
  methods: {
    cancel () {
      this.$emit('update:visible', false)
    },
    open () {
      this.$http.fetch(this.$api.weWork.welcomeCode.findChannelList)
        .then((resp) => {
          this.channelList = resp.result
          if (this.content.length) {
            this.channelIds = this.content
          }
        }).catch((resp) => {
          this.$notify.error(resp.msg)
        })
    },
    confirm () {
      this.loading = true
      this.$emit('confirm', this.channelIds)
      this.cancel()
      this.loading = false
    }
  }
}
</script>

<style>
</style>
