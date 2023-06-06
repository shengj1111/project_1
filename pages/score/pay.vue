<template>
	<!-- 提交订单 -->
	<view>
		<view class="order-submission">
			<!-- 配送和自提 -->
			<view class="bg"></view>
			<view class="allAddress" :style="systemStore ? '' : 'padding-top: 0.2*100rpx'">
				<view class="nav">
					<view class="item" :class="shipping_type === 0 ? 'on' : 'on2'" @click="addressType(0)">
						卖家配送</view>
					<view class="item" :class="shipping_type === 1 ? 'on' : 'on2'" @click="addressType(1)">买家自提</view>
				</view>
			</view>
			<view class="info">
				<u-icon name="info-circle" color="#fff"></u-icon>
				<span style="margin-left: 10rpx;">配送费需与门店协商（整车配送除外）</span>
			</view>
			<!-- 卖家配送 -->
			<view v-if="shipping_type === 0">
				<view class="addAddress flex">
					<view class="address-box" @click="addAddressTap">
						<image src="../../static/images/orderAddress.png" class="address-img"></image>
						<view class="address-r" v-if="userAddressInfo.receiveName">
							<view class="address-name-box">
								<text>{{userAddressInfo.receiveName}}</text>
								<text class="phone">{{userAddressInfo.receivePhone}}</text>
							</view>
							<view class="address-info">
								<text>{{userAddressInfo.receiveAdress}}</text>
								<text>{{userAddressInfo.address}}</text>
							</view>
						</view>
						<view class="address-r" v-else>
							<text>你还没有收货地址哦，点击这里添加</text>
						</view>
						<view class="addressRight">
							<u-icon name="arrow-right"></u-icon>
						</view>
					</view>
				</view>
			</view>
		</view>


		<!-- 买家自提 -->
		<view v-if="shipping_type === 1" style="margin-bottom: 20rpx;">
			<view class="addAddress flex">
				<view class="addressLeft" @click="addressLeft()">
					<view class="moren">门店</view>
					<view class="addressTop flex">
						<view class="address">{{shopXQ.shopName}}</view>
					</view>
					<view class="addressBottom">
						<view class="name">{{shopXQ.shopAdress}}</view>
					</view>
					<view class="addressBottom">
						<view class="tel">{{shopXQ.shopPhone}}</view>
					</view>
				</view>
			</view>

			<!-- 			<view style="margin: 40rpx;">
				<u-form :model="fahuoForm" ref='uForm'>
					<u-form-item label-width="200" label="自提人姓名" prop="receiveName" :required="true"
						:label-position="labelPosition">
						<u-input v-model="fahuoForm.receiveName" placeholder="请输入自提人姓名" />
					</u-form-item>
					<u-form-item label-width="200" label="自提手机号" prop="receivePhone" :label-position="labelPosition"
						:required="true">
						<u-input v-model="fahuoForm.receivePhone" placeholder="请输入自提手机号" />
					</u-form-item>
				</u-form>
			</view> -->


		</view>

		<view class="content">
			<view class="order-flow-box">
				<view class="flow-word">交易流程：</view>
				<view class="flow-word mt25">
					<text>1、填写收货信息并完成支付</text>
					<text>2、双方根据物品的交易方式进行交易</text>
					<text>3、拿到物品，交易结束</text>
				</view>
				<view class="flow-word mt50">注：应国家邮政总局的要求，即日起涉及到个人快递包裹必须收件人实名制，否则将影响到收寄配送。请避免使用「先生，男士，小姐，女士，昵称」等模糊称谓。
				</view>
			</view>
		</view>
		<!-- 合计 -->
		<view class="order-confirm-box" style="padding-bottom:30upx;">

			<text :class="[submitActive ? 'btn active' : 'btn']" @click="submitOrder">提交订单</text>
		</view>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	import citySelect from './u-city-select.vue';
	import {
		getCurShopid
	} from '@/api/common.js'
	// #ifdef H5
	var jweixin = require('jweixin-module')
	// #endif
	export default {
		components: {
			citySelect
		},
		data() {
			return {
				fahuoForm: {
					receiveName: '', //收货人姓名
					receivePhone: '', //收货人手机号
					address: '', //收件地址
					shopId: 0,
				},
				dizhi: '', //地址
				xiangxidizhi: '', //详细地址
				locationShowFalg: false, //是否弹窗,地址选择
				province: '',
				city: '',
				area: '',
				rules: {
					receiveName: [{
						required: true,
						message: '请填写收件人名字',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					receivePhone: [{
						required: true,
						message: '请填写收件人手机号',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					xiangxidizhi: [{
						required: true,
						message: '请填写详细地址',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
				},
				settlement: {},
				type: 0,
				userAddressInfo: {},
				isShowDiscount: false,
				isShopCoupons: false,
				reduceMoney: 0,
				submitActive: true,
				totalprice: 0, //合计
				receiveId: '',
				totalCount: 0, //共多少件
				shopXQ: {}, //店铺信息
				goodsId: 0, //商品id
				goodsNum: 0, //购买数量
				shipping_type: 0,
				pickupWay: 0, // 配送还是自提 0-配送 1-自提
				//shopdizhi:'',//自提地址
			}
		},
		onLoad(options) {
			
			this.fahuoForm.shopId = getCurShopid() //获取商店id
			this.goodsId = options.goodsId
			this.goodsNum = options.goodsNum
			this.getDefaultSite()
			this.shopXin()
			console.log(options, '传进来的参数')
		},
		onShow() {
			if (uni.getStorageSync('receiveItem')) {
				let receiveItem = uni.getStorageSync('receiveItem')
				this.userAddressInfo = receiveItem
			}
			uni.removeStorageSync('receiveItem')
		},
		methods: {
			addAddressTap() {
				uni.navigateTo({
					url: '../../pages_category_page2/userModule/address?type=2',
				})
			},
			//获取默认地址
			getDefaultSite(){
				NET.request(API.getDefault, {
				}, 'GET').then(res => {
					this.userAddressInfo = res.data
				})
			},
			//获取店铺信息
			shopXin() {
				NET.request(API.GetStoreNew, {
					shopId: this.fahuoForm.shopId
				}, 'GET').then(res => {
					this.shopXQ = res.data
				})
			},
			// 切换,配送还是自提
			addressType(index) {
				this.shipping_type = index;
				if (index == 0) {
					this.pickupWay = 0
				} else {
					this.pickupWay = 1
				}
			},
			cityChange(e) {
				this.dizhi = e.province.label + '-' + e.city.label + '-' + e.area.label;
				this.province = e.province.label
				this.city = e.city.label
				this.area = e.area.label
			},
			locationClick() {
				console.log(123132)
				this.locationShowFalg = true
			},
			back() {
				if (this.type == 2 || this.type) {
					uni.switchTab({
						url: '../../pages/tabbar/cart/index'
					})
				} else {
					uni.navigateBack({
						delta: 1
					});
				}
			},
			onDiscountClose() {
				this.isShowDiscount = false
			},
			onshopClose() {
				this.isShopCoupons = false
			},

			//提交订单
			submitOrder() {
				if (this.pickupWay == 0) {
					if (this.userAddressInfo.receiveName && this.userAddressInfo.receiveName != undefined) {
						uni.showModal({
							title: '提示',
							content: '确认兑换吗',
							success: (res) => {
								if (res.confirm) {

									uni.showLoading({
										title: '加载中'
									})
									//提交
									let obj = {}
									let _d = this.userAddressInfo
									obj.address = _d.receiveAdress + '-' + _d.address
									obj.deliveryState = 0
									obj.receiveName = _d.receiveName
									obj.receivePhone = _d.receivePhone
									obj.shopId = getCurShopid()
									let pointProductParam = []
									let goods = {}
									goods.id = this.goodsId
									goods.number = this.goodsNum
									pointProductParam.push(goods)
									obj.pointProductParam = pointProductParam
									NET.request(API.duihuanGoods, obj, 'POST').then(res => {
										uni.hideLoading()
										uni.showToast({
											title: "兑换成功",
											icon: "none",
											duration: 1500
										})
										setTimeout(() => {
											uni.navigateBack()
										}, 1500)
									})
									console.log(this.userAddressInfo.receiveName, this.userAddressInfo, 998877)


								} else if (res.cancel) {
									uni.showToast({
										title: "已取消",
										icon: "none"
									})
								}
							}
						});


					} else {
						uni.showToast({
							title: "请选择地址!",
							icon: "error"
						})
					}
					//console.log(this.userAddressInfo,'从缓存中拿的地址')



				} else {
					//判断自提信息
					// if (this.fahuoForm.receivePhone !== '' && this.fahuoForm.receiveName !== '') {
						uni.showModal({
							title: '提示',
							content: '确认兑换吗',
							success: (res) => {
								if (res.confirm) {
									uni.showLoading({
										title: '加载中'
									})
									//自提
									let newobj = this.fahuoForm
									newobj.address = this.shopXQ.shopAdress
									newobj.deliveryState = 1
									let pointProductParam = []
									let goods = {}
									goods.id = this.goodsId
									goods.number = this.goodsNum
									pointProductParam.push(goods)
									newobj.pointProductParam = pointProductParam
									console.log(newobj, 999)
									NET.request(API.duihuanGoods, newobj, 'POST').then(res => {
										uni.hideLoading()
										uni.showToast({
											title: "兑换成功",
											icon: "none",
											duration: 1500
										})
										setTimeout(() => {
											uni.navigateBack()
										}, 1500)
									})
								} else if (res.cancel) {
									uni.showToast({
										title: "已取消",
										icon: "none",
										duration: 1500
									})
								}
							}
						});



					// } else {
					// 	uni.showToast({
					// 		title: "请完善自提信息!",
					// 		icon: "error"
					// 	})
					// }

				}
			}
		},

	}
</script>

<style lang="scss">
	page {
		background-color: #F7F7F7;
	}

	.order-submission {
		width: 700rpx;
		margin: 0 auto;
		padding-bottom: 150rpx;

		.allAddress {
			margin-top: 0.2 * 100rpx;
			height: 55rpx;
			line-height: 55rpx;

			.nav {
				text-align: center;
				margin: 0;
				box-sizing: border-box;
				border-radius: 35rpx;
				display: inline-block;
				position: relative;

				&::after {
					content: "";
					position: absolute;
					left: 0;
					right: 0;
					top: 0;
					bottom: 0;
					background-color: #018A45;
					z-index: 0;
					border-radius: 35rpx;
				}

				.item {
					display: inline-block;
					padding: 0 20rpx;
					border-radius: 35rpx;
					position: relative;
					z-index: 5;
					line-height: 55rpx;
					background-color: tran;
				}

				.item.on {
					background-color: #fff;
					color: #018A45;
					font-weight: bold;
				}

				.item.on2 {
					background-color: #018A45;
					color: #ddd;
				}

			}

			.line {
				width: 7.1 * 100rpx;
				margin: 0 auto;
			}
		}
	}

	.bg {
		background-color: #00AA49;
		height: 240rpx;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		z-index: -1;
	}

	.info {
		padding: 20rpx 0;
		color: #fff;
	}

	.addAddress {
		background-color: #fff;
		border-radius: 10rpx;
		padding: 20rpx;
		width: 100%;

		.moren,
		.address,
		.name,
		.tel {
			display: inline-block;
		}

		.addressLeft {
			width: 620rpx;

			.moren {
				color: #FFF;
				font-size: 22rpx;
				width: 80rpx;
				height: 40rpx;
				line-height: 40rpx;
				text-align: center;
				border-radius: 10rpx;
				background-color: #00AA49;
			}

			.addressTop {
				margin-top: 10rpx;
				align-items: center;



				.address {
					font-size: 26rpx;
					height: 40rpx;
					line-height: 40rpx;
					font-weight: bold;
					margin-left: 10rpx;

					width: 100%;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}

			.addressBottom {
				margin-top: 20rpx;

				.name,
				.tel {
					color: #999;
					font-size: 26rpx;
				}

				.tel {
					margin-left: 10rpx;
				}
			}

		}

		.addressRight {
			width: 25rpx;
			margin: auto 0 auto auto;
		}
	}

	.slist {
		background-color: #fff;
		border-radius: 10rpx;
		margin-top: 20rpx;
		padding: 10rpx 20rpx;
	}

	.shopping {
		border-bottom: 1rpx solid #eee;

		&:last-child {
			border: none;
		}

		.image {
			flex: 1;
			width: 120rpx;
			height: 120rpx;
			margin: 20rpx 20rpx 20rpx 0;

			image {
				width: 100%;
				height: 100%;
				border-radius: 10rpx;
			}
		}

		.info {
			flex: 4;
			flex-direction: column;
			display: flex;
			justify-content: space-around;

			.shopName {
				color: #333;
			}

			.price_div {
				display: flex;
			}

			.price {
				color: red;
			}
		}

		.num {
			display: inline-block;
			margin-left: 25rpx;
			color: #333;
			font-size: 25rpx;
		}

		.num_money {
			margin-left: auto;
			color: #999;
		}
	}

	.jifen {
		background-color: #fff;
		border-radius: 10rpx;
		margin-top: 20rpx;
		padding: 0 20rpx;

		.pointsDeduction {
			padding: 20rpx 0;
			border-bottom: 1rpx solid #eee;

			.desc {
				font-size: 20rpx;
				flex: 1;
				text-align: center;
			}
		}
	}

	.pointsDeduction {
		display: flex;
		justify-content: space-between;

		.right {
			margin-left: auto;

			.text {
				color: #999;
			}
		}
	}


	// 结束
	.content {
		padding: 0 30upx 198upx;
		box-sizing: border-box;
	}

	.address-box {

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
		justify-content: space-between;
	}

	.product-sku {
		font-size: 24upx;
		font-weight: 500;
		color: #999;
		margin-left: -20upx;
		width: 100%;
		display: flex;
		flex-direction: row;
	}

	.product-price {
		font-size: 28upx;
		color: #333;
		font-weight: 400;
	}

	.product-price .fuhao {
		font-size: 28upx;
	}

	.product-num {
		font-size: 28upx;
		color: #999;
		font-weight: 400;
	}

	.delivery-way-box {
		display: flex;
		flex-direction: column;
	}

	.delivery-way-box .item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		font-size: 26upx;
		color: #333;
	}

	.delivery-way-box .item .way {
		color: #999;
		margin-left: 30upx;
	}

	.order-total-box {
		padding: 20upx 0;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
	}

	.total-num {
		font-size: 26upx;
		color: #333;
	}

	.total-price {
		font-size: 26upx;
		color: #ff7911;
	}

	.ml10 {
		margin-left: 10upx;
	}

	.order-flow-box {
		display: flex;
		flex-direction: column;
	}

	.flow-word {
		font-size: 24upx;
		color: #999;
		display: flex;
		flex-direction: column;
	}

	.mt25 {
		margin-top: 20upx;
	}

	.mt50 {
		margin-top: 30upx;
		margin-bottom: 20upx;
	}

	.order-confirm-box {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background: #fff;
		padding: 30upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.num-box {
		font-size: 30upx;
		color: #999;
	}

	.num-box .total {
		color: #333;
	}

	.num-box .price {
		color: #ff7911;
		font-weight: bold;
	}

	.order-confirm-box .btn {
		width: 560upx;
		height: 80upx;
		line-height: 80upx;
		background: #eee;
		border-radius: 40upx;
		font-size: 28upx;
		color: #999;
		text-align: center;
		margin: 0 auto;
	}

	.order-confirm-box .btn.active {
		background: linear-gradient(90deg, rgba(0, 206, 82, 1.0), rgba(0, 170, 73, 1));
		color: #fff;
	}

	.discount-item1 {
		width: 100%;
		height: 98upx;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		background: white;

		.discount-img {
			width: 24upx;
			height: 24upx;
			margin-left: 20upx;
		}
	}

	.discount-item {
		width: 100%;
		height: 98upx;
		box-sizing: border-box;
		margin: 30upx 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 0 30upx;
		background: white;
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
	}

	.period-radio {
		margin: 30upx;
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

	.huabei-confirm {
		height: 120upx;
		padding: 0upx 108upx 0upx 32upx;

		.fenqi-all {
			display: inline-block;
			width: 100%;
		}

		.fenqi-total-amount {
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

	.discount-info-box {
		display: flex;
		flex-direction: row;
	}

	.discount-label,
	.discount-info1 {
		font-size: 26upx;
		color: #333;
	}

	.discount-info2 {
		color: rgba(255, 162, 0, 1);
	}

	.discount-img {
		width: 40upx;
		height: 40upx;
		margin-left: 20upx;
	}

	.activity-con {
		.activity-box {
			display: flex;
			flex-direction: column;
			width: 100%;
			height: 1000upx;
		}

	}

	.activity-box .title-box {
		width: 100%;
		height: 100upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		position: relative;
		border-bottom: solid 1px #EEEEEE;
	}

	.activity-coupon-box {
		display: flex;
		flex-direction: column;
		width: 100%;
		overflow: auto;
		flex: 1;
	}

	.title-box .close-btn {
		width: 100upx;
		height: 100upx;
		box-sizing: border-box;
		padding: 30upx;
		position: absolute;
		top: 0;
		right: 0;
	}

	.content-box {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		padding: 30upx;
	}

	.tag-box {
		width: 100%;
		box-sizing: border-box;
		height: 80upx;
		line-height: 80upx;
		font-size: 28upx;
		font-weight: 500;
		color: #FF7911;
	}

	.label-lingqu {
		width: 100%;
		font-size: 28upx;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
	}

	.coupon-item1 {
		width: 690upx;
		height: 120upx;
		// background: rgba(255, 233, 216, 1);
		background: url(../../static/images/couponItem1.png) no-repeat;
		background-size: 690upx 120upx;
		border-radius: 10upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 20upx;
		color: #FFFFFF;
		flex-shrink: 0
	}

	.coupon-item2 {
		width: 690upx;
		height: 120upx;
		// background: rgba(255, 233, 216, 1);
		background: url(../../static/images/couponItem2.png) no-repeat;
		background-size: 690upx 120upx;
		border-radius: 10upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 20upx;
		color: rgba(255, 121, 17, 1);
		flex-shrink: 0
	}

	.un-coupon-item {
		color: #bbb;
	}

	.money-box {
		width: 180upx;
		box-sizing: border-box;
		padding-left: 30upx;
		font-size: 40upx;
		font-weight: 500;

	}

	.info-box {
		width: 300upx;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		font-size: 24upx;
		font-weight: bold;
	}


	.receive-success {
		width: 100%;
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}

	.success-box {
		width: 380upx;
		height: 280upx;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 10upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.success-box .success-img {
		width: 200upx;
		height: 130upx;
	}

	.success-box .text {
		font-size: 28upx;
		margin-top: 50upx;
		font-weight: 400;
		color: rgba(255, 255, 255, 1);
	}

	.check-img {
		width: 40upx;
		height: 40upx;
		margin-right: 30upx;
	}

	.mt30 {
		margin-top: 30upx;
	}

	.activity-con {
		.activity-box {
			display: flex;
			flex-direction: column;
			width: 100%;
			height: 1000upx;
		}

	}

	.activity-box .title-box {
		width: 100%;
		height: 100upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		position: relative;
		border-bottom: solid 1px #EEEEEE;
	}

	.activity-coupon-box {
		display: flex;
		flex-direction: column;
		width: 100%;
		overflow: auto;
		flex: 1;
	}

	.title-box .close-btn {
		width: 100upx;
		height: 100upx;
		box-sizing: border-box;
		padding: 30upx;
		position: absolute;
		top: 0;
		right: 0;
	}

	.content-box {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		padding: 30upx;
	}

	.tag-box {
		width: 100%;
		box-sizing: border-box;
		height: 80upx;
		line-height: 80upx;
		font-size: 28upx;
		font-weight: 500;
		color: #FF7911;
	}

	.label-lingqu {
		width: 100%;
		font-size: 28upx;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
	}

	.coupon-item {
		width: 690upx;
		height: 120upx;
		background: rgba(255, 233, 216, 1);
		border-radius: 10upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 20upx;
		color: rgba(255, 121, 17, 1);
		flex-shrink: 0
	}

	.un-coupon-item {
		color: #bbb;
	}

	.money-box {
		width: 180upx;
		box-sizing: border-box;
		padding-left: 30upx;
		font-size: 40upx;
		font-weight: 500;

	}

	.info-box {
		width: 300upx;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		font-size: 24upx;
		font-weight: bold;
	}
</style>
