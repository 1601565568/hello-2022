<template>
  <div>
    <Phone>
      <template v-slot:content>
        <div class="content-view">
          <div>
            <img class="phone-view" src="../Images/iphoneName.jpg"/>
          </div>
        </div>
      </template>
    </Phone>
  </div>
</template>

<script>
import Phone from './Phone'
export default {
  name: 'activephone',
  components: {
    Phone
  }
}
</script>

<style scoped>
.content-view {
  position: relative;
  height: 100%;
}
.phone-view {
  width: 320px;
  height: 64px;
  margin-bottom: 12px;
  object-fit: contain;
}
</style>
