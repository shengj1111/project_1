<template>
	<view class="container">
		<view class="topBox"></view>
		<view class="user">
			<u-avatar mode="square"></u-avatar>
			<view class="userinfo">
				<view><text class="userinfoT1">{{username}}</text></view>
				<View><text class="userinfoT2">{{"ID "+userid}}</text></View>
				<!-- <view class="express"><text>{{express}}</text></view> -->
				<button class="express">{{express}}</button>
			</view>
		</view>
		<view class="account">
			<view class="myaccount">
				<view class="myaccountT">{{myaccount}}</view>
				<!-- <viw><text>我的账户</text></viw> -->
			</view>
			<view class="depos">
				<view class="tixian">{{tixian}}</view>
				<!-- <viw><text>提现</text></viw> -->
			</view>
		</view>
		<view class="myaccText">
			<view class="text1"><text>我的账户</text></view>
			<view class="text2"><text>提现</text></view>
		</view>
		<view class="merinfo">
			<u-cell-group class="merinfo">
				<u-cell-item :border-bottom="false" :title-style="titleStyle" title="门店管理" :arrow="false"><u-image class="img" width="36rpx" height="34rpx" src="../../static/images/storeManage.png"></u-image></u-cell-item>
				<u-cell-item :border-bottom="false" :title-style="titleStyle" title="订单管理" :arrow="false"><u-image class="img" width="36rpx" height="34rpx" src="../../static/images/orderManage.png"></u-image></u-cell-item>
				<u-cell-item :border-bottom="false" :title-style="titleStyle" title="客服管理" :arrow="false"><u-image class="img" width="36rpx" height="34rpx" src="../../static/images/customManage.png"></u-image></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				username: '蓝草君',
				userid: 95241,
				myaccount:100.0,
				tixian:100,
				express:'一级经销商',
				titleStyle:{
					marginLeft:'20px'
				}
				// src: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg'
			}
		}
	}
</script>

<style>
	.img{
		position: absolute;
		left: 0;
		margin-left: 15rpx;
		margin-top: 7rpx;
	}
	.merinfo{
		wdith: 701rpx;
		height: 348rpx;
		margin-top: 40rpx;
	}
	.myaccount,.tixian{
		color: #018A45;
		font-weight: 900;
		margin-top: -20rpx;
		font-size: 48rpx;
	}
	.myaccText{
		display: flex;
		justify-content: space-around;
		align-items: center;
		font-size: 24rpx;
		margin-top: -55rpx;
	}
	.text1{
		margin-left: 10rpx;
	}
	.text2{
		margin-right: 30rpx;
	}
	.account{
		width: 702rpx;
		height: 160rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		margin-left: 24rpx;
		margin-top: -80rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
	.user{
		position: absolute;
		margin-top: -200rpx;
		margin-left: 20rpx;
	}
	.userinfo{
		color: #F2ECF4;
		width: 120rpx;
		top: 0;
		position: absolute;
		margin-left: 100rpx;
	}
	.express{
		width: 172rpx;
		height: 54rpx;
		border-radius: 25rpx;
		font-size: 22rpx;
		line-height: 54rpx;
		color: #018A45;
		background-color: #ffffff;
		position: absolute;
		margin-top: -70rpx;
		margin-left: 477rpx;
	}
	/* .u-size-default.data-v-6e15e680{
		width: 172rpx;
		height: 54rpx;
		border-radius: 25rpx;
	} */
	.userinfoT1{
		font-size: 40rpx;
		font-weight: 600;
		line-height: 56rpx;
	}
	.userinfoT2{
		font-size: 24rpx;
		font-weight: 400;
		line-height: 34rpx;
	}
	.u-avatar__img.data-v-4f1b1b40 {
		border-radius: 0;
	}
	.container{
		background-color: #f2f4f6;
		width: 750rpx;
		height: 1624rpx;
	}
	.topBox {
		width: 1000rpx;
		height: 310rpx;
		background: linear-gradient(180deg, #00aa49 0%, #21BD71 100%);
		border-radius: 35%;
		margin-left: -100rpx;
		margin-top: -80rpx;
	}
</style>
