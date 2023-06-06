<template>
	<div class="layout hom-layout">


		<div class="list-group-item" v-for="(item,index) in componentsData.slice(0,1)" :key="index">
			<!-- 	<component :is="componentMap[terminal-1].get(item.type)" :componentContent="item.componentContent" :terminal="terminal"
			 @tabChange='tabChange'></component> -->
			<com-shop-header v-if="item.type==='shopHeader'" :noticeList="noticeList"
				:componentContent="item.componentContent" :terminal="terminal" @tabChange='tabChange'></com-shop-header>

			<com-text v-if="item.type==='text'" :componentContent="item.componentContent" :terminal="terminal">
			</com-text>
			<com-image-text v-if="item.type==='imageText'" :componentContent="item.componentContent"
				:terminal="terminal"></com-image-text>
			<com-brand-list v-if="item.type==='brandList'" :componentContent="item.componentContent"
				:terminal="terminal"></com-brand-list>
			<com-category-list v-if="item.type==='categoryList'" :componentContent="item.componentContent"
				:terminal="terminal"></com-category-list>



			<com-image-text-list v-if="item.type==='imageTextList'" :componentContent="item.componentContent"
				:terminal="terminal"></com-image-text-list>
			<com-assist-div v-if="item.type==='assistDiv'" :componentContent="item.componentContent"
				:terminal="terminal"></com-assist-div>
			<com-image-text-nav v-if="item.type==='imageTextNav'" :componentContent="item.componentContent"
				:terminal="terminal"></com-image-text-nav>


			<com-product-list v-if="item.type==='productList'" :componentContent="item.componentContent"
				:terminal="terminal"></com-product-list>
			<com-video-box v-if="item.type==='videoBox'" :componentContent="item.componentContent" :terminal="terminal">
			</com-video-box>
			<com-coupon v-if="item.type==='coupon'" :componentContent="item.componentContent" :terminal="terminal"
				:typeId="typeId">
			</com-coupon>
			<com-custom v-if="item.type==='custom'" :componentContent="item.componentContent" :terminal="terminal">
			</com-custom>
			<com-group-list v-if="item.type==='groupList'" :componentContent="item.componentContent"
				:terminal="terminal" :typeId="typeId">
			</com-group-list>
			<com-discount-list v-if="item.type==='discountList'" :componentContent="item.componentContent"
				:terminal="terminal" :typeId="typeId">
			</com-discount-list>
			<com-spike-list v-if="item.type==='spikeList'" :componentContent="item.componentContent"
				:terminal="terminal" :typeId="typeId">
			</com-spike-list>


		</div>



		<div v-if="activeTab === 0">
			<div class="list-group-item" v-for="(item,index) in componentsData.slice(1)" :key="index">
				<!-- <component :is="componentMap[terminal-1].get(item.type)" :componentContent="item.componentContent" :terminal="terminal"
				 @tabChange='tabChange'></component> -->
				<com-shop-header v-if="item.type==='shopHeader'" :componentContent="item.componentContent"
					:terminal="terminal" @tabChange='tabChange'></com-shop-header>
				<com-text v-if="item.type==='text'" :componentContent="item.componentContent" :terminal="terminal">
				</com-text>
				<com-image-text v-if="item.type==='imageText'" :componentContent="item.componentContent"
					:terminal="terminal"></com-image-text>
				<com-brand-list v-if="item.type==='brandList'" :componentContent="item.componentContent"
					:terminal="terminal"></com-brand-list>
				<com-category-list v-if="item.type==='categoryList'" :componentContent="item.componentContent"
					:terminal="terminal"></com-category-list>
				<com-image-text-list v-if="item.type==='imageTextList'" :componentContent="item.componentContent"
					:terminal="terminal"></com-image-text-list>
				<com-assist-div v-if="item.type==='assistDiv'" :componentContent="item.componentContent"
					:terminal="terminal"></com-assist-div>
				<com-image-text-nav v-if="item.type==='imageTextNav'" :componentContent="item.componentContent"
					:terminal="terminal"></com-image-text-nav>
				<com-product-list :class="'plist'+index" v-if="item.type==='productList'"
					:componentContent="item.componentContent" :terminal="terminal"></com-product-list>
				<com-video-box v-if="item.type==='videoBox'" :componentContent="item.componentContent"
					:terminal="terminal"></com-video-box>
				<com-coupon v-if="item.type==='coupon'" :componentContent="item.componentContent" :terminal="terminal"
					:typeId="typeId">
				</com-coupon>
				<com-custom v-if="item.type==='custom'" :componentContent="item.componentContent" :terminal="terminal">
				</com-custom>
				<com-group-list v-if="item.type==='groupList'" :componentContent="item.componentContent"
					:terminal="terminal" :typeId="typeId">
				</com-group-list>
				<com-discount-list v-if="item.type==='discountList'" :componentContent="item.componentContent"
					:terminal="terminal" :typeId="typeId">
				</com-discount-list>
				<com-spike-list v-if="item.type==='spikeList'" :componentContent="item.componentContent"
					:terminal="terminal" :typeId="typeId">
				</com-spike-list>
			</div>
		</div>
		<view v-else class="goodRecommend">
			<view class="goos-box mar-left-10" v-if="categoryListLen>0">
				<view class="goodRecommend-box mar-left-20 mar-top-30 flex-display flex-column"
					v-for="(item,index) in goodsCategoryList" :key="index" @click="goGoods(item)">
					<div class="goodsImg-box">
						<img v-show="item.image" class="img" :src="item.image">
					</div>
					<div class="goodRecommendDetail-box">
						<label class="productName">{{item.productName}}</label>
						<label class="buyCount">{{item.users}}人付款</label>
						<div class="priceBox">
							<div class="price">
								<label class="unit">¥ </label>
								<label class="val"> {{item.price}}</label>
							</div>
							<div class="originalPrice">
								<label class="unit">¥ </label>
								<label class="val"> {{item.originalPrice}}</label>
							</div>
						</div>
						<div class="shopName" @click.stop="goStore(item)">
							<label>{{item.shopName}}</label>
							<!--<img class="storeArrow-icon pad-right-20" src="./assets/images/arrowRight.png">-->
						</div>
					</div>
				</view>
			</view>
			<view v-if="categoryListLen == 0" class="emptyCart-box flex-items-plus flex-column">
				<!-- <image class="emptyCart-img" src="../../static/assets/img/bgnull.png" mode="widthFix"> -->
					<label class="font-color-999 fs26 mar-top-30">这里空空如也~</label>
			</view>
		</view>
		<loading-toast ref='loadingToast'></loading-toast>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	// import comComponentMap from './componentMap'
	import comShopHeader from '@/components/canvasShow/cereshop/app/web/shopHeader'
	import comText from '@/components/canvasShow/basics/text'
	import comImageText from '@/components/canvasShow/basics/imageText'
	import comBrandList from '@/components/canvasShow/basics/brandList'
	import comCategoryList from '@/components/canvasShow/basics/categoryList'
	import comImageTextList from '@/components/canvasShow/basics/imageTextList'
	import comAssistDiv from '@/components/canvasShow/basics/assistDiv'
	import comImageTextNav from '@/components/canvasShow/basics/imageTextNav'
	import comProductList from '@/components/canvasShow/basics/productList/app/index'
	import comVideoBox from '@/components/canvasShow/basics/video'
	import comCoupon from '@/components/canvasShow/basics/coupon'
	import comCustom from '@/components/canvasShow/basics/custom'
	import comGroupList from '@/components/canvasShow/basics/groupList/app/index'
	import comDiscountList from '@/components/canvasShow/basics/discountList'
	import comSpikeList from '@/components/canvasShow/basics/spikeList'
	import loadingToast from './components/toast'
	const NET = require('@/utils/request')
	const API = require('@/config/api')
	import store from './config/mixin/store'
	import {
		funMixin
	} from './config/mixin'
	export default {
		name: 'canvasPage',
		mixins: [funMixin],
		components: {
			comShopHeader,
			comText,
			comImageText,
			comBrandList,
			comCategoryList,
			comImageTextList,
			comAssistDiv,
			comImageTextNav,
			comProductList,
			comVideoBox,
			comCoupon,
			comCustom,
			comGroupList,
			comDiscountList,
			comSpikeList,
			loadingToast
		},
		data() {
			return {
				// terminal: 4, // 画布设备 1 小程序，2 H5，3 App 4 电脑
				// typeId: 3, // 画布类型 1 平台画布，2 自定义页面，3 商家门店装修
				// shopId: 0, // 门店id
				componentsData: [],
				componentsShowData: [],
				activeComponent: -1,
				// componentMap: componentMap,
				goodsCategoryList: [],
				categoryListLen: 0,
				activeTab: 0,
				noticeList: []
			}
		},
		props: {
			terminal: {
				type: Number,
				default: 4
			},
			typeId: {
				type: Number,
				default: 1
			},
			shopId: {
				type: Number,
				default: 0
			},
			canvasId: {
				type: Number,
				default: 0
			}
		},
		// onShow() {
		// 	this.$nextTick(function() {
		// 		this.canvasGet()
		// 		this.getNotice()
		// 	})
		// },
		mounted() {
			this.$nextTick(function() {
				this.canvasGet()
				this.getNotice()
			})
		},
		methods: {
			// 读取画布
			canvasGet() {
				var _this = this
				this.$refs.loadingToast.setCanvasLoading(true)
				var apiUrl = API.getCanvas + '?terminal=' + this.terminal + '&type=' + this.typeId
				if (this.shopId) {
					apiUrl += '&shopId=' + this.shopId
				}
				if (this.canvasId) {
					apiUrl += '&canvasId=' + this.canvasId
				}
				console.log(998855)
				NET.request1(apiUrl, null, 'GET').then(res => {
					this.$refs.loadingToast.setCanvasLoading(false)
					
					// uni.hideLoading()
					if (JSON.stringify(res.data) !== '{}') {
						// _this.canvasId = res.data.canvasId
						this.componentsData = JSON.parse(res.data.json)
						var componentsData = this.componentsData
						for (let i = 0; i < componentsData.length; i++) {
							if (componentsData[i].type === 'productList') {
								this.$refs.loadingToast.setCanvasLoading(true)
								console.log(12312344)
								store.commit("loadNumAdd");
								if (componentsData[i].componentContent.productData.sourceType === '1') {
									NET.request1(
										`${API.getProducts}?page=1&pageSize=99&ids=${componentsData[i].componentContent.productData.productIdList}`,
										null,
										'GET').then(proRes => {
										store.commit("loadNumReduce");
										componentsData[i].componentContent.productData.imgTextData = proRes
											.data.list
									})
								} else if (componentsData[i].componentContent.productData.sourceType === '2') {
									NET.request1(
										`${API.getProducts}?page=1&pageSize=99&classifyId=${componentsData[i].componentContent.productData.categoryId}`,
										null,
										'GET').then(proRes => {
										store.commit("loadNumReduce");
										componentsData[i].componentContent.productData.imgTextData = proRes
											.data.list
									})
								}
							} else if (componentsData[i].type === 'coupon' || componentsData[i].type ===
								'groupList' || componentsData[i].type === 'spikeList' || componentsData[i].type ===
								'discountList') {
								this.$refs.loadingToast.setCanvasLoading(true)
								store.commit("loadNumAdd");
							}
						}
					}
				}).catch(res => {
					//  uni.hideLoading()
				})
			},
			tabChange(index, id) {
				this.activeTab = index
				if (index !== 0) {
					NET.request1(`${API.getProducts}?page=1&pageSize=20&classifyId=${id}`, null, 'GET').then(proRes => {
						this.goodsCategoryList = proRes.data.list
						this.categoryListLen = proRes.data.total
					})
				}
			},
			getNotice() {
				NET.request(API.getNotice, {}, 'GET').then(res => {
					if (res.code === '200') {
						this.noticeList = res.data
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.hom-layout {
		padding-bottom: 30rpx;
		background-color: #f7f7f7;
	}
</style>

<style lang="scss">
	.warp {
		width: 700rpx;
		margin: 0 auto;
		max-width: 100%;
		background: transparent !important;

		&.terminal4 {
			width: 1250upx;
			max-width: 96%;
		}
	}

	.list-group-item {
		background-color: #F7F7F7;
		//background-color: #007AFF;
	}

	.flex-box {
		display: flex;
	}

	.goodRecommend {
		background-color: #fff;
		margin-top: 20upx;
		position: relative;
		z-index: 2;

		.goos-box {
			display: flex;
			flex-wrap: wrap;
			flex-direction: row;
		}

		.goodRecommend-titleImg {
			width: 44upx;
			height: 44upx;
		}

		.goodsImg-box {
			width: 336upx;
			height: 336upx;
			background-color: #f5f5f5;
			border-radius: 10upx 10upx 0 0;

			.img {
				width: 100%;
				height: 100%;
				object-fit: contain;
			}
		}

		.storeArrow-icon {
			width: 20upx;
			height: 20upx;
		}

		.recommendGoods-title {
			width: 295upx;
			display: block;
			word-break: keep-all;
			/* 不换行 */
			white-space: nowrap;
			/* 不换行 */
			overflow: hidden;
			/* 内容超出宽度时隐藏超出部分的内容 */
		}

		.goodRecommend-box {
			width: 336upx;

			.goodRecommendDetail-box {
				background-color: #FFFFFF;
				box-shadow: 0px 0px 15upx 0px rgba(52, 52, 52, 0.15);
				border-radius: 0 0 10upx 10upx;
				padding: 20upx;

				label {
					font-weight: normal;
				}

				.productName {
					font-size: 28upx;
					color: #333;
					display: block;
					margin-bottom: 18upx;
				}

				.buyCount {
					color: #999;
					font-size: 24upx;
					margin-bottom: 10upx;
					display: block;
				}

				.priceBox {
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					margin-bottom: 10upx;

					.price {
						color: #FF7800;

						.unit {
							font-size: 24upx;
						}

						.val {
							font-size: 36upx;
						}
					}

					.originalPrice {
						font-size: 24upx;
						color: #999;
						text-decoration: line-through;
					}
				}

				.shopName {
					display: flex;
					justify-content: space-between;
					font-size: 22upx;
					color: #999;

					label {
						color: #999;
					}
				}
			}

			.recommendGoodsDes {
				width: 295px;
			}
		}
	}

	.emptyCart-img {
		width: 320rpx;
		height: 320rpx;
		margin-top: 300rpx;
	}
</style>
