<template>
  <ns-area @change="onChange"
           :props="key"
           v-model="selectedOptions3">
  </ns-area>
</template>
<script>
import NsArea from 'components/NsArea'
export default {
  components: { NsArea },
  data () {
    return {
      key: {
        children: 'children',
        label: 'label',
        value: 'id',
        disabled: 'disabled'
      },
      selectedOptions3: [110000, 110100]
    }
  },
  methods: {
    onChange (data) {
      console.log(data)
    },
    onActiveItemChange (data) {
      // console.log(data)
    },
    onBlur (Event) {
      // console.log(Event)
    },
    onFocus (Event) {
      // console.log(Event)
    }
  }
}
</script>
