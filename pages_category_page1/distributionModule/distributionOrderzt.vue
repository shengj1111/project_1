<template>
	<view>
		<view v-if="FindMySalesData.total>0">
			<view  class="flex-center clientList-box" v-for="(item, index) in FindMySalesDatalist" :key="index">
				<view class="directAward-box font-color-656 fs26">
					<view class="directAward-icon flex-row-plus flex-items flex-sp-between" @click="arrowTypeChange(index,item)">
						<view class="flex-column-plus font-color-333">
							<label class="orderId-box">订单号：{{item.orderId}}</label>
						</view>
						<view class="addressLeft-icon">
							<u-icon name="arrow-right" color="#dedede" size="32"></u-icon>
						</view>
						<!-- <image v-if="item.ifOpen == false" class="arrow-down" src="../../static/images/arrowDownIcon2.png"></image>
						<image v-if="item.ifOpen == true" class="arrow-down" src="../../static/images/arrowUpIcon2.png"></image> -->
					</view>
					 <!-- v-if="item.ifOpen == true" -->
					<view class="upBox">
						<view class="flex-row-plus flex-items mar-top-30 flex-sp-between">
							<label class="orderId-box">商品数：{{item.products}}</label>
							<label class="orderId-box">实付金额：¥{{item.price}}</label>
						</view>
						
						<view class="lianxi">
							  <label class="orderId-box">联系方式：{{item.customerPhone}}</label>
							  <label class="orderId-box">状态：{{item.state == 0?'未结算':'结算'}}</label>
						</view>
						
						<view class="flex-row-plus flex-items mar-top-30 flex-sp-between">
							<label class="">下单人：({{item.buyerUserId}}){{item.customerName}}</label>
						</view>
						
					</view>
				</view>
			</view>
		</view>
		<view v-else class="emptyCart-box flex-items-plus flex-column">
			<image class="emptyCart-img" src="../../static/img/bgnull.png"></image>
			<label class="font-color-999 fs26 mar-top-30">这里空空如也~</label>
		</view>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		data() {
			return {
				shopId: 0,
				distributorId: 0,
				page:1,
				pageSize:20,
				FindMySalesData: [],
				FindMySalesDatalist:[],
				orderId:""
			}
		},
		onLoad: function(options) {
			this.shopId = options.shopId
			this.distributorId = options.distributorId
			this.getSalesOrderPage()
		},
		onReachBottom(){
			if(this.loadingType == 1){
				uni.stopPullDownRefresh()
			}else{
				this.page = this.page+1
				this.getSalesOrderPage()
			}
		},
		methods: {
			getSalesOrderPage() {
				uni.showLoading({
					title: '加载中...'
				})
				NET.request(API.FindMySalesPageing, {
					shopId: this.shopId,
					distributorId: this.distributorId,
					page:this.page,
					pageSize:this.pageSize,
				}, 'GET').then(res => {
					uni.hideLoading()
					if(res.data.list.length == 0){
						this.loadingType = 1
						this.page = this.page
					}
					this.FindMySalesDatalist = this.FindMySalesDatalist.concat(res.data.list)
					this.FindMySalesData = res.data
				}).catch(res => {
					uni.hideLoading()

				})
			},

			arrowTypeChange(arrowTypeId,item) {
				// this.FindMySalesData.list[arrowTypeId].ifOpen = this.FindMySalesData.list[arrowTypeId].ifOpen == true ? false : true
				uni.navigateTo({
					url:`/pages_category_page1/orderModule/orderDetails?orderId=${item.orderId}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.emptyCart-box{
		margin-top: 70upx;
		.emptyCart-img{
			width: 270upx;
			height: 270upx;
		}
	}
	.lianxi{
		display: flex;
		margin-top: 40rpx;
		label:first-child{
			white-space: nowrap;
			flex: 1;
		}
	}
	.directAward-box {
		width: 95%;
		display: flex;
		justify-content: flex-start;
		flex-direction: column;
		background-color: #F7F7F7;
		padding: 40upx 20upx;
		margin-top: 30upx;
		border-radius: 8upx;

		.orderId-box {
			width: 320upx;

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
