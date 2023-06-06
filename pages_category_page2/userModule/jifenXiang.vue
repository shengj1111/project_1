<!-- 订单详情 -->
<template>
	<view>
		<view class="content" style="padding-bottom::200upx;">
			<view class="order-details-status">
				<view class="status-title-box">
					<view class="l">
						<text class="status">{{goodsItem.stateDesc}}</text>
						<text class="label"></text>
					</view>
					<image class='r' src="../../static/images/orderDaifukuan.png"></image>
				</view>
			</view>

			<view class="order-details-info-box">
				<view class="address-box">
					<image src="../../static/images/orderAddress.png" class="address-img"></image>
					<view class="address-r">
						<view class="address-name-box">
							<text>{{goodsItem.receiveName}}</text>
							<text class="phone">{{goodsItem.receivePhone}}</text>
						</view>
						<view class="address-info">
							<view>{{goodsItem.receiveAdress}}</view>
							<view>{{goodsItem.address}}</view>
						</view>
					</view>
					<image src="../../static/images/arrowRight.png" v-if="false" class="arrow-right-img"></image>
				</view>
				<view class="order-list-box">
					<view class="item">
						<view class="order-info-box">
							<view class="order-info">
								<view class="order-info-item">
									<image :src="goodsItem.productImg" class="product-img"></image>
									<view class="info-box">
										<text class="product-name">{{goodsItem.productName}}</text>
										<view class="price-sku-box">
									<!-- 		<view class="product-sku">
												<view class="mar-left-20">
													<text>单个积分 : {{goodsItem.integral}}</text>
												</view>
											</view> -->
											<view class="product-num">单个积分 : {{goodsItem.integral}}</view>
											<view class="product-num">数量 : {{goodsItem.number}}</view>
										</view>
										<view class="price-sku-box">

											<view class="product-num">总积分 : {{goodsItem.totalintegral}}</view>
										</view>
									</view>
								</view>

							</view>


						</view>
					</view>
				</view>
			</view>
			<view class="order-details-information padd">
				<view class="order-title">
					<text class="line"></text>
					<text>订单信息</text>
				</view>
				<view class="info-box">
					<!--都有  但是：待付款  待发货  退款成功 交易关闭  只有前两个item-->
					<view class="item">
						<text>订单编号：{{goodsItem.orderFormid}}</text>

					</view>
					<view class="item">
						<text>创建时间：{{goodsItem.createTime}}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 待付款 待发货 待收货 已完成 退款成功 -->
		<view class="order-details-btn" style="padding-top:30upx;"
			:style="{'padding-bottom':(isIphone==true? 40:0)+'rpx'}">
		</view>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	import {
		getCurShopid
	} from '@/api/common.js'
	import uniSteps from "@/components/uni-steps/uni-steps.vue"

	// #ifdef H5
	var jweixin = require('jweixin-module')
	// #endif
	export default {
		data() {
			return {
				orderFrom: {
					orderFormid: '', //积分订单id
					page: 1,
					pageSize: 10,
					shopId: '',
				},
				goodsItem: {}, //详情
				dataList: [],
				active: 0,
				steps: [],


				item: {},
				isIphone: false,

			}
		},
		components: {
			uniSteps
		},
		onLoad(options) {
			this.orderFrom.shopId = getCurShopid()
			if (options.orderFormid != undefined) {
				this.orderFrom.orderFormid = options.orderFormid
			}
			this.getDataList()
		},
		methods: {

			getDataList() {
				NET.request(API.conversionRecord, this.orderFrom, 'GET').then(res => {
					this.goodsItem = res.data.list[0]
					console.log(res, '详情')
				})
			},
			timeFormat(param) { //小于10的格式化函数
				return param < 10 ? '0' + param : param;
			},

		},
		filters: {
			clip2Decimal(value) {
				if (value === undefined || value === null) {
					return "0.00"
				}
				return (parseInt(value * 100) / 100).toFixed(2)
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #f7f7f7;
	}

	.logistics {
		padding: 20upx 20upx;
	}

	.content {
		padding: 0 0 120upx 0;
	}

	.order-details-status {
		width: 750upx;
		height: 230upx;
		// background: linear-gradient(90deg, rgba(0, 229, 95, 1.0), rgba(0, 170, 73, 1));
		background-color: #00AA49;
		border-radius: 0 0 40upx 40upx;
	}

	.status-title-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 40upx 30upx 0;
		box-sizing: border-box;
	}

	.status-title-box2 {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40upx 30upx 0;
		box-sizing: border-box;
	}

	.status-title-box .l {
		display: flex;
		flex-direction: column;
	}

	.status-title-box .l .status,
	.status-title-box2 .status {
		font-size: 30upx;
		color: #fff;
	}

	.status-title-box .l .label,
	.status-title-box2 .label {
		font-size: 24upx;
		color: #fff;
		margin-top: 14upx;
	}

	.status-title-box .r {
		width: 80upx;
		height: 80upx;
	}

	.order-details-info-box {
		padding: 0 30upx;
		box-sizing: border-box;
		margin-top: -80upx;
	}

	.address-box {
		margin-top: 20upx;
		background: #fff;
		border-radius: 10upx;
		width: 100%;
		padding: 30upx;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.address-box .address-img {
		width: 70upx;
		height: 70upx;
		margin-right: 20upx;
	}

	.address-box .address-r {
		flex: 1;
		display: flex;
		flex-direction: column;
		font-size: 28upx;
		color: #333;
	}

	.arrow-right-img {
		width: 24upx;
		height: 24upx;
		margin-left: 20upx;
	}

	.address-name-box {
		font-size: 30upx;
		color: #333;
	}

	.phone {
		font-size: 24upx;
		color: #999;
		margin-left: 20upx;
	}

	.address-info {
		font-size: 28upx;
		color: #333;
		margin-top: 15upx;
	}

	.order-list-box {
		margin-top: 20upx;
	}

	.order-list-box .item {
		margin-bottom: 20upx;
		background: #fff;
		border-radius: 10upx;
	}

	.order-list-top {
		height: 96upx;
		padding: 0 30upx;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #eee;
	}

	.top-l {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.shop-img {
		width: 34upx;
		height: 34upx;
		margin-right: 10upx;
	}

	.shop-name {
		font-size: 30upx;
		color: #333;
		font-weight: bold;
	}

	.arrow-img {
		margin-left: 15upx;
		width: 24upx;
		height: 24upx;
	}

	.order-info-box {
		padding: 0 30upx;
		box-sizing: border-box;
	}

	.order-info {
		border-bottom: 1px solid #eee;
	}

	.order-info-item {
		display: flex;
		flex-direction: row;
		padding: 20upx 0;
	}

	.product-img {
		width: 180upx;
		height: 180upx;
		border-radius: 10upx;
		margin-right: 30upx;
	}

	.info-box {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.product-name {
		font-size: 26upx;
		color: #333;
		height: 68upx;
		line-height: 34upx;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.price-sku-box {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.product-sku {
		font-size: 24upx;
		color: #999;
		display: inline-block;
		margin-left: -20upx;
		display: flex;
		flex-direction: row;
	}

	.price-box {
		display: flex;
		flex-direction: column;
	}

	.product-price1 {
		font-size: 24upx;
		color: #333;
		font-weight: 400;
	}

	.product-price2 {
		font-size: 24upx;
		color: #999;
		text-decoration: line-through;
		font-weight: 400;
	}

	.product-price .fuhao {
		font-size: 28upx;
	}

	.item-applay-btn {
		height: 50upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 0 30upx;
		background: rgba(255, 255, 255, 1);
		border: 1px solid rgba(187, 187, 187, 1);
		border-radius: 25upx;
		font-size: 24upx;
		font-weight: 400;
		// color: rgba(51, 51, 51, 1);
	}

	.product-num {
		font-size: 28upx;
		// color: #999;
		display: inline-block;
	}

	.delivery-way-box {
		display: flex;
		flex-direction: column;
		margin: 30upx 0 10upx;
	}

	.delivery-way-box .item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		font-size: 26upx;
		// color: #333;
	}

	.delivery-way-box .item .way {
		color: #999;
	}

	.order-total-box {
		padding: 30upx 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		font-size: 26upx;
		color: #333;
	}

	.order-total-box .way-color {
		color: #ff7911;
	}

	.order-details-information {
		background: #fff;
	}

	.order-details-information.padd {
		padding: 30upx;
		box-sizing: border-box;
	}

	.order-details-information .order-title {
		font-size: 30upx;
		color: #333;
		font-weight: 500;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.order-details-information .order-title .line {
		width: 4upx;
		height: 30upx;
		background: #ff7911;
		margin-right: 10upx;
	}

	.order-details-information .info-box {
		margin-top: 30upx;
	}

	.order-details-information .info-box .item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		font-size: 24upx;
		color: #666;
		margin-bottom: 20upx;
	}

	.order-details-information .info-box .item .copy-color {
		font-size: 24upx;
		color: #ff7911;
	}

	.order-details-btn {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		min-height: 140upx;
		background: #fff;
		box-shadow: 0px 0px 10px 0px rgba(51, 51, 51, 0.1);
		box-sizing: border-box;
		display: flex;
		padding: 0 30upx;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		z-index: 10;
	}

	.order-details-btn .btn {
		width: 100%;
		height: 80upx;
		background: linear-gradient(90deg, rgba(255, 162, 0, 1), rgba(255, 121, 17, 1));
		border-radius: 40upx;
		font-size: 28upx;
		color: #fff;
		text-align: center;
		line-height: 80upx;
		font-weight: 500upx;
	}

	.order-details-btn .btn-l {
		width: 216upx;
		height: 80upx;
		border: 1px solid #bbb;
		border-radius: 40upx;
		font-size: 28upx;
		color: #999;
		text-align: center;
		line-height: 80upx;
		box-sizing: border-box;
	}

	.order-details-btn .btn-r {
		width: 454upx;
	}

	.mt20 {
		margin-top: 20upx;
	}

	.order-title-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.order-details-information .order-title-box .order-title.padd-l {
		padding-left: 30upx;
	}

	.arrow-down-img {
		width: 40upx;
		height: 40upx;
		margin: 30upx;
		box-sizing: border-box;
	}

	.evaluate {
		height: 56upx;
		border-radius: 28upx;
		text-align: center;
		line-height: 56upx;
		font-size: 26upx;
		padding: 0 30upx;
		border: 1px solid #FF7911;
		color: #FF7911;
	}

	.evaluate2 {
		height: 56upx;
		border-radius: 28upx;
		text-align: center;
		line-height: 56upx;
		font-size: 26upx;
		padding: 0 30upx;
		border: 1px solid #BBBBBB;
		color: #333;
	}

	.emptyOrder-box {
		padding: 70upx 0;

		.emptyOrder-img {
			width: 200upx;
			height: 200upx;
		}
	}

	.clusterback {
		width: 80rpx;
		height: 80rpx;
		background-color: #FFFFFF;
	}

	.pay-type-item {
		.pay-type-radio {
			background-color: white;
			border-bottom: 1upx solid #EDEDED;
			margin-bottom: 20upx;
			padding: 24upx 20upx 24upx 20upx;

			.pay-type-img {
				display: inline-block;

				.pay-type-img-inner {
					width: 50upx;
					height: 50upx;
					vertical-align: middle;
				}
			}

			.pay-type-label {
				vertical-align: middle;
				margin-left: 30upx;
			}

			.pay-type-radio-item {
				float: right;
				margin-right: 20upx;
				width: 50upx;
				height: 50upx;
			}
		}

		.huabei-detail {
			margin-top: 20upx;

			.fenqi-wenzi {
				display: inline-block;
				margin-left: 64upx;
			}

			.fenqi-amount {
				display: block;
				margin-left: 64upx;
				margin-top: 14upx;
				color: #BABBBC;
			}

			.fenqi-charge-fee {
				float: right;
				margin-right: 68upx;
				color: #BABBBC;
			}

			.fenqi-modal {
				width: 40upx;
				height: 40upx;
				margin-left: 20upx;
				float: right;
				position: relative;
				top: -80upx;
			}
		}
	}

	.paytype-confirm {
		height: 120upx;
		padding: 0upx 108upx 0upx 32upx;

		.fenqi-all {
			display: inline-block;
			width: 100%;
		}

		.fenqi-total-amount {
			width: 65%;
			float: left;
		}

		.fenqi-confirm {
			float: right;
			width: 160upx;
			padding: 0upx 20upx;

			.btn {
				width: 216upx;
				height: 80upx;
				line-height: 80upx;
				border-radius: 40upx;
				font-size: 28upx;
				text-align: center;
				background: linear-gradient(90deg, rgba(255, 162, 0, 1), rgba(255, 121, 17, 1));
				color: #fff;
				display: inline-block;
				margin-right: 66upx;
			}
		}
	}

	.period-radio {
		margin: 30upx;
		padding-right: 100upx;
		width: 95%;
		border-bottom: 1px solid #EFEFEF;

		.period-amount {
			display: inline-block;

			.period-each-charge {
				display: inline-block;
				margin-top: 12upx;
				margin-left: 6upx;
				font-size: 26upx;
				color: #b7b7b7;
				margin-bottom: 13upx;
			}
		}

		.period-each {
			display: block;
		}

		.period-type-radio-item {
			float: right;
		}
	}
</style>
