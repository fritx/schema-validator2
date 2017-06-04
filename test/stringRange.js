let { validate } = require('..')
let { test } = require('ava')

let schema = {
  name: { type: String, range: [2, 4] }
}

test(t => {
  let rs = validate({
    schema,
    data: {
      name: ''
    }
  })
  t.regex(rs, /is not in range/)
})

test(t => {
  let rs = validate({
    schema,
    data: {
      name: 'aa'
    }
  })
  t.falsy(rs)
})

test(t => {
  let rs = validate({
    schema,
    data: {
      name: '一2'
    }
  })
  t.falsy(rs)
})

test(t => {
  let rs = validate({
    schema,
    data: {
      name: '一二'
    }
  })
  t.falsy(rs)
})

test(t => {
  let rs = validate({
    schema,
    data: {
      name: '一234'
    }
  })
  t.regex(rs, /is not in range/)
})

test(t => {
  let rs = validate({
    schema: {
      name: { type: String, range: [2, null] }
    },
    data: {
      name: '电视剧和冯绍峰客户端看后感'
    }
  })
  t.falsy(rs)
})

test(t => {
  let rs = validate({
    schema: {
      name: { type: String, range: [null, 4] }
    },
    data: {
      name: '1'
    }
  })
  t.falsy(rs)
})
