// practice

// TODO: curry upgrade

const _curry = (func) => {
  // arrow function은 arguments를 바인딩 하지 않음
  return function(a, b){
    if (arguments.length === 2) {
      return func(a, b)
    }

    return (b)=>func(a, b)
  }
}

const _curryr = (func) => {
  // arrow function은 arguments를 바인딩 하지 않음
  return function(a, b){
    if (arguments.length === 2) {
      return func(a, b)
    }

    return (b)=>func(b, a)
  }
}

const _isNill = (obj) => {
  return (obj === null || obj === undefined)
}

const _isObject = (obj) => {
  return typeof obj === 'object' && !!obj
}

const _get = _curryr((obj, key) => {
  return _isNill(obj) ? undefined : obj[key]
})

const _length = _get('length')

const _rest = (list, start) => {
  return Array.prototype.slice.call(list, start || 1)
}

////////////////////////////////////////////////////
function _identity(val) {
  return val
}

const _keys = (obj) => {
  return _isObject(obj) ? Object.keys(obj) : []
}

const _each = _curryr((obj, iter) => {
  const keys = _keys(obj)
  for(let i=0; i<keys.length; i++) {
    iter(obj[keys[i]], keys[i])
  }
  return obj
})

const _map = _curryr((obj, mapper) => {
  const newList = []
  _each(obj, (item, key)=>newList.push(mapper(item, key)))
  return newList
})

const _pairs = _map((val, key)=>[key, val])

const _values = _map(_identity)

function _pluck(obj, key) {
  return _map(obj, _get(key))
}

const _filter = _curryr((obj, predi) => {
  let newList = []
  _each(obj, (item, key)=>{
    if (predi(item, key)) newList.push(item)
  })
  return newList
})

function _negate(func){
  return function(val){
    return !func(val)
  }
}

const _reject = _curryr(function(obj, predi){
  return _filter(obj, _negate(predi))
})

const _compact = _filter(_identity)

const _find = _curryr(function(obj, predi){
  const keys = _keys(obj)
  for(let i=0; i<keys.length; i++) {
    const val = _get(obj, keys[i])
    if (predi(val)) return val
  }
})

const _findIndex = _curryr(function(obj, predi) {
  const keys = _keys(obj)
  for(let i=0; i<keys.length; i++) {
    if (predi(_get(obj, keys[i]))) return i
  }
  return -1
})

function _some(obj, predi) {
  return _findIndex(obj, predi || _identity) !== -1
}

function _every(obj, predi) {
  return _findIndex(obj, _negate(predi || _identity)) === -1
}

////////////////////////////////////////////////////

function _reduce(list, iter, memo) {
  // TODO: ArrayLike 다형성 가능하도록 수정
  if (arguments.length === 2) {
    const firstKey = _keys(list)[0]
    memo = list[firstKey]
    list = _rest(list)
  }
  
  _each(list, (item, index) => {
    memo = iter(memo, item, index)
  })

  return memo
}

function _min(obj){
  return _reduce(obj, function(prev, curr){
    return (prev > curr) ? curr : prev
  })
}

function _max(obj){
  return _reduce(obj, function(prev, curr){
    return (prev < curr) ? curr : prev
  })
}

const _minBy = _curryr(function(obj, iter){
  return _reduce(obj, function(prev, curr){
    return (iter(prev) > iter(curr)) ? curr : prev
  })
})

const _maxBy = _curryr(function(obj, iter){
  return _reduce(obj, function(prev, curr){
    return (iter(prev) < iter(curr)) ? curr : prev
  })
})

function _push(obj, key, val) {
  (obj[key] = obj[key] || []).push(val)
  return obj 
}

const _groupBy = _curryr(function(obj, iter){
  return _reduce(obj, function(group, val){
    return _push(group, iter(val), val)
  }, {})
})

function _inc(obj, key) {
  obj[key] ? obj[key]++ : obj[key] = 1
  return obj
}

const _countBy = _curryr(function(obj, iter){
  return _reduce(obj, function(count, val){
    return _inc(count, iter(val))
  }, {})
})

////////////////////////////////////////////////////

const _pipe = (...funcs) => (arg)=>{
  return _reduce(funcs, (arg, func)=>{
    return func(arg)
  }, arg)
}

// _pipe는 '인자들'을 받으므로
// apply를 통해서 array->인자들 로 적용
const _go = (...args) => {
  return _pipe.apply(null, _rest(args))(args[0])
}

export {
  _get,

  _keys,
  _each,
  _map,
  _pairs,
  _values,
  _pluck,
  _filter,
  _reject,
  _compact,
  _find,
  _findIndex,
  _some,
  _every,
  _reduce,
  _min,
  _max,
  _minBy,
  _maxBy,
  _groupBy,
  _countBy,

  _curry,
  _curryr,
  
  _pipe,
  _go
}