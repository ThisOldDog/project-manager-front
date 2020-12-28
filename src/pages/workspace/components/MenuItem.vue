<template>
  <div>
    <component v-for="menu of menus" :key="menu.menuId" :is="menu.menuType === 'PAGE' ? 'el-menu-item' : 'el-submenu'" :index="menu.menuCode">
      <template slot="title">
        <i :class="menu.menuIcon"></i>
        <span>{{menu.menuName}}</span>
      </template>
      <workspace-menu-item :menus="menu.subMenuList"></workspace-menu-item>
    </component>
  </div>
</template>

<script>
export default {
  name: 'WorkspaceMenuItem',
  props: {
    menus: Array
  }
}
</script>

<style lang="stylus" scoped>

</style>
