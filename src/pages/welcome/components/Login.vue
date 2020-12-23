<template>
  <div class="login-container">
    <el-row :gutter="20">
      <el-col :span="4" :offset="7">
        <el-button plain round class="login-button">
          <div class="login-button-wrapper">
            <img class="login-button-img" :src="require('@/assets/imgs/welcome/login-button-gitlab.png')">
            <p class="login-button-title">使用 Gitlab 登录</p>
          </div>
        </el-button>
      </el-col>
      <el-col :span="4" :offset="2">
        <img class="login-logo" :src="require('@/assets/imgs/welcome/login-background.jpg')">
      </el-col>
    </el-row>
    <span class="login-split"></span>
  </div>
</template>

<script>
export default {
  name: 'Login'
}
</script>

<style lang="stylus" scoped>
  @import '~@styles/variables.styl'
  .login-button:hover {
    background #ecf5ff
  }
  .login-container
    position relative
    .login-button
      height 42px
      width 100%
      margin-top 100%
      padding 4px
      .login-button-wrapper
        height 100%
        .login-button-img
          height 100%
          margin 0 4px
        .login-button-title
          display inline-block
          height 34px
          line-height 34px
          text-align center
          vertical-align top
    .login-logo
      width 100%
      margin 12px
      border-radius 32px
      box-shadow 8px 8px 5px 5px #aaaaaa
    .login-split
      position absolute
      background $color-primary-light
      width 2px
      top 0
      bottom 0
      left 50%
      right 50%
</style>
