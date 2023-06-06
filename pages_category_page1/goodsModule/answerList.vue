<template>
	<view class="wid bor-line-F7F7F7">
		<view class="qaBox">
		  <view class="qaTopInfo">
		    <view class="qaTopInfoBox">
		      <image :src="images"></image>
		      <view class="qaInfoText">
		        <h3>{{productName}}</h3>
		        <span>共{{getProblemsList.length}}个问题</span>
		      </view>
		    </view>
		  </view>
		  <view class="qaListBox">
		    <view class="listBox" v-for="(pitem,index) in getProblemsList" :key="index">
		      <view class="itemBox">
		        <view class="itemAsk">
		          <i>问</i><span>{{pitem.problem}}</span>
		        </view>
				<view v-if="pitem.answers.length>0">
					<view class="answer" v-for="(witem,index) in twonumansers(pitem.answers)" :key="index">
					  <view class="answerBox">
					    <i>答</i><span>{{witem.answer}}</span>
					  </view>
					  <view v-if="pitem.ifAnswer==1" class="answerBtn" @click="seeAllFn(pitem.problemId)">立即回答</view>
					</view>
				</view>
		        <view v-else>
					<view class="answer">
					  <view class="answerBox flex-row-plus">
					      <i class="ianswer">答</i><span>暂无答复</span>
					  </view>
					  <view v-if="pitem.ifAnswer==1" class="answerBtn" @click="seeAllFn(pitem.problemId)">立即回答</view>
					</view>
				</view>
				<view v-if="pitem.answers.length>1" class="seeAll" @click="seeAllFn(pitem.problemId)">查看全部答复</view>
		      </view>
		    </view>
		  </view>
		  <view class="putQuestionsBox">
		    <view class="putQuestionsBtn" @click="goToQuestions">去提问</view>
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
		  getProblemsList:[],//商品问答数据
		  productId:'',
		  images:'',
		  productName:'',
		  problemsPage:1,
		  problemsPageSize:10,
		  loadingType:0
	  }
	},
	onReachBottom(){
		if(this.loadingType == 1){
			uni.stopPullDownRefresh()
		}else{
			this.problemsPage = this.problemsPage+1
			this.getProblems()
		}
	},
	onLoad(options) {
		this.productId = options.productId
		this.images = options.img
		this.productName = options.productName
		this.getProblems()
	},
	methods: {
		twonumansers(answers){
			let data = answers.slice(0,1)
			return data
		},
		//商品问答数据
		getProblems(){
			NET.request(API.getProblems, {
				productId:this.productId,
				page:this.problemsPage,
				pageSize:this.problemsPageSize
			},'GET').then(res => {
				if(res.data.length == 0){
					this.loadingType = 1
					this.problemsPage = this.problemsPage
				}else{
					this.getProblemsList = this.getProblemsList.concat(res.data.list)
				}
			}).catch(res => {
				uni.showToast({
					title:'失败',
					icon:"none"
				})
			})
		},
		seeAllFn (problemId) {
		  let data = {
		  	  productId:this.productId,
		  	  img:this.images,
		  	  productName:this.productName,
		  	  questionlength:this.getProblemsList.length,
		  	  problemId:problemId
		  }
		  uni.setStorageSync("seeAllFnData",data)
		  uni.navigateTo({
		    url: 'qADetail'
		  })
		},
		// 提问
		// 提问
		goToQuestions () {
			let data={
				productId:this.productId,
				images:this.images,
				productName:this.productName,
				questionNumber:this.getProblemsList.length
			}
			uni.navigateTo({
				url: 'putQuestions?data='+JSON.stringify(data)
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.qaBox {
  padding-bottom: 140upx;
  .ianswer {
    font-style: normal;
    width: 38upx;
    height: 38upx;
    line-height: 38upx;
    background: linear-gradient(0deg, #2DB76F 0%, #67C192 100%);
    border-radius: 4upx;
    display: block;
    text-align: center;
    margin-right: 30upx;
    color: #FFFFFF;
  }
  .qaTopInfo {
    margin-top: 20upx;
    margin-bottom: 30upx;
	padding: 0 40upx;
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
  .qaListBox {
    .listBox {
      padding: 20upx 60upx 20upx 60upx;
	  border-bottom: 1upx solid #EEEEEE;
      .itemBox {
        padding-bottom: 30upx;
        border-bottom: 1upx solid #EEEEEE;
        margin-top: 10rpx;
        &:last-child {
          border-bottom: none;
        }
        .itemAsk {
          display: flex;
          align-items: center;
          margin-bottom: 42upx;
          i {
            font-style: normal;
            width: 38upx;
            height: 38upx;
            line-height: 38upx;
            background: linear-gradient(0deg, #FF7800 0%, #F79D4D 100%);
            border-radius: 4upx;
            display: block;
            margin-right: 30upx;
            font-size: 28upx;
            color: #FFFFFF;
            text-align: center;
          }
          span {
            font-size: 28upx;
            color: #333333;
          }
        }
        .answer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          // margin-bottom: 30upx;
          .answerBox {
            display: flex;
            align-items: center;
            i {
              font-style: normal;
              width: 38upx;
              height: 38upx;
              line-height: 38upx;
              background: linear-gradient(0deg, #2DB76F 0%, #67C192 100%);
              border-radius: 4upx;
              display: block;
              text-align: center;
              margin-right: 30upx;
              color: #FFFFFF;
            }
            span {
              font-size: 26upx;
              color: #666666;
            }
          }
          .answerBtn {
            width: 130upx;
            height: 44upx;
            line-height: 44upx;
            background: #FFFFFF;
            border: 1px solid #FF7800;
            border-radius: 22upx;
            text-align: center;
            color: #FF7800;
            font-size: 24upx;
          }
        }
        .seeAll {
          margin-left: 68upx;
          font-size: 28upx;
          color: #FF7800;
        }
      }
    }
  }
  .putQuestionsBox {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #FFFFFF;
  }
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
</style>
