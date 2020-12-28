<template>
  <div v-loading="true" element-loading-text="正在登录..." class="loading"></div>
</template>

<script>
export default {
  name: 'Authorization',
  data () {
    return {
      gitlabOAuthPath: process.env.GITLAB_OAUTH2_URL,
      gitlabOAuthParam: {
        client_id: process.env.GITLAB_OAUTH2_CLIENT_ID,
        redirect_uri: process.env.GITLAB_OAUTH2_REDIRECT_URI,
        response_type: process.env.GITLAB_OAUTH2_RESPONSE_TYPE,
        scope: process.env.GITLAB_OAUTH2_SCOPE,
        state: process.env.GITLAB_OAUTH2_STATE_LOGIN
      }
    }
  },
  methods: {
    queryParam (e) {
      let p = []
      for (let key in e) {
        p.push(key + '=' + e[key])
      }
      let q = p[0]
      for (let i = 1; i < p.length; i++) {
        q += ('&' + p[i])
      }
      return q
    }
  },
  mounted () {
    if (this.$store.state.accessToken) {
      // router
      this.$router.push('/workspace')
    } else {
      let anchor = this.$route.hash
      if (anchor) {
        anchor = anchor.startsWith('#') ? anchor.substring(1) : anchor
        let accessToken = null
        let tokenType = null
        for (let keyValue of anchor.split('&')) {
          if (keyValue.startsWith('access_token')) {
            accessToken = keyValue.substring(13)
          } else if (keyValue.startsWith('token_type')) {
            tokenType = keyValue.substring(11)
          }
        }
        if (accessToken && tokenType) {
          accessToken = tokenType + ' ' + accessToken
          // store
          this.$store.dispatch('storeAccessToken', accessToken)
          // router
          this.$router.push('/workspace')
          return
        }
      }
      window.location.href = this.gitlabOAuthPath + '?' + this.queryParam(this.gitlabOAuthParam)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .loading
    position absolute
    top 0
    bottom 0
    left 0
    right 0
</style>
