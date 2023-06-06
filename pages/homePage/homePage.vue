<template>
	<view class="container">
		<!-- 门店首页 -->
		<view style="border: 1rpx rgb(0,174,70) solid; background-color: rgb(0,174,70);">
			<view class="warp" style="width: 93%;margin: 0 auto;">
				<view class="shopInfo">
					<view class="shopLogo">
						<image :src="shopItim.shopLogo" class="image"></image>
					</view>
					<view class="shopBase">
						<view class="shopTitle">{{shopItim.shopName}}</view>
						<view class="shopAddress">{{ shopItim.shopAddress}}</view>
					</view>
					<view class="qiehuanBox">
						<view v-if="isSwitchover" class="switchStore" @click="inquireShop">切换门店</view>
						<u-icon name="map-fill" size="60rpx" color="#029640" @click="handleNavigation"></u-icon>
					</view>
				</view>
			</view>
		</view>

		<!-- 轮播图 -->
		<view class="uni-padding-wrap mybanner" v-if="slideshowList && slideshowList.length && slideshowList.length>0">
			<view class="page-section swiper">
				<swiper class="swiper" indicator-dots :interval="3000" autoplay :duration="500" circular>
					<swiper-item v-for="item in slideshowList" :key='item.id' style=" border-radius: 30rpx;">
						<u-image class="b" width="100%" height="100%" :src="item.imgurl" @click="particulars(item)"
							mode="scaleToFill"></u-image>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<!--  :autoplay='isAutoplay' -->
		<!-- 视频轮播图 -->
		<!-- #ifdef MP -->
		<view class="uni-padding-wrap mybanner" v-if="videoList && videoList.length && videoList.length>0">
			<view class="page-section swiper">
				<swiper class="swiper" style="height: 400rpx;" indicator-dots :interval="3000" :duration="500" circular
					:autoplay='isAutoplay' @change='videoChange'>
					<swiper-item v-for="(item,index) in videoList" :key='item.id' style=" border-radius: 30rpx;">
						<video style="width: 710rpx;height: 400rpx;" objectFit="fill" :show-fullscreen-btn='false'
							:src="videoindex==index?item.imgurl:''" controls :muted='item.muted'
							auto-pause-if-navigate="true" @play="playvideo($event,index)"
							@pause='pausevideo($event,index)'></video>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<!-- #endif -->

		<!-- 优惠券 -->
		<view class="my-yhq-style" v-if="ticketList.length >= 1">
			<scroll-view class="scroll-view_H " scroll-x="true" scroll-left="120">
				<view class="scroll-view-item_H" v-for="(item,index) in ticketList" :key="index">
					<view class="item-head-text"><i>券</i></view>
					<view class="item-foot">
						<view class="item-foot-aaaa">
							<view class="item-foot-left">
								<image class="item-foot-img" :src="item.giftpic" v-if='item.couponType == 3'></image>
								<view class="item-foot-zou" v-if='item.couponType == 1'>￥{{item.couponContent}}</view>
								<view class="item-foot-zou" v-if='item.couponType == 2'>{{item.couponContent}}折</view>
							</view>
							<view class="item-foot-text">{{item.content}}</view>
						</view>
						<view class="item-foot-btn-warp" @click="lingqu(item)">
							<view class="ifb">立即</view>
							<view class="ifb">领取</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="content" v-if="id !== ''">
			<view class="shop-info-box">
				<view v-if="activeTab=== 'index'">
					<canvas-page :terminal="terminal" :typeId="3" :shopId="id" :myCanvas='watchCanvas'></canvas-page>
				</view>
				<view v-else>
					<view class="shop-banner-box" v-if="bannerInfo && bannerInfo.length > 0">
						<swiper indicator-dots="true">
							<swiper-item v-for="(item, index) in bannerInfo" :key="index" @click="applyForRecruit()">
								<image :src="item.bannerImage" class="shop-banner-img"></image>
							</swiper-item>
						</swiper>
					</view>
					<view class="shop-list-content">
						<block v-if='isShowGoods'>
							<view class="shop-list-nav">
								<view class="nav-item-sort" @click="sortTap(1)">
									<text :class="{'active' : sortIndex == 1}">新品</text>
								</view>
								<view class="nav-item-sort" @click="sortTap(2)">
									<text :class="{'active' : sortIndex == 2}">价格</text>
									<view class="r">
										<image src="../../static/images/arrowSortUp.png" v-if="type == 1"
											class="arrow-img padd-t"></image>
										<image src="../../static/images/arrowSortDown.png" v-if="type == 2"
											class="arrow-img padd-b"></image>
									</view>
								</view>
								<view class="nav-item-sort" @click="sortTap(3)">
									<text :class="{'active' : sortIndex == 3}">销量</text>
									<view class="r">
										<image src="../../static/images/arrowSortUp.png" v-if="volume == 1"
											class="arrow-img padd-t"></image>
										<image src="../../static/images/arrowSortDown.png" v-if="volume == 2"
											class="arrow-img padd-b"></image>
									</view>
								</view>
							</view>
							<view class="shop-list-box" v-if="total > 0">
								<view class="item" v-for="(cItem, index) in storeInfolist" :key="index"
									@click="goodsItemTap(cItem.productId,cItem.skuId)">
									<image :src="cItem.image" class="product-img"></image>
									<view class="product-bottom-box">
										<text class="product-name">{{cItem.productName}}</text>
										<text class="product-num">销量:{{cItem.number}}</text>
										<view class="product-price-box">
											<text class="price-box"><text class="fuhao">￥</text>{{cItem.price}}</text>
											<text class="price-through">￥{{cItem.originalPrice}}</text>
										</view>
									</view>
								</view>
							</view>
							<view class='empty-container' v-else>
								<image src="/images/kong4.png"></image>
								<text>暂无商品</text>
							</view>
						</block>
					</view>
				</view>
			</view>
		</view>
		<wxauth v-bind:showauth="showauth" @after-auth="authsucc" @stop-auth="stopauth"></wxauth>
	</view>
</template>

<script>
	import qqmapsdk from "@/static/js/qqmap-wx-jssdk.min.js";
	const qqMap = new qqmapsdk({
		key: "3T7BZ-QWVRW-EYMRX-RMH3O-CZWB7-QLFX4"
	})

	const NET = require('../../utils/request')
	const API = require('../../config/api')
	import {
		ticketAll, //获取所有的优惠券
	} from '../../api/shopmanage.js'
	import {
		getdistributorId
	} from "../../utils/auth.js"
	import {
		setCurShopid,
		getCurShopid,
		setPhone,
		getCurUserid, // 获取用户id
	} from '@/api/common.js';
	import {
		wxLogin
	} from "../../api/api.js"
	import canvasPage from '@/components/canvasShow/canvasShowPage.vue'
	import wxauth from '@/components/wxauth.vue'
	export default {
		props: {
			componentContent: {
				type: Object
			}
		},
		data() {
			return {
				inway: "normal",
				myShopInfo: {}, //店铺信息
				isAutoplay: true, //是否让视频轮播图轮播
				goodsItem: {}, //商店列表的第一个店
				isSwitchover: true, //切换店铺的按钮是否展示
				myshopName: '',
				showauth: false,
				slideshowList: [1, 2, 3], //轮播图列表
				videoList: [1, 2, 3], //视频轮播图列表
				videoindex: 0,
				activeTab: 0,
				address: "", //城市名
				shopAdress: '', //当前你的地址
				longitude: 0,
				latitude: 0,
				src: 'https://img2.baidu.com/it/u=1145742942,4055967999&fm=26&fmt=auto&gp=0.jpg',
				defaultShoplogo: "../../static/images/storeLogo.png", //默认商店头像
				shopItim: {
					shopLogo: "",
					shopName: "",
					shopAddress: ""
				},
				navIndex: 0,
				id: '', //商店id
				price: 0,
				storeInfo: {
					number: 0
				},
				classList: [],
				dataList: [],
				isShowGoods: true,
				sortIndex: 0,
				list: [],
				bannerInfo: [],
				total: 0,
				ifNew: 0, //是否新品
				type: 1, //价格排序条件
				volume: 1, //销量排序条件
				page: 1, //当前页
				pageSize: 20, //每页记录数
				classifyId: '',
				loadingType: 0,
				storeInfolist: [],
				isIphone: false,
				activeTab: 'index',
				terminal: API.terminal,
				collectId: 0,
				ifCollect: 0,
				salesId: 0, //分销员id
				ticketFrom: {
					page: 1,
					pageSize: 20,
					state: 1
				}, //查询优惠券的表单
				ticketList: [], //优惠券列表
				watchCanvas: 0,
			}
		},
		components: {
			canvasPage,
			wxauth
		},
		onHide() {
			uni.removeStorageSync('fxGoodsShopId')
		},
		onLoad(options) {
			const _this = this;
			// 获取分享点击次数
			this.getsumdj("首页", "", "/pages/homePage/homePage")

			let _shopid;
			if (options && options.salesId) {
				this.salesId = parseInt(options.salesId);
			}

			// 先判断是不是扫码进入
			if (options && options != "" && options.storeId) {
				//扫码进入
				_shopid = options.storeId;
				if (_shopid && _shopid != "") {
					_this.inway = "scan";
					_this.id = _shopid;
					//设置当前店铺
					setCurShopid(_shopid);
					_this.isSwitchover = false
					_this.initShop();
					return
				}
			}

			// 再判断是不是分享的商品详情进入
			let fxGoodsShopId = uni.getStorageSync('fxGoodsShopId')
			if (fxGoodsShopId != "" && fxGoodsShopId != undefined) {
				//分享的商品详情进入
				_shopid = fxGoodsShopId;
				if (_shopid && _shopid != "") {
					_this.id = _shopid;
					//设置当前店铺
					setCurShopid(_shopid);
					_this.isSwitchover = false
					_this.initShop();
					return
				}
			}
			
			uni.getLocation({
				type: 'gcj02', //返回可以用于uni.openLocation的经纬度
				success: (res) => {
					console.log(res, "res998877");
					_this.latitude = res.latitude;
					_this.longitude = res.longitude;
					if (options && options != "" && options.shareShopId) {
						//点击别人的分享进入   先把分享人的id存起来
						let {
							isFXOrder,
							FXUserId
						} = options
						let FXInfo = {
							isFXOrder,
							FXUserId
						}
						uni.setStorageSync('FXUserInfo', FXInfo)

						_shopid = options.shareShopId;
						if (_shopid && _shopid != "") {
							_this.id = _shopid;
							//设置当前店铺
							setCurShopid(_shopid);
							_this.isSwitchover = false
							_this.initShop();
						}
					} else {
						//正常进入,获取最近的
						_this.getNextShop();
					}
				},
				fail() {
					_this.address = "武汉市"
					_this.shopAdress = "武汉市硚口区汉西三路香江家居A1栋4楼"
					_this.longitude = ""
					_this.latitude = ""
					_this.bindData();
				}
			});

		},
		onShow() {
			//切换门店进入
			let _shopid = uni.getStorageSync("choice_shopid")
			if (_shopid && _shopid != "") {
				this.id = _shopid;
				uni.removeStorageSync("choice_shopid")
			}
			if (this.id && this.id != "") {
				this.initShop();
			}
			// 监听用户是否登录,来调取画布,画布用 watch 监听
			let mycanvas = uni.getStorageSync('storage_key').buyerUserId
			if (mycanvas == undefined) {
				this.watchCanvas = 0
			} else {
				this.watchCanvas = mycanvas
			}

			let fxGoodsShopId = uni.getStorageSync('fxGoodsShopId')
			if (fxGoodsShopId == undefined || fxGoodsShopId == true) {
				if (this.inway != "scan" && this.isSwitchover == false) {
					this.isSwitchover = true;
				}
			}
		},
		onReachBottom() {
			if (this.loadingType == 1) {
				uni.stopPullDownRefresh()
			} else {
				this.page = this.page + 1
				this.getTemplate()
			}
		},
		//分享到朋友圈
		onShareTimeline() {
			let _t = this;
			let distributorId = this.$getstorage("distributorId") ?? "";
			let userId = getCurUserid() === undefined ? '' : getCurUserid();
			return {
				title: '首页',
				query: `shareShopId=${this.id}&isFXOrder=1&FXUserId=${userId}&shopId=${this.id}&salesId=${distributorId}`
				// path: `/pages/homePage/homePage?shareShopId=${this.id}&isFXOrder=1&FXUserId=${userId}&shopId=${this.id}&salesId=${userId}`
			}
		},
		// 分享到朋友
		onShareAppMessage() {
			return this.sharefun()
		},
		methods: {
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
							title: '首页',
							path: `/pages/homePage/homePage?shareShopId=${_t.id}&isFXOrder=1&FXUserId=${userId}&shopId=${_t.id}&salesId=${distributorId}`
						})
						this.showauth = false; //授权
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
						})
					})
				})
			},

			// 领取优惠券
			lingqu(item) {
				const res = uni.getStorageSync('storage_key');
				const token = res.token
				if (token) {
					uni.navigateTo({
						url: `../../pages_category_page1/discount/lingquan?shopCouponId=${item.shopCouponId}&content=${item.content}`
					})
				} else {
					this.showauth = true;
				}
			},
			//导航
			handleNavigation() {
				let data = {
					latitude: this.myShopInfo.latitude, //店铺的纬度
					longitude: this.myShopInfo.longitude, //店铺的经度
					title: this.myShopInfo.shopName, //点击时显示，callout存在时将被忽略
					address: this.myShopInfo.shopAdress, //店铺地址
					iconPath: this.myShopInfo.shopLogo
				};
				console.log(data, '信息')
				uni.setStorageSync('mapInfo', data)
				uni.navigateTo({
					url: `../map/index`
				})
				console.log(this.myShopInfo)
			},
			// 获取最近店铺
			getNextShop() {
				const _this = this;
				qqMap.reverseGeocoder({
					location: {
						latitude: _this.latitude,
						longitude: _this.longitude
					},
					poi_options: 'policy=2;radius=1000;page_size=20;page_index=1',
					get_poi: 1,
					success: (res) => {
						console.log(res, "qqmap reverseGeocoder")
						var cityName = res.result.address_component.city; //获取到的城市名
						_this.address = cityName
						let myTitle = res.result.pois[0].title
						_this.shopAdress = res.result.pois[0].address + myTitle
						_this.longitude = res.result.pois[0].location.lng
						_this.latitude = res.result.pois[0].location.lat
						_this.bindData()
					},
					fail: (res) => {
						console.log(res, "error qqmap reverseGeocoder");
						_this.address = "武汉市"
						_this.shopAdress = "武汉市硚口区汉西三路香江家居A1栋4楼"
						_this.longitude = longitude
						_this.latitude = latitude
						_this.bindData()
					}
				})
			},
			//获取商店列表
			bindData() {
				let cond = {
					"page": 1,
					"pageSize": 20,
					"shopAdress": this.address,
					"longitude": this.longitude,
					"latitude": this.latitude,
					"address": this.shopAdress
				}
				uni.showLoading({
					title: '加载中'
				});
				NET.request(API.GetAlwaysIndex, cond, 'POST').then(res => {
					console.log(res.data, '常购店铺查询')
					this.goodsItem = res.data.shift(); //数组为空的话,就返回 undefined
					uni.hideLoading()
					if (this.goodsItem) {
						if (this.isSwitchover) {
							setCurShopid(this.goodsItem.shopId); //把当前门店id放到storage
							// getdistributorId() // 获取店铺id后取分销员id
							let _shopid = getCurShopid();
							if (_shopid && _shopid != "") {
								this.id = _shopid;
							}
							this.initShop()
						}

					}
					console.log(this.goodsItem, 1111111)
				})
			},
			// 视频轮播图切换
			videoChange(e) {
				this.videoindex = e.target.current
			},
			playvideo(e, index) {
				console.log(e, '播放')
				this.videoList[index].muted = false;
				this.isAutoplay = false
			},
			pausevideo(e, index) {
				console.log(e, '暂停播放')
				this.isAutoplay = true
			},
			//获取所有的轮播图 
			getSlideshowList() {
				NET.request(API.getSlideshow, {
					shopId: this.id
				}, 'GET').then(res => {
					this.slideshowList = res.data
					console.log(res.data, 123456789)
				})
			},
			//获取所有的视频轮播图
			getVideoList() {
				NET.request(API.getVideoList, {
					shopId: this.id
				}, 'GET').then(res => {
					let _d = res.data;
					let _n = []
					_d.forEach(i => {
						i.muted = true;
						_n.push(i);
					})
					this.videoList = _n
				})
			},
			initShop() {
				const _this = this;

				NET.request(API.GetStoreNew, {
					shopId: _this.id
					// shopId:464
				}, 'GET').then(res => {
					this.myShopInfo = res.data //我需要这个接口返回的数据;
					let _data = res.data;
					_this.id = _data.shopId; //门店id
					setCurShopid(_this.id); //把当前门店id放到storage
					setPhone(res.data.chargePersonPhone); //把负责人电话放到storage
					let _shopLogo = _data.shopLogo;
					if (_shopLogo == undefined || _shopLogo == "") {
						_shopLogo = "../../static/images/storeLogo.png";
					}
					_this.shopItim = {
						shopLogo: _shopLogo,
						shopName: _data.shopName,
						shopAddress: _data.shopAdress,
						shopPhone: _data.shopPhone,
						shopId: _data.shopId
					}
					// 获取用户id
					uni.setStorageSync("shopItim", _this.shopItim);
					// 
					_this.getVideoList()
					_this.getSlideshowList()
					
					// 现在是确认收货才建立绑定关系  _this.bindSalesCustomer(_this.salesId, _this.id)
					_this.getTemplate()
					_this.getFindProductGroupList()
					_this.getShopBanner()
					_this.getShopInfo()
					_this.addBusinessBuyerUser();
					_this.getTicketAll()
				})
			},

			//切换门店的按钮
			inquireShop() {
				// #ifdef MP-WEIXIN || APP-PLUS
				let myAddress = {}
				myAddress.shopAdress = this.address //城市
				myAddress.longitude = this.longitude
				myAddress.latitude = this.latitude
				myAddress.address = this.shopAdress //你的当前地址
				uni.setStorageSync('myAddress', myAddress)
				this.$toUrl('/pages/switchStore/switchStore')
				// #endif
			},
			authsucc(e) {
				//授权成功回调
				if (e.auth) {
					this.showauth = false;
				}
			},
			stopauth() {
				//暂不授权
				this.showauth = false;
				// uni.switchTab({
				// 	url:"/pages/tabbar/category/index"
				// })
			},
			//  查询店铺banner
			getShopBanner() {
				NET.request(API.GetShopBanner, {
					shopId: this.id
				}, 'GET').then(res => {
					this.bannerInfo = res.data
				}).catch(res => {})
			},
			//  根据id查询店铺
			getTemplate() {
				let data = {
					shopId: this.id,
					ifNew: this.ifNew,
					type: this.type,
					volume: this.volume,
					page: this.page,
					pageSize: this.pageSize,
					groupId: this.classifyId
				}
				NET.request(API.GetStore, data, 'GET').then(res => {
					console.log(res, 'getTemplate')
					if (res.data.page.list.length == 0) {
						this.loadingType = 1
						this.page = this.page
					}
					this.storeInfo = res.data;
					this.total = res.data.page.total
					this.storeInfolist = this.storeInfolist.concat(res.data.page.list)
				}).catch(res => {
					uni.showToast({
						title: res.data.message,
						duration: 2000,
						icon: 'none'
					});
				})
			},
			// 查询门店分组数据
			getFindProductGroupList() {
				NET.request(API.GetStoreShopClassify, {
					shopId: this.id
				}, 'GET').then(res => {
					this.classList = res.data.filter(item => JSON.stringify(item) !== "{}")
				}).catch(res => {})
			},
			//跳转到商品详情
			goodsItemTap(productId, skuId) {
				wx.navigateTo({
					url: '/pages_category_page3/merchants/goodsDetails?shopId=' + this.id + '&productId=' +
						productId + '&skuId=' +
						skuId
				})
			},
			//点击轮播图跳转到详情
			particulars(item) {
				let skus = JSON.parse(item.pageurl)
				if (item.json == undefined || item.json == '') {
					if (typeof(skus.productId) == "string") {} else {
						if (skus.skuId != undefined && skus.skuId != "") {
							uni.navigateTo({
								url: `/pages_category_page3/merchants/goodsDetails?shopId=${item.shopId}&productId=${skus.productId}&skuId=${skus.skuId}`
							})
						}
					}
				} else {
					uni.setStorageSync('jsonText', item.json)
					uni.navigateTo({
						url: `../../pages_category_page1/goodsModule/jsonText`
					})
				}
			},

			sortTap(index) {
				this.page = 1
				this.storeInfolist = []
				if (index == 1) {
					this.ifNew = this.ifNew != 0 ? 0 : 1,
						this.type = 1,
						this.volume = 1,
						this.sortIndex = index
				} else if (index == 2) {
					this.ifNew = 0,
						this.type = this.type != 1 ? 1 : 2,
						this.volume = 1,
						this.sortIndex = index
				} else if (index == 3) {
					this.ifNew = 0,
						this.type = 1,
						this.volume = this.volume != 1 ? 1 : 2,
						this.sortIndex = index
				}
				this.getTemplate()
			},


			//判断是否已申请成为该门店的分销员
			applyForRecruit() {
				const res = uni.getStorageSync('storage_key');
				const token = res.token
				if (token) {
					let item = {}
					if (uni.getStorageSync('storage_key')) {
						item = uni.getStorageSync('storage_key');
					}
					if (JSON.stringify(item) == '{}') {} else {
						NET.request(API.HasApply, {
							shopId: this.id
						}, 'GET').then(res => {
							if (res.data.distributorId == undefined) {
								uni.navigateTo({
									url: '../distributionModule/recruit?shopId=' + this.id
								})
							} else if (res.data.state === 1) {
								uni.showToast({
									title: "您已申请成为该门店的分销员",
									icon: "none"
								})
							} else {
								uni.showToast({
									title: "您的申请正在审核中，请稍后查看",
									icon: "none"
								})
							}
						}).catch(res => {})
					}
				} else {
					uni.showToast({
						title: '请先登录',
						duration: 1500,
						icon: "none"
					})
				}
			},
			//绑定关系
			bindSalesCustomer(salesId, storeId) {
				if (salesId && storeId) {
					//如果已登录，静默绑定客户关系，否则跳转到登录页面
					if (uni.getStorageSync('storage_key')) {
						NET.request(API.BindSalesCustomer, {
							shopId: storeId,
							distributorId: salesId
						}, 'POST').then(res => {
							// uni.showToast({
							// 	title: "绑定成功",
							// 	icon: "none"
							// })
						}).catch(res => {
							uni.showToast({
								title: res.data.msg,
								icon: "none"
							})
						})
					} else {
						uni.setStorageSync('salesId', salesId)
						uni.setStorageSync("shopId", storeId)
						// uni.navigateTo({
						// 	url: '../../pages_category_page2/userModule/login'
						// })
					}
				}
			},
			// 获取门店信息
			getShopInfo() {
				var _this = this;
				NET.request(API.getShopIndex + `?shopId=${this.id}`, null,
					'GET').then(function(res) {
					_this.ifCollect = res.data.ifCollect;
					_this.collectId = res.data.collectId;
				}).catch(function(res) {
					uni.showToast({
						title: '失败',
						icon: "none"
					});
				});
			},
			// 成为商家的客户
			addBusinessBuyerUser() {
				NET.request(API.AddBusinessBuyerUser, {
					shopId: this.id
				}, "POST")
			},
			// 获取优惠券
			getTicketAll() {
				let newobj = {
					...this.ticketFrom
				}
				newobj.shopId = this.id
				ticketAll(newobj).then(res => {
					this.ticketList = res.data.list
					console.log(res, '优惠券列表')
				})
			},

		}
	}
</script>

<style lang='scss' scoped>
	.my-yhq-style {
		padding: 20rpx;
	}

	.scroll-view_H {
		white-space: nowrap;
		width: 100%;
	}

	.scroll-view-item_H {
		display: inline-block;
		vertical-align: baseline;
		width: 400rpx;
		height: 150rpx;
		background-color: rgba(167, 225, 192, 0.5);
		margin-right: 20rpx;
		position: relative;
		border-radius: 20rpx;
		overflow: hidden;
	}

	/* 券字的定位 */
	.item-head-text {
		width: 50rpx;
		height: 50rpx;
		font-size: 20rpx;
		text-align: center;
		line-height: 50rpx;
		background-color: rgba(0, 170, 73, 0.8);
		border-radius: 50%;
		position: absolute;
		right: 150rpx;
		top: 20rpx;
		color: #FFFFFF;
	}

	/* 小三角的定位 */
	.item-head-xiao {
		width: 0;
		height: 0;
		border-top: 25rpx solid transparent;
		border-left: 50rpx solid rgba(167, 225, 192, 0.5);
		border-bottom: 25rpx solid transparent;
		position: absolute;
		right: 80rpx;
		top: 20rpx;
	}

	.item-foot {
		display: flex;
		align-items: center;
		width: 400rpx;
		height: 150rpx;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.item-foot-aaaa {
		width: 270rpx;
		height: 150rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.item-foot-left {
		width: 180rpx;
		height: 85rpx;
		position: relative;
	}

	.item-foot-img {
		height: 85rpx;
		width: 85rpx;
		display: inline-block;
		position: absolute;
		top: 0rpx;
		left: 30%;
		transform: translateX(-50%);
	}

	.item-foot-zou {
		display: inline-block;
		position: absolute;
		width: 210rpx;
		top: 0rpx;
		left: 50%;
		transform: translateX(-50%);
		font-size: 60rpx;
	}

	.item-foot-text {
		font-size: 23rpx;
		width: 200rpx;
		word-break: break-word;
		white-space: break-spaces;
		margin-top: 3rpx;
	}

	/* 右边立即领取的文字 */
	.item-foot-btn-warp {
		width: 130rpx;
		height: 150rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 170, 73, 1.0);

		.ifb {
			color: #FFFFFF;
			width: 75rpx;
			height: 40rpx;
			font-size: 37rpx;
		}
	}

	.shopInfo {
		margin: 40rpx 0;
		padding: 30rpx 20rpx;
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		border-radius: 20rpx;

		.shopLogo {
			width: 120rpx;
			margin: 0 auto;
			height: 100rpx;

			.image {
				width: 100rpx;
				height: 100rpx;
				border-radius: 8rpx;
			}
		}

		.shopBase {
			display: flex;
			flex: 1;
			flex-direction: column;
			justify-content: space-between;

			.shopTitle {
				font-size: 32rpx;
				font-weight: bold;
			}

			.shopAddress {
				margin-top: 10rpx;
				color: #7E7E7E;
				font-size: 30rpx;
			}
		}

		.qiehuanBox {
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-items: center;

			.switchStore {
				align-self: flex-end;
				color: red;
				padding: 0 14rpx;
				font-size: 23rpx;
				border-radius: 25rpx;
				border: 1rpx solid #00AA49;
				color: #00AA49;
			}
		}
	}

	.shop-top {
		width: 750rpx;
		height: 280rpx;
		background-color: #00AA49;
	}

	.shop-top-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 30rpx 0;
	}

	.shop-info-box {
		width: 100%;
		border-radius: 20rpx 20rpx 0 0;
	}

	.shop-info-top {
		border-radius: 20rpx 20rpx 0 0;
		position: relative;
		display: flex;
		align-items: center;
	}

	.photo-img {
		width: 102rpx;
		height: 102rpx;
		border-radius: 50%;
		margin-right: 10rpx;
	}

	.shop-name {
		font-size: 28rpx;
		color: #fff;
		display: block;
		width: 180rpx;
	}

	.shop-num {
		font-size: 24rpx;
		color: #fff;
		margin-top: 15rpx;
	}

	.favorites-box {
		display: flex;
	}

	.favorites-box .store-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 8rpx;
	}

	.favorites-box .text {
		font-size: 26rpx;
		color: #fff;
	}

	.shop-banner-box {
		background: #f7f7f7;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
	}

	.shop-banner-img {
		width: 100%;
		height: 280rpx;
		border-radius: 20rpx;
	}

	.shop-list-content {
		width: 100%;
	}

	.shop-list-nav {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 80rpx;
		line-height: 76rpx;
		background: #fff;
	}

	.nav-item-sort {
		flex: 1;
		font-size: 24rpx;
		color: #222;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 80rpx;
		line-height: 80rpx;
	}

	.nav-item-sort .r {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-left: 5rpx;
	}

	.nav-item-sort .r .arrow-img {
		width: 32rpx;
		height: 32rpx;
		padding: 7rpx;
		box-sizing: border-box;
	}

	.shop-list-box {
		width: 100%;
		background: #f7f7f7;
		padding: 12rpx 30rpx 0;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
	}

	.shop-list-box .item {
		width: 340rpx;
		margin: 0 5rpx 12rpx 0;
		background: #d6d6d6;
		border-radius: 10rpx;
		display: flex;
		flex-direction: column;
	}

	.shop-list-box .item:nth-of-type(2n) {
		margin-left: 5rpx;
		margin-right: 0;
	}

	.product-img {
		width: 340rpx;
		height: 340rpx;
		border-radius: 10rpx 10rpx 0 0;
	}

	.product-bottom-box {
		padding: 20rpx;
		box-sizing: border-box;
		background: #fff;
		border-radius: 0 0 10rpx 10rpx;
	}

	.product-name {
		display: block;
		font-size: 28rpx;
		color: #333;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.product-num {
		font-size: 24rpx;
		color: #999;
		margin-top: 15rpx;
	}

	.product-price-box {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-top: 30rpx;
	}

	.product-price-box .price-box {
		font-size: 36rpx;
		color: #00AA49;
		font-weight: 400;
	}

	.product-price-box .price-box .fuhao {
		font-size: 24rpx;
	}

	.product-price-box .price-through {
		text-decoration: line-through;
		font-size: 24rpx;
		color: #999;
	}

	.shop-sort-list {
		margin-top: 20rpx;
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.shop-sort-list .item {
		display: flex;
		flex-direction: column;
		background: #fff;
		padding: 0 30rpx 20rpx;
		box-sizing: border-box;
		margin-bottom: 20rpx;
	}

	.shop-sort-list .item .sort-title {
		font-size: 30rpx;
		color: #333;
		padding: 30rpx 0;
	}

	.sort-single-box {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		width: 100%;
	}

	.sort-single-box .single {
		width: 340rpx;
		height: 78rpx;
		margin: 0 5rpx 10rpx 0;
		background: #fff;
		border: 1px solid #E5E5E5;
		border-radius: 4rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #333;
		box-sizing: border-box;
	}

	.sort-single-box .single:nth-of-type(2n) {
		margin-left: 5rpx;
		margin-right: 0;
	}

	.empty-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.empty-container image {
		width: 200rpx;
		height: 200rpx;
		margin-top: 150rpx;
	}

	.empty-container text {
		font-size: 28rpx;
		color: #999;
		margin-top: 30rpx;
		display: block;
		width: 300rpx;
		text-align: center;
	}

	.active {
		color: #00AA49;
	}

	.tabs-nav-warp {
		padding: 0 20px;
	}

	.tabs-nav {
		margin-top: 20upx;

		.ul {
			white-space: nowrap;

			.li {
				display: inline-block;
				margin-left: 36upx;
				font-size: 30upx;
				color: #333;
				position: relative;
				padding-bottom: 18upx;

				&:first-child {
					margin-left: 0;
				}

				&.on {
					&:after {
						content: '';
						width: 100%;
						height: 8upx;
						position: absolute;
						left: 0;
						bottom: 0;
					}

					font-weight:bold;
				}
			}
		}
	}

	.mybanner {
		margin: 30rpx 0rpx 30rpx 0rpx;
		width: 750rpx;
		padding: 0 20rpx;

		.b {
			border-radius: 30rpx;
		}
	}

	// #ifdef MP-ALIPAY

	.shop-top {
		margin-top: 0 !important;
	}

	.shop-top-content {
		padding-top: 80rpx;
	}

	.nav-item-sort .r .arrow-img {
		width: 16rpx;
		height: 16rpx;
		padding: 4rpx;
	}

	.tabs-nav {
		margin-top: 20upx;

		.ul {
			.li {
				&:first-child {
					margin-left: 36upx;
				}
			}
		}
	}

	// #endif
</style>