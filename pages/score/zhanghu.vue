<template>
	<view class="container">
		<view class="content">
			<!-- 表头,第一行 -->
			<view class="list-item weight" >
				<view class="right">获取途径</view>
				<view class="right" >余额</view>
				<view class="right" >剩余余额</view>
			</view>
			
			<view class="list-item" v-for="(item,index) in recordList" :key="index" @click="goOrderDetails(item)">
				<view class="left">
					<view class="channel">
						{{item.channelDesc}}
					</view>
					<view class="time">
						{{item.createtime}}
					</view>
				</view>
				<view  class="right" :class="{'green':item.number >= 0 ,'red':item.number < 0}">{{item.number}}</view>
				<view  class="rightFlex">
					<view class="right-text">
						{{item.historyNumber}}
					</view>
					<view class="right-img" >
						<image v-if="item.orderId && item.orderId != 0" src="@/static/img/user/arrow.png" ></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
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
			}
		},
		onShow() {
			this.getListForm.shopId = getCurShopid()
			this.recordList = []
			this.getAllList()
		},
		methods: {
			onReachBottom() {
				uni.showLoading({
					title: '加载中'
				})
				this.getListForm.page += 1
				this.getAllList()
			},
			//获取所有积分明细
			getAllList() {
				NET.request(API.getYuList, this.getListForm, 'POST').then(res => {
						this.recordList = this.recordList.concat(res.data.list)
						uni.hideLoading()
				})
			},
			//查看详情
			goOrderDetails(item){
				if(item.orderId && item.orderId != ''){
					uni.setStorageSync("afterapplyItem", item)
					uni.navigateTo({
						url: '/pages_category_page1/orderModule/orderDetails?orderId=' + item.orderId
					})
				}
			},
		},
	}
</script>

<style lang="scss" scoped>
	.weight{
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
				.channel{
					font-size: 30rpx;
				}
				.time{
					font-size: 20rpx;
				}
			}
			.rightFlex{
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-content: center;
				height: 30rpx;
				.right-text{
					height: 30rpx;
				}
				.right-img{
					width:30rpx;
					height: 30rpx;
					margin-left: 10rpx;
					margin-top: 4rpx;
					image{
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
