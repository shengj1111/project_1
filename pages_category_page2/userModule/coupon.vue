<!-- 优惠券列表 -->
<template>
	<view class="container">
		<view>
			<u-tabs :list="tabList" :is-scroll="false" bg-color="#F7F7F7" active-color="#00AA49" :current="type"
				@change="orderStateChange"></u-tabs>
		</view>
		<view class="list" v-if="list.length > 0">
			<view class="item quanBC" v-for="(item, index) in list" >
				<view class="lable">{{item.activityName}}</view>
				<view class="discoun" v-if="item.couponType == 1"> <text
						style="font-size: 28rpx">￥</text>{{item.reduceMoney}}</view>
				<view class="discoun" v-if="item.couponType == 2"> <text
						style="font-size: 28rpx"></text>{{item.reduceMoney}}折</view>
				<view class="discoun" v-if="item.couponType == 3">
					<image :src="item.giftpic" class="discounImg"></image>
				</view>

				<view class="info-box" v-if="item.couponType == 1">
					<view class="info-condition">满减券</view>
					<view class="info-date">{{item.content}}</view>
					<view class="info-date">{{getDate(item.startTime)}} 至 {{getDate(item.endTime)}}</view>
				</view>
				<view class="info-box" v-if="item.couponType == 2">
					<view class="info-condition">打折券</view>
					<view class="info-date">{{item.content}}</view>
					<view class="info-date">{{getDate(item.startTime)}} 至 {{getDate(item.endTime)}}</view>
				</view>
				<view class="info-box" v-if="item.couponType == 3" :class="{'info-box1': item.state!=0}">
					<view class="info-condition" v-if="item.state!=1">物品券</view>
					<view class="info-date" v-if="item.state!=1">{{item.content}}</view>
					<view class="info-date" v-if="item.state!=1">{{getDate(item.startTime)}} 至 {{getDate(item.endTime)}}</view>
					
					<view class="info-condition" v-if="item.state==1">{{item.content}}</view>
					<view class="info-order" v-if="item.state!=2">领取时间：{{item.createTime}}</view>
					<view class="info-order" v-if="item.state==1">订单号：{{item.orderFormid}}</view>
					<view class="info-order" v-if="item.state==1">使用时间：{{item.orderCreateTime}}</view>
				</view>
				<view class="use-btn" @click="useTap(item)" v-if="item.state === 0">立即使用</view>
			</view>
			<view v-if="availableList.length === 0" class="emptyOrder-box flex-items-plus flex-column">
				<!-- <image class="emptyOrder-img" src="../../static/images/totalAwardEmpty.png"></image> -->
				<label class="font-color-999 fs26 mar-top-30">你还没有优惠券哦～</label>
			</view>
		</view>
		<view v-else class="emptyOrder-box flex-items-plus flex-column">
			<!-- <image class="emptyOrder-img" src="../../static/images/totalAwardEmpty.png"></image> -->
			<label class="font-color-999 fs26 mar-top-30">你还没有优惠券哦～</label>
		</view>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	import {
		getCurShopid
	} from '@/api/common.js'
	export default {
		data() {
			return {
				list: [],
				// page:1,
				// pageSize:20,
				total: 0,
				availableList: [],
				// loadingType:0,
				tabList: [{
					name: '未使用',
					number: 0
				}, {
					name: '已使用',
					number: 1
				}, {
					name: '已过期/失效',
					number: 2
				}],
				type: 0,
				state: 0, //优惠券状态
			}
		},
		onShow() {
			this.getFindCouponList()
		},
		methods: {
			orderStateChange(index) {
				this.type = index;
				this.state = this.tabList[index].number

				this.getFindCouponList()
			},
			getFindCouponList() {
				uni.showLoading({
					title: '加载中...',
				})

				let shopId = getCurShopid();
				if (shopId && shopId != "") {
					NET.request(API.GetCouponsByshopId, {
						"shopId": shopId,
						state: this.state
					}, "POST", ).then(res => {
						uni.hideLoading()
						this.list = res.data
						this.list.forEach((item => {
							if (item.state === 0) {
								this.availableList.push(item)
							}
						}))
					}).catch(res => {
						uni.hideLoading()
					})
				}
			},
			getDate(time) {
				if (!time) return '';
				return time.split(' ')[0]
			},
			useTap(item) {
				uni.navigateTo({
					url: `../../pages_category_page1/goodsModule/couponShopList?activityId=${item.activityId}&shopCouponId=${item.shopCouponId}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.emptyOrder-box {
		margin-top: 70upx;

		.emptyOrder-img {
			width: 270upx;
			height: 270upx;
		}
	}

	.list {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.item {
		width: 690rpx;
		height: 200rpx;
		background: rgba(53, 217, 123, 0.5);
		border-radius: 10rpx;
		margin-top: 20rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		position: relative;
	}

	.item:last-child {
		margin-bottom: 100rpx;
	}

	.lable {
		padding: 10rpx 10rpx;
		background: rgba(0, 170, 73, 0.2);
		border-radius: 10rpx 0px 10rpx 0px;
		font-size: 20rpx;
		font-weight: 500;
		line-height: 28rpx;
		text-align: center;
		color: #FFFFFF;
		position: absolute;
		left: 0;
		top: 0;
	}

	.discoun {
		display: flex;
		flex-direction: row;
		align-items: baseline;
		font-size: 40rpx;
		margin: 0rpx 20rpx;
		color: #005500;
		width: 120rpx;

		.discounImg {
			width: 120rpx;
			height: 120rpx;
		}
	}

	.discoun text {
		display: inline-block;
	}

	.info-box {
		width: 360rpx;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}
	
	.info-box1{
		width: 540rpx;
	}

	.info-condition {
		font-size: 24rpx;
		font-weight: bold;
		color: #005500;
	}

	.info-date {
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #005500;
		margin-top: 10rpx;
	}
	
	.info-order{
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #005500;
		margin-top: 10rpx;
	}

	.use-btn {
		width: 160rpx;
		height: 56rpx;
		border: 1px solid rgba(0, 170, 73, 1.0);
		border-radius: 28rpx;
		line-height: 56rpx;
		text-align: center;
		font-size: 24rpx;
		font-weight: 500;
		background-color: rgba(0, 170, 73, 1.0);
		color: #FFFFFF;
	}
</style>
