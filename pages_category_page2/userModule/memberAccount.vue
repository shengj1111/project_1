<!-- 我的账户 -->
<template>
	<view class="container">
		<view class="balance">
			<view v-if="accountInfo.price != null " class="cur-balance">{{accountInfo.price}}</view>
			<view v-else class="cur-balance">0</view>
		</view>
		<view class="balance-operation">
			<view class="item-btn mt20" @click="memberAccountWithdraw">
				<image class="item-btn-icon" src="../../static/img/user/fenxiao.png" mode="widthFix"></image>
				<view class="item-btn-text">提现</view>
				<image class="item-btn-right" src="../../static/img/user/arrow.png" mode="widthFix"></image>
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
				accountInfo:[]
			}
		},
		onShow() {
			this.getBalance()
		},
		onBackPress(e) {
			if (e.from === 'navigateBack') {  
				return false;  
			}  
			this.back();  
			return true;  
		}, 
		methods: {
			back(){
				uni.switchTab({
					url:'../../pages/tabbar/user/index'
				}); 
			},
			getBalance(){
				const _ = this
				NET.request(API.GetDistributor,{},"GET").then(res => {
					_.accountInfo = res.data
				}).catch(res => {
					
				})
			},
			memberAccountWithdraw(){
				// if(this.accountInfo.price < 1){
				// 	uni.showToast({
				// 		title: "可提现金额小于1，不能提现",
				// 		duration: 2000,
				// 		icon: 'none'
				// 	})
				// }else{
				// 	uni.navigateTo({
				// 		url:'withdraw'
				// 	})
				// }
				
				uni.navigateTo({
					url:'withdraw?m='+this.accountInfo.price
				})
			}
		},
		filters: {
			parseMoney(money){
				return parseFloat(money/100).toFixed(2)
			}
		}
	}
</script>

<style lang="scss">
	.container{
		background: #f8f8f8;
		.balance{
			display: block;
			height: 200px;
			background: #00AA49;
			text-align:center;
			.cur-balance{
				font-size:60px;
				color:white;
				padding-top:50px;
			}
		}
	}
	.item-btn{
		width: 100%;
		height: 100upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		box-sizing: border-box;
		background-color: #fff;
		padding: 0 30upx;
		.item-btn-icon{
			width: 48upx;
			height: 48upx;
		}
		.item-btn-text{
			font-size:28upx;
			margin-left: 20upx;
			font-weight:500;
			flex: 1;
			color:rgba(102,102,102,1);
		}
		.item-btn-right{
			width: 24upx;
			height: 24upx;
		}
		
	}
	.mt20{
		margin-top: 20upx;
	}
	.mt1{
		margin-top: 1upx;
	}
</style>
