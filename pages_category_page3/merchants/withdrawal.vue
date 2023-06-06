<template>
	<view class="container">
		<view class="topbg">
			<view style="display: flex;flex-direction: column;margin: 80rpx auto auto;">
				<span>可提金额</span>
				<view class="moneys">
					{{canmoeny}}
				</view>
			</view>
		</view>
		<view class="head_boxs">
			<view class="head_tixian">
				<span>提现金额</span>
				<span class="mybtn" @click="$toUrl(`/pages_category_page3/merchants/withdrawDetails?shopid=${shopid}`)">查看明细</span>
			</view>
			
			<view class="head_content">
				<span class="money">￥</span>
				<input type="text" v-model="withdrawalMoney" />
				<span class="all" @click="withdrawalMoney = canmoeny">全部</span>
			</view>
			<view class="head_tixian">
				<text style="color: red;padding-top: 20rpx;">注 : 扣除千分之六手续费,实际到账{{(withdrawalMoney - (withdrawalMoney * 0.006)).toFixed(2)}}</text >
			
			</view>
		</view>
		<view class="bottom-btn-block">
			<view class="btn1" @click="doTx()">提现</view>
		</view>
	</view>
</template>

<script>
	import {
		getBank,
		tixian
	} from '../../api/shopmanage.js'

	export default {
		data() {
			return {
				shopId: 0,
				canmoeny: 0, //可提现金额
				"bankCard": "",
				"bankName": "",
				"collectionName": "",
				"shopCode": "",
				"shopName": "",
				withdrawalMoney: 0, //提现金额
			};
		},
		onLoad(option) {
			this.shopId = option.shopId;
			this.canmoeny = option.canmoeny; //可体现金额
			//this.canmoeny = 99999999
			this.bindBank();
		},
		methods: {
			bindBank() {
				const _this = this;
				getBank().then(res => {
					let _d = res.data;
					_this.bankCard = _d.bankCard;
					_this.bankName = _d.bankName;
					_this.collectionName = _d.collectionName;
					_this.shopCode = _d.shopCode;
					_this.shopName = _d.shopName;
				})
			},
			doTx() {
				const _this = this;
				if (_this.withdrawalMoney <= 0 ) {
					uni.showToast({
						title: "提现金额要大于0",
						icon: "none"
					})
					return
				}
				
				let _data = {
					"bankCard": _this.bankCard,
					"bankName": _this.bankName,
					"collectionName": _this.collectionName,
					"shopCode": _this.shopCode,
					"shopId": _this.shopId,
					"shopName": _this.shopName,
					"withdrawalMoney": _this.withdrawalMoney
				};
				tixian(_data).then(res=>{
					uni.showToast({
						title:"提现成功"
					})
					uni.navigateBack();
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.button_tx {
			width: 650rpx;
			height: 70rpx;
			line-height: 70rpx;
			border-radius: 35rpx;
			border: 1rpx solid #00AA49;
			text-align: center;
			margin: 30rpx auto;
			color: #00AA49;
		}

		.topbg {
			background-color: #00AA49;
			border-radius: 0 0 80rpx 80rpx;
			height: 320rpx;
			color: #fff;
			display: flex;
			text-align: center;

			span {
				font-size: 22rpx;
			}

			.moneys {
				font-size: 60rpx;
			}
		}

		.head_boxs {
			width: 700rpx;
			margin: 0 auto;
			position: relative;
			border-radius: 10rpx;
			top: -50rpx;
			padding: 30rpx;
			background-color: #fff;
			box-shadow: 0 10rpx 25rpx #eee;
			.head_tixian{
				display: flex;
				justify-content: space-between;
				// padding: 20rpx 0rpx;
				.mybtn{
					border-radius: 30rpx;
					line-height: 35rpx;
					height: 35rpx;
					padding: 0 15rpx;
					border: 1rpx solid #00AA49;
					color: #00AA49;
				}
			}
			.head_content {
				margin-top: 30rpx;
				display: flex;
				padding-bottom: 5rpx;
				border-bottom: 1rpx solid #00AA49;

				.money {
					font-size: 40rpx;
				}

				input {
					flex: 1;
					padding: 0 15rpx;
				}

				.all {
					border-radius: 30rpx;
					line-height: 35rpx;
					height: 35rpx;
					padding: 0 15rpx;
					border: 1rpx solid #00AA49;
					color: #00AA49;
				}
			}
		}
	}
</style>
