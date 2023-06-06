<template>
  <view class="header">
	  
    <view class="search-content">
		
			<view class="search-btn" @click="searchPro">
				<image class="search-icon" src="../../../../../static/img/searchImg.png" mode="widthFix">
				<view class="search-word">请输入搜索的商品名称</view>
			</view>
			
			<view class="icon">
				{{address}}
				<u-icon name="map" style="margin: auto;" color="#fff" size="40"></u-icon>
			</view>
			
	</view>
	
	<view class="warp">
		<view class="shopInfo">
			<view class="shopLogo">
				<image :src="this.shopItim.shopLogo" class="image"></image>
			</view>
			<view class="shopBase">
				<view class="shopTitle">{{this.shopItim.shopName}}</view>
				<view class="shopAddress">
					{{this.shopItim.shopAdress}}
				</view>
			</view>
			<view class="switchStore" @click="inquireShop" >
				切换门店
			</view>
		</view>
	</view>
		
		
		
		
	<view class="tabs-nav-warp">
    <scroll-view class="tabs-nav" scroll-x="true" v-if="componentContent.category && componentContent.category.length !==0">
      <view class="ul">
        <view class="li" :class="{'on':activeTab===0}" @click="tabChange(0)">首页</view>
        <view class="li" :class="{'on':activeTab===index+1}" v-for="(item,index) in componentContent.category" :key="index" @click="tabChange(index+1,item.id)">
          <!--<router-link :to="{name:'category',params:{classifyData:item}}">-->
            {{item.categoryName}}
          <!--</router-link>-->
        </view>
      </view>
    </scroll-view>
	</view>
  </view>
</template>

<script>
	
	const API = require('@/config/api')
	const request = require('@/utils/request')
  import {funMixin} from '../../../config/mixin'
	import qqmapsdk from "@/static/js/qqmap-wx-jssdk.min.js";
	const qqMap = new qqmapsdk({
		key:"CRDBZ-XQKC5-772IZ-Q47AA-6TGR7-F2FLU"
	})
	
	
  export default {
    name: 'cereHeader',
    mixins: [funMixin],
    props: {
      componentContent: {
        type: Object
      }
    },
    data () {
      return {
        activeTab: 0,
		address:"",
		src: 'https://img2.baidu.com/it/u=1145742942,4055967999&fm=26&fmt=auto&gp=0.jpg',
		shopItim:{},
      }
    },
	mounted() {
			uni.getLocation({
			    type: 'gcj02', //返回可以用于uni.openLocation的经纬度
			    success:  (res) => {
						console.log(res,"res");
			        const latitude = res.latitude;
			        const longitude = res.longitude;
			        qqMap.reverseGeocoder({
								location: {
									latitude: latitude,
									longitude: longitude
								},
								success: (res) => {
									var cityName = res.result.address_component.city;		//获取到的城市名
									this.address = cityName
								},
								fail:(res)=>{
									console.log(res);
								}
							})
			    }
			});
		},
    methods: {
      tabChange (index, id) {
        this.activeTab = index
        this.$emit('tabChange', index, id)
      },
	  
	  //这个请求是获取所有的商店名称,我重写了一个,这个是原生的
	  inquireShop(){
		  this.$toUrl('/pages/switchStore/switchStore')
		  request.request(API.GetAlwaysIndex,{},'POST').then(res=>{
			  console.log(res,11111111222222222)
			  
		  })
	  },

	  qiehuan(){
		  uni.getStorage({
			  key:"shopInfo",
			  success:(res)=> {
				this.shopItim = res.data
			  }
		  });
	  }
    },
	created() {
		this.qiehuan()
	},

  }
</script>

<style lang="scss" scoped>
  .header{
		.shopInfo {
			margin: 40rpx 0;
			padding: 30rpx 20rpx;
			display: flex;
			justify-content: space-between;
			background-color: #fff;
			border-radius: 20rpx;
			.shopLogo {
				width: 120rpx;
				margin: 0 auto;
				height: 100rpx;
				.image {
					width: 100rpx;
					height: 100rpx;
					border-radius: 8rpx;
				}
			}
		
			.shopBase {
				display: flex;
				flex: 1;
				flex-direction: column;
				justify-content: space-between;
		
				.shopTitle {
					font-size: 32rpx;
					font-weight: bold;
				}
		
				.shopAddress {
					margin-top: 10rpx;
					color: #7E7E7E;
					font-size: 24rpx;
				}
			}
		
			.switchStore {
				align-self: flex-end;
				color: red;
				margin-bottom: auto;
				padding: 0 14rpx;
				font-size: 23rpx;
				border-radius: 25rpx;
				border: 1rpx solid #00AA49;
				color: #00AA49;
			}
		}
    
	
	
	
	
	.logo {
      width: 190upx;
      height: 30upx;
      margin-left: 30upx;
    }
		.search-content{
			display: flex;
			margin-top: 30rpx;
			.icon{
				white-space: nowrap;
				color: #fff;
				margin: auto 20rpx;
			}
		}
    .search-btn {
      width: 690upx;
      height: 66upx;
      background: rgba(255, 255, 255, 1);
      border-radius: 33upx;
      display: flex;
      margin-left: 30upx;
      flex-direction: row;
      align-items: center;

      .search-icon {
        width: 36upx;
        height: 36upx;
        margin-left: 33upx;
      }

      .search-word {
        font-size: 26upx;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        margin-left: 10upx;
      }
    }
	.tabs-nav-warp{
	  margin-top: 20upx;
      padding:0 30upx;
	}
    .tabs-nav{
      .ul{
        display: flex;
        .li{
          flex: 1 0 auto;
          margin-left: 36upx;
          font-size: 30upx;
          color: #fff;
          position: relative;
          padding-bottom: 18upx;
          &:first-child{
            margin-left: 0;
          }
          &.on{
            &:after{
              content: '';
              width: 100%;
              height: 8upx;
              // background: url("../../../../../static/assets/img/xian.png") no-repeat center / 100% 100%;
              position: absolute;
              left: 0;
              bottom: 0;
            }
            font-weight:bold;
          }
        }
      }
    }
  }
</style>
