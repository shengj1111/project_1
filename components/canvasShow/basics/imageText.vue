<template>
  <view class="imageText warp" :class="['terminal'+terminal,'pos-' + componentContent.positionValue]">
    <view class="img-box img-left" @click="getLink(componentContent.linkObj)">
      <image class="img" :src="componentContent.imageUrl" alt="" mode="widthFix">
    </view>
    <view class="text">
      <h3 class="h3">{{componentContent.title}}</h3>
      <view v-html="componentContent.content"></view>
    </view>
    <view class="img-box img-right" @click="getLink(componentContent.linkObj)">
      <image class="img" :src="componentContent.imageUrl" alt="" mode="widthFix">
    </view>
  </view>
</template>

<script>
  import {funMixin} from '../config/mixin'
  export default {
    name: 'imageTextComponent',
    mixins: [funMixin],
    data () {
      return {
      }
    },
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

<style lang="scss" scoped>
  .imageText{
    display: flex;
		margin: 20rpx auto 0;
		width: 700rpx;
    justify-content: space-between;
    align-items: center;
    padding: 0 0 10rpx;
		background-color: #fff;
		border-radius: 0 0 10rpx 10rpx;
    .img-box{
      width: 50%;
      position: relative;
			padding: 20rpx;
	  .img{
		  width: 100%;
		  display: block;
			border-radius: 10rpx;
	  }
    }
    .text{
      width: 40%;
      .h3{
        font-size: 30px;
        margin-bottom: 24px;
      }
      .p{
        font-size: 16px;
      }
    }
    &.pos-top{
      display: block;
      text-align: center;
      .img-box{
        width: 100%;
      }
      .text{
        width: 100%;
        margin-top: 30px;
      }
      .img-right{
        display: none;
      }
    }
    &.pos-bottom{
      display: block;
      text-align: center;
      .img-box{
        width: 100%;
      }
      .text{
        width: 100%;
        margin-bottom: 30px;
      }
      .img-left{
        display: none;
      }
    }
    &.pos-left{
      .img-right{
        display: none;
      }
    }
    &.pos-right{
      .text{
        padding-left: 20px;
      }
      .img-left{
        display: none;
      }
    }
  }
</style>
