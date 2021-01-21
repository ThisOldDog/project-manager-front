<template>
  <div class="container-wrapper">
    <el-container>
      <el-header style="height: 48px;">
        <workspace-header :user="user"></workspace-header>
      </el-header>
      <el-container class="workspace">
        <el-aside class="aside" style="width: 220px">
          <workspace-menu :menus="menus" :activeIndex="activeMenu ? activeMenu.menuCode : null" @menuSelect="handleMenuSelect"></workspace-menu>
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
      this.activeMenu = this.findActiveMenu(this.menus, this.$route.path)
      if (this.activeMenu) {
        this.$refs.page.pushTab(this.activeMenu)
      }
    },
    findActiveMenu (menus, activePath) {
      for (let i = 0; i < menus.length; i++) {
        const menu = menus[i]
        if (menu.subMenuList && menu.subMenuList.length > 0) {
          const activeMenu = this.findActiveMenu(menu.subMenuList, activePath)
          if (activeMenu) {
            return activeMenu
          }
        } else if (menu.menuType === 'PAGE' && menu.pageRoute === activePath) {
          return menu
        }
      }
      return null
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
