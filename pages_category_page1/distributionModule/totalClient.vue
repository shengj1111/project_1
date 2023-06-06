<template>
	<view>
		<view class="totalClient-topBackImg flex-items flex-column">
			<label class="font-color-FFF mar-top-40">累计客户(人）</label>
			<label class="font-color-FFF mar-top-20 fs60">{{SalesCustomerData.total}}</label>
			<view class="content mar-top-30" v-if="SalesCustomerData.total>0">
				<!-- <view class="flex-center flex-items mar-top-40">
					<image class="totalClient-left" src="../../static/images/totalClientLeft.png"></image>
					<label class="massage-text">我的客户信息</label>
					<image class="totalClient-left" src="../../static/images/totalClientRight.png"></image>
				</view> -->
				<view class="flex-center clientList-box" v-for="(item, index) in SalesCustomerDatalist" :key="index">
					<view class="directAward-box font-color-656 fs26" @click="arrowTypeChange1(index)">
						<view class="directAward-icon flex-row-plus flex-items flex-sp-between">
							<label class="font-color-333 fs28">客户昵称：({{item.buyerUserId}}){{item.customerName}}
							<text style="color: red;" v-if="item.vipname">({{item.vipname}})</text>
							
							</label>
							<!-- <image v-if="item.ifOpen  == false" class="arrow-down"
								src="../../static/images/arrowDownIcon2.png"></image>
							<image v-if="item.ifOpen  == true" class="arrow-down"
								src="../../static/images/arrowUpIcon2.png"></image> -->
						</view>
						<view class="upBox">
							<view class="flex-row-plus flex-items mar-top-30 flex-sp-between">
								<label class="orderId-box">手机号：{{item.customerPhone}}</label>
							</view>
						<!-- 	<view class="flex-row-plus flex-items mar-top-30 flex-sp-between">
								<label class="orderId-box">累计下单数：{{item.orders}}</label>
								<label class="commission-box mar-left-70">累计消费金额：￥{{item.price}}</label>
							</view> -->
						</view>
					</view>
				</view>
			</view>
			<view v-else class="emptyCart-box flex-items-plus flex-column">
				<image class="emptyCart-img" src="../../static/img/bgnull.png"></image>
				<label class="font-color-999 fs26 mar-top-30">这里空空如也~</label>
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

				item: {},
				SalesCustomerQuery: {
					model: {
						tenantCode: ''
					}
				},
				SalesCustomerData: [],
				shopId: 0,
				distributorId: 0,
				page: 1, //当前页
				pageSize: 10, //每页记录数
				loadingType: 0,
				SalesCustomerDatalist: []
			}
		},
		onLoad: function(options) {
			this.shopId = JSON.parse(options.shopId)
			this.distributorId = options.distributorId
			this.getSalesCustomer()
		},
		onReachBottom() {
			if (this.loadingType == 1) {
				uni.stopPullDownRefresh()
			} else {
				this.pageSize = this.pageSize + 10
				this.getSalesCustomer()
			}
		},
		methods: {
			getSalesCustomer() {
				uni.showLoading({
					title: '加载中...'
				})
				NET.request(API.FindSalesCustomerList, {
					shopId: this.shopId,
					distributorId: this.distributorId,
					page: this.page,
					pageSize: this.pageSize
				}, 'GET').then(res => {
					uni.hideLoading()
					this.SalesCustomerDatalist = this.SalesCustomerDatalist.concat(res.data.list)
					console.log(this.SalesCustomerDatalist)
					this.SalesCustomerData = res.data
					if (res.data.list.length == res.data.total) {
						this.loadingType = 1
					}
				}).catch(res => {
					uni.hideLoading()
				})
			},
			arrowTypeChange1(arrowTypeId) {
				this.SalesCustomerData.list[arrowTypeId].ifOpen = this.SalesCustomerData.list[arrowTypeId].ifOpen ==
					false ? true : false
			},
		}
	}
</script>

<style lang="scss">
	.emptyCart-box {
		margin-top: 300upx;

		.emptyCart-img {
			width: 270upx;
			height: 270upx;
		}
	}

	.totalClient-topBackImg {
		width: 100%;
		height: 400upx;
		// background: url(../../static/images/totalClientTopBackImg.png) no-repeat;
			background-color: #00AA49;
		background-size: 100% 400upx;

		.content {
			width: 690upx;
			background-color: #FFFFFF;

			.totalClient-left {
				width: 170upx;
				height: 20upx;
			}

			.massage-text {
				padding: 0 20upx;
			}
		}
	}

	.directAward-box {
		width: 95%;
		display: flex;
		justify-content: flex-start;
		flex-direction: column;
		background-color: #F7F7F7;
		padding: 50upx 20upx;
		margin-top: 30upx;
		border-radius: 8upx;

		.orderId-box {
			width: 320upx;
			display: flex;
			justify-content: flex-start;
			flex-direction: row;

		}

		.commission-box {
			width: 340upx;
		}

		.arrow-down {
			width: 24upx;
			height: 24upx;
		}

		.upBox {
			border-top: 1upx solid #EDEDED;
			margin-top: 30upx;
		}
	}
</style>
