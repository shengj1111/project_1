<template>
	<view class="container">
		<view class="content">
			<!-- 表头,第一行 -->
			<view class="list-item weight">
				<view class="right">获取途径</view>
				<view class="right">积分</view>
				<view class="right">剩余积分</view>
			</view>

			<view class="list-item" v-for="(item,index) in recordList" :key="index">
				<view class="left">
					<view class="channel">
						{{item.channel}}
					</view>
					<view class="time">
						{{item.createTime}}
					</view>
				</view>
				<view class="right" :class="{'green':item.integral >= 0 ,'red':item.integral < 0}">{{item.integral}}
				</view>
				<view class="rightFlex">
					<view class="right-text">
						{{item.historyIntegral}}
					</view>
					<view class="right-img">
						<image v-if="item.orderId && item.orderId != '' && fun(item.channel)" src="@/static/img/user/arrow.png"
							@click="goXiang(item)"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	//积分明细页面
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	import {
		getCurShopid
	} from '@/api/common.js'
	import lTime from '@/component/l-time/components/l-time/l-time.vue'
	export default {
		components: {
			lTime
		},
		data() {
			return {
				recordList: [],
				getListForm: {
					page: 1,
					pageSize: 20,
					shopId: 0,
				}, //获取所有的明细
				flag:""
			}
		},
		onLoad(options) {
			if(options.flag==1){
				this.getListForm.flag=options.flag
			}else{
				this.getListForm.flag = 0
			}
			this.getListForm.shopId = getCurShopid()
			this.getAllList()
		},
		methods: {
			// 
			fun(changle){
				 let list = ["分享奖励","邀请新人获取积分","积分奖励","业绩结算"];
				 let flag = true;
				 for (let i = 0; i < list.length; i++) {
					if(list[i]==changle){
						flag = false
					}
				 }
				 return flag;
			},
			onReachBottom() {
				uni.showLoading({
					title: '加载中'
				})
				this.getListForm.page += 1
				this.getAllList(0)

			},
			//获取所有积分明细
			
			getAllList(isconcat = 1) {
				
				NET.request(API.getRecordList, this.getListForm, 'POST').then(res => {
					if (isconcat) {
						this.recordList = res.data.list
					} else {
						this.recordList = this.recordList.concat(res.data.list)
						uni.hideLoading()
					}

				})
			},
			//去积分订单详情
			goXiang(item) {
				if (item.action == 0) {
					uni.navigateTo({
						url: `/pages_category_page2/userModule/jifenXiang?orderFormid=${item.orderId}`
					})
				} else if (item.action == 1) {
					if (item.channel == '取消积分兑换订单') {
						uni.navigateTo({
							url: `/pages_category_page2/userModule/jifenXiang?orderFormid=${item.orderId}`
						})

					} else {
						uni.setStorageSync("afterapplyItem", item)
						uni.navigateTo({
							url: '/pages_category_page1/orderModule/orderDetails?orderId=' + item.orderId
						})
					}
				}
			},
		},

	}
</script>

<style lang="scss" scoped>
	.weight {
		font-weight: 600;
	}

	.content {
		padding: 0rpx 30rpx 0rpx 30rpx;
		background-color: #FFFFFF;

		.list-item {
			width: 665rpx;
			height: 120rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1rpx solid #F3F4F5;

			.left {
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				height: 100rpx;
				// width: 240rpx;
				font-size: 24rpx;

				.channel {
					font-size: 26rpx;
				}

				.time {
					font-size: 18rpx;
				}
			}

			.rightFlex {
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-content: center;
				height: 30rpx;

				.right-text {
					height: 30rpx;
				}

				.right-img {
					width: 30rpx;
					height: 30rpx;
					margin-left: 10rpx;
					margin-top: 4rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}

			.right {
				height: 100rpx;
				font-size: 30rpx;
				line-height: 100rpx;

				&.green {
					color: #2ed573;
				}

				&.red {
					color: #ee5253;
				}

			}
		}
	}
</style>
