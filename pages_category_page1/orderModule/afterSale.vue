<!-- 售后列表 -->
<template>
	<view>
		<view class="content">
			<view class="order-list-box">
				<view v-if="FindReturnData.total>0">
					<view class="item" v-for="item in FindReturnDatalist">
						<view class="order-list-top">
							<view class="top-l" @click="goShop(item.shopId)">
								<image :src="item.shopLogo" class="shop-img"></image>
								<text class="shop-name">{{item.shopName}}</text>
								<image src="../../static/images/arrowRight.png" class="arrow-img"></image>
							</view>
							<view class="top-r">
								<image src="../../static/images/afterSaleTuikuan.png" class="order-status-img"></image>
								<text class="order-status">{{item.afterType==1?'退款':'退货'}}</text>
							</view>
						</view>
						<view class="order-info-box" v-for="(itemlist,index) in item.skus" :key="index">
							<view class="order-info" @click="goodsDetails(item.shopId,itemlist.productId,itemlist.skuId)">
								<view class="order-info-item">
									<image :src="itemlist.image" class="product-img"></image>
									<view class="info-box">
										<text class="product-name">{{itemlist.productName}}</text>
										<view class="product-sku">{{itemlist.value}}</view>
										<view class="price-sku-box">
											<text class="product-price">退款：<text class="fuhao">￥</text>{{itemlist.total}}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="total-price-box">
							<!-- 退款 -->
							<view v-if='item.afterType==1'>
								<text class="total-price-l" v-if="item.afterState == 1">审核中</text>
								<text class="total-price-l" v-if="item.afterState == 2">退款中</text>
								<text class="total-price-l" v-if="item.afterState == 4">退款完成</text>
								<text class="total-price-l" v-if="item.afterState == 5">退款失败</text>
								<text class="total-price-l" v-if="item.afterState == 6">审核不通过</text>
								<text class="total-price-l" v-if="item.afterState == 7">评审中</text>
								<text class="total-price-l" v-if="item.afterState == 9">撤销申请</text>
								<text class="total-price-l" v-if="item.afterState == 10">审核通过</text>
							</view>
							<!-- 退货 -->
							<view v-if='item.afterType==2'>
								<text class="total-price-l" v-if="item.afterState == 1">退货审核中</text>
								<text class="total-price-l" v-if="item.afterState == 3">退货中</text>
								<text class="total-price-l" v-if="item.afterState == 4">已退款</text>
								<text class="total-price-l" v-if="item.afterState == 2">退款中</text>
								<text class="total-price-l" v-if="item.afterState == 5">退款失败</text>
								<text class="total-price-l" v-if="item.afterState == 6">审核不通过</text>
								<text class="total-price-l" v-if="item.afterState == 7">评审中</text>
								<text class="total-price-l" v-if="item.afterState == 8">退货完成，拒绝退款</text>
								<text class="total-price-l" v-if="item.afterState == 9">撤销申请</text>
								<text class="total-price-l" v-if="item.afterState == 10">审核通过</text>
							</view>
							<text class="total-price-r mar-left-30" v-if="item.afterState != 0 || item.afterState != 6">申请金额 ¥ {{item.price}}</text>
						</view>
						<!-- 退款 -->
						<view class="order-btn-box" v-if='item.afterType==1'>
							<text class="btn l" v-if="(item.afterType==1 && item.afterState == 1 || item.returnType==2 && item.afterState == 6)" @click="cancelRefundTap(item)">撤销退款</text>
							<text class="btn l" @click="gotoDetails(item)">查看详情</text>
						</view>
						<!-- 退货 -->
						<view class="order-btn-box" v-if='item.afterType==2'>
							<!-- <text class="btn l" v-if="(item.afterType==2 && item.afterState == 1 || item.afterType==2 && item.afterState == 10 || item.afterState == 6)" @click="cancelRefundTaphuo(item)">撤销退货</text> -->
							<text class="btn l" @click="gotoDetailshuo(item)">查看详情</text>
						</view>
					</view>
				</view>
				<view v-else class="emptyCart-box flex-items-plus flex-column">
					<image class="emptyCart-img" src="../../static/img/bgnull.png"></image>
					<label class="font-color-999 fs26 mar-top-30">这里空空如也~</label>
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
				FindReturnData:[],
				moneyReturnId:{
					id:''
				},
				sellPriceitem:'',
				FindReturnDatalist:[],
				page:1,//当前页
				pageSize:20,//每页记录数
				loadingType:0,
			}
		},
		onLoad(){
			this.getFindReturn()
		},
    onUnload() {
      // #ifdef MP-WEIXIN
        this.back();
      // #endif
    },
		onBackPress(e) {
			if (e.from === 'navigateBack') {
			  console.log(1)
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
				this.getFindReturn()
			}
		},
		methods: {
			goodsDetails(shopId,productId,skuId){
				uni.navigateTo({
					url:'/pages_category_page3/merchants/goodsDetails?shopId='+shopId + '&productId='+productId +'&skuId='+skuId
				})
			},
			goShop(shopId){
				uni.navigateTo({
					url: '../store/index?storeId=' + shopId
				})
			},
			back(){
        console.log(2)
				uni.switchTab({
					url:'../../pages/tabbar/user/index'
				});
			},
			// 获取售后列表数据
			getFindReturn() {
				uni.showLoading({
					title:'加载中...'
				})
				NET.request(API.FindReturnList, {
					page: this.page,
					pageSize:this.pageSize,
				}, 'GET').then(res => {
					uni.hideLoading()
					if(res.data.list.length == 0){
						this.loadingType = 1
						this.page = this.page
					}
					this.FindReturnDatalist = this.FindReturnDatalist.concat(res.data.list)
					this.FindReturnData = res.data
				}).catch(res => {
					uni.hideLoading()

				})
			},
			// 撤销申请
			cancelRefundTap(item){
				this.Delete(item)
			},
			// 退款
			Delete(item){
				uni.showLoading({
					title:'正在撤销退款...'
				})
				NET.request(API.CancelRefund, {
					afterId:item.afterId,
					orderId:item.orderId
				}, 'POST').then(res => {
					uni.hideLoading()
					uni.showToast({
						title:'撤销成功',
						icon:'none',
						duration:2000
					})
					setTimeout(() => {
					  this.page = 1
					  this.FindReturnDatalist = []
					  this.getFindReturn()
					}, 2500);
				}).catch(res => {
					uni.hideLoading()
				})
			},
			// 撤销退货
			cancelRefundTaphuo(item){
				this.Deletehuo(item)
			},
			// 退货
			Deletehuo(item){
				NET.request(API.CancelReturnGoods, {
					afterId:item.afterId,
					orderId:item.orderId
				}, 'POST').then(res => {
					uni.showToast({
						title:'撤销成功',
						icon:'none',
						duration:2000
					})
					setTimeout(() => {
					  this.page = 1
					  this.FindReturnDatalist = []
					  this.getFindReturn()
					}, 2500);

				}).catch(res => {
				})
			},
			// 退款查看详情
			gotoDetails(item){
				uni.navigateTo({
					url:'refundDetails?item=' + JSON.stringify(item)
				})
			},
			// 退货查看详情
			gotoDetailshuo(item){
				uni.navigateTo({
					url:'returnDetails?item=' + JSON.stringify(item)
				})
			}

		}
	}
</script>

<style lang="less" scoped>
	page {
		background-color: #F7F7F7;
	}

	.emptyCart-box {
		margin-top: 70upx;

		.emptyCart-img {
			width: 270upx;
			height: 270upx;
		}
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

	.top-r {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.order-status-img {
		width: 30upx;
		height: 30upx;
		margin-right: 8upx;
	}

	.order-status {
		font-size: 28upx;
		color: #333;
		font-weight: 500;
	}

	.order-info-box {
		padding: 0 30upx;
		box-sizing: border-box;
	}

	.order-info {}

	.order-info-item {
		display: flex;
		flex-direction: row;
		padding: 20upx 0;
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
		font-size: 28upx;
		color: #999;
	}

	.total-price-box {
		background: #EEEEEE;
		font-size: 26upx;
		color: #333;
		border-radius: 10upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 70upx;
		line-height: 70upx;
	}

	.total-price-l {
		width: 170upx;
		margin-left: 40upx;
		font-size: 30upx;
		color: #333;
	}

	.total-price-r {
		text-align: left;
	}

	.order-btn-box {
		padding: 30upx 0;
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

	.order-btn-box .btn.l {
		border: 1px solid #bbb;
		color: #333;
	}

	/* .order-btn-box .btn.r {
  border: 1px solid #ff7911;
  color: #ff7911;
} */
</style>
