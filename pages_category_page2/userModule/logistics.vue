<!-- 物流积分兑换 -->
<template>
	<view class="container">

		<!-- <view class="zong">物流积分 : <text> 999</text></view> -->
		<!-- 		<view>
			<u-subsection :list="kindList" :current="kind" @change="conversion"></u-subsection>
		</view>
		<view v-if="kind == 0" class="hezi">
			<view class="biaoti">兑换余额</view>
			<view class="shuliang">
				<text class="rmb">¥</text>
				<input class="num" type="number" placeholder="请输入兑换金额" v-model.number="duihuanFrom.number"/>
			</view>
			<button type="primary" @click="balanceye" class="anniu">确定兑换</button>
		</view>
	
		<view v-if="kind == 1" class="hezi">
			<view class="biaoti">兑换商品积分</view>
			<view class="shuliang">
				<text class="rmb">¥</text>
				<input class="num" type="number" placeholder="请输入兑换商品积分数量" v-model.number="duihuanFrom.number"/>
			</view>
			<button type="primary" @click="balancejf" class="anniu">确定兑换</button>
		</view> -->
		<view style=" margin: 20rpx; ">
			<u-form :model="duihuanFrom">
				<u-form-item label="兑换多少 : " prop="number" label-width='150'>
					<u-input v-model.number="duihuanFrom.number" style="display: inline-block;" placeholder="请输入需要兑换的数量"
						:clearable='false' />分
				</u-form-item>
				<u-form-item>
					<u-radio-group v-model="duihuanFrom.exchangeType" @change="radioGroupChange">
						<u-radio 
						active-color="#00aa49"
						@change="radioChange" 
						v-for="(item, index) in kindList" 
						:key="index" 
						:name="item.name"
						:disabled="item.disabled">
							{{item.name}}
						</u-radio>
					</u-radio-group>
				</u-form-item>
			</u-form>
			<button type="primary" @click="duihuan" class="anniu">确定兑换</button>
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
				kind: 0, // 0-兑换余额  1-兑换积分商品
				kindList: [{
						name: '兑换余额',
						disabled: false
					},
					{
						name: '兑换商品积分',
						disabled: false
					}
				],

				duihuanFrom: {
					exchangeType: '兑换余额', //兑换类型
					number: '', //兑换数量
					shopId: 0, //商店id
				},


			}
		},

		onLoad(options) {
			console.log(options, '传过来的参数')
		},
		methods: {
			//选中某一个时触发
			radioChange(e) {
				console.log(e);
			},
			//选中任意一个时触发
			radioGroupChange(e) {
				console.log(e);
			},
			//确定兑换的按钮
			duihuan() {
				if(parseInt(this.duihuanFrom.number) < 1){
					uni.showToast({
						title: '输入的数量不规范',
						duration:2000,
						icon: "none"
					})
					return
				}
				this.duihuanFrom.shopId = getCurShopid()
				uni.showLoading({
					title: '加载中'
				});
				console.log(this.duihuanFrom,'发送的数据')
				NET.request(API.duihuanwuliu, this.duihuanFrom, 'POST').then(res => {
					uni.hideLoading()
					uni.showToast({
						title: '兑换成功',
						icon: "success",
						duration: 2000
					})
					setTimeout(() => {
						uni.navigateBack()
					}, 500)
				})
			}
		}
	}
</script>

<style lang="scss">
	.zong {
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		font-size: 40rpx;
		font-weight: 700;
		margin: 0rpx 0rpx 20rpx 0rpx;
	}

	.hezi {

		// margin: 0rpx 0rpx 20rpx 0rpx;
		.biaoti {
			font-size: 30rpx;
			font-weight: 700;
			margin: 50rpx 0rpx 30rpx 30rpx;
		}

		.shuliang {
			display: flex;

			margin: 30rpx 0rpx 30rpx 30rpx;
			border-bottom: 1rpx #9f9f9f solid;

			.rmb {
				margin: 9rpx 9rpx 0rpx 0rpx;
				font-weight: 700;
			}

			.num {
				margin-bottom: 20rpx;
				font-size: 50rpx;
				color: #000000;
				font-weight: 700;
			}

			.tishi {
				font-size: 20rpx;
				color: #8a8a8a;
			}
		}
	}

	.anniu {
		position: fixed;
		bottom: 50rpx;
		left: 50%;
		width: 90%;
		transform: translateX(-50%);
	}
</style>
