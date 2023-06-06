<template>
	<view class="collection-box">
		<view class="tabsbox">
			<u-tabs :list="collectionTypeList" bar-width="60" :bold="false" active-color="#00AA49" inactive-color="#999999"
			 :is-scroll="false" :current="collectionTypeFlag" @change="collectionTypeActive"></u-tabs>
		</view>
		<view v-if="collectionTypeFlag == 0">
			<view v-if="productCollect.length>0">
				<view class="wid function-box">
					<view class="finishbox" @click="finishClick" v-if="allCheckShow">完成</view>
					<view v-else class="flex-row-plus editicon-box flex-items fs28" @click="editClick">
						<image class="editicon" src="../../static/images/collectionEditicon.png"></image>
						<text class="mar-left-10">编辑</text>
					</view>
				</view>
				<view class="swipe-box">
					<u-swipe-action :show="item.show" :index="index"
						v-for="(item, index) in productCollect" :key="item.collectId"
						@click="productClick" @open="productOpen"
						:options="options"
					>
						<view class="flex-item" @click.stop="toGoodsDetails(item.productId,item.shopId,item.skuId)">
							<view class="item u-border-bottom wid flex-row-plus flex-items">
								<view v-show="allCheckShow">
									<image mode="aspectFill" v-if="item.selected == 1" @click.stop="productItemSel(index,0)" src="../../static/images/selectActive.png" class="cart-select-img"></image>
									<image mode="aspectFill" v-else @click.stop="productItemSel(index,1)" src="../../static/images/selectEmpty.png" class="cart-select-img"></image>
								</view>
								<image  class="product-img" mode="aspectFill" :src="item.image" />
								<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
								<view class="title-wrap mar-left-20">
									<text class="title u-line-2">{{ item.productName }}</text>
									<view class="flex-column-plus font-color-FF7800 flex-row">
										<text class="fs22">¥</text>
										<text class="fs24 mar-left-5">{{item.price}}</text>
									</view>
									<text class="font-color-999 discountsPriceLine fs24">¥{{item.originalPrice}}</text>
								</view>
							</view>
						</view>
					</u-swipe-action>
				</view>
				<view v-if="allCheckShow" class="pad-bot-140"></view>
				<view v-show="allCheckShow" class="allcheck-box flex-row-plus flex-sp-between flex-items">
					<view class="left">
						<image mode="aspectFill" v-if="isAllProCheck" src="../../static/images/selectActive.png" class="cart-select-img" @click="allProductSel(0)"></image>
						<image mode="aspectFill" v-else src="../../static/images/selectEmpty.png" class="cart-select-img" @click="allProductSel(1)"></image>
						<text>全选</text>
					</view>
					<view class="right">
						<view class="btn-delete" @click="paoductDel">删除</view>
					</view>
				</view>
				<view v-if="allCheckShow" class="pad-bot-140"></view>
			</view>
			<view v-else class="mar-top-60 empty-box">
				<image class="collect-empty" src="../../static/images/collectEmpty.png"></image>
				<view class="tohome-box flex-items-plus">暂无收藏</view>
			</view>
		</view>
		<view v-if="collectionTypeFlag == 1">
			<view v-if="storeCollect.length>0">
				<view class="finishbox" @click="finishClick" v-if="allCheckShow">完成</view>
				<view v-else class="flex-row-plus editicon-box flex-items fs28" @click="editClick">
					<image class="editicon" src="../../static/images/collectionEditicon.png"></image>
					<text class="mar-left-10">编辑</text>
				</view>
				<view class="swipe-box">
					<u-swipe-action :show="item.show" :index="index"
						v-for="(item, index) in storeCollect" :key="item.collectId"
						@click="storeClick" @open="storeOpen"
						:options="options"
					>
						<view class="item u-border-bottom flex-items">
							<view class="flex-row-plus flex-sp-between flex-items-plus wid">
								<view class="flex-items-plus flex-row pad-topbot-10">
									<view v-show="allCheckShow">
										<image mode="aspectFill"  v-if="item.selected == 1" @click.stop="storeItemSel(index,0)" src="../../static/images/selectActive.png" class="cart-select-img"></image>
										<image mode="aspectFill"  v-else @click.stop="storeItemSel(index,1)" src="../../static/images/selectEmpty.png" class="cart-select-img"></image>
									</view>
									<image class="head-img" mode="aspectFill" :src="item.shopLogo" />
									<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
									<view class="title-wrap mar-left-20">
										<text class="title u-line-2">{{ item.shopName }}</text>
										<text class="font-color-999 fs24">{{item.person}}人关注</text>
									</view>
								</view>
								<view class="toStore flex-items-plus fs24" @click="toStoreClick(item.shopId)">进入门店</view>
							</view>
						</view>
					</u-swipe-action>
				</view>
				<view v-show="allCheckShow" class="allcheck-box flex-row-plus flex-sp-between flex-items">
					<view class="left">
						<image mode="aspectFill" v-if="isAllStoreCheck" src="../../static/images/selectActive.png" class="cart-select-img" @click="allStoreSel(0)"></image>
						<image mode="aspectFill" v-else src="../../static/images/selectEmpty.png" class="cart-select-img" @click="allStoreSel(1)"></image>
						<text>全选</text>
					</view>
					<view class="right">
						<view class="btn-delete" @click="shopDel">删除</view>
					</view>
				</view>
				<view v-if="allCheckShow" class="pad-bot-140"></view>
			</view>
			<view v-else class="mar-top-60 empty-box">
				<image class="collect-empty" src="../../static/images/collectEmpty.png"></image>
				<view class="tohome-box flex-items-plus">暂无收藏</view>
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
				collectionTypeList: [{
					name: '商品'
				}],
				collectionTypeFlag: 0,
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
				isAllProCheck:false,
				isAllStoreCheck:false,
				allCheckShow:false,
				productCollect:[],
				storeCollect:[],
				productPage:1,
				productPageSize:10,
				proloadingType:0,
				storePage:1,
				storePageSize:10,
				storeloadingType:0,
			};
		},
		onLoad() {
			this.getProductCollect()
			this.getStoreCollect()
		},
		onReachBottom(){
			if(this.collectionTypeFlag == 0){
				if(this.proloadingType == 1){
					uni.stopPullDownRefresh()
				}else{
					this.productPage = this.productPage+1
					this.getProductCollect()
				}
			}else if(this.collectionTypeFlag == 1){
				if(this.storeloadingType == 1){
					uni.stopPullDownRefresh()
				}else{
					this.storePage = this.storePage+1
					this.getStoreCollect()
				}
			}
		},
		methods:{
			//批量删除
			paoductDel(){
				let ids = []
				this.productCollect.forEach((value,index)=>{
					if(value.selected == 1){
						ids.push(value.collectId)
					}
				})
				NET.request(API.deleteCollect,{
					ids:ids
				}, 'POST').then(res => {
					this.productCollect = []
					this.$u.toast(`删除成功`);
					this.getProductCollect()
				}).catch(res => {
					this.$u.toast(`删除失败`);
				})
			},
			shopDel(){
				let ids = []
				this.storeCollect.forEach((value,index)=>{
					if(value.selected == 1){
						ids.push(value.collectId)
					}
				})
				NET.request(API.deleteCollect,{
					ids:ids
				}, 'POST').then(res => {
					this.storeCollect = []
					this.$u.toast(`删除成功`);
					this.getStoreCollect()
				}).catch(res => {
					this.$u.toast(`删除失败`);
				})
			},
			//去门店
			toStoreClick(storeId){
				uni.navigateTo({
					url:'../../pages_category_page1/store/index?storeId='+storeId
				})
			},
			//去商品详情
			toGoodsDetails(productId,shopId,skuId){
				uni.navigateTo({
					url:'/pages_category_page3/merchants/goodsDetails?productId='+productId+'&shopId='+shopId+'&skuId='+skuId
				})
			},
			collectionTypeActive(index) {
				this.collectionTypeFlag = index
				if(index==0){
					this.productPage = 1
					this.productCollect = []
					this.proloadingType = 0
					this.getProductCollect()
				}else if(index==1){
					this.storePage = 1
					this.storeCollect = []
					this.storeloadingType = 0
					this.getStoreCollect()
				}
			},
			productClick(index, index1) {
				if(index1 == 0) {
					let ids = this.productCollect[index].collectId
					this.cancelCollect(ids)
					this.productCollect.splice(index, 1);
					this.$u.toast(`删除成功`);
				}
			},
			storeClick(index, index1) {
				if(index1 == 0) {
					let ids = this.storeCollect[index].collectId
					this.cancelCollect(ids)
					this.storeCollect.splice(index, 1);
					this.$u.toast(`删除成功`);
				}
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			productOpen(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.productCollect[index].show = true;
				this.productCollect.map((val, idx) => {
					if(index != idx) this.productCollect[idx].show = false;
				})
			},
			storeOpen(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.storeCollect[index].show = true;
				this.storeCollect.map((val, idx) => {
					if(index != idx) this.storeCollect[idx].show = false;
				})
			},
			//商品选中
			productItemSel(index,number){
				this.productCollect[index].selected = number
				let proSelectNum = 0
				this.productCollect.forEach((value,index)=>{
					if(this.productCollect[index].selected == 0){
						this.isAllProCheck = false
					}else{
						proSelectNum++
					}
				})
				if(this.productCollect.length == proSelectNum){
					this.isAllProCheck = true
				}
			},
			//门店选中
			storeItemSel(index,number){
				this.storeCollect[index].selected = number
				let storeSelectNum = 0
				this.storeCollect.forEach((value,index)=>{
					if(this.storeCollect[index].selected == 0){
						this.isAllStoreCheck = false
					}else{
						storeSelectNum++
					}
				})
				if(this.storeCollect.length == storeSelectNum){
					this.isAllStoreCheck = true
				}
			},
			//全选
			allProductSel(type) {
				this.isAllProCheck = !this.isAllProCheck
			    this.productCollect.forEach((value,index)=>{
					this.productCollect[index].selected = type
			    })
			},
			allStoreSel(type) {
				this.isAllStoreCheck = !this.isAllStoreCheck
			    this.storeCollect.forEach((value,index)=>{
					this.storeCollect[index].selected = type
			    })
			},
			editClick(){
				this.allCheckShow = true
			},
			finishClick(){
				this.allCheckShow = false
			},
			//收藏商品查询
			getProductCollect(){
				NET.request(API.getProductCollect,
				{
					page:this.productPage,
					pageSize:this.productPageSize
				},
				'GET').then(res => {
					if(res.data.list.length == 0){
						this.proloadingType = 1
						this.productPage = this.productPage
					}else{
						console.log(this.productCollect,222)
						this.productCollect = this.productCollect.concat(res.data.list)
						this.productCollect.forEach((value , index) => {
							value['show'] = false
							value['selected'] = 0
						})
					}
				}).catch(res => {
					uni.showToast({
						title:'收藏商品查询失败',
						icon:"none"
					})
				})
			},
			//收藏门店查询
			getStoreCollect(){
				NET.request(API.getStoreCollect,
				{
					page:this.storePage,
					pageSize:this.storePageSize
				},
				'GET').then(res => {
					if(res.data.list.length == 0){
						this.storeloadingType = 1
						this.storePage = this.storePage
					}
					this.storeCollect = this.storeCollect.concat(res.data.list)
					this.storeCollect.forEach((value , index) => {
						value['show'] = false
						value['selected'] = 0
					})
				}).catch(res => {
					uni.showToast({
						title:'失败',
						icon:"none"
					})
				})
			},
			//取消收藏
			cancelCollect(ids){
				NET.request(API.cancelCollect,{
					ids:[ids]
				}, 'POST').then(res => {
				}).catch(res => {
					uni.showToast({
						title:'失败',
						icon:"none"
					})
				})
			}
		}
	}
</script>

<style lang="scss">
page{background-color: #F7F7F7;}
.collection-box{
	.empty-box{
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		.tohome-box{
			color:#999999;
			margin-top: 50rpx;
		}
		.collect-empty{
			width: 270rpx;
			height: 270rpx;
		}
	}
	.function-box{
		background-color: #F7F7F7;
	}
	.tabsbox{
		margin-top: 4rpx;
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
		.item {
			display: flex;
			padding: 20rpx;
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
		  width: 50upx;
		  height: 50upx;
		  margin: 0upx 30upx 0upx;
		  box-sizing: border-box;
		}
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
		    width: 50upx;
		    height: 50upx;
			margin: 30upx;
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
		  border: 1px solid #00AA49;
		  border-radius: 40upx;
		  font-size: 28upx;
		  color: #ff7911;
		}
	}
}
</style>
