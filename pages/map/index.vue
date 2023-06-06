<template>
	<map id="map" :longitude="map.longitude" :latitude="map.latitude" :markers="mapConfig" scale="15" show-location
		@markertap='daohang' style="width: 100%; height: 100%;">
		<view class="mapInfo-box">
			<view class="left-box">
				<view class="shang">店铺地址</view>
				<view class="xia">{{address}}</view>
			</view>
			<view class="right-box">
				<button  type="primary" @click="openMap">导航</button>
			</view>
		</view>
	</map>
</template>
<script>
	export default {
		name: "Index",
		components: {},
		props: {},
		data: function() {
			return {
				mapConfig: [],
				map: {
					latitude: "",
					longitude: ""
				},
				latitude: '',
				longitude: '',
				title: '',
				address: '',
			};
		},
		onShow() {
			let mapInfo = uni.getStorageSync('mapInfo')
			this.latitude = mapInfo.latitude
			this.longitude = mapInfo.longitude
			this.title = mapInfo.title
			this.address = mapInfo.address
			console.log(mapInfo, '地图信息1');

			this.map = {
				latitude: mapInfo.latitude,
				longitude: mapInfo.longitude
			};
			this.mapConfig = [{
				id: 1,
				width: 40,
				height: 40,
				iconPath: mapInfo.iconPath,
				latitude: mapInfo.latitude,
				longitude: mapInfo.longitude,
				title: mapInfo.title,
				name: mapInfo.title,
				address: mapInfo.address
			}];

			uni.removeStorageSync('mapInfo')
		},
		methods: {
			// daohang(e) {
			// 	console.log(e, 111)
			// 	uni.showModal({
			// 		title: '提示',
			// 		content: '是否打开导航',
			// 		success: (res) => {
			// 			if (res.confirm) {
			// 				this.openMap()
			// 			} else if (res.cancel) {
			// 				uni.showToast({
			// 					title: '已关闭',
			// 					duration: 1000,
			// 					icon: 'none'
			// 				})
			// 			}
			// 		}
			// 	});
			// },
			openMap() {
				let latitude = this.latitude //店铺的纬度
				let longitude = this.longitude //店铺的纬度
				let shopName = this.title //店铺的名称

				let plugin = requirePlugin('routePlan');
				let key = '3T7BZ-QWVRW-EYMRX-RMH3O-CZWB7-QLFX4'; //使用在腾讯位置服务申请的key
				let referer = '正品茂'; //调用插件的app的名称
				let endPoint = JSON.stringify({ //终点
					'name': shopName,
					'latitude': latitude,
					'longitude': longitude
				});
				
				wx.navigateTo({
					url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint +
						'&navigation=1'
				});
			}
		}
	};
</script>
<style lang="less">
	page {
		width: 100%;
		height: 100%;
	}

	#map{
		position: relative;
	}

		.mapInfo-box {
			position: absolute;
			bottom: 0rpx;
			left: 0rpx;
			width: 750rpx;
			height: 200rpx;
			background-color: #FFFFFF;
			display: flex;
			justify-content: space-between;
			align-items:center;
			.left-box{
				width: 500rpx;
				height: 200rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				// align-items:center;
				
				// padding-left: 20rpx;
				.shang{
					// padding-bottom: 10rpx;
					font-size: 38rpx;
					font-weight: 600;
				}
				.xia{
					font-size: 28rpx;
				}
			}
			.right-box{
				width: 250rpx;
				height: 200rpx;
				display: flex;
				justify-content: center;
				align-items:center;
				// padding: 60rpx 20rpx 0rpx 20rpx;
				button{
					width: 200rpx;
					height: 100rpx;
					line-height: 100rpx;
				}
			}
		}
	
</style>
