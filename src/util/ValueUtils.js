export default {
  copy: function (source, target) {
    if (target && source) {
      for (const key in source) {
        target[key] = source[key]
      }
    }
  }
}
