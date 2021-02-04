export default {
  buildQuery: function (condition, pagable, notEmpty) {
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
        query += ((query ? '&' : '?') + 'page=' + pagable.page + '&size=' + pagable.size)
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
  },
  appendQuery: function (url, condition, pagable) {
    if (url.indexOf('?') < 0) {
      return url + this.buildQuery(condition, pagable)
    } else {
      return url + '&' + this.buildQuery(condition, pagable).substring(1)
    }
  }
}
