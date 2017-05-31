let { test } = require('ava')
let { validate } = require('..')

let anotherSchema = {
  a: { type: String },
  b: { type: Number }
}

let schema = {
  nested: { schema: anotherSchema }
}

test(t => {
  let rs = validate({
    schema,
    data: {
      nested: { a: 'xyz', b: 123 }
    }
  })
  t.falsy(rs)
})

test(t => {
  let rs = validate({
    schema,
    data: {
      nested: { a: 123, b: 123 }
    }
  })
  t.regex(rs, /'a' is not a/)
})

test(t => {
  let rs = validate({
    schema,
    data: {
      nested: { a: 'xyz', b: 'xyz' }
    }
  })
  t.regex(rs, /'b' is not a/)
})
