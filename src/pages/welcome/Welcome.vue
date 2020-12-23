<template>
  <el-container>
    <el-header>
      <welcome-header @menuActice="handleMenuActicve" :activeIndex="activeIndex"></welcome-header>
    </el-header>
    <el-main class="main-container">
      <transition name="el-zoom-in-top" appear mode="out-in">
        <component v-bind:is="activeIndex"></component>
      </transition>
    </el-main>
  </el-container>
</template>

<script>
import WelcomeHeader from './components/Header'
import WelcomeLogin from './components/Login'
import Page404 from '@/components/page/page404'

export default {
  name: 'Welcome',
  components: {
    WelcomeHeader,
    'home': WelcomeLogin,
    'source-download-request': Page404
  },
  data () {
    return {
      activeIndex: 'home'
    }
  },
  methods: {
    handleMenuActicve (index) {
      this.activeIndex = index
    }
  }
}
</script>

<style lang="stylus" scoped>
  .main-container
    padding 42px 20px 0 20px
</style>
