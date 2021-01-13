<template>
  <div class="container-wrapper">
    <el-container>
      <el-header style="height: 48px;">
        <workspace-header :user="user"></workspace-header>
      </el-header>
      <el-container class="workspace">
        <el-aside class="aside" style="width: 220px">
          <workspace-menu :menus="menus" @menuSelect="handleMenuSelect"></workspace-menu>
        </el-aside>
        <el-main>
          <workspace-page ref="page"></workspace-page>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import WorkspaceHeader from './components/Header'
import WorkspaceMenu from './components/Menu'
import WorkspacePage from './components/Page'

export default {
  name: 'Workspace',
  components: {
    WorkspaceHeader,
    WorkspaceMenu,
    WorkspacePage
  },
  data () {
    return {
      user: null,
      menus: [],
      activeMenu: null
    }
  },
  methods: {
    handleUser (response) {
      this.user = response.data
      this.$store.commit('storeUser', this.user)
    },
    handleMenu (response) {
      this.menus = response.data
    },
    handleMenuSelect (menu) {
      this.$refs.page.pushTab(menu)
    }
  },
  mounted () {
    this.$axios.get('/api/user/account')
      .then(response => {
        this.handleUser(response)
        this.$axios.get('/api/menu/tree')
          .then(this.handleMenu)
      })
  }
}
</script>

<style lang="stylus" scoped>
  @import '~@styles/variables.styl'
  .container-wrapper
    height calc(100vh)
    .el-header
      background $color-second
      padding 0
  body .el-container
    height 100%
</style>
