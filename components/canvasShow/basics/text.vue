<template>
  <view class="text warp" :class="['text-'+componentContent.textPos,{'show-more':componentContent.showMore}]" :style="{backgroundColor:componentContent.bgColor}">
    <view class="line-warp" :class="{'borderBot':componentContent.showLine}">
      <h3 class="h3" :style="{fontSize:componentContent.fontSizeNum+'upx',fontWeight:componentContent.textFontW,color:componentContent.titColor}">{{componentContent.title}}</h3>
      <p class="p" :style="{fontSize:componentContent.describeSizeNum+'upx',fontWeight:componentContent.describeFontW,color:componentContent.describeColor}">{{componentContent.describe}}</p>
      <view class="btn-more" v-show="componentContent.showMore" :class="'style'+componentContent.styleValue"><text class="span">查看更多</text><i class="iconfont icon-arrow-right"></i></view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'textComponent',
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
  .text{
    position: relative;
		width: 700rpx;
		top: 30rpx;
		border-radius: 20rpx 20rpx 0 0;
		overflow: hidden;
    .line-warp{
      padding:20px 30rpx 10rpx;
			background-color: #fff !important;
    }
    .borderBot{
      // border-bottom: 1px solid #cccc;
			border: none;
    }
    .h3{
      line-height: 1.5;
    }
    .p{
      line-height: 1.5;
      margin-top: 5px;
    }
    .style1{

    }
    .style2{
      .iconfont{
        display: none;
      }
    }
    .style3{
      .span{
        display: none;
      }
    }
    &.text-left{
      text-align: left;
      &.show-more{
        position: relative;
        margin: 0 auto;
        .btn-more{
          position: absolute;
          right: 20rpx;
          top: 20px;
        }
      }
    }
    &.text-center{
      text-align: center;
    }
    &.text-right{
      text-align: right;
    }
  }
</style>
