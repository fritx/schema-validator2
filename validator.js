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
  if (_.isNil(v)) {
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
    // type为构造函数 如'String'
    if (v.constructor.name !== r.type.name) {
      return `'${k}' is not a/an '${r.type.name}'`
    }
    // test为检测函数 如'_.isInteger'
    if (r.test) {
      if (!r.test(v)) {
        return `'${k}' does not match '${r.test.name}'`
      }
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
        let isBelow = !_.isNil(min) && len < min
        let isAbove = !_.isNil(max) && len > max
        if (isBelow || isAbove) {
          return `'${k}' is not in range [${min}, ${max}]`
        }
      }
    } else if (r.type === Number) {
      if (r.range) {
        let [min, max] = r.range
        let isBelow = !_.isNil(min) && v < min
        let isAbove = !_.isNil(max) && v > max
        if (isBelow || isAbove) {
          return `'${k}' is not in range [${min}, ${max}]`
        }
      }
      if (r.step) {
        if (floatMod(v, r.step) !== 0) {
          return `'${k}' is not by step '${r.step}'`
        }
      }
    }
  }
  return ''
}

// https://stackoverflow.com/questions/3966484/why-does-modulus-operator-return-fractional-number-in-javascript
function floatMod (v, s) {
  let dv = (String(v).split('.')[1] || '').length
  let ds = (String(s).split('.')[1] || '').length
  let b = Math.max(dv, ds)
  let m = Math.pow(10, b)
  return (v * m) % (s * m) / m
}

function getStrLen (str) {
  let c = str.length
  let es = escape(str)
  let zc = es.split('%u').length - 1
  let ec = c - zc
  let elen = ec + zc * 2
  return elen
}

// _.without 必须是 _.without(arr, 1, 2, 3) 的形式
// 此处需要直接传入两个arr 则封装一个好用的方法
function without (arr1, arr2) {
  let args = [arr1].concat(arr2)
  return _.without.apply(null, args)
}
