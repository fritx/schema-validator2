let { ObjectID } = require('mongodb')
let { test } = require('ava')
let { validate } = require('..')

let schema = {
  _id: { type: ObjectID, required: true }
}

// partial: false
test(t => {
  let rs = validate({
    schema,
    data: { _id: new ObjectID() }
  })
  t.falsy(rs)
})

test(t => {
  let rs = validate({
    schema,
    data: { _id: 123 }
  })
  t.regex(rs, /is not a/)
})

test(t => {
  let rs = validate({
    schema,
    data: { _id: null }
  })
  t.regex(rs, /is required/)
})

test(t => {
  let rs = validate({
    schema,
    data: {}
  })
  t.regex(rs, /is required/)
})

// partial: true
test(t => {
  let rs = validate({
    schema,
    partial: true,
    data: { _id: new ObjectID() }
  })
  t.falsy(rs)
})

test(t => {
  let rs = validate({
    schema,
    partial: true,
    data: { _id: 123 }
  })
  t.regex(rs, /is not a/)
})

test(t => {
  let rs = validate({
    schema,
    partial: true,
    data: { _id: null }
  })
  t.regex(rs, /is required/)
})

test(t => {
  let rs = validate({
    schema,
    partial: true,
    data: {}
  })
  t.falsy(rs)
})
