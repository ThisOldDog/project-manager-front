<template>
  <el-menu class="menu" background-color="#545c64" text-color="#ffffff" active-text-color="#ffd04b">
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
  }
}
</script>

<style lang="stylus" scoped>
  .menu
    height 100%
</style>
