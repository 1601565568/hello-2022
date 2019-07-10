<template>
  <div>
    <NsTableFriend ref="mainTable" :url=$api.guide.friendData.findList @add="onRedactFun"
                    @dimission="dimission" @removeDuplicate="removeDuplicate"
                   @onRedactFun="onRedactFun"  @handleSelectionChange="handleSelectionChange">
    </NsTableFriend>
  </div>
</template>

<script>
import List from './src/List'
import NsTableFriend from './NsTableFriend'
List.components = {
  NsTableFriend
}
export default List
</script>

<style scoped>

</style>
