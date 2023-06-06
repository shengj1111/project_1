<template>
	<view class="container">
		<!-- 商品列表 -->
		<view class="flex-items-plus flex-row search">
			<view class="searchImg-box flex-items-plus">
				<image class="searchImg" src="../../static/img/searchImg.png"></image>
				<input class="search-box" v-model="keyWord" placeholder-class="searchboxPlace"
					placeholder="请输入您想要的宝贝" />
				<image class="searchClose-icon" @click="searchTextDel"
					src="../../static/img/index/searchClose_icon.png"></image>
			</view>
			<label class="mar-left-40 fs26" @click="searchList(1)">搜索</label>
		</view>
		<view class="shop-list-nav">
			<view class="nav-item-sort" @click="sortTap(1)">
				<text class="nav-title" :class="{'active' : sortIndex == 1}">默认</text>
			</view>
			<view class="nav-item-sort" @click="sortTap(2)">
				<text class="nav-title" :class="{'active' : sortIndex == 2}">价格</text>
				<view class="r">
					<view class="arrowUp" :class="{activeUp: type == 1}"></view>
					<view class="arrowDown" :class="{activeDown: type == 2}"></view>
					<!--          <image src="../../static/images/arrowSortUp.png" v-if="type == 1" class="arrow-img padd-t"></image>-->
					<!--          <image src="../../static/images/arrowSortDown.png" v-if="type == 2" class="arrow-img padd-b"></image>-->
				</view>
			</view>
			<view class="nav-item-sort" @click="sortTap(3)">
				<text class="nav-title" :class="{'active' : sortIndex == 3}">销量</text>
				<view class="r">
					<view class="arrowUp" :class="{activeUp: volume == 1}"></view>
					<view class="arrowDown" :class="{activeDown: volume == 2}"></view>
					<!--          <image src="../../static/images/arrowSortUp.png" v-if="volume == 1" class="arrow-img padd-t"></image>-->
					<!--          <image src="../../static/images/arrowSortDown.png" v-if="volume == 2" class="arrow-img padd-b"></image>-->
				</view>
			</view>
		</view>
		<view v-if="list.length>0">
			<view v-for="(item, index) in list" :key="index"
				class="goodsDetails-box flex-display flex-column mar-left-30"
				@click="goodsDateils(item.shopId,item.productId,item.skuId)">
				<view v-if="item.activityType == 0" class="goodsDetails flex-items-plus flex-row mar-top-30">
					<image class="goodsImg" :src="item.image"></image>
					<view class="mar-left-30">
						<view class="goodsName-box overflowNoDot">
							<label class="goodsName fs26">{{item.productName}}</label>
						</view>
						<view class="priceBuyNum-box mar-top-20">
							<label class="fs24 font-color-FF7800 price">¥</label>
							<label class="fs36 font-color-FF7800 mar-left-10 price">{{item.price}}</label>
							<label class="fs24 font-color-999 mar-left-10"
								v-if="item.users != null">{{item.users}}人付款</label>
							<label class="fs24 font-color-999 mar-left-10" v-else>0人付款</label>
						</view>
						<!-- <view class="flex-display flex-sp-between flex-row mar-top-10 flex-items">
							<label class="fs22 font-color-999">{{item.shopName}}</label>
							<image class="arrowImg" src="../../static/img/user/arrow.png"></image>
						</view> -->
					</view>
				</view>
				<view v-else class="spikeList">
					<view class="listItem">
						<view class="itemBox">
							<img :src="item.image">
						</view>
						<view class="itemInfo mar-top-30">
							<p>{{item.productName}}</p>
							<view class="number" v-if="item.users != null">{{item.users}}人付款<span
									v-if="item.total !=0">，限量{{item.total}}件</span></view>
							<view class="number" v-else>{{item.users}}人付款<span
									v-if="item.total !=0">，限量{{item.total}}件</span></view>
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
			<label class="font-color-999 fs26 mar-top-30">搜索不到你要找的宝贝呢</label>
			<label class="font-color-999 fs26 mar-top-10">换个词试试吧～</label>
		</view>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	import {getCurShopid} from '@/api/common.js'
	export default {
		data() {
			return {
				keyWord: '',
				category3Id: '',
				page: 1,
				pageSize: 20,
				source: 2,
				list: [],
				loadingType: 0,
				sortIndex: 0,
				ifNew: 0, //是否新品
				type: 1, //价格排序条件
				volume: 1, //销量排序条件
			}
		},
		onLoad(option) {
			if (option.keyWord) {
				this.keyWord = option.keyWord
			}
			if (option.category3Id) {
				this.category3Id = option.category3Id
			}
			this.searchList(1)
		},
		onReachBottom() {
			if (this.loadingType == 1) {
				uni.stopPullDownRefresh()
			} else {
				this.page = this.page + 1
				this.searchList(0)
			}
		},
		methods: {
			sortTap(index) {
				this.page = 1
				this.list = []
				if (index == 1) {
					this.type = 1
					this.volume = 1
					this.sortIndex = index
				} else if (index == 2) {
					this.type = this.type != 1 ? 1 : 2
					this.sortIndex = index
				} else if (index == 3) {
					this.volume = this.volume != 1 ? 1 : 2
					this.sortIndex = index
				}
				this.searchList()
			},
			searchTextDel() {
				this.keyWord = ''
			},
			searchList(type) {
				wx.showLoading({
					title: '加载中...',
				})
				if (type == 1) {
					this.list = []
					this.page = 1
				}
				if (this.category3Id) {
					NET.request(API.GetClaasifyProducts, {
						classifyId: this.category3Id,
						type: this.type,
						volume: this.volume,
						productName: this.keyWord,
						page: this.page,
						pageSize: this.pageSize
					}, 'GET').then(res => {
						if (res.data.list.length == 0) {
							this.loadingType = 1
							this.page = this.page
						}
						uni.hideLoading()
						this.list = this.list.concat(res.data.list)
					}).catch(res => {
						uni.hideLoading()
					})
				} else {
					let _shopid=getCurShopid();
					NET.request(API.GgetSearchProducts, {
						shopid:_shopid,
						search: this.keyWord,
						type: this.type,
						volume: this.volume,
						page: this.page,
						pageSize: this.pageSize
					}, 'GET').then(res => {
						uni.hideLoading()
						if (res.data.list == null) {
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
			//商品详情arrow-img
			goodsDateils(shopId, productId, skuId) {
				uni.navigateTo({
					url: '/pages_category_page3/merchants/goodsDetails?shopId=' + shopId + '&productId=' + productId + '&skuId=' + skuId
				})
			}
		}
	}
</script>

<style lang="scss">
	input {
		padding-left: 80upx;
	}

	.container {
		height: 100%;
		background: #FFFFFF;

		.searchImg-box {
			position: relative;
		}

		.emptyCart-box {
			margin-top: 70upx;

			.emptyCart-img {
				width: 270upx;
				height: 270upx;
			}
		}

		.searchImg {
			width: 36upx;
			height: 36upx;
			position: absolute;
			left: 33upx;
		}

		.search-box {
			background-color: #F7F7F7;
			border-radius: 33upx;
			width: 530upx;
			height: 66upx;
		}

		.searchboxPlace {
			font-size: 26upx;
			color: #A9A9A9;
			padding-right: 30upx;
		}

		.searchClose-icon {
			z-index: 999;
			width: 40upx;
			height: 40upx;
			margin-left: -50upx;
		}

		.promotion618 {
			width: 130upx;
			height: 30upx;
		}

		.goodsDetails-box {
			width: 690upx;

			.goodsDetails {
				border-bottom: 1upx solid #EDEDED;
				padding-bottom: 30upx;

				.goodsName-box {
					width: 389upx;
					height: 85upx;

					.img618-cion {
						width: 70upx;
						height: 36upx;
					}
				}

				.goodsImg {
					width: 260upx;
					height: 260upx;
				}

				.discounts-box {
					margin-left: -10upx;
					margin-top: 20upx;

					.discounts-text {
						margin-left: 10upx;
						color: #FF7800;
						background-color: #FFE4CC;
						padding: 6upx 12upx;
						border-radius: 4upx;
					}
				}

				.arrowImg {
					width: 20upx;
					height: 20upx;
				}
			}


		}

		.spikeList {
			.arrowImg {
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

	.shop-list-nav {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 80rpx;
		line-height: 76rpx;
		background: #fff;
	}

	.nav-item {
		flex: 1;
		font-size: 30rpx;
		color: #666;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 80rpx;
		line-height: 76rpx;
	}

	.nav-title {}

	.nav-item.active {
		color: #ff7911;
	}

	.nav-item .line {
		display: inline-block;
		width: 80rpx;
		height: 4rpx;
		background: #fff;
		border-radius: 2rpx;
	}

	.nav-item.active .line {
		background: linear-gradient(0deg, rgba(255, 162, 0, 1), rgba(255, 121, 17, 1));
	}

	.nav-item.padd-l {
		padding-left: 20%;
		box-sizing: border-box;
	}

	.active {
		color: #ff7911;
	}

	.nav-item.padd-r {
		padding-right: 20%;
		box-sizing: border-box;
	}

	.nav-item-sort {
		flex: 1;
		font-size: 24rpx;
		color: #222;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 80rpx;
		line-height: 80rpx;
	}

	.nav-item-sort .r {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-left: 5rpx;

		.arrowDown {
			width: 0;
			height: 0;
			border-width: 10rpx;
			border-style: solid;
			border-color: #CCCCCC transparent transparent transparent;
			margin-top: 2rpx;
		}

		.arrowUp {
			margin-bottom: 2rpx;
			width: 0;
			height: 0;
			border-width: 10rpx;
			border-style: solid;
			border-color: transparent transparent #CCCCCC transparent;
		}

		.activeDown {
			border-color: #ff7911 transparent transparent transparent;
		}

		.activeUp {
			border-color: transparent transparent #ff7911 transparent;
		}
	}

	//.nav-item-sort .r .arrow-img {
	//  width: 32rpx;
	//  height: 32rpx;
	//  padding: 7rpx;
	//  box-sizing: border-box;
	//}
	//// #ifdef MP-ALIPAY
	//.nav-item-sort .r .arrow-img {
	//  width: 16rpx;
	//  height: 16rpx;
	//  padding: 4rpx;
	//  box-sizing: border-box;
	//}
	.search {
		padding-top: 20rpx;
	}
	
	.price{
		color: #c80311 !important;
	}

	// #endif
</style>
