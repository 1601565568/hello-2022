<template>
<!-- 选择商品弹窗 wanrengang 20180718 -->
  <div class="goodsDialogBox">
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="960px"
        >
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
            <ns-button @click="dialogVisible = false">取 消</ns-button>
            <ns-button type="primary" @click="dialogVisible = false">确 定</ns-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    itemObj: Object
  },
  data () {
    return {
      dialogVisible: true
    }
  },
  created: function () {},
  methods: {}
}
</script>
<style scoped>

</style>
