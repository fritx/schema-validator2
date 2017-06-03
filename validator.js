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

    let rs = validateProp(k, v, r)
    if (rs) return rs
  }
  return ''
}

function validateProp (k, v, r) {
  // v == null 同时包含 null/undefined
  let isNone = v == null
  if (isNone) {
    if (r.required) {
      return `'${k}' is required`
    } else {
      return '' // 缺省则跳过验证
    }
  }

  if (r.schema) {
    let rs = validate({
      schema: r.schema,
      data: v
    })
    if (rs) {
      return `'${k}': ${rs}`
    }
  } else {
    // √ new String('') instanceof String
    // × 'xyz' instanceof String
    // 不能只用instanceof
    if (!isType(v, r.type)) {
      return `'${k}' is not a/an '${r.type.name}'`
    }

    if (r.type === Array) {
      let r1 = r.element
      for (let k1 = 0; k1 < v.length; k1++) {
        let v1 = v[k1]
        let rs = validateProp(`${k}[${k1}]`, v1, r1)
        if (rs) return rs
      }
    }
  }
  return ''
}

function isType (v, type) {
  if (v instanceof type) {
    return true
  }
  let isX = _[`is${type.name}`]
  if (isX && isX(v)) {
    return true
  }
  return false
}

// _.without 必须是 _.without(arr, 1, 2, 3) 的形式
// 此处需要直接传入两个arr 则封装一个好用的方法
function without (arr1, arr2) {
  let args = [arr1].concat(arr2)
  return _.without.apply(null, args)
}
