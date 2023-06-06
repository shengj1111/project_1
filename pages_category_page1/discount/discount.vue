<template>
  <view class="spikeListBox">
	 <view class="countdown" v-if="shopShowType == false">
		距结束<view class="endDate"><span>{{hou}}</span><i>:</i><span>{{min}}</span><i>:</i><span>{{sec}}</span></view>
	  </view>
	  <view class="filterBox" v-else>
		<view class="item" :class="selectIndex == 0 ? 'selected' : ''" @click="synthesize"><span>综合</span></view>
		<view class="item" :class="selectIndex == 1 ? 'selected' : ''" @click="sales"><span>销量</span></view>
		<view class="item" :class="selectIndex == 2 ? 'selected' : ''" @click="priceClick"><span>价格</span></view>
	  </view>
    <view class="spikeList mar-top-20">
      <view class="listItem" v-for="(item,index) in getDiscount" :key="index">
        <view class="itemBox">
          <img :src="item.image">
        </view>
        <view class="itemInfo flex-column-plus flex-sp-between">
          <p>{{item.productName}}</p>
          <view style="width: 90%;" v-if="item.limitStockNumber">
            <progress activeColor="#FF7800" :percent="getPercent(item.limitStockNumber, item.limitNumber)" active stroke-width="5" />
          </view>
          <view class="number" v-if="item.limitNumber">限量{{item.limitNumber}}件 / 剩余{{item.limitStockNumber}}件</view>
          <view class="originalPrice">¥{{item.originalPrice}}</view>
          <view class="price">
            <view class="currentPrice flex-row-plus flex-items-plus font-color-FF7800">
				<view class="fs26">折扣价</view>
				<view class="flex-row-plus flex-items">
					<label class="fs24">￥</label>
					<label class="fs36">{{item.price}}</label>
				</view>
			</view>
			<view class="snapUpBtn" @click="gogoodsDetails(item.shopId,item.productId,item.skuId)">去抢购</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const NET = require('../../utils/request')
const API = require('../../config/api')
export default {
	data(){
		return{
			pageType:true,
			getDiscount:[],
			getDiscountData:{},
			page:1,
			pageSize:10,
			loadingType:0,
			days:'00',
			hou: "00",
			min: "00",
			sec: "00",
			shopId:0,
			shopSeckillId:0,
			type:1,//价格
			volume:1,//销量
			shopShowType:false,
			selectIndex:0,
		}
	},
	onLoad(options) {
		if(options.shopId && options.shopDiscountId){
			this.shopShowType = false
			this.shopId = options.shopId
			this.shopDiscountId = options.shopDiscountId
		}else{
			this.shopShowType = true
			this.shopId = 0
			this.shopDiscountId = 0
		}
		this.getDiscountList()
	},
	onReachBottom(){
		if(this.loadingType == 1){
			uni.stopPullDownRefresh()
		}else{
			this.page = this.page+1
			this.getDiscountList()
		}
	},
	methods:{
    getPercent(num, total){
      num = parseFloat(num);
      total = parseFloat(total);
      if (isNaN(num) || isNaN(total)) {
        return "-";
      }
      return total <= 0? "0%" : Math.round((num / total) * 10000) / 100.0;
    },
		synthesize(){
			this.volume =1//销量
			this.type = 1//价格
			this.page = 1
			this.selectIndex = 0
			this.getDiscount = []
			this.getDiscountList()
		},
		sales(){
			//销量
			if(this.volume == 1){
				this.volume = 2
			}else{
				this.volume = 1
			}
			this.type = 1//价格
			this.page = 1
			this.selectIndex = 1
			this.getDiscount = []
			this.getDiscountList()
		},
		priceClick(){
			this.volume =1//销量
			//价格
			if(this.type == 1){
				this.type = 2
			}else{
				this.type = 1
			}
			this.page = 1
			this.selectIndex = 2
			this.getDiscount = []
			this.getDiscountList()
		},
		gogoodsDetails(shopId,productId,skuId){
			uni.navigateTo({
				url:'/pages_category_page3/merchants/goodsDetails?shopId='+shopId + '&productId='+productId +'&skuId='+skuId+"&myfrom=1"
			})
		},
		getDiscountList(){
			let param = ''
            param = {
              page:this.page,
              pageSize:this.pageSize,
              shopId:this.shopId,
              shopDiscountId:this.shopDiscountId,
              type:this.type,
              volume:this.volume
            }
			NET.request(API.getDiscountList,param,'GET').then(res => {
				if(this.shopShowType == false){
					this.dateformat(res.data.time)
					this.countDown()
				}
				if(res.data.page.list.length == 0){
					this.loadingType = 1
					this.page = this.page
				}else{
					this.getDiscount = this.getDiscount.concat(res.data.page.list)
				}
			}).catch(res => {
				uni.showToast({
					title:'失败',
					icon:"none"
				})
			})
		},
		//时分秒换算
		dateformat(micro_second) {
			// 总秒数
			let second = Math.floor(micro_second / 1000);
			// 天数
			let day = Math.floor(second / 3600 / 24);
			// 小时
			let hr = Math.floor(second / 3600 % 24);
			// 分钟
			let min = Math.floor(second / 60 % 60);
			// 秒
			let sec = Math.floor(second % 60);
			this.hou = hr+day*24
			this.min = min
			this.sec = sec
		},
		countDown(){
		    let timeOut = setTimeout(() => {
		      let hou = parseInt(this.hou+this.days*24);
		      let min = parseInt(this.min);
		      let sec = parseInt(this.sec);

		      let netxSec = sec - 1;
		      let netxMin = min
		      let netxHou = hou;

		      if (netxHou == 0 && netxMin == 0 && netxSec == -1) {
		        clearTimeout(timeOut)
				uni.switchTab({
					url:'../../pages/tabbar/index/index'
				})
				uni.showToast({
					title:"活动结束",
					duration:2000,
					icon:'none'
				})
		      } else {
		        if (netxSec == -1) {
		          netxSec = 59
		          netxMin = netxMin - 1;
		        }
		        if (netxMin == -1) {
		          netxMin = 59
		          netxHou = netxHou - 1
		        }
		        // if (netxHou == -1) {
		        //   netxHou = 23
		        // }

		        this.hou = this.timeFormat(netxHou),
		        this.min = this.timeFormat(netxMin),
		        this.sec = this.timeFormat(netxSec),
		        this.timeOut = timeOut
		        this.countDown();
		      }
		    }, 1000)
		},
		timeFormat(param) { //小于10的格式化函数
		    return param < 10 ? '0' + param : param;
		},
	}
}
</script>

<style lang="scss" scoped>
  .spikeListBox {
	  .selected{
		  color: #FE6F52;
	  }
	  .shopShowTypebox{
		  height: 80rpx;
		  background-color: #FFFFFF;
		  z-index: 9999;
	  }
    .countdown {

      display: flex;
      justify-content: center;
      height: 80upx;
      align-items: center;
      background: #F7F7F7;
      width: 100%;
      z-index: 999;
      .endDate {
        display: flex;
        align-items: center;
        margin-left: 20upx;
        span {
          min-width: 48upx;
          height: 36upx;
          padding: 0upx 8upx;
          background: linear-gradient(247deg, #F71622, #FE6F52);
          display: block;
          font-size: 28upx;
          color: #FFFFFF;
          text-align: center;
        }
        i {
          font-size: 28upx;
          color: #FF736C;
          font-style: normal;
          margin: 0 8upx;
        }
      }
    }
    .spikeList {
      padding: 20upx 30upx 20upx 30upx;
      .listItem {
        display: flex;
        padding-bottom: 30upx;
        border-bottom: 1upx solid #EEEEEE;
        margin-bottom: 30upx;
        &:last-child {
          border-bottom: none;
        }
        .itemBox {
          width: 260upx;
          height: 260upx;
          margin-right: 30upx;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .itemInfo {
          flex: 1;
          p {
            font-size: 26upx;
            color: #333333;
            line-height: 40upx;
            margin-bottom: 20upx;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .number {
            color: #999999;
            font-size: 26upx;
          }
          .originalPrice {
            font-size: 26upx;
            margin-top: 20upx;
            text-decoration: line-through;
            color: #999999;
          }
          .price {
            display: flex;
            justify-content: space-between;
            .snapUpBtn {
              width: 140upx;
              height: 56upx;
              line-height: 56upx;
              text-align: center;
              background: linear-gradient(247deg, #F71622, #FE6F52);
              border: 1upx solid #FF736C;
              border-radius: 8upx;
              color: #FFFFFF;
            }
          }
        }
      }
    }
    .filterBox {
      display: flex;
      height: 80upx;
      align-items: center;
      width: 100%;
      background: #FFFFFF;
      left: 0;
      .item {
        flex: 0 0 33.33%;
        text-align: center;
      }
    }
  }
</style>
