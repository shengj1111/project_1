<template>
	<view class="shop">
		<view class="storeDisplay wrap">
			<view class="title">历史记录</view>

			<!-- 门店列表 -->
			<view class="shopItem" v-for="item in shopList" :key='item.shopId' @click="cutShop(item)">
				<view class="imgBox">
					<image :src="item.shopLogo" mode=""></image>
				</view>
				
				<view class="middle">
					<view class="ShopName">
						{{item.shopName}}
					</view>
					<view class="ShopName">
						{{item.chargePersonName}}
					</view>
					<view class="ShopName">
						{{item.chargePersonPhone}}
					</view>
					<view class="address">
						{{item.shopAdress}}
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')

	export default {
		data() {
			return {
				shopList: [], //历史门店列表
				shopListForm: {
					page: 1,
					pageSize: 10,
				},
				defaultShoplogo:"../../static/images/storeLogo.png",

			};
		},
		onLoad() {
			this.getUserShop1()
		},
		methods: {
			// 查询浏览商店记录
			getUserShop1(isConcat = 0) {
				NET.request(API.getUserShop, this.shopListForm, 'GET').then(res => {
					
					let list = res.data.list
					
					list.forEach(i=>{
						if(i.shopLogo==undefined || i.shopLogo==""){
							i.shopLogo=this.defaultShoplogo;
						}
					})
					
					
					if (isConcat) {
						this.shopList = this.shopList.concat(list)
					} else {
						
						this.shopList = list
					}
				})
			},
			//触底更新
			onReachBottom() {
				this.shopListForm.page++
				this.getUserShop1(1)
			},

			// 点击门店,切换页面,并且缓存门店信息
			cutShop(item) {
				// uni.navigateTo({
				// 	url: `../../pages_category_page1/store/index`,
				// })
				let _shopId = item.shopId;
				uni.setStorageSync('choice_shopid', _shopId);
				uni.switchTab({
					url: `/pages/homePage/homePage`,
				})
				// uni.redirectTo({
				// 	url: `../../pages/homePage/homePage?shopId=${i.shopId}`,
				// })
				// uni.navigateBack()
				// uni.switchTab({
				// 	url: `../../pages/tabbar/index`
				// })
				console.log(item, '商店详情')
				//window.location.reload()
				// uni.navigateTo({
				// 	url: `@/pages/homePage/homePage`,
				// })
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		width: 700rpx;
		margin: 0 auto;
	}

	.storeDisplay {
		margin-top: 40rpx;

		.title {
			display: flex;
			justify-content: space-between;
			padding: 20rpx;
			border-bottom: 1px solid #ddd;
			font-weight: bold;
		}

		.shopItem {
			margin: 30rpx;
			width: 90%;
			height: 200rpx;
			
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			.imgBox{
				width: 200rpx;
				height: 200rpx;
				border-radius: 10rpx;
				overflow: hidden;
				image {
					width: 100%;
					height: 100%;
				}
			}
			
			.middle {
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				font-size: 26rpx;
				width: 420rpx;
				.address {
					padding-right: 12px;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}
			}
		}
	}
</style>
