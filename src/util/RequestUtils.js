export default {
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
