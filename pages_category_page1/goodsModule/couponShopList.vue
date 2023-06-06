<template>
	<view class="container">
		<!-- 商品列表 -->
		<view v-if="list.length>0">
			<view v-for="(item, index) in list" :key="index" class="goodsDetails-box flex-display flex-column mar-left-30" @click="goodsDateils(item.shopId,item.productId,item.skuId)">
				<view v-if="item.activityType == 0" class="goodsDetails flex-items-plus flex-row mar-top-30">
					<image class="goodsImg" :src="item.image"></image>
					<view class="mar-left-30">
						<view class="goodsName-box overflowNoDot">
							<label class="goodsName fs26">{{item.productName}}</label>
						</view>
						<view class="priceBuyNum-box mar-top-20">
							<label class="fs24 font-color-FF7800">¥</label>
							<label class="fs36 font-color-FF7800 mar-left-10">{{item.price}}</label>
							<label class="fs24 font-color-999 mar-left-10" v-if="item.users != null">{{item.users}}人付款</label>
							<label class="fs24 font-color-999 mar-left-10" v-else>0人付款</label>
						</view>
						<view class="flex-display flex-sp-between flex-row mar-top-10 flex-items">
							<label class="fs22 font-color-999">{{item.shopName}}</label>
							<image class="arrowImg" src="../../static/img/user/arrow.png"></image>
						</view>
					</view>
				</view>
				<view v-else class="spikeList">
				  <view class="listItem">
				    <view class="itemBox">
				      <img :src="item.image">
				    </view>
				    <view class="itemInfo mar-top-30">
				      <p>{{item.productName}}</p>
				      <view class="number" v-if="item.users != null">{{item.users}}人付款 <span v-if="item.total !=0">，限量{{item.total}}件</span></view>
					  <view class="number" v-else>0人付款<span v-if="item.total !=0">，限量{{item.total}}件</span></view>
					  <view class="flex-row-plus flex-item mar-top-30">
							<view class="discountsPriceLine font-color-999">¥{{item.originalPrice}}</view>
							<view class="mar-left-30 font-color-FF7800 flex-row-plus">
								<label v-if="item.activityType == 1" class="fs30">拼团价</label>
								<label v-if="item.activityType == 2" class="fs30">秒杀价</label>
								<label v-if="item.activityType == 3" class="fs30">折扣价</label>
								<b>￥</b>
								<label class="fs28">{{item.price}}</label>
							</view>
					  </view>
					  <view class="flex-display flex-sp-between flex-row mar-top-10 flex-items">
					  	<label class="fs22 font-color-999">{{item.shopName}}</label>
					  	<image class="arrowImg" src="../../static/img/user/arrow.png"></image>
					  </view>
				    </view>
				  </view>
				</view>
			</view>
		</view>

		<!-- 搜索为空 -->
		<view v-else class="emptyCart-box flex-items-plus flex-column">
			<image class="emptyCart-img" src="../../static/images/searchEmpty.png"></image>
			<label class="font-color-999 fs26 mar-top-30">无可用商品</label>
		</view>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		data() {
			return {
				page: 1,
				pageSize: 20,
        activityId: null,
        shopCouponId: null,
				list:[],
				loadingType:0
			}
		},
		onLoad(option) {
      if(option.shopCouponId){
        this.activityId = option.activityId
        this.shopCouponId = option.shopCouponId
      }
			this.searchList(1)
		},
		methods: {
			searchList(type){
				wx.showLoading({
				      title: '加载中...',
				})
				if(type == 1){
					this.list = []
					this.page = 1
				}
				if(this.shopCouponId){
					NET.request(API.getCouponProducts, {
            activityId: this.activityId,
            shopCouponId: this.shopCouponId,
					  page:this.page,
					  pageSize:this.pageSize
					}, 'GET').then(res => {
						if(res.data.list.length == 0){
							this.loadingType = 1
							this.page = this.page
						}
						uni.hideLoading()
						this.list = this.list.concat(res.data.list)
					}).catch(res => {
						uni.hideLoading()
					})
				}
			},
      onReachBottom(){
        if(this.loadingType == 1){
          uni.stopPullDownRefresh()
        }else{
          this.page = this.page+1
          this.searchList(0)
        }
      },
			//商品详情
			goodsDateils(shopId,productId,skuId){
				uni.navigateTo({
					url: '/pages_category_page3/merchants/goodsDetails?shopId='+shopId + '&productId='+productId +'&skuId='+skuId
				})
			}
		}
	}
</script>

<style lang="scss">
	input{padding-left: 80upx;}
	.container{
		height: 100%;
		.emptyCart-box{
			margin-top: 70upx;
			.emptyCart-img{
				width: 270upx;
				height: 270upx;
			}
		}
		.searchImg{
			width: 36upx;
			height: 36upx;
			position: absolute;
			left: 60upx;
		}
		.search-box{
			background-color: #F7F7F7;
			border-radius: 33upx;
			width: 530upx;
			height: 66upx;
		}
		.searchboxPlace{
			font-size: 26upx;
			color: #A9A9A9;
			padding-right: 30upx;
		}
		.searchClose-icon{
			z-index: 997;
			width: 40upx;
			height: 40upx;
			margin-left: -50upx;
		}
		.promotion618{
			width: 130upx;
			height: 30upx;
		}
		.goodsDetails-box{
			width: 690upx;
			.goodsDetails{
				border-bottom: 1upx solid #EDEDED;
				padding-bottom: 30upx;
				.goodsName-box{
					width: 389upx;
					height: 85upx;
					.img618-cion{
						width:70upx;
						height:36upx;
					}
				}
				.goodsImg{
					width: 260upx;
					height: 260upx;
				}
				.discounts-box{
					margin-left: -10upx;
					margin-top: 20upx;
					.discounts-text{
						margin-left: 10upx;
						color: #FF7800;
						background-color: #FFE4CC;
						padding: 6upx 12upx;
						border-radius: 4upx;
					}
				}
				.arrowImg{
					width: 20upx;
					height: 20upx;
				}
			}


		}
		.spikeList {
			.arrowImg{
				width: 20upx;
				height: 20upx;
			}
		  // padding: 108upx 30upx 20upx 30upx;
		  padding-top: 30rpx;
		  border-bottom: 1upx solid #EDEDED;
		  .listItem {
		    display: flex;
		    // padding-bottom: 10upx;
		    border-bottom: 1upx solid #EEEEEE;
		    margin-bottom: 30upx;
		    &:last-child {
		      border-bottom: none;
		    }
		    .itemBox {
		      width: 260upx;
		      height: 260upx;
		      margin-right: 30upx;
		      img {
		        width: 100%;
		        height: 100%;
		      }
		    }
		    .itemInfo {
		      flex: 1;
		      p {
		        font-size: 26upx;
		        color: #333333;
		        line-height: 40upx;
		        margin-bottom: 20upx;
		        text-overflow: -o-ellipsis-lastline;
		        overflow: hidden;
		        text-overflow: ellipsis;
		        display: -webkit-box;
		        -webkit-line-clamp: 2;
		        line-clamp: 2;
		        -webkit-box-orient: vertical;
		      }
		      .number {
		        color: #999999;
		        font-size: 26upx;
		      }
		    }
		  }
		}
	}
</style>
