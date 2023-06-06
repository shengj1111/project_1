<template>
	<view>
		<view class="imgBox">
			<image class="order-item-image" :src="ewCode" mode="widthFix" v-if="ewCode !== ''"></image>
			<view v-else class="textBox">暂无二维码</view>
			<view class="shopNameText">{{shopName}}</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ewCode:'',
				shopName:'',
				shopId:0,
			}
		},
		onLoad(options) {
			this.ewCode = options.imgUrl
			this.shopName = options.shopName
			this.shopId = options.shopId
			console.log(options,'传递进来的参数')
		},
		onShareAppMessage() {
			return {
				title: this.shopName,
				path:`/pages/homePage/homePage?storeId=${this.shopId}`,	
			}
		},
		methods: {}
	}
</script>

<style lang="scss">
	.imgBox{
		width: 500rpx;
		height: 500rpx;
		transform: translateY(30%);
		margin: 0 auto;
		.order-item-image{
			width: 100%;
			height: 100%;
		}
		.textBox{
			font-size: 60rpx;
			font-weight: 800;
			text-align: center;
		}
	}
	.shopNameText{
		font-size: 50rpx;
		font-weight: 700;
		text-align: center;
	}
	
</style>
