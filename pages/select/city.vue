<template>
	<view class="container">
		<!-- 城市搜索 -->
		<view class="city-search-wrap" v-if="isReach">
			<view class="search">
				<view class="l-search">
					<text class="iconfont icon-search"></text>
					<input class="input-search" type="text" :value="inputValue" placeholder="输入城市名或拼音" placeholder-style="color:#8E8F97"
					 :focus="searchFocus" @input="searchChange" />
					<text class="clear-input iconfont icon-icon-test" v-if="isClearBtn" @click="inputValue = ''"></text>
				</view>
				<button class="r-cancel" open-type="navigateBack" delta="1" @click="isReach = false">
					取消
				</button>
			</view>
			<!-- 搜索列表  -->
			<view class="reach-content" v-show="inputValue">
				<block v-show="searchData.length">
					<view class="li borderBottom" v-for="item in searchData" :key="item.cityId" @click="citySearchList(item)">{{ item.city }}</view>
				</block>
				<view class="has-no-data" v-show="hasNoData">没有找到匹配数据~</view>
			</view>
		</view>

		<!-- 城市列表 -->
		<view v-show="!isReach">
			<view class="top-search">
				<button class="item" @click="isreachTr">
					<text class="iconfont icon-search"></text>
					<text>输入城市名或拼音</text>
				</button>
			</view>
			<scroll-view class="scroll-view" scroll-y scroll-with-animation="true" enable-back-to-top="true" :scroll-into-view="toIndex"
			 @scroll="scrollHandle">
				<view class="block">
					<!-- 当前城市 -->
					<view class="area borderBottom list-item" id="area">
						<view class="title-wrapp">
							<view class="title">
								<text class="l">
									当前：
									<text>{{ areaName }}</text>
								</text>
								<text class="r " :class="{ isHide: isToggle }" @click="isToggle = !isToggle" v-if="false && regionList.length">
									
									<text class="iconfont" :class="isToggle ? 'icon-arrow-up' : 'icon-arrow-down'"></text>
								</text>
							</view>
						</view>
					</view>

					<!-- 热门城市 -->
					<view class="area list-item" id="hot">
						<view class="title-wrapp">
							<view class="title">
								<text class="l">热门城市</text>
							</view>
						</view>
						<view class="ul" v-if="hotcites.length">
							<view class="li" hover-class="hover" v-for="item in hotcites" :key="item.cityId" @click="selectCity(item)">{{ item.city }}</view>
						</view>
					</view>
					
					
				</view>
				<!-- 城市列表  -->
				<view class="city-list">
					<view class="list list-item" v-for="(item, key) of cities" :key="key" :id="key">
						<view class="title">{{ key }}</view>
						<view class="item borderBottom" hover-class="hover" v-for="innerItem in item" :key="innerItem.cityId" @click="selectCity(innerItem)">
							{{ innerItem.city }}
						</view>
					</view>
				</view>
			</scroll-view>

			<!-- 字母列表 -->
			<view class="alphabet" @touchstart="touchStart" @touchend="touchEnd" @touchmove.stop="touchMove">
				<view v-for="(item, index) in alphabet" :key="index" @touchstart="getLetter" @touchend="setLetter" :id="item">
					<view class="item" :class="{ active: currentLetter == item }">
						{{ item == "hot" ? "热门" : item }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import City from "@/static/city.json";
	import qqmapsdk from "@/static/js/qqmap-wx-jssdk.min.js";
	const qqMap = new qqmapsdk({
		key:"CRDBZ-XQKC5-772IZ-Q47AA-6TGR7-F2FLU"
	})
	export default {
		data() {
			return {
				page:'',//传入的页面名字
				isIPX: null,
				regionId: null, //区域ID
				isToggle: true,
				isReach: false,
				inputValue: "",
				searchData: [], //搜索的数据
				isClearBtn: false,

				cityId: null, //城市ID
				cityName: null, //城市名
				areaName: '', //区域名,模拟数据请自行修改,当前城市

				hotcites: City.data.hotcity, //热门城市，模拟数据请自行修改
				cities: City.data.cities, //城市列表,拟数据请自行修改

				alphabet: City.data.alphabet, //字母列表
				toIndex: "", //跳转的索引的字母
				tipsLetter: "", //滑动显示字母
				timer: null,
				hasNoData: false,
				searchFocus: false,
				letterDetails: [],
				currentLetter: "hot" //默认选择hot
			};
		},
		watch: {
			// 城市搜索输入框
			inputValue(newVal) {
				this.isClearBtn = newVal ? true : false;

				if (this.timer) {
					clearTimeout(this.timer);
				}

				if (!this.inputValue) {
					this.searchData = [];
					return;
				}
				this.timer = setTimeout(() => {
					const result = [];
					for (let i in this.cities) {
						this.cities[i].forEach(item => {
							if (
								item.spell.includes(this.inputValue) ||
								item.city.includes(this.inputValue)
							) {
								result.push(item);
							}
						});
					}
					this.searchData = result;
					if (this.searchData.length === 0) {
						this.hasNoData = true;
					} else {
						this.hasNoData = false;
					}
				}, 500);
			},
			isReach(val) {
				this.searchFocus = val;
			}
		},
		created() {
			//真实数据请求...
		},
		onLoad(data) {
			console.log(data.page,'传过来的参数');
			this.page = data.page
			//this.areaName = data.city
			uni.getLocation({
			    type: 'gcj02', //返回可以用于uni.openLocation的经纬度
			    success:  (res) => {
						console.log(res,"res");
			        const latitude = res.latitude;
			        const longitude = res.longitude;
			        qqMap.reverseGeocoder({
								location: {
									latitude: latitude,
									longitude: longitude
								},
								success: (res) => {
									var cityName = res.result.address_component.city;		//获取到的城市名
									console.log(res);
									console.log("当前城市：",cityName);
									this.areaName = cityName
								},
								fail:(res)=>{
									console.log(res);
								}
							})
			    }
			});
		},
		methods: {
			// 搜索
			isreachTr(){
				this.isReach = true
			},
			//列表滚动，和右边字母表对应
			scrollHandle(e) {
					let view = uni.createSelectorQuery().in(this).selectAll(".list-item");
					view.boundingClientRect(d => {
						let top = d[0].top;
						d.forEach(item => {
							item.top = item.top - top;
							item.bottom = item.bottom - top;
							this.letterDetails.push({
								id: item.id,
								top: item.top,
								bottom: item.bottom
							});
						});
					}).exec();

					const scrollTop = e.detail.scrollTop;
					this.letterDetails.some(item => {
						if (scrollTop >= item.top && scrollTop <= item.bottom - 20) {
							this.currentLetter = item.id;
							//当前固定用的是粘性定位，如果不用粘性定位，在这里设置
							return true;
						}
					});
			},


			//搜索
			searchChange(e) {
				// debugger;
				let {
					value
				} = e.detail;
				this.inputValue = value;
			},

			//搜索结果列表数据
			citySearchList(item) {
				console.log('选择的城市：', item)
				this.areaName = item.city
				uni.$emit(this.page,{
					cityName:item.city
				})
				uni.navigateBack()
			},

			//每个城市绑定的事件
			selectCity(item) {
				console.log('选择的城市：', item)
				//当前项目是需要选择到区域，所以选择城市后回到区县的地方
				this.areaName = item.city
				uni.$emit(this.page,{
					cityName:item.city
				})
				uni.navigateBack()
			},
			
			//区域选择
			selectRegion(item) {
				console.log('选择的区域是：', item)
				uni.$emit(this.page,{
					cityName:item.city
				})
				//uni.navigateBack()
			},

			//触发开始
			touchStart(e) {
				// console.log(e);
			},
			//移动时
			touchMove(e) {
				uni.vibrateShort();
				let y = e.touches[0].clientY;
				let offsettop = e.currentTarget.offsetTop;

				//判断选择区域,只在选择区才会生效
				if (y > offsettop) {
					let num = parseInt((y - offsettop) / 15); //右边每个字母元素的高度
					let letter = this.alphabet[num];
					this.tipsLetter = letter;

					let curentLetter = this.letterTransform(letter);
					uni.showToast({
						title: curentLetter,
						icon: "none",
						duration: 1000
					});
				}
			},
			//触发结束
			touchEnd() {
				this.toIndex = this.tipsLetter;
			},
			//移动开始获取字母，并放大提示
			getLetter(e) {
				uni.vibrateShort();
				let {
					id
				} = e.currentTarget;
				this.tipsLetter = id;

				let curentLetter = this.letterTransform(id);
				uni.showToast({
					title: curentLetter,
					icon: "none",
					duration: 1000
				});
			},
			//移动结束设置字母，赋值到toIndex
			setLetter() {
				this.toIndex = this.tipsLetter;
			},

			//提示字母转换
			letterTransform(letter) {
				let str = "";
				if (letter == "hot") {
					str = "热门";
				} else {
					str = letter;
				}

				return str;
			}
		}
	};
</script>
<style>
	@import "@/static/css/iconfont.css";
</style>
<style lang="scss" scoped>
	.container{
		background-color: #fff;
	}
	.borderBottom {
		position: relative;

		&::after {
			content: "";
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 1px;
			background: #c1c2cd;
			transform: scaleY(0.5);
		}
	}


	.city-search-wrap {
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;

		.search {
			width: 100%;
			height: 60rpx;
			display: flex;
			align-items: center;
			font-size: 24rpx;
			color: #222;
			padding: 0 30rpx;
			box-sizing: border-box;
			position: fixed;
			left: 0;
			top: 20rpx;
			z-index: 1;
			background: #fff;

			.l-search {
				flex: 1;
				background: #f4f5f9;
				border-radius: 50rpx;
				position: relative;

				.icon-search {
					font-size: 26rpx;
					position: absolute;
					left: 30rpx;
					top: 50%;
					transform: translateY(-50%);
					color: #8e8f97;
					font-weight: 700;
				}

				.input-search {
					height: 60rpx;
					box-sizing: border-box;
					padding: 0 100rpx 0 100rpx;
					text-align: center;
				}

				.clear-input {
					font-size: 30rpx;
					position: absolute;
					right: 10rpx;
					top: 50%;
					transform: translateY(-50%);
					padding: 10rpx;
					color: #8e8f97;
				}
			}

			.r-cancel {
				margin-left: 28rpx;
				padding: 0 20rpx;
				font-size: 30rpx;
				background: transparent;
			}
		}
	}

	.reach-content {
		padding-top: 60rpx;

		.li {
			font-size: 32rpx;
			color: #333;
			padding: 20rpx 0;
			position: relative;
		}
	}

	.block {
		padding: 0 30rpx;
		box-sizing: border-box;
	}

	.borderBottom {
		position: relative;

		&::after {
			content: "";
			position: absolute;
			left: 0;
			bottom: 0;
			width: calc(100% - 50rpx);
			height: 1px;
			background: #c1c2cd;
			transform: scaleY(0.5);
		}
	}

	.top-search {
		height: 60rpx;
		line-height: 60rpx;
		padding: 0 30rpx;
		margin: 20rpx 0;
		box-sizing: border-box;
		
		.item {
			background: #f4f5f9;
			border-radius: 50rpx;
			font-size: 24rpx;
			text-align: center;
			color: #8e8f97;
			border: none;
			&:after{
				border: none;
			}
			text {
				padding-left: 20rpx;
				color: #c1c2cd;
			}

			.icon-search {
				font-size: 26rpx;
				color: #8e8f97;
				font-weight: 700;
			}
		}
	}

	.scroll-view {
		width: 100%;
		height: calc(100vh - 80rpx);
		box-sizing: border-box;
	}

	.area {
		padding-bottom: 40rpx;
		margin-bottom: 44rpx;

		.title-wrapp {
			position: sticky;
			top: 0;
			left: 0;
			background: #fff;
		}

		.title {
			width: 100%;
			box-sizing: border-box;
			font-size: 40rpx;
			font-weight: 500;
			color: #222;
			font-size: 30rpx;
			font-weight: 500;
			margin-bottom: 14rpx;
			display: inline-flex;
			justify-content: space-between;
			align-items: center;

			.r {
				font-size: 24rpx;
				color: #8e8f97;
				display: inline-block;
				align-items: center;

				.iconfont {
					font-size: 24rpx;
				}
			}
		}

		.ul {
			display: flex;
			flex-wrap: wrap;

			.li {
				width: 202rpx;
				padding: 0 10rpx;
				box-sizing: border-box;
				height: 70rpx;
				line-height: 70rpx;
				text-align: center;
				font-size: 26rpx;
				color: #222;
				border-radius: 10rpx;
				margin: 20rpx 20rpx 0 0;
				background: #f4f5f9;

				&.active {
					font-weight: 500;
					background: #ffde45;
				}
			}

			.hover {
				background: #ffde45;
			}
		}
	}

	.city-list {
		width: 677rpx;
		padding-bottom: 50rpx;

		.title {
			height: 60rpx;
			line-height: 60rpx;
			font-size: 30rpx;
			font-weight: 500;
			color: #272636;
			background: #f4f5f9;
			margin-bottom: 20rpx;
			padding-left: 30rpx;
			position: sticky;
			top: 0;
			left: 0;
			z-index: 2;
		}

		.item {
			padding: 24rpx 0 24rpx 30rpx;
			color: #333;
			font-size: 32rpx;
			font-weight: 500;

			&::after {
				left: 30rpx;
				width: calc(100% - 30rpx);
				background: #d2d2d2;
			}
		}

		.hover {
			background: #f4f5f9;

			&::after {
				background: #f4f5f9;
			}
		}
	}

	.alphabet {
		position: fixed;
		right: 0;
		bottom: 20%;
		width: calc(750rpx - 680rpx);
		text-align: center;
		font-size: 20rpx;
		font-weight: 700;
		color: #8e8f97;

		.item {
			height: 15px;
			line-height: 15px;
		}

		.active {
			color: #222;
		}
	}

	.has-no-data {
		font-size: 24rpx;
		text-align: center;
		color: #8e8f97;
		margin-top: 50rpx;
	}
</style>
