<template>
	<view class="">
		<!-- 搜索栏 -->
		<view class="categoryView">
			<view class="category">
				<view class="input">
					<input type="text" style="height: 80rpx;" value="" placeholder="搜索商名称" v-model="goodsName"
						@blur='sousuoGoodsName' />
				</view>
				<view class="search" @click="sousuoGoodsName">
					<u-icon name="search" size="40rpx" color="#C8C8C8"></u-icon>
				</view>
			</view>
		</view>

		<view class="content">
			<!-- 分类中心 -->
			<scroll-view scroll-y class="left-aside">
				<view v-for="(item,index) in flist" :key="item.classifyId" class="f-item b-b"
					:class="{active: index === currentIndex}" @click="tabtap(item,index)">
					{{item.classifyName}}
				</view>
			</scroll-view>

			<!-- 商品中心 -->
			<scroll-view v-if="slist.length > 0" scroll-with-animation scroll-y class="right-aside"
				@scrolltolower="update">

				<view v-for="(titem,index) in slist" :key="index" class="s-list" @click="goodsItemTap(titem)">
					<view class="t-list">
						<view class="t-item">
							<view class="shopItem">
								<view class="img">
									<image :src="titem.image"></image>
								</view>
								<view class="info-box">
									<text class="classifyName">{{titem.productName}}</text>
									<view class="price">
										<view>
											<span class="symbol">￥</span>
											<span class="newPrice">{{titem.price}}</span>
											<!-- <span class="newPrice">{{titem.originalPrice}}</span> -->
										</view>
										<!-- <text class="oldPrice">￥{{titem.originalPrice}}</text> -->
									</view>
									<!-- 	<text class="knock">立省￥{{Math.ceil(titem.originalPrice - titem.price)}}</text> -->
									<text class="sales">销量：<text class="num">{{titem.number }}</text>件</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>

			<!-- 没有商品的时候展示 -->
			<view v-else class="emptyOrder-box flex-items-plus flex-column ">
				<!-- <image class="emptyOrder-img" src="../../../static/images/totalAwardEmpty.png"></image> -->
				<label class="font-color-999 fs26 mar-top-30">该分类没有商品～</label>
			</view>
		</view>
		<wxauth v-bind:showauth="showauth" @after-auth="authsucc" @stop-auth="stopauth"></wxauth>
	</view>
</template>
<script>
	const NET = require('../../../utils/request')
	const API = require('../../../config/api');
	import {
		getCurUserid // 获取用户id
	} from '@/api/common.js';
	import {
		getCurShopid
	} from '@/api/common.js';
	import wxauth from '@/components/wxauth.vue'
	export default {
		components:{
			wxauth
		},
		data() {
			return {
				showauth: false,
				sizeCalcState: false,
				tabScrollTop: 0,
				currentIndex: 0, //当前选中的分组
				currentId: '', //当前分组的id
				pageSize: 10, //一页10条
				page: 1, //当前页
				//分类列表
				flist: [],
				// 商品列表
				slist: [],
				shopid: 0, //当前商家的id

				goodsName: '', //商品名称
				isChaXun: false, //是否查询商品
			}
		},
		onLoad() {
			this.loadData()
			// 获取分享点击次数
			this.getsumdj("分类", "", "/pages/tabbar/category/index")
			wx.showShareMenu({
				withShareTicket: true,
				//设置下方的Menus菜单，才能够让发送给朋友与分享到朋友圈两个按钮可以点击
				menus: ["shareAppMessage", "shareTimeline"]
			})
		},
		//分享到朋友圈
		onShareTimeline() {
			let _t = this;
			let distributorId = this.$getstorage("distributorId") ?? "";
			let userId = getCurUserid() === undefined ? '' : getCurUserid();
			return {
				title: '分类',
				query: `shareShopId=${this.shopid}&isFXOrder=1&FXUserId=${userId}&shopId=${this.shopid}&salesId=${distributorId}`
				// path: `/pages/homePage/homePage?shareShopId=${this.id}&isFXOrder=1&FXUserId=${userId}&shopId=${this.id}&salesId=${userId}`
			}
		},
		// 分享到朋友
		onShareAppMessage() {
			return this.sharefun()
		},
		onShow() {
			this.shopid = getCurShopid();
		},

		watch: {
			//负责监听的属性
			shopid: {
				// handler就是负责监听,当isH发生改变时就触发
				//第一个参数就是没修改之前,第二个参数就是修改的参数
				handler(newValue, oldValue) {
					console.log(this.isChaXun, 66666);
					if (newValue != oldValue) {
						console.log(this.isChaXun, 7777);
						this.page = 1
						this.flist = []
						// 商品列表
						this.slist = []
						this.loadData()
					}
					console.log(newValue, oldValue, 8888);
					console.log(this.isChaXun, 9999);
				},
			},
		},
		methods: {
			//暂不授权
			stopauth() {
				this.showauth = false;

			},
			// 用户登录后分享
			authsucc(e) {
				//授权成功回调
				if (e.auth) {
					this.showauth = false;
				}
			},
			// 分享朋友圈  朋友
			sharefun() {
				let _t = this;
				let distributorId = this.$getstorage("distributorId") ?? ""
				let userId = getCurUserid() === undefined ? '' : getCurUserid();
				return new Promise((reslove, reject) => {
					//判断是否登录
					NET.request(API.GetUser, {}, 'GET').then(res => {
						console.log(res, '已登录')
						reslove({
							title: '分类',
							path: `/pages/tabbar/category/index?shareShopId=${_t.shopid }&isFXOrder=1&FXUserId=${userId}&shopId=${_t.shopid }&salesId=${distributorId}`
						})
						_t.showauth = false;
					}, res => {
						console.log(res, '未登录')
						reject(res.code)
						uni.showToast({
							title: "请授权后再次操作!",
							icon: "none",
							duration: 2000,
							success(res) {
								console.log(res, "9909");
								_t.showauth = true;
							}
						});
						
					})
				})
			},
			//商品跳转
			gotoGoods(i) {
				console.log(i, 9090)
				uni.navigateTo({
					url: `/pages_category_page3/merchants/goodsDetails?shopId=${i.shopId}&productId=${i.productId}&terminal=2&skuId=${i.skuId}`
				})
			},

			//获取分组
			loadData() {
				uni.showLoading({
					title: '加载中...'
				})
				//获取当前商家id
				let _shopid = getCurShopid();
				this.shopid = _shopid;
				NET.request(API.FindShopCategory, {
					shopId: _shopid,
				}, 'GET').then(res => {
					this.flist = res.data
					if (this.currentIndex == undefined || this.currentIndex == 0) {
						this.currentIndex = 0;
					}
					this.currentId = this.flist[this.currentIndex].classifyId
					uni.hideLoading()
					// this.page = 1
					this.gainShopList()
				}).catch(res => {
					uni.hideLoading()
				})
			},

			// 获取商品列表
			gainShopList(i = 0) {
				//let oldCurrentId = this.currentId
				uni.showLoading({
					title: '加载中...'
				})
				let data = {
					page: this.page,
					pageSize: this.pageSize,
					shopGroupId: this.currentId,
					shopId: this.shopid,
					productName: this.goodsName,
				}
				// let newUrl =
				// 	`${API.GetProductByGroup}?page=${this.page}&pageSize=${this.pageSize}&shopGroupId=${this.currentId}&shopId=${this.shopid}&productName=${this.goodsName}`
				//获取商品列表
				console.log(this.currentIndex)
				NET.request(API.GetProductByGroup, data, "GET").then(res => {
					uni.hideLoading()
					if (i) {
						this.slist = this.slist.concat(res.data.list)
					} else {
						this.slist = res.data.list
					}
					//uni.removeStorageSync('myshopName')
				})
			},

			//一级分类点击
			tabtap(item, index) {
				if (this.currentIndex == index) {
					return;
				}
				this.slist = []
				this.currentId = item.classifyId;
				this.currentIndex = index
				this.page = 1
				this.gainShopList();
			},

			//下一页请求
			update() {
				this.page++
				this.gainShopList(1);
			},

			//商品搜索
			sousuoGoodsName() {
				console.log(this.goodsName)
				this.gainShopList();
			},


			navToList(sid, tid) {
				uni.navigateTo({
					url: `../../../pages_category_page1/goodsModule/goodsList?category3Id=${tid}`
				})
			},

			//每个商品的触发的事件,跳转页面
			goodsItemTap(item) {
				uni.navigateTo({
					url: `/pages_category_page3/merchants/goodsDetails?shopId=${item.shopId}&productId=${item.productId}&skuId=${item.skuId}&myfrom=0`
				})

			}
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		/* background-color: #f8f8f8; */
	}

	.content {
		display: flex;
	}

	.left-aside {
		flex-shrink: 0;
		width: 200upx;
		height: 100vh;
		background-color: #fff;
		/* border-right: solid 1px #ddd; */
		background-color: #F6F6F6;
	}

	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100rpx;
		font-size: 28upx;
		color: $font-color-base;
		position: relative;

		&.active {
			color: #1A954E;
			background-color: #FFF;

			&:before {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				height: 40upx;
				width: 8upx;
				background-color: $base-color;
				border-radius: 0 4px 4px 0;
				opacity: .8;
				/* margin-left: 10rpx; */
			}
		}
	}

	.right-aside {
		flex: 1;
		padding-left: 20upx;
		background: #fff;
		height: 100vh;
	}

	.s-item {
		display: flex;
		align-items: center;
		height: 70upx;
		padding-top: 8upx;
		font-size: 28upx;
		color: $font-color-dark;
	}

	.t-list {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12upx;

		&:after {
			content: '';
			flex: 99;
			height: 0;
		}
	}

	.t-item {
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		font-size: 26upx;
		color: #666;
		padding-bottom: 20upx;

		.img {
			width: 200rpx;
			height: 200rpx;
			margin-right: 10px;
			border: 1rpx #e6e6e6 solid;

			image {
				width: 100%;
				height: 100%;
				border-radius: 6rpx;
			}
		}

	}

	.emptyOrder-box {
		margin-left: 180upx;

		.emptyOrder-img {
			width: 200upx;
			height: 200upx;
		}
	}

	.shopItem {
		width: 550rpx;
		display: flex;
		justify-content: space-between;

		.info-box {
			width: 350rpx;
			display: flex;
			flex-direction: column;
			margin-let: 20rpx;
			padding-right: 25rpx;

			.classifyName {
				font-size: 32rpx;
				/* padding-right: 12px; */
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
			}

			.price {
				margin: 15rpx 0;
				display: flex;
				align-items: flex-end;

				.symbol {
					font-size: 22rpx;
				}

				.newPrice {
					color: red;
					font-size: 32rpx;
				}

				.oldPrice {
					margin-left: 20rpx;
					text-decoration: line-through;
					font-size: 22rpx;
				}


			}

			.knock {
				font-size: 26rpx;
			}

			.sales {
				margin-top: 10rpx;
				font-size: 24rpx;

				.num {
					color: #209A53;
					font-size: 34rpx;
				}
			}
		}
	}

	.categoryView {
		height: 130rpx;
		margin: 0 auto;
		display: flex;
		justify-content: center;
		align-items: center;

		.category {
			width: 700rpx;
			display: flex;
			align-items: center;
			background-color: #EEE;
			border-radius: 50rpx;


			.input {
				height: 80rpx;
				line-height: 80rpx;
				width: 680rpx;
				padding-left: 30rpx;
			}

			.search {
				margin-right: 30rpx;
			}
		}
	}
</style>