<template>
  <vueCropper
    ref="cropper"
    :img="img"
></vueCropper>
</template>
<script>
import { VueCropper } from 'vue-cropper'
export default {
  components: {
    VueCropper
  },
  props: {
    img: {}
  }
}
</script>
