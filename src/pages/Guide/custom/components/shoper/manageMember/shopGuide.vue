<template>
  <div class="storeGuide">
    <div class="storeGuide-title">
      门店导购
    </div>
    <div class="storeGuide-table__title storeGuide-table__bg">
      <div class="storeGuide-table__title__name">姓名（工号）</div>
      <div class="storeGuide-table__title__achieve" v-if="editData[0] && editData[0].status === 1">月销售指标/元</div>
      <div class="storeGuide-table__title__norm" v-if="editData[1] && editData[1].status === 1">月招募指标/位</div>
      <div class="storeGuide-table__title__operation" v-if="editData[2] && editData[2].status === 1">操作</div>
    </div>
    <div class="storeGuide-table__title storeGuide-table__border">
      <div class="storeGuide-table__title__name">导购姓名</div>
      <div class="storeGuide-table__title__achieve" v-if="editData[0] && editData[0].status === 1">0</div>
      <div class="storeGuide-table__title__norm" v-if="editData[1] && editData[1].status === 1">0</div>
      <div class="storeGuide-table__title__operation" v-if="editData[2] && editData[2].status === 1">管理</div>
    </div>
    <div class="storeGuide-table__title storeGuide-table__border">
      <div class="storeGuide-table__title__name">导购姓名</div>
      <div class="storeGuide-table__title__achieve" v-if="editData[0] && editData[0].status === 1">未设</div>
      <div class="storeGuide-table__title__norm" v-if="editData[1] && editData[1].status === 1">未设</div>
      <div class="storeGuide-table__title__operation" v-if="editData[2] && editData[2].status === 1">管理</div>
    </div>
  </div>
</template>
<script>
import componentData from '../../mixins/componentData.js'
export default {
  name: 'shopGuide',
  mixins: [componentData]
}
</script>

<style lang="scss" scoped>
.storeGuide {
  padding-bottom: 8px;
  margin-bottom: 8px;
  background: #fff;
  color: #262626;
  .storeGuide-title {
    padding: 0 16px;
    height: 48px;
    line-height: 48px;
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 4px;
  }
  .storeGuide-table__bg {
    background: #f5f5f5;
  }
  .storeGuide-table__title {
    margin: 0 16px;
    display: flex;
    justify-content: space-between;
    border-radius: 4px 4px 0 0;
    font-size: 13px;
    height: 48px;
    div {
      line-height: 48px;
      text-align: center;
    }
    .storeGuide-table__title__name {
      width: 28%;
      padding-left: 4%;
      text-align: left;
    }
    .storeGuide-table__title__achieve {
      width: 30%;
    }
    .storeGuide-table__title__norm {
      width: 30%;
    }
    .storeGuide-table__title__operation {
      width: 12%;
      text-align: left;
    }
  }
  .storeGuide-table__border {
    border-bottom: 1px solid #e8e8e8;
    &:last-child {
      border-bottom: 1px solid transparent;
    }
    .storeGuide-table__title__name {
      text-align: left;
       padding-left: 4%;
    }
    .storeGuide-table__title__achieve {
      padding-left: 8px;
      text-align: left;
    }
    .storeGuide-table__title__norm {
      padding-left: 8px;
      text-align: left;
    }
    .storeGuide-table__title__operation {
      width: 12%;
      text-align: left;
      color: #1158bc;
    }
  }
}
</style>
