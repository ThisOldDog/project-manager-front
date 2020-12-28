let accessToken = null
let user = null
try {
  if (localStorage.accessToken) {
    accessToken = localStorage.accessToken
  }
} catch (e) { }

export default {
  accessToken,
  user
}
