<template>
  <el-container class="container">
    <el-header style="height: 48px;">
      <workspace-header :user="user"></workspace-header>
    </el-header>
    <el-aside class="aside" style="width: 220px">
      <workspace-menu :menus="menus"></workspace-menu>
    </el-aside>
  </el-container>
</template>

<script>
import WorkspaceHeader from './components/Header'
import WorkspaceMenu from './components/Menu'

export default {
  name: 'Workspace',
  components: {
    WorkspaceHeader,
    WorkspaceMenu
  },
  data () {
    return {
      user: null,
      menus: []
    }
  },
  methods: {
    handleUser (response) {
      this.user = response.data
      this.$store.commit('storeUser', this.user)
    },
    handleMenu (response) {
      this.menus = response.data
    }
  },
  mounted () {
    this.$axios.get('/api/user')
      .then(this.handleUser)
    this.$axios.get('/api/menu/tree')
      .then(this.handleMenu)
  }
}
</script>

<style lang="stylus" scoped>
  @import '~@styles/variables.styl'
  .container
    position absolute
    top 0
    bottom 0
    left 0
    right 0
    .el-header
      height 48px
      background $color-second
      padding 0
    .aside
      position absolute
      top 48px
      bottom 0
      left 0
      right 220px
</style>
