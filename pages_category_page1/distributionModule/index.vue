<template>
	<view class="container flex-center flex-column">
		<view class="inStoreBackImg" v-if="StoreListData.length>0">
			<!-- <label>选择进入的门店</label> -->
			<!-- <text class="mytextStr" @click="applyForRecruit">+ 成为分销员</text> -->
		</view>
		<view v-if="StoreListData.length>0">
			<view class="flex-items-plus flex-column" v-for="(item,index) in StoreListData" :key="index"
				@click="getStore(item)">
				<view class="store-box flex-row-plus mar-top-30 bor-line-E5E5E5 pad-bot-30">
					<image class="storeLogoImg" :src="item.shopLogo"></image>
					<view class="font-color-656 fs24 mar-left-20" style="line-height: 140rpx;">
						<label class="fs30 font-color-333">{{item.shopName}}</label>
						<!-- <view class="flex-row-plus mar-top-20">
							<label>等级：{{item.levelName}} </label>
							<view class="mar-left-50">
								总收益：<label class="font-color-FF7800">{{item.price}}</label>元
							</view>
						</view>
						<view class="mar-top-10">关系：<label>{{item.state==1?'有效':'被清退'}}</label></view> -->
					</view>
				</view>
			</view>
		</view>
		<view v-else class="emptyCart-box flex-items-plus flex-column">
			<image class="emptyCart-img" src="../../static/img/bgnull.png"></image>
			<!-- <label class="font-color-999 fs26 mar-top-30">这里空空如也~</label> -->
			<label class="font-color-FF7911 fs34 mar-top-30" style="font-weight: 600;"
				@click="toapplyvip">成为分销员</label>
		</view>
	</view>
</template>

<script>
	import {
		getCurShopid
	} from '@/api/common.js'
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		data() {
			return {
				currentId: '',
				StoreListData: [],
				StoreListQuery: {
					id: '',
				},
				page: 1,
				pageSize: 20,
				loadingType: 0,
				shopId: null
			}
		},
		onLoad() {
			this.getStoreList()
			this.shopId = getCurShopid()
		},
		onReachBottom() {
			if (this.loadingType == 1) {
				uni.stopPullDownRefresh()
			} else {
				this.page = this.page + 1
				this.getStoreList()
			}
		},
		onBackPress(e) {
			if (e.from === 'navigateBack') {
				return false;
			}
			this.back();
			return true;
		},
		methods: {
			// 去申请会员
			toapplyvip(){
				uni.navigateTo({
					url:"/pages/applyVip/applyVip?labelName='游客'"
				})
			},
			//成为分销员
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
							shopId: this.shopId
						}, 'GET').then(res => {
							if (res.data.distributorId == undefined) {
								uni.navigateTo({
									url: './recruit?shopId=' + this.shopId
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
			back() {
				uni.switchTab({
					url: '../../pages/tabbar/user/index'
				});
			},
			getStoreList() {
				uni.showLoading({
					title: '加载中...'
				})
				NET.request(API.FindSaleStoreList, {
					page: this.page,
					pageSize: this.pageSize
				}, 'GET').then(res => {
					uni.hideLoading()
					if (res.data.list.length == 0) {
						this.loadingType = 1
						this.page = this.page
					}
					this.StoreListData = this.StoreListData.concat(res.data.list)
				}).catch(res => {
					uni.hideLoading()
				})
			},
			getStore(item) {
				uni.navigateTo({
					url: 'salesIndex?distributeInfo=' + JSON.stringify(item)
				});
			}
		}
	}
</script>

<style lang="scss">
	.emptyCart-box {
		margin-top: 70upx;

		.emptyCart-img {
			width: 270upx;
			height: 270upx;
		}
	}

	.container {
		.inStoreBackImg {
			display: flex;
			flex-direction: row-reverse;
			width: 720rpx;
			// background: url(../../static/images/inStoreBackImg.png) no-repeat;
			// background-size: 100% 100rpx;
		}

		.mytextStr {
			margin-top: 30rpx;
			width: 185rpx;
			height: 70rpx;
			background-color: #00AA49;
			text-align: center;
			line-height: 70rpx;
			border-radius: 10rpx;
			color: #FFFFFF;
		}

		.store-box {
			width: 690upx;

			.storeLogoImg {
				width: 140upx;
				height: 140upx;
			}
		}
	}
</style>
