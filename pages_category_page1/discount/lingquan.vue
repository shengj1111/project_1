<template>
	<view class="container" v-if="isShow">
		<view>
			<view class="header-contente">
				<view class="header-shopName">
					{{particulars.couponName}}
				</view>
			</view>
			<view class="body-content">
				<view class="contentLeft" v-if="particulars.couponType == 1">
					<text class="fuhao">¥</text>
					<text class="jiage">{{particulars.couponContent}}</text>
				</view>
				<view class="contentLeft" v-if="particulars.couponType == 2">
					<!-- <text class="fuhao">¥</text> -->
					<text class="jiage">{{particulars.couponContent}}折</text>
				</view>
				<view class="contentImg" v-if="particulars.couponType == 3">
					<image :src="particulars.giftpic"></image>

				</view>
				<view class="contentRight">
					<view class="text1" v-if="particulars.couponType == 1">满减券</view>
					<view class="text1" v-if="particulars.couponType == 2">折扣券</view>
					<view class="text1" v-if="particulars.couponType == 3">物品券</view>
					<view>{{content}}</view>
					<view style="font-size: 20rpx;">{{particulars.effectiveStart}}-{{particulars.effectiveEnd}}</view>
				</view>
			</view>
			<view class="button">
				<button @click="lingqu">立即领取</button>
			</view>
		<!-- 	<view class="contentList" v-if="particulars.couponType == 3">
				<view class="listH">赠送物品</view>
				<view class="listC">{{particulars.giftname}}</view>
			</view> -->
		<!-- 	<view class="contentListImg" v-if="particulars.couponType == 3">
				<view class="listH">物品图片</view>
				<image :src="particulars.giftpic" class="listImg"></image>
			</view> -->
			<!-- 	<view class="contentList">
				<view class="listH">使用须知</view>
				<view class="listC">价值100元代金券,满足门槛即可使用哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈</view>
			</view> -->
		</view>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	import {
		couponGetById, //获取优惠券详情
	} from '../../api/shopmanage.js'
	import {
		getCurShopid,getCurUserid
	} from '@/api/common.js';
	export default {
		data() {
			return {
				shopCouponId: 0, //优惠券id
				particulars: {}, //优惠券详情
				content: '', //内容
				isShow:false,//是否展示页面
			}
		},
		onLoad(options) {
			// 获取分享点击次数
			this.getsumdj("领取优惠券", "", "/pages_category_page1/discount/lingquan")
			if (options.shopCouponId && options.shopCouponId != '') {
				this.shopCouponId = options.shopCouponId
			}
			if (options.content && options.content != '') {
				this.content = options.content
			}
		},
		onShow() {
			this.xiangqing()
		},
		//分享到朋友圈
		onShareTimeline(res) {
			let distributorId = this.$getstorage("distributorId")??""
			let userId = getCurUserid() === undefined ? '' : getCurUserid();
			let shopId = getCurShopid()
		    return {
				title: '领取优惠券',
				query:`shopCouponId=${this.shopCouponId}&content=${this.content}&FXUserId=${userId}&shopId=${shopId}&salesId=${distributorId}`
				// path: `/pages/tabbar/user/index?shopId=${shopId}&salesId=${userId}`,
			}
		},
		// 分享到朋友
		onShareAppMessage() {
			let distributorId = this.$getstorage("distributorId")??""
			let userId = getCurUserid() === undefined ? '' : getCurUserid();
			let shopId = getCurShopid()
			return {
				title: '领取优惠券',
				path: `/pages_category_page1/discount/lingquan?shopCouponId=${this.shopCouponId}&content=${this.content}&FXUserId=${userId}&shopId=${shopId}&salesId=${distributorId}`,
			}
		},
		methods: {
			xiangqing() {
				couponGetById({
					shopCouponId: this.shopCouponId
				}).then(res => {
					this.particulars = res.data
					this.isShow = true
					console.log(res.data, '优惠券详情')
				})
			},
			lingqu() {
				const res = uni.getStorageSync('storage_key');
				const token = res.token
				if (token) {
						uni.showLoading({
							title: '领取中...',
						})
						NET.request(API.ReceiveCoupon, {
							shopCouponId: this.shopCouponId
						}, 'POST').then(res => {
							uni.hideLoading()
							uni.showToast({
								title: '领取成功',
								icon: 'none',
								duration: 2000
							});
						})
				} else {
					uni.showToast({
						title: '请先登录',
						duration: 1500,
						icon: "none"
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		margin: 30rpx;

		.header-contente {
			width: 100%;
			height: 140rpx;
			background-color: rgb(0, 170, 73);
			border-radius: 20rpx;
			border-bottom: 1rpx #FFFFFF dashed;

			.header-shopName {
				color: #FFFFFF;
				font-size: 35rpx;
				width: 100%;
				height: 140rpx;
				line-height: 140rpx;
				padding-left: 40rpx;
			}
		}

		.body-content {
			width: 100%;
			height: 240rpx;
			background-color: rgb(0, 170, 73);
			border-radius: 20rpx 20rpx 0rpx 0rpx;
			border-bottom: 1rpx #FFFFFF dashed;
			margin-bottom: 30rpx;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;

			.contentImg {
				width: 22%;
				height: 140rpx;
				margin: 0rpx 30rpx;
				background-color: #FFFFFF;

				image {
					width: 100%;
					height: 100%;
					border-radius: 20rpx;
				}
			}

			.contentLeft {
				width: 40%;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: flex-end;
				height: 100rpx;
				color: #FFFFFF;

				.jiage {
					font-weight: 600;
					font-size: 90rpx;
					color: #FFFFFF;
					
				}

				.fuhao {
					font-weight: 600;
					font-size: 40rpx;
					color: #FFFFFF;
					padding-right: 10rpx;
					margin-bottom: 20rpx;
					height: 50rpx;
				}
			}

			.contentRight {
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				width: 60%;
				height: 160rpx;
				color: #FFFFFF;

				.text1 {
					font-weight: 600;
				}
			}
		}

		.button {
			width: 500rpx;
			height: 100rpx;
			margin: 0 auto;
			margin-bottom: 20rpx;

			button {
				background-color: rgb(0, 170, 73);
				color: #FFFFFF;
			}

		}

		.contentList {
			width: 100%;
			height: 150rpx;
			border-top: 1rpx #dfdfdf solid;
			display: flex;
			flex-direction: column;
			justify-content: space-around;

			.listH {
				color: #8a8a8a;
			}

			.listC {}
		}
		
		.contentListImg {
			width: 100%;
			
			border-top: 1rpx #dfdfdf solid;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
		
			.listH {
				color: #8a8a8a;
			}
			.listImg{
				width: 100%;
			
			}
		
		
		}
	}
</style>
