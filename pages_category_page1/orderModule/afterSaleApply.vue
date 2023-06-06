<!-- 申请售后 -->
<template>
	<view>
		<view class="content">
			<view class="order-list-box">
				<view class="item">
					<view class="order-info-box">
						<view class="order-info">
							<u-checkbox-group @change="checkboxGroupChange">
								<u-checkbox
								active-color="#ff9900"
								shape="circle"
								size="50"
								v-for="(item, index) in item.skus"
								:key="index"
								v-model="item.checked"
								:name='item.skuId'
								@change="checkboxChange(item)">
									<view class="order-info-item">
										<image :src="item.image" class="product-img"></image>
										<view class="info-box">
											<text class="product-name">{{item.productName}}</text>
											<view class="product-sku">{{item.value}}</view>
											<view class="price-sku-box">
												<text class="product-price"><text class="fuhao">￥</text>{{item.price}}</text>
												<text class="product-num">x {{item.number}}</text>
											</view>
										</view>
									</view>
								</u-checkbox>
							</u-checkbox-group>
						</view>
					</view>
				</view>
			</view>
			<view class="afterSale-select-box">
			<!-- 	<view class="item" @click="ReturnMoney(item)">
					<view class="l">
						<image src="../../static/images/afterSaleTuikuan.png" class="afterSale-img"></image>
						<text>我要退款（无需退货）</text>
					</view>
					<image src="../../static/images/arrowRight.png" class="r"></image>
				</view> -->

				<view class="item" @click="ReturnGoods(item)">
					<view class="l">
						<image src="../../static/images/afterSaleTuihuo.png" class="afterSale-img"></image>
						<text>我要退货退款</text>
					</view>
					<image src="../../static/images/arrowRight.png" class="r"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		data() {
			return {
				item: {},
				checkboxChangelist: [],
				xuanzlist:[]
			}
		},
		onLoad(item) {
			this.item = JSON.parse(item.item)
		},
		methods: {
			// 申请退款
			ReturnMoney(item) {
				console.log(99999)
				if(this.xuanzlist.length<=0){
					uni.showToast({
						title:'请选择退款的商品',
						duration:2000,
						icon:'none'
					})
				}else{
					uni.setStorageSync('afterSaleApplyRefund',this.xuanzlist)
					uni.navigateTo({
						url: 'afterSaleApplyRefund?orderId='+this.item.orderId
					})
				}
			},
			// 申请退货
			ReturnGoods(item) {
				if(this.xuanzlist.length<=0){
					uni.showToast({
						title:'请选择退货的商品',
						duration:2000,
						icon:'none'
					})
				}else{
					uni.navigateTo({
						url: 'afterSaleApplyRetund?list=' + JSON.stringify(this.xuanzlist)+'&orderId='+this.item.orderId
					})
				}
			},
			checkboxGroupChange(e){

			},
			checkboxChange(e) {
				this.xuanzlist = this.item.skus.filter(item => item.checked == true)
			}
		}
	}
</script>

<style>
	.order-list-box {
		padding: 20upx 30upx;
		box-sizing: border-box;
	}

	.order-list-box .item {
		/* margin-bottom: 20upx; */
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

	.order-info-box {
		padding: 0 30upx;
		box-sizing: border-box;
	}

	.order-info {
		/* border-bottom: 1px solid #eee; */
	}

	.order-info-item {
		display: flex;
		flex-direction: row;
		padding: 10upx 20upx;
		border-bottom: solid 1px #eee;
		width: 600rpx;
	}

	.order-info-item:last-child {
		border-bottom: none;
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
		margin-top: 10upx;
	}

	.product-sku {
		font-size: 24upx;
		color: #999;
		margin-top: 30upx;
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
	}

	.afterSale-select-box {
		width: 100%;
		background: #fff;
		padding: 0 30upx;
		box-sizing: border-box;
	}

	.afterSale-select-box .item {
		height: 100upx;
		border-bottom: 1px solid #e5e5e5;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		font-size: 28upx;
		color: #333;
	}

	.afterSale-select-box .item:last-of-type {
		border-bottom: none;
	}

	.afterSale-select-box .item .l {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.afterSale-select-box .item .afterSale-img {
		width: 26upx;
		height: 26upx;
		margin-right: 20upx;
	}

	.afterSale-select-box .item .r {
		width: 24upx;
		height: 24upx;
	}
</style>
