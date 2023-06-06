<template>
	<view class="order-submission">
		<view class="bg"></view>
		<view v-if="shipping_type === 0">
			<view class="addAddress flex">
				<view class="addressLeft">
					<view class="addressTop">
						<view class="moren">地址</view>
						<view>
							<view class="address">{{particulars.receiveAdress}}</view>
							<view class="address">{{particulars.address}}</view>
						</view>
					</view>
					<view class="addressBottom">
						<view class="name">{{particulars.receiveName}}</view>
						<view class="tel">{{particulars.receivePhone}}</view>
					</view>
				</view>
			</view>

			<!-- 商品列表 -->
			<view class="slist">
				<view class="shopping flex" v-for=" goods in particulars.products">
					<view class="image">
						<image class="product-img" mode="scaleToFill" :src="goods.image"></image>
					</view>
					<view class="info">
						<view class="shopName">{{goods.productName}}</view>
						<view class="shopName" style="margin: 10rpx 0rpx 10rpx 0rpx;">{{skuDetails(goods)}}</view>
						
						<view class="price_div">
						
							<view class="price">
								<text>¥{{goods.productPrice}}</text>
						<!-- 		<input type="text" style=" width: 50rpx;" class="list-input"
									v-model.number="goods.productPrice" /> -->
							</view>
							<view class="num"> x {{goods.number}}</view>
							<view class="num_money">
								共 ￥{{goods.productPrice * goods.number}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 价格详情 -->
			<view class="jifen">
				<view class="pointsDeduction">
					<view class="list-cell">
						<text v-if="particulars.coupon.couponType == 1">满减券</text>
						<text v-if="particulars.coupon.couponType == 2">折扣券</text>
						<text v-if="particulars.coupon.couponType == 3">物品券</text>
					</view>
					<view class="right flex" style="color: red;">
						
						<text >{{particulars.coupon.couponName}}</text>
						<text v-if="particulars.coupon.couponType == 1">,减{{particulars.coupon.couponContent}}</text>
						<text v-if="particulars.coupon.couponType == 2">,打{{particulars.coupon.couponContent}}折</text>
						<!-- <text v-else>折扣券</text> -->
					</view>
				</view>
				<view class="pointsDeduction" v-if="particulars.coupon.couponType == 3">
					<view class="list-cell">
						<text >{{particulars.coupon.giftname}}</text>
					</view>
					<view class="right flex" style="color: red;">
							<image class="product-img" mode="scaleToFill" :src="particulars.coupon.giftpic"></image>
					</view>
				</view>
				
				<view class="pointsDeduction">
					<view class="list-cell">订单状态</view>
					<view class="right flex" style="color: red;">
						<text v-if="particulars.state == 1">待付款</text>
						<text v-if="particulars.state == 2">待发货</text>
						<text v-if="particulars.state == 3">已发货</text>
						<text v-if="particulars.state == 4">已完成</text>
						<text v-if="particulars.state == 5">已关闭</text>
					</view>
				</view>
				<view class="pointsDeduction">
					<view class="list-cell">订单总金额</view>
					<view class="right flex">
						{{particulars.orderPrice}}
					</view>
				</view>
				<view class="pointsDeduction" v-if="item.yuedeductPrice != ''&&item.yuedeductPrice != 0">
					<view class="list-cell">余额抵扣</view>
					<view class="right flex">
						{{particulars.yuedeductPrice}}
					</view>
				</view>
				<view class="pointsDeduction">				
					<view class="list-cell">支付金额</view>
					<view class="right flex">
						<text v-if="particulars.coupon.couponType == 3">{{particulars.orderPrice}}</text>
						<text v-else>{{particulars.price}}</text>
						<!-- <input type="text" class="list-input" v-model.number="particulars.price" /> -->
					</view>
				</view>
				<!-- 用户备注,订单备注 -->
				<view class="pointsDeduction">
					<view class="list-cell">订单备注</view>
					<view class="right flex">
						<span style="color: #999;">{{particulars.remark}}</span>
					</view>
				</view>
				<!-- 商家备注 -->
				<view class="pointsDeduction">
					<view class="list-cell">商家备注</view>
					<view class="right flex">
						<span style="color: #999;">{{particulars.platformRemark}}</span>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		acquireParticulars,
		amendOrder
	} from '../../api/shopmanage.js'
	export default {
		data() {
			return {
				orderList: [{
					src: 'https://img2.baidu.com/it/u=1145742942,4055967999&fm=26&fmt=auto&gp=0.jpg',
					title: '葡韵手信 澳门特产 休闲零食 原味鸡蛋卷240g',
					price: 10.9,
					num: 1
				}],
				showmethodPaymentShow: false,

				methodPaymentList: [{
						value: '1',
						label: '线下支付'
					},
					{
						value: '2',
						label: '余额支付'
					},
					{
						value: '3',
						label: '微信支付'
					}
				],
				src: 'https://img2.baidu.com/it/u=1145742942,4055967999&fm=26&fmt=auto&gp=0.jpg',
				// 买家、卖家
				shipping_type: 0,
				isShow: 1,
				systemStore: {
					id: 1
				},
				customStyle: {
					color: '#FFF',
					width: '200rpx',
					height: '70rpx',
					backgroundColor: '#43593',
					borderRadius: '80rpx'
				},
				checked: false, //卖家配送 积分抵扣
				checked2: false, //卖家配送 余额抵扣
				types: "微信支付",
				totalAmount: "70", //总金额
				Amount: "60", //实付金额

				orderId: 0, //商品id
				particulars: {}, //商品详情
			}
		},
		onLoad(data) {
			this.orderId = data.orderId
			this.goodsParticulars()
			console.log(data)
		},
		// computed: {
		// 	skuDetails() {
		// 		let skuArr = []
		// 		this.particulars.products.forEach((val)=>{
		// 			skuArr.push(val.skuValue)
		// 		})
		// 		return skuArr.join('-')
		// 	}
		// },
		methods: {
			skuDetails(item) {
				let skuArr = []
				item.skuDetails.forEach((val) => {
					skuArr.push(val.skuValue)
				})
				let skuStr = skuArr.join(',')
				console.log(skuStr, 88877878)
				return skuStr
			},
			addressType(index) {
				this.shipping_type = index;
			},
			mentList(data) {
				console.log(data);
				this.types = data[0].label
			},
			addressLeft() {
				uni.navigateTo({
					url: '../../pages_category_page2/userModule/address?type=1'
				})
			},
			//获取商品详情
			goodsParticulars() {
				acquireParticulars(this.orderId).then(res => {
					this.particulars = res.data
					console.log(res, '商品详情')
				})
			},
			//修改订单商品价格
			amendOrderCommodity() {
				console.log(this.particulars.products,'商品详情里面的商品数组')
				let shopid = [] //先拿到所有的商品id
				this.particulars.products.forEach(val => {
					shopid.unshift(val.orderProductId)
				})
				let shopList = {}//所有商品的id跟单价
				let zong = 0 //订单总金额,是算出来的
				this.particulars.products.forEach((item,index) =>{		
					
					shopList[shopid[index]] = item.productPrice 
					//shopList[this.orderId] = item.productPrice 
					zong += item.productPrice * item.number
				})
				// console.log(shopList,999888)
			
				let data = {}
				data.orderId = this.orderId,
				// data.orderPrice = this.particulars.orderPrice,
				data.orderPrice = zong,
				data.price = this.particulars.price,
				data.productMap = shopList

				console.log(data, "修改商品价格前保存的数据")
				amendOrder(data).then(res =>{
					uni.showToast({
					    title: '修改成功',
					    duration: 2000
					});
					setTimeout(()=>{
						uni.navigateBack()
						
					},2000)
					console.log(res,'修改成功!')
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #F7F7F7;
	}
</style>
<style scoped lang="less">
	.product-img {
		width: 180upx;
		height: 180upx;
		border-radius: 10upx;
		margin-right: 30upx;
	}
	.jifen {
		background-color: #fff;
		border-radius: 10rpx;
		margin-top: 20rpx;
		padding: 0 20rpx;

		.pointsDeduction {
			display: flex;
			flex-wrap: wrap;
			padding: 20rpx 0;
			border-top: 1rpx solid #eee;

			.list-input {
				border: none;
				text-align: right;
			}

			.desc {
				font-size: 20rpx;
				flex: 1;
				text-align: center;
			}
		}
	}

	.list-cell {
		white-space: nowrap;
	}

	.flex {
		display: flex;
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

		.addAddress {
			background-color: #fff;
			border-radius: 10rpx;
			padding: 20rpx;
			width: 100%;

		
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
					margin-right: 20rpx;
				}

				.addressTop {
					margin-top: 10rpx;
					align-items: center;
					display: flex;


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
				width: 150rpx;
				height: 140rpx;
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
					color: #000;
					display: flex;
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
				display: flex;
			}
		}


		.pointsDeduction,
		.coupons,
		.methodPayment {
			display: flex;
			justify-content: space-between;

			.right {
				margin-left: auto;

				.text {
					color: #999;
				}
			}
		}



		.coupons {
			padding: 20rpx 0;
			border-top: 1px solid #ccc;
			border-bottom: 1px solid #ccc;
		}

		.methodPayment {
			padding: 20rpx 0;
		}


		.submit {
			width: 750rpx;
			background-color: #fff;
			position: fixed;
			bottom: 0rpx;
			left: 0;
			right: 0;
			height: 130rpx;
			padding: 0 25rpx;
			box-shadow: 0 0 20rpx #ddd;
			box-sizing: border-box;
			justify-content: space-between;
			align-items: center;
			z-index: 100;

			.totalPrice {
				color: red;

				.num {
					font-size: 24px;
					font-weight: bold;
				}
			}

			.u-btn--default {
				color: #fff;
				background-color: #9b2b3b;
			}
		}
	}

	.buyerAddress-box {
		height: 82vh;
		padding: 20rpx 0;
		overflow-y: auto;
	}

	.buyerAddress {
		display: flex;
		justify-content: space-between;
		margin: 0.2 * 100rpx;
		height: 60rpx;
		line-height: 60rpx;

		.name {
			font-weight: bold;
		}

		.right {
			color: #187CFC;
			display: flex;

			.text {
				color: #00AA49;
				margin-right: 10px;
			}
		}
	}

	.orderStatus {
		padding: 20rpx;
		border-bottom: 8rpx solid #EEE;

		.top {
			display: flex;
			justify-content: space-between;
			font-weight: bold;
			padding-bottom: 20rpx;
			border-bottom: 1px solid #EEE;
		}

		.orderItem {
			padding: 20rpx 0;

			.image {
				width: 120rpx;
				height: 120rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.right {
				margin-left: 20rpx;
				flex-direction: column;
				justify-content: space-around;

				.title {
					width: 490rpx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}
		}

		.shopTotalPrice {
			padding: 10px 0;
			border-top: 1px solid #EEE;
			font-weight: bold;
			justify-content: space-between;
		}
	}
</style>
