<!-- 地址列表 -->
<template>
	<view class="container">
		<view v-if="addresList.total>0" class="pad-bot-140">
			<view class="addAddress-content flex-row-plus" v-for="(item, index) in addresListlist" :key="index">
				<view class="address-hesd">{{item.username1}}</view>
				<view class="address-detail" @click="itemTap(item)">
					<view>
						<text>{{item.receiveName}}</text>
						<text class="fs24 font-color-999 mar-left-10">{{item.receivePhone}}</text>
					</view>
					<view class="defaultAD-box">
						<text class="def" v-if="item.defult">默认</text>
						<text class="lable" v-else-if="item.label!=''">{{item.label}}</text>
						<text class="user-address">{{item.receiveAdress}}{{item.address}}</text>
					</view>
				</view>
				<view class="right-Line"></view>
				<view class="font-color-999 fs24" @click="editAdress(index, item)">编辑</view>
			</view>
		</view>
		<view v-else class="emptyAddress-box">
			<image class="emptyAddress" src="../../static/images/emptyAddress.png"></image>
			<text>你还没有添加地址哦～</text>
		</view>
		<view class="addAddress-box">
			<view class="addAddress" @click="addAddressClick">添加新地址</view>
		</view>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		data() {
			return {
				addresList:[],
				headWord:'',
				editAddress:[],
				type:0,
				addresListlist:[],  //地址列表
				page:1,//当前页
				pageSize:20,//每页记录数
				loadingType:0,
			}
		},
		onLoad(options) {
			this.type = options.type
		},
		onShow(options){
			this.addresListlist = []
			this.page = 1
			this.getAddressData()
		},
		onBackPress(e) {
			if (e.from === 'navigateBack') {
				return false;
			}
			this.back();
			return true;
		},
		onReachBottom(){
			if(this.loadingType == 1){
				uni.stopPullDownRefresh()
			}else{
				this.page = this.page+1
				this.getAddressData()
			}
		},
		methods: {
			back(){
				if(this.type == 1){
					uni.navigateTo({
						url:'../../pages_category_page1/orderModule/orderConfirm?type=3'
					})
				}else{
					uni.switchTab({
						url:'../../pages/tabbar/user/index'
					});
				}
			},
			addAddressClick(){
				if(this.type == 1){
					uni.navigateTo({
						url:'addAddress?type=1&ordertype=1'
					})
				}else{
					uni.navigateTo({
						url:'addAddress?type=1'
					})
				}

			},
			getAddressData(){
				NET.request(API.QueryMemberAddres,{page:this.page,pageSize:this.pageSize},"GET").then(res => {
					this.addresList = res.data
					if(res.data.list.length == 0){
						this.loadingType = 1
						this.page = this.page
					}
					for(let i =0;i<res.data.list.length;i++){
						this.addresList.list[i].username1 = this.addresList.list[i].receiveName.slice(0,1)
					}
					this.addresListlist = this.addresListlist.concat(res.data.list)
				}).catch(res => {

				})
			},
			editAdress(id, item){
				uni.setStorageSync("editAddress",JSON.stringify(this.addresList.list[id]))
				uni.navigateTo({
					url:'addAddress?type=2&receiveId=' + item.receiveId
				})
			},
			itemTap(item){
			    if(this.type == 1){
					uni.setStorageSync('receiveItem',item)
					// uni.redirectTo({
					//     	url:`../../pages_category_page1/orderModule/orderConfirm?type=3&receiveId=${item.receiveId}&isFrom=0&flagindex=1`
					// });
					uni.navigateBack()
			    }else if(this.type){
						uni.setStorageSync('receiveItem', item)
						uni.navigateBack()
				}
			},
		}
	}
</script>

<style lang="scss">
	.container{
		.emptyAddress-box{
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			margin-top: 55upx;
			.emptyAddress{
				width: 270upx;
				height: 270upx;
			}
		}
		.addAddress-box{
			position: fixed;
			bottom: 50upx;
			left: 30upx;
			.addAddress{
				width: 690upx;
				height: 80upx;
				color: #FFFFFF;
				border-radius: 40upx;
				text-align: center;
				line-height: 80upx;
				background-color: #00AA49;
			}
		}
		.addAddress-content{
			display: flex;
			align-items: center;
			justify-content: space-around;
			padding: 30upx 30upx;
			.lable {
			  padding: 3rpx 10rpx;
			  background: rgba(153, 153, 153, 0.2);
			  border-radius: 4rpx;
			  font-size: 24rpx;
			  font-weight: 500;
			  color: rgba(102, 102, 102, 1);
			}
			.def{
				padding: 3rpx 10rpx;
				background: rgba(153, 153, 153, 0.2);
				border-radius: 4rpx;
				font-size: 24rpx;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
				background:rgba(255,121,17,0.2);
				color: #FF7911;
			}
			.user-address {
			  font-size: 28rpx;
			  font-weight: 500;
			  color: rgba(51, 51, 51, 1);
			  margin-left: 10rpx;

			}
			.address-hesd{
				height: 70upx;
				width: 70upx;
				background-color: #BBBBBB;
				color: #FFFFFF;
				border-radius: 50%;
				line-height: 70upx;
				text-align: center;
			}
			.defaultAD-box{
				width: 455upx;
				.default-textBox{
					padding-right: 20upx;
					width: 80upx;
				}
				.default-content{
					width: 435upx;
				}
				.default-text{
					color: #FF7800;
					background-color: #FFE4CC;
					height: 36upx;
					width: 60upx;
					font-size: 26upx;
					border-radius: 4upx;
					align-items: center;
					line-height: 36upx;
				}
			}
			.right-Line{
				border-right: 2upx solid #DDDDDD;
				height: 50upx;
			}
		}
	}

</style>
