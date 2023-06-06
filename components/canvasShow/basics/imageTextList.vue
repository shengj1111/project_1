<template>
  <view class="hom-pro-list warp" :class="'terminal'+terminal">
    <view class="title">
      <h2 class="h2" :style="{textAlign:componentContent.textAlign}">{{componentContent.title}}</h2>
      <!--<a class="btn">查看全部</a>-->
    </view>
    <view class="ul clearfix" :class="{imgTextNum4: componentContent.imgTextData.length === 4, imgTextNum5: componentContent.imgTextData.length === 5, imgTextStyle: componentContent.imgTextData.length >= 6 || componentContent.imgTextData.length === 3}">
      <view class="li" v-for="(item,index) in componentContent.imgTextData" :key="index">
        <view class="item" @click="getLink(item.linkObj)">
          <view class="itemImgBox" v-show="item.isShow">
            <view class="imgBox">
              <image class="img" :src="item.imgData" v-show="item.imgData" :alt="item.title" mode="widthFix">
            </view>
          </view>
          <view class="text">
            <h4 class="h4">{{item.title}}</h4>
            <p class="p">{{item.describe}}</p>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {funMixin} from '../config/mixin'
  export default {
    name: 'imageTextList',
    mixins: [funMixin],
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
  .hom-pro-list{
    padding: 20upx 0;
	width: 690upx;
	margin: 0 auto;
    .title{
      margin-bottom: 23upx;
      position: relative;
      .h2{
        font-size: 36upx;
        color: #333;
        line-height: 1em;
        font-weight: bold;
      }
      .btn{
        position: absolute;
        right: 0;
        top: 0;
        line-height: 22upx;
        padding-right: 30upx;
        &:after{
          content: '';
          display: block;
          width: 20upx;
          height: 20upx;
          position: absolute;
          right: 0px;
          top: 50%;
          margin-top: -10upx;
          // background: url('../../../static/assets/images/cereshop/home/quanb.png') no-repeat center;
        }
      }
    }
    .ul{
      margin: -15upx 0 0 -15upx;
      display: flex;
      flex-wrap: wrap;
      .li{
        flex: 0 0 50%;
        padding: 15upx 0 0 15upx;
        .item{
          .itemImgBox {
            height: auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .imgBox {
              background-color: #cacaca;
              position: relative;
			  .img{
				  display: block;
				  width: 100%;
			  }
            }
          }
          .text{
            padding:16upx 20upx;
            text-align: center;
            .h4{
				font-size: 24upx;
              line-height: 25upx;
              overflow: hidden;
              color: #333333;
			  font-weight: normal;
            }
            .p{
				font-size: 20upx;
              color: #666666;
              padding: 5px 0 10px;
            }
          }
        }
      }
    }
    .imgTextNum4 {
      .li {
        flex: 0 0 50%;
      }
    }
    .imgTextNum5 {
      .li {
        flex: 0 0 33.33%;
      }
      .li:nth-child(1) {
        flex: 0 0 50%;
      }
      .li:nth-child(2) {
        flex: 0 0 50%;
      }
    }
    .imgTextStyle {
      .li {
        flex: 0 0 33.33%;
      }
    }
  }
  @media screen and (max-width: 768px) {
    .hom-pro-list .ul .li{
      width: 50%;
    }
  }
  .terminal1,.terminal2,.terminal3{
    &.hom-pro-list .ul .li{
      width: 0;
	  flex: 0 0 50%;
    }
  }
</style>
