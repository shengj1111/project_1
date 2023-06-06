<template>
  <view class="div" :style="{backgroundColor:componentContent.bgColor,height:componentContent.height + 'rpx'}"></view>
</template>

<script>
  export default {
    name: 'assistDiv',
    props: {
      terminal: {
        type: Number,
        default: 4
      },
      componentContent: {
        type: Object
      }
    }
  }
</script>

<style scoped>
  .div{
    width: 100%;
  }
</style>
