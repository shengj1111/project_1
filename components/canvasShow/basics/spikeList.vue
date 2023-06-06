<template>
	<div class="hom-pro-list warp" :class="'terminal'+terminal" v-if=" firstProduct">
		<div class="title" :class="'text-align-'+componentContent.textAlign">
			<h2 class="h2">{{componentContent.title}}</h2>
			<view class="btn-all" @click="goSeckills(shopId!==0 && {shopId:shopId,id:componentContent.shopSeckillId})">
				查看全部<i class="iconfont icon-arrow-right"></i></view>
			<div class="tabList" v-show="componentContent.labelShow">
				<ul>
					<li v-for="(item,index) in componentContent.labelList" :key="index">
						<a class="a-link" @click="jumpLink(item.linkObj)">{{item.name}}</a>
					</li>
				</ul>
			</div>
		</div>
		<div
			v-if="(componentContent.shopSeckillId && skillsInfo && count.length > 0) || componentContent.productData.productIdList !==0" >
			<div class="discountList" v-if="terminal === 4" :class="this.typeId === 1 && 'pc'">
				<div class="listLeft">
					<img src="../static/images/shop/miaosha2x.png" alt="">
					<div class="bgBox">
						<div class="endTime">{{skillsInfo.seckillName}}</div>
						<div class="line"></div>
						<div class="endTimeText">距离{{count[0]}}还剩</div>
						<div class="timeBox">
							<span>{{count[1]}}</span><i>:</i><span>{{count[2]}}</span><i>:</i><span>{{count[3]}}</span>
						</div>
						<button
							@click="goSeckills(shopId!==0 && {shopId:shopId,id:componentContent.shopSeckillId})">查看全部></button>
					</div>
				</div>
				<div class="listRight">
					<div class="listItem" v-for='it in skillsInfo.products' :key='it.productId' @click="mygoGoods(it)">
						<div class="imgBox">
							<image :src="it.image" mode="widthFix" style="width: 100%;"></image>
						</div>
						<div class="itemInfo">
							<h3>{{it.productName}}</h3>
							<div class="begrenzt" v-if="it.limitNumber && it.limitNumber>0">
								<span class="people">还剩{{it.stockNumber}}件</span>
								<el-slider v-model="it.sliderVal" :max="it.total" :show-tooltip="false" disabled>
								</el-slider>
							</div>
							<div class="discountPrice">
								<span>折扣价￥</span><b>{{it.price}}</b>
							</div>
							<div class="originalPrice">原价：¥{{it.originalPrice}}</div>
						</div>
					</div>
				</div>
			</div>
			<div class="mobileList" v-else>
				<div class="topList mItem" @click="mygoGoods(firstProduct)" v-if='firstProduct'>
					<div class="topImgBg">
						<image :src="firstProduct.image" mode="widthFix" style="width: 100%;"></image>
						<div class="leftText">
							<!-- <image class="img" src="../../../static/assets/images/iconSpike.png"></image> -->
							<span>秒杀活动</span>
						</div>
						<div class="rightDateBox">
							<span v-if="count && count.length> 0">距{{count[0]}}还有
								{{`${count[1]}:${count[2]}:${count[3]}`}}</span>
							<span v-if="firstProduct.count && firstProduct.count.length> 0">距{{firstProduct.count[0]}}
								{{`${firstProduct.count[1]}:${firstProduct.count[2]}:${firstProduct.count[3]}`}}</span>
						</div>
					</div>
					<div class="itemInfo">
						<div class="itemTit">
							<h3>{{firstProduct.productName}}</h3>
							<!-- <span
								v-if="firstProduct.limitNumber && firstProduct.limitNumber>0">剩余{{firstProduct.stockNumber}}件</span> -->
						</div>
						<div class="Price">
							<span><label class="b">￥</label>{{firstProduct.price}}</span>
							<span>¥ {{firstProduct.originalPrice}}</span>
						</div>
					</div>
				</div>
				<div class="listBox">
			<!-- 		<div class="mItem" v-for='it in appProducts' :key='it.productId' @click="mygoGoods(it)">
						<div class="topImgBg">
							<image :src="it.image" mode="widthFix" style="width: 100%;"></image>
							<div class="leftText">
				
								<span>秒杀</span>
							</div>
							<div class="rightDateBox">
								<span v-if="count && count.length> 0">距{{count[0]}}
									{{`${count[1]}:${count[2]}:${count[3]}`}}</span>
								<span v-if="it.count && it.count.length> 0">距{{it.count[0]}}
									{{`${it.count[1]}:${it.count[2]}:${it.count[3]}`}}</span>
							</div>
						</div>
						<div class="itemInfo">
							<div class="itemTit">
								<h3>{{it.productName}}</h3>
							</div>

							<div class="surplus" v-if="it.limitNumber && it.limitNumber>0">剩余{{it.stockNumber}}件</div>
							<div class="Price">
								<span><label class="b">￥</label>{{it.price}}</span>
								<span>¥ {{it.originalPrice}}</span>
							</div>
						</div>
					</div> -->
					<div class="clearfix"></div>
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
	} from '../config/mixin'
	import store from '../config/mixin/store'
	export default {
		name: 'spikeList',
		mixins: [funMixin],
		data() {
			return {
				skillsInfo: {},
				firstProduct: null,
				appProducts: [],
				count: [],
				timer: null
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
			componentContent: {
				type: Object
			}
		},
		watch: {
		  'componentContent': {
		    handler(newVal, oldVal) {
		      this.getData()
		    },
		    deep: true
		  }
		},
		mounted() {
			this.getData()
		},
	
		methods: {
			getData() {
				const _ = this
				console.log(this.typeId,2342342423)
				if (this.typeId === 1) {
					// 平台端
					// uni.showLoading({
					//   title: '加载中...'
					// })
					NET.request1(
						`${API.getProducts}?page=1&pageSize=99&type=2&ids=${_.componentContent.productData.productIdList}`,
						null, 'GET').then(res => {
						if (res.data.list.length > 0) {
							_.skillsInfo.products = res.data.list
							_.skillsInfo.products.map(function(value) {
								value.sliderVal = value.total - value.stockNumber
								return value;
							});

							_.timer = setInterval(() => {
								_.skillsInfo.products.map(function(value) {
									value.count = _.getTime(value)
									return value;
								});
								_.$forceUpdate()
							}, 1000)
							_.firstProduct = _.skillsInfo.products[0]
							console.log(_.firstProduct, '_.firstProduct')
							_.appProducts = _.skillsInfo.products.slice(1, 3)
							_.$forceUpdate()
						}
						store.commit("loadNumReduce");
					}).catch(res => {
						store.commit("loadNumReduce");
					})
				} else if (this.typeId === 3) {
					// 商家端
					if (_.componentContent.shopSeckillId) {
						// uni.showLoading({
						//   title: '加载中...'
						// })
						NET.request(`${API.getSeckills}?shopId=${_.shopId}&ids=${_.componentContent.shopSeckillId}`, null,
							'GET').then(res => {
							if (res.data.length > 0) {
								_.skillsInfo = res.data[0]
								_.skillsInfo.products.splice(4)
								_.skillsInfo.products.map(function(value) {
									value.sliderVal = value.total - value.stockNumber
									return value;
								});
								_.firstProduct = _.skillsInfo.products[0]
								_.appProducts = _.skillsInfo.products.slice(1, 3)
								// 只有进行中和未开始活动, 用倒计时
								if (_.skillsInfo.state !== 2) {
									_.count = _.getTime(_.skillsInfo)
									this.timer = setInterval(() => {
										_.count = _.getTime(_.skillsInfo)
									}, 1000)
								}
							}
							store.commit("loadNumReduce");
						}).catch(res => {
							store.commit("loadNumReduce");
						})
					} else {
						_.skillsInfo = {}
						_.firstProduct = {}
						_.appProducts = []
						store.commit("loadNumReduce");
					}
				}
			},
			getTime(info) {
				const date = new Date().getTime()
				let startTime = '',
					endTime = ''
				if (info.effectiveStart) {
					startTime = new Date(info.effectiveStart.replace(/-/g, '/')).getTime()
					endTime = new Date(info.effectiveEnd.replace(/-/g, '/')).getTime()
				} else {
					startTime = new Date(info.startTime.replace(/-/g, '/')).getTime()
					endTime = new Date(info.endTime.replace(/-/g, '/')).getTime()
				}
				if (startTime > date) {
					return this.countDown(startTime - date, true) // 未开始
				} else {
					return this.countDown(endTime - date) // 进行中
				}

			},

			countDown(time, isStart) {
				const fn = (v) => v < 10 ? `0${v}` : v
				const t = parseInt(time / 1000)
				const text = isStart ? '开始' : '结束'
				const hour = parseInt(t / 3600)
				const min = parseInt((t % 3600) / 60)
				const s = t % 60
				return [text, fn(hour), fn(min), fn(s)]
			}
		},
		beforeDestroy() {
			clearInterval(this.timer)
		}
	}
</script>

<style lang="scss" scoped>
	.hom-pro-list {
		padding: 20rpx 20rpx 0;
		padding-left: 0;
		padding-right: 0;
		width: 700rpx;
		margin: 0 auto;
		border-radius: 10rpx;
		background-color: #fff;

		.title {
			margin-bottom: 23upx;
			position: relative;
			padding: 10px 0 0;

			.h2 {
				font-size: 30upx;
				color: #333;
				line-height: 1em;
				font-weight: bold;
			}

			.btn-all {
				position: absolute;
				right: 20rpx;
				top: 20rpx;
				line-height: 22upx;

				.iconfont {
					content: '';
					position: absolute;
					right: 0;
					top: 0;
				}
			}

			.tabList {
				ul {
					li {
						display: inline-block;
						padding: 0 12upx 0 20upx;
						position: relative;

						a:hover {
							color: $mainColor;
						}

						&:after {
							content: '/';
							position: absolute;
							left: 0;
							top: 0;
						}

						&:first-child {
							padding-left: 0;

							&:after {
								display: none;
							}
						}
					}
				}
			}

			&.text-align-left {
				.tabList {
					position: absolute;
					right: 100upx;
					bottom: 0;
					line-height: 22upx;
				}
			}

			&.text-align-center {
				text-align: center;

				.tabList {
					margin-top: 20upx;
				}
			}
		}

		.discountList {
			display: flex;

			.listLeft {
				width: 256upx;
				height: 412upx;
				text-align: center;
				position: relative;

				img {
					width: 100%;
					height: 100%;
				}

				.bgBox {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;

					.endTime {
						font-size: 30upx;
						color: #615548;
						margin-bottom: 22upx;
						margin-top: 80upx;
					}

					.line {
						width: 24upx;
						height: 2upx;
						background: #524B3D;
						margin: 0 auto 22upx auto;
					}

					.endTimeText {
						font-size: 20upx;
						color: #615548;
						margin-bottom: 22upx;
					}

					.timeBox {
						display: flex;
						align-items: center;
						justify-content: center;
						margin-bottom: 55upx;

						span {
							display: block;
							width: 45upx;
							height: 45upx;
							background: #54493C;
							color: #FFFFFF;
							font-size: 22upx;
							line-height: 45upx;
						}

						i {
							font-size: 14upx;
							color: #54493C;
							font-style: normal;
							font-weight: bold;
							padding: 0 2upx;
						}
					}

					button {
						width: 126upx;
						height: 34upx;
						background: #615548;
						border: 1px solid #54493C;
						border-radius: 17upx;
						color: #FFFFFF;
						font-size: 16upx;
					}
				}
			}

			.listRight {
				margin-left: 13upx;
				display: flex;

				.listItem {
					width: 100%;
					margin-right: 14upx;

					.imgBox {
						width: 100%;

						image {
							width: 100%;
						}
					}

					.itemInfo {
						h3 {
							font-size: 18upx;
							color: #333434;
							line-height: 28upx;
							margin: 10upx 0 3upx 0;
						}
					}
				}

				.listItem:nth-child(4n) {
					margin-right: 0;
				}
			}
		}

		.begrenzt {
			display: flex;
			align-items: center;

			::v-deep .el-slider__runway {
				width: 124upx;
				border-radius: 0;
				border: 1upx solid #FF736C;
				background: #F5F5F5;
				height: 16upx;
				margin: 10upx 0;

				.el-slider__bar {
					background-color: #FF736C !important;
				}

				.el-slider__button-wrapper {
					display: none;
				}

				.el-slider__bar {
					height: 16upx;
					border-top-left-radius: 0;
					border-bottom-left-radius: 0;
				}
			}

			.people {
				color: #999999;
				font-size: 14upx;
				margin-right: 5upx;
			}
		}

		.discountPrice {
			span {
				font-size: 18upx;
				color: $mainColor;
			}

			b {
				font-size: 26upx;
				color: $mainColor;
			}
		}

		.originalPrice {
			margin-top: 8upx;
			font-size: 16upx;
			color: #666666;
			text-decoration: line-through;
		}

		.mobileList {
			padding: 20rpx 0 0;

			.mItem {

				background: #FFFFFF;
				box-shadow: 0 10upx 15upx 0 rgba(51, 51, 51, 0.1);
				border-radius: 10upx;
				margin-bottom: 35upx;
				overflow: hidden;
				float: left;
				margin-right: 20upx;

				.topImgBg {
					width: 100%;
					position: relative;

					img {
						width: 100%;
						height: 100%;
					}

					.leftText {
						width: 126upx;
						height: 62upx;
						background: #EF7722;
						border-radius: 6upx 18upx 0 0;
						position: absolute;
						left: 0;
						bottom: 0;
						display: flex;
						align-items: center;
						justify-content: center;
						z-index: 2;

						.img {
							width: 32upx;
							height: 32upx;
						}

						span {
							font-size: 28upx;
							font-style: italic;
							color: #FFFFFF;
							font-weight: bold;
							font-family: 'YouSheBiaoTiHei';
						}
					}

					.rightDateBox {
						position: absolute;
						bottom: 0;
						left: 0;
						height: 54upx;
						width: 100%;
						//background: rgba(0, 170, 73, 0.9);
						background: rgba(243, 141, 69, 1);
						color: #FFFFFF;
						text-align: right;
						padding-right: 20upx;
						line-height: 54upx;
						font-size: 24upx;
						box-sizing: border-box;
					}
				}

				.itemInfo {
					padding: 25upx 22upx;

					.itemTit {
						margin-bottom: 15upx;
						display: flex;
						align-items: center;
						justify-content: space-between;

						h3 {
							font-size: 28upx;
							color: #333333;
						}

						span {
							font-size: 24upx;
							color: #AAAAAA;
						}
					}

					.surplus {
						font-size: 22upx;
						color: #999999;
						margin-bottom: 5upx;
					}

					p {
						margin-bottom: 20upx;
						font-size: 24upx;
						color: #999999;
					}

					.Price {
						display: flex;
						justify-content: space-between;
						align-items: center;

						span:first-child {
							color: $mainColor;
							font-size: 36upx;
							margin-right: 20upx;

							.b {
								font-weight: normal;
								font-size: 24upx;
							}
						}

						span:last-child {
							font-size: 24upx;
							font-weight: 400;
							text-decoration: line-through;
							color: #999999;
						}
					}
				}
			}

			.mItem:nth-child(2n) {
				margin-right: 0;
			}

			.topList {
				width: 100%;
				overflow: hidden;

				.topImgBg {
					.leftText {
						width: 192upx;
						height: 72upx;
					}
				}

				.itemInfo {
					.Price {
						justify-content: left;
					}
				}

				.rightDateBox {
					font-size: 24upx;
				}
			}
		}
	}

	.block {
		.blockTit {
			padding-top: 20upx;

			span {
				margin-right: 16upx;
			}

			span:last-child {
				color: $mainColor;
			}
		}
	}
</style>
