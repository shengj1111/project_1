<template>
	<view class="invitePoster-box">
		<view class="poster-box flex-items-plus flex-column">
			<image class="header-img mar-top-10" :src="data.headImage"></image>
			<label class="mar-top-30">发现一件好物，快来和我一起拼</label>
			<image class="poster-img mar-top-50" :src="data.image"></image>
			<view class="flex-row-plus flex-sp-between mar-top-40">
				<view class="flex-column-plus">
					<label class="title-lab fs28">{{data.productName}}</label>
					<view class="spellNum flex-items-plus font-color-FF7800 mar-top-30 fs24">{{data.person}}人团</view>
					<view class="flex-row-plus mar-top-20 flex-items">
						<label class="font-color-FF7800 fs24">¥</label>
						<label class="font-color-FF7800 fs36 mar-left-5">{{data.price}}</label>
						<label class="font-color-999 fs26 mar-left-20">原价：¥{{data.originalPrice}}</label>
					</view>
				</view>
				<view class="flex-column-plus flex-items-plus">
					<image style="width: 180upx;height: 180upx;" :src="qrcode"></image>
					<label class="font-color-666">扫描二维码</label>
				</view>
			</view>
			<!-- #ifndef H5 -->
			<view @click="savePoster(1)" class="saveposter-but flex-items-plus mar-top-50">保存海报</view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view @click="savePoster(2)" class="saveposter-but flex-items-plus mar-top-50">预览海报</view>
			<!-- #endif -->
		</view>
		<view class="bor-reu-8 pad-bot-30 canvas-box">
			<canvas style="width: 720rpx; height: 1000rpx;" canvas-id="posterCanvas" id="posterCanvas"></canvas>
		</view>
	</view>
</template>

<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue'
	import { pathToBase64, base64ToPath } from 'image-tools'
	export default {
		data() {
			return {
				data:{},
				canvasWidth:0,
				codeImg:'',
				codeImg2:'',
				headImage:'',
				image:'',
				qrcode:'',
				qrcodeimg:''
			};
		},
		onLoad(options) {
			this.data =JSON.parse(options.data)
			this.getShare()
		},
		methods:{
			savePoster(type){
				if(type == 1){
					uni.showLoading({
						title:"保存中..."
					})
          console.log(9999)
					let that = this
					setTimeout(function(){
            // #ifdef H5 || MP-WEIXIN || APP-PLUS
						uni.canvasToTempFilePath({ //把画布转化成临时文件进行保存
							fileType: 'png', // 保存成的文件类型
							quality: 0, // 图片质量
							canvasId: 'posterCanvas', // 画布ID
							success(res) {
							  console.log(res.tempFilePath, 'test')
                that.saveDownload(res.tempFilePath)
							},
							fail() {
								uni.showToast({
									title: '保存失败，稍后再试',
									duration: 2000,
									icon: 'none'
								})
								uni.hideLoading();
							}
						})
            // #endif
            // #ifdef MP-ALIPAY
            const CanvasContext = my.createCanvasContext('posterCanvas');
            CanvasContext.toTempFilePath({
              success(res) {
                console.log(2222)
                console.log(res.apFilePath)
                my.saveImage({
                  url: res.apFilePath,
                  success: res => {
                    console.log('saveImage', res)
                    uni.hideLoading();
                    uni.showToast({
                      title: '图片保存成功~',
                      duration: 2000
                    })
                  },
                  fail: err => {
                    console.error('saveImage err', err)
                  },
                })
              },
              fail() {
                uni.showToast({
                  title: '保存失败，稍后再试',
                  duration: 2000,
                  icon: 'none'
                })
                uni.hideLoading();
              }
            })
            // #endif
					},5000)
				}else if(type == 2){
					uni.showLoading({
						title:"图片生成中..."
					})
					let that = this
					setTimeout(function(){
						uni.canvasToTempFilePath({ //把画布转化成临时文件进行保存
							fileType: 'png', // 保存成的文件类型
							quality: 0, // 图片质量
							canvasId: 'posterCanvas', // 画布ID
							success(res) {
								uni.downloadFile({
									url: res.tempFilePath,//网络路径，下载下来
									success: (res1) => {
										if (res1.statusCode === 200) {
											uni.hideLoading();
											uni.showModal({
											   title: '提示',
											   content: '长按即可保存图片',
											   confirmText: "确定",
											   cancelText: '取消',
											   success: (res) => {
													if (res.confirm) {
														uni.previewImage({
															current: res1.tempFilePath, // 当前显示图片的http链接
															urls: [res1.tempFilePath] // 需要预览的图片http链接列表
														})
													}
												}
											})
										}
									}
								})
							},
							fail(err) {
								console.log(err.errMsg)
								uni.showToast({
									title: '保存失败，稍后再试',
									duration: 2000,
									icon: 'none'
								})
							}
						})
					},5000)
				}
			},
      saveDownload (file) {
        uni.downloadFile({
          url: file,//网络路径，下载下来
          success: (res1) => {
            if (res1.statusCode === 400 || res1.statusCode === 200) {
              // 2-保存图片至相册
              console.log(2222)
              uni.saveImageToPhotosAlbum({ // 存成图片至手机
                filePath: file, //画布保存的图片临时文件
                success(res2) {
                  console.log(3333)
                  uni.hideLoading();
                  uni.showToast({
                    title: '图片保存成功~',
                    duration: 2000
                  })
                },
                fail(res3) {
                  if (res3.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
                    that.$store.dispatch('SetPhoneShow', 1)
                    uni.showToast({
                      title: '保存失败，稍后再试',
                      duration: 2000,
                      icon: 'none'
                    })
                  } else {
                    uni.showToast({
                      title: '保存失败，稍后再试',
                      duration: 2000,
                      icon: 'none'
                    })
                  }
                  uni.hideLoading();
                }
              })
            }
          }
        })
      },
			getShare(){
				NET.request(API.getShare,
				{
					collageId:this.data.collageId,
					orderId:this.data.orderId,
					productId:this.data.productId,
					skuId:this.data.skuId,
					type:0
				},
				"GET").then(res => {
					this.qrcode = res.data.qrcode
					this.getCanvas()
				}).catch(res => {
				})
			},
			getCanvas(){
				let that = this
				uni.getImageInfo({
					src: that.data.headImage,
					success: function (image) {
						that.headImage = image.path
						uni.getImageInfo({
							src: that.data.image,
							success: function (image2) {
								that.image = image2.path
								uni.getImageInfo({
									src: that.qrcode,
									success: function (image3) {
										that.qrcodeimg = image3.path
										setTimeout(() => {
											var ctx = uni.createCanvasContext('posterCanvas')
											ctx.setFillStyle('#FFFFFF')
											ctx.fillRect(15, 0, 820, 1000)
											// ctx.drawImage(that.data.headImage, 0, 0, 150, 100)
											that.drawRound(ctx,25,160,28,that.headImage)
											ctx.setFontSize(14)
											ctx.setFillStyle('#333333')
											ctx.fillText('发现一件好物，快来和我一起拼', 89, 120)
											ctx.drawImage(that.image, 25, 150, 310, 200)
											ctx.setFontSize(14)
											ctx.setFillStyle('#333333')
											ctx.fillText(that.data.productName, 40, 390)
											ctx.setFontSize(14)
											ctx.setFillStyle('#FF7800')
											ctx.fillText(that.data.person+'人团', 40, 430)
											ctx.setFontSize(24)
											ctx.setFillStyle('#FF7800')
											ctx.fillText('¥'+that.data.price, 40, 470)
											ctx.setFontSize(14)
											ctx.setFillStyle('#999999')
											ctx.fillText('原价：¥'+that.data.originalPrice, 120, 468)
											ctx.drawImage(that.qrcodeimg, 245, 370,80, 80)
											ctx.setFontSize(14)
											ctx.setStrokeStyle('#666666')
											ctx.fillText('扫描二维码', 250, 468)
											ctx.draw()
										}, 1500)
									}
								});
							}
						});
					}
				});
			},
			exportImg(){
				uni.canvasToTempFilePath({
					fileType: "jpg",
					canvasId: 'couponQrcode',
					success: function(res) {
						let that = this
						// 在H5平台下，tempFilePath 为 base64
						// #ifndef H5
						that.codeImg = res.tempFilePath
						// #endif
						// #ifdef H5
						base64ToPath(res.tempFilePath).then(path => {
							that.codeImg = path
						}).catch(error => {
							console.error(error)
						});
						// #endif
					}
				})
			},
			drawRound (ctx,r,x,y,img) {
			    ctx.save() // 保存之前的
			    var r = r // 半径*屏幕分辨率比例
			    var d = 2*r // 直径
			    var cx = x + r // 圆弧坐标x
			    var cy = y + r // 圆弧坐标 y
			    ctx.arc(cx, cy, r ,0, 2*Math.PI)
			    ctx.clip() // 裁剪
			    ctx.drawImage(img, x, y, d, d) // 画头像
			    ctx.restore() // 返回上一状态
			},
		}
	}
</script>

<style lang="scss">
.qrcode {
	padding: 0upx 0 20upx 0;
	display: flex;
	align-items: center;
	justify-content: center;
}
.title {
	text-align: center;
}
.canvas-box{
	position: absolute;
	top: -88888rpx;
}
page{background-color: #F7F7F7;}
.invitePoster-box{
	.bor-reu-8{border-radius: 8rpx;}

	.poster-box{
		background-color: #FFFFFF;
		margin: 30rpx 30rpx;
		width: 690rpx;
		padding: 40rpx 34rpx;
		border-radius: 8rpx;
		.header-img{
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
		}
		.poster-img{
			width: 100%;
			height: 414rpx;
		}
		.title-lab{
			width: 400rpx;
		}
		.spellNum{
			background-color: #FFEDDF;
			border-radius: 22rpx;
			width: 144rpx;
			height: 44rpx;
		}
		.code-img{
			width: 142rpx;
			height: 142rpx;
		}
		.saveposter-but{
			border-radius: 5rpx;
			background-color: #FF7800;
			color: #FFFFFF;
			width: 420rpx;
			height: 66rpx;
		}
	}
}
</style>
