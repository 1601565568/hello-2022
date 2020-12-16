<template>
  <div :class="{ borderHighLight: settingCode === code }">
    <i class="line bl"></i>
    <i class="line br"></i>
    <i class="line bt"></i>
    <i class="line bb"></i>
    <!-- <i class="circular rtl"></i>
    <i class="circular rtr"></i>
    <i class="circular rbl"></i>
    <i class="circular rbr"></i> -->
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    settingCode: {
      type: String
    },
    code: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
.borderHighLight {
  position: relative;
  i {
    position: absolute;
    display: inline-block;
  }
  .line {
    background: #0475f1;
  }
  .bl,
  .br {
    width: 3px;
    height: calc(100% - 4px);
  }
  .bl {
    border-left: 2px solid #cce5ff;
    top: 2px;
    left: 0px;
  }
  .br {
    border-right: 2px solid #cce5ff;
    top: 2px;
    right: 0px;
  }
  .bt,
  .bb {
    width: calc(100% - 4px);
    height: 3px;
  }
  .bt {
    border-top: 2px solid #cce5ff;
    top: 0px;
    left: 2px;
  }
  .bb {
    border-bottom: 2px solid #cce5ff;
    bottom: 0px;
    left: 2px;
  }
  // .circular {
  //   width: 8px;
  //   height: 8px;
  //   background: #fff;
  //   border: 1px solid #0475f1;
  //   border-radius: 50%;
  // }
  // .rtl {
  //   top: -2px;
  //   left: -2px;
  // }
  // .rtr {
  //   top: -2px;
  //   right: -2px;
  // }
  // .rbl {
  //   bottom: -2px;
  //   left: -2px;
  // }
  // .rbr {
  //   bottom: -2px;
  //   right: -2px;
  // }
}
</style>
