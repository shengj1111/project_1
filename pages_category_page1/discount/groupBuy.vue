<template>
 <view class="groupBuy">
	 <view class="countdown" v-if="shopShowType == false">
	   距结束<view class="endDate"><span>{{hou}}</span><i>:</i><span>{{min}}</span><i>:</i><span>{{sec}}</span></view>
	 </view>
	 <view class="filterBox" v-else>
		 <view class="item" :class="selectIndex == 0 ? 'selected' : ''" @click="synthesize"><span>综合</span></view>
		 <view class="item" :class="selectIndex == 1 ? 'selected' : ''" @click="sales"><span>销量</span></view>
		 <view class="item" :class="selectIndex == 2 ? 'selected' : ''" @click="priceClick"><span>价格</span></view>
	 </view>
   <view class="spikeList mar-top-20">
     <view class="listItem" v-for="(item,index) in groupBuy" :key="index">
		 <view class="itemBox">
		   <img :src="item.image">
		 </view>
		 <view class="itemInfo flex-column-plus flex-sp-between">
		   <p>{{item.productName}}</p>
		   <view class="number" v-if="item.limitNumber">限量{{item.limitNumber}}件</view>
		   <view class="originalPrice">¥{{item.originalPrice}}</view>
		   <view class="price">
		     <view class="currentPrice flex-row-plus flex-items-plus font-color-FF7800">
		 		<view class="fs26">拼团价</view>
		 		<view class="flex-row-plus flex-items">
		 			<label class="fs24">￥</label>
		 			<label class="fs36">{{item.price}}</label>
		 		</view>
		 	</view>
		 	<view class="snapUpBtn" @click="gogoodsDetails(item.shopId,item.productId,item.skuId)">去抢购</view>
		   </view>
		 </view>
     </view>
   </view>
 </view>
</template>

<script>
const NET = require('../../utils/request')
const API = require('../../config/api')
export default {
	data(){
		return{
			pageType:true,
			groupBuy:[],
			page:1,
			pageSize:10,
			loadingType:0,
			hou: "00",
			min: "00",
			sec: "00",
			shopId:0,
			shopGroupWorkId:0,
			type:1,//价格
			volume:1,//销量
			shopShowType:false,
			selectIndex:0
		}
	},
	onLoad(options) {
		if(options.shopId && options.shopGroupWorkId){
			this.shopShowType = false
			this.shopId = options.shopId
			this.shopGroupWorkId = options.shopGroupWorkId
		}else{
			this.shopShowType = true
			this.shopId = 0
			this.shopGroupWorkId = 0
		}
		this.getGroupBuylist()
	},
	onReachBottom(){
		if(this.loadingType == 1){
			uni.stopPullDownRefresh()
		}else{
			this.page = this.page+1
			this.getGroupBuylist()
		}
	},
	methods:{
		synthesize(){
			this.volume =1//销量
			this.type = 1//价格
			this.page = 1
			this.selectIndex = 0
			this.groupBuy = []
			this.getGroupBuylist()
		},
		sales(){
			//销量
			if(this.volume == 1){
				this.volume = 2
			}else{
				this.volume = 1
			}
			this.type = 1//价格
			this.page = 1
			this.selectIndex = 1
			this.groupBuy = []
			this.getGroupBuylist()
		},
		priceClick(){
			this.volume =1//销量
			//价格
			if(this.type == 1){
				this.type = 2
			}else{
				this.type = 1
			}
			this.page = 1
			this.selectIndex = 2
			this.groupBuy = []
			this.getGroupBuylist()
		},
		gogoodsDetails(shopId,productId,skuId){
			uni.navigateTo({
				url:'/pages_category_page3/merchants/goodsDetails?shopId='+shopId + '&productId='+productId +'&skuId='+skuId
			})
		},
		getGroupBuylist(){
			let res = {"data":{"shopId":0,"shopName":"","shopLogo":"","number":1,"classifies":[{"id":768,"parentId":0,"depth":1,"categoryName":"女生服装","classifyImage":"","childs":[{"id":769,"parentId":768,"depth":2,"categoryName":"裙子","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-06-28/ab856f7285e14b6ca2619436ad158a51%E6%8D%95%E8%8E%B72.PNG","childs":[{"id":817,"parentId":769,"depth":3,"categoryName":"连衣裙","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/3c3d994a27f34a11885c28c3f06cf0b8Web%201920%20%E2%80%93%209.png","childs":[]},{"id":818,"parentId":769,"depth":3,"categoryName":"半身裙","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/fe2e8f041a914b978b2dd506ce88447cWeb%201920%20%E2%80%93%2010.png","childs":[]},{"id":819,"parentId":769,"depth":3,"categoryName":"旗袍","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/38ba184093664c7aaf17e3712163ea8bWeb%201920%20%E2%80%93%208.png","childs":[]},{"id":837,"parentId":769,"depth":3,"categoryName":"学生裙","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/c2ac63ad4d9646d7b31b6e1c48b5e264Web%201920%20%E2%80%93%2011.png","childs":[]},{"id":838,"parentId":769,"depth":3,"categoryName":"套装裙","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/d6f6922dd0a442bb9644d6762a4f61f4Web%201920%20%E2%80%93%2010.png","childs":[]}]},{"id":771,"parentId":768,"depth":2,"categoryName":"上衣","classifyImage":"","childs":[{"id":820,"parentId":771,"depth":3,"categoryName":"T恤","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/e37ff32ba38b4dfbaceacfa12aeec731Web%201920%20%E2%80%93%209.png","childs":[]},{"id":821,"parentId":771,"depth":3,"categoryName":"衬衫","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/990f9668c7a249be92f549ff595e28ccWeb%201920%20%E2%80%93%2010.png","childs":[]},{"id":822,"parentId":771,"depth":3,"categoryName":"毛衣","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/ca9485c8c6ea42789a70bb8b8796c389Web%201920%20%E2%80%93%2010.png","childs":[]},{"id":823,"parentId":771,"depth":3,"categoryName":"卫衣","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/e4a1c55b8cf94fa882f209879bc99e6fWeb%201920%20%E2%80%93%2010.png","childs":[]},{"id":824,"parentId":771,"depth":3,"categoryName":"马甲","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/1c715514ea71463c825c776ceafc919cWeb%201920%20%E2%80%93%2010.png","childs":[]}]},{"id":825,"parentId":768,"depth":2,"categoryName":"裤子","classifyImage":"","childs":[{"id":826,"parentId":825,"depth":3,"categoryName":"休闲裤","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/2bd9149ece274e2f825e3d9d06890c10Web%201920%20%E2%80%93%2010.png","childs":[]},{"id":827,"parentId":825,"depth":3,"categoryName":"牛仔裤","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/1d01b48bb43d4881a6fea4530c560377Web%201920%20%E2%80%93%2010.png","childs":[]},{"id":828,"parentId":825,"depth":3,"categoryName":"打底裤","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/c88a09f8f1e54adf837b85c13fe4a44bWeb%201920%20%E2%80%93%2010.png","childs":[]},{"id":829,"parentId":825,"depth":3,"categoryName":"棉裤","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/1d93d780aad74c05a5ce322066a68f34Web%201920%20%E2%80%93%209.png","childs":[]},{"id":830,"parentId":825,"depth":3,"categoryName":"羽绒裤","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/dfa0ae6a4bef482aac1f76bf93b3df32Web%201920%20%E2%80%93%209.png","childs":[]}]},{"id":831,"parentId":768,"depth":2,"categoryName":"外套","classifyImage":"","childs":[{"id":832,"parentId":831,"depth":3,"categoryName":"短外套","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/aa43e0c7237e4ca592e5619d3667daf6Web%201920%20%E2%80%93%2017.png","childs":[]},{"id":833,"parentId":831,"depth":3,"categoryName":"西装","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/1136079fe97d406e948aa1dbb4cd8457Web%201920%20%E2%80%93%2017.png","childs":[]},{"id":834,"parentId":831,"depth":3,"categoryName":"羽绒服","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/6933e4099a5348369c4e738c3a933967Web%201920%20%E2%80%93%2018.png","childs":[]},{"id":835,"parentId":831,"depth":3,"categoryName":"风衣","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/9e05f547d4d844c2a6a019408ee761d0Web%201920%20%E2%80%93%2020.png","childs":[]},{"id":836,"parentId":831,"depth":3,"categoryName":"毛呢大衣","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/03cc117191d14f9388a1439f614d540bWeb%201920%20%E2%80%93%2020.png","childs":[]}]}]},{"id":773,"parentId":0,"depth":1,"categoryName":"男鞋女鞋","classifyImage":"","childs":[{"id":776,"parentId":773,"depth":2,"categoryName":"女鞋","classifyImage":"","childs":[{"id":777,"parentId":776,"depth":3,"categoryName":"凉鞋","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/d58035200e6e4f969836619a157e88abWeb%201920%20%E2%80%93%2012.png","childs":[]},{"id":778,"parentId":776,"depth":3,"categoryName":"高跟鞋","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/f740228673984f81a638ad9fa8874a11Web%201920%20%E2%80%93%2012.png","childs":[]},{"id":839,"parentId":776,"depth":3,"categoryName":"帆布鞋","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/6694e98f183648ca9405abcaf9d88ed1Web%201920%20%E2%80%93%2013.png","childs":[]},{"id":840,"parentId":776,"depth":3,"categoryName":"雪地靴","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/ead0b06a55da4daeb0908c0235ef0951Web%201920%20%E2%80%93%2013.png","childs":[]},{"id":841,"parentId":776,"depth":3,"categoryName":"马丁靴","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/c97384dacdd040bcb245f62aa0b6324dWeb%201920%20%E2%80%93%2013.png","childs":[]},{"id":842,"parentId":776,"depth":3,"categoryName":"运动鞋","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/2be79cb9dcd4491fa0bafbb013d09ed8Web%201920%20%E2%80%93%2012.png","childs":[]},{"id":843,"parentId":776,"depth":3,"categoryName":"单鞋","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/fd55ab38f3724aabae70216157c9c227Web%201920%20%E2%80%93%2013.png","childs":[]}]},{"id":854,"parentId":773,"depth":2,"categoryName":"男鞋","classifyImage":"","childs":[{"id":855,"parentId":854,"depth":3,"categoryName":"豆豆鞋","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/8069f922fbe94c6c918d057e15aaac33Web%201920%20%E2%80%93%2012.png","childs":[]},{"id":856,"parentId":854,"depth":3,"categoryName":"休闲鞋","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/5a33997ae8b2438ea7bfb4053dbb00ddWeb%201920%20%E2%80%93%2013.png","childs":[]},{"id":857,"parentId":854,"depth":3,"categoryName":"帆布鞋","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/9fc54de1ebf24c759540331dfc7ee6dcWeb%201920%20%E2%80%93%2012.png","childs":[]},{"id":858,"parentId":854,"depth":3,"categoryName":"运动鞋","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/269ef6c346e24e8783281c0389cdf31cWeb%201920%20%E2%80%93%2013.png","childs":[]},{"id":859,"parentId":854,"depth":3,"categoryName":"马丁靴","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/fdaab44c51f04427af5246fc0ef21406Web%201920%20%E2%80%93%2012.png","childs":[]},{"id":860,"parentId":854,"depth":3,"categoryName":"球鞋","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/db146958650d4dfda61c3b8754a39d63Web%201920%20%E2%80%93%2012.png","childs":[]},{"id":861,"parentId":854,"depth":3,"categoryName":"拖鞋","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-07/fe57c88eef70429da387e2388a17a171Web%201920%20%E2%80%93%2012.png","childs":[]}]}]},{"id":780,"parentId":0,"depth":1,"categoryName":"夏日系列","classifyImage":"","childs":[{"id":787,"parentId":780,"depth":2,"categoryName":"女士精品","classifyImage":"","childs":[{"id":788,"parentId":787,"depth":3,"categoryName":"肩带","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-03-15/bbf429f3544d4460a18b8dedb2ceee5ashouji1.jpg","childs":[]},{"id":863,"parentId":787,"depth":3,"categoryName":"短款钱包","classifyImage":"","childs":[]},{"id":864,"parentId":787,"depth":3,"categoryName":"衬衫","classifyImage":"","childs":[]},{"id":865,"parentId":787,"depth":3,"categoryName":"半身裙","classifyImage":"","childs":[]},{"id":866,"parentId":787,"depth":3,"categoryName":"连衣裙","classifyImage":"","childs":[]}]},{"id":789,"parentId":780,"depth":2,"categoryName":"男士精品","classifyImage":"","childs":[{"id":790,"parentId":789,"depth":3,"categoryName":"西装外套","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-03-15/bcd3f22a2da54794a3ec85bc3133e787shoubiao.jpg","childs":[]},{"id":867,"parentId":789,"depth":3,"categoryName":"公文包","classifyImage":"","childs":[]},{"id":868,"parentId":789,"depth":3,"categoryName":"运动鞋","classifyImage":"","childs":[]},{"id":869,"parentId":789,"depth":3,"categoryName":"衬衫","classifyImage":"","childs":[]},{"id":870,"parentId":789,"depth":3,"categoryName":"牛仔裤","classifyImage":"","childs":[]},{"id":871,"parentId":789,"depth":3,"categoryName":"大衣","classifyImage":"","childs":[]}]}]},{"id":781,"parentId":0,"depth":1,"categoryName":"水果零食","classifyImage":"","childs":[{"id":783,"parentId":781,"depth":2,"categoryName":"品质水果","classifyImage":"","childs":[{"id":784,"parentId":783,"depth":3,"categoryName":"新鲜水果","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-03-15/d3073cb2ed9148a189abff2e1cfb771bshuiguo.jpg","childs":[]}]},{"id":785,"parentId":781,"depth":2,"categoryName":"美味零食","classifyImage":"","childs":[{"id":786,"parentId":785,"depth":3,"categoryName":"每日坚果","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-03-15/236169baf55b463e8a15b24b8e1cb8aejianguo.jpg","childs":[]}]}]},{"id":782,"parentId":0,"depth":1,"categoryName":"床上用品","classifyImage":"","childs":[]},{"id":794,"parentId":0,"depth":1,"categoryName":"服装","classifyImage":"","childs":[{"id":795,"parentId":794,"depth":2,"categoryName":"女士服装","classifyImage":"","childs":[{"id":796,"parentId":795,"depth":3,"categoryName":"裙装","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-03-17/0627a6bfdc0c4d889fec75159f4f70dd%E6%8D%95%E8%8E%B72.PNG","childs":[]}]}]},{"id":797,"parentId":0,"depth":1,"categoryName":"鞋包","classifyImage":"","childs":[{"id":798,"parentId":797,"depth":2,"categoryName":"女包","classifyImage":"","childs":[{"id":799,"parentId":798,"depth":3,"categoryName":"新款包包","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-03-17/0bd8a6f55b8a49f19fa0034657d852281.PNG","childs":[]}]},{"id":800,"parentId":797,"depth":2,"categoryName":"女鞋","classifyImage":"","childs":[{"id":801,"parentId":800,"depth":3,"categoryName":"白搭鞋","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-03-17/668fd598d33145058314fa4c4c7cbf813.PNG","childs":[]}]}]},{"id":810,"parentId":0,"depth":1,"categoryName":"电子产品","classifyImage":"","childs":[{"id":811,"parentId":810,"depth":2,"categoryName":"电脑","classifyImage":"","childs":[{"id":812,"parentId":811,"depth":3,"categoryName":"苹果电脑","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-04-21/f44f0312250442cd8c72340cb99029a5timg%20%281%29.jpeg","childs":[]},{"id":862,"parentId":811,"depth":3,"categoryName":"hhhh","classifyImage":"","childs":[]}]}]},{"id":813,"parentId":0,"depth":1,"categoryName":"生活用品","classifyImage":"","childs":[{"id":814,"parentId":813,"depth":2,"categoryName":"珠子","classifyImage":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-05-13/401f15e521054514948dfd75a8943f40%E7%8F%A0%E5%AD%90.jpg","childs":[]}]},{"id":873,"parentId":0,"depth":1,"categoryName":"非处方药","classifyImage":"","childs":[{"id":874,"parentId":873,"depth":2,"categoryName":"家庭常备","classifyImage":"","childs":[{"id":875,"parentId":874,"depth":3,"categoryName":"感冒发烧","classifyImage":"","childs":[]}]}]}],"page":{"total":7,"list":[{"shopGroupWorkId":100,"shopSeckillId":0,"shopDiscountId":0,"shopId":9,"shopName":"","productId":260,"skuId":707,"productName":"龙眼","image":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-04-02/89beca925b884aa280889e7b069c4884%E6%8D%95%E8%8E%B759.PNG","originalPrice":7.00,"price":0.01,"limitNumber":0,"users":0,"total":0,"stockNumber":0,"limitStockNumber":0,"workUsers":0},{"shopGroupWorkId":101,"shopSeckillId":0,"shopDiscountId":0,"shopId":75,"shopName":"","productId":312,"skuId":907,"productName":"1","image":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-04-30/de90a6896445428293001c6754c91896%E6%8D%95%E8%8E%B76.PNG","originalPrice":1.00,"price":0.01,"limitNumber":0,"users":0,"total":0,"stockNumber":0,"limitStockNumber":0,"workUsers":0},{"shopGroupWorkId":100,"shopSeckillId":0,"shopDiscountId":0,"shopId":9,"shopName":"","productId":239,"skuId":523,"productName":"香梨","image":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-03-23/b85061754e334f32b6eb8aab70f8f061%E6%8D%95%E8%8E%B717.PNG","originalPrice":0.01,"price":0.01,"limitNumber":0,"users":0,"total":0,"stockNumber":0,"limitStockNumber":0,"workUsers":0},{"shopGroupWorkId":95,"shopSeckillId":0,"shopDiscountId":0,"shopId":2,"shopName":"","productId":457,"skuId":1189,"productName":"黑色和米白色短款连帽连衣裙","image":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-06/e91bf286176c43b5a8768b50d853940cWeb%201920%20%E2%80%93%208.png","originalPrice":2399.00,"price":2000.00,"limitNumber":0,"users":0,"total":0,"stockNumber":0,"limitStockNumber":0,"workUsers":0},{"shopGroupWorkId":95,"shopSeckillId":0,"shopDiscountId":0,"shopId":2,"shopName":"","productId":455,"skuId":1187,"productName":"海军蓝色桑蚕丝衬衫连衣裙","image":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-06/07d57d230fd4439680c42676a8d9a9bcWeb%201920%20%E2%80%93%2010.png","originalPrice":4399.00,"price":4000.00,"limitNumber":0,"users":0,"total":0,"stockNumber":0,"limitStockNumber":0,"workUsers":0},{"shopGroupWorkId":95,"shopSeckillId":0,"shopDiscountId":0,"shopId":2,"shopName":"","productId":456,"skuId":1188,"productName":"海军蓝色桑蚕露肩中长款连衣裙","image":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-06/9f8ba2117b6a430f9083ef40b6c18cbfWeb%201920%20%E2%80%93%209.png","originalPrice":4399.00,"price":4000.00,"limitNumber":0,"users":0,"total":0,"stockNumber":0,"limitStockNumber":0,"workUsers":0},{"shopGroupWorkId":95,"shopSeckillId":0,"shopDiscountId":0,"shopId":2,"shopName":"","productId":452,"skuId":1184,"productName":"蓝灰色棉质短款连衣裙","image":"https://cereshop.oss-cn-shenzhen.aliyuncs.com/test/2021-07-06/16cdb68a8a0d4c0f8d050cd6f570254bWeb%201920%20%E2%80%93%2011.png","originalPrice":3999.00,"price":4000.00,"limitNumber":0,"users":0,"total":0,"stockNumber":0,"limitStockNumber":0,"workUsers":0}]},"time":0}}
			if(res.data.page.list.length == 0){
				this.loadingType = 1
				this.page = this.page
			}else{
				this.groupBuy = this.groupBuy.concat(res.data.page.list)
			}
			if(this.shopShowType == false){
				this.dateformat(res.data.time)
				this.countDown()
			}
			
			
			
			
			// let param = ''
			// param = {
			//   page:this.page,
			//   pageSize:this.pageSize,
			//   shopId:this.shopId,
			//   shopGroupWorkId:this.shopGroupWorkId,
			//   type:this.type,
			//   volume:this.volume
			// }
			// NET.request(API.getGroupBuyList,param,'GET').then(res => {
			// 	console.log(res,123456)
			
			// 	if(res.data.page.list.length == 0){
			// 		this.loadingType = 1
			// 		this.page = this.page
			// 	}else{
			// 		this.groupBuy = this.groupBuy.concat(res.data.page.list)
			// 	}
			// 	if(this.shopShowType == false){
			// 		this.dateformat(res.data.time)
			// 		this.countDown()
			// 	}
			// 	console.log(this.groupBuy,2222)
			// }).catch(res => {
			// 	uni.showToast({
			// 		title:'失败',
			// 		icon:"none"
			// 	})
			// })
		},
		//时分秒换算
		dateformat(micro_second) {
			// 总秒数
			let second = Math.floor(micro_second / 1000);
			// 天数
			let day = Math.floor(second / 3600 / 24);
			// 小时
			let hr = Math.floor(second / 3600 % 24);
			// 分钟
			let min = Math.floor(second / 60 % 60);
			// 秒
			let sec = Math.floor(second % 60);
			this.hou = hr+day*24
			this.min = min
			this.sec = sec
		},
		countDown(){
		    let timeOut = setTimeout(() => {
		      let hou = parseInt(this.hou);
		      let min = parseInt(this.min);
		      let sec = parseInt(this.sec);

		      let netxSec = sec - 1;
		      let netxMin = min
		      let netxHou = hou;

		      if (netxHou == 0 && netxMin == 0 && netxSec == -1) {
		        clearTimeout(timeOut)
				uni.switchTab({
					url:'../../pages/tabbar/index/index'
				})
				uni.showToast({
					title:"活动结束",
					duration:2000,
					icon:'none'
				})
		      } else {
		        if (netxSec == -1) {
		          netxSec = 59
		          netxMin = netxMin - 1;
		        }
		        if (netxMin == -1) {
		          netxMin = 59
		          netxHou = netxHou - 1
		        }
		        // if (netxHou == -1) {
		        //   netxHou = 23
		        // }

		        this.hou = this.timeFormat(netxHou),
		        this.min = this.timeFormat(netxMin),
		        this.sec = this.timeFormat(netxSec),
		        this.timeOut = timeOut
		        this.countDown();
		      }
		    }, 1000)
		},
		timeFormat(param) { //小于10的格式化函数
		    return param < 10 ? '0' + param : param;
		},
	}
}
</script>

<style lang="scss" scoped>
.groupBuy {
	.selected{
		color: #FE6F52;
	}
  .countdown {
    display: flex;
    justify-content: center;
    height: 80upx;
    align-items: center;
    background: #F7F7F7;
    width: 100%;
    z-index: 999;
    .endDate {
      display: flex;
      align-items: center;
      margin-left: 20upx;
      span {
        min-width: 48upx;
        height: 36upx;
		padding: 0upx 8upx;
        background: linear-gradient(247deg, #F71622, #FE6F52);
        display: block;
        font-size: 28upx;
        color: #FFFFFF;
        text-align: center;
      }
      i {
        font-size: 28upx;
        color: #FF736C;
        font-style: normal;
        margin: 0 8upx;
      }
    }
  }
  .spikeList {
    padding: 0upx 30upx 20upx 30upx;
    .listItem {
      display: flex;
      padding-bottom: 30upx;
      border-bottom: 1upx solid #EEEEEE;
      margin-bottom: 30upx;
      &:last-child {
        border-bottom: none;
      }
      .itemBox {
        width: 260upx;
        height: 260upx;
        margin-right: 30upx;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .itemInfo {
        flex: 1;
        p {
          font-size: 26upx;
          color: #333333;
          line-height: 40upx;
          margin-bottom: 20upx;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .number {
          color: #999999;
          font-size: 26upx;
        }
        .originalPrice {
          font-size: 26upx;
          margin-top: 20upx;
          text-decoration: line-through;
          color: #999999;
        }
        .price {
          display: flex;
          justify-content: space-between;
          .snapUpBtn {
            width: 140upx;
            height: 56upx;
            line-height: 56upx;
            text-align: center;
            background: linear-gradient(247deg, #F71622, #FE6F52);
            border: 1upx solid #FF736C;
            border-radius: 8upx;
            color: #FFFFFF;
          }
        }
      }
    }
  }
  .filterBox {
    display: flex;
    height: 80upx;
    align-items: center;
    width: 100%;
    background: #FFFFFF;
    left: 0;
    .item {
      flex: 0 0 33.33%;
      text-align: center;
    }
  }
}
</style>
