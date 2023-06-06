<template>
	<view>
		<!-- 专题 -->
		<swiper class="banner" indicator-dots indicator-color="#FFFFFF" indicator-active-color="#FF7911" autoplay>
			<swiper-item class="banner-item" v-for="(item,index) in bannerList">
				<image :src="item" mode="widthFix" class="bannerImg"></image>
			</swiper-item>
		</swiper>
		<view class="flex-items-plus mar-top-20">
			<image class="choiceness" src="../../static/images/choiceness.png"></image>
		</view>
		<view>
			<!-- {{goodsList.productVOList}} -->
		</view>
		<view v-if="goodsList.productVOList.length>0">
			<view v-for="(item, index) in goodsList.productVOList" :key="item.id" class="goodsDetails-box flex-display flex-column mar-left-30"
			 @click="goodsDateils(item.id)">
				<view class="goodsDetails flex-items-plus flex-row mar-top-30">
					<image class="goodsImg" :src="item.imgs[0]"></image>
					<view class="mar-left-30">
						<view class="goodsName-box overflowNoDot">
							<!-- <image class="img618-cion" src="../../static/images/618.png"></image> -->
							<label class="goodsName fs26 mar-left-20">{{item.productName}}</label>
						</view>
						<view class="priceBuyNum-box mar-top-20">
							<label class="fs24 font-color-FF7800">¥</label>
							<label class="fs36 font-color-FF7800 mar-left-10">{{item.price}}</label>
							<label class="fs24 font-color-999 mar-left-10" v-if="item.buyCount != null">{{item.buyCount}}人付款</label>
							<label class="fs24 font-color-999 mar-left-10" v-else>0人付款</label>
						</view>
						<view class="flex-display flex-sp-between flex-row mar-top-10 flex-items">
							<label class="fs22 font-color-999">{{item.storeDTO.storeName}}</label>
							<image class="arrowImg" src="../../static/img/user/arrow.png"></image>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 为空 -->
		<view v-else class="emptyOrder-box flex-items-plus flex-column">
			<!-- <image class="emptyOrder-img" src="../../static/images/totalAwardEmpty.png"></image> -->
			<label class="font-color-999 fs26 mar-top-30">专题商品为空哦～</label>
		</view>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		data() {
			return {
				key: '',
				bannerList: [],
				goodsList: {
					productVOList:[]
				},
				subject:{},
				current: 1,
				size: 10,
			}
		},
		onLoad(options) {
			this.key = options.key
			this.getSubjectDetailByKeyList();
		},
		methods: {
			getSubjectDetailByKeyList() {
				let _this = this
				uni.showLoading({
					title: '加载中...'
				})
				NET.request(API.SubjectWithProduct + this.key, {
					current: this.current,
					map: {},
					model: {},
					order: 'descending',
					size: this.size,
					sort: 'id'

				}, 'POST').then(res => {
					uni.hideLoading()
					_this.bannerList.push(res.data.subject.banner)
					_this.goodsList = res.data.productPageVO
					_this.subject = res.data.subject
					uni.setNavigationBarTitle({
					　　title:res.data.subject.title
					})

				}).catch(res => {
					uni.hideLoading()
				})
			},
			goodsDateils(id){
				uni.navigateTo({
					url:`/pages_category_page3/merchants/goodsDetails?id=${id}`
				})
				
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FBE7E0;
	}

	.bannerImg {
		height: 300upx;
		width: 100%;
	}

	.choiceness {
		height: 60upx;
		width: 300upx;
	}

	.goodsDetails-box {
		width: 690upx;
		background: #fff;
		margin-top: 10upx;
		border-radius: 10upx;
		padding: 0 20upx;
		box-sizing: border-box;

		.goodsDetails {
			padding-bottom: 30upx;

			.goodsName-box {
				width: 389upx;
				height: 85upx;

				.img618-cion {
					width: 70upx;
					height: 36upx;
				}
			}

			.goodsImg {
				width: 260upx;
				height: 260upx;
			}

			.discounts-box {
				margin-left: -10upx;
				margin-top: 20upx;

				.discounts-text {
					margin-left: 10upx;
					color: #FF7800;
					background-color: #FFE4CC;
					padding: 6upx 12upx;
					border-radius: 4upx;
				}
			}

			.arrowImg {
				width: 20upx;
				height: 20upx;
			}
		}


	}
</style>
