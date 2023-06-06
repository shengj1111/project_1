<template>
	<view class="container">
		<!-- 申请分销员 -->
		<view class="topBackImg flex-items flex-column">
			<!-- <label class="font-color-FFF mar-top-40">分销员招募令</label> -->
			<view class="content mar-top-36">
				<view class="topColor"></view>
				<view class="text-box mar-left-30">
					<label class="fs-bold">分销员是什么？</label>
					<view class="fs24 font-color-656 mar-top-20">分销员是我们为拥有推广能力的用户推出的运营计划。你只需将高品质商品分享推荐给他人，收获他人的感谢的同时，挣得属于自己的利润。</view>
				</view>
				<view class="text-box mar-top-20 mar-left-30">
					<label class="fs-bold">我该怎么成为分销员？</label>
					<view class="fs24 font-color-656 mar-top-20">
						<view>
							<label class="fs-bold"> · </label>
							<label class="mar-left-20">点击本页面的【我要成为分销员】，即可完成申请。</label>
						</view>
						<view class="flex-row-plus mar-top-20">
							<label class="fs-bold"> · </label>
							<label class="mar-left-20 textDes">点击拥有分销员活动标识的分享按钮，将商品分享给好友或朋友圈。</label>
						</view>
						<view class="mar-top-20">
							<label class="fs-bold"> · </label>
							<label class="mar-left-20">朋友通过您的链接进入并购买一件商品。</label>
						</view>
						<view class="flex-row-plus textDes mar-top-20">
							<label class="fs-bold"> · </label>
							<label class="mar-left-20">我们收到已完成的订单时，会将本订单的佣金结算给您。</label>
						</view>
						<view class="mar-top-20">
							<label class="fs-bold"> · </label>
							<label class="mar-left-20">返回个人中心-分销中心，查看您的。</label>
						</view>
					</view>
				</view>
				<view class="text-box mar-top-20 mar-left-30">
					<label class="fs-bold">其他说明</label>
					<view class="fs24 font-color-656 mar-top-20">
						<view>
							<label class="fs-bold"> · </label>
							<label class="mar-left-20">客户只有通过您的链接成交，才能返佣给您。</label>
						</view>
						<view class="flex-row-plus mar-top-20">
							<label class="fs-bold"> · </label>
							<label class="mar-left-20 textDes"> 若订单发生退款，我们将去除本订单的佣金。</label>
						</view>
						<view class="mar-top-20">
							<label class="fs-bold"> · </label>
							<label class="mar-left-20">商品的售后问题，由本商店处理。</label>
						</view>
						<view class="flex-row-plus textDes mar-top-20">
							<label class="fs-bold"> · </label>
							<label class="mar-left-20">不传播任何违法违规信息，一经发现，即被清退，本商城不负任何责任。</label>
						</view>
						<view class="mar-top-20">
							<label class="fs-bold"> · </label>
							<label class="mar-left-20">以上内容解释权归本商城所有。</label>
						</view>
					</view>
				</view>
			</view>

		</view>
		<view class="butBox flex-items-plus" @click="informationShowClick">
			<view class="submitbut">我要成为分销员</view>
		</view>
		<!-- 填写信息弹窗 -->
		<u-popup v-model="informationShowFalg" mode="center" border-radius="14">
      <view class="informationShow-box">
        <view class="flex-items flex-column informationShow-centent">
          <view class="mar-top-30">
            <label class="fs-bold fs36">请填写相关信息</label>
          </view>
		  <view class="flex-items flex-row mar-top-30 mar-left-40 phoneStyle">
			<label class="fs26 font-color-656">商家名</label>
		    <input class="recruitIphone mar-left-20 fs26" disabled="disabled" type="text" v-model="shopName"/>
		  </view>
          <view class="flex-items flex-row mar-top-30">
            <view class="fs26 font-color-656">真实姓名<label class="font-color-red">*</label></view>
            <input class="recruitName mar-left-20 fs26" v-model="userName"/>
          </view>
          <view class="flex-items flex-row mar-top-30 phoneStyle">
            <label class="fs26 font-color-656">联系电话<label class="font-color-red">*</label></label>
            <input class="recruitIphone mar-left-20 fs26" disabled="disabled" type="number" v-model="mobile"/>
          </view>
          <view class="flex-items flex-row mar-top-30 mar-left-40">
            <label class="fs26 font-color-656">邀请码</label>
            <input class="recruitIphone mar-left-20 fs26" v-model="inviteId"/>
          </view>
          <view class="flex-row-plus massageDes-but fs28">
            <view class="exitBut" @click="exitButClick">取消</view>
            <view class="submitbut" @click="submitbut">提交</view>
          </view>
        </view>
      </view>
		</u-popup>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	import {
		getById2
	} from '@/api/shopmanage.js';
	
	export default {
		data() {
			return {
				informationShowFalg: false,
				item: '',
				userName:'',
				mobile:'',
				inviteId:'',
				shopId:0,
				shopName:""
			}
		},
		onLoad(options) {
			if (getApp().globalData.distributeRecruitItem) {
				const item = getApp().globalData.distributeRecruitItem
				this.shopId = parseInt(item.shopId)
				getApp().globalData.distributeRecruitItem = undefined
			} else {
				this.shopId = parseInt(options.shopId)
			}
			
			getById2(this.shopId).then(res => {
				let _d = res.data;
				this.shopName = _d.shopName;
				
			});
		},
		methods: {
			informationShowClick() {
				this.informationShowFalg = true
        const res = uni.getStorageSync('storage_key');
				this.mobile = res.phone
			},
			exitButClick() {
				this.informationShowFalg = false
			},
			submitbut() {
				this.applyForRecruit()
			},
			//申请为分销员
			applyForRecruit(){
				var regphone = /^((1[3,5,8,7,6,9][0-9])|(14[5,7])|(17[0-9])|(19[7]))\d{8}$/;
				if(this.userName == ''){
					uni.showToast({
						title:'真实姓名不能为空',
						icon:'none'
					})
				}else if (this.mobile == '') {
					uni.showToast({
						title:'手机号不能为空',
						icon:'none'
					})
				}else if (!regphone.test(this.mobile)) {
					uni.showToast({
						title:'手机格式不正确',
						icon:'none'
					})
				}else{
					NET.request(API.Apply,{
						shopId:this.shopId,
						distributorPhone: this.mobile,
						distributorName: this.userName,
						invitationCode:this.inviteId
					},'POST').then(res => {
						this.informationShowFalg = false
						uni.showToast({
							title:'请等候审核...',
						})
						setTimeout(() => {
						  uni.navigateBack({
						  	delta: 1
						  });
						}, 1500);
					}).catch(res => {
						uni.showToast({
							title:'申请失败',
							icon:'none'
						})
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.container {
		.topBackImg {
			width: 100%;
			height: 260upx;
			background-image: linear-gradient(135deg, rgba(0, 206, 82, 1.0) 10%, rgba(0, 170, 73, 1) 100%);
			
			// background: url(../../static/images/storeTop_Img.png) no-repeat;
			background-size: 100% 260upx;

			.content {
				width: 690upx;
				background-color: #FFFFFF;

				.topColor {
					height: 60upx;
					background-image: linear-gradient(to bottom, rgba(0, 170, 73, 1) 10%, #FFFFFF 100%);
					opacity: 0.5;
				}

				.text-box {
					width: 622upx;

					.textDes {
						width: 598upx;
						line-height: 40upx;
					}
				}
			}

		}

		.butBox {
			height: 98upx;
			width: 100%;
			position: absolute;
			bottom: 0upx;
			left: 0upx;
			background-color: #FFFFFF;
			box-shadow: 0upx 3upx 12upx #999999;

			.submitbut {
				height: 80upx;
				width: 690upx;
				// background-image: linear-gradient(135deg, #FFA100 10%, #FF7911 100%);
				background-image: linear-gradient(135deg, rgba(0, 206, 82, 1.0) 10%, rgba(0, 170, 73, 1) 100%);
				
				color: #FFFFFF;
				font-size: 28upx;
				border-radius: 40upx;
				text-align: center;
				line-height: 80upx;
			}
		}

		.informationShow-box {
      .flex-items {
        input {
          padding-left: 16upx;
        }
      }
      .phoneStyle {
        input {
          background: #EEEEEE;
          color: #999999;
        }
      }
			.informationShow-centent {
				width: 520upx;
				height: 550upx;
				.recruitName {
					border: 1upx solid #DDDDDD;
					width: 300upx;
					height: 48upx;
				}

				.recruitIphone {
					border: 1upx solid #DDDDDD;
					width: 300upx;
					height: 48upx;
				}

				.massageDes-but {
					position: absolute;
					bottom: 0;
				}

				.exitBut {
					border: 1upx solid #E5E5E5;
					width: 260upx;
					height: 90upx;
					text-align: center;
					line-height: 90upx;
				}

				.submitbut {
					background-color: rgba(0, 170, 73, 1);
					width: 260upx;
					height: 90upx;
					text-align: center;
					line-height: 90upx;
					color: #FFFFFF;
				}
			}
		}
	}
</style>
