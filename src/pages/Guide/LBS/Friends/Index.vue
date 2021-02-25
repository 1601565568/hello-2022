<template>
  <List type='Friends'/>
</template>
<script>
import Index from './src/index'
import List from '../components/List/Index'
Index.components = {
  List
}
export default Index
</script>
