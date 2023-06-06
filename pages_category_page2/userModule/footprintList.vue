<template>
	<view class="footprint-box">
		<view v-if="!tipsShow">
			<view class="wid function-box">
				<view class="finishbox" @click="finishClick" v-if="allCheckShow">完成</view>
				<view v-else class="flex-row-plus editicon-box flex-items fs28" @click="editClick">
					<image class="editicon" src="../../static/images/collectionEditicon.png"></image>
					<label class="mar-left-10">编辑</label>
				</view>
			</view>
			<view class="swipe-box" v-for="(ditem, findex) in footprintList" :key="findex" >
				<view class="daytime">
					<label class="mar-left-30">{{ditem.createTime}}</label>
				</view>
				<u-swipe-action :show="item.show" :index="index"
					v-for="(item, index) in ditem.products" :key="item.footprintId"
					@click="click(index,findex)" @open="open(index,findex)"
					:options="options"
				>
					<view class="">
						<view @click.stop="toGoodsDetails(item.productId,item.shopId,item.skuId)" class="item u-border-bottom wid flex-row-plus flex-items">
							<view v-show="allCheckShow" class="selectIconBox">
								<image v-if="item.selected == 1" @click.stop="footItemSel(index,findex,0)" src="../../static/images/selectActive.png" class="cart-select-img"></image>
								<image v-else @click.stop="footItemSel(index,findex,1)" src="../../static/images/selectEmpty.png" class="cart-select-img"></image>
							</view>
							<image class="product-img" mode="aspectFill" :src="item.image" />
							<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
							<view class="title-wrap mar-left-20">
								<text class="title u-line-2">{{ item.productName }}</text>
								<view class="flex-column-plus font-color-FF7800 flex-row">
									<label class="fs22">¥</label>
									<label class="fs24 mar-left-5">{{item.price}}</label>
								</view>
								<label class="font-color-999 discountsPriceLine fs24">¥{{item.originalPrice}}</label>
							</view>
						</view>
					</view>
				</u-swipe-action>
			</view>
			<view v-show="allCheckShow" class="allcheck-box flex-row-plus flex-sp-between flex-items">
				<view class="left">
					<image v-if="isAllCheck" src="../../static/images/selectActive.png" class="cart-select-img" @click="allSel(0)"></image>
					<image v-else src="../../static/images/selectEmpty.png" class="cart-select-img" @click="allSel(1)"></image>
					<text>全选</text>
				</view>
				<view class="right">
					<view class="btn-delete" @click="footprintDel">删除</view>
				</view>
			</view>
			<view v-if="allCheckShow" class="pad-bot-140"></view>
		</view>
		<view v-else class="mar-top-60 empty-box" @click="goToIndex">
			<image class="footprint-empty" src="../../static/images/footprintEmpty.png"></image>
			<view class="tohome-box flex-items-plus">去首页逛逛</view>
		</view>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		data() {
			return {
				allCheckShow:false,
				isAllCheck:false,
				disabled: false,
				btnWidth: 180,
				show: false,
				options: [
					{
						text: '删除',
						style: {
							backgroundColor: '#F15C48'
						}
					}
				],
				page:1,
				pageSize:5,
				loadingType:0,
				footprintList:[],
				footEmpty:false,
				newTimeArr:[],
        tipsShow: false
			};
		},
		onLoad() {
			this.getFootprintList()
		},
		onReachBottom(){
			if(this.loadingType == 1){
				uni.stopPullDownRefresh()
			}else{
				this.page = this.page+1
				this.getFootprintList()
			}
		},
		methods:{
			//去商品详情
			toGoodsDetails(productId,shopId,skuId){
				uni.navigateTo({
					url:'/pages_category_page3/merchants/goodsDetails?productId='+productId+'&shopId='+shopId+'&skuId='+skuId
				})
			},
			//删除
			footprintDel(){
				this.isAllCheck = false
				let ids = []
				this.footprintList.forEach((value,index)=>{
					value.products.forEach((value1,index1)=>{
						if(value1.selected == 1){
							ids.push(value1.productId)
						}
					})
				})
				NET.request(API.deleteFootprint,{
					ids:ids,
					times:this.newTimeArr
				}, 'POST').then(res => {
					this.footEmpty = true
					this.page = 1
					this.pageSize = 5
					this.getFootprintList()
					setTimeout(function(){
						uni.showToast({
							title: "删除成功",
							duration: 2000,
							icon: 'none',
						});
					},2000)
				}).catch(res => {
					this.$u.toast(`删除失败`);
				})
			},
			footItemSel(index,findex,number){
				this.footprintList[findex].products[index].selected = number
				let footSelectNum = 0
				let footprintListlen = 0
				let footDataTime = []
				this.footprintList.forEach((value,index1)=>{
					value.products.forEach((value, index) => {
						if(value.selected == 0){
							this.isAllCheck = false
						}else{
							footSelectNum++
							footDataTime[index1] = this.footprintList[index1].createTime
						}
					})
				})
				this.newTimeArr = footDataTime.filter(d=>d)
				this.footprintList.forEach((value,index)=>{
					value.products.forEach((value , index) => {
						footprintListlen++
					})
				})
				if(footprintListlen == footSelectNum){
					this.isAllCheck = true
				}
			},
			getFootprintList(){
				if(this.footEmpty == true){
					this.footprintList = []
					this.footEmpty = false
				}
				uni.showLoading({
					  title: '加载中...',
				})
				let shopId = uni.getStorageSync('curshopid')
				NET.request(API.getFootprintList,
				{
					page:this.page,
					pageSize:this.pageSize,
					shopId
				},
				'GET').then(res => {
					if(res.data.length == 0){
						this.loadingType = 1
						this.page = this.page
					}else{
						this.footprintList = this.footprintList.concat(res.data.list)
					}
					if(this.footprintList.length === 0) {
					  this.tipsShow = true
          }
					uni.hideLoading()
				}).catch(res => {
					uni.hideLoading()
					uni.showToast({
						title:'浏览足迹查询失败',
						icon:"none"
					})
				})
			},
			click(index,findex) {
				let ids = this.footprintList[findex].products[index].productId
				let times = this.footprintList[findex].createTime
				this.cancelFootprin(ids,times)
				this.footprintList[findex].products.splice(index, 1);
				this.$u.toast(`删除成功`);
			},
			cancelFootprin(ids,times){
				NET.request(API.deleteFootprint,{
					ids:[ids],
					times:[times]
				}, 'POST').then(res => {
				}).catch(res => {
					uni.showToast({
						title:'失败',
						icon:"none"
					})
				})
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index,findex) {
				this.footprintList[findex].products[index].show = true;
				this.footprintList[findex].products.map((val, idx) => {
					if(index != idx) this.footprintList[findex].products[idx].show = false;
				})
			},
			//全选
			allSel(type) {
				this.isAllCheck = !this.isAllCheck
				this.footprintList.forEach((value,index1)=>{
					value.products.forEach((value , index) => {
						value.selected = type
						if(type == 1){
							this.newTimeArr[index1] = this.footprintList[index1].createTime
						}
					})
				})
			},
			editClick(){
				this.allCheckShow = true
			},
			finishClick(){
				this.allCheckShow = false
			},
      goToIndex() {
        uni.switchTab({
          url:'/pages/tabbar/index/index'
        })
      }
		}
	}
</script>

<style lang="scss">
.footprint-box{
	.function-box{
		background-color: #FFFFFF;
	}
	.editicon-box{
		display: flex;
		justify-content: flex-end;
		position: relative;
		left: -30rpx;
		padding: 16rpx 0;
	}
	.finishbox{
		display: flex;
		justify-content: flex-end;
		position: relative;
		left: -30rpx;
		padding: 16rpx 0;
	}
	.editicon{
		width: 30rpx;
		height: 30rpx;
	}
	.swipe-box{
		.daytime{
			width: 100%;
			height: 80rpx;
			background-color: #F7F7F7;
			line-height: 80rpx;
		}
		.item {
			display: flex;
			padding: 20rpx;
      .selectIconBox {
        margin-right: 14upx;
      }
		}
		.product-img{
			width: 180rpx;
			flex: 0 0 180rpx;
			height: 180rpx;
			border-radius: 12rpx;
		}
		.head-img{
			width: 80rpx;
			flex: 0 0 80rpx;
			height: 80rpx;
			border-radius: 50%;
		}
		.title {
			text-align: left;
			font-size: 28rpx;
			color: $u-content-color;
			margin-top: 20rpx;
		}
		.cart-select-img {
		  width: 98upx;
		  height: 98upx;
		  padding: 30upx;
		  box-sizing: border-box;
		}
    // #ifdef MP-ALIPAY
    .cart-select-img {
      width: 49upx;
      height: 49upx;
      padding: 15upx;
      box-sizing: border-box;
    }
    // #endif
		.toStore{
			border: 1rpx #FF7800 solid;
			color: #FF7800;
			padding: 0rpx 20rpx;
			border-radius: 5rpx;
			height: 52rpx;
		}
	}
	.allcheck-box{
		background-color: #FFFFFF;
		padding: 10rpx 0;
		width: 100%;
		position: fixed;
		bottom: 0upx;
		.left {
		  display: flex;
		  flex-direction: row;
		  align-items: center;
		  font-size: 28upx;
		  color: #666;
		  .cart-select-img {
		    width: 98upx;
		    height: 98upx;
		    padding: 30upx;
		    box-sizing: border-box;
		  }
		}
		.right {
		  display: flex;
		  flex-direction: row;
		  align-items: center;
		  padding: 0 30upx 0 0;
		  box-sizing: border-box;
		}
		.btn-delete {
		  width: 150upx;
		  height: 60upx;
		  line-height: 60upx;
		  text-align: center;
		  border: 1px solid #ff7911;
		  border-radius: 40upx;
		  font-size: 28upx;
		  color: #ff7911;
		}
	}
	.footprint-empty{
		width: 270rpx;
		height: 270rpx;
	}
	.empty-box{
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		.tohome-box{
			color: #FF7800;
			border: 1rpx solid #FF7800;
			width: 240rpx;
			height: 70rpx;
			margin-top: 50rpx;
		}
	}
}
</style>
