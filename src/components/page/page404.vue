<template>
  <el-row>
    <el-col :span="12" :offset="6">
      <img :src="require('@/assets/imgs/404.jpeg')" class="page404">
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'page404'
}
</script>

<style lang="stylus" scoped>
  .page404
    width 100%
    margin-top 20px
</style>
