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

const _keys = (obj) => {
  return _isObject(obj) ? Object.keys(obj) : []
}

const _each = _curryr((obj, iter) => {
  const keys = _keys(obj)
  for(let i=0; i<keys.length; i++) {
    iter(obj[keys[i]])
  }
  return obj
})

const _map = _curryr((obj, mapper) => {
  const newList = []
  _each(obj, (item)=>newList.push(mapper(item)))
  return newList
})

const _filter = _curryr((obj, predi) => {
  let newList = []
  _each(obj, (item)=>{
    if (predi(item)) newList.push(item)
  })
  return newList
})

function _reduce(list, iter, memo) {
  if (arguments.length === 2) {
    memo = list[0]
    list = _rest(list)
  }
  
  _each(list, item => {
    memo = iter(memo, item)
  })

  return memo
}

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
  _filter,
  _curry,
  _curryr,
  _reduce,
  _pipe,
  _go
}