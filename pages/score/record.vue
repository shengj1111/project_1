<!-- 订单中心 -->
<template>
	<view class="container">
		<view style="padding-bottom:68upx;">
			<view>
				<u-tabs :list="tabList" :is-scroll="false" bg-color="#F7F7F7" active-color="#00AA49" :current="type"
					@change="orderStateChange"></u-tabs>
			</view>
			<view class="order-list-box">
				<view >
					<view class="item" v-for="(item, index) in listAll" :key="index">
						<view class="order-list-top">
							<view >{{item.createTime}}</view>
							<view class="order-status" v-if='item.deliveryState==0'>配送</view>
							<view class="order-status" v-else-if='item.deliveryState==1'>自提</view>
							
							<view class="order-status" style="color: red;" v-if='item.state==1'>待发货</view>
							<view class="order-status" style="color: red;" v-else-if='item.state==2'>已发货</view>
							<view class="order-status" style="color: red;" v-else-if='item.state==3'>已完成</view>
							<view class="order-status" style="color: red;" v-else-if='item.state==4'>已关闭</view>
						
						</view>
						<view class="order-info-box">
							<view class="order-info" @click="goXiang(item)">
								<view class="order-info-item" >
									<image :src="item.productImg" class="product-img"></image>
									<view class="info-box">
										<!-- <view class="product-name-my">{{item.createTime}}</view> -->
										<text class="product-name-my">{{item.productName}}</text>
										<view class="product-name">{{item.address}}</view>
										<!-- <view class="product-name">数量:{{item.number}}</view> -->
								<view class="box-h">
									<text class="product-price"><text
											class="fuhao">积分 : </text>{{item.integral}}</text>
									<text class="product-num">x {{item.number}}</text>
								</view>
									</view>
								</view>
							</view>
							<view class="total-price-box">总积分 : {{item.totalintegral }}
							
							</view>
							<view class="order-btn-box">
								<text class="btn r" v-if='item.state==2'
									@click.stop="confirmReceiptTap(item)">确认收货</text>
									
									
									
									<text class="btn r" v-if="item.state == 1 && item.cancelstate == ''"
										@click.stop="quxiaoOrder(item,index)">取消订单</text>
									
									<text class="btn r" v-if='item.state == 1 && item.cancelstate == 1'
										@click.stop="quxiaoOrder(item,index)" style="width: 270rpx;">订单取消(审核中)</text>
									
									<text class="btn r" v-if=' item.cancelstate == 2' style="width: 270rpx;"
										@click.stop="quxiaoOrder(item,index)">订单取消(已通过)</text>
									
									<text class="btn r" v-if='item.state == 1 && item.cancelstate == -1'
										@click.stop="quxiaoOrder(item,index)" style="width: 270rpx;">订单取消(已驳回)</text>
									
									
								<!-- <text class="btn l" v-if='item.state==5|| item.state == 9'
									@click.stop="delOrder(item.orderId)">删除订单</text> -->
							</view>
						</view>
					</view>
				</view>
	<!-- 			<view v-else class="emptyOrder-box flex-items-plus flex-column">
					<image class="emptyOrder-img" src="@/static/images/emptyOrderImg.png"></image>
					<label class="font-color-999 fs26 mar-top-30">你还没有订单哦～</label>
				</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	import {
		getCurShopid
	} from "../../api/common.js";
	export default {
		data() {
			return {
				type: 0,
		
				tabList: [{
					name: '全部',
					number: ''
				}, {
					name: '待发货',
					number: 1
				}, {
					name: '已发货',
					number: 2
				}, {
					name: '已完成',
					number: 3
				}, {
					name: '已关闭',
					number: 4
				}],
			
				loadingType: 0,
				orderState: '', // '' -- 全部 1 -- 待发货  2--已发货
				paymentMode: 2,
				
				//获取所有订单的表单
				getListForm:{
					page: 1,
					pageSize: 20,
					shopId:0,
					state:"",
					//id:230,
					//orderFormid:'60cb81d3d4d247f9972b1fb3946a57f9'
				},
				listAll:[],//订单列表
			}
		},
		onLoad(options) {
			this.getListForm.shopId = getCurShopid()
			
		},
		onShow() {
			this.listAll = []
			this.getListData()
		},
		onReachBottom() {
			const _this=this;
			this.getListForm.page = this.getListForm.page + 1
			setTimeout(function(){
				_this.getListData()
			},1500)
			
		},
		onBackPress(e) {
			if (e && e.from === 'navigateBack') {
				return false;
			}
			this.back();
			return true;
		},
		methods: {
			//去积分订单详情
			goXiang(item){
		
					uni.navigateTo({
						url: `/pages_category_page2/userModule/jifenXiang?orderFormid=${item.orderFormid}`
					})
		
					
			},
			//去取消订单
			quxiaoOrder(item, index) {
				// let shopid = getCurShopid()
				console.log(item, index, 123987)
				uni.navigateTo({
					// 
					url: `/pages_category_page1/orderModule/quxiaoOrder?orderId=${item.orderFormid}&shopId=${item.shopId}&state=${item.state}&isJiFen=${true}&buyerUserId=${item.buyerUserId}`
				})
			},
			back() {
				uni.switchTab({
					url: '../../pages/tabbar/user/index'
				});
			},
			orderStateChange(index) {
				this.type = index;
				
				if(index==0){
					this.getListForm.state = "";
				}else{
					this.getListForm.state = this.tabList[index].number
				}
				
				this.getListForm.page = 1
				this.listAll = []
				this.getListData()
			},
			// 订单列表数据
			getListData() {
				uni.showLoading({
					title: '加载中...',
				})
				NET.request(API.conversionRecord, this.getListForm, 'GET').then(res => {
					let _d=res.data.list;
					if(_d && _d.length && _d.length>0){
						this.listAll = this.listAll.concat(_d)
					}
					uni.hideLoading()
				})
			},
			confirmReceiptTap(item) {
				console.log(item,'该商品详情')
				uni.showModal({
					title: '温馨提示',
					content: '确定您已经收到货物，否则会造成财产损失',
					confirmText: '确定收到',
					cancelText: '点错了',
					success: res => {
						if (res.confirm) {
							this.doConfirm(item.id)
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			doConfirm(orderId) {
				NET.request(API.integralReceiving, {
					id: orderId
				}, 'POST').then(res => {
					uni.hideLoading()
					uni.showToast({
						title: '确认成功',
					})
					setTimeout(() => {
						this.type = 3;
						this.getListForm.state = 3
						this.getListForm.page = 1
						this.listAll = []
						this.getListData()
					}, 1500);
				}).catch(res => {
					uni.hideLoading()
				})
			},
			delOrder(orderId) {
				uni.showModal({
					title: '温馨提示',
					content: '您确定要删除该订单吗？',
					confirmText: '确定删除',
					cancelText: '点错了',
					success: res => {
						if (res.confirm) {
							this.doDel(orderId)
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			doDel(orderId) {
				uni.showLoading({
					title: '提交中...',
				})
				NET.request(API.DelOrder, {
					orderId: orderId
				}, 'POST').then(res => {
					uni.hideLoading()
					uni.showToast({
						title: '删除成功',
					})
					setTimeout(() => {
						this.type = 0;
						this.orderState = 0
						this.page = 1
						this.list = []
						this.getListData()
					}, 1500);

				}).catch(res => {
					uni.hideLoading()
				})
			},

			goShop(id) {
				uni.navigateTo({
					url: "../store/index?storeId=" + id
				})
			},
		}

	}
</script>

<style lang="scss">
	page {
		width: 100%;
		height: 100%;
		background: #fff;
	}

	.nav-box-box {
		height: 88upx;
		background: #f6f6f6;
		white-space: nowrap;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 10;
	}

	.nav-box-box .item {
		display: inline-view;
		padding: 0 30upx;
		box-sizing: border-box;
		height: 88upx;
		text-align: center;
		line-height: 88upx;
		font-size: 30upx;
		color: #666;
		font-weight: 500;
	}

	.nav-box-box .item.active text {
		display: inline-view;
		color: #ff7911;
		box-sizing: border-box;
		height: 88upx;
		border-bottom: 2px solid #ff7911;
	}

	.order-list-box {
		padding: 20upx 30upx 0;
		box-sizing: border-box;
	}

	.order-list-box .item {
		margin-bottom: 20upx;
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
		border-bottom: 1px solid #eee;
	}

	.order-info-item {
		display: flex;
		flex-direction: row;
		padding: 20upx 0;
	}

	.product-img {
		width: 210upx;
		height: 210upx;
		border-radius: 10upx;
		margin-right: 30upx;
	}

	.info-box {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
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
	.product-name-my {
		font-size: 26upx;
		color: #333;
		height: 50upx;
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
	}

	.product-sku {
		font-size: 24upx;
		color: #999;
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
		display: inline-view;
		font-size: 28upx;
		margin-left: 20upx;
		color: #999;
	}

	.total-price-box {
		font-size: 26upx;
		color: #333;
		text-align: right;
		padding: 30upx 0;
	}

	.order-btn-box {
		padding: 20upx 0;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
	}

	.order-btn-box .btn {
		display: inline-view;
		width: 150upx;
		height: 56upx;
		border-radius: 28upx;
		text-align: center;
		line-height: 56upx;
		font-size: 26upx;
		color: #333;
		margin-left: 20upx;
	}

	.evaluate {
		height: 56upx;
		border-radius: 28upx;
		text-align: center;
		line-height: 56upx;
		font-size: 26upx;
		padding: 0 30upx;
		border: 1px solid #FF7911;
		color: #FF7911;
	}

	.evaluate2 {
		height: 56upx;
		border-radius: 28upx;
		text-align: center;
		line-height: 56upx;
		font-size: 26upx;
		padding: 0 30upx;
		border: 1px solid #BBBBBB;
		color: #333;
	}

	.order-btn-box .btn.l {
		border: 1px solid #BBBBBB;
		color: #333;
	}

	.order-btn-box .btn.r {
		border: 1px solid #FF7911;
		color: #FF7911;
	}

	.emptyOrder-box {
		margin-top: 70upx;

		.emptyOrder-img {
			width: 270upx;
			height: 270upx;
		}
	}

	.pay-type-item {
		.pay-type-radio {
			background-color: white;
			border-bottom: 1upx solid #EDEDED;
			margin-bottom: 20upx;
			padding: 24upx 20upx 24upx 20upx;

			.pay-type-img {
				display: inline-block;

				.pay-type-img-inner {
					width: 50upx;
					height: 50upx;
					vertical-align: middle;
				}
			}

			.pay-type-label {
				vertical-align: middle;
				margin-left: 30upx;
			}

			.pay-type-radio-item {
				float: right;
				margin-right: 20upx;
				width: 50upx;
				height: 50upx;
			}
		}

		.huabei-detail {
			margin-top: 20upx;

			.fenqi-wenzi {
				display: inline-block;
				margin-left: 64upx;
			}

			.fenqi-amount {
				display: block;
				margin-left: 64upx;
				margin-top: 14upx;
				color: #BABBBC;
			}

			.fenqi-charge-fee {
				float: right;
				margin-right: 68upx;
				color: #BABBBC;
			}

			.fenqi-modal {
				width: 40upx;
				height: 40upx;
				margin-left: 20upx;
				float: right;
				position: relative;
				top: -80upx;
			}
		}
	}

	.paytype-confirm {
		height: 120upx;
		padding: 0upx 108upx 0upx 32upx;

		.fenqi-all {
			display: inline-block;
			width: 100%;
		}

		.fenqi-total-amount {
			width: 65%;
			float: left;
		}

		.fenqi-confirm {
			float: right;
			width: 160upx;
			padding: 0upx 20upx;

			.btn {
				width: 216upx;
				height: 80upx;
				line-height: 80upx;
				border-radius: 40upx;
				font-size: 28upx;
				text-align: center;
				background: linear-gradient(90deg, rgba(255, 162, 0, 1), rgba(255, 121, 17, 1));
				color: #fff;
				display: inline-block;
				margin-right: 66upx;
			}
		}
	}

	.period-radio {
		margin: 30upx;
		padding-right: 100upx;
		width: 95%;
		border-bottom: 1px solid #EFEFEF;

		.period-amount {
			display: inline-block;

			.period-each-charge {
				display: inline-block;
				margin-top: 12upx;
				margin-left: 6upx;
				font-size: 26upx;
				color: #b7b7b7;
				margin-bottom: 13upx;
			}
		}

		.period-each {
			display: block;
		}

		.period-type-radio-item {
			float: right;
		}
	}
</style>
