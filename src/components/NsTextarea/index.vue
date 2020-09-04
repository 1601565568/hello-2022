<template>
  <div class="ns-textarea">
    <div v-if="placeholder && !innerValue" class="ns-textarea__placeholder">{{placeholder}}</div>
    <div
      ref="textarea"
      contenteditable="true"
      class="el-textarea__inner ns-textarea__input"
      :style="customStyle"
    >
      <!-- Hello world! <span class="tag" contenteditable="false">asdasd</span> -->
    </div>
    <div v-if="showWordLimit && this.maxlength" class="ns-textarea__limit">{{this.getLength()}}/{{this.maxlength}}</div>
  </div>
</template>
<script>
import index from './src/index.js'
export default index
</script>
<style scoped>
@import "@theme/variables.pcss";
@component-namespace ns {
  @b textarea {
    position: relative;
    width: 100%;
    background-color: var(--theme-color-white);
    @e input {
      padding: var(--default-padding-small);
      width: 100%;
      overflow: auto;
      resize: none;
      user-modify: read-write-plaintext-only;
      -webkit-user-modify: read-write-plaintext-only;
      white-space: pre-wrap;
    }
    @e placeholder {
      position: absolute;
      top: 6px;
      left: 6px;
      font-size: inherit;
      line-height: 1.5;
      color: #BFBFBF;
      pointer-events: none;
    }
    @e limit {
      color: #DDDDDD;
      background: var(--theme-color-white);
      position: absolute;
      font-size: var(--default-font-size-small);
      bottom: var(--default-padding-small);
      right: var(--default-padding-larger);
    }
  }
  >>> .ns-textarea__tag {
    padding: 2px var(--default-padding-small);
    background-color: #f2f2f2;
    transform: scale(.9);
    transform-origin: center;
    display: inline-block;
    border-radius: 16px;
  }
}
</style>
