export default {
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
  },
  buildQuery: function (condition, pagable) {
    let query = ''
    // condition
    for (let key in condition) {
      const value = condition[key]
      if (value) {
        query += ((query ? '&' : '?') + key + '=' + value)
      }
    }
    if (pagable) {
      if (pagable.page && pagable.size) {
        // page
        query += ((query ? '&' : '?') + 'page=' + (pagable.page - 1) + '&size=' + pagable.size)
      }
      // sort
      if (pagable.sort) {
        for (let field in pagable.sort) {
          if (pagable.sort[field]) {
            query += ((query ? '&' : '?') + 'sort=' + field + ',' + pagable.sort[field])
          }
        }
      }
    }
    return query
  }
}
