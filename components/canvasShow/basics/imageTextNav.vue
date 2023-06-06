<template>
	<view class="ul image-text-nav" :class="'terminal' + terminal">
		<view class="li" v-for="(item,index) in componentContent.imgTextData" :key="index"
			:style="{'flex':'0 0 '+ getItemValue() + '%'}" @click="getLink(item.linkObj)">
			<!--<router-link class="item" :to="getLink(item.linkObj)">-->
			<view class="imgBox">
				<image class="img" :src="item.img"></image>
			</view>
			<h4 class="h4">{{item.title}}</h4>
			<!--</router-link>-->
		</view>
	</view>
</template>

<script>
	import {
		funMixin
	} from '../config/mixin'
	export default {
		name: 'imageTextNav',
		mixins: [funMixin],
		props: {
			terminal: {
				type: Number,
				default: 4
			},
			componentContent: {
				type: Object
			}
		},
		methods: {
			// 计算生成格子百分比
			getItemValue(val) {
				const len = parseInt(this.componentContent.imgTextData.length)
				if (len === 0) {
					return 0
				} else {
					return (1 / len * 10000 / 100.00)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.image-text-nav {
		min-height: 100upx;
		width: 690upx;
		margin: 0 auto;
		display: flex;
		padding: 20upx 0;

		&.terminal4 {
			width: 1250upx;
		}

		.li {
			width: 0;
			text-align: center;

			.imgBox {
				.img {
					width: 100upx;
					height: 100upx;
				}
			}

			.h4 {
				font-size: 26upx;
				color: #333;
				line-height: 33upx;
				font-weight: normal;
			}
		}
	}
</style>
