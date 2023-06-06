<template>
	<view class="content">
		<!-- 我的 -->
		<!-- <image class="top-bg" src="@/static/img/user/topBg.png" mode="widthFix"></image> -->
		<view class="page-content">
			<view class="header">
				<view class="white"></view>
			</view>
			<view class="info">
				<view class="base">
					<view class="pic" @click="userDenglu">
						<image :src="useritem.headImage" v-if="useritem.headImage !== '' && useritem.headImage"></image>
						<image src="../../../static/images/storeLogo.png" v-else></image>
					</view>
					<view class="text">
						<view class="name">
							<text>{{useritem.name}}</text>
							<text class="denglu" @click="userDenglu" v-if="isDengShow">登录</text>
						</view>
						<view class="text_content">
							<view class="id">ID: {{item.buyerUserId == undefined ? 0:item.buyerUserId}}</view>
							<!-- 不需要跳转了 -->
							<!-- <view class="regularMembers" @click="$toUrl('/pages_category_page1/store/index')">普通会员</view> -->
							<view class="regularMembers">{{useritem.labelName}}</view>
						</view>
					</view>
				</view>
				<view class="details">
					<view class="item" @click="$toUrl('/pages_category_page2/userModule/coupon')">
						<view class="text">卡券</view>
						<view class="num">{{userAllList.couponCount}}</view>
					</view>
					<view class="item" @click="$toUrl(`/pages/score/zhanghu?userId=${item.buyerUserId}`)">
						<view class="text">账户</view>
						<view class="num">{{userAllList.price}}</view>
					</view>
					<view class="item" @click="$toUrl('/pages/score/detail')">
						<view class="text">商品积分</view>
						<view class="num">{{userAllList.integral}}</view>
					</view>
				
				</view>
			</view>

			<view class="item-content">
				<view class="item_head">
					<span>我的订单</span>
					<view class="right" @click="orderTap(0)">
						全部订单<u-icon name="arrow-right"></u-icon>
					</view>
				</view>
				<view class="order-box">
					<view class="order-item" @click="orderTap(1)">
						<image class="order-item-image" src="@/static/img/user/daifukuan1.png" mode="widthFix">
						</image>
						<view class="order-item-text">待付款</view>
						<view class="myMessNum" v-if="orderNumList['1'] > 0">{{orderNumList['1']}}</view>
					</view>
					<view class="order-item" @click="orderTap(2)">
						<image class="order-item-image" src="@/static/img/user/daifahuo1.png" mode="widthFix">
						</image>
						<view class="order-item-text">待发货</view>
						<view class="myMessNum" v-if="orderNumList['2'] > 0">{{orderNumList['2']}}</view>
					</view>
					<view class="order-item" @click="orderTap(3)">
						<image class="order-item-image" src="@/static/img/user/daishouhuo.png" mode="widthFix">
						</image>
						<view class="order-item-text">待收货</view>
						<view class="myMessNum" v-if="orderNumList['3'] > 0">{{orderNumList['3']}}</view>
					</view>
					<!-- <image class="order-line" src="@/static/img/user/line.png" mode="widthFix"></image> -->
					<view class="order-item" @click="orderTap(4)">
						<image class="order-item-image" src="@/static/img/user/dingdan.png" mode="widthFix"></image>
						<view class="order-item-text">待评价</view>
						<!-- <view class="myMessNum" v-if="orderNumList['4'] > 0">{{orderNumList['4']}}</view> -->
					</view>
				</view>
			</view>

			<view class="item-content">
				<view class="item_head">
					<span>常用功能</span>
				</view>
				<view class="item-btn" @click="$toUrl('/pages_category_page2/userModule/messageCenter')">
					<image class="item-btn-icon" src="@/static/images/mymessageIcon.png" mode="widthFix"></image>
					<view class="item-btn-text flex-row-plus flex-items">
						<label>消息中心</label>
					</view>

				</view>
				<view class="item-btn" @click="jifenshangc">
					<image class="item-btn-icon" src="@/static/img/user/dizhi1.png" mode="widthFix"></image>
					<view class="item-btn-text">积分商城</view>

				</view>
				<view class="item-btn" @click="addressClick">
					<image class="item-btn-icon" src="@/static/img/user/dizhi1.png" mode="widthFix"></image>
					<view class="item-btn-text">地址管理</view>

				</view>

				<view class="item-btn" @click="doExit">
					<image class="item-btn-icon" src="@/static/images/exit.png" mode="widthFix"></image>
					<view class="item-btn-text">退出</view>
				</view>
				
				<view class="item-btn" @click="applySettle" v-if="false">
					<image class="item-btn-icon" src="@/static/img/user/fenxiao.png" mode="widthFix"></image>
					<view class="item-btn-text">门店申请</view>
				</view>

				<view class="item-btn" @click="applyVip">
					<image class="item-btn-icon" src="@/static/images/myfootprintIcon.png" mode="widthFix"></image>
					<view class="item-btn-text">会员中心</view>
				</view>
				<!--  -->
				<view class="item-btn" @click="tofxfun" v-if="useritem.labelName!='游客'">
					<image class="item-btn-icon" src="@/static/img/user/fenxiao.png" mode="widthFix"></image>
					<view class="item-btn-text">我的业绩</view>
				</view>
				
				<view class="item-btn" @click="showmdsphone">
					<image class="item-btn-icon" src="@/static/img/user/shouhou.png" mode="widthFix"></image>
					<view class="item-btn-text">门店电话</view>
				</view>
				
				<view class="item-btn" @click="$toUrl('/pages_category_page3/jinxiao/index')" v-if="false">
					<image class="item-btn-icon" src="@/static/images/wuliu.png" mode="widthFix"></image>
					<view class="item-btn-text">我是物流商</view>
				</view>
				
				<view class="item-btn" @click="$toUrl('/pages_category_page3/jinxiao/index?jinxiao=1')" v-if="false">
					<image class="item-btn-icon" src="@/static/images/fenxiao.png" mode="widthFix"></image>
					<view class="item-btn-text">我是经销商</view>
				</view>
				
			</view>

			<view class="item-content" style="margin-bottom: 25rpx;">
				<view class="item_head">
					<span>更多服务</span>
				</view>
				<view class="item-btn" @click="$toUrl('/pages_category_page2/userModule/collection')">
					<image class="item-btn-icon" src="@/static/images/mycollectionIcon.png" mode="widthFix"></image>
					<view class="item-btn-text">我的收藏</view>

				</view>
		
				<view class="item-btn" @click="$toUrl('/pages_category_page2/userModule/footprintList')">
					<image class="item-btn-icon" src="@/static/images/myfootprintIcon.png" mode="widthFix"></image>
					<view class="item-btn-text">浏览足迹</view>

				</view>


				<view class="item-btn" @click="$toUrl('/pages_category_page2/userModule/shopPrint')">
					<image class="item-btn-icon" src="@/static/images/shopprint.png" mode="widthFix"></image>
					<view class="item-btn-text">浏览门店</view>
				</view>
	
				<view class="item-btn" @click="$toUrl('/pages_category_page1/goodsModule/userEvaluate')">
					<image class="item-btn-icon" src="@/static/img/user/pingjia.png" mode="widthFix"></image>
					<view class="item-btn-text">我的评价</view>
				</view>
				<view class="item-btn" @click="$toUrl('/pages_category_page2/userModule/coupon')">
					<image class="item-btn-icon" src="@/static/img/user/kaquan.png" mode="widthFix"></image>
					<view class="item-btn-text">我的卡券</view>
				</view>
				
				<view class="item-btn" @click="$toUrl('/pages_category_page3/merchants/MerchantLogin/MerchantLogin')">
					<image class="item-btn-icon" src="@/static/img/user/fenxiao.png" mode="widthFix"></image>
					<view class="item-btn-text">商家登录</view>
				</view>
			</view>
		</view>
		<wxauth v-bind:showauth="showauth" @after-auth="initPage" @stop-auth="stopauth"></wxauth>
			<u-popup v-model="show" @close="show=false" mode="center" @open="show=true"
			border-radius="14" width="500rpx" height="280rpx">
				<view class="phonemd">
					<view>
						<text>门店:</text>
						<text>{{mdobj.username?mdobj.username: "" }}</text>
					</view>
					<view>
						<text>电话:</text>
						<text @click="tophone" style="color: #409eff;;">{{ mdobj.name ?mdobj.name: ""}}</text>
					</view>
				</view>
			</u-popup>
	</view>
</template>

<script>
	const NET = require('@/utils/request')
	const API = require('@/config/api')
	const SECRET = require('@/utils/secret')
	
	import {
		clearlogin,
		getlogininfo,
		getCurShopid,
		getCurUserid
	} from '@/api/common.js'
import wxauth from '@/components/wxauth.vue'
	export default {
		data() {
			return {
				show:false, // 门店电话
				showauth: false,
				src: '',
				item: {},
				infoitem: {},
				useritem: {},
				userAllList: {}, //包含卡券 余额 积分
				shenisShow: 0,
				isDengShow: true, //控制登录按钮是否展示
				orderNumList: {},
				fxid:"", // 分销员id
				StoreListData:{},  //分销会员中心参数对象
				mdobj:{},  // 门店负责人电话
				shopId:""
			}
		},
		components: {
			wxauth
		},
		onShow() {
			this.initPage();
			// 获取分销员id
			 this.getdistributorId();
		},
		onLoad(options) {
			this.shenqingisShow();
			// 获取用户点击次数
			this.getsumdj("个人中心","","/pages/tabbar/user/index");
			// 其他页面扫码进入首页时防止刷新店铺
			let shopId = getCurShopid()??"";
			uni.setStorageSync("fxGoodsShopId",shopId);
			// 没经过首页是不存shopid的,这里分享进入存一遍
			if(options.shopId){
				this.shopId = options.shopId
			}
			// 初始化页面
			this.initPage();
			// 分享
			wx.showShareMenu({
			    withShareTicket:true,
			    //设置下方的Menus菜单，才能够让发送给朋友与分享到朋友圈两个按钮可以点击
			    menus:["shareAppMessage","shareTimeline"]
			})
			
		},
		//分享到朋友圈
		onShareTimeline(res) {
			let distributorId = this.$getstorage("distributorId")??""
			let userId = getCurUserid() === undefined ? '' : getCurUserid();
			let shopId = getCurShopid()
		    return {
				title: '个人中心',
				query:`FXUserId=${userId}&shopId=${shopId}&salesId=${distributorId}`
				// path: `/pages/tabbar/user/index?shopId=${shopId}&salesId=${userId}`,
			}
		},
		// 分享到朋友
		onShareAppMessage() {
			let distributorId = this.$getstorage("distributorId")??""
			let userId = getCurUserid() === undefined ? '' : getCurUserid();
			let shopId = getCurShopid();
			
			return {
				title: '个人中心',
				path: `/pages/tabbar/user/index?FXUserId=${userId}&shopId=${shopId}&salesId=${distributorId}`,
			}
		},
		methods: {
			// 判断分销会员是否显示 
			getdistributorId(){
				let shopId = uni.getStorageSync("curshopid");
				let data = {
					shopId
				}
				NET.request(API.getdistributorId,data,'POST').then(res=>{
					uni.setStorageSync("distributorId",res.data);
					// 显示分销会员中心
					this.fxid = uni.getStorageSync("distributorId");
				})
			},
			// 获取门店电话弹框
			showmdsphone(){
				this.show = true
				let shopId = getCurShopid() || this.shopId;
				NET.request(API.fzphone, {
					shopId
				}, 'GET').then(res => {
					this.mdobj = res.data
				}).catch(res => {
					
				})
			},
			// 调门店信息列表接口
			tofxfun(){
				let shopId = getCurShopid() || this.shopId;
				uni.showLoading({
					title: '加载中...'
				})
				NET.request(API.FindSaleStoreList1, {
					page:1,
					pageSize: 1,
					shopId
				}, 'GET').then(res => {
					uni.hideLoading()
					if (res.data.list.length == 0) {
						uni.showToast({
							title: '暂无业绩',
							duration: 2000
						});
					}else{
						let item = res.data.list[0];
						uni.navigateTo({
							url: '/pages_category_page1/distributionModule/salesIndex?distributeInfo=' + JSON.stringify(item)
						});
					}
				}).catch(res => {
					uni.hideLoading()
				})
			},
			// 拨打电话
			tophone(){
				console.log(123123123);
				if(this.mdobj.name){
					uni.makePhoneCall({
						phoneNumber:this.mdobj.name,//电话号码
						success:function(e){
							console.log(e);
						},
						fail:function(e){
							console.log(e);
					
						}
					})
				}
			},
			// 去分销
			gofenxiao(){
				let shopId = getCurShopid()
				uni.navigateTo({
					url: '/pages_category_page1/store/index?storeId=' +shopId
				})
			},
			userDenglu() {
				this.initPage()
			},
			shenqingisShow() {
				NET.request(API.isShow, 'GET').then(res => {
					this.shenisShow = res.data
				})
			},
			orderNum() {
				let shopId = getCurShopid() || this.shopId
				NET.request(API.getOrderCount, {
					shopId
				}, 'GET').then(res => {
					this.orderNumList = res.data
				})
			},
			//获取卡券,余额,积分
			getkqyejf() {
				let item = {}
				if (uni.getStorageSync('storage_key')) {
					item = uni.getStorageSync('storage_key');
				}
				if (JSON.stringify(item) == '{}') {
					this.showauth = true; //授权
				} else {
					let shopId = getCurShopid()
					NET.request(API.getUserAll + `?shopId=${shopId}`, 'GET').then(res => {
						this.userAllList = res.data
					})
				}
			},

			initPage() {
				let shopId = getCurShopid() || this.shopId
				NET.request(API.GetUser, {
					shopId: shopId
				}, 'GET').then(res => {
					this.showauth = false; //授权
					this.isDengShow = false
					this.item = getlogininfo();
					this.useritem = res.data
					this.getkqyejf()
					this.orderNum()
				}, res => {
					this.showauth = true;
					this.isDengShow = true
				})
				.catch(res => {})
			},
			stopauth() {
				this.showauth = false;
				uni.switchTab({
					url: "../../../pages/homePage/homePage"
				})
			},
			applyVip() {
				uni.navigateTo({
					url:"/pages_category_page1/applyVip/applyVip"
					// url: `../../applyVip/applyVip?labelName=${this.useritem.labelName}`
				})
			},
			// 获取会员信息
			getInfo() {
				NET.request(API.Info, {
					token: this.item.token,
				}, 'GET').then(res => {
					this.infoitem = res.data
				}).catch(res => {

				})
			},
			// 个人信息  登录页面
			gologin() {
				uni.navigateTo({
					url: '/pages_category_page2/userModule/login'
				})
			},
			goinfo() {
				uni.navigateTo({
					url: '/pages_category_page2/userModule/personalDetails?infoitem=' + JSON.stringify(this
						.infoitem)
				})
			},
			mystore() {
				uni.navigateTo({
					url: '../../../pages_category_page1/mysotre/mystore'
				})
			},
			doExit() {
				this.useritem = {}
				//退出
				clearlogin();
				uni.switchTab({
					url: "../../../pages/homePage/homePage"
				})
			},
			applySettle() {
				uni.navigateTo({
					url: '../../../pages_category_page1/linkOthers/index'
				})
			},
			//我的账户
			memberAccountClick() {
				if (this.item) {
					uni.navigateTo({
						url: '/pages_category_page2/userModule/memberAccount'
					})
				} else {
					uni.navigateTo({
						url: '/pages_category_page2/userModule/login'
					})
				}
			},
			// 地址管理
			addressClick() {
				if (JSON.stringify(this.item) == '{}') {
					uni.navigateTo({
						url: '/pages_category_page2/userModule/login'
					})
				} else {
					uni.navigateTo({
						url: '/pages_category_page2/userModule/address'
					})
				}

			},

			jifenshangc() {
				uni.navigateTo({
					url: `/pages/score/list?jifen=${this.userAllList.integral}`
				})
			},
			// 我的售后
			goafterSale() {
				if (JSON.stringify(this.item) == '{}') {
					uni.navigateTo({
						url: '/pages_category_page2/userModule/login'
					})
				} else {
					uni.navigateTo({
						url: '/pages_category_page1/orderModule/afterSale'
					})
				}
			},
			// 我的银行卡
			goBankcard() {
				if (JSON.stringify(this.item) == '{}') {
					uni.navigateTo({
						url: '/pages_category_page2/userModule/login'
					})
				} else {
					uni.navigateTo({
						url: '/pages_category_page2/userModule/bankcard'
					})
				}
			},

			//判断是否是分销员
			getApplyState() {
				NET.request(API.HasApply, {
					tenantCode: this.currentId
				}, 'POST').then(res => {
					uni.hideLoading()
					this.slist = res.data
				}).catch(res => {
					uni.hideLoading()
				})
			},
			orderTap(type) {
				if (JSON.stringify(this.item) == '{}') {
					uni.navigateTo({
						url: '/pages_category_page2/userModule/login'
					})
				} else {
					uni.navigateTo({
						url: '/pages_category_page1/orderModule/index?type=' + type
					})
				}
			}
		}
	}
</script>

<style lang='scss' scoped>
	page {
		background-color: #F7F7F7;
	}
	
	.phonemd{
		padding: 20rpx 20rpx;
		height: 200rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		font-size: 30rpx;
		view{
			text:first-child{
				font-weight: bold;
				margin-right: 20rpx;
			}
		}
	}
	
	.content {
		height: 100%;

		/* background-color: #f8f8f8; */
		.top-bg {
			width: 100%;
		}

		.page-content {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			z-index: 10;

			.user-info-box {
				width: 100%;
				box-sizing: border-box;
				padding: 30upx;
				display: flex;
				flex-direction: row;
				align-items: center;

				.user-image {
					width: 130upx;
					height: 130upx;
				}

				.user-info {
					flex: 1;
					display: flex;
					flex-direction: column;
					padding-left: 20upx;
					box-sizing: border-box;
					z-index: 10;

					.user-logoin-title {
						font-size: 36upx;
						font-weight: 500;
						color: rgba(255, 255, 255, 1);
					}

					.user-logoin-lable {
						font-size: 24upx;
						font-weight: 400;
						color: rgba(255, 255, 255, 1);
						margin-top: 20upx;
					}
				}

				.user-info-right {
					width: 30upx;
					height: 30upx;
				}
			}

			.order-box {
				width: 690upx;
				padding: 20rpx;
				background: rgba(255, 255, 255, 1);
				border-radius: 20rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
				z-index: 10;

				.order-line {
					width: 12upx;
					height: 106upx;
				}

				.order-item {
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					position: relative;

					.order-item-image {
						width: 54upx;
						height: 54upx;
					}

					.order-item-text {
						font-size: 28upx;
						margin-top: 10upx;
						font-weight: 500;
						color: rgba(102, 102, 102, 1);
					}

					.myMessNum {
						position: absolute;
						top: -15rpx;
						left: 115rpx;
						width: 40rpx;
						height: 40rpx;
						background-color: red;
						border-radius: 50%;
						color: #FFFFFF;
						font-size: 20rpx;
						text-align: center;
						line-height: 40rpx;
						font-weight: 600;
					}
				}
			}

			.item-content {
				display: flex;
				flex-wrap: wrap;
				width: 700rpx;
				margin: 20rpx 25rpx 0;
				border-radius: 20rpx;
				overflow: hidden;
				background-color: #fff;
			}

			.item-btn {
				width: 25%;
				display: flex;
				flex-direction: column;
				align-items: center;
				box-sizing: border-box;
				background-color: #fff;
				padding: 20rpx 0;

				.item-btn-icon {
					width: 48upx;
					height: 48upx;
				}

				.item-btn-text {
					white-space: nowrap;
					font-size: 25rpx;
					margin-top: 20rpx;
					font-weight: 500;
					flex: 1;
					color: rgba(102, 102, 102, 1);
				}

				.messNum {
					margin-left: 10rpx;
					font-size: 16rpx;
					background-color: red;
					color: #FFFFFF;
					width: 30rpx;
					height: 30rpx;
					border-radius: 50%;
					margin-top: -5rpx;
					line-height: 30rpx;
					text-align: center;
				}

				.item-btn-right {
					width: 24upx;
					height: 24upx;
				}

			}

			.mt20 {
				margin-top: 20upx;
			}

			.mt1 {
				margin-top: 1upx;
			}
		}
	}
	
	


	.header {
		.white {
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			height: 100rpx;
			background-color: #00AA49;
			z-index: 0;
		}
	}

	.info {
		position: relative;
		background-color: #FFF;
		width: 700rpx;
		z-index: 1;
		margin: 40rpx 0 0 25rpx;
		border-radius: 20rpx;
		padding: 30rpx 0;


		.base {
			display: flex;

			.pic {
				width: 140rpx;
				height: 140rpx;
				margin-left: 20rpx;

				image {
					width: 100%;
					height: 100%;
					border-radius: 20rpx;
				}
			}

			.text {
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				padding: 0 30rpx;

				.name {
					font-size: 40rpx;
					font-weight: bold;
				}

				.denglu {
					margin-left: 20rpx;
					background-color: #00AA49;
					color: #FFFFFF;
					padding: 0 10rpx;
					border-radius: 5rpx;
					font-size: 24rpx;
				}

				.text_content {
					display: flex;

					.id {
						color: #999;
					}

					.regularMembers {
						margin-left: 20rpx;
						border-radius: 20rpx;
						background-image: linear-gradient(RGBA(242, 159, 109, .8), RGBA(242, 159, 109, 1));
						color: #fff;
						padding: 2rpx 13rpx;
					}
				}
			}

			.name {
				color: #333;
			}
		}

		.details {
			/* width: 600rpx; */
			text-align: center;
			/* margin-left: 100rpx; */
			display: flex;
			justify-content: space-around;
			align-items: center;
			margin-top: 40rpx;

			.item {
				display: flex;

				.num {
					font-size: 34rpx;
					font-weight: bold;
					margin-left: 15rpx;
				}

				.text {

					font-size: 28rpx;
					color: #A2A3A3;
					/* margin: auto; */
				}
			}
		}
	}

	.item_head {
		width: 100%;
		display: flex;
		padding: 25rpx 25rpx 10rpx;

		>span {
			font-size: 40rpx;
		}

		.right {
			color: #999;
			margin: auto 0 auto auto;
		}
	}
</style>
