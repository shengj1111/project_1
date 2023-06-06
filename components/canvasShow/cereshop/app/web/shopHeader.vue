<template>
  <div class="header-warp">
    <!-- <image class="top-bg" src="@/static/assets/img/topBg.png" mode="widthFix"> -->
		<view class="bg"></view>
    <div class="page-content">
      <cere-header @tabChange='tabChange' ref="header" :componentContent="componentContent"></cere-header>
      <cere-banner :componentContent="componentContent" v-if="bannerVisible"></cere-banner>
	  <Notice v-if="noticeList.length>0 && bannerVisible" :list="noticeList"></Notice>
    </div>
  </div>
</template>

<script>
  import CereBanner from './banner'
  import CereHeader from './header'
  import Notice from '../../../../notice/notice.vue'
  export default {
    name: 'shopHeader',
    components: { CereHeader, CereBanner, Notice },
    props: {
      terminal: {
        type: Number,
        default: 4
      },
      componentContent: {
        type: Object
      },
	  noticeList: {
		  type: Array
	  }
    },
    data () {
      return {
        bannerVisible: true
      }
    },
	methods: {
	  tabChange (index, id) {
		  this.bannerVisible = index === 0
	    this.$emit('tabChange', index, id)
	  }
	}
  }
</script>

<style lang="scss" scoped>
  .header-warp{
    width: 100%;
    display: flex;
    flex-direction: column;
		background-color: #F7F7F7;
		.bg{
			height: 220rpx;
			background-color: #00AA49;
			position: relative;
			z-index: 0;
		}
    .top-bg {
      width: 100%;
    }
    .page-content{
      width: 100%;
      display: flex;
      flex-direction: column;
      z-index: 10;
      margin-top: -220upx;
    }
  }
</style>
