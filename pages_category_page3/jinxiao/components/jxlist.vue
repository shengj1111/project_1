<template>
	<view class="container">
		<scroll-view scroll-y="true" style="height: 70vh;white-space: nowrap;width: 100%;">
    			<uni-table border stripe emptyText="暂无更多数据">
    				<!-- 表头行 -->
    				<uni-tr>
    					<uni-th align="center" width="100px">送货编号</uni-th>
    					<uni-th align="center" width="100px" style="padding: 8px 0px !important;">商品</uni-th>
    					<uni-th align="center" width="100px">送货时间</uni-th>
    					<uni-th align="center" width="100px">订单</uni-th>
    					<uni-th align="center" width="100px">物流商</uni-th>
    					<uni-th align="center" width="100px">数量</uni-th>
    					<uni-th align="center" width="100px">未送数量</uni-th>
						<uni-th align="center" width="100px">操作</uni-th>
    				</uni-tr>
    				<!-- 表格数据行 -->
    				<uni-tr>
    					<uni-td align="center">经销商1</uni-td>
    					<uni-td align="center">
    						10包精装修外墙腻子粉送1包德高II型瓷砖胶
    					</uni-td>
    					
    					<uni-td align="center">
    						2023-5-31
    					</uni-td>
    					
    					<uni-td align="center" >
							订单A
						</uni-td>
    					<uni-td align="center">
							物理A
						</uni-td>
						<uni-td align="center">1</uni-td>
    					<uni-td align="center" @tap="godetail">
							123
    						<!-- <text style="color: #409EFF;border-bottom: #409EFF 1rpx solid;">2</text> -->
    					</uni-td>
						<uni-td align="center">
							<button class="mybtn" @click="comfirmwp">确认收货</button>
						</uni-td>
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
			// 确认收货
			comfirmwp(){
				uni.showModal({
					title: '温馨提示',
					content: '确定您已经收到货物，否则会造成财产损失',
					confirmText: '确定收到',
					cancelText: '点错了',
					success: res => {
						if (res.confirm) {
							// this.doConfirm(orderId)
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
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
	.mybtn{
		margin: 0;
		color: #fff;
		margin: 0 auto;
		height: 33px;
		line-height: 32.5px;
		width:73%;
		font-size: 11px;
		background-color: #00AA49;
	}
</style>