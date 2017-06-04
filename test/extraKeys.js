let { test } = require('ava')
let { validate } = require('..')

let schema = {
  a: { type: String },
  b: { type: Number, optional: true }
}

test(t => {
  let rs = validate({
    partial: true,
    schema,
    data: {
      a: 'str',
      b: 123,
      foo: 111
    }
  })
  t.regex(rs, /extra keys/)
})
