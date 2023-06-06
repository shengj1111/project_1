<template>
  <view class="qaBox">
    <view class="qaTopInfo">
      <view class="qaTopInfoBox" @click="goGoodsDetails">
        <image :src="detailList.image"></image>
        <view class="qaInfoText">
          <h3>{{detailList.productName}}</h3>
          <span>共{{detailList.count}}个问题</span>
        </view>
      </view>
      <view class="qaTitBox">
        <view class="qaTit"><i>问</i><h3>{{detailList.problem}}</h3></view>
        <view class="qaTitTime"><img :src="detailList.headImage" />
		<span class="qaName">{{detailList.name}}</span>
		<span class="qaTimeInfo">{{detailList.createTime}}</span></view>
      </view>
    </view>
    <view class="answerListBox">
      <view class="answerNum">共{{answerslength}}条回答</view>
      <view class="answerList" v-for="item in detailList.answers" :key="item.answerId">
        <view class="answerItem">
          <view class="itemTit">
            <view class="itemAvatarBox">
              <img :src="item.headImage" alt="">
              <span class="answerName">{{item.name}}</span>
            </view>
            <view class="answerTime">{{item.createTime}}</view>
          </view>
          <view class="answerInfo">{{item.answer}}</view>
        </view>
      </view>
    </view>
	<view v-if="detailList.ifExhibition==1" class="pad-bot-100"></view>
    <view class="answerBtn" v-if="detailList.ifExhibition==1" :style="{'padding-bottom':(isIphone==true? 50:0)+'rpx'}">
      <view class="uni-form-item uni-column answerBtnBox">
        <input class="uni-input" v-model="answerText" focus placeholder="被邀请的用户才能回答" />
        <view class="answerButton" @click="answer">回答</view>
      </view>
    </view>
  </view>
</template>

<script>
const NET = require('../../utils/request')
const API = require('../../config/api')
export default {
  name: "qADetail",
  data(){
    return{
  	  detailList:{},//商品问答详情
  	  productId:'',
  	  images:'',
  	  productName:'',
	  problemsData:{},
	  answerText:"",
	  answerslength:0,
	  num:0,
	  isIphone: false,
    }
  },
  onLoad(options) {
	this.isIphone = getApp().globalData.isIphone;
	this.problemsData = uni.getStorageSync("seeAllFnData")
	this.getProblems()
  },
  methods:{
	  goGoodsDetails(){
		  let shopId = this.detailList.shopId
		  let productId = this.detailList.productId
		  let skuId = this.detailList.skuId
		  uni.navigateTo({
		  	url:'/pages_category_page3/merchants/goodsDetails?shopId='+shopId+'&productId='+productId+'&skuId='+skuId
		  })
	  },
	  //商品问答数据
	  getProblems(){
	  	NET.request(API.getProblemDetail, {
			problemId:this.problemsData.problemId,
			productId:this.problemsData.productId,
		},'GET').then(res => {
	  		this.detailList = res.data
			this.answerslength = this.detailList.answers.length
			uni.removeStorageSync('seeAllFnData')
	  	}).catch(res => {
	  		uni.showToast({
	  			title:'失败',
	  			icon:"none"
	  		})
	  	})
	  },
	  //回答
	  answer(){
		  NET.request(API.addAnswer, {
		  	productId:this.problemsData.productId,
		  	answer:this.answerText,
			problemId:this.problemsData.problemId
		  },'POST').then(res => {
			 this.getProblems()
			 this.answerText = ""
		  	uni.showToast({
		  		title:'回答成功',
		  		icon:"success"
		  	})
		  }).catch(res => {
		  	uni.showToast({
		  		title:'失败',
		  		icon:"none"
		  	})
		  })
	  }
  }
}
</script>

<style lang="scss" scoped>
  .qaBox {
    padding: 0 30upx;
    .qaTopInfo {
      margin-top: 20upx;
      .qaTopInfoBox {
        border-radius: 10upx;
        display: flex;
        align-items: center;
        padding: 15upx 20upx;
        margin-bottom: 55upx;
        background: #F6F6F6;
        image {
          width: 60upx;
          height: 60upx;
          border-radius: 5upx;
          margin-right: 20upx;
        }
        .qaInfoText {
          h3 {
            font-size: 30upx;
            font-weight: 500;
            color: #333333;
          }
          span {
            font-size: 24upx;
            color: #999999;
          }
        }
      }
      .qaTitBox {
        padding-bottom: 30upx;
        border-bottom: 1upx solid #EEEEEE;
        .qaTit {
          display: flex;
          align-items: center;
          margin-bottom: 35upx;
          i {
            width: 38upx;
            height: 38upx;
            background: linear-gradient(0deg, #FF7800 0%, #F79D4D 100%);
            border-radius: 4upx;
            font-style: normal;
            text-align: center;
            color: #FFFFFF;
            font-size: 28upx;
            margin-right: 30upx;
          }
          h3 {
            font-size: 28upx;
            font-family: PingFang SC;
            font-weight: 500;
            color: #333333;
          }
        }
        .qaTitTime {
          display: flex;
          align-items: center;
          img {
            width: 44upx;
            height: 44upx;
            margin-right: 20upx;
          }
          .qaName {
            font-size: 28upx;
            color: #666666;
            margin-right: 35upx;
          }
          .qaTimeInfo {
            color: #999999;
            font-size: 22upx;
          }
        }
      }
    }
    .answerListBox {
      .answerNum {
        font-size: 24upx;
        color: #999999;
        margin-bottom: 40upx;
        margin-top: 30upx;
      }
      .answerList {
        padding-bottom: 50upx;
        .answerItem {
          margin-bottom: 10upx;
          .itemTit {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .itemAvatarBox {
              display: flex;
              img {
                width: 46upx;
                height: 46upx;
                margin-right: 20upx;
              }
              .answerName {
                font-size: 28upx;
                color: #666666;
              }
            }
            .answerTime {
              color: #999999;
              font-size: 22upx;
            }
          }
          .answerInfo {
            color: #333333;
            font-size: 28upx;
            padding-left: 66upx;
            margin-top: 20upx;
          }
        }
      }
    }
    .answerBtn {
      position: fixed;
      width: 100%;
      bottom: 0;
      left: 0;
      .answerBtnBox {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 30upx;
        background: #FFFFFF;
        input {
          margin-right: 30upx;
          width: 530upx;
          background: #F1F1F1;
          border-radius: 29upx;
          min-height: 58upx;
          padding-left: 30upx;
          font-size: 28upx;
          color: #999999;
        }
        .answerButton {
          width: 130upx;
          height: 58upx;
          background: #FF7800;
          border-radius: 29upx;
          text-align: center;
          line-height: 58upx;
          font-size: 30upx;
          color: #FFFFFF;
          .input-placeholder {
            font-size: 24upx;
            color: #999999;
          }
        }
      }
    }
  }
</style>
