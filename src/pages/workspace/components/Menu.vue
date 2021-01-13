<template>
  <el-menu class="menu" background-color="#545c64" text-color="#ffffff" active-text-color="#ffd04b" :unique-opened="true" @select="handleMenuSelect">
    <workspace-menu-item :menus="menus"></workspace-menu-item>
  </el-menu>
</template>

<script>
import WorkspaceMenuItem from './MenuItem'
export default {
  name: 'WorkspaceMenu',
  components: {
    WorkspaceMenuItem
  },
  props: {
    menus: Array
  },
  methods: {
    handleMenuSelect (index, indexPath) {
      this.menuSelect(index, this.menus)
    },
    menuSelect (index, menuItems) {
      for (let i = 0; i < menuItems.length; i++) {
        if (menuItems[i].menuCode === index) {
          this.$emit('menuSelect', menuItems[i])
          return true
        }
        if (menuItems[i].subMenuList) {
          if (this.menuSelect(index, menuItems[i].subMenuList)) {
            return true
          }
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .menu
    height 100%
</style>
