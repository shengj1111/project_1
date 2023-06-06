<template>
  <div class="header-warp">
    <div class="pc-header">
      <div class="header">
        <div class="pc-warp">
          <div class="header-flex-box">
            <div class="logo">
              <router-link to="/">
                <img src='../../images/cereshop/home/logo.png'>
              </router-link>
            </div>
            <div class="menu" v-show="componentContent && componentContent.tabShow">
              <ul>
                <li v-for="(item,index) in componentContent.labelList" :key="index">
                  <router-link :to="getLink(item.linkObj)">{{item.name}}</router-link>
                </li>
              </ul>
            </div>
            <div class="search">
              <div class="searchSelect">
                <el-dropdown @command="searchCommand" trigger="click">
                    <span class="el-dropdown-link">{{searchVal}}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="宝贝">宝贝</el-dropdown-item>
                    <el-dropdown-item command="门店">门店</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <div class="searchRight">
                <i class="icon el-icon-search"></i>
                <input v-model="keyword" type="text" class="" placeholder="请输入搜索商品">
              </div>
              <span class="btn" @click="searchPro(keyword,searchType)">搜索</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {funMixin} from '../../config/mixin'
  import { mapGetters } from 'vuex'
  export default {
    name: 'cereHeader',
    mixins: [funMixin],
    props: {
      componentContent: {
        type: Object
      }
    },
    data () {
      return {
        keyword: '',
        searchType: '宝贝'
      }
    },
    computed: {
      ...mapGetters([
        'viewDevice'
      ])
    },
    methods: {
      searchCommand (command) {
        this.searchVal = command
      }
    }
  }
</script>

<style lang="scss" scoped>
  .pc-warp{
    width: 1250px;
    margin: 0 auto;
    max-width: 96%;
  }
  .site-nav{
    height: 42px;
    background-color: #F1F2F7;
    line-height: 42px;
    .left{
      float: left;
      span{
        color: $mainColor;
        cursor: pointer;
      }
    }
    .right{
      float: right;
      .item{
        padding: 0 15px;
        display: inline-block;
        span{
          cursor: pointer;
          b{
            color: $mainColor;
            padding: 0 2px;
          }
        }
        .iconfont{
          margin-right: 5px;
        }
        .icon-user{
          font-size: 14px;
        }
        &.item-select{
          padding-right: 33px;
          position: relative;
          .ico-arrow{
            position: absolute;
            right: 15px;
            top: 0;
            margin-right: 0;
          }
        }
        &:hover{
          background-color: #fff;
          .cart-no-data,.cart-no-login{
            display: flex;
          }
          .cart-list,.user-box{
            display: block;
          }
          .hover-item{
            color: $mainColor;
          }
        }
      }
    }
    .cart-box{
      position: absolute;
      top: 100%;
      background-color: #fff;
      z-index: 9;
      border-radius: 0px 0px 4px 4px;
      box-shadow: 0px 0px 24px 0px rgba(0, 0, 0, 0.06);
      &.cart-no-login{
        width: 100%;
        left: 0;
        height: 160px;
        display: none;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .btn{
          display: inline-block;
          padding: 0 15px;
          height: 26px;
          line-height: 26px;
          text-align: center;
          color: #fff;
          background-color: $mainColor;
          border-radius: 4px;
          margin-bottom: 40px;
        }
        .p{
          color: #666666;
          line-height: 1em;
        }
      }
      &.cart-no-data{
        width: 264px;
        height: 110px;
        left: 50%;
        margin-left: -132px;
        display: none;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #666;
      }
      &.cart-list{
        width: 348px;
        left: 50%;
        margin-left: -174px;
        display: none;
        padding: 10px;
        dl{
          margin-bottom: 10px;
          dt{
            float: left;
            cursor: pointer;
          }
          dd{
            margin-left: 54px;
            position: relative;
            padding-right: 60px;
            min-height: 42px;
            line-height: 21px;
            h4{
              color: #333;
              cursor: pointer;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
            p{
              color: #999;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
            span{
              color: $mainColor;
              position: absolute;
              top: 0;
              right: 0;
            }
            .btn-del{
              color: #333;
              position: absolute;
              top: 20px;
              right: 0;
            }
          }
        }
        .btn-view-all{
          display: inline-block;
          float: right;
          padding: 0 15px;
          height: 26px;
          line-height: 26px;
          text-align: center;
          color: #fff;
          background-color: $mainColor;
          border-radius: 4px;
          margin-top: 10px;
          cursor: pointer;
        }
      }
      &.user-box{
        width: 100%;
        left: 0;
        padding: 18px 0;
        display: none;
        li{
          display: block;
          cursor: pointer;
          color: #666;
          text-align: center;
          &:hover{
            background-color: #FFEEE3;
          }
        }
      }
    }
  }
  .header{
    background-color: #fff;
    height: 98px;
    .header-flex-box{
      display: flex;
      width: 100%;
      justify-content: space-between;
      .logo{
        margin: 32px 0;
      }
      .menu{
        padding: 35px 0;
        li{
          display: inline-block;
          line-height: 28px;
          margin: 0 10px;
          a{
            display: block;
            cursor: pointer;
            &:hover{
              color: $mainColor;
            }
          }
        }
      }
      .search{
        width: 472px;
        max-width: 100%;
        border: 1px solid $mainColor;
        border-radius: 4px;
        height: 46px;
        overflow: hidden;
        margin: 25px 0;
        position: relative;
        display: flex;
        .searchSelect{
          margin: 12px 10px 12px 0;
          height: 22px;
          line-height: 22px;
          padding: 0 12px;
          border-right: 1px  solid #E5E5E5;
          >>> .el-dropdown-link{
            font-size: 16px;
            color: #666;
          }
        }
        .searchRight{
          flex: 1;
          position: relative;
          height: 46px;
          .icon{
            position: absolute;
            left: 11px;
            top: 50%;
            margin-top: -8px;
            color: #666;
            font-size: 16px;
          }
          input{
            padding: 0 60px 0 35px;
            width: 100%;
            height: 46px;
            font-size: 14px;
            box-sizing: border-box;
          }
        }
        .btn{
          width: 80px;
          height: 46px;
          background-color: $mainColor;
          color: #fff;
          line-height: 46px;
          text-align: center;
        }
      }
    }
  }
  @media screen and (max-width: 1200px) {
    .header{
      display: block;
      position: relative;
      height: auto;
      .header-flex-box{
        .logo{
          position: absolute;
          left: 1%;
        }
        .menu{
          margin-top: 90px;
          padding: 0 0 20px 0;
          width: 100%;
          display: flex;
          justify-content: center;
        }
        .search{
          position: absolute;
          right: 1%;
        }
      }
    }
  }
  @media screen and (max-width: 768px) {
    .pc-header{
      display: none;
    }
    .phone-header{
      display: flex;
      justify-content: space-between;
    }
  }
  .device-xiaochengxu,.device-h5,.device-phone{
    .pc-header{
      display: none;
    }
    .phone-header{
      display: flex;
      justify-content: space-between;
    }
  }
</style>
