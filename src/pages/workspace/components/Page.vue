<template>
  <div>
    <el-tabs v-model="currentTab" @tab-click="handleTabSelect" closable @tab-remove="handleRemoveTab">
      <el-tab-pane v-for="tab of tabs" :key="tab.menuId" :label="tab.menuName" :name="tab.menuCode"></el-tab-pane>
    </el-tabs>
    <!-- <keep-alive> -->
      <router-view v-if="Boolean(currentTab)"></router-view>
    <!-- </keep-alive> -->
  </div>
</template>

<script>
export default {
  name: 'WorkspacePage',
  data () {
    return {
      tabs: [],
      previouTab: null,
      currentTab: null
    }
  },
  methods: {
    pushTab (tab) {
      let opened = false
      for (let i = 0; i < this.tabs.length; i++) {
        opened |= this.tabs[i].menuCode === tab.menuCode
      }
      if (!opened) {
        this.tabs.push(tab)
      }
      this.currentTab = tab.menuCode
      this.activeTab()
    },
    activeTab () {
      if (this.previouTab !== this.currentTab) {
        if (this.currentTab === null) {
          this.$router.push({path: '/workspace'})
        }
        this.previouTab = this.currentTab
        for (let i = 0; i < this.tabs.length; i++) {
          if (this.tabs[i].menuCode === this.currentTab && this.tabs[i].pageRoute !== this.$route.path) {
            this.$router.push({path: this.tabs[i].pageRoute})
            return
          }
        }
      }
    },
    handleTabSelect (selectPage) {
      this.activeTab()
    },
    handleRemoveTab (removeTab) {
      for (let i = 0; i < this.tabs.length; i++) {
        if (this.tabs[i].menuCode === removeTab) {
          this.tabs.splice(i, 1)
          if (removeTab === this.currentTab) {
            if (this.tabs.length > 0) {
              i = Math.max(0, i - 1)
              this.currentTab = this.tabs[i].menuCode
            } else {
              this.currentTab = null
            }
          }
          this.activeTab()
          return
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
