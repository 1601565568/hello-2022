<!--
 * @Descripttion: 使用渠道
 * @Author: yuye.huang
 * @Date: 2020-03-02 21:28:40
 * @LastEditors: yuye.huang
 * @LastEditTime: 2020-03-02 22:42:29
 -->
<template>
  <el-dialog :visible.sync="model.visible"
             :title="titleName"
             width="400px">
    <el-table :data="channelList">
      <el-table-column property="channelName" label="渠道名称" align="left"></el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <ns-button @click="onCloseDialog">关闭</ns-button>
    </div>
  </el-dialog>
</template>
<script>

export default {
  props: {
    data: {
      type: Object,
      default () {
        return {
          visible: false
        }
      }
    },
    channelList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      titleName: '使用渠道'
    }
  },
  mounted () {
  },
  methods: {
    /**
      * @msg: 关闭弹框
      */
    onCloseDialog () {
      this.model.visible = false
    }
  },
  computed: {
    model: {
      get: function () {
        return this.data
      }
    }
  }
}
</script>
