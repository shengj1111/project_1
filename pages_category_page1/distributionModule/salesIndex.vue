<template>
	<view class="container">
		<view class="salesIndex-topBackImg">
			<view class="topStoreTag flex-row-plus">
				<view class="storeName overflow font-color-FFF mar-left-30">
					<label class=" fs24">{{item.shopName}}</label>
				</view>
				<view>
					<image class="storeLogoImg" :src="item.shopLogo"></image>
				</view>
			</view>
			<view class="flex-items flex-column">
				<image class="salesHeadImg" :src="SalesMainItem.headImage"></image>
				<!-- <view class="font-color-FFF fs36 mar-top-10">{{SalesMainItem.name}}(邀请码:{{SalesMainItem.invitationCode}})</view> -->
				 <view class="font-color-FFF fs36 mar-top-10">{{SalesMainItem.name}}</view>
				<view class="gradeText">{{item.levelName}}</view>
			</view>
		</view>
		<view class="flex-items-plus">
			<view class="flex-row-plus award-box flex-items flex-sp-around">
				<!-- <view class="flex-column-plus flex-items" @click="gototalAward">
					<label class="font-color-FF7911 fs44">{{SalesMainItem.cumulative}}</label>
					<label class="fs24 font-color-656">累计奖励(积分）</label>
				</view> -->
				<view class="flex-column-plus flex-items" @click="$toUrl('/pages/score/detail?flag=1')">
					<label class="font-color-FF7911 fs44">{{SalesMainItem.cumulative}}</label>
					<label class="fs24 font-color-656">累计奖励(积分）</label>
				</view>
				<view class="borRig-line-E5E5E5 lineRight" style="height: 44upx;"></view>
				<!-- <view class="flex-column-plus flex-items" @click="gounliquidated">
					<label class="font-color-FF7911 fs44">{{SalesMainItem.unsettled}}</label>
					<label class="fs24 font-color-656">未结算奖励(积分）</label>
				</view> -->
				<view class="flex-column-plus flex-items">
					<label class="font-color-FF7911 fs44">{{SalesMainItem.unsettled}}</label>
					<label class="fs24 font-color-656">未结算奖励(积分）</label>
				</view>
			</view>
		</view>
		<view class="flex-items-plus">
			<view class="flex-row-plus award-box flex-items flex-sp-around">
				<view class="flex-column-plus flex-items" @click="gototalClient">
					<label class="font-color-333 fs44">{{SalesMainItem.users}}</label>
					<label class="fs24 font-color-656">我的下级</label>
				</view>
				<view class="borRig-line-E5E5E5 lineRight" style="height: 44upx;"></view>
				<!-- <view class="flex-column-plus flex-items" @click="gototalPersonnel">
					<label class="font-color-333 fs44">{{SalesMainItem.distributors}}</label>
					<label class="fs24 font-color-656">累计分销员(人）</label>
				</view> -->
				<!-- priceSum -->
				<view class="flex-column-plus flex-items" @click="godistributionOrder">
					<!-- cumulative -->
					<label class="font-color-333 fs44">{{SalesMainItem.dealMoney || 0}}</label>
					<label class="fs24 font-color-656">下线业绩</label>
				</view>
			</view>
		</view>
		
		<view class="flex-items-plus">
			<view class="flex-row-plus award-box flex-items flex-sp-around">
				<view class="flex-column-plus flex-items" @click="godistributionOrderzt">
					<label class="font-color-333 fs44">{{SalesMainItem.dealMoneying || 0}}</label>
					<label class="fs24 font-color-656">在途订单</label>
				</view>
				<view class="borRig-line-E5E5E5 lineRight" style="height: 44upx;"></view>
				<!-- <view class="flex-column-plus flex-items" @click="gototalPersonnel">
					<label class="font-color-333 fs44">{{SalesMainItem.distributors}}</label>
					<label class="fs24 font-color-656">累计分销员(人）</label>
				</view> -->
				<!-- priceSum -->
				<view class="flex-column-plus flex-items" @click="godistributionOrderxs">
					<!-- cumulative -->
					<label class="font-color-333 fs44">{{SalesMainItem.myPerformance || 0}}</label>
					<label class="fs24 font-color-656">本人业绩</label>
				</view>
			</view>
			
		</view>
		
		<view class="flex-items-plus" v-if="false">
			<view class="flex-row-plus award-box flex-items flex-sp-around">
				<!-- <view class="flex-column-plus flex-items" @click="gopromotion(1)">
					<button type="default" open-type="share" class="btn-share"  plain="true">
						<view class="sharewarp">
							<image class="salesIcon" src="../../static/images/salesStoreIcon.png"></image>
							<text class="bs-txt">推广店铺</text>
						</view>
					</button>
				</view> -->
				<view class="flex-column-plus flex-items" @click="storeindex">
			<!-- 		<image class="salesIcon" src="../../static/images/extendGoodsIcon.png"></image>
					<label class="fs24 font-color-656">推广商品</label> -->
					<view class="sharewarp">
						<image class="salesIcon" src="../../static/images/extendGoodsIcon.png"></image>
						<text class="bs-txt">推广商品</text>
					</view>
				</view>
				<view class="flex-column-plus flex-items" @click="godistributionOrder">
					<image class="salesIcon" src="../../static/images/salesOrderIcon.png"></image>
					<label class="fs24 font-color-656">分销订单</label>
				</view>
				<view class="flex-column-plus flex-items" @click="gopromotion(2)">
			<!-- 		<image class="salesIcon" src="../../static/images/inviteLowerIcon.png"></image>
					<label class="fs24 font-color-656">邀请下级</label> -->
					<button type="default" open-type="share" class="btn-share"  plain="true">
						<view class="sharewarp">
							<image class="salesIcon" src="../../static/images/inviteLowerIcon.png"></image>
							<text class="bs-txt">邀请下级</text>
						</view>
					</button>
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
				shareaction: 1,
				item: {},
				SalesMainItem: {},
			}
		},
		onLoad(options) {
			uni.hideShareMenu();
		
			this.item = JSON.parse(options.distributeInfo)
			uni.setStorageSync("salesId", this.item.distributorId)
			this.getSalesMainInfo()
		},
		onShareAppMessage() {
			
			
			uni.showLoading({
				title:"加载中..."
			})
			const promise = new Promise(resolve => {
				setTimeout(() => {
					uni.hideLoading();
					let _title = this.item.shopName;
					let _path = "";
					if (this.shareaction == 1) {
						_path = `pages_category_page1/store/index?storeId=${this.item.shopId}&salesId=${this.item.distributorId}`
					}else if(this.shareaction == 2){
						//邀请下级
						_title="邀请下级"
						_path=`pages_category_page1/distributionModule/recruit?shopId=${this.item.shopId}`
					}
					console.log(_path,222);
					
					resolve({
						title: _title,
						imageUrl:"https://zpmxcx.ylbtl.cn/merchant-web/static/img/kehulogo.6e8508f3.jpg",
						path:_path
					})
				}, 2000)
			})
			
			
			return {
				title: this.item.shopName,
				path: `pages_category_page1/store/index?storeId=${this.item.shopId}&salesId=${this.item.distributorId}`,
				promise
			}
		},

		methods: {
			// 在途订单
			godistributionOrderzt(){
				uni.navigateTo({
					url: `distributionOrderzt?shopId=${this.item.shopId}&distributorId=${this.item.distributorId}`
				});
			},
			// 下线业绩
			godistributionOrderxs(){
				uni.navigateTo({
					url: `distributionOrderbr?shopId=${this.item.shopId}&distributorId=${this.item.distributorId}`
				});
			},
			getSalesMainInfo() {
				uni.showLoading({
					title: '加载中...'
				})
				NET.request(API.QuerySalesMainInfo, {
					distributorId: this.item.distributorId,
					shopId: this.item.shopId
				}, 'GET').then(res => {
					uni.hideLoading()
					this.SalesMainItem = res.data
				}).catch(res => {
					uni.hideLoading()
				})
			},
			//累计奖励
			gototalAward() {
				uni.navigateTo({
					url: 'totalAward?shopId=' + this.item.shopId + '&distributorId=' + this.item.distributorId
				});
			},
			// 未结算奖励
			gounliquidated() {
				uni.navigateTo({
					url: 'unliquidated?shopId=' + this.item.shopId + '&distributorId=' + this.item.distributorId
				});
			},
			// 累计客户
			gototalClient() {
				uni.navigateTo({
					url: 'totalClient?shopId=' + this.item.shopId + '&distributorId=' + this.item.distributorId
				});
			},
			// 累计分销员
			gototalPersonnel() {
				uni.navigateTo({
					url: 'totalPersonnel?shopId=' + this.item.shopId + '&distributorId=' + this.item.distributorId
				});
			},
			// 推广门店
			gopromotion(promoteType) {
				// #ifdef APP-PLUS
				var system = 1
				// #endif

				// #ifdef H5
				var system = 3
				// #endif

				// #ifdef MP-WEIXIN
				var system = 2
				// #endif

				// #ifdef MP-ALIPAY
				var system = 4
				// #endif

				this.shareaction = promoteType;
				// uni.showLoading({
				//   title: '请稍候...'
				// })
				/* const res = {'data':'https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-06-10/64223b9f0eef41abbb5d4056b9a40e2a08441534-3cbe-47af-8134-fc74635e069f.png'}
				uni.hideLoading()
				uni.navigateTo({
					url: `../../pages_category_page1/distributionModule/shareProduct?shareImg=${res.data}&shopId=${this.item.shopId}`
				}); */

				// NET.request(API.shopGetSharePic, {
				//   type: promoteType,
				//   shopId: this.item.shopId,
				//   distributorId: this.item.distributorId,
				//   terminal: system
				// }, 'GET').then(res => {

				//   uni.hideLoading()
				//   uni.navigateTo({
				// 	 url: `../../pages_category_page1/distributionModule/shareProduct?shareType=1&shareImg=${res.data}&shopId=${this.item.shopId}&salesId=${this.item.distributorId}`
				//    });
				// }).catch(res => {
				//   uni.hideLoading()
				// })
			},
			// 推广商品
			storeindex() {
				uni.navigateTo({
					url: 'commodity?shopId=' + this.item.shopId + '&distributorId=' + this.item.distributorId +
						'&headimg=' + this.SalesMainItem.headImage + '&username=' + this.SalesMainItem.name
				});
			},
			// 分销订单
			godistributionOrder() {
				uni.navigateTo({
					url: `distributionOrder?shopId=${this.item.shopId}&distributorId=${this.item.distributorId}`
				});
			},
			// 邀请下级
			goinvite() {
				uni.navigateTo({
					url: 'invite?tenantCode=' + JSON.stringify(this.SalesMainItem) + '&shopId=' + this.item
						.shopId + '&distributorId=' + this.item.distributorId
				});
			}

		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F7F7F7;
	}
	
	.btn-share{
		border: none !important;
		line-height: 1.5;
		padding: 0;
	}
	
	
	.sharewarp{
		display: flex;
		flex-direction: column;
		align-items:center;
		justify-content: center;
		
		.bs-txt{
			font-size: 24rpx;
			color: #656565;
		}
	}
	
	

	.container {
		.salesIndex-topBackImg {
			width: 100%;
			height: 280upx;
			// background: url(../../static/images/salesIndexTopBackImg.png) no-repeat;
			background-color: #00AA49;
			background-size: 100% 280upx;
			padding-top: 10upx;

			.topStoreTag {
				background-color: #000000;
				height: 40upx;
				width: 180upx;
				border-radius: 0 20upx 20upx 0;

				.storeName {
					width: 110upx;
				}

				.storeLogoImg {
					width: 38upx;
					height: 38upx;
					border-radius: 50%;
				}
			}

			.salesHeadImg {
				width: 100upx;
				height: 100upx;
				border-radius: 50%;
			}

			.gradeText {
				background-image: linear-gradient(to right, #FFFFFF 10%, #FFD5AB 100%);
				border-radius: 40upx;
				font-size: 18upx;
				color: #94431B;
				font-weight: bold;
				line-height: 36upx;
				text-align: center;
				margin-top: 15upx;
				padding: 5upx 10upx;
			}
		}

		.award-box {
			background-color: #FFFFFF;
			height: 158upx;
			width: 690upx;
			margin-top: 30upx;
			border-radius: 10upx;
			box-shadow: 0upx 0upx 10upx 4upx #F0F0F0;

			.salesIcon {
				width: 60upx;
				height: 56upx;
			}
		}
	}
</style>
