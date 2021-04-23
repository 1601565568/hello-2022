<template>
  <div class="text-message">
    {{content.content}}
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default: function () {
        return {
          type: 'text',
          content: ''
        }
      }
    }
  },
  data () {
    return {}
  },
  mounted () {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.text-message {
  color: #383838;
  width: 100%;
  max-height: 161px;
  overflow: hidden;
}
</style>
