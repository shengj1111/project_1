<template>
	<view class="content">
		<view class="Box">
			<view class="productBox" v-for="(item,index) in productList" :key="index"
				@click="goodsDateils(item.shopId,item.productId,item.skuId)">
				<view class="proImg">
					<image :src="item.image" mode=""></image>
				</view>
				<view class="rightBox">
					<view class="proTitle">
						{{item.productName}}
					</view>
					<view class="price">
						<text class="fs36 font-color-red">
							¥{{item.price}}
						</text>
						<text class="mar-left-10 fs26">
							{{item.users}}人付款
						</text>
					</view>
					<view class="flex-sp-between flex-display mar-top-20" @click.stop="goStore(item.shopId)">
						<view>
							{{item.shopName}}
						</view>
						<view>
							<image class="rightIcon" src="../static/images/arrowRight.png" mode="aspectFill"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const NET = require('@/utils/request')
	const API = require('@/config/api')
	export default {
		data() {
			return {
				list: [],
				pageSize: 1,
				productList:[]
			}
		},

		onPullDownRefresh() { //上拉触底函数
			this.pageSize = this.pageSize + 1
			this.GetremenList()
		},
		onLoad() {
			this.GetremenList()
		},
		methods: {
			// 获取列表数据
			GetremenList() {
				let timestamp = new Date().getTime()
				NET.request(API.GetremenList, {
					page: this.pageSize,
					pageSize: 5,
					timestamp: timestamp
				}, 'get').then(res => {
					uni.stopPullDownRefresh();
					console.log(res)
					if (res.code == 200) {
						this.productList = res.data.list
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
					}
				})
			},
			// 跳转门店
			goStore(shopId) {
				uni.navigateTo({
					url: './store/index?storeId=' + shopId
				})
			},
			//商品详情
			goodsDateils(shopId, productId, skuId) {
				console.log(111)
				uni.navigateTo({
					url: '/pages_category_page3/merchants/goodsDetails?shopId=' + shopId + '&productId=' + productId + '&skuId=' +
						skuId
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	page {
		background-color: #FBE7E0;
	}

	.content {
		.Box {
			padding: 30upx;

			.productBox {
				background-color: #FFFFFF;
				height: 280upx;
				margin-bottom: 20upx;
				border-radius: 20upx;
				padding: 20upx;
				display: flex;
				justify-content: space-between;

				.proImg {
					width: 240upx;
					height: 240upx;

					image {
						width: 100%;
						height: 100%;
						border-radius: 20upx;
					}
				}

				.rightBox {
					width: 60%;

					.proTitle {
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
					}

					.biao {
						margin-top: 20upx;

						text {
							margin-right: 10upx;
							border-radius: 5upx;
							color: #FF7800;
							padding: 5upx 10upx 5upx;
							background-color: #FBE7E0;
						}
					}

					.price {
						margin-top: 55upx;
					}

					.rightIcon {
						width: 24upx;
						height: 24upx;
					}
				}
			}
		}
	}
</style>
