# schema-validator2

When I wrote this library, I didn't notice there had been already a similar library called [schema-validator](https://github.com/nijikokun/Validator).

So I publish my own as "schema-validator2".

It requires node >= 7.x.

```plain
npm i -S schema-validator2
```

### Schema validation

```js
let { validate } = require('schema-validator2')
let { ObjectID } = require('mongodb')

let schema = {
  nested: { schema: anotherSchema, optional: true },
  arr: { type: Array, element: { type: Number } },
  _id: { type: ObjectID }
}

let data = {
  arr: [1, 5],
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
// - rs = ''
// - rs = extra keys: 'a', 'b'
// - rs = 'a' is required
// - rs = 'a' is not a/an 'Date'
// - Error: dot keys are not supported: 'a.b'
```

### Value validation

```js
let schema = {
  name: { type: String, range: [2, 16] },
  price: { type: Number, range: [0.5, 99.5], step: 0.5 },
  quantity: { type: Number, range: [1, null], test: _.isInteger }
}
```

```plain
// Possible results:
// - rs = ''
// - rs = 'name' is not in range [2, 16]
// - rs = 'price' is not in range [0.5, 99.5]
// - rs = 'price' is not by step '0.5'
// - rs = 'quantity' does not match '_.isInteger'
```

Coverage:

<img src="https://github.com/fritx/schema-validator2/raw/master/coverage.png">

Todo:

- Value validation
- Default value??
- Babel build for lower node versions
- More test cases
- [Travis CI & Coveralls](https://github.com/avajs/ava/blob/master/docs/recipes/code-coverage.md#hosted-coverage)
