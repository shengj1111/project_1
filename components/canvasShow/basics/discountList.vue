<template>
  <div class="hom-pro-list warp" :class="'terminal'+terminal" v-if='firstProduct'>
    <div class="title" :class="'text-align-'+componentContent.textAlign">
      <h2 class="h2">{{componentContent.title}}</h2>
      <view class="btn-all a-link" @click="goDiscount(shopId!==0 && {shopId:shopId,id:componentContent.shopDiscountId})">查看全部<i class="iconfont icon-arrow-right"></i></view>
    </div>
    <div v-if="(componentContent.shopDiscountId && discountInfo && count.length > 0) || componentContent.productData.productIdList !==0">
      <div class="discountList" v-if="terminal === 4" :class="this.typeId === 1 && 'pc'">
        <div class="listLeft">
          <img src="../static/images/shop/xianshi2x.png" alt="">
          <div class="bgBox">
            <div class="endTime">{{discountInfo.discountName}}</div>
            <div class="line"></div>
            <div class="endTimeText">距离{{count[0]}}还剩</div>
            <div class="timeBox">
              <span>{{count[1]}}</span><i>:</i><span>{{count[2]}}</span><i>:</i><span>{{count[3]}}</span>
            </div>
            <button @click="goDiscount(shopId!==0 && {shopId:shopId,id:componentContent.shopDiscountId})">查看全部></button>
          </div>
        </div>
        <div class="listRight">
          <div class="listItem" v-for='it in discountInfo.products' :key='it.productId' @click="mygoGoods(it)">
            <div class="imgBox">
              <img :src="it.image" alt="">
            </div>
            <div class="itemInfo">
              <h3>{{it.productName}}</h3>
              <div class="discountPrice">
                <span>折扣价￥</span><b>{{it.price}}</b>
              </div>
              <div class="originalPrice">原价：¥{{it.originalPrice}}</div>
              <button>立即抢购</button>
            </div>
          </div>
        </div>
      </div>
      
			
			
			<div v-else class="mobileList">
				<!-- 跳转之前用的方法是 goGoods 现在改了 mygoGoods -->
				<!-- 下面是折扣产品,只展示一个 -->
        <div class="topList mItem" @click="mygoGoods(firstProduct)" v-if='firstProduct'>
          <div class="topImgBg">
            <img :src="firstProduct.image" alt="">
            <div class="leftText">
              <!-- <image class="img" src="../../../static/assets/images/iconDiscount.png"></image> -->
              <span>限时折扣</span>
            </div>
            <div class="rightDateBox">
              <span v-if="count && count.length> 0">距{{count[0]}}还有 {{`${count[1]}:${count[2]}:${count[3]}`}}</span>
              <span v-if="firstProduct.count && firstProduct.count.length> 0">距{{firstProduct.count[0]}} {{`${firstProduct.count[1]}:${firstProduct.count[2]}:${firstProduct.count[3]}`}}</span>
            </div>
          </div>
          <div class="itemInfo">
            <div class="itemTit" style='width: 650rpx;overflow: hidden;height: 35rpx;white-space:nowrap'>
              <h3>{{firstProduct.productName}}</h3>
              <!-- <span v-if="firstProduct.limitNumber && firstProduct.limitNumber>0">剩余{{firstProduct.limitStockNumber}}件</span> -->
            </div>
            <!-- <p>透明观感，磨砂质感</p> -->
            <div class="Price">
              <span><label class="b">￥</label>{{firstProduct.price}}</span>
              <span>¥ {{firstProduct.originalPrice}}</span>
            </div>
          </div>
        </div>
				<!-- 下面是其他的折扣产品,客户说不用展示 -->
  <!--      <div class="listBox">
          <div class="mItem" v-for='it in appProducts' :key='it.productId' @click="mygoGoods(it)">
            <div class="topImgBg">
              <img :src="it.image" alt="">
              <div class="leftText">
                <span>限时折扣</span>
              </div>
              <div class="rightDateBox">
                <span v-if="count && count.length> 0">距{{count[0]}} {{`${count[1]}:${count[2]}:${count[3]}`}}</span>
                <span v-if="it.count && it.count.length> 0">距{{it.count[0]}} {{`${it.count[1]}:${it.count[2]}:${it.count[3]}`}}</span>
              </div>
            </div>
            <div class="itemInfo">
              <div class="itemTit">
                <h3>{{firstProduct.productName}}</h3>
              </div>
              <div class="surplus" v-if="it.limitNumber && it.limitNumber>0">剩余{{it.stockNumber}}件</div>
              <div class="Price">
                <span><label class="b">￥</label>{{it.price}}</span>
                <span>¥ {{it.originalPrice}}</span>
              </div>
            </div>
          </div>
          <div class="clearfix"></div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
const NET = require('@/utils/request')
const API = require('@/config/api')
import {funMixin} from '../config/mixin'
import store from '../config/mixin/store'
export default {
  name: 'discountList',
  mixins: [funMixin],
  data () {
    return {
      value: 100,
      discountInfo: {},
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
      console.log('typeId', _.typeId)
      console.log('shopId', _.shopId)
      if(this.typeId === 1){
        // 平台端
        // uni.showLoading({
        //   title: '加载中...'
        // })
        NET.request1( `${API.getProducts}?page=1&pageSize=99&type=3&ids=${_.componentContent.productData.productIdList}`, null, 'GET').then(res => {
          store.commit("loadNumReduce");
          _.discountInfo.products  = res.data.list
          _.timer = setInterval(()=>{
            _.discountInfo.products.map(function(value){
              value.count = _.getTime(value)
              return value;
            });
            _.$forceUpdate()
          }, 1000)
          _.firstProduct = _.discountInfo.products[0]
          _.appProducts = _.discountInfo.products.slice(1,3)
          _.$forceUpdate()
        }).catch(res => {
          store.commit("loadNumReduce");
        })
      } else if(this.typeId === 3) {
        // 商家端
        if(_.componentContent.shopDiscountId){
          // uni.showLoading({
          //   title: '加载中...'
          // })
          NET.request(`${API.getDiscounts}?shopId=${_.shopId}&ids=${_.componentContent.shopDiscountId}`, null, 'GET').then(res => {
			store.commit("loadNumReduce");
            if(res.data.length> 0){
              _.discountInfo = res.data[0]
              _.discountInfo.products.splice(4)
              _.firstProduct = _.discountInfo.products[0]
              _.appProducts = _.discountInfo.products.slice(1,3)
              // 只有进行中和未开始活动, 用倒计时
              if(_.discountInfo.state !==2) {
                this.timer = setInterval(()=>{
                  _.count = _.getTime(_.discountInfo)
                }, 1000)
              }
            }
          }).catch(res => {
            store.commit("loadNumReduce");
          })
        } else {
          _.discountInfo = {}
          _.firstProduct = undefined
          _.appProducts = []
		  store.commit("loadNumReduce");
        }
      }
    },
    getTime(info) {
      const date = new Date().getTime()
      const startTime = new Date(info.startTime.replace(/-/g,'/')).getTime()
      const endTime = new Date(info.endTime.replace(/-/g,'/')).getTime()
      if(startTime > date) {
        return this.countDown(startTime-date,true) // 未开始
      } else {
        return this.countDown(endTime-date) // 进行中
      }

    },

    countDown(time, isStart) {
      const fn = (v) =>  v < 10 ? `0${v}` : v
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
.hom-pro-list{
  padding: 20upx 0;
  width: 700rpx;
	background-color: #fff;
	border-top: 20rpx solid #F7F7F7;
	margin: 0 auto;
  .title{
    margin: 0 30rpx 20rpx;
    position: relative;
		
    .h2{
      font-size: 30upx;
      color: #333;
      line-height: 1em;
      font-weight: bold;
    }
    .btn-all{
      position: absolute;
      right: 0;
      top: 10upx;
      line-height: 22upx;
      padding-right: 20upx;
      font-size: 24upx;
      color: #999;
      .iconfont{
        content: '';
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    .tabList{
      ul{
        li{
          display: inline-block;
          padding: 0 12upx 0 20upx;
          position: relative;
          a:hover{
            color: $mainColor;
          }
          &:after{
            content: '/';
            position: absolute;
            left: 0;
            top: 0;
          }
          &:first-child{
            padding-left: 0;
            &:after{
              display: none;
            }
          }
        }
      }
    }
    &.text-align-left{
      .tabList{
        position: absolute;
        right: 100upx;
        bottom: 0;
        line-height: 22upx;
      }
    }
    &.text-align-center{
      text-align: center;
      .tabList{
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
            padding: 0 2px;
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
      flex: 1;
      margin-left: 13upx;
      display: flex;
      flex-wrap: wrap;
      .listItem {
        width: 431upx;
        margin-right: 20upx;
        display: flex;
        background: #FAFAFA;
        margin-bottom: 20upx;
        .imgBox {
          width: 196upx;
          height: 196upx;
          margin-right: 15upx;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .itemInfo {
          h3 {
            font-size: 18px;
            color: #333434;
            line-height: 28upx;
            margin: 10px 0 3upx 0;
          }
          button {
            width: 130upx;
            text-align: center;
            height: 39upx;
            background: #FF7800;
            line-height: 39upx;
            color: #FFFFFF;
            font-size: 18upx;
            margin-top: 20upx;
          }
        }
      }
      .listItem:nth-child(2n) {
        margin-right: 0;
      }
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
}
.mobileList {
  .mItem {
    // width: 335upx;
    // height: 520upx;
    background: #FFFFFF;
    margin-bottom: 35upx;
    overflow: hidden;
    float: left;
    margin-right: 20upx;
    .topImgBg {
      width: 100%;
      height: 750rpx;
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
        z-index: 99;
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
        background: #F38D45;
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
    height: 880rpx;
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
