<template>
	<view class="conints">
		<input type="text" placeholder="请输入送货编号" class="ints" v-if="jinxiao"/>
		<input type="text" placeholder="请输入送货时间" class="ints" v-if="jinxiao"/>
		<input type="text" placeholder="请输入商品" class="ints" />
		<input type="text" placeholder="请输入经销商" class="ints" v-if="!jinxiao"/>
		<button class="mybtn">搜索</button>
		<button class="mybtn" @click="peisong" v-if="!jinxiao">配送</button>
	</view>
</template>

<script>
	export default{
		name:"",
		props:{
			jinxiao:{
				type:[String,Number],
				default:""
			}
		},
		data(){
			return {
				show:false
			}
		},
		methods:{
			// 配送
			peisong(){
				this.$emit("getpop",true)
			}
		}
	}
</script>

<style lang="scss" scoped>
.conints{
	padding: 10px 10px;
	display: flex;
}
.ints{
	width: 30%;
	border:1rpx solid #ccc;
	border-radius: 5px;
	padding: 5px 10px;
	&:not(:nth-child(1)){
		margin-left: 5px;
	}
}
.mybtn{
		margin: 0;
		color: #fff;
		margin: 0 5px;
		height: 33px;
		line-height: 32.5px;
		width:55px;
		font-size: 11px;
		background-color: #00AA49;
	}

</style>