export default {
  storeAccessToken (ctx, accessToken) {
    ctx.commit('storeAccessToken', accessToken)
  },
  storeUser (ctx, user) {
    ctx.commit('storeUser', user)
  }
}
