<template>
  <view class="qaBox">
    <view class="qaTopInfo">
      <view class="qaTopInfoBox">
        <image :src="qudata.images"></image>
        <view class="qaInfoText">
          <h3>{{qudata.productName}}</h3>
          <span>共{{qudata.questionNumber}}个问题</span>
        </view>
      </view>
    </view>
    <view class="questionCent">
      <view class="uni-textarea">
        <textarea v-model="questionText" placeholder="请说出你的问题..." auto-height />
      </view>
      <view class="anonymous">
		  <view class="flex-row-plus flex-items" @click="changeCheck">
			 <image mode="aspectFill" v-if="anonymous == true" src="../../static/images/selectActive.png" class="cart-select-img"></image>
			 <image mode="aspectFill" v-else src="../../static/images/selectEmpty.png" class="cart-select-img"></image>
			 <label>匿名提问</label>
		  </view>
      </view>
    </view>
    <view class="putQuestionsBox" @click="addProblem">
      <span class="putQuestionsBtn">发布</span>
    </view>
  </view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		name: "qADetail",
		data () {
			return {
			  anonymous: false,
			  qudata:{},
			  questionText:'',
			  ifAnonymous:0
			}
		},
		onLoad(options) {
			this.qudata = JSON.parse(options.data)
		},
		methods: {
			seeAllFn () {
			  uni.navigateTo({
				url: 'qADetail'
			  })
			},
			changeCheck(){
				this.anonymous = !this.anonymous
			},
			addProblem(){
			  if (this.questionText === '') {
          uni.showToast({
            title:'内容不能为空！',
            icon:"none"
          })
          return false
        }
        uni.showLoading({
          title: '提交中...',
          mask: true
        });
				if(this.anonymous == true){
					this.ifAnonymous = 1
				}else{
					this.ifAnonymous = 0
				}

				NET.request(API.addProblem, {
					productId:this.qudata.productId,
					problem:this.questionText,
					ifAnonymous:this.ifAnonymous
				},'POST').then(res => {
          uni.hideLoading()
					uni.showToast({
						title:'提问成功',
						icon:"success"
					})
          uni.navigateTo({
            url:'../../pages_category_page2/userModule/questionList'
          })
				}).catch(res => {
					uni.showToast({
						title:'失败',
						icon:"none"
					})
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
.qaBox {
  padding: 0 30upx;
  .cart-select-img {
    width: 50upx;
    height: 50upx;
    margin: 30upx;
    box-sizing: border-box;
  }
  .qaTopInfo {
    margin-top: 20upx;
    margin-bottom: 30upx;
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
  .questionCent {
    width: 100%;
    textarea {
      padding: 30upx;
      box-sizing: border-box;
      min-height: 300upx;
      background: #FFFFFF;
      border: 1upx solid #EEEEEE;
      border-radius: 10upx;
      width: 100%;
      color: #666666;
    }
    .textarea-placeholder {
      font-size: 26upx;
      color: #999999;
    }
    .anonymous {
      label {
        font-size: 26upx;
        color: #333333;
      }
    }
  }
  .putQuestionsBox {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #FFFFFF;
    .putQuestionsBtn {
      width: 421upx;
      height: 67upx;
      line-height: 67upx;
      text-align: center;
      background: #FF7800;
      border-radius: 5upx;
      display: block;
      margin: 0 auto 70upx auto;
      color: #FFFFFF;
    }
  }
}
</style>
