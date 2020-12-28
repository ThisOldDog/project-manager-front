<template>
  <el-row class="header">
    <el-col :span="2">
      <div class="header-logo-wrapper" @click="handleHome">
        <img class="header-logo" :src="require('@/assets/imgs/workspace/home.png')" alt="logo">
        <p class="header-title">首页</p>
      </div>
    </el-col>
    <el-col :span="6" :offset="16" class="header-right">
      <div class="header-avatar-wrapper" @click="handleUserinfo">
        <img class="header-avatar" :src="avatar" alt="avatar">
        <p class="header-name">{{username}}</p>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'WorkspaceHeader',
  props: {
    user: Object
  },
  data () {
    return {
      redirectToGitlab: false
    }
  },
  computed: {
    username () {
      return this.user && this.user.name ? this.user.name : ''
    },
    avatar () {
      return this.user && this.user.avatarUrl ? this.user.avatarUrl : require('@/assets/imgs/workspace/default-avatar.jpeg')
    }
  },
  methods: {
    handleHome () {
      this.$router.push('/')
    },
    handleUserinfo () {
      if (!this.redirectToGitlab) {
        this.redirectToGitlab = true
        this.$notify({
          title: '系统提示',
          message: '再次点击跳转到 Gitlab',
          position: 'bottom-right'
        })
        setTimeout(() => {
          this.redirectToGitlab = false
        }, 4500)
      } else {
        window.location.href = process.env.GITLAB_BASE_URL + '/profile'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .header
    height 48px
    padding 4px
    .header-logo-wrapper
      display inline
      height 100%
      padding 4px
      line-height 40px
      .header-logo
        height 24px
        margin 8px
      .header-title
        display inline-block
        vertical-align top
        color #eeeeee
    .header-right
      text-align right
      .header-avatar-wrapper
        display inline
        height 100%
        padding 4px
        line-height 40px
        .header-avatar
          height 32px
          margin 4px
          border-radius 20px
        .header-name
          display inline-block
          vertical-align top
          color #eeeeee
</style>
