<template>
	<view class="content">
		<!-- 输入数量的弹框 -->
		<view class="numPopup" v-show="isMyPopup">
			<view class="popupBox">
				<view class="fontBox">请输入商品数量</view>
				<view>
					<u-input v-model="goodsNum"
						 :clearable='false' placeholder='数量'
						></u-input>
				</view>
				<view class="buttonBox">
					<u-button type="success" size='mini' @click="quxiaoNum">取消</u-button>
					<u-button type="success" size='mini' @click="quedingNum">确定</u-button>
				</view>
			</view>
		</view>
		<!-- 购物车 -->
		<view v-if="dataList.length>0">
			<view class="cart-bg">
				<view class="cart-num-box">
					<text class="num-box">共<text class="num">{{allNum}}</text>件宝贝</text>
					<text class="btn-box" @click="btnTypeClick(1)" v-if="btnType == 0">管理</text>
					<text class="btn-box" @click="btnTypeClick(0)" v-if="btnType == 1">完成</text>
				</view>
			</view>
			<view class="cart-list-box">
				<view v-for="(item, index) in dataList" :key="item.shopId">
					<view class="item">
						<view class="shop-box" v-if="false">
							<image mode="aspectFill" v-if="item.selected == 1"
								src="../../../static/images/selectActive.png" class="cart-select-img"
								@click="updateShopSel(index,0)"></image>
							<image mode="aspectFill" v-else src="../../../static/images/selectEmpty.png"
								class="cart-select-img" @click="updateShopSel(index,1)"></image>
							<view class="shop-name-box" @click="goStore(index)">
								<image src="../../../static/images/orderStoreIcon.png" class="shop-img"></image>
								<text class="shop-name">{{item.shopName}}</text>
								<image src="../../../static/img/user/arrow.png" class="arrow-right-img"></image>
							</view>
						</view>
						<view v-for="(skuItem, cIndex) in dataList[index].skus" class="product-list-box">
							<view class="pro-item" @click="goodsDateils(item.shopId,skuItem.productId,skuItem.skuId)">
							
								<image mode="aspectFill" v-if="skuItem.selected == 1"
									src="../../../static/images/selectActive.png"
									@click.stop="cartItemSel(index,cIndex,0)" class="cart-select-img"></image>
								<image mode="aspectFill" v-else src="../../../static/images/selectEmpty.png"
									@click.stop="cartItemSel(index,cIndex,1)" class="cart-select-img"></image>
								<view class="pro-r">
									<image :src="skuItem.image" class="pro-img"></image>
									<view class="pro-r-r">
										<view class="pro-name">{{skuItem.productName}}</view>
										<view class="sku-box">
											<text v-if="skuItem.value">{{skuItem.value}}</text>
											<text v-else>默认规格</text>
											<image v-if="false" src="../../../static/images/arrowDown.png"
												class="arrow-down-img"></image>
										</view>
										<view class="pro-price-num-box">
											<view class="pro-price-box">
												<text class="fuhao">￥</text>
												<text>{{skuItem.price}}</text>
											</view>
											<view class="pro-num-box">
												<text class="num-btn r"
													@click.stop="numSub(index,cIndex,skuItem)">-</text>
												<text class="num" @click.stop="showPopup(index,cIndex,skuItem)">{{skuItem.number}}</text>
												
											
											<!-- 	<u-input :value="skuItem.number" 
													style="display: inline-block; width: 80rpx;font-size: 16rpx;"
													input-align='center' :clearable='false' placeholder='数量'
													@input.stop='numImport(index,cIndex,skuItem,$event)'></u-input> -->
							
													
												<text class="num-btn l"
													@click.stop="numAdd(index,cIndex,skuItem)">+</text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- #ifdef H5 -->
			<view class="cart-bottom-box-h5">
				<!-- #endif -->
				<!-- #ifndef H5 -->
				<view class="cart-bottom-box-app">
					<!-- #endif -->
					<view class="cart-bottom">
						<view class="left">
							<image mode="aspectFill" v-if="isAllCheck" src="../../../static/images/selectActive.png"
								class="cart-select-img" @click="allSel(0)"></image>
							<image mode="aspectFill" v-else src="../../../static/images/selectEmpty.png"
								class="cart-select-img" @click="allSel(1)"></image>
							<text>全选</text>
						</view>
						<view class="right" v-if="btnType == 0">
							<view class="price-box">
								<text>合计：</text>
								<text class="price">¥{{checkMoney}}</text>
							</view>
							<!-- <view class="btn-confirm" @click="settlementTap" >结算（{{checkNum}}）</view> -->
							<button class="btn-confirm" @click="settlementTap">结算（{{checkNum}}）</button>
						</view>
						<view class="right" v-if="btnType == 1">
							<view class="btn-delete" @click="cartDel">删除</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 购物车为空 -->
			<view v-else class="emptyCart-box flex-items-plus flex-column">
				<image class="emptyCart-img" src="../../../static/images/cartEmpty.png"></image>
				<label class="font-color-999 fs26 mar-top-30">你的购物车还没有宝贝哦</label>
				<label class="font-color-999 fs26 mar-top-10">快去首页选一个吧～</label>
			</view>

			<wxauth v-bind:showauth="showauth" @after-auth="authsucc" @stop-auth="stopauth"></wxauth>

		</view>
</template>

<script>
	const NET = require('../../../utils/request')
	const API = require('../../../config/api')
	import {
		getCurShopid,getCurUserid
	} from '@/api/common.js';
	import wxauth from '@/components/wxauth.vue'
	export default {
		data() {
			return {
				goodsNum:0,//数量
				isMyPopup:false, //控制数量弹出框
				goodsItem:{},//该商品信息
				showauth: false,
				title: 'Hello',
				btnType: 0,
				dataList: [],
				goosDetailshowFlag: false,
				colorActiveId: 1,
				colorList: [{
					id: 1,
					color: '复古蓝色'
				}, {
					id: 2,
					color: '马卡龙粉色'
				}],
				modelNumActiveId: 1,
				modelNumList: [{
					id: 1,
					modelNum: '小号'
				}, {
					id: 2,
					modelNum: '中号'
				}, {
					id: 3,
					modelNum: '大号'
				}],
				skuItemList: [],
				buyNum: 1,
				allNum: 0,
				checkNum: 0,
				checkMoney: 0,
				isAllCheck: true,
				skuProdList: {},
				item: {}
			}
		},
		components: {
			wxauth,
			
		},
		onLoad() {
			// 获取点击次数
			   this.getsumdj("个人中心","","/pages/tabbar/cart/index");
			wx.showShareMenu({
				withShareTicket:true,
				//设置下方的Menus菜单，才能够让发送给朋友与分享到朋友圈两个按钮可以点击
				menus:["shareAppMessage","shareTimeline"]
			})
		},
		onShow() {
			//判断是否登录
			let item = {}
			NET.request(API.GetUser, {}, 'GET').then(res => {
				console.log(res,'已登录')
				this.showauth = false; //授权
				item = uni.getStorageSync('storage_key');
				this.getDataList()
			}, res => {
				console.log(res,'未登录')
				this.showauth = true;
			})
		},
		
		//分享到朋友圈
		onShareTimeline(res) {
			let distributorId = this.$getstorage("distributorId")??""
			let userId = getCurUserid() === undefined ? '' : getCurUserid();
			let shopId = getCurShopid()
		    return {
				title: '购物车',
				query:`FXUserId=${userId}&shopId=${shopId}&salesId=${distributorId}`
				// path: `/pages/tabbar/user/index?shopId=${shopId}&salesId=${userId}`,
			}
		},
		// 分享到朋友
		onShareAppMessage() {
			let distributorId = this.$getstorage("distributorId")??""
			let userId = getCurUserid() === undefined ? '' : getCurUserid();
			let shopId = getCurShopid()
			return {
				title: '购物车',
				path: `/pages/tabbar/cart/index?FXUserId=${userId}&shopId=${shopId}&salesId=${distributorId}`,
			}
		},
		
		methods: {
			showPopup(index,cIndex,skuItem){
				this.goodsItem.index = index
				this.goodsItem.cIndex = cIndex
				this.goodsItem.skuItem = skuItem
				this.goodsNum = this.goodsItem.skuItem.number
				this.isMyPopup = true
				console.log(this.goodsItem,'商品信息')
			},
			quxiaoNum(){
				this.isMyPopup = false
				this.goodsItem = {}
			},
			quedingNum(){
				let myNumber = parseInt(this.goodsNum)
				if(myNumber >= 1 && myNumber < this.goodsItem.skuItem.stockNumber){
					this.updateCart(this.goodsItem.skuItem.skuId, myNumber)
					this.goodsItem.skuItem.number = myNumber
				}else{
					this.updateCart(this.goodsItem.skuItem.skuId, 1)
					this.goodsItem.skuItem.number = 1
					wx.showToast({
						title: '至少选择一件哦',
						duration:1000,
						icon: 'none'
					})
				}
				this.isMyPopup = false
				this.goodsItem = {}
			},
			stopauth() {
				this.showauth = false;
				uni.switchTab({
					url: "../../../pages/homePage/homePage"
				})
			},
			authsucc(e) {
				//授权成功回调
				if (e.auth) {
					this.showauth = false;
					this.getDataList()
				}
			},
			//逛门店
			goStore(index) {
				uni.navigateTo({
					url: '../../../pages_category_page1/store/index?storeId=' + this.dataList[index].shopId
				})
			},
			//商品详情
			goodsDateils(shopId, productId, skuId) {
				uni.navigateTo({
					url: '/pages_category_page3/merchants/goodsDetails?shopId=' + shopId +
						'&productId=' + productId + '&skuId=' + skuId
				})
			},
			btnTypeClick(type) {
				this.btnType = type
			},
			getDataList() {
				let shopId = uni.getStorageSync('curshopid')
				wx.showLoading({
					title: '加载中...',
				})
				NET.request(API.ShoppingCart, {
					shopId
				}, 'GET').then(res => {
					wx.hideLoading()
					this.dataList = res.data
					this.allNum = this.dataList.length
					this.updateMoneyAndNum()
				}).catch(res => {
					wx.hideLoading()
				})
			},
			// 数量减
			numSub(index, cIndex, item) {
				if (this.dataList[index].skus[cIndex].number > 1) {
					this.dataList[index].skus[cIndex].number = this.dataList[index].skus[cIndex].number - 1
					this.updateCart(this.dataList[index].skus[cIndex].skuId, this.dataList[index].skus[cIndex].number)
				} else {
					uni.showToast({
						title: '亲！至少一件哦！',
						icon: "none"
					})
				}
			},
			//输入框
			numImport(index, cIndex, item, e) {
				let _val = e;
				if(_val==undefined || _val==""){
					_val=1;
				}
				console.log(e,992929)
				this.dataList[index].skus[cIndex].number =parseInt( _val);
				if (this.dataList[index].skus[cIndex].number >= 1 && this.dataList[index].skus[cIndex].number < item
					.stockNumber) {
					this.updateCart(this.dataList[index].skus[cIndex].skuId, this.dataList[index].skus[cIndex].number)

				} else {
					console.log(_val, 789789)
					this.dataList[index].skus[cIndex].number = 1
					wx.showToast({
						title: '输入的数量不规范！',
						duration: 2000,
						icon: 'none'
					})

				}
				//}

			},
			// 数量加
			numAdd(index, cIndex, item) {
				console.log(index, cIndex, '按钮监听')
				if (this.dataList[index].skus[cIndex].number < item.stockNumber) {
					this.dataList[index].skus[cIndex].number = this.dataList[index].skus[cIndex].number + 1
					this.updateCart(this.dataList[index].skus[cIndex].skuId, this.dataList[index].skus[cIndex].number)
				} else {
					wx.showToast({
						title: '库存不足！',
						icon: 'none'
					})
				}
			},
			updateMoneyAndNum() {
				this.isAllCheck = true
				this.allNum = 0
				this.checkNum = 0
				this.checkMoney = 0
				let len = this.dataList.length
				for (let i = 0; i < len; i++) {
					let len2 = this.dataList[i].skus.length
					for (let j = 0; j < len2; j++) {
						let item = this.dataList[i].skus[j]
						this.allNum += item.number
						if (item.selected == 1) {
							this.checkNum++
							this.checkMoney += parseFloat(item.price * item.number)
						} else {
							if (this.isAllCheck) {
								this.isAllCheck = false
							}
						}
					}
				}
				this.checkMoney = parseFloat(this.checkMoney.toFixed(10))
			},
			updateShopSel(index, type) {
				let shopCarts = [{
					shopId: '',
					skus: []
				}]
				this.dataList[index].selected = type
				let len = this.dataList[index].skus.length
				for (let i = 0; i < len; i++) {
					this.dataList[index].skus[i].selected = type
					var skusobj = {};
					skusobj["skuId"] = this.dataList[index].skus[i].skuId;
					skusobj["selected"] = this.dataList[index].skus[i].selected
					shopCarts[0].skus.push(skusobj);
				}
				shopCarts[0].shopId = this.dataList[index].shopId

				this.updateSelected(shopCarts)
			},
			//选中商品
			updateSelected(shopCarts) {
				this.updateMoneyAndNum()
				NET.request(API.SelectedCart, {
					shopCarts
				}, 'POST').then(res => {}).catch(res => {

				})
			},
			updateCart(skuId, number) {
				NET.request(API.UpdateNumberCart, {
					skuId: skuId,
					number: number
				}, 'POST').then(res => {
					this.updateMoneyAndNum()
				}).catch(res => {

				})
			},
			cartItemSel(index, cIndex, type) {
				let shopCarts = [{
					shopId: 0,
					skus: []
				}]
				this.dataList[index].skus[cIndex].selected = type
				if (type == 1) {
					let len = this.dataList[index].skus.length
					let shopType = 1
					for (let i = 0; i < len; i++) {
						if (this.dataList[index].skus[i].selected == 0) {
							shopType = 0
							break
						}
					}
					this.dataList[index].selected = shopType
				} else {
					this.dataList[index].selected = type
				}

				shopCarts[0].shopId = this.dataList[index].shopId
				var skusobj = {};
				skusobj["skuId"] = this.dataList[index].skus[cIndex].skuId;
				skusobj["selected"] = this.dataList[index].skus[cIndex].selected
				shopCarts[0].skus.push(skusobj);
				this.updateSelected(shopCarts)
			},
			//全选
			allSel(type) {
				this.updateAllSel(type)
			},
			updateAllSel(type) {
				let len = this.dataList.length
				for (let i = 0; i < len; i++) {
					let len2 = this.dataList[i].skus.length
					this.dataList[i].selected = type
					for (let j = 0; j < len2; j++) {
						this.dataList[i].skus[j].selected = type
					}
				}
				let shopCarts = []
				this.updateSelected(shopCarts)
			},
			//点击删除
			cartDel() {
				if (!this.checkNum) {
					uni.showToast({
						title: '请先选择对应商品',
						icon: 'none'
					})
					return;
				}
				uni.showModal({
					title: '温馨提示',
					content: '您确定要删除所选中的商品吗？',
					success: res => {
						if (res.confirm) {
							this.doDelete()
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			//删除购物车
			doDelete() {
				let cartList = []
				let n = 0
				let skus = []
				let len = this.dataList.length
				for (let i = 0; i < len; i++) {
					let item = {}
					let len2 = this.dataList[i].skus.length

					for (let j = 0; j < len2; j++) {
						let itemGoods = this.dataList[i].skus[j]
						if (itemGoods.selected == 1) {
							skus[n] = itemGoods.skuId
							n = n + 1
						}
					}
				}
				NET.request(API.DeleteCart, {
					ids: skus
				}, 'POST').then(res => {
					this.getDataList()

				}).catch(res => {

				})

			},
			//结算购物车
			settlementTap() {
				if (!this.checkNum) {
					wx.showToast({
						title: '请先选择对应商品',
						icon: 'none'
					})
					return;
				}
				console.log(this.dataList, 222)
				let addCart = []
				let len = this.dataList.length
				for (let i = 0; i < len; i++) {
					let shopObj = {}
					shopObj["shopId"] = this.dataList[i].shopId
					shopObj["skus"] = []
					let len2 = this.dataList[i].skus.length
					for (let j = 0; j < len2; j++) {
						let skusObj = {}
						skusObj["ifLogistics"] = this.dataList[i].skus[j].ifLogistics
						skusObj["number"] = this.dataList[i].skus[j].number
						skusObj["selected"] = this.dataList[i].skus[j].selected
						skusObj["skuId"] = this.dataList[i].skus[j].skuId
						shopObj.skus.push(skusObj)
					}
					addCart.push(shopObj)
				}
				let newArray = []
				addCart.forEach((item, index) => {
					newArray[index] = item
					newArray[index].skus = item.skus.filter((item) => {
						return item.selected == 1
					})
					if (item.skus.length == 0) {
						newArray.splice(index, 1);
					}
				})
				newArray = newArray.filter(d => d)
				uni.setStorageSync('skuItemDTOList', newArray)
				uni.navigateTo({
					url: '../../../pages_category_page1/orderModule/orderConfirm?type=2'
				})
			},
			//商品尺寸弹窗
			goosDetailshowClick(storeId, skuItemId) {
				this.goosDetailshowFlag = true
				this.colorActiveClick(storeId, skuItemId)
			},
			//颜色选中事件
			colorActiveClick(storeId, attrItemId) {
				this.colorActiveId = attrItemId
				NET.request(API.QueryProductSku, {
					productId: storeId,
					skuValueIdList: [attrItemId]
				}, 'POST').then(res => {
					if (res.code === 0) {
						this.skuProdList = res.data
						this.skuProdId = res.data.id
						this.skuImg = res.data.skuImg
						this.skuNameStr = res.data.skuNameStr
						this.skuPrice = res.data.skuPrice
					}

				}).catch(res => {

				})
			},
		}
	}
</script>

<style lang="scss">
	.numPopup{
		
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate3d(-50%,-50%,0);
		width: 100%;
		height:100%;
		// height: calc(100% - 300rpx);
		background-color:rgba(0, 0, 0, 0.4);
		// border-radius: 30rpx;
		z-index: 9999;
		.popupBox{
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			border-radius: 10rpx;
			width: 360rpx;
			height: 280rpx;
			background-color: #ffffff;
			margin: 0 auto;
			margin-top: 50%;
			padding: 50rpx;
			.fontBox{
				font-weight: 600;
			}
			.buttonBox{
				display: flex;
				width: 100%;
				flex-direction: row;
				justify-content: space-between;
			}
		}
	}
	page {
		// background: #f7f7f7;
	}

	.content {
		padding: 0 0 110upx;
		overflow: hidden;

		.cart-bg {
			width: 100%;
			height: 230upx;
			background: linear-gradient(180deg, rgba(0, 199, 83, 1.0), rgba(0, 170, 73, 1));
			border-radius: 0 0 40upx 40upx;

			.cart-num-box {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;

				.num-box {
					padding: 30upx 0 30upx 30upx;
					box-sizing: border-box;
					font-size: 30upx;
					color: #fff;
				}

				.btn-box {
					font-size: 30upx;
					color: #fff;
					padding: 30upx;
					box-sizing: border-box;
					display: inline-block;
				}
			}
		}

		.cart-list-box {
			margin-top: -130upx;
			padding: 0 30upx;
			box-sizing: border-box;

			.item {
				background: #fff;
				border-radius: 10upx;
				margin-bottom: 20upx;

				.shop-box {
					display: flex;
					flex-direction: row;
					align-items: center;
					border-bottom: 1px solid #eee;

					.cart-select-img {
						width: 40upx;
						height: 40upx;
						margin: 30upx;
						box-sizing: border-box;
					}

					.shop-name-box {
						display: flex;
						flex-direction: row;
						align-items: center;

						.shop-img {
							width: 36upx;
							height: 36upx;
							margin-right: 10upx;
						}

						.shop-name {
							font-size: 30upx;
							color: #333;
							font-weight: bold;
							display: inline-block;
							margin-left: 10upx;
						}

						.arrow-right-img {
							width: 30upx;
							height: 30upx;
							box-sizing: border-box;
							margin-left: 30upx;
						}
					}
				}

				.product-list-box {
					.pro-item {
						display: flex;
						flex-direction: row;
						align-items: center;

						.cart-select-img {
							width: 40upx;
							height: 40upx;
							margin: 30upx;
							box-sizing: border-box;
						}

						.pro-r {
							flex: 1;
							border-bottom: 1px solid #eee;
							display: flex;
							flex-direction: row;
							padding: 30upx 30upx 30upx 0;
							box-sizing: border-box;
							overflow: hidden;

							.pro-img {
								width: 180upx;
								height: 180upx;
								border-radius: 10upx;
								margin-right: 30upx;
							}

							.pro-r-r {
								flex: 1;
								font-size: 26upx;
								color: #333;
								overflow: hidden;
								display: flex;
								flex-direction: column;
								justify-content: space-between;

								.pro-name {
									height: 66upx;
									line-height: 33upx;
									display: -webkit-box;
									overflow: hidden;
									text-overflow: ellipsis;
									word-break: break-all;
									-webkit-box-orient: vertical;
									-webkit-line-clamp: 2;
								}

								.sku-box {
									width: 100%;
									height: 40upx;
									background: #f0f0f0;
									border-radius: 4upx;
									display: flex;
									flex-direction: row;
									align-items: center;
									justify-content: space-between;
									padding: 0 0 0 10upx;
									box-sizing: border-box;
									font-size: 24upx;
									color: #999;

									.arrow-down-img {
										width: 40upx;
										height: 40upx;
										padding: 10upx;
										box-sizing: border-box;
									}
								}

								.pro-price-num-box {
									display: flex;
									flex-direction: row;
									align-items: center;
									justify-content: space-between;

									.pro-price-box {
										font-size: 36upx;
										color: #ff7911;
										font-weight: 400;

										.fuhao {
											font-size: 24upx;
										}
									}

									.pro-num-box {
										width: 140rpx;
										// height: 66rpx;
										height: 50rpx;
										border: 1px solid #ddd;
										border-radius: 4rpx;
										display: flex;
										flex-direction: row;
										justify-content: space-between;

										.num-btn {
											font-size: 34rpx;
											
											color: #666;
											display: inline-block;
											width: 40rpx;
											text-align: center;
											line-height: 50rpx;
											//line-height: 66rpx;
										}

										.num-btn.r {
											border-right: 1px solid #ddd;
										}

										.num-btn.l {
											border-left: 1px solid #ddd;
										}

										.num {
											font-size: 26upx;
											color: #333;
											line-height: 50rpx;
										}
									}
								}
							}
						}
					}

					.pro-item:last-of-type .pro-r {
						border-bottom: none;
					}
				}
			}
		}

		.emptyCart-box {
			margin-top: 70upx;

			.emptyCart-img {
				width: 270upx;
				height: 270upx;
			}
		}

		.cart-bottom-box-h5 {
			position: fixed;
			bottom: 100upx;
			width: 100%;
		}

		.cart-bottom-box-app {
			position: fixed;
			bottom: 0upx;
			width: 100%;
		}

		.cart-bottom {
			height: 110upx;
			background: #fff;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			border-top: 1upx solid #eee;
		}

		.left {
			display: flex;
			flex-direction: row;
			align-items: center;
			font-size: 28upx;
			color: #666;

			.cart-select-img {
				width: 40upx;
				height: 40upx;
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

			.price-box {
				font-size: 30upx;
				color: #333;

				.price {
					color: #ff7911;
					font-weight: bold;
				}
			}

			.btn-confirm {
				width: 215upx;
				height: 80upx;
				background: linear-gradient(90deg, rgba(0, 207, 86, 1.0), rgba(0, 170, 73, 1));
				border-radius: 40upx;
				margin-left: 18upx;
				text-align: center;
				line-height: 80upx;
				font-size: 28upx;
				color: #fff;
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

		.goosDetailshow-box {
			.detailImg-box {
				margin-top: 30upx;
				margin-left: 30upx;
				border-radius: 10upx;
				border-bottom: 1upx solid #EDEDED;
				padding-bottom: 20upx;
				width: 690upx;

				.detailImg {
					width: 180upx;
					height: 180upx;
				}
			}

			.color-box {
				padding: 30upx 30upx;
				border-bottom: 1upx solid #EDEDED;
				width: 690upx;

				.colorName-box {
					display: flex;
					flex-wrap: wrap;
					flex-direction: row;
					justify-content: flex-start;
					align-items: center;
					margin-top: 30upx;
					margin-left: -30upx;

					.colorName-on {
						background-color: #FFE5D0;
						color: #FF7800;
						margin-left: 30upx;
						padding: 10upx 32upx;
						border-radius: 28upx;
						border: 1upx solid #FF7800;
						font-size: 26upx;
						text-align: center;
						z-index: 1;
					}

					.colorName {
						background-color: #F5F5F5;
						margin-left: 30upx;
						padding: 10upx 32upx;
						border-radius: 28upx;
						font-size: 26upx;
						z-index: 2;
					}
				}

			}

			.modelNum-box {
				padding: 30upx 30upx;
				border-bottom: 1upx solid #EDEDED;
				width: 690upx;

				.modelNumName-box {
					display: flex;
					flex-wrap: wrap;
					flex-direction: row;
					justify-content: flex-start;
					align-items: center;
					margin-top: 30upx;
					margin-left: -30upx;

					.modelNumName-on {
						background-color: #FFE4D0;
						color: #FF7800;
						margin-left: 30upx;
						padding: 10upx 32upx;
						border-radius: 28upx;
						border: 1upx solid #FF7800;
						font-size: 26upx;
						text-align: center;
					}

					.modelNumName {
						background-color: #F5F5F5;
						margin-left: 30upx;
						padding: 10upx 32upx;
						border-radius: 28upx;
						font-size: 26upx;
					}
				}
			}

			.goodsNum-box {
				padding: 30upx 30upx;
				width: 690upx;
				padding-bottom: 268upx;

				.goodsNumber {
					border: 1upx solid #999999;
					padding: 3upx 20upx;
				}

				.subtract {
					border: 1upx solid #999999;
					padding: 3upx 20upx;
					margin-right: -1rpx;
				}

				.add {
					border: 1upx solid #999999;
					padding: 3upx 20upx;
					margin-left: -1rpx;
				}
			}

			.goosDetailbut-box {
				.joinShopCartBut {
					width: 343upx;
					height: 80upx;
					border-radius: 40upx 0 0 40upx;
					background-color: #FFC300;
					color: #FFFEFE;
					font-size: 28upx;
					line-height: 80upx;
					text-align: center;
					margin-left: 30upx;
				}

				.buyNowBut {
					width: 343upx;
					height: 80upx;
					border-radius: 0 40upx 40upx 0;
					background-color: #FF6F00;
					color: #FFFEFE;
					font-size: 28upx;
					line-height: 80upx;
					text-align: center;
				}
			}
		}
	}
</style>
