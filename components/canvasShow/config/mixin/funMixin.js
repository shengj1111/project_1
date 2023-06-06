const NET = require('@/utils/request')
const API = require('@/config/api')
/*
 * 公共方法的 mixin
 */

/* eslint-disable */
export const tool = {
	methods: {
		// 判断url
		getLink(linkObj) {
			var link = ''
			if (linkObj && linkObj.typeText && linkObj.data) {
				switch (linkObj.typeText) {
					case '类别':
						this.goCategory(linkObj.data)
						break
					case '店辅':
						this.goStore(linkObj.data)
						break
					case '商品':
						this.goGoods(linkObj.data)
						break
					case '图文详情':
						this.goTuwen(linkObj.data)
						break
					case '自定义':
						// router.push("/category");
						break
				}
			} else if (linkObj.selsectValue === '/index') {
				this.goHome()
			}
			return link
		},
		goTuwen(item){
			let json = item.content
			uni.setStorageSync('jsonText',json)
			uni.navigateTo({
				url: `/pages_category_page1/goodsModule/jsonText`
			})
		},
		goHome() {
			uni.navigateTo({
				url: `/pages/index/index`
			})
		},
		goCategory(item) {
			uni.navigateTo({
				url: `/pages_category_page1/goodsModule/goodsList?category3Id=${item.id}`
			})
		},
		goStore(item) {
			uni.navigateTo({
				url: `/pages_category_page1/store/index?storeId=${item.shopId}`
			})
		},
		goGoods(item) {
			
			uni.navigateTo({
				url: '/pages_category_page3/merchants/goodsDetails?shopId=' + item.shopId + '&productId=' +
					item.productId + '&skuId=' + item
					.skuId
			})
		},
		//下面这个方法用来给秒杀专区的产品,从秒杀专区点过去的商品详情会带一个参数 isMiao=1
		//这个方法只在 spikeList 组件中使用 使用了3次
		mygoGoods(item) {
			uni.navigateTo({
				url: `/pages_category_page3/merchants/goodsDetails?shopId=${item.shopId}&productId=${item.productId}&skuId=${item.skuId}&myfrom=1`
			})
		},
		// 跳转到秒杀专区
		goSeckills(item) {
			if (item) {
				uni.navigateTo({
					url: '/pages_category_page1/discount/spikeList?shopId=' + item.shopId +
						'&shopSeckillId=' + item.id
				})
			} else {
				uni.navigateTo({
					url: '/pages_category_page1/discount/spikeList'
				})
			}
		},
		// 跳转到拼团专区
		goGroupWorks(item) {
			if (item) {
				uni.navigateTo({
					url: '/pages_category_page1/discount/groupBuy?shopId=' + item.shopId +
						'&shopGroupWorkId=' + item.id
				})
			} else {
				uni.navigateTo({
					url: '/pages_category_page1/discount/groupBuy?'
				})
			}
		},
		// 跳转到折扣列表
		goDiscount(item) {
			if (item) {
				uni.navigateTo({
					url: '/pages_category_page1/discount/discount?shopId=' + item.shopId +
						'&shopDiscountId=' + item.id
				})
			} else {
				uni.navigateTo({
					url: '/pages_category_page1/discount/discount'
				})
			}
		},
		// 查询产品
		searchPro(key, type) {
			uni.navigateTo({
				url: `/pages_category_page1/search/index/index`
			})
		}
	}
}
