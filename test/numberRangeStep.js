let { validate } = require('..')
let { test } = require('ava')

let schema = {
  price: { type: Number, range: [0.5, 99.5], step: 0.5 }
}

test(t => {
  let rs = validate({
    schema,
    data: {
      price: 0
    }
  })
  t.regex(rs, /is not in range/)
})

test(t => {
  let rs = validate({
    schema,
    data: {
      price: 0.5
    }
  })
  t.falsy(rs)
})

test(t => {
  let rs = validate({
    schema,
    data: {
      price: 78.5
    }
  })
  t.falsy(rs)
})

test(t => {
  let rs = validate({
    schema,
    data: {
      price: 99.5
    }
  })
  t.falsy(rs)
})

test(t => {
  let rs = validate({
    schema,
    data: {
      price: 100
    }
  })
  t.regex(rs, /is not in range/)
})

test(t => {
  let rs = validate({
    schema,
    data: {
      price: 78.6
    }
  })
  t.regex(rs, /is not by step/)
})
