import 'babel-polyfill'
/**
 * es6 달라진 점
 * 
 * ## 리스트 순회
 * 
 * ### for...of
 * for(let i=0; i< list.length; i++) => for (const item of list)
 * 
 * ### Array
 * 
 * 
 * 
 * ### Map
 * 
 * ###
 */

export const apply1 = func => func(1)

export const times = (func, n) => {
  let i = 0
  while (i < n) func(i++)
}

export const addMaker = a => b => a+b

const identity = val => val

const isObject = obj => typeof obj === 'object'

const isIterable = iter => !!iter[Symbol.iterator]

const keys = obj => isObject(obj) ? Object.keys(obj) : []

const curry = (func) => (val, ...rest) => {
  return rest.length ? func(val, ...rest) : (...others) => func(val, ...others)
}

function *genIter(obj) {
  for (const key of keys(obj)) {
    yield obj[key]
  }
  return obj
}

const each = curry((fn, iter) => {
  if (!isIterable(iter)) iter = genIter(iter)

  for(const item of iter) {
    fn(item)
  }
  return iter
})

const map = curry((mapper, iter) => {
  const result = []
  each(item=>result.push(mapper(item)), iter)
  return result
})

const filter = curry((predi, iter) => {
  const result = []
  each(item=>{if (predi(item)) result.push(item)}, iter)
  return result
})

const reduce = curry((fn, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]()
    acc = iter.next().value
  }

  each(item=>{
    acc = fn(acc, item)
  }, iter)

  return acc
})

const go = (...args) => reduce((prev, func)=>func(prev), args)

const pipe = (fn, ...fns) => (...values) => go(fn(...values), ...fns)

export {
  identity,
  isObject,
  isIterable,

  curry,

  keys,
  each,
  map,
  filter,

  reduce,
  go,
  pipe
}