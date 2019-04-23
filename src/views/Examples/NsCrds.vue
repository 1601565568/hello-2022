<template>
<div>
  {{$store.state.CRDS.count}}
  <ns-button @click="onCommit">commit</ns-button>
  <ns-button @click="onGetCount">  getCount</ns-button>
  <ns-button @click="onGetMax">  onGetMax</ns-button>
</div>
</template>
<script>
import NsArea from 'components/NsArea'
import NsButton from '../../components/global/NsButton'
export default {
  components: { NsButton, NsArea },
  data () {
    return {
    }
  },
  methods: {
    onCommit () {
      // 更新
      this.$store.dispatch('update_count', {
        num: 1
      })
    },
    onGetCount () {
      console.log(this.$store.getters.getCount)
    },
    onGetMax () {
      console.log(this.$store.getters.getMax(3))
    }

  },
  created () {
    console.log(this.$store.state.CRDS.count)
  }
}
</script>
