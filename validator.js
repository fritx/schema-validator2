let _ = require('lodash')

exports.validate = validate

function validate ({ schema, data, partial }) {
  let sKeys = _.keys(schema)
  for (let k of sKeys) {
    // 暂不支持 带'.'的key嵌套操作
    if (k.includes('.')) {
      throw new Error(`dot keys are not supported: '${k}'`)
    }
  }

  let dKeys = _.keys(data)
  let exDKeys = without(dKeys, sKeys)
  if (exDKeys.length) {
    let str = exDKeys.map(k => `'${k}'`).join(', ')
    return `extra keys: ${str}`
  }

  // 如果为整体验证 则遍历的keys扩充至sKeys
  let eKeys = partial ? dKeys : sKeys
  for (let k of eKeys) {
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
    if (r.optional) {
      return '' // 缺省则跳过验证
    } else {
      return `'${k}' is required`
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
    } else if (r.type === String) {
      if (r.range) {
        let [min, max] = r.range
        let len = getStrLen(v)
        if (len < min || len > max) {
          return `'${k}' is not in range [${min}, ${max}]`
        }
      }
    } else if (r.type === Number) {
      if (r.range) {
        let [min, max] = r.range
        if (v < min || v > max) {
          return `'${k}' is not in range [${min}, ${max}]`
        }
      }
      if (r.step) {
        if (v % r.step !== 0) {
          return `'${k}' is not by step '${r.step}'`
        }
      }
    }
  }
  return ''
}

function getStrLen (str) {
  let c = str.length
  let es = escape(str)
  let zc = es.split('%u').length - 1
  let ec = c - zc
  let elen = ec + zc * 2
  return elen
}

function isType (v, type) {
  if (v instanceof type) {
    return true
  }
  if (v != null && v.constructor.name === type.name) {
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
