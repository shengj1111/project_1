<template>
	<view class="content">
		<view class="img-box">
			<image :src="goodsItem.productImg" mode="aspectFit"></image>
		</view>
		

		<view class="desc">

			<view class="goodsNum">
				<view class="titleName">{{goodsItem.productName}}</view>
				<view class="price">{{goodsItem.integral}}积分</view>
			</view>

			<view class="goodsNum">
				<text>兑换数量 </text>
				<u-number-box v-model="goodsNumber" @change="valChange"></u-number-box>
			</view>

			<view class="goodsNum">
				<view>当前积分 <text class="jifenStyle">{{userIntegral}}</text></view>
				<view>最大兑换数量 <text class="jifenStyle">{{Math.floor(userIntegral / goodsItem.integral)}} </text>
				</view>
			</view>

			<view class="head_title">
				<span class="left">商品信息</span>
			</view>

			<view class="productTextStyle">
				<rich-text :nodes="goodsItem.productText"></rich-text>
			</view>

		</view>

		<u-button class="fiexd_mai" type="success" :disabled='goodsItem.inventory>0?false:true' @click="duihuan">
			{{goodsItem.inventory>0?'立即兑换':'库存不足'}}
		</u-button>


	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	import {
		getCurShopid
	} from '@/api/common.js'
	export default {
		data() {
			return {
				id: "", //上级页面传入的商品id
				goodsItem: {}, //商品详情
				userIntegral: 0, //用户积分
				goodsNumber: 1, //物品个数
			}
		},
		onLoad(option) {
			console.log(option, 88888)
			this.id = option.id //商品id

			// uni.setNavigationBarTitle({
			// 	title: `${this.goodsItem.productName}`
			// });
		},
		onShow() {
			this.getkqyejf()
			this.xiangqing()
		},
		methods: {
			//获取卡券,余额,积分
			getkqyejf() {
				let shopId = getCurShopid()
				NET.request(API.getUserAll, {
					shopId
				}, 'GET').then(res => {
					this.userIntegral = res.data.integral
					console.log(res.data, 89898)
				})
			},
			valChange(e) {
				console.log('当前值为: ' + e.value)
			},
			duihuan() {
				//判断输入的数量符合规则
				if (this.goodsNumber >= 1 && this.goodsNumber <= this.goodsItem.inventory) {
					if (this.userIntegral < this.goodsItem.integral) {
						uni.showToast({
							title: "积分不足",
							icon: "none"
						})

					} else {
						uni.navigateTo({
							url: `/pages/score/pay?goodsId=${this.goodsItem.id}&goodsNum=${this.goodsNumber}`
						})
					}
				} else {
					uni.showToast({
						title: "数量不规范",
						icon: "none"
					})
					this.goodsNumber = 1
				}
				console.log(this.userIntegral, this.goodsItem.integral, 998898989)


			},
			xiangqing() {
				NET.request(API.getGoodsXiang, {
					id: this.id
				}, 'GET').then(res => {
					this.goodsItem = res.data
					this.goodsItem.productText = res.data.productText.replace(/\<img/gi,
						'<img style="max-width:100%;height:auto" ')
					console.log(res.data, 79878911)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.goodsNum {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 25rpx 0rpx;
		border-bottom: 1rpx #d6d6d6 solid;
	}
.jifenStyle{
	color: #ED3F14;
	padding-left: 20rpx;
	
}
	.head_title {
		padding: 20rpx 0rpx;
	}

	.content {
		
		.img-box{
			 width: 750rpx;
			height: 750rpx;
			margin: 0 auto;
			image{
				width: 100%;
				height: 100%;
			}
		}
		padding-bottom: 100rpx;

		.titleName {
			font-size: 40rpx;
			font-weight: 600;
		}

		.price {

			color: #ED3F14;

		}

		.desc {
			padding: 20rpx 50rpx;

			.productTextStyle {
				width: 100%;

			}
		}


		.fiexd_mai {
			// background-color: #289C52;
			position: fixed;
			left: 20rpx;
			right: 20rpx;
			bottom: 20rpx;
			border-radius: 12rpx;
			padding: 20rpx 0;
			color: #fff;
			text-align: center;
			
			&.stocknull {
				background-color: #ea585a;
			}
		}
	}
</style>
