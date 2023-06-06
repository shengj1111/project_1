<template>
	<view>
		<view class="header">
			<view class="top flex">
				<view>综合排序</view>
				<view>销量排序</view>
				<view>价格排序</view>
			</view>
			<view class="select flex">
				<view class="item">
					<view class="text">积分</view>
					<u-icon name="arrow-down"></u-icon>
				</view>
				<view class="item">
					<view class="text">品牌</view>
					<u-icon name="arrow-down"></u-icon>
				</view>
				<view class="item">
					<view class="text">分类</view>
					<u-icon name="arrow-down"></u-icon>
				</view>
			</view>
		</view>
		<view class="IntegralItem">
			<view class="item flex" v-for="item in ShopList">
				<view class="left">
					<image :src="item.src"></image>
				</view>
				<view class="right flex">
					<view class="top">
						<view class="title">{{item.title}}</view>
						<view class="subTitle">{{item.subTitle}}</view>
					</view>
					<view class="bottom">
						<view class="integral">{{item.Integral}}分</view>
						<view class="num">已兑换{{item.num}}w 件</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ShopList: [{
						src: 'https://img2.baidu.com/it/u=1145742942,4055967999&fm=26&fmt=auto&gp=0.jpg',
						title: '肯德基 香辣劲脆鸡腿堡 电子抵用券20元',
						subTitle: '可全额兑换香辣鸡腿堡一个',
						Integral: '2000',
						num: 12.6
					}
				]
			};
		}
	}
</script>

<style lang="scss" scoped>
	.flex {
		display: flex;
	}

	.header {
		padding-bottom: 10px;
		background-color: #00AA49;

		.top {
			color: #FFF;
			font-weight: bold;
			padding: 20rpx 0;
			display: flex;
			justify-content: space-around;
			margin-bottom: 10rpx;
		}

		.select {
			width: 700rpx;
			background-color: #FFF;
			border-radius: 20rpx;
			padding: 20rpx 0;
			margin: 0 auto;
			display: flex;
			justify-content: space-around;

			.item {
				display: flex;
				flex-direction: row;

				.text {
					margin-right: 10px;
				}
			}
		}
	}

	.IntegralItem {
		width: 700rpx;
		margin: 0 auto;

		.item {
			width: 100%;
			// border: 1px solid lightblue;
			margin: 10px 0;
			border-radius: 20rpx;
			overflow: hidden;
			box-shadow: 0 0 20rpx -12rpx;
			.left{
				width: 250rpx;
				height: 250rpx;
				image{
				width: 100%;
				height: 100%;
				}
			}

			.right {
				margin-left: 20rpx;
				flex-direction: column;
				justify-content: space-around;


				.top {
					.title {
						padding-right: 12px;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}

					.subTitle {
						font-size: 24rpx;
						color: #B2B3B2;
					}
				}

				.bottom {
					width: 90%;
					margin: 0 auto;
					justify-content: space-between;
					align-items: center;
					display: flex;
					flex-direction: row;

					.integral {
						color: #ECB854;
						font-weight: bold;
						font-size: 32rpx;
					}

					.num {
						color: #B2B3B2;
						font-size: 24rpx;
					}
				}
			}


		}
	}
</style>
