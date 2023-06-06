<template>
	<view class="content">
		<view class="header">
			<view class="blue"></view>
			<view class="info">
				<view class="base">
					<view class="pic">
						<image :src="shopLogo"></image>
					</view>
					<view class="name">{{ shopName }}</view>
					<view class="id">ID: {{ shopid }}</view>
					<!-- <view class="name">
						<u-icon name="scan" color="#00AA49" size="40rpx"></u-icon>
					</view> -->
				</view>
				<view class="details">
					<view class="">
						<view class="num">{{ turnover }}</view>
						<view class="text">累计营业额(元)</view>
					</view>
					<!-- 		<view class="">
						<view class="num">{{frozenMoney}}</view>
						<view class="text">冻结金额(元)</view>
					</view> -->
					<view class="" @click="goTixian">
						<view class="num">{{ withdrawableMoney }}</view>
						<view class="text">可提现金额(元)</view>
					</view>
					<view class="">
						<view class="num">{{ withdrawableStayMoney }}</view>
						<view class="text">提现中(元)</view>
					</view>
				</view>
			</view>
			<view class="white"></view>
		</view>
		<u-gap height="20" bg-color="#F7F7F7"></u-gap>
		<view class="order-box">
			<view class="order-item" @click="goSetting">
				<image class="order-item-image" src="@/static/img/user/daifukuan1.png" mode="widthFix"></image>
				<view class="order-item-text">门店管理</view>
			</view>
			<!-- <view class="order-item" @click="$toUrl(`/pages_category_page3/merchants/order?shopid=${shopid}`)"> -->
			<view class="order-item" @click="goDingdan">
				<image class="order-item-image" src="@/static/img/user/daifahuo1.png" mode="widthFix"></image>
				<view class="order-item-text">订单管理</view>
			</view>
			<view class="order-item" @click="goOnlineCustomer">
				<image class="order-item-image" src="@/static/img/user/daishouhuo.png" mode="widthFix"></image>
				<view class="order-item-text">客服管理</view>
				<view class="weiduNum" v-if="weidu != 0">{{weidu}}</view>
			</view>
		</view>

		<view class="order-box">
			<view class="order-item" @click="goReceiptAccount">
				<image class="order-item-image" src="@/static/img/user/dingdan.png" mode="widthFix"></image>
				<view class="order-item-text">收款账户</view>
			</view>

			<!-- 	<view class="order-item" @click="gainCode">
				<image class="order-item-image" src="@/static/img/user/ewm.png" mode="widthFix">
				</image>
				<view class="order-item-text">二维码</view>
			</view> -->

			<view class="order-item"
				@click="$toUrl(`/pages_category_page3/merchants/erweima?imgUrl=${ewCode}&shopName=${shopName}&shopId=${shopid}`)">
				<image class="order-item-image" src="@/static/img/user/ewm.png" mode="widthFix"></image>
				<view class="order-item-text">二维码</view>
			</view>


			<view class="order-item" @click="$toUrl(`/pages_category_page3/merchants/waterList`)">
				<image class="order-item-image" src="@/static/img/user/daifahuo1.png" mode="widthFix"></image>
				<view class="order-item-text">提现流水</view>

			</view>
		</view>

		<view class="order-box">
			<view class="order-item" @click="goXiuGai">
				<image class="order-item-image" src="@/static/img/user/dingdan.png" mode="widthFix"></image>
				<view class="order-item-text">修改密码</view>
			</view>

			
			<view class="order-item"  @click="gojifenOrder">
				<image class="order-item-image" src="@/static/img/user/daifahuo1.png" mode="widthFix"></image>
				<view class="order-item-text">积分订单管理</view>
			</view>

			<view class="order-item">

			</view>
		</view>
		<u-popup v-model="showGainCode" mode="center" border-radius="50">
			<image class="order-item-image" :src="ewCode" mode="widthFix"></image>
		</u-popup>
	</view>
</template>
<style lang="scss"></style>
<script>
	import {
			getSjWdMessage,//商家获取未读信息的数量
			getChatUserId,//获取用户id
		} from '@/api/chat.js'
	import {
		getShopFinanceCount,
		getById
	} from '@/api/shopmanage.js';
	import {
		getCurShopid
	} from '@/api/common.js';
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	export default {
		components: {
			uniNavBar
		},
		data() {
			return {
				showGainCode: false, //是否展示二维码
				weidu:0,//未读信息
				shopid: 0,
				shopName: '',
				frozenMoney: 0,
				turnover: 0,
				withdrawableMoney: 0,
				withdrawableStayMoney: 0,
				shopLogo: '',
				shopList: [{
					src: 'https://img2.baidu.com/it/u=1145742942,4055967999&fm=26&fmt=auto&gp=0.jpg',
					title: '50包金牌外墙耐水腻子粉(14KG)送20桶C胶(红)',
					newPrice: '1300.0',
					oldPrice: '2140.0',
					saleNum: 173
				}],
				ewCode: ''
			};
		},
		onLoad(option) {
			this.shopid = option.shopid;
		},
		onShow() {
			this.bindShopinfo();
			// 获取聊天未读信息
			let myuid = uni.getStorageSync('userId')
			let shopid = uni.getStorageSync('liaotianshopid')
			getChatUserId({shopid,userid:myuid}).then(res=>{
				let myid = res.data.shop.shopid
				getSjWdMessage(myid).then(res=>{
					this.weidu = res.data[0].count
					console.log(res,'第二次请求的结果')
				})
				console.log(res,'聊天的id转换')
			})
		},

		methods: {
			gojifenOrder(){
				uni.navigateTo({
					url: `/pages_category_page2/userModule/jifenOrder`
				});
			},
			goXiuGai() {
				uni.navigateTo({
					url: `/pages_category_page2/userModule/xiugaimima`
				});
			},
			bindShopinfo() {
				const _this = this;
				let _shopid = _this.shopid;
				getShopFinanceCount(_shopid).then(res => {
					let _d = res.data;
					_this.frozenMoney = _d.frozenMoney;
					_this.turnover = _d.turnover;
					_this.withdrawableMoney = _d.withdrawableMoney;
					_this.withdrawableStayMoney = _d.withdrawableStayMoney;
				});
				getById(_shopid).then(res => {
					let _d = res.data;
					_this.shopName = _d.shopName;
					let _shoplogo = _d.shopLogo;
					if (_shoplogo == undefined || _shoplogo == '') {
						_shoplogo = '../../static/images/storeLogo.png';
					}
					_this.shopLogo = _shoplogo;
					_this.ewCode = _d.merchantImage;
				});
			},
			// 编辑门店信息
			goSetting() {
				uni.navigateTo({
					url: `EditStoreInfo/EditStoreInfo?shopId=${this.shopid}`
				});
			},
			//去订单管理
			goDingdan(){
				uni.navigateTo({
					url: `/pages_category_page3/merchants/order?shopid=${this.shopid}`
				});
			},
			//收款账户
			goReceiptAccount() {
				uni.navigateTo({
					url: `receiptAccount/receiptAccount?shopId=${this.shopid}`
				});
			},
			// 客服
			goOnlineCustomer() {
				uni.navigateTo({
					url: 'kefu?shopid=' + this.shopid
				});
			},



			goTixian() {
				//提现
				let _url = `withdrawal?shopId=${this.shopid}&canmoeny=${this.withdrawableMoney}`;
				this.$toUrl(_url);
			},
			//获取二维码
			gainCode() {
				this.showGainCode = true;
			}
		}
	};
</script>
<style lang="scss">
	.weiduNum{
		position: absolute;
		top: -5rpx;
		left: 130rpx;
		width: 40rpx;
		height: 40rpx;
		line-height: 40rpx;
		text-align: center;
		border-radius: 50%;
		background-color: red;
		color: #FFFFFF;
	}
	.content {
		margin: 0rpx auto 70rpx;
		padding-bottom: 41px;
	}

	.order-box {
		width: 690upx;
		height: 170upx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 0px 10upx 0px rgba(51, 51, 51, 0.1);
		border-radius: 10upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-left: 30upx;
		margin-bottom: 20upx;
		z-index: 10;

		.order-line {
			width: 12upx;
			height: 106upx;
		}

		.order-item {
			position: relative;
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

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
		}
	}

	.header {

		.blue,
		.white {
			height: 150rpx;
		}

		.blue {
			background-color: #00aa49;
		}

		.white {
			background-color: #fff;
		}

		.info {
			position: absolute;
			top: 125rpx;
			top: 20px;
			left: 25rpx;
			background-color: #fff;
			height: 250rpx;
			width: 700rpx;
			border-radius: 20rpx;
			border-bottom: 15rpx solid #00aa49;
			box-shadow: 0 0 20rpx -10rpx;

			.base {
				display: flex;
				justify-content: space-around;
				align-items: center;
				font-weight: bold;

				.pic {
					width: 140rpx;
					height: 140rpx;

					image {
						width: 100%;
						height: 100%;
						margin-top: -20rpx;
						margin-left: 20rpx;
						border-radius: 50%;
					}
				}

				.name {
					color: #00aa49;
				}
			}

			.details {
				/* width: 600rpx; */
				text-align: center;
				/* margin-left: 100rpx; */
				display: flex;
				justify-content: space-around;
				align-items: center;

				.num {
					font-size: 34rpx;
					font-weight: bold;
				}

				.text {
					font-size: 28rpx;
					color: #a2a3a3;
				}
			}
		}
	}

	.myOrder {
		width: 700rpx;
		margin: 0 auto;

		.title {
			font-weight: bold;
			font-size: 32rpx;
			padding: 20rpx 0;
			border-bottom: 2rpx solid #f0f0f0;
		}

		.icon {
			display: flex;
			justify-content: space-around;
			align-items: center;
			flex-wrap: wrap;
			text-align: center;
			padding: 30rpx 0;

			.item {
				width: 19%;
			}
		}
	}

	.itemWrap {
		width: 700rpx;
		margin: 0 auto;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;

		.shopItem {
			box-shadow: 0 0 20rpx -12rpx;
			margin-top: 20rpx;
			width: 340rpx;
			border-radius: 20rpx;
			overflow: hidden;

			image {
				height: 300rpx;
			}

			.text {
				padding: 10rpx;

				.itemTitle {
					font-size: 30rpx;
					padding-right: 12px;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}

				.price {
					margin: 15rpx 0;
					display: flex;
					align-items: flex-end;

					.symbol {
						font-size: 20rpx;
					}

					.newPrice {
						color: red;
						font-size: 32rpx;
					}

					.oldPrice {
						margin-left: 20rpx;
						text-decoration: line-through;
						color: #999;
						font-size: 26rpx;
					}
				}

				.saleNum {
					margin-bottom: 10rpx;
					font-size: 26rpx;
					color: #b3b5b8;
				}
			}
		}
	}

	.item-btn {
		width: 100%;
		height: 100upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		box-sizing: border-box;
		background-color: #fff;
		padding: 0 30upx;

		.item-btn-icon {
			width: 48upx;
			height: 48upx;
		}

		.item-btn-text {
			font-size: 28upx;
			margin-left: 20upx;
			font-weight: 500;
			flex: 1;
			color: rgba(102, 102, 102, 1);
		}

		.messNum {
			margin-left: 10rpx;
			font-size: 16rpx;
			background-color: red;
			color: #ffffff;
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
</style>
