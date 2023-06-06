<template>
	<view>
		<view class="totalAward-topBackImg flex-items flex-column">
			<view class="totalAward-content flex-column font-color-FFF">
				<view class="flex-column-plus flex-items mar-top-40">
					<label>累计奖励(元）</label>
					<label class="mar-top-20 fs60">{{ZSalesOrderData.total}}</label>
				</view>
				<view class="flex-row-plus flex-sp-between fs24 mar-top-10">
					<view class="flex-column-plus flex-items">
						<label>{{ZSalesOrderData.directPrice}}</label>
						<label class="mar-top-20">直接奖励(元）</label>
					</view>
					<view class="flex-column-plus flex-items">
						<label>{{ZSalesOrderData.indirectPrice}}</label>
						<label class="mar-top-20">间接奖励(元）</label>
					</view>
				</view>
			</view>
		</view>
		<view class="awardType-box flex-center">
			<view class="awardType-content">
				<u-tabs :list="awardTypeList" bar-width="60" :bold="false" active-color="#00AA49" inactive-color="#999999"
				 :is-scroll="false" :current="awardTypeFlag" @change="awardTypeActive"></u-tabs>
			</view>
		</view>
		<view v-if="awardTypeFlag == 0">
			<view v-if="ZStotallength>0">
				<view class="flex-center" v-for="(item, index) in ZSalesOrderDatalist" :key="index">
					<view class="directAward-box font-color-656 fs26" @click="arrowTypeChange1(index)">
						<view style="display: flex;">
							<view style="flex: 1;">
								<label class="orderId-box">订单号：{{item.orderFormid}}</label>
								<br>
								佣金：<label class="font-color-FF7700">¥{{item.commission}}</label>
							</view>
							<view>
								<image v-if="item.ifOpen  == false" class="arrow-down" src="../../static/images/arrowDownIcon.png"></image>
								<image v-if="item.ifOpen  == true" class="arrow-down" src="../../static/images/arrowUpIcon.png"></image>
							</view>
						</view>
						<view v-if="item.ifOpen  == true">
							<view class="flex-row-plus flex-items mar-top-30">
								<label class="orderId-box">商品数：{{item.products}}</label>
								<label class="commission-box mar-left-70">实付金额：¥{{item.price}}</label>
							</view>
							<view class="flex-row-plus flex-items mar-top-30">
								<label class="orderId-box">下单人：{{item.customerName}}</label>
								<label class="commission-box mar-left-70">状态：{{item.state==1?'未结算':'已结算'}}</label>
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
		<view v-if="awardTypeFlag == 1">
			<view v-if="JStotallength>0">
				<view class="flex-center" v-for="(item,index) in JSalesOrderDatalist" :key="index">
					<view class="directAward-box font-color-656 fs26" @click="arrowTypeChange(index)">
						<view style="display: flex;">
							<view style="flex: 1;">
								<label class="orderId-box">订单号：{{item.orderFormid}}</label>
								<br>
								佣金：<label class="font-color-FF7700">¥{{item.commission}}</label>
							</view>
							<view>
								<image v-if="item.ifOpen  == false" class="arrow-down" src="../../static/images/arrowDownIcon.png"></image>
								<image v-if="item.ifOpen  == true" class="arrow-down" src="../../static/images/arrowUpIcon.png"></image>
							</view>
						</view>
						<view v-if="item.ifOpen  == true">
							<view class="flex-row-plus flex-items mar-top-30">
								<label class="orderId-box">商品数：{{item.products}}</label>
								<label class="commission-box mar-left-70">实付金额：¥{{item.price}}</label>
							</view>
							<view class="flex-row-plus flex-items mar-top-30">
								<label class="orderId-box">下单人：{{item.customerName}}</label>
								<label class="commission-box mar-left-70">状态：{{item.state==0?'未结算':'已结算'}}</label>
							</view>
							<view class="flex-row-plus flex-items mar-top-30">
								<label class="orderId-box">分销员：{{item.distributorName}}</label>
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
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		data() {
			return {
				awardTypeList: [{
					name: '直接奖励'
				}, {
					name: '间接奖励'
				}],
				awardTypeFlag: 0,
				item: {},
				SalesOrderQuery: {
					model: {
						tenantCode: '',
						type: ''
					},
					current: 0,
					size:10
				},
				SalesOrderData: [],
				ZSalesOrderData: [],
				JSalesOrderData: [],
				shopId:0,
				distributorId:0,
				tenantCode:{},
				ZStotallength:0,
				JStotallength:0,
				page:1,
				pageSize:20,
				loadingType:0,
				loadingType1:0,
				ZSalesOrderDatalist:[],
				JSalesOrderDatalist:[]
			}
		},
		onLoad: function(optins) {
			this.shopId = optins.shopId
			this.distributorId = optins.distributorId
			this.getZSalesOrderData()
			this.getJSalesOrderData()
		},
		onReachBottom(){
			if(this.awardTypeFlag == 0){
				if(this.loadingType == 1){
					uni.stopPullDownRefresh()
				}else{
					this.page = this.page+1
					this.getZSalesOrderData()
				}
			}else{
				if(this.loadingType1 == 1){
					uni.stopPullDownRefresh()
				}else{
					this.page = this.page+1
					this.getJSalesOrderData()
				}
			}

		},
		methods: {
			getZSalesOrderData() {
				uni.showLoading({
					title: '加载中...'
				})
				NET.request(API.FindSalesOrderPage, {
					shopId: this.shopId,
					distributorId: this.distributorId,
					type:1,
					page:this.page,
					pageSize:this.pageSize
				}, 'GET').then(res => {
					uni.hideLoading()
					if(res.data.page.list.length == 0){
						this.loadingType = 1
						this.page = this.page
					}
					this.ZSalesOrderDatalist = this.ZSalesOrderDatalist.concat(res.data.page.list)
					this.ZSalesOrderData = res.data
					this.ZStotallength = this.ZSalesOrderData.page.total
				}).catch(res => {
					uni.hideLoading()
				})
			},
			getJSalesOrderData() {
				uni.showLoading({
					title: '加载中...'
				})
				NET.request(API.FindSalesOrderPage, {
					shopId: this.shopId,
					distributorId: this.distributorId,
					type:2,
					page:this.page,
					pageSize:this.pageSize
				}, 'GET').then(res => {
					uni.hideLoading()
					if(res.data.page.list.length == 0){
						this.loadingType1 = 1
						uni.showToast({
							title: '已加载全部···',
							duration: 2000,
							icon: 'none'
						});
						this.page = this.page
					}
					this.JSalesOrderDatalist = this.JSalesOrderDatalist.concat(res.data.page.list)
					this.JSalesOrderData = res.data
					this.JStotallength = this.JSalesOrderData.page.total
				}).catch(res => {
					uni.hideLoading()
				})
			},

			awardTypeActive(index) {
				this.awardTypeFlag = index
				this.page = 1
			},
			arrowTypeChange1(arrowTypeId) {
				this.ZSalesOrderData.page.list[arrowTypeId].ifOpen = this.ZSalesOrderData.page.list[arrowTypeId].ifOpen == false ? true : false
			},
			arrowTypeChange(arrowTypeId) {
				this.JSalesOrderData.page.list[arrowTypeId].ifOpen = this.JSalesOrderData.page.list[arrowTypeId].ifOpen == false ? true : false
			}

		}
	}
</script>

<style lang="scss">
	.totalAward-topBackImg {
		width: 100%;
		height: 320upx;
		// background: url(../../static/images/totalAwardTopBackImg.png) no-repeat;
		
		background-size: 100% 320upx;
	background-color: #00AA49;
		.totalAward-content {
			width: 80%;
		}
	}

	.awardType-box {
		border-bottom: 1upx solid #EDEDED;

		.awardType-content {
			height: 80upx;
			width: 500upx;
		}
	}

	.emptyCart-box {
		margin-top: 70upx;

		.emptyCart-img {
			width: 270upx;
			height: 270upx;
		}
	}

	.directAward-box {
		width: 90%;
		border-bottom: 1upx solid #EDEDED;
		padding: 50upx 0;
		display: flex;
		justify-content: flex-start;
		flex-direction: column;

		.orderId-box {
			width: 320upx;
			display: flex;
			justify-content: flex-start;
			flex-direction: row;
		}

		.commission-box {
			width: 260upx;
		}

		.arrow-down {
			width: 24upx;
			height: 24upx;
		}
	}

	.totalAwardEmpty-box {
		margin-top: 65upx;

		.totalAwardEmpty {
			width: 270upx;
			height: 270upx;
		}
	}
</style>
