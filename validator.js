let _ = require('lodash')

exports.validate = validate

function validate ({ schema, data, partial }) {
  let dKeys = _.keys(data)
  let sKeys = _.keys(schema)
  let extraDKeys = without(dKeys, sKeys)
  if (extraDKeys.length) {
    return `extra keys: ${extraDKeys}`
  }

  // 如果为整体验证 则遍历的keys扩充至sKeys
  let eKeys = partial ? dKeys : sKeys
  for (let k of eKeys) {
    if (k.includes('.')) {
      throw new Error(`keys including '.' are not supported yet: '${k}'`)
    }
    let v = data[k]
    let r = schema[k]

    // v == null 同时包含 null/undefined
    let isNone = v == null
    if (isNone) {
      if (r.required) {
        return `'${k}' is required`
      } else {
        continue
      }
    }

    if (r.type && r.type.schema) {
      let rs = r.type.validate({ data: v })
      if (rs) {
        return `'${k}': ${rs}`
      }
    } else {
      if (!(v instanceof r.type)) {
        return `'${k}' is not a/an '${r.type.name}'`
      }
    }
  }
}

// _.without 必须是 _.without(arr, 1, 2, 3) 的形式
// 此处需要直接传入两个arr 则封装一个好用的方法
function without (arr1, arr2) {
  let args = [arr1].concat(arr2)
  return _.without.apply(null, args)
}
