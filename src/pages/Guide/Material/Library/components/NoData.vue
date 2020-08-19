<template>
  <div v-if="isShow" class="empty-wrapper">
    <img alt="" :src="NO_DATA_IMG" />
    <div class="empty-wrapper__text">{{placeholder}}</div>
  </div>
</template>
<script>
import { NO_DATA_IMG } from '@/utils/constants'
export default {
  props: {
    placeholder: {
      type: String,
      default () {
        return '暂无数据'
      }
    },
    isShow: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      NO_DATA_IMG
    }
  },
  methods: {}
}
</script>
<style scoped>
@component-namespace empty {
  @b wrapper {
    margin: 225px 0;
    width: 100%;
    text-align: center;
    > img {
      width: 240px;
      height: 150px;
    }
    @e text {
      margin-top: 20px;
      font-size: 14px;
      color: #595959;
      line-height: 22px;
    }
  }
}
</style>
