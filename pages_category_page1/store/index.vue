<template>
	<view class="container">
		<!-- 门店首页 -->
		<view class="content" v-if="id !== ''">
			<view class="shop-top" :style="{'margin-top':(isIphone==true? 50:0)+'rpx'}">
				<image src="../../static/images/back_img04.png" class="back" @click="back"></image>
				<view class="shop-top-content">
					<image :src="storeInfo.shopLogo" class="photo-img"></image>
					<view class="shop-info-top">
						<view class="shop-name">
							<text class="shop-name">{{storeInfo.shopName}}</text>
							<text class="shop-num">已售商品 {{storeInfo.number}} 件</text>
						</view>
					</view>
					<view class="favorites-box cur-poi" @click="collectToggle">
						<image v-if="ifCollect === 0" class="store-icon" src="../../static/images/iconShoucang.png">
						</image>
						<image v-else class="store-icon" src="../../static/images/shoucangActive.png"></image>
						<text class="text">{{ifCollect === 0? '收藏店铺' : '取消收藏'}}</text>
					</view>
					<view class="distributor" @click="applyForRecruit">
						<image class="item-btn-icon" src="../../static/img/user/fenxiao2.png" mode="widthFix"></image>
						成为分销员
					</view>
				</view>
			</view>
			<view class="shop-info-box">
				<view class="tabs-nav-warp">
					<scroll-view class="tabs-nav" scroll-x="true">
						<view class="ul">
							<view class="li" :class="{'on':activeTab==='index'}" @click="tabChange('index')">首页</view>
							<view class="li" :class="{'on':activeTab==='all'}" @click="tabChange('all')">全部</view>
							<view class="li" v-for="(item,index) in classList" :key="index"
								:class="{'on':activeTab===item.classifyId}" @click="tabChange(item.classifyId)">
								{{item.classifyName}}
							</view>
						</view>
					</scroll-view>
				</view>
				<view v-if="activeTab=== 'index'">
					<canvas-page :terminal="terminal" :typeId="3" :shopId="id"></canvas-page>
				</view>
				<view v-else>
					<view class="shop-banner-box" v-if="bannerInfo && bannerInfo.length > 0">
						<swiper indicator-dots="true">
							<swiper-item v-for="(item, index) in bannerInfo" :key="index" @click="applyForRecruit()">
								<image :src="item.bannerImage" class="shop-banner-img"></image>
							</swiper-item>
						</swiper>
					</view>
					<view class="shop-list-content">

						<block v-if='isShowGoods'>
							<view class="shop-list-nav">
								<view class="nav-item-sort" @click="sortTap(1)">
									<text class="nav-title" :class="{'active' : sortIndex == 1}">新品</text>
								</view>
								<view class="nav-item-sort" @click="sortTap(2)">
									<text class="nav-title" :class="{'active' : sortIndex == 2}">价格</text>
									<view class="r">
										<image src="../../static/images/arrowSortUp.png" v-if="type == 1"
											class="arrow-img padd-t"></image>
										<image src="../../static/images/arrowSortDown.png" v-if="type == 2"
											class="arrow-img padd-b"></image>
									</view>
								</view>
								<view class="nav-item-sort" @click="sortTap(3)">
									<text class="nav-title" :class="{'active' : sortIndex == 3}">销量</text>
									<view class="r">
										<image src="../../static/images/arrowSortUp.png" v-if="volume == 1"
											class="arrow-img padd-t"></image>
										<image src="../../static/images/arrowSortDown.png" v-if="volume == 2"
											class="arrow-img padd-b"></image>
									</view>
								</view>
							</view>
							<view class="shop-list-box" v-if="total > 0">
								<view class="item" v-for="(cItem, index) in storeInfolist" :key="index"
									@click="goodsItemTap(cItem.productId,cItem.skuId)">
									<image :src="cItem.image" class="product-img"></image>
									<view class="product-bottom-box">
										<text class="product-name">{{cItem.productName}}</text>
										<text class="product-num">{{cItem.users}}人付款</text>
										<view class="product-price-box">
											<text class="price-box"><text class="fuhao">￥</text>{{cItem.price}}</text>
											<text class="price-through">￥{{cItem.originalPrice}}</text>
										</view>
									</view>
								</view>
							</view>
							<view class='empty-container' v-else>
								<image src="/images/kong4.png"></image>
								<text>暂无商品</text>
							</view>
						</block>
					</view>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	import canvasPage from '@/components/canvasShow/canvasShowPage.vue'
	export default {
		data() {
			return {
				navIndex: 0,
				id: '',
				price: 0,
				storeInfo: {},
				classList: [],
				dataList: [],
				isShowGoods: true,
				sortIndex: 0,
				list: [],
				bannerInfo: [],
				total: 0,
				ifNew: 0, //是否新品
				type: 1, //价格排序条件
				volume: 1, //销量排序条件
				page: 1, //当前页
				pageSize: 20, //每页记录数
				classifyId: '',
				loadingType: 0,
				storeInfolist: [],
				isIphone: false,
				activeTab: 'index',
				terminal: API.terminal,
				collectId: 0,
				ifCollect: 0,
				salesId: 0 //分销员id
			}
		},
		components: {
			canvasPage
		},
		onLoad(options) {
			this.isIphone = getApp().globalData.isIphone;
			if (getApp().globalData.shopShareItem) {
				const item = getApp().globalData.shopShareItem
				this.id = parseInt(item.storeId)
				this.salesId = parseInt(item.salesId)
				getApp().globalData.shopShareItem = undefined
			} else {
				this.id = parseInt(options.storeId)
				this.salesId = parseInt(options.salesId)
			}
			// this.bindSalesCustomer(this.salesId, this.id)
			this.getTemplate()
			this.getFindProductGroupList()
			this.getShopBanner()
			this.getShopInfo()
			this.addBusinessBuyerUser();
		},
		onReachBottom() {
			if (this.loadingType == 1) {
				uni.stopPullDownRefresh()
			} else {
				this.page = this.page + 1
				this.getTemplate()
			}
		},
		methods: {
			getShopBanner() {
				NET.request(API.GetShopBanner, {
					shopId: this.id
				}, 'GET').then(res => {
					this.bannerInfo = res.data
				}).catch(res => {

				})
			},
			getTemplate() {
				let data = {
					shopId: this.id,
					ifNew: this.ifNew,
					type: this.type,
					volume: this.volume,
					page: this.page,
					pageSize: this.pageSize,
					groupId: this.classifyId
				}
				uni.showLoading({
					title: '加载中...',
					mask: true
				});
				NET.request(API.GetStore, data, 'GET').then(res => {
					uni.hideLoading()
					if (res.data.page.list.length == 0) {
						this.loadingType = 1
						this.page = this.page
					}
					this.storeInfo = res.data;
					this.total = res.data.page.total
					this.storeInfolist = this.storeInfolist.concat(res.data.page.list)
				}).catch(res => {
					uni.hideLoading()
					uni.showToast({
						title: res.data.message,
						duration: 2000,
						icon: 'none'
					});
				})
			},
			// 查询门店分组数据
			getFindProductGroupList() {
				NET.request(API.GetStoreShopClassify, {
					shopId: this.id
				}, 'GET').then(res => {
					this.classList = res.data.filter(item => JSON.stringify(item) !== "{}")
				}).catch(res => {})
			},
			goodsItemTap(productId, skuId) {
				wx.navigateTo({
					url: '/pages_category_page3/merchants/goodsDetails?shopId=' + this.id + '&productId=' +
						productId + '&skuId=' +
						skuId
				})
			},
			navIndexTap(index) {
				this.storeInfolist = []
				this.navIndex = index,
					this.isShowGoods = index == 0
				if (index == 0) {
					this.page = 1
					this.classifyId = ''
					this.getTemplate()
				} else {
					this.isShowGoods = false
				}
			},
			back() {
				uni.navigateBack()
				// history.back()

			},
			sortTap(index) {
				this.page = 1
				this.storeInfolist = []
				if (index == 1) {
					this.ifNew = this.ifNew != 0 ? 0 : 1,
						this.type = 1,
						this.volume = 1,
						this.sortIndex = index
				} else if (index == 2) {
					this.ifNew = 0,
						this.type = this.type != 1 ? 1 : 2,
						this.volume = 1,
						this.sortIndex = index
				} else if (index == 3) {
					this.ifNew = 0,
						this.type = 1,
						this.volume = this.volume != 1 ? 1 : 2,
						this.sortIndex = index
				}
				this.getTemplate()
			},
			classItemTap(classifyId) {
				this.page = 1
				this.classifyId = classifyId
				this.isShowGoods = true
				this.storeInfolist = []
				this.getTemplate()
			},
			// 栏目切换
			tabChange(key) {
				this.activeTab = key
				if (key !== 'index') {
					this.page = 1
					this.classifyId = key === 'all' ? '' : key
					this.storeInfolist = []
					this.getTemplate()
				}
			},
			//判断是否已申请成为该门店的分销员
			applyForRecruit() {
				const res = uni.getStorageSync('storage_key');
				const token = res.token
				if (token) {
					let item = {}
					if (uni.getStorageSync('storage_key')) {
						item = uni.getStorageSync('storage_key');
					}
					if (JSON.stringify(item) == '{}') {

					} else {
						NET.request(API.HasApply, {
							shopId: this.id
						}, 'GET').then(res => {
							if (res.data.distributorId == undefined) {
								uni.navigateTo({
									url: '../distributionModule/recruit?shopId=' + this.id
								})
							} else if (res.data.state === 1) {
								uni.showToast({
									title: "您已申请成为该门店的分销员",
									icon: "none"
								})
							} else {
								uni.showToast({
									title: "您的申请正在审核中，请稍后查看",
									icon: "none"
								})
							}
						}).catch(res => {})
					}
				} else {
					uni.showToast({
						title: '请先登录',
						icon: "none"
					})
					uni.navigateTo({
						url: '/pages_category_page2/userModule/login'
					})
				}

			},
			bindSalesCustomer(salesId, storeId) {
				if (salesId && storeId) {
					//如果已登录，静默绑定客户关系，否则跳转到登录页面
					if (uni.getStorageSync('storage_key')) {
						NET.request(API.BindSalesCustomer, {
							shopId: storeId,
							distributorId: salesId
						}, 'POST').then(res => {
							uni.showToast({
								title: "绑定成功",
								icon: "none"
							})
						}).catch(res => {
							uni.showToast({
								title: res.data.msg,
								icon: "none"
							})
						})
					} else {
						uni.setStorageSync('salesId', salesId)
						uni.setStorageSync("shopId", storeId)
						uni.navigateTo({
							url: '../../pages_category_page2/userModule/login'
						})
					}
				}
			},
			// 获取门店信息
			getShopInfo() {
				var _this = this;
				NET.request(API.getShopIndex + `?shopId=${this.id}`, null,
					'GET').then(function(res) {
					_this.ifCollect = res.data.ifCollect;
					_this.collectId = res.data.collectId;
				}).catch(function(res) {
					uni.showToast({
						title: '失败',
						icon: "none"
					});

				});
			},
			//收藏店辅
			collectToggle() {
				const res = uni.getStorageSync('storage_key');
				const token = res.token
				if (token) {
					if (this.ifCollect == 0) {
						this.collectShop();
					} else {
						this.cancelCollectShop();
					}
				} else {
					uni.showToast({
						title: '请先登录',
						icon: "none"
					})
					uni.navigateTo({
						url: '/pages_category_page2/userModule/login'
					})
				}
			},
			//收藏
			collectShop() {
				var _this = this;
				NET.request(API.collect, {
						shopId: parseInt(this.id)
					},
					'POST').then(function(res) {
					_this.ifCollect = 1;
					uni.showToast({
						title: '收藏成功',
						icon: "success"
					});

				}).catch(function(res) {
					uni.showToast({
						title: '失败',
						icon: "none"
					});

				});
			},
			//取消收藏
			cancelCollectShop() {
				var _this2 = this;
				NET.request(API.cancelCollect, {
						ids: [this.collectId]
					},
					'POST').then(function(res) {
					_this2.ifCollect = 0;
					uni.showToast({
						title: '取消收藏成功',
						icon: "success"
					});

				}).catch(function(res) {
					uni.showToast({
						title: '失败',
						icon: "none"
					});

				});
			},
			addBusinessBuyerUser() {
				NET.request(API.AddBusinessBuyerUser, {
					shopId: this.id
				}, "POST")
			}
		}
	}
</script>

<style lang='scss'>
	.shop-top {
		width: 750rpx;
		height: 280rpx;
		background-color: #00AA49;
	}

	.shop-top-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 30rpx 0;
	}

	.shop-info-box {
		width: 100%;
		/* background: #fff; */
		border-radius: 20rpx 20rpx 0 0;
	}

	.shop-info-top {
		border-radius: 20rpx 20rpx 0 0;
		position: relative;
		display: flex;
		align-items: center;
	}

	.photo-img {
		width: 102rpx;
		height: 102rpx;
		border-radius: 50%;
		margin-right: 10rpx;
	}

	.shop-name {
		font-size: 28rpx;
		color: #fff;
		display: block;
		width: 180rpx;
	}

	.shop-num {
		font-size: 24rpx;
		color: #fff;
		margin-top: 15rpx;
	}

	.favorites-box {
		display: flex;
	}

	.favorites-box .store-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 8rpx;
	}

	.favorites-box .text {
		font-size: 26rpx;
		color: #fff;
	}

	.shop-banner-box {
		background: #f7f7f7;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
	}

	.shop-banner-img {
		width: 100%;
		height: 280rpx;
		border-radius: 20rpx;
	}

	.shop-list-content {
		width: 100%;
		/* background: #fff; */
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
		color: #00AA49;
	}

	.nav-item .line {
		display: inline-block;
		width: 80rpx;
		height: 4rpx;
		background: #fff;
		border-radius: 2rpx;
	}

	.nav-item.active .line {
		background-color: #00AA49;
	}

	.nav-item.padd-l {
		padding-left: 20%;
		box-sizing: border-box;
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
	}

	.nav-item-sort .r .arrow-img {
		width: 32rpx;
		height: 32rpx;
		padding: 7rpx;
		box-sizing: border-box;
	}

	/* .nav-item-sort .r .arrow-img.padd-t {
	  padding-top: 20rpx;
	}

	.nav-item-sort .r .arrow-img.padd-b {
	  padding-bottom: 20rpx;
	}  */

	.shop-list-box {
		width: 100%;
		background: #f7f7f7;
		padding: 12rpx 30rpx 0;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
	}

	.shop-list-box .item {
		width: 340rpx;
		margin: 0 5rpx 12rpx 0;
		background: #d6d6d6;
		border-radius: 10rpx;
		display: flex;
		flex-direction: column;
	}

	.shop-list-box .item:nth-of-type(2n) {
		margin-left: 5rpx;
		margin-right: 0;
	}

	.product-img {
		width: 340rpx;
		height: 340rpx;
		border-radius: 10rpx 10rpx 0 0;
	}

	.product-bottom-box {
		padding: 20rpx;
		box-sizing: border-box;
		background: #fff;
		border-radius: 0 0 10rpx 10rpx;
	}

	.product-name {
		display: block;
		font-size: 28rpx;
		color: #333;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.product-num {
		font-size: 24rpx;
		color: #999;
		margin-top: 15rpx;
	}

	.product-price-box {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-top: 30rpx;
	}

	.product-price-box .price-box {
		font-size: 36rpx;
		color: #00AA49;
		font-weight: 400;
	}

	.product-price-box .price-box .fuhao {
		font-size: 24rpx;
	}

	.product-price-box .price-through {
		text-decoration: line-through;
		font-size: 24rpx;
		color: #999;
	}

	.shop-sort-list {
		margin-top: 20rpx;
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.shop-sort-list .item {
		display: flex;
		flex-direction: column;
		background: #fff;
		padding: 0 30rpx 20rpx;
		box-sizing: border-box;
		margin-bottom: 20rpx;
	}

	.shop-sort-list .item .sort-title {
		font-size: 30rpx;
		color: #333;
		padding: 30rpx 0;
	}

	.sort-single-box {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		width: 100%;
	}

	.sort-single-box .single {
		width: 340rpx;
		height: 78rpx;
		margin: 0 5rpx 10rpx 0;
		background: #fff;
		border: 1px solid #E5E5E5;
		border-radius: 4rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #333;
		box-sizing: border-box;
	}

	.sort-single-box .single:nth-of-type(2n) {
		margin-left: 5rpx;
		margin-right: 0;
	}

	.back {
		width: 50rpx;
		height: 50rpx;
		margin-top: 30rpx;
		padding: 20rpx;
	}

	.empty-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.empty-container image {
		width: 200rpx;
		height: 200rpx;
		margin-top: 150rpx;
	}

	.empty-container text {
		font-size: 28rpx;
		color: #999;
		margin-top: 30rpx;
		display: block;
		width: 300rpx;
		text-align: center;
	}

	.active {
		color: #00AA49;
	}

	.tabs-nav-warp {
		padding: 0 20px;
	}

	.tabs-nav {
		margin-top: 20upx;

		.ul {
			white-space: nowrap;

			.li {
				display: inline-block;
				margin-left: 36upx;
				font-size: 30upx;
				color: #333;
				position: relative;
				padding-bottom: 18upx;

				&:first-child {
					margin-left: 0;
				}

				&.on {
					&:after {
						content: '';
						width: 100%;
						height: 8upx;
						/* background: url("../../static/assets/img/xian.png") no-repeat center / 100% 100%; */
						position: absolute;
						left: 0;
						bottom: 0;
					}

					font-weight:bold;
				}
			}
		}
	}

	.distributor {
		color: #FFFFFF;
		font-size: 26upx;
		border-radius: 25upx;
		display: flex;
		align-items: center;

		.item-btn-icon {
			width: 40upx;
			height: 40upx;
			margin-right: 10upx;
		}
	}

	// #ifdef MP-ALIPAY
	.back {
		width: 25rpx;
		height: 25rpx;
		margin-top: 15rpx;
		padding: 10rpx;
		display: none;
	}

	.shop-top {
		margin-top: 0 !important;
	}

	.shop-top-content {
		padding-top: 80rpx;
	}

	.nav-item-sort .r .arrow-img {
		width: 16rpx;
		height: 16rpx;
		padding: 4rpx;
	}

	.tabs-nav {
		margin-top: 20upx;

		.ul {
			.li {
				&:first-child {
					margin-left: 36upx;
				}
			}
		}
	}

	// #endif
</style>
