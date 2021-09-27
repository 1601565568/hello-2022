<template>
  <div class="item-view">
    <el-form :rules="rules"
      label-width="100px"
      label-position="left"
      size="medium"
      class="normal-from">
      <el-form-item
        label="头像样式"
        prop="name"
        class="larger-item"
      >
        <div class="radio-view">
          <div class="base-view" @click="genderClick(0)">
            <span :class="gender == 0 ? 'iconfont icon-ns_arrow-circle-leftfuben6 icon-color': 'iconfont icon-ns-succeed'"></span>
            <img :class="gender == 0 ? 'base-view-img base-view-img-sel' : 'base-view-img'" src="@/assets/default-avatar.png">
          </div>
          <div class="base-view" @click="genderClick(1)">
            <span :class="gender == 1 ? 'iconfont icon-ns_arrow-circle-leftfuben6 icon-color': 'iconfont icon-ns-succeed'"></span>
            <img :class="gender == 1 ? 'base-view-img base-view-img-radius base-view-img-sel' : 'base-view-img base-view-img-radius'"  src="@/assets/default-avatar.png">
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'headeImg',
  data () {
    return {
      gender: 0,
      rules: {
        name: [
          { required: true, message: '请选择头像样式', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    genderClick (index) {
      this.gender = index
    }
  }
}
</script>

<style scoped>
.radio-view {
  display: flex;
  flex-direction: row;
}
.base-view {
  display: flex;
  flex-direction: row;
  height: 48px;
  margin-right: 20px;
}

.base-view-img {
  width: 48px;
  height: 48px;
  border: 1px solid #FFFFFF;
  border-radius: 4px;
  margin-left: 8px;
}
.base-view-img-sel {
  border: 1px solid #0094FC;
}
.base-view-img-radius {
  border-radius: 50%;
}
.item-view {
  margin-top: 24px;
  margin-bottom: 24px;
}
.icon-color {
  color: #0094FC;
}
</style>
