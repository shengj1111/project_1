<template>
	<view class="">
	</view>
</template>
<script>
import qqmapsdk from "@/static/js/qqmap-wx-jssdk.min.js";
import { Login } from "../../config/api";
const qqMap = new qqmapsdk({
	key: "3T7BZ-QWVRW-EYMRX-RMH3O-CZWB7-QLFX4"
})
export default {
  data() {
    return {
      markers:[], //
	  address:"",
	  page:{
		  pageSize:20,
		  pageIndex:1
	  },
	  keyword:"",
	  locationC:"" // 本地经纬度
    };
  },
  onReachBottom() {
  	uni.showLoading({
		url:"加载中",
  		mask:true
  	})
	this.page.pageIndex++;
	this.nearbysearch(this.keyword,1);
  },
  onLoad() {
	 // this.getjw();
	 this.chooseLocation();
  	 // this.wechatMap();
  },
  methods: {
	  // 输入框搜索
	  changelist(val){
		 this.keyword = val; 
      	 this.nearbysearch(val)  
	  },
	  // 确认地点
	  enteraddress(item){
		  console.log(item);
		  let _data = {
			  latitude: item.latitude,
			  longitude: item.longitude,
			  title: item.title
		  }
		  uni.setStorageSync("addresssd",_data);
		  
		  uni.navigateBack();
	  },

	  // 选择位置
	  chooseLocation(){
		  uni.chooseLocation({
			  success(e){
				  let _data = {
					  latitude: e.latitude,
					  longitude: e.longitude,
					  title: e.name
				  }
				  uni.setStorageSync("addresssd",_data);
				  uni.navigateBack(1)
			  },
			  fail(err){
				  uni.navigateBack(1)
			  },
			  complete(com){
			  }
		  })
	  }
  },
};
</script>
<style lang="scss" scoped>
	.int{
		width: calc(100% - 40rpx);
		height: 80rpx;
		margin: 20rpx auto;
		input{
			height: 100%;
			border-radius: 10rpx;
		}
	}
	.address{
		border-top: 1rpx solid #dedede;
		padding: 20rpx 20rpx;
	}
	.address:hover{
		background-color: #dfdfdf;
	}
</style>