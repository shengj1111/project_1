<!-- 取消订单页面 -->
<template>
	<view class="content">
		<view class="header-quxiao">
			<view>
				取消原因
			</view>
			<view v-if="quxiaoFrom.approvestate != '审核中'">
				<u-input v-model="quxiaoFrom.reason" type="textarea" border placeholder="请输入订单取消原因" auto-height />
			</view>
			<view v-else style="color: red;">
				{{quxiaoFrom.reason}}
			</view>
			<view class="header-quxiao" v-if="quxiaoFrom.createTime && quxiaoFrom.createTime != ''">
				<view>
					申请时间
				</view>
				<view style="color: red;">
					{{quxiaoFrom.createTime}}
				</view>
			</view>
			<view class="header-quxiao" v-if="quxiaoFrom.approvestate && quxiaoFrom.approvestate != ''">
				<view>
					审核状态
				</view>
				<view style="color: red;">
					{{quxiaoFrom.approvestate}}
				</view>
			</view>
			<view class="header-quxiao" v-if="quxiaoFrom.remark && quxiaoFrom.remark != ''">
				<view>
					备注
				</view>
				<view style="color: red;">
					{{quxiaoFrom.remark}}
				</view>
			</view>

		</view>

		<view>
			<!-- <view class="tijiao" @click="quxiaodingdan" v-if="quxiaoFrom.approvestate != '审核中' && state != 5">提交</view> -->
			<view class="tijiao" @click="quxiaodingdan" v-if="quxiaoFrom.approvestate != '审核中' && quxiaoFrom.approvestate != '同意' && quxiaoFrom.approvestate != '0'">提交</view>
		</view>

	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	import LbPicker from '@/components/lb-picker'
	import {
		pointcancelById, //订单取消
		insertPointOrdercancel, //积分取消订单
	} from '@/api/shopmanage.js'

	export default {
		components: {
			LbPicker
		},
		data() {
			return {
				quxiaoFrom: {
					reason: '', //取消原因
					shopId: '', //店铺id
					id: 0,
					orderId: 0, //订单id
				},
				state: 0, //订单状态
				isJiFen: false, //是否是积分订单的取消
				buyerUserId: '', //用户id
			}
		},
		onLoad(options) {
			if (options.orderId != undefined) {
				this.quxiaoFrom.orderId = options.orderId
			}
			if (options.shopId != undefined) {
				this.quxiaoFrom.shopId = options.shopId
			}
			if (options.state != undefined) {
				this.state = options.state
			}
			if (options.isJiFen != undefined) {
				this.isJiFen = options.isJiFen
			}
			if (options.buyerUserId != undefined) {
				this.buyerUserId = options.buyerUserId
			}

			this.orderXiangqing()
		},
		
		methods: {
			// 订单详情
			orderXiangqing() {
				if (this.isJiFen) {
					// 积分订单取消详情
					pointcancelById(this.quxiaoFrom.orderId).then(res => {
						if (res.data && res.data != '' && res.data.id > 0) {
							this.quxiaoFrom = res.data
						}

					})
				} else {
					//普通订单取消详情
					NET.request(API.getApplyCancel, {
						orderId: this.quxiaoFrom.orderId
					}, 'get').then(res => {
						if (res.data && res.data != '' && res.data.id > 0) {
							this.quxiaoFrom = res.data
						}
					})
				}
			},
			// 普通订单取消
			quxiaodingdan() {
				console.log(this.quxiaoFrom, 9988)
				if (this.quxiaoFrom.reason == '') {
					uni.showToast({
						title: '请填写订单取消原因',
						icon: 'none',
						duration: 1500
					});
					return
				}
				uni.showModal({
					title: '温馨提示',
					content: '您确定要执行该操作吗？',
					confirmText: '确定取消',
					cancelText: '点错了',
					success: res => {
						if (res.confirm) {

							if (this.isJiFen) {
								let obj = {
									...this.quxiaoFrom
								}
								obj.orderFormid = obj.orderId
								obj.buyerUserId = this.buyerUserId
								// remove obj.orderId
								insertPointOrdercancel(obj).then(res => {
									console.log(res, '提交成功')
									uni.showToast({
										title: '提交成功,请等待审核',
										icon: 'none',
										duration: 1500
									});
									setTimeout(() => {
										uni.navigateBack({
											delta: 1
										});
									}, 1500)
								})
							} else {
								NET.request(API.applyCancel, this.quxiaoFrom, 'POST').then(res => {
									console.log(res, '提交成功')
									uni.showToast({
										title: '提交成功,请等待审核',
										icon: 'none',
										duration: 1500
									});
									setTimeout(() => {
										uni.navigateBack({
											delta: 1
										});
									}, 1500)

								})
							}

						} else if (res.cancel) {

						}
					}
				})

			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 20rpx;
		box-sizing: border-box;

		.header-quxiao {

			// display: flex;
			// flex-direction: column;
			// justify-content: space-around;
			// height: 200rpx;
			view {
				font-weight: 600;
				margin: 10rpx 0rpx;
			}
		}

		.tijiao {
			position: fixed;
			z-index: 99;
			bottom: 40rpx;
			left: 50%;
			width: 85%;
			height: 80rpx;
			background-color: rgb(0, 170, 73);
			color: #FFFFFF;
			text-align: center;
			line-height: 80rpx;
			font-size: 36rpx;
			font-weight: 600;
			border-radius: 10rpx;
			transform: translateX(-50%);
		}
	}
</style>
