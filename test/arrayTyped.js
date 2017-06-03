let { test } = require('ava')
let { validate } = require('..')

let roleProp = { type: Number }

let userSchema = {
  roles: { type: Array, element: roleProp, required: true }
}

test(t => {
  let rs = validate({
    schema: userSchema,
    data: {
      roles: null
    }
  })
  t.regex(rs, /is required/)
})

test(t => {
  let rs = validate({
    schema: userSchema,
    data: {
      roles: []
    }
  })
  t.falsy(rs)
})

test(t => {
  let rs = validate({
    schema: userSchema,
    data: {
      roles: [1, 5]
    }
  })
  t.falsy(rs)
})

test(t => {
  let rs = validate({
    schema: userSchema,
    data: {
      roles: [1, 'str']
    }
  })
  t.regex(rs, /roles\[1\]/)
  t.regex(rs, /is not a/)
})
