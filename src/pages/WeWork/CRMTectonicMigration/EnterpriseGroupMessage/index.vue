<template>
  <div class="template-page">
     <ns-table-friend-message></ns-table-friend-message>
  </div>
</template>

<script>
import index from './src'
import NsTableFriendMessage from './NsTableFriendMessage'
index.components = {
  NsTableFriendMessage
}
export default index
</script>
