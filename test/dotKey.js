let { test } = require('ava')
let { validate } = require('..')

test(t => {
  let rs = validate({
    schema: {
      arr: { type: Array, element: { type: Number } }
    },
    data: {
      'arr': [1, 2]
    }
  })
  t.falsy(rs)
})

test(t => {
  let rs = validate({
    schema: {
      arr: { type: Array, element: { type: Number } }
    },
    data: {
      'arr.1': 123
    }
  })
  t.regex(rs, /extra keys/)
})

test(t => {
  let err = t.throws(() => {
    validate({
      schema: {
        'a.b': { type: String }
      },
      data: {
        'a.b': 'str'
      }
    })
  })
  t.regex(err.message, /not supported/)
})

test(t => {
  let err = t.throws(() => {
    validate({
      schema: {
        'a.b': { type: String }
      },
      data: {}
    })
  })
  t.regex(err.message, /not supported/)
})
