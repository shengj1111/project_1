<template>
	<view calss="">
		<view class="orderShop warp">
			<view class="image">
				<image :src="src"></image>
			</view>
			<view class="shopping">
				<view class="name">嵌缝石膏</view>
				<view class="num">
					商品规格： <text>单位：包</text>
				</view>
			</view>
			<view class="shopNum">
				<view class="price">
					<text class="symbol">￥</text>35.00
				</view>
				<view class="num">x1件</view>
				<view class="total">共<text class="symbol">￥</text>35.00</view>
			</view>
		</view>
		<view class="shopInfo warp">
			<view class="title">门店</view>
			<view class="tradeName">
				<u-icon name="home"></u-icon><text>店名：华润漆</text>
			</view>
			<view class="address">
				<u-icon name="map-fill"></u-icon><text>地址：武汉市硚口区汉西三路古田小路公交站旁</text>
			</view>
			<view class="name">
				<u-icon name="account-fill"></u-icon><text>姓名：褚连华</text>
			</view>
			<view class="tel">
				<u-icon name="phone"></u-icon><text>电话：15972924919</text>
			</view>
		</view>
		<view class="distribution warp">
			<view class="way">
				<view class="distWay">
					配送方式
				</view>
				<view class="btn">
					<view class="buyer">买家自提</view>
					<view class="seller">卖家配送</view>
				</view>
			</view>
			<view class="editAddress">
				<view class="">
					<u-icon name="map"></u-icon>
					<text>配送费需与门店协商(整车配送除外)</text>
				</view>
				<view class="btn">
					修改地址
				</view>
			</view>
		</view>
		<u-gap height="20" bg-color="#F7F7F7"></u-gap>
		<view class="money warp">
			<view class="amountOrder">
				<text>订单总金额</text>
				<view class="total"><text class="symbol">￥</text>35.00</view>
			</view>
			<view class="integral">
				<text>获得平台积分</text>
				<text class="point">0分</text>
			</view>
			<view class="handle">
				<text>应付金额</text>
				<view class="total"><text class="symbol">￥</text>35.00</view>
			</view>
		</view>
		<u-gap height="20" bg-color="#F7F7F7"></u-gap>
		<view class="orderNote warp">
			<view class="title">
				订单备注
			</view>
		</view>
		<view class="submit">
			<view class="">提交按钮</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src: 'https://img2.baidu.com/it/u=1145742942,4055967999&fm=26&fmt=auto&gp=0.jpg',
			};
		}
	}
</script>
<style lang="scss" scoped>
	.warp {
		width: 700rpx;
		margin: 30rpx auto 0;
	}

	.orderShop {
		padding-bottom: 10rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.image {
			flex: 1;
			width: 160rpx;
			height: 160rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.shopping {
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			flex: 3;
			height: 160rpx;
			margin-left: 20rpx;

			.name {
				font-size: 32rpx;
			}

			.num text {
				color: #8A8B8B;
			}
		}

		.shopNum {
			height: 160rpx;
			text-align: right;
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-around;

			.symbol {
				font-size: 20rpx;
			}

			.price {
				font-size: 28rpx;
				color: #1A9A50;
			}

			.num {
				color: #7D7D7D;
			}

			.total {
				color: #7D7D7D;

				.symbol {
					font-size: 20rpx;
				}
			}
		}
	}

	.shopInfo {
		padding: 20rpx 0;
		border-top: 1px solid #EAEAEA;
		border-bottom: 1px solid #EAEAEA;

		.title {
			margin-bottom: 20rpx;
			font-weight: bold;
		}

		.u-icon {
			margin-right: 20rpx;
		}

		.tradeName,
		.address,
		.name,
		.tel {
			line-height: 50rpx;
			color: #169D4D;

			text {
				color: #848484;
			}
		}
	}

	.distribution {

		.way,
		.btn {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.distWay {
				font-size: 26rpx;
			}

			.buyer,
			.seller {
				padding: 0 20rpx;
				width: 160rpx;
				text-align: center;
				height: 50rpx;
				line-height: 50rpx;
				border-radius: 60rpx;
			}

			.buyer {
				color: #029640;
				border: 1px solid #029640;
			}

			.seller {
				margin-left: 20rpx;
				color: #FFF;
				background-color: #029640;
			}
		}

		.editAddress {
			font-size: 24rpx;
			padding: 30rpx 0;
			color: #E87136;
			display: flex;
			justify-content: space-between;
		}
	}

	.money {

		.amountOrder,
		.integral,
		.handle {
			display: flex;
			justify-content: space-between;
			padding: 20rpx 0;
		}

		.integral {
			border-top: 1px solid #EAEAEA;
			border-bottom: 1px solid #EAEAEA;
		}

		.symbol {
			font-size: 20rpx;
		}

		.total {
			font-size: 28rpx;
			font-weight: bold;
			color: #239F57;
		}

	}

	.orderNote {
		.title {
			margin-bottom: 20rpx;
			font-weight: bold;
		}
	}

	.submit {
		position: fixed;
		bottom: 0;
		font-size: 32rpx;
		width: 750rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		color: #FFF;
		background-color: #029640;
	}
</style>
