<template>
	<view class="container">
		<!-- 输入框 -->
		<view class="titlesel">
			<input class="uni-mt-5" placeholder-style="color: #C8CBD2"  ref="int" v-model="name" @blur="loseList" @focus="showList" :disabled="disabledable" :placeholder="place" @tap="showSel" @input="getint" readonly="readonly"/>
			<view class="icons">
			  <u-icon :name="!jt?'arrow-up':'arrow-down'" color="#dcdfe6" size="13"></u-icon>	
			</view>
		</view>
		<!-- 下拉的列表 -->
		<view class="selsqu" ref="sel" :style="{width:widthsel}" v-show="!jt">
			<view class="sels" v-for="(item,index) in lists" :key="index" @tap="confirmaddress(item)">{{item.name}}</view>
		</view>
		<!--  -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lists:[],
				placeholdertext: "请输入关键词",
				jt: true,
				widthsel: "",
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				name: ""
			}
		},
		watch: {
			disabledable: {
				handler(newval) {
					console.log(newval, "12123");
				},
				immediate: true,
				deep: true,
			},

			value: {
				handler(newval) {
					if (newval) {
						this.name = newval;
					}
				},
				immediate: true,
				deep: true
			},
			list:{
				handler(newval){
					if (newval){
						this.lists = newval;
					}
				},
				immediate: true,
				deep: true
			}

		},

		props: {
			place:{
				type:String,
				default:"请输入关键词"
			},
			showEither:{
				type: Number,
				default: 0,
			},
			list:{
				type: Array,
				default: [],
			},
			disabledable: {
				type: Boolean,
				default: false
			},
			value: {
				type: String,
				default: ""
			},
		},
		mounted() {
			this.getDom()
		},
		methods: {
			// 模糊查询
			getint(e) {
				this.jt = false;
				this.$emit("getValueint",e.target.value)
			},
			// 失去焦点隐藏
			loseList(e){
				// this.jt = true;
			},
			// 获取焦点
			showList(e){
				console.log(e.detail.height);
				e.detail.height = 100;
				this.jt = false;
			},
			// 确定
			confirmaddress(item){
				this.$emit("getxq", item);
				this.name = item.name;
				this.jt = true;
			},
			// 下拉框宽度与输入框相同
			getDom() {
				const Dom = uni.createSelectorQuery().in(this);
				Dom.select('.uni-mt-5').boundingClientRect(B => {
					this.width = B.width
					this.widthsel = B.width * 2 + "rpx";
				}).exec();
			},
			// 点击显示隐藏
			showSel() {
				if (this.disabledable) {
					return;
				}
				this.jt = !this.jt;
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		position: absolute;
		// z-index: 9999;
		width: 291px;
		top: 10px;
	}

	.titlesel {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		position: relative;
		input{
			font-size: 14px;
			color: #303133;
			font-weight: 500;
			font-family: UICTFontTextStyleBody;
		}
	}

	.scroll-Y {
		height: 250px;
		position: relative;
		z-index: 888;
		overflow-y: scroll;
	}

	.titlesel-text {
		font-size: 14px;
		height: 15px;
		/* line-height: 30rpx; */
		vertical-align: center;
		font-weight: bold;
		margin-right: 10px;
	}

	.uni-mt-5 {
		flex: 1;
		height: 15px;
		padding: 5px 20px 5px 10px;
		display: block;
		border: 1px solid #E5E5E5;
		background-color: #FFFFFF;
		/* font-size: 1rem; */
		overflow-x: hidden;
		word-spacing: 20px;
		
	}

	.icons {
		position: absolute;
		font-size: 14px;
		right: 7px;
	}

	.selsqu {
		width: 100% !important;
		/* height: 600rpx; */
		position: relative;
		z-index: 999;
		/* left: 20rpx; */
		background-color: #FFFFFF;
		overflow-y: scroll;
	}
	.cover{
		height: 250px;
	}
	
	.sels {
		// height: 25px;
		// padding: 10px 0rpx 10px 10px;
		// line-height: 25px;
		padding-left: 10px;
		border-top: none;
		border-right: 1px solid #E5E5E5;
		border-bottom: 1px solid #E5E5E5;
		border-left: 1px solid #E5E5E5;
		text-overflow: ellipsis;
		white-space: normal;
		background-color: #FFFFFF;
		// position: relative;
		z-index: 888;
		font-size: 14px;
		color: #303133;
	}
</style>
