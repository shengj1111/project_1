<!-- 物流详情 -->
<template>
	<view>
		<view class="content" style="padding-bottom:100upx;" v-if="steps.length >0">
			<view class="order-details-information mt20">
				<view class="order-title-box">
					<view class="order-title padd-l">
						<text class="line"></text>
						<text style="margin-left: 10upx;">物流信息</text>
					</view>
				</view>
			</view>
			<view class="logistics">
				<uni-steps :options="steps" direction="column" :active="0"></uni-steps>
			</view>
		</view>
		<view v-else class="emptyOrder-box flex-items-plus flex-column">
			<!-- <image class="emptyOrder-img" src="../../static/images/totalAwardEmpty.png"></image> -->
			<label class="font-color-999 fs26 mar-top-30">你还没有物流信息哦～</label>
		</view>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	import uniSteps from "@/components/uni-steps/uni-steps.vue"
	export default {
		data() {
			return {
				express:'',
				deliverFormid:'',
				steps:[]
			}
		},
		components: {uniSteps},
		onLoad(options) {
			this.express = options.express
			this.deliverFormid = options.deliverFormid
			this.getShippingTrace(this.express,this.deliverFormid)
		},
		methods: {
			//物流信息
			getShippingTrace(express,deliverFormid){
			    NET.request(API.ShippingTrace,{
			    	express:express,
			    	deliverFormid:deliverFormid
			    },"GET").then( res => {
			    	let traces = res.data
			    	let len = traces.length
			      for(let i = 0; i < len; i++){
			        let item = traces[i]
			        this.steps.push({
			          title: item.reason,
			          desc: item.time,
			        })
			      }
			      this.steps = this.steps.reverse()
			    }).catch(res => {
			    }) 
			},
		}
	}
</script>

<style lang="scss">
.emptyOrder-box{
	margin-top: 70upx;
	.emptyOrder-img {
		width: 270upx;
		height: 270upx;
	}
}
page {
  background: #f7f7f7;
}
.logistics{
	padding: 20upx 20upx;
}
.content {
  padding: 0 0 120upx 0;
}
.order-details-information {
  background: #fff;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 98upx;
  
}

.order-details-information.padd {
  padding: 30upx;
  box-sizing: border-box;
}

.order-details-information .order-title {
  font-size: 30upx;
  margin-left: 30upx;
  color: #333;
  font-weight: 500;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.order-details-information .order-title .line {
  width: 10upx;
  height: 30upx;
  background: #ff7911;
  margin-right: 10upx;
}

.order-details-information .info-box {
  margin-top: 30upx;
}

.order-details-information .info-box .item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-size: 24upx;
  color: #666;
  margin-bottom: 20upx;
}

.order-details-information .info-box .item .copy-color {
  font-size: 24upx;
  color: #ff7911;
}
.arrow-down-img {
  width: 90upx;
  height: 90upx;
  padding: 30upx;
  box-sizing: border-box;
}
.mt20 {
  margin-top: 20upx;
}
</style>
