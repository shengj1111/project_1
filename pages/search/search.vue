
<template>
	<view class="content">
		<view class="headerLabel">
			<view class="header">
				<u-icon color="#FFF" name="map-fill" size="40rpx"></u-icon>
				<view class="form">
					<u-icon name="search"></u-icon>
					<input type="text" value="" placeholder="腻子粉" />
				</view>
				<u-icon color="#FFF" name="chat-fill" size="40rpx"></u-icon>
				<u-icon @click="isActive = !isActive" v-if="isActive" class="listIcon" color="#FFF" name="list" size="40rpx"></u-icon>
				<u-icon @click="isActive = !isActive" v-else class="listIcon" color="#FFF" name="grid-fill" size="40rpx"></u-icon>
			</view>
		</view>
		<view :class="[isActive ? 'itemWrap' : 'itemWrap1']">
			<view class="shopItem" v-for="(item,index) in shopList" :key='index'>
				<image :src="item.src"></image>
				<view class="text">
					<view class="itemTitle">{{item.title}}</view>
					<view class="price">
						<view>
							<span class="symbol">￥</span>
							<span class="newPrice">{{item.newPrice}}</span>
						</view>
						<view class="oldPrice">{{item.oldPrice}}</view>
					</view>
					<view class="saleNum">销量：{{item.saleNum}}</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				isActive: true,
				shopList: [{
					src: 'https://img2.baidu.com/it/u=1145742942,4055967999&fm=26&fmt=auto&gp=0.jpg',
					title: '50包金牌外墙耐水腻子粉(14KG)送20桶C胶(红)',
					newPrice: '1300.0',
					oldPrice: '2140.0',
					saleNum: 173
				}],
			}
		},
		methods: {
			isActiveChang() {}
		}
	}
</script>

<style lang="scss">
	.headerLabel {
		padding: 10px;
		background-color: $mainColor;

		.header {
			margin: 0 auto;
			width: 700rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;


			.form {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				width: 550rpx;
				background-color: #FFF;
				border-radius: 60rpx;
				padding-left: 20rpx;
				margin: 0 20rpx;

				input {
					padding-left: 20rpx;
					height: 40rpx;
				}
			}

			.listIcon {
				margin-left: 20rpx;
			}
		}

	}

	.itemWrap {
		width: 700rpx;
		margin: 0 auto;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;

		.shopItem {
			box-shadow: 0 0 20rpx -12rpx;
			margin-top: 20rpx;
			width: 340rpx;
			border-radius: 20rpx;
			overflow: hidden;

			image {
				height: 300rpx;
			}

			.text {
				padding: 10rpx;

				.itemTitle {
					font-size: 30rpx;
					padding-right: 12px;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}

				.price {
					margin: 15rpx 0;
					display: flex;
					align-items: flex-end;

					.symbol {
						font-size: 20rpx;
					}

					.newPrice {
						color: red;
						font-size: 32rpx;
					}

					.oldPrice {
						margin-left: 20rpx;
						text-decoration: line-through;
						color: #999;
						font-size: 26rpx;
					}
				}

				.saleNum {
					margin-bottom: 10rpx;
					font-size: 26rpx;
					color: #B3B5B8;
				}
			}
		}
	}

	.itemWrap1 {
		width: 700rpx;
		margin: 0 auto;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;

		.shopItem {
			display: flex;
			flex-direction: row;
			box-shadow: 0 0 20rpx -12rpx;
			margin-top: 20rpx;
			height: 190rpx;
			border-radius: 20rpx;
			overflow: hidden;

			image {
				width: 300rpx;
				height: 100%;
			}

			.text {

				padding: 0 10rpx;

				.itemTitle {
					font-size: 30rpx;
					padding-right: 12px;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}

				.price {
					margin: 15rpx 0;
					display: flex;
					align-items: flex-end;

					.symbol {
						font-size: 20rpx;
					}

					.newPrice {
						color: red;
						font-size: 32rpx;
					}

					.oldPrice {
						margin-left: 20rpx;
						text-decoration: line-through;
						color: #999;
						font-size: 26rpx;
					}
				}

				.saleNum {
					margin-bottom: 10rpx;
					font-size: 26rpx;
					color: #B3B5B8;
				}
			}
		}
	}
</style>
