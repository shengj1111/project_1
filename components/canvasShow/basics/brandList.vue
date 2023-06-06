<template>
  <view class="brand-list warp" :class="'terminal' + terminal">
    <h2 class="hom-title" :style="{textAlign:componentContent.textAlign}">{{componentContent.title}}</h2>
    <view class="content-warp">
      <view class="ul clearfix">
        <view class="li" v-for="(item, index) in componentContent.imgList" :key="index" @click="getLink(item.linkObj)">
			    <view class='item'>
				    <view class="imgBox">
              <image class="img" :src="item.imgData" v-show="item.imgData" :alt="item.title" mode="widthFix"></image>
            </view>
				    <h4 class="h4">{{item.title}}</h4>
			    </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {funMixin} from '../config/mixin'
  export default {
    name: 'brandList',
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
  .brand-list{
    padding: 20upx 0;
    .hom-title{
      font-size: 36upx;
      color: #333;
      line-height: 1em;
      margin-bottom: 23upx;
      font-weight: bold;
    }
    .content-warp{
      display: flex;
    }
    .first{
      width: 24%;
      padding-top: 10upx;
      .item{
        background-color: #7A8594;
        height: 336upx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .h3{
          font-size: 30upx;
          line-height: 46upx;
          margin-bottom: 10upx;
        }
      }
    }
    .ul{
      width: 100%;
      .li{
        width: 25%;
        float: left;
        padding: 10upx 0 0 10upx;
        .item{
          height: auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .imgBox {
            background-color: #cacaca;
            position: relative;
			.img{
				width: 100%;
				display: block;
			}
          }
          .h4{
            font-size: 24upx;
            color: #333333;
            text-align: center;
            height: 40upx;
            line-height: 40upx;
			font-weight: normal;
          }
          .p{
            font-size: 12upx;
            margin: 7upx 0 12upx;
          }

          .link{
            width: 87upx;
            height: 25upx;
            line-height: 25upx;
            text-indent: 10upx;
            background: rgba(17, 17, 17, 0.1);
            border-radius: 13upx;
            position: relative;
            font-size: 12upx;
            &:after{
              content: '';
              display: block;
              width: 18upx;
              height: 18upx;
              position: absolute;
              right: 4upx;
              top: 50%;
              margin-top: -9upx;
              // background: url(../../../static/assets/images/cereshop/home/chakan.png) no-repeat center;
            }
          }
        }
      }
    }
  }
  @media screen and (max-width: 768px) {
    .brand-list{
      .content-warp{
        display: block;
      }
      .first{
        width: 100%;
      }
      .ul{
        width: auto;
        margin-left: -10px;
        .li{
          width: 50%;
        }
      }
    }
  }
  .terminal1,.terminal2,.terminal3{
    &.brand-list{
      .content-warp{
        display: block;
      }
      .first{
        width: 100%;
      }
      .ul{
        width: auto;
        margin-left: -10px;
        .li{
          width: 50%;
          .item {
            padding-left: 0;
          }
        }
      }
    }
  }
</style>
