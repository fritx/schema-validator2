# schema-validator2

When I wrote this library, I didn't notice there had been already a similar library called [schema-validator](https://github.com/nijikokun/Validator).

So I publish my own as "schema-validator2".

It requires node >= 7.x.

```plain
npm i -S schema-validator2
```

```js
let { validate } = require('schema-validator2')
let { ObjectID } = require('mongodb')

let schema = {
  _id: { type: ObjectID, required: true }
}

let data = {
  _id: new ObjectID()
}

let rs = validate({
  schema,
  partial: true || false
  data
})
```

```plain
// Possible results:
// - rs = undefined
// - rs = extra keys: ['a', 'b']
// - rs = 'a' is required
// - rs = 'a' is not a/an 'Date'
// - Error: keys including '.' are not supported yet: 'a.b'
```

Coverage:

<img src="coverage.png">

Todo:

- Babel build for lower node versions
- More test cases
- [Travis CI & Coveralls](https://github.com/avajs/ava/blob/master/docs/recipes/code-coverage.md#hosted-coverage)
