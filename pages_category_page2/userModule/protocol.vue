<template>
	<view>
		<view id="text">
			<rich-text :nodes="item.dictDescribe"></rich-text>
		</view>
	</view>
</template>
<script>
	const NET = require('../../utils/request')
	const API = require('../../config/api')
	export default{
		data(){
			return{
				type:'app_protocol_context',
				item:{}
			}
		},
		onLoad(){
			this.getquery()
			
		},
		methods:{
			getquery(){
				NET.request(API.Query,{
					name:this.type
				}, 'GET').then(res => {
					this.item = res.data
				}).catch(res => {
					
				})
			}
			
		}
	}
</script>

<style scoped>
	#text{
		padding: 40rpx;
	}
</style>
