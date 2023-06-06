<template>
	<view>
		<view class="wrap">
			<view class="yourAddress">
				<view class="">你的位置</view>
				<text style="font-size: 22rpx;font-weight: 600;">{{curaddress}}</text>
			</view>

			<view class="categoryView">
				<view class="category">
					<!-- 点击城市跳转到选择城市的页面 -->
					<view class="address" @click="$toUrl(`/pages/select/city?page=switchStore&city=${city}`)">
						<!-- <view class="address"> -->
						<u-icon name="map-fill" size="40rpx" color="#029640"></u-icon>
						<text style="white-space: nowrap;overflow: hidden;
							text-overflow: ellipsis;
							max-width: 150rpx;">{{city}}</text>
					</view>
					<view class="line"></view>
					<view class="input">
						<input style="width: 100%;" type="text" value="" placeholder="输入商家名" v-model="searchkey" @blur='EnterSou'/>
					</view>
				</view>
				<view class="search">
					<u-button type='success' size="mini" @click="shopSearch">搜索</u-button>
				</view>
			</view>
		</view>
		
		
		<u-gap height="30" bg-color="#F4F5F5"></u-gap>
		<view class="storeDisplay wrap">
			<!-- 			<view class="title">门店展示</view> -->
			<!-- 门店列表 -->
			<view class="item" v-for="item in shopList" :key='item.shopId' @click="gotoShop(item)"
				style="border-bottom: #e8e8e8 1rpx solid;padding-bottom: 45rpx;margin-bottom: 35rpx;">
				<view class="logoBox">
					<image class="shoplogo" :src="item.shopLogo" mode=""></image>
				</view>
				<view class="middle">
					<view class="sname">
						{{item.shopName}}
					</view>
					<view class="uname" v-if="item == 1">
						{{item.chargePersonName}}({{item.chargePersonPhone}})
					</view>
					<view class="address">
						{{item.shopAdress}}
					</view>
				</view>

				<view class="right">
					<!-- 	<view class="distance">
						<u-icon name="map"></u-icon>距离：{{item.distance}}km
					</view> -->
					<view class="OftenStore" style="font-size: 21rpx;">{{item.distance}}km</view>
					<view class="OftenStore" style="font-size: 21rpx;" v-if="item.always">常购门店</view>
				</view>
			</view>
			<view v-if="loading" style="height: 100rpx; text-align: center; margin-top: 30rpx;">没有更多了</view>
		</view>
		<city-select v-model="typeShow" @city-change="cityChange"></city-select>

		<wxauth v-bind:showauth="showauth" @after-auth="authsucc" @stop-auth="stopauth"></wxauth>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')

	// 城市选择器
	import citySelect from './u-city-select.vue';
	import qqmapsdk from "@/static/js/qqmap-wx-jssdk.min.js";
	import wxauth from '@/components/wxauth.vue'
	
	const qqMap = new qqmapsdk({
		key: "3T7BZ-QWVRW-EYMRX-RMH3O-CZWB7-QLFX4"
	})
	
	
	import {
		clearlogin,
		getlogininfo,
		getCurShopid,
		getCurUserid
	} from '@/api/common.js'
	export default {
		components: {
			citySelect,
			wxauth
		},
		data() {
			return {
				showauth: false,
				curaddress: "", //你的位置,地址
				city: "", //你当前所在的城市名
				longitude: 0, //你所在的经度
				latitude: 0, //你所在的纬度
				searchkey: '', //商品名称
				page: 1,
				pageSize: 20,
				defaultShoplogo: "../../static/images/storeLogo.png",
				ssqText: '',
				typeShow: false,
				shopList: [],
				loading: false
			};
		},
		onLoad() {

			NET.request(API.GetUser, {}, 'GET').then(res => {
				this.showauth = false;
			}, res => {
				this.showauth = true;
			})
			uni.$on("switchStore", (data) => {
				console.log(data, "传入的值");
				this.shopList = []
				this.page = 1
				this.city = data.cityName
				this.bindData();
			});
		},
		onShow() {
			let myAddress = uni.getStorageSync('myAddress')
			if(myAddress && myAddress!= undefined){
				this.curaddress = myAddress.address;
				this.longitude = myAddress.longitude;
				this.latitude = myAddress.latitude;
				this.city = myAddress.shopAdress
				this.bindData();
			}
			uni.removeStorageSync('myAddress')
			console.log(uni.getStorageSync('myAddress'))
		},
		methods: {
			EnterSou(){
				console.log(1)
				// this.shopList = []
				this.bindData()
			},
			authsucc(){
				let shopId = getCurShopid()
				NET.request(API.GetUser, {
					shopId: shopId
				}, 'GET').then(res => {
					this.showauth = false; //授权
				}, res => {
					this.showauth = true;
				})
				.catch(res => {})
			},
			stopauth() {
				this.showauth = false;
				uni.navigateBack()
			},
			//获取商店列表
			bindData() {
				// this.shopList = []
				let shopName = this.searchkey
				let cond = {
					"page": this.page,
					"pageSize": this.pageSize,
					"shopName": this.searchkey,
					"shopAdress": this.city,
					"longitude": this.longitude,
					"latitude": this.latitude,
					"address": this.curaddress
				}

				if (shopName || shopName != '') {
					console.log(cond)
				} else {
					delete cond.shopName
					console.log(cond)
				}
				uni.showLoading({
					title: '加载中'
				});
				NET.request(API.GetAlwaysIndex, cond, 'POST').then(res => {
					uni.hideLoading()

					let _list = res.data;
					console.log(_list, 1111111)
					_list.forEach(i => {
						if (i.shopLogo == undefined || i.shopLogo == "") {
							i.shopLogo = this.defaultShoplogo;
						}
					})

					// this.shopList = this.shopList.concat(_list)
					this.shopList = _list
					if (_list.length < 10) {
						this.loading = true
					}
				})
			},
			cityChange(e) {
				this.ssqText = e.province.label + '-' + e.city.label + '-' + e.area.label;
				this.province = e.province.label
				this.city = e.city.label
				this.area = e.area.label
			},
			// 搜索门店
			shopSearch() {
				console.log(2)
				this.page = 1;
				this.shopList = [];
				this.bindData();
			},

			// 点击门店,切换页面,并且缓存门店信息
			gotoShop(item) {
				let _shopId = item.shopId;
				uni.setStorageSync('choice_shopid', _shopId);

				//选择的门店id
				uni.switchTab({
					url: "/pages/homePage/homePage"
				})

			}

		}
	}
</script>

<style lang="scss" scoped>
	.categoryView {
		height: 130rpx;
		margin: 0 auto;
		display: flex;
		justify-content: center;
		align-items: center;

		.category {
			width: 700rpx;
			height: 70rpx;
			display: flex;
			align-items: center;
			background-color: #EEE;
			border-radius: 50rpx;
			margin-right: 20rpx;

			.address {
				display: flex;
				padding-left: 20rpx;

				.u-icon {
					margin-right: 10rpx;
				}
			}

			.line {
				margin: 30rpx;
				width: 2rpx;
				height: 30rpx;
				background-color: #d4d6df;
			}

			.input {
				// background-color: red;
				height: 60rpx;
				flex: 1;
				margin-right: 20rpx;
				display: flex;
				align-items: center;
			}
		}
	}

	.wrap {
		width: 700rpx;
		margin: 0 auto;

		.yourAddress {
			height: 90rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 4rpx solid #ECEDED;
		}

		.form {
			// margin: 20rpx 0;
			display: flex;
			flex-direction: row;
			justify-content: start;
			align-items: center;
			height: 200rpx;

			.addAddress {
				width: 550rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;

				.selectStyle,
				.keyValue {
					width: 450rpx;
					padding: 0 40rpx !important;
				}

				.selectStyle {
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 0 10px;
					border: 1px solid #F4F4F4;
				}

				.keyValue {
					margin-top: 20rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border: 1px solid #F4F4F4;
				}
			}

			.search {
				color: #FFF;
				text-align: center;
				width: 150rpx;
				height: 80rpx;
				line-height: 80rpx;
				border-radius: 20rpx;
				background-color: #029640;
			}
		}
	}

	.storeDisplay {
		margin-top: 40rpx;

		.title {
			display: flex;
			justify-content: space-between;
			padding: 20rpx;
			border-bottom: 1px solid #ddd;
			font-weight: bold;
		}

		.item {
			// box-shadow: 0 0 10rpx -6rpx;
			// border-radius: 10rpx;
			// overflow: hidden;
			padding: 20rpx 20rpx;
			display: flex;
			justify-content: space-between;

			.logoBox {
				width: 140rpx;
				height: 140rpx;

				.shoplogo {
					width: 100%;
					height: 100%;
					// margin-right: 20rpx;
				}

			}



			.middle {
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				font-size: 26rpx;
				width: 400rpx;

				// border: #000000 1rpx solid;
				.sname {
					font-size: 30rpx;
					font-weight: 600;
				}

				.uname {
					margin-top: 10rpx;
					margin-bottom: 10rpx;

					.tel {
						margin-left: 40rpx;
					}
				}

				.address {
					padding-right: 12px;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
					color: #ababab;
				}
			}

			.right {
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				align-items: flex-end;

				.distance {
					font-size: 24rpx;
					width: 120rpx;
				}

				.OftenStore {
					font-weight: bold;
					color: red;
				}
			}
		}
	}
</style>
