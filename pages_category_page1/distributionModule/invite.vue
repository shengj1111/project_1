<template>
	<view>
		<u-mask :show="show" z-index="10000">
			<view class="warp">
				<view class="rect" @tap.stop>
					<!-- 关闭按钮 -->
					<view class="guanbiBox">
						<image @click="showcos" src="../../static/img/guanbi.png" class="guanbi" mode=""></image>
					</view>
					<!-- 内容 -->
					<view>
						<image src="../../static/img/banyuan.png" style="width: 100%;height: 44rpx;" mode=""></image>
					</view>
					<view style="padding: 30rpx;">
						<!-- 个人信息 -->
						<view class="user">
							<view>
								<image :src="listitem.headImage" style="width: 90rpx;height: 90rpx;border-radius: 50%;" mode=""></image>
							</view>
							<view style="margin-left: 20rpx;">
								<p style="margin-top: 5rpx; font-size: 28rpx;">{{listitem.name}}</p>
								<p style="margin-top: 10rpx; font-size: 20rpx; color: #9A9A9A;">{{listitem.extensionReason}}</p>
							</view>
							<view style="color: #FF7800;font-size: 24rpx;flex: 1; text-align: right;line-height: 90rpx;" v-if="listitem.invitationCode">
								邀请码：{{listitem.invitationCode}}
							</view>
						</view>
						<!-- 图片宣传 -->
						<view class="flex-items-plus">
							<image :src="listitem.image" style="width: 450upx;height:450upx" mode=""></image>
						</view>
						<view style="display: flex;margin-top: 40upx;">
							<view style="flex: 1;line-height: 40rpx;">
                <p style="color: #343434;font-size: 24rpx;">点击二维码保存到本地长按识别小程序</p>
                <p style="color: #666666;font-size: 22rpx;">来自「cereshop商城」小程序</p>
							</view>
							<view style="margin-left: 60rpx;" v-if="listitem.ifLogo">
								<!-- <image src="../../static/img/user/morentouxiang.png" style="width: 118rpx;height: 118rpx;" mode=""></image> -->
								<view class="qrimg-i" @click="saveQrcode">
									<tki-qrcode  cid="qrcode2" ref="qrcode2" :val="erweima" :size="size" :onval="onval" :loadMake="loadMake" :usingComponents="true" />
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
      <!-- 分享 -->
      <view class="fenx">
        <view class="shareBox">
          <button open-type="share" >
            <view @click="WXfenx" style="flex: 1;text-align: center;display: flex;">
              <view style="margin-left: 120rpx;">
                <image src="../../static/img/weixin2x.png" mode=""></image>
              </view>
              <view style="margin-left: 10rpx;font-size: 28rpx;color: #333333">分享到微信</view>
            </view>
          </button>
        </view>
        <!--        <view class="share">-->
        <!--          <button open-type="share">-->
        <!--            <image  :src="item.icon"  mode='heightFix' @click="share_action"></image>-->
        <!--            <text>分享</text>-->
        <!--          </button>-->
        <!--        </view>-->
        <view class="linkBtnBox" @click="FZlianj">
          <view class="linkBox">
            <image src="../../static/img/lianjie.png" mode=""></image>
          </view>
          <view style="margin-left: 10rpx;">
            复制链接
          </view>
        </view>
      </view>
		</u-mask>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue'
	export default {
		components:{ tkiQrcode },
		data() {
			return {
				size: 110, // 二维码大小
				onval: true, // val值变化时自动重新生成二维码
				loadMake: true, // 组件加载完成后自动生成二维码
				erweima:'',
				show: true,
				item:{},
				listitem:{},
				FindSalesPromQuery:{
					type:2,
					tenantCode:''
				},
				shopId:0,
				distributorId:0
			}
		},
		onLoad: function(item) {
			this.item = JSON.parse(item.tenantCode)
			this.shopId = item.shopId
			this.distributorId = item.distributorId
      this.erweima = '/pages_category_page1/store/index?storeId='+this.shopId,
			this.getFindSalesPromConfig()
		},
		methods:{
			getFindSalesPromConfig(){
				NET.request(API.FindSalesPromConfig, {
					shopId:this.shopId,
					title:'邀请下级',
					distributorId:this.distributorId
				}, 'GET').then(res => {
					this.listitem = res.data
				}).catch(res => {

				})
			},
			showcos(){
				uni.navigateBack({
					delta:1
				})
			},
			WXfenx() {
			},
      FZlianj() {
        // API.shareLink + '/h5/#/pages/store/index?storeId='+this.shopId+'&salesId='+this.salesId
        uni.setClipboardData({
          data: API.shareLink + '/h5/#/pages_category_page1/store/index?storeId='+this.shopId,
          success:res=>{
            uni.showToast({
              title:'复制成功',
              icon:'none',
              duration: 2000//时间
            });
          }
        })
      },
      // 分享到朋友圈
      onShareTimeline(options) {
        let that = this
        let data = {
          title:'', // 默认是小程序的名称
          path: '/pages_category_page1/store/index?storeId='+this.shopId,
          imageUrl: '', // 图片封面，本地文件路径、网络图片路，支持PNG及JPG，默认当前页面截图，显示图片长宽比是 5:4。
          success: res => {
            // 分享成功
            if (res.errMsg == 'shareAppMessage:ok') {}
          },
          fail: res => {
            // 用户取消
            if (res.errMsg == 'shareAppMessage:fail cancel') {}
            // 分享失败
            if (res.errMsg == 'shareAppMessage:fail') {}
          },
          complete: res => {}
        }
        return data
      },
      // 分享给好友
      onShareAppMessage(options){
        var that = this;
        // 设置菜单中的转发按钮触发转发事件时的转发内容
        var shareObj = {
          title:'',        // 默认是小程序的名称(可以写slogan等)
          desc:'',// 小程序的描述
          path: '/pages_category_page1/store/index?storeId='+this.shopId,        // 默认是当前页面，必须是以‘/’开头的完整路径
          imageUrl: '', // 图片封面，本地文件路径、网络图片路，支持PNG及JPG，默认当前页面截图，显示图片长宽比是 5:4。
          success: function(res){
            // 转发成功之后的回调

            if(res.errMsg == 'shareAppMessage:ok'){
              console.log(res)

            }
          },
          fail: function(){
            // 转发失败之后的回调
            if(res.errMsg == 'shareAppMessage:fail cancel'){
              console.log(res)
              // 用户取消转发
            }else if(res.errMsg == 'shareAppMessage:fail'){
              console.log(res)
              // 转发失败，其中 detail message 为详细失败信息
            }
          },
          complete: function(){
            // 转发结束之后的回调（转发成不成功都会执行）
          }
        }
        // 来自页面内的按钮的转发
        if( options.from == 'button' ){
          var eData = options.target.dataset;
          console.log( eData.id);     // shareBtn
          // 此处可以修改 shareObj 中的内容
          shareObj.path = '/pages_category_page1/store/index?storeId='+this.shopId
        }
        // 返回shareObj
        return shareObj;
      },
      saveQrcode() {
        this.$refs.qrcode._saveCode()
      }
		}
	}
</script>

<style lang="less" scoped>
	.guanbiBox{
		padding: 30upx 20upx;

	}
	.warp {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;

	}
	.qrimg-i{
		margin-right: 10px;
	}
	.guanbi{
		width: 46rpx;
		height: 46rpx;
		position: absolute;
		top: -100rpx;
		left: 50%;
		margin-left: -23rpx;
	}
	.rect {
		width: 75%;
		height: 65%;
		background-color: #fff;
		position: relative;

		.user{
			display: flex;
		}


	}
  .fenx {
    position: fixed;
    bottom: 118rpx;
    z-index: 10001;
    background-color: #F7F7F7;
    width: 100%;
    height: 98rpx;
    display: flex;
    color: #343434;

    view {
      line-height: 98rpx;
    }

    image {
      width: 50rpx;
      height: 50rpx;
      display: inline-block;
      margin-top: 25rpx;
    }
  }
  .linkBtnBox {
    flex: 1;
    text-align: center;
    display: flex;
    .linkBox {
      margin-left: 70rpx;
    }
  }
  // #ifdef H5
  .fenx {
    display: none;
  }
  // #endif
</style>
