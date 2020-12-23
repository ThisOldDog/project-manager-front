<template>
  <el-row :gutter="20" class="header">
    <el-col :span="4" :offset="5" class="header-logo-wrapper">
      <img class="header-logo" :src="require('@/assets/imgs/welcome/logo.png')" alt="logo">
    </el-col>
    <el-col :span="6">
      <el-menu :default-active="activeIndex" active-text-color="#409EFF" @select="handleMenuSelect" class="header-menu" mode="horizontal">
        <el-menu-item index="home" class="header-menu-wrapper">
          <h1 class="header-menu-title">首页</h1>
        </el-menu-item>
        <el-menu-item index="source-download-request" class="header-menu-wrapper">
          <h1 class="header-menu-title">源码下载申请</h1>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'Header',
  props: {
    activeIndex: String
  },
  methods: {
    handleMenuSelect (index, path) {
      this.$emit('menuActice', index)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~@styles/variables.styl'
  .header
    height 72px
    width 100%
    border-bottom $color-primary-weak solid 1px
    .header-logo-wrapper
      height 72px
      line-height 72px
      vertical-align center
      .header-logo
        height 62px
        margin 5px 0
    .header-menu
      height 72px
      .header-menu-wrapper
        height 72px
        .header-menu-title
          height 72px
          line-height 72px
          font-size 120%
</style>
