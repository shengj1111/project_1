<template>
	<view class="container">
		<scroll-view scroll-y="true" style="height: 70vh;white-space: nowrap;width: 100%;">
    			<uni-table border stripe emptyText="暂无更多数据">
    				<!-- 表头行 -->
    				<uni-tr>
    					<uni-th align="center" width="100px">经销商</uni-th>
    					<uni-th align="center" width="100px" style="padding: 8px 0px !important;">商品</uni-th>
    					<uni-th align="center" width="100px">订单</uni-th>
    					<uni-th align="center" width="100px">数量</uni-th>
    					<uni-th align="center" width="100px">总数量</uni-th>
    					<uni-th align="center" width="100px">未送</uni-th>
    					<uni-th align="center" width="100px">已送</uni-th>
    				</uni-tr>
    				<!-- 表格数据行 -->
    				<uni-tr>
    					<uni-td align="center">经销商1</uni-td>
    					<uni-td align="center">
    						<view class="splists" v-for="(item,index) in splist" :key="index" :style="[index==0?{borderBottom,height}:{}]">
    							{{item}}
    						</view>
    					</uni-td>
    					
    					<uni-td align="center">
    						<view class="" v-for="(item,index) in list" :key="index" :style="[index==1?{borderBottom}:index==2?{lineHeight:'33px'}:{}]">
    							{{item}}
    						</view>
    					</uni-td>
    					
    					<uni-td align="center" >
							<view class="" v-for="(item,index) in numlist" :key="index" :style="[index==1?{borderBottom}:index==2?{lineHeight:'33px'}:{}]">
								{{item}}
							</view>
						</uni-td>
    					<uni-td align="center" >
							<view class="splists" v-for="(item,index) in wslist" :key="index" :style="[index==0?{borderBottom,height}:{}]">
								{{item}}
							</view>
						</uni-td>
    					<uni-td align="center" @tap="godetail">
    						<text style="color: #409EFF;border-bottom: #409EFF 1rpx solid;">2</text>
    					</uni-td>
    					<uni-td align="center">1</uni-td>
    				</uni-tr>
    			</uni-table>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: "",
		data() {
			return {
                list:["订单A","订单B","订单C"],
				numlist:[5,4,11],
				splist:["商品A","商品B"],
				wslist:[11,12],
				borderBottom:"1px solid #ebeef5",
				height:"52px"
				// 
			}
		},
		methods: {
			// 去送货明细
			godetail() {
				this.$toUrl('/pages_category_page3/shdetail/index');
			}
		}
	}
</script>


<style lang="scss" scoped>
     .splists{
		 height: 33px;
		 line-height: 33px;
		 // padding-bottom: 10px;
	 }
	/deep/.uni-th .data-v-35ace0c0 {
		font-size: 14px !important;
	}
</style>