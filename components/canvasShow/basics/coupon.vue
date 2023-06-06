<template>
  <div>
    <div class="couponBox warp" v-if="terminal === 4" :class="['terminal' + terminal,'arrange'+(componentContent.arrangeActiveIndex+1),'color'+(componentContent.colorActiveIndex+1)]">
      <div class="couponListBox" v-if="componentContent.selectedCoupon">
        <div class="listItemBox" v-for="(item,index) in couponsData" :key="index" :class="item.state && item.state !== 3 && 'isReceive'">
          <div class="listItemBoxInner">
            <div class="itemInfo">
              <div class="amount">
                <b>￥</b><span>{{item.couponContent}}<i v-if="item.couponType === 1">满减卷</i><i v-if="item.couponType === 2">折扣券</i></span>
              </div>
              <div class="couponInfo">
                <p>{{item.content}}</p>
              </div>
            </div>
            <div v-if="item.state === 0" class="receiveBtn">
              <span>己领取</span>
            </div>
            <div v-else-if="item.state === 1" class="receiveBtn">
              <span>已使用</span>
            </div>
            <div v-else-if="item.state === 2" class="receiveBtn">
              <span>已过期</span>
            </div>
            <div v-else class="receiveBtn" @click="receiveCoupon(item)">
              <span>立即领取</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mobileStyle warp" v-if="terminal === 1 || terminal === 2 || terminal === 3">
      <div class="mCouponList">
        <div class="mItem" v-for="(item,index) in couponsData" :key="index">
          <div class="leftBox" v-if="typeId !== 1">
            <div class="couponType"><i v-if="item.couponType === 1">满减卷</i><i v-if="item.couponType === 2">折扣券</i></div>
            <div class="couponInfo">
              <div class="couponPrice"><b>￥</b>{{item.couponContent}}</div>
              <div class="couponDetail">
                <div class="couponTit">{{item.content}}</div>
                <div class="couponDate">{{item.startTime.split(' ')[0]}} - {{item.endTime.split(' ')[0]}}</div>
              </div>
            </div>
          </div>
          <div class="leftBox" v-else>
            <div class="couponType">满减卷</div>
            <div class="couponInfo">
              <div class="couponPrice"><b>￥</b>{{item.reduceMoney}}</div>
              <div class="couponDetail">
                <div class="couponTit">{{item.content}}</div>
                <div class="couponDate">{{item.activityStartTime.split(' ')[0]}} - {{item.activityEndTime.split(' ')[0]}}</div>
              </div>
            </div>
          </div>
          <div v-if="item.state === 0" class="rightBtn">
            <button>己领取</button>
          </div>
          <div v-else-if="item.state === 1" class="rightBtn">
            <button>已使用</button>
          </div>
          <div v-else-if="item.state === 2" class="rightBtn">
            <button>已过期</button>
          </div>
          <div v-else class="rightBtn" @click="receiveCoupon(item)">
            <button>立即领取</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const NET = require('@/utils/request')
const API = require('@/config/api')
import store from '../config/mixin/store'
export default {
  name: 'textComponent',
  data () {
    return {
      couponsData: []
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
      // uni.showLoading({
      //   title: '加载中...'
      // })
      if(_.componentContent.selectedCoupon){
        let _url = ''
        if(_.typeId === 1){
          _url =`${API.getCoupons}?page=1&pageSize=99&ids=${_.componentContent.selectedCoupon}`
        } else if(_.typeId === 3) {
          _url =`${API.getShopCoupons}?page=1&pageSize=99&shopId=${_.shopId}&ids=${_.componentContent.selectedCoupon}`
        }
        NET.request(_url, null, 'GET').then(res => {
          store.commit("loadNumReduce");
          _.couponsData = res.data.list
          if(JSON.stringify(_.componentContent.couponList) !== JSON.stringify(_.couponsData)){
            _.componentContent.couponList = _.couponsData
          }
        }).catch(res => {
          store.commit("loadNumReduce");
        })
      } else {
        _.couponsData = []
		store.commit("loadNumReduce");
      }
    },
    // 领取优惠券
    receiveCoupon(item) {
      const res = uni.getStorageSync('storage_key');
      const token = res.token
      if (token) {
        var paramsData = {}
        if(this.typeId === 1){
          paramsData.couponId = item.couponId
        } else if(this.typeId === 3) {
          paramsData.shopCouponId = item.shopCouponId
          paramsData.shopId = this.shopId
        }
        NET.request(API.takeCoupon, paramsData, 'POST').then(res => {
          this.getData()
          uni.showToast({
            title:'领取成功',
            icon:"success"
          })
        }).catch(res => {
          if(res.data.code !== '200'){
            uni.showToast({
              title:res.data.message,
              icon:"none"
            })
          }
        })
      } else {
        uni.showToast({
          title:'请先登录',
					duration:1500,
          icon:"none"
        })
        // uni.navigateTo({
        //   url:'/pages_category_page2/userModule/login'
        // })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.couponBox {
  margin: 0 auto;
  padding: 20upx 0 10upx;
  .couponListBox {
    flex-wrap: wrap;
    /**默认**/
    .listItemBox {
      width: 268upx;
      height: 122upx;
      border-radius: 10upx;
      overflow: hidden;
      background-image:url('../static/images/coupon/border_L1.png'), url('../static/images/coupon/border_R1.png');
      background-repeat: no-repeat, no-repeat;
      background-position: left top, right top;
      box-sizing: border-box;
      .listItemBoxInner {
        height: 122upx;
        border-top: 1px solid #EC4B42;
        border-bottom: 1px solid #EC4B42;
        display: flex;
        background: none !important;
        width: 268upx;
        align-items: center;
        justify-content: space-between;
        .itemInfo {
          width: 223upx;
        }
        .amount {
          max-width: 90%;
          margin: 0 auto;
          display: flex;
          align-items: baseline;
          justify-content: center;
          border-bottom: 1px solid #EC4B42;
          b {
            font-size: 25upx;
          }
          span {
            font-size: 52upx;
            font-weight: bold;
          }
          i {
            font-style: normal;
            font-size: 18upx;
            margin-left: 5upx;
          }
        }
        .couponInfo {
          p {
            text-align: center;
            font-size: 13upx;
            color: #EC4B42;
            margin-top: 10upx;
          }
        }
      }
      .receiveBtn {
        width: 40upx;
        margin-right: 5upx;
        background: #EC4B42;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        span {
          color: #FFFFFF !important;
          writing-mode: vertical-lr;
          font-size: 19upx;
        }
      }
      &.isReceive {
        background-image:url('../static/images/coupon/border_L4.png'), url('../static/images/coupon/border_R4.png');
        .listItemBoxInner {
          border-top: 1px solid #808080;
          border-bottom: 1px solid #808080;
          .itemInfo {
            color: #808080;
            .amount {
              border-bottom: 1px solid #808080;
            }
            .couponInfo {
              p {
                color: #808080;
              }
            }
          }
          .receiveBtn {
            cursor: auto;
            background: #808080;
          }
        }
      }
    }
  }

  @mixin cardColor($bgColor: #FF3737,$fontColor: #fff) {
    .couponListBox {
      .listItemBox {
        .listItemBoxInner{
          background: $bgColor;
        }
        .itemInfo {
          .amount {
            b {
              color: #EC4B42;
            }
            span {
              color: #EC4B42;
              i {
                color: #EC4B42;
              }
            }
          }
          .couponInfo {
            color:#EC4B42;
          }
        }
        .receiveBtn {
          span {
            color: #EC4B42;
          }
        }
        &.cardStyle3{
          .itemInfo {
            .amount {
              span {
                color: $bgColor;
                i {
                  color: $bgColor;
                }
              }
            }
            .couponInfo {
              color:$bgColor;
            }
          }
        }
        &.cardStyle4{
          border: 2px solid $bgColor;
          padding: 5px;
          .listItemBoxInner{
            padding: 20px 15px;
            height: 85px;
            border: 1px solid $bgColor;
          }
          .itemInfo {
            .amount {
              span {
                color: $bgColor;
                i {
                  color: $bgColor;
                }
              }
            }
            .couponInfo {
              color:$bgColor;
            }
          }
          .receiveBtn {
            border-left: 1px $bgColor dashed;
            span {
              color: $bgColor;
            }
          }
        }
      }
    }
  }

  &.arrange1{

  }
  &.arrange2{
    max-width: 96%;
    .couponListBox{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .listItemBox{
        width: 48%;
      }
    }
  }
  &.arrange3{
    max-width: 96%;
    .couponListBox{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .listItemBox{
        width: 32%;
      }
    }
  }
  &.arrange4{
    max-width: 96%;
    .couponListBox{
      display: flex;
      overflow: hidden;
      .listItemBox{
        width: 268px;
        flex: 0 0 268px;
        margin:0 25px 25px 0;
        &:nth-child(4n){
          margin-right: 0;
        }
      }
    }
  }
  &.color1{
    .listItemBox {
      background-image:url('../static/images/coupon/border_L1.png'), url('../static/images/coupon/border_R1.png');
      .listItemBoxInner {
        border-top: 1px solid #EC4B42;
        border-bottom: 1px solid #EC4B42;
        .itemInfo {
          color: #EC4B42;
          .amount {
            border-bottom: 1px solid #EC4B42;
          }
          .couponInfo {
            p {
              color: #EC4B42;
            }
          }
        }
        .receiveBtn {
          background: #EC4B42;
        }
      }
    }
  }

  &.color2{
    .listItemBox {
      background-image:url('../static/images/coupon/border_L2.png'), url('../static/images/coupon/border_R2.png');
      .listItemBoxInner {
        border-top: 1px solid #FF7800;
        border-bottom: 1px solid #FF7800;
        .itemInfo {
          color: #FF7800;
          .amount {
            border-bottom: 1px solid #FF7800;
          }
          .couponInfo {
            p {
              color: #FF7800;
            }
          }
        }
        .receiveBtn {
          background: #FF7800;
        }
      }
    }
  }

  &.color3{
    .listItemBox {
      background-image:url('../static/images/coupon/border_L3.png'), url('../static/images/coupon/border_R3.png');
      .listItemBoxInner {
        border-top: 1px solid #86A7FF;
        border-bottom: 1px solid #86A7FF;
        .itemInfo {
          color: #86A7FF;
          .amount {
            border-bottom: 1px solid #86A7FF;
          }
          .couponInfo {
            p {
              color: #86A7FF;
            }
          }
        }
        .receiveBtn {
          background: #86A7FF;
        }
      }
    }
  }
}

.mobileStyle {
  width: 690upx;
  margin: 0 auto;
  .mCouponList {
    .mItem {
      display: flex;
      position: relative;
      width: 100%;
      height: 140upx;
      background: #FFE9D8;
      border-radius: 10upx;
      align-items: center;
      margin-bottom: 20upx;
      .couponType {
        width: 108upx;
        height: 32upx;
        line-height: 32upx;
        background: #FFD5B5;
        border-radius: 10upx 0 10upx 0;
        position: absolute;
        left: 0;
        top: 0;
        text-align: center;
        color: $mainColor;
        font-size: 20upx;
      }
      .leftBox {
        width: 70%;
        .couponInfo {
          display: flex;
          padding-left: 30upx;
          align-items: center;
          .couponPrice {
            font-size: 40upx;
            color: $mainColor;
            display: flex;
            align-items: center;
            b {
              font-weight: 500;
              font-size: 28upx;
            }
            margin-right: 35upx;
          }
          .couponDetail {
            color: $mainColor;
            .couponTit {
              font-size: 24upx;
              margin-bottom: 15upx;
            }
            .couponDate {
              font-size: 22upx;
              color: $mainColor;
            }
          }
        }
      }
      .rightBtn {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        border-left: 2upx dashed #ffa759;
        padding: 20upx 0;
        position: relative;
        &:before {
          content: '';
          width: 30upx;
          height: 30upx;
          position: absolute;
          left: -15upx;
          bottom: -38upx;
          background: #FFFFFF;
          display: block;
          border-radius: 50%;
        }
        &:after {
          content: '';
          width: 30upx;
          height: 30upx;
          position: absolute;
          left: -15upx;
          top: -38upx;
          background: #FFFFFF;
          display: block;
          border-radius: 50%;
        }
        button {
          width: 140upx;
          height: 56upx;
          line-height: 56upx;
          text-align: center;
          color: #FFFFFF;
          background: $mainColor;
          border-radius: 25upx;
          font-size: 20upx;
        }
      }
    }
  }
  //&.couponBox .couponListBox .listItemBox {
  //  width: 100%;
  //  flex: 0 0 100%;
  //  margin:0 0 20px 0;
  //  .itemInfo{
  //    padding-right: 15px;
  //  }
  //  .receiveBtn{
  //    width: 50px;
  //  }
  //}
  //&.arrange3{
  //  .itemInfo{
  //    flex-direction: column;
  //    align-items: center;
  //    justify-content: center;
  //    .couponInfo{
  //      span{
  //        display: none;
  //      }
  //    }
  //  }
  //  .receiveBtn{
  //    width: 50px;
  //  }
  //}
}
</style>
