<style lang="scss">
</style>
<template>
	<view>
		<view class="header">
			<view @click="activeChange(1)" :class="{'active': activeIndex == 1}">
				<text>聊天</text>
				<u-icon name="map"></u-icon>
			</view>
			<view @click="activeChange(2)" :class="{'active': activeIndex == 2}">通知</view>
		</view>
		<view class="statistical">
			<view class="">
				<view class="num">0</view>
				<view class="text">今日咨询人数</view>
			</view>
			<view class="">
				<view class="num">0</view>
				<view class="text">5分钟回复数</view>
			</view>
			<view class="">
				<view class="num">0</view>
				<view class="text">5分钟回复率</view>
			</view>
			<view class="CheckUp">
				消息体检
				<u-icon name="arrow-right"></u-icon>
			</view>
		</view>
		<view class="search">
			<view class="form">
				<u-icon name="search" size="40rpx" color="#A2A2A2"></u-icon>
				<input type="text" placeholder="搜索联系人/群/聊天记录" />
			</view>
			<view class="screening">
				<u-icon name="search" size="30rpx" color="#7D7D7D"></u-icon>
				<text>筛选</text>
			</view>
		</view>
		<view class="warning">
			<view>关键词自动回复上线啦！点击查看</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeIndex: 1,
			};
		},
		methods: {
			activeChange(index) {
				this.activeIndex = index
			}
		}
	}
</script>
<style lang="scss">
	.header,
	.statistical {
		display: flex;
		justify-content: space-around;
		align-items: center;
		text-align: center;
	}

	.header {
		height: 90rpx;
		line-height: 90rpx;
		background-color: #F5F5F5;
		border-bottom: 1px solid #ECECEC;

		.active {
			border-bottom: 6rpx solid #00AA49;
		}
	}

	.statistical {
		height: 150rpx;
		border-top: 1px solid #ECECEC;
		background-color: #F5F5F5;

		.num {
			font-size: 32rpx;
			font-weight: bold;
		}

		.text {
			font-size: 26rpx;
			color: #767675;
		}

		.CheckUp {
			color: #5D8DCB;
		}
	}
	
		.search {
			height: 90rpx;
			display: flex;
			justify-content: space-around;
			align-items: center;
	
			.form {
				background-color: #F7F7F7;
				display: flex;
				justify-content: center;
				align-items: center;
				height: 60rpx;
				width: 550rpx;
	
				input {
					padding-left: 20rpx;
				}
			}
			.screening{
				color: #7D7D7D;
			}
		}
		.warning{
			background-color: #FDF1C6;
			height: 80rpx;
			line-height: 80rpx;
			color: #EBA02D;
			width: 750rpx;
			view{
				width: 700rpx;
				margin: 0 auto;
			}
		}
</style>
