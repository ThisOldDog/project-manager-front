export default {
  copy: function (source, target) {
    if (target && source) {
      for (const key in source) {
        target[key] = source[key]
      }
    }
  },
  clear: function (condition) {
    if (condition) {
      for (const key in condition) {
        if (Object.hasOwnProperty.call(condition, key)) {
          const value = condition[key]
          if (value) {
            if (value.constructor === Boolean) {
              condition[key] = false
            } else if (value.constructor === Number) {
              condition[key] = 0
            } else if (value.constructor === String) {
              condition[key] = ''
            } else if (value.constructor === Array) {
              condition[key] = []
            } else if (value.constructor === Object) {
              condition[key] = {}
            }
          }
        }
      }
    }
  }
}
