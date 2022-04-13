<template>
  <div>
    <template v-if='cloudPlatformType === "ecrp"'>
      <NsGuideDialog v-bind="$attrs" v-on="$listeners">
        <template slot='selfBtn'>
          <slot name='selfBtn'></slot>
        </template>
      </NsGuideDialog>
    </template>
    <template v-else>
      <NsGuideWeChatDialog v-bind="$attrs" v-on="$listeners">
        <template slot='selfBtn'>
          <slot name='selfBtn'></slot>
        </template>
      </NsGuideWeChatDialog>
    </template>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import NsGuideDialog from '@/components/NsGuideDialog'
import NsGuideWeChatDialog from '@/components/NsGuideWeChatDialog'
export default {
  components: { NsGuideDialog, NsGuideWeChatDialog },
  computed: mapState({
    // 环境判断
    cloudPlatformType: state => state.user.remumber.remumber_login_info.productConfig.cloudPlatformType
  })
}
</script>
