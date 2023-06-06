<template>
	<view class="content">
		<u-table>
				<u-tr>
					<u-th>提现人姓名</u-th>
					<u-th>提现金额</u-th>
					<u-th>是否打款</u-th>
					<u-th>申请时间</u-th>
				</u-tr>
				<u-tr v-for="(item, index) in waterList" :key="index">
					<u-td>{{ item.collectionName }}</u-td>
					<u-td>{{ item.withdrawalMoney }}</u-td>
					<u-td>{{ item.state == '0' ? '未打款' : '打款' }}</u-td>
					<u-td>{{ item.applyTime }}</u-td>
				</u-tr>
			</u-table>
	</view>
</template>

<script>
	import {
		getWaterList
	} from '../../api/shopmanage.js';
	export default {
		data() {
			return {
				waterList: [],
				getListForm: {
					page: 1,
					pageSize: 10
				}
			};
		},
		onLoad() {
			this.gainWaterList();
		},
		methods: {
			onReachBottom() {
				uni.showLoading({
					title: '加载中'
				});
				this.getListForm.page += 1;
				this.getAllList(0);
			},
			//查询流水
			gainWaterList() {
				let _data = {
					...this.getListForm
				};
				getWaterList(_data).then(res => {
					console.log(res, '查询流水 ');
					if (res.code === '') {
						this.waterList = res.data.list;
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.tabList {
		display: flex;
		justify-content: center;
		align-items: center;

		view {
			flex: 1;
		}

		.time1 {
			flex: 3;
		}

		.time {
			flex: 3;
		}
	}

	.chu {
		font-weight: 700;
	}

	.content {
		margin: 30rpx;

		.item {
			display: flex;

			padding: 30rpx;
			background-color: #fff;
			border-bottom: 1rpx solid #f3f4f5;

			&:active {
				background-color: rgba(0, 0, 0, 0.001);
			}

			&:last-child {
				border: none;
			}

			.left {
				width: 100rpx;
				font-size: 24rpx;
			}

			.right {
				width: 220rpx;
				font-size: 26rpx;

				&.green {
					color: #2ed573;
				}

				&.red {
					color: #ee5253;
				}
			}
		}
	}
</style>
