<template>
  <div>
  <div class="instructions-content">
    <!--<ns-button type="text" class="instructions-btn" @click="instructionsState = !instructionsState"><i class="el-icon-question"></i>  帮助说明</ns-button>-->
    <div class="instructions-content__info">
      <!-- v-if="instructionsState" -->
      1.销售趋势分析用于反映某个时间内的销售数据的波动变化情况，常用于大促时销售数据变化的跟踪；<br>
      2.当付款时间为1天，数据按小时展示；当付款时间在（1天，1月）之间，数据按天展示；当付款时间大于1个月，数据按照月展示；<br>
      3.订单金额与商品件数不排除补差价商品。<br>
    </div>
  </div>
    <div class="form-grid">
      <el-form-grid block style="margin:10px 0;">
        <el-tooltip placement="right" effect="light" content="详细内容说明">
          <i class="el-icon-info"></i>
        </el-tooltip>
      </el-form-grid>
      <el-form-grid block style="margin:10px 0;">
        <div class="tmp-tips text-info"><i class="el-icon-info"></i>
          提示语基础类型
        </div>
      </el-form-grid>
      <el-form-grid block style="margin:10px 0;">
        <div class="tmp-tips text-warning"><i class="el-icon-warning"></i>
          提示语警告类型
        </div>
      </el-form-grid>
      <el-form-grid block style="margin:10px 0;">
        <div class="tmp-tips text-error"><i class="el-icon-error"></i>
          提示语严重警告或错误类型
        </div>
      </el-form-grid>
      <el-form-grid block style="margin:10px 0;">
        <div class="tmp-tips text-success"><i class="el-icon-success"></i>
          提示语成功类型
        </div>
      </el-form-grid>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        instructionsState: false
      }
    }
  }
</script>
