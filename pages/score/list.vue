<template>
	<view class="score">
		<!-- 头部 -->
		<view class="myscore">

			<view class="top">
				<view class="top-box">

					<view class="money">{{userAllList.integral||'0'}}</view>
					<view class="my">我的积分</view>
				</view>

			</view>

			<view class="score_view">
				<view class="bottom">
					<view class="item" @click="$toUrl('/pages/score/rules')">
						<u-icon size="50" style="margin:auto" name="order"></u-icon>
						<span>积分规则</span>
					</view>
					<view class="item" @click="$toUrl('/pages/score/detail')">
						<u-icon size="50" style="margin:auto" name="red-packet"></u-icon>
						<span>积分明细</span>
					</view>
					<view class="item" @click="$toUrl('/pages/score/record')">
						<u-icon size="50" style="margin:auto" name="car"></u-icon>
						<span>兑换记录</span>
					</view>
				</view>
			</view>

		</view>

		<view class="head_title">
			<text style="font-size: 40rpx;font-weight: 700;">积分兑换</text>
		</view>
		<view class="shangList">
			<view class="goodItem" v-for="(item,index) in goodsList" :key="index" @click="shangxiang(item)">
				<view class="goods">
					<view class="goodsTop">
						<image :src="item.productImg" mode="scaleToFill"></image>
					</view>
					<view class="goodsButtom">
						<view class="shang1">{{item.productName}}</view>
						<view class="xia1">
							<text
								style="color:rgb(240, 198, 86) ; padding-right: 10rpx; font-weight: 600;">{{item.integral}}</text>
							积分
						</view>
						<view class="duihuan">立即兑换</view>
					</view>
				</view>
			</view>
		</view>
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
				userAllList: {}, //用户信息
				goodsList: [], //积分商品列表
				getForm: {
					page: 1,
					pageSize: 10,
					shopId: 0
				}
			}
		},

		onLoad(option) {
			this.userIntegral = option.jifen
			this.getForm.shopId = getCurShopid() //获取商店id
			this.getGoodsList()
		},
		onShow() {
			this.getkqyejf()
		},
		onReachBottom() {
			uni.showLoading({
				title: '加载中'
			})
			this.getForm.page += 1
			this.getGoodsList(0)

		},
		methods: {
			//获取卡券,余额,积分
			getkqyejf() {

				NET.request(API.getUserAll, {
					shopId: this.getForm.shopId
				}, 'GET').then(res => {
					this.userAllList = res.data
					console.log(res.data, this.userAllList, 89898)
				})
			},
			//跳转商详
			shangxiang(item) {
				uni.navigateTo({
					url: `/pages/score/info?id=${item.id}&jifen=${this.userIntegral}`
				})
			},
			//获取所有的积分商品
			getGoodsList(isconcat = 1) {
				NET.request(API.getIntegralGoods, this.getForm, 'GET').then(res => {
					if (isconcat) {
						this.goodsList = res.data.list
					} else {
						this.goodsList = this.goodsList.concat(res.data.list)
						uni.hideLoading()
					}

				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.shangList {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		padding: 0 30rpx;

		.goodItem {
			
			// width: 45%;
			// width: 45%;
			// margin: 0rpx 0rpx 20rpx 20rpx;
			width: 335rpx;
			
			&:nth-child(2n){
				margin-left: 15rpx;
			}
			
			.goods {
				display: flex;
				flex-direction: column;
				overflow: hidden;

				.goodsTop {
					//width: 100%;
					width: 335rpx;
					height: 335rpx;
					
					image {
						width: 330rpx;
						height: 330rpx;
						border: 1rpx solid #d5d5d5;
					}
				}

				.goodsButtom {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					height: 200rpx;
					// margin: 20rpx 0rpx;

					.shang1 {
						font-size: 28rpx;
						font-weight: 600;
						height:74rpx;
						overflow: hidden;
					}
					.duihuan{
						background-color: #00aa00;
						width: 140rpx;
						height: 45rpx;
						line-height: 45rpx;
						text-align: center;
						color: #FFFFFF;
					}
				}
			}
		}
		
	}

	.head_title {
		padding: 20rpx 20rpx;
		background-color: #fff;
	}

	.score {
		.myscore {
			//我的积分
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			position: relative;
			height: 390rpx;

			.top {
				position: absolute;
				left: 0rpx;
				top: 0rpx;
				background-color: rgba(0, 170, 73, 1);
				width: 100%;
				height: 280rpx;
				z-index: -1;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-content: space-between;

				.top-box {

					height: 50rpx;
					color: #FFFFFF;
					margin: 0 auto;
					margin-top: 30rpx;
					display: flex;
					flex-direction: column;
					align-items: center;

					.money {
						font-weight: 600;
						font-size: 50rpx;

					}

					.my {
						font-weight: 600;
					}
				}
			}

			.score_view {
				margin: 10rpx 20rpx;
				padding: 30rpx 30rpx;
				box-shadow: 0 5rpx 15rpx #eee;
				border-radius: 15rpx;
				background-color: #fff;

				.bottom {
					display: flex;

					.item {
						flex: 1;
						display: flex;
						flex-direction: column;
						padding: 30rpx 0;

						span {
							margin: 10rpx auto auto;
						}
					}
				}
			}
		}
	}
</style>
