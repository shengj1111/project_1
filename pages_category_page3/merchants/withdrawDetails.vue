<!-- 订单中心 -->
<template>
	<view class="container">
		<view style="padding-bottom:68upx;">
			<!-- 订单展示 -->
			<view class="order-list-box">
				<!-- 判断商品条数是否有没有 -->
				<view v-if="listTotal > 0">
					<view class="goodsItem" v-for="(item, index) in list" :key="index"
						@click="itemTap(item.orderId,item)">
						<!-- 用户信息 -->
						<view class="order-info-box">
							<view class="order-Time">
								<text>{{item.createTime}}</text>
							</view>
							<view class="order-dhhao">
								<text>订单编号: </text>
								<text> {{ item.orderFormid}}</text>
							</view>
							<view class="order-fangshi">
								<text v-if="item.pickupWay == 0">配送</text>
								<text v-if="item.pickupWay == 1">自提</text>
							</view>
						</view>
						<!-- 商品详情 -->
						<view class="order-info-goods">
							<view class="order-info-item my-order-info" v-for="(proItem, pIndex) in item.orderProducts"
								:key="pIndex">
								<image class="product-img" mode="scaleToFill" :src="proItem.image"></image>
								<!-- <u-image :src="proItem.image" class="product-img"></u-image> -->
								<view class="info-box">
									<text class="product-name">{{proItem.productName}}</text>
									<view class="product-sku">{{proItem.sku}}</view>
									<view class="price-sku-box">
										<view class="box-h">
											<text class="product-price">
												<text class="fuhao">￥</text>{{proItem.productPrice}}
											</text>
											<text class="product-num">x {{proItem.number}}</text>
										</view>
									</view>
								</view>
								<view class="total-price-box">总价 ¥ {{proItem.productPrice * proItem.number}}</view>
							</view>
						</view>
						<!-- 收货人部分部分 -->
						<view class="order-info-user">
							<view class="peisong" v-if="item.pickupWay == 0">
								<view class="peisong-row">
									<view class="peisong-row-1">收货人地址:</view>
									<view>{{item.receiveAdress}}</view>
									<view>{{item.address}}</view>
								</view>
								<view class="peisong-row-my">
									<view>
										<view class="peisong-row-1">收货人姓名:</view>
										<view>{{item.receiveName}}</view>
									</view>
									<view>
										<view class="peisong-row-1">收货人手机号:</view>
										<view>{{item.receivePhone}}</view>
									</view>
								</view>
							</view>
						</view>
						<!-- 合计部分 -->
						<view class="order-info-zong">
							<text>共计{{item.number}}件商品,订单金额:¥{{item.price}}</text>
						</view>
					</view>
				</view>
				<!-- </view> -->
				<!-- 没有就展示这个 -->
				<view v-else class="emptyOrder-box flex-items-plus flex-column">
					<image class="emptyOrder-img" src="@/static/images/emptyOrderImg.png"></image>
					<label class="font-color-999 fs26 mar-top-30">你还没有订单哦～</label>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getCurShopid
	} from '@/api/common.js'
	import {
		getCanTXOrder
	} from '../../api/shopmanage.js'
	export default {
		data() {
			return {
				type: 0,
				page: 1,
				pageSize: 20,
				actionSheetList: [], //快递公司列表
				list: [], //所有的订单,来自不同用户,每个用户下单的不同商品
				listTotal: 1, //所有订单的条数,小于0的时候展示没有订单
				
				orderState: '',
				shopId: 0,
			}
		},
		onLoad(options) {
			this.shopId = getCurShopid()
			if (options.type) {
				this.type = options.type,
					this.orderState = options.type
				//this.getListData()
			} else {
				//this.getListData()
			}
		},
		onShow(options) {
			this.list = []
			this.getListData()
		},
		onReachBottom() {
			this.page = this.page + 1
			this.getListData()
		},
		onBackPress(e) {
			if (e && e.from === 'navigateBack') {
				return false;
			}
			this.back();
			return true;
		},
		computed: {
			newActionSheetList() {
				const data1 = this.actionSheetList.map(item => ({
					label: item.dictName,
					value: item.dictId
				}))
				console.log(data1)
				return data1
			}
		},
		methods: {
			back() {
				uni.switchTab({
					url: '../../pages/tabbar/user/index'
				});
			},
			// 获取订单列表数据
			getListData() {
				if (this.orderState == 0) {
					this.orderState = null
				}
				uni.showLoading({
					title: '加载中...',
				})
				const _this = this;
				let myobj = {}
				myobj.page = _this.page
				myobj.pageSize = _this.pageSize
				myobj.shopId = _this.shopId
				myobj.doquerytxdetail = 1
				getCanTXOrder(myobj).then(res => {
					if (res.data.list.length == 0) {
						this.page = this.page
					}
					console.log(res.data.list, '所有的订单数据')
					let mylist = res.data.list
					mylist.forEach(item => {
						item.orderProducts.forEach(item2 => {
							item2.image = encodeURI(item2.image)
						})
					})
					uni.hideLoading()
					this.listTotal = res.data.total
					this.list = this.list.concat(mylist)
					console.log(this.list, '所有修改过的订单数据')
				})
			},
			// 跳转订单详情
			itemTap(orderId, item) {
				uni.setStorageSync("afterapplyItem", item)
				uni.navigateTo({
					url: 'orderXiang?orderId=' + orderId
				})
			},
		},

	}
</script>

<style lang="scss">
	page {
		width: 100%;
		height: 100%;
		background: #fff;
	}

	.jiagebufen {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-end;
	}

	.nav-box-box {
		height: 88upx;
		background: #f6f6f6;
		white-space: nowrap;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 10;
	}

	.nav-box-box .item {
		display: inline-view;
		padding: 0 30upx;
		box-sizing: border-box;
		height: 88upx;
		text-align: center;
		line-height: 88upx;
		font-size: 30upx;
		color: #666;
		font-weight: 500;
	}

	.nav-box-box .item.active text {
		display: inline-view;
		color: #ff7911;
		box-sizing: border-box;
		height: 88upx;
		border-bottom: 2px solid #ff7911;
	}

	.order-list-box {
		padding: 20upx 30upx 0;
		box-sizing: border-box;

		.goodsItem {
			border-bottom: 1rpx #d3d3d3 solid;
			width: 100%;
			//height: 500rpx;
			margin-bottom: 30rpx;

			.order-info-box {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				font-size: 20rpx;
				color: #989898;
				margin: 20rpx;

				.order-fangshi {
					color: red;
					font-size: 24rpx;
				}
			}

			.order-info-goods {
				margin: 20rpx;
			}

			.order-info-user {
				margin: 20rpx;

				.peisong {
					//height: 300rpx;
					//border: 1rpx red solid;
					display: flex;
					flex-direction: column;

					.peisong-row {
						margin-bottom: 20rpx;

						.peisong-row-1 {
							font-size: 24rpx;
							font-weight: 700;
						}
					}

					.peisong-row-my {
						display: flex;
						flex-direction: row;
						justify-content: space-between;

						.peisong-row-1 {
							font-size: 24rpx;
							font-weight: 700;

						}
					}
				}
			}

			.order-info-zong {
				display: flex;
				flex-direction: row-reverse;
				margin: 20rpx;
			}

			.order-btn {
				display: flex;
				flex-direction: row-reverse;
				margin: 20rpx;

				.text1 {
					border: 1rpx #01983b solid;
					padding: 10rpx 30rpx;
					color: #01983b;
					font-size: 24rpx;
					margin-left: 20rpx;
				}

				.text2 {
					border: 1rpx #828282 solid;
					padding: 10rpx 30rpx;
					color: #828282;
					font-size: 24rpx;
					margin-left: 20rpx;
				}
			}
		}
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
		width: 36upx;
		height: 36upx;
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

	.order-status {
		font-size: 28upx;
		color: #ff7911;
		font-weight: 500;
	}





	.my-order-info {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.userTop {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 100rpx;
		font-weight: 700;

	}

	.order-info-item {
		display: flex;
		flex-direction: row;
		padding: 20upx 0;
	}

	.buyNowBut {
		width: 214upx;
		height: 80upx;
		// border-radius: 0 40upx 40upx 0;
		border-radius: 40upx;
		background-color: #00AA49;
		color: #FFFEFE;
		font-size: 28upx;
		line-height: 80upx;
		text-align: center;
		position: fixed;
		bottom: 90rpx;
		left: 37%;
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
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.product-sku {
		font-size: 24upx;
		color: #999;
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
		display: inline-view;
		font-size: 28upx;
		margin-left: 20upx;
		color: #999;
	}

	.total-price-box {
		font-size: 26upx;
		color: #333;
		text-align: right;
		padding: 30upx 0;
		align-self: flex-end;
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
		margin-top: 70upx;

		.emptyOrder-img {
			width: 270upx;
			height: 270upx;
		}
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
