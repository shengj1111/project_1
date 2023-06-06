<template>
  <div class="videoBox warp" :class="'terminal' + terminal">
    <div class="videoLeftBox">
      <h3>{{componentContent.title}}</h3>
      <div v-html="componentContent.mainBody"></div>
    </div>
    <div class="videoRightBox">
		<video class="myVideo" id="myVideo" objectFit="fill" :src="componentContent.videoUrl" controls></video>
    </div>
    <div class="clear"></div>
  </div>
</template>

<script>
// import 'video.js/dist/video-js.css'
// import { videoPlayer } from 'vue-video-player'
export default {
  name: 'videoBox',
  props: {
    terminal: {
      type: Number,
      default: 4
    },
    componentContent: {
      type: Object
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
	.videoBox{
		padding: 0 20rpx;
		box-sizing: border-box;
		border-radius: 0 0 20rpx 20rpx;
		background-color: #fff !important;
	}
  .myVideo{
    // max-height: 300rpx;
		border-radius: 0rpx;
  }
 .videoBox {
   padding: 20upx 0;
   width: 700rpx;
   margin: 0 auto;
   display: flex;
   justify-content: flex-start;
   align-items: center;
   .videoLeftBox {
     width: 50%;
     padding-right: 10%;
     h3 {
       font-size: 36upx;
       color: #333333;
       margin-bottom: 30upx;
     }
     p {
       color: #333333;
       font-size: 14upx;
       line-height: 30upx;
     }
   }
   .videoRightBox {
     width: 50%;
     video {
       width: 100%;
     }
   }
   .clear {
     clear: both;
   }
 }
 .terminal1,.terminal2,.terminal3{
   &.videoBox{
     display: block;
     .videoLeftBox{
       width: 100%;
       text-align: center;
       margin-bottom: 20upx;
     }
     .videoRightBox {
       width: 100%;
     }
   }
 }
</style>
