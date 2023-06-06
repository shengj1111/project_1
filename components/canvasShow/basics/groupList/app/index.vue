<template>
	<div class="hom-pro-list" v-if="productData.length !== 0">
		<div class="title">
			<label>{{componentContent.title}}</label>
			<!-- <view class="btn-all a-link" @click="goGroupWorks(shopId!==0 && {shopId:shopId,id:componentContent.shopGroupWorkId})">查看全部<i class="iconfont icon-arrow-right"></i></view> -->
		</div>
		<div class="pro-box">
			<div class="pro-item" :class="{'pro-itemone':productData.length==1}" v-for="(item,index) in productData"
				:key="index" @click="goGoods(item)">
				<div class="pro-item-img">
					<image v-show="item.image" mode="widthFix" class="img" :src="item.image"></image>
				</div>
				<div class="pro-item-info">
					<label class="name">{{item.productName}}</label>
					<div class="price">
						<label class="unit">¥ </label>
						<label class="val"> {{item.price}}</label>
					</div>
					<label class="buyCount" v-if="item.workUsers">{{item.workUsers?item.workUsers:0}}人已拼</label>
				</div>
			</div>


		</div>
	</div>
</template>

<script>
	const NET = require('@/utils/request')
	const API = require('@/config/api')
	import {
		funMixin
	} from '../../../config/mixin'
	import store from '../../../config/mixin/store'
	export default {
		name: 'imageTextList',
		mixins: [funMixin],
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
			componentContent: {
				type: Object
			}
		},
		data() {
			return {
				productData: [],
			}
		},
		// watch: {
		//   'componentContent': {
		//     handler(newVal, oldVal) {
		//       this.getData()
		//     },
		//     deep: true
		//   }
		// },
		mounted() {
			this.getData()
		},
		methods: {
			getData() {
				const _ = this
				if (this.typeId === 1) {
					// 平台端
					// uni.showLoading({
					//   title: '加载中...'
					// })
					let _url =
						`${API.getProducts}?page=1&pageSize=99&type=1&ids=${_.componentContent.productData.productIdList}`
					NET.request1(_url, null, 'GET').then(res => {
						store.commit("loadNumReduce");
						_.productData = res.data.list
					}).catch(res => {
						store.commit("loadNumReduce");
					})
				} else if (this.typeId === 3) {
					// 商家端
					if (_.componentContent.shopGroupWorkId) {
						// uni.showLoading({
						//   title: '加载中...'
						// })
						let _url = `${API.getGroupWorks}?shopId=${_.shopId}&ids=${_.componentContent.shopGroupWorkId}`
						NET.request1(_url, null, 'GET').then(res => {
							if (res.data && res.data.length > 0) {
								let _a = res.data[0].products;
								// _a.push(res.data[0].products[0])
								_.productData = _a;
							}
							store.commit("loadNumReduce");
						}).catch(res => {
							store.commit("loadNumReduce");
						})
					} else {
						_.productData = []
						store.commit("loadNumReduce");
					}
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.hom-pro-list {
		width: 700rpx;
		margin: 0 auto;
		padding: 20upx 0;
		background-color: #fff;
		border-radius: 25rpx;

		.title {
			display: flex;
			align-items: center;
			position: relative;
			margin: 0 30upx 20upx;

			label {
				font-size: 30upx;
				font-weight: bold;
			}

			.btn-all {
				position: absolute;
				right: 0;
				top: 10upx;
				line-height: 22upx;
				padding-right: 20upx;
				font-size: 24upx;
				color: #999;

				.iconfont {
					content: '';
					position: absolute;
					right: 0;
					top: 0;
				}
			}
		}

		.pro-box {
			// padding-left: 15upx;
			margin-top: 40rpx;

			
			.pro-item {
				width: 330upx;
				padding-bottom: 10upx;
				background: #FFFFFF;
				box-shadow: 0px 2upx 9upx 0px rgba(51, 51, 51, 0.1);
				border-radius: 10upx;
				margin: 0;
				display: inline-block;
				margin-bottom: 20upx;
				margin-left: 20upx;
				
				&:nth-child(even){
					margin-left: 0;
					margin-left: 20upx;
				}
				
				.pro-item-img {
					.img {
						width: 100%;
						border-radius: 10upx 10upx 0upx 0upx
					}
				}

				.pro-item-info {
					text-align: center;

					.name {
						font-size: 24upx;
						font-weight: normal;
						line-height: 36upx;
						height: 74upx;
						display: -webkit-box;
						overflow: hidden;
						text-overflow: ellipsis;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					}

					.price {
						color: #FF7800;

						.unit {
							font-size: 22upx;
						}

						.val {
							font-size: 26upx;
						}
					}

					.buyCount {
						font-size: 20upx;
						color: #999;
						font-weight: normal;
					}
				}
			}

			.pro-itemone {
				width: 700rpx;

				.pro-item-info {
					text-align: center;

					.name {
						font-size: 32upx;
						font-weight: 600;
						line-height: 36upx;
						height: 50upx;

					}
					
					.price {
						color: #FF7800;
					
						.unit {
							font-size: 28upx;
						}
					
						.val {
							font-size: 34upx;
						}
					}

				}
			}
		}
	}
</style>
