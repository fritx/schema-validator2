let { ObjectID } = require('mongodb')
let { validate } = require('..')
let { test } = require('ava')
let _ = require('lodash')

test(t => {
  let rs = validate({
    schema: {
      _id: { type: ObjectID }
    },
    data: { _id: new ObjectID() }
  })
  t.falsy(rs)
})
test(t => {
  let rs = validate({
    schema: {
      _id: { type: ObjectID }
    },
    data: { _id: 123 }
  })
  t.regex(rs, /is not a/)
})

test(t => {
  let rs = validate({
    schema: {
      name: { type: String }
    },
    data: { name: 'hello' }
  })
  t.falsy(rs)
})
test(t => {
  let rs = validate({
    schema: {
      name: { type: String }
    },
    data: { name: 123 }
  })
  t.regex(rs, /is not a/)
})

test(t => {
  let rs = validate({
    schema: {
      quantity: { type: Number, test: _.isInteger }
    },
    data: { quantity: 32 }
  })
  t.falsy(rs)
})
test(t => {
  let rs = validate({
    schema: {
      quantity: { type: Number, test: _.isInteger }
    },
    data: { quantity: 32.4 }
  })
  t.regex(rs, /does not match/)
})
