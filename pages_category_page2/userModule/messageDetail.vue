<template>
	<view class="messageDetail">
		<h3 class="detailTit">{{messageDateils.noticeTitle}}</h3>
		<view class="detailTime">时间：{{messageDateils.createTime}}</view>
		<view class="detailInfo">
			<rich-text :nodes="htmlData"></rich-text>
			<img :src="messageDateils.image" alt="">
		</view>
	</view>
</template>

<script>
	import parse from 'mini-html-parser2';
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default {
		name: "messageDetail",
		data() {
			return {
				onlyid: 0,
				messageDateils: {},
				htmlData: []
			}
		},
		onLoad(options) {
			this.onlyid = options.noticeId
			this.gitMassageDateils()
		},
		methods: {
			formatRichText(html) {
				let newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
					match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
					match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
					match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
					return match;
				});
				newContent = newContent.replace(/style="[^"]+"/gi, function(match, capture) {
					match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi,
						'max-width:100%;');
					return match;
				});
				newContent = newContent.replace(/<br[^>]*\/>/gi, '');
				newContent = newContent.replace(/\<img/gi,
					'<img style="max-width:100%;height:auto;display:block;margin-top:0;margin-bottom:0;"');
				return newContent;
			},
			gitMassageDateils() {
				NET.request(API.getMessageDateils, {
					noticeId: this.onlyid
				}, 'GET').then(res => {
					this.messageDateils = res.data
					this.messageDateils.noticeContent = this.formatRichText(this.messageDateils.noticeContent)
					console.log(this.messageDateils.noticeContent)
					parse(this.messageDateils.noticeContent, (err, htmlData) => {
						this.htmlData = htmlData
						console.log(this.htmlData)
						
					})
				}).catch(res => {
					uni.showToast({
						title: '失败',
						icon: "none"
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.messageDetail {
		padding: 30upx;

		h3 {
			font-size: 36upx;
			color: #333333;
			margin-bottom: 40upx;
		}

		.detailTime {
			font-size: 28upx;
			color: #666666;
			margin-bottom: 50upx;
		}

		.detailInfo {
			p {
				font-size: 28upx;
				color: #333333;
				line-height: 48upx;
				text-indent: 1em;
				margin-bottom: 50upx;
			}

			img {
				width: 100%;
			}
		}
	}
</style>
