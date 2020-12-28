export default {
  storeAccessToken (state, accessToken) {
    state.accessToken = accessToken
    try {
      localStorage.accessToken = accessToken
    } catch (e) {}
  },
  storeUser (state, user) {
    state.user = user
  }
}
