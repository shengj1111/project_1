<template>
	<view>
		<view class="search">
			<view class="form">
				<span class="icon">
					<u-icon name="search"></u-icon>
				</span>
				<u-input class="input" v-model="form.name" placeholder="商品名称、编码" placeholder-style="color: #626262;" />
			</view>
			<view class="screening">
				<u-icon name="map"></u-icon>筛选
			</view>
			<view class="classification">
				<u-icon name="list"></u-icon>分类
			</view>
		</view>
		<view class="details">
			<view class="text">
				<span>想找好货吗？请点击了解详情</span>
				<u-icon name="arrow-right"></u-icon>
			</view>
		</view>
		<view class="sales">
			<view @click="activeChange(1)" :class="{'active': activeIndex == 1}">出售中(0)</view>
			<view @click="activeChange(2)" :class="{'active': activeIndex == 2}">已下架(1)</view>
			<view @click="activeChange(3)" :class="{'active': activeIndex == 3}">风险下架(0)</view>
		</view>
		<view v-if="showEmptyCart">
			<view class="itemWrap">
				<view class="item" v-for="item in HasBeenShelves" :key='item'>
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
		<view v-else class="emptyCart-box flex-items-plus flex-column">
			<image class="emptyCart-img" src="../../static/images/cartEmpty.png"></image>
			<label class="font-color-999 fs26 mar-top-30">暂无商品</label>
		</view>
		<view class="bottom-box">
			<view class="bottom-div">
				<view class="batchManagement">批量管理</view>
				<view class="ClassManagement">分类管理</view>
				<view class="submit">添加商品</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					name: ''
				},
				showEmptyCart: false,
				activeIndex: 1,
				text: '',
				InSale: [],
				HasBeenShelves: [{
					src: 'https://img2.baidu.com/it/u=1145742942,4055967999&fm=26&fmt=auto&gp=0.jpg',
					title: '50包金牌外墙耐水腻子粉(14KG)送20桶C胶(红)',
					newPrice: '1300.0',
					oldPrice: '2140.0',
					saleNum: 173
				}],
				VentureShelves: [],
			};
		},
		methods: {
			activeChange(index) {
				this.showEmptyCart = false
				if (index == 1 && this.InSale.length > 0) {
					this.showEmptyCart = true
				}
				if (index == 2 && this.HasBeenShelves.length > 0) {
					this.showEmptyCart = true
				}
				if (index == 3 && this.VentureShelves.length > 0) {
					this.showEmptyCart = true
				}
				console.log(this.showEmptyCart)
				this.activeIndex = index
			}
		}
	}
</script>
<style lang="scss">
	page {
		background-color: #F2F2F2;
	}

	.search {
		background-color: #00AA49;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100prx;
		padding: 30rpx;

		.form {
			margin-left: 20rpx;
			background-color: #ECECEC;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			padding-left: 20rpx;

			.input {
				display: flex;
				align-items: center;
				padding-left: 20rpx;
				width: 400rpx;
				height: 80rpx;
				line-height: 50rpx;
			}
		}

		.screening,
		.classification {
			color: #FFF;
		}
	}

	.details {
		background-color: #FFF4DE;
		height: 75rpx;
		line-height: 75rpx;

		.text {
			color: #F19683;
			width: 700rpx;
			margin: 0 auto;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}

	.sales {
		height: 90rpx;
		line-height: 90rpx;
		border: 1px solid #CCC;
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 0 20rpx;
	}

	.active {
		color: red;
		border-bottom: 6rpx solid red;
	}

	.emptyCart-box {
		// height: 67vh;
		padding: 170rpx;

		.emptyCart-img {
			width: 270upx;
			height: 270upx;
		}
	}

	.itemWrap {
		width: 700rpx;
		margin: 0 auto;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;

		.item {
			box-shadow: 0 0 20rpx -12rpx;
			margin-top: 20rpx;
			width: 340rpx;
			border-radius: 20rpx;
			overflow: hidden;

			image {
				height: 360rpx;
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

	.bottom-box {
		background-color: #FFF;
		position: fixed;
		bottom: 0;
		width: 750rpx;

		.bottom-div {
			height: 100rpx;
			padding: 20rpx 0;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			margin-right: 20rpx;

			.batchManagement,
			.ClassManagement,
			.submit {
				font-size: 34rpx;
				margin-right: 20rpx;
			}

			.submit {
				background-color: #D91B1B;
				color: #FFF;
				padding: 20rpx;
				border-radius: 10rpx;
			}
		}
	}
</style>
