<template>
	<div class="layout hom-layout">
		<!--  -->
		<div class="list-group-item" v-for="(item,index) in componentsData" :key="index">
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

			<!-- 2022.1.6 调整这块组件 -->
			<com-image-text-nav v-if="item.type==='imageTextNav'" :componentContent="item.componentContent"
				:terminal="terminal"></com-image-text-nav>

			<!-- 这个组件就是我要修改的 -->
			<com-product-list v-if="item.type==='productList'" :componentContent="item.componentContent"
				:terminal="terminal"></com-product-list>

			<com-video-box v-if="item.type==='videoBox'" :componentContent="item.componentContent" :terminal="terminal">
			</com-video-box>
			<com-coupon v-if="item.type==='coupon'" :componentContent="item.componentContent" :terminal="terminal"
				:typeId="typeId" :shopId="shopId">
			</com-coupon>
			<com-custom v-if="item.type==='custom'" :componentContent="item.componentContent" :terminal="terminal">
			</com-custom>
			<com-group-list v-if="item.type==='groupList'" :componentContent="item.componentContent"
				:terminal="terminal" :typeId="typeId" :shopId="shopId">
			</com-group-list>

			<!-- 限时折扣 -->
			<com-discount-list v-if="item.type==='discountList'" :componentContent="item.componentContent"
				ref='myDiscount' :terminal="terminal" :typeId="typeId" :shopId="shopId">
			</com-discount-list>

			<!-- 秒杀也要改 -->
			<com-spike-list v-if="item.type==='spikeList'" :componentContent="item.componentContent" ref='mySpikeList'
				:terminal="terminal" :typeId="typeId" :shopId="shopId">
			</com-spike-list>

		</div>
		<loading-toast ref='loadingToast'></loading-toast>
	</div>
</template>

<script>
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
				componentsData: [], //画布返回的所有商品
				componentsShowData: [],
				activeComponent: -1,
				// componentMap: componentMap,
				goodsCategoryList: [],
				categoryListLen: 0,
				activeTab: 0,
				noticeList: [],
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
			},
			myCanvas: {
				type: Number,

			}
		},
		watch: {
			shopId: function(newval, oldval) {
				if (newval != oldval) {
					this.canvasGet()
				}
			},
			myCanvas: {
				handler(newval, oldval) {
					if (newval != oldval) {
						if(this.$refs.mySpikeList && this.$refs.mySpikeList.length > 0){
							this.$refs.mySpikeList[0].getData()
						}
						if(this.$refs.myDiscount && this.$refs.myDiscount.length > 0){
							this.$refs.myDiscount[0].getData()
						}
						
// this.$refs.mySpikeList[0].getData()
// 	this.$refs.myDiscount[0].getData()
						// console.log(this.$refs.mySpikeList[0], '组件实例')
					}
				}
			}
		},
		mounted() {
			
			this.$nextTick(function() {
				console.log('有没有进入 mounted 生命周期')
				this.canvasGet()
			})
		},
		methods: {
			// 读取画布
			canvasGet() {
				console.log('开始获取画布')
				var _this = this
				this.$refs.loadingToast.setCanvasLoading(true)
				var apiUrl = API.getCanvas + '?terminal=' + this.terminal + '&type=' + this.typeId
				if (this.shopId) {
					apiUrl += '&shopId=' + this.shopId
				}
				if (this.canvasId) {
					apiUrl += '&canvasId=' + this.canvasId
				}
				NET.request1(apiUrl, null, 'GET').then(res => {
					console.log(res,apiUrl,'获取画布成功345')
					this.$refs.loadingToast.setCanvasLoading(false)
					if (JSON.stringify(res.data) !== '{}') {
						// _this.canvasId = res.data.canvasId

						//json 就是画布返回的所有商品
						this.componentsData = JSON.parse(res.data.json)
						console.log(this.componentsData, '画布的所有东西')
						var componentsData = this.componentsData
						for (let i = 0; i < componentsData.length; i++) {
							// 判断是否等于商品列表
							if (componentsData[i].type === 'productList') {

								store.commit("loadNumAdd");
								if (componentsData[i].componentContent.productData.sourceType === '1') {
									let arr = componentsData[i].componentContent.productData.productIdList
									console.log(arr, 'ids数组是否为空')
									if (arr != [] && arr.length > 0) {
										NET.request1(
											`${API.getProducts}?page=1&pageSize=99&ids=${componentsData[i].componentContent.productData.productIdList}`,
											null,
											'GET').then(proRes => {
											store.commit("loadNumReduce");
											// 根据 id 拿到所有的商品信息,然后赋值给 imgTextData 他本来是返回空数组,然后在这里被赋值
											componentsData[i].componentContent.productData.imgTextData =
												proRes.data.list
										}).catch(res => {
											store.commit("loadNumReduce");
										})
									}

								} else if (componentsData[i].componentContent.productData.sourceType === '2') {
									NET.request1(
										`${API.getProducts}?page=1&pageSize=99&classifyId=${componentsData[i].componentContent.productData.categoryId}`,
										null,
										'GET').then(proRes => {
										store.commit("loadNumReduce");
										componentsData[i].componentContent.productData.imgTextData = proRes
											.data.list
									}).catch(res => {
										store.commit("loadNumReduce");
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
					console.log(res,'获取画布报错了')
				})
			},
			tabChange(index, id) {
				this.activeTab = index
				NET.request1(`${API.getProducts}?page=1&pageSize=20&classifyId=${id}`, null, 'GET').then(proRes => {
					this.goodsCategoryList = proRes.data.list
					this.categoryListLen = proRes.data.total
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.hom-layout {
		background-color: #fff;
	}
</style>

<style lang="scss">
	.warp {
		width: 690upx;
		margin: 0 auto;
		max-width: 100%;

		&.terminal4 {
			width: 1250upx;
			max-width: 96%;
		}
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
