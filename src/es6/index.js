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

const range = length => {
  let i=-1
  const result = []
  while(++i < length) {
    result.push(i)
  }
  return result
}

const rangeL = function *(length) {
  let i=-1
  while(++i < length) {
    yield i
  }
}

const each = curry((fn, iter) => {
  if (!isIterable(iter)) iter = genIter(iter)

  iter = iter[Symbol.iterator]()
  let curr
  while(!(curr=iter.next()).done) {
    fn(curr.value)
  }

  return iter
})

const map = curry((mapper, iter) => {
  const result = []
  each(item=>result.push(mapper(item)), iter)
  return result
})

const mapL = curry(function*(mapper, iter) {
  iter = iter[Symbol.iterator]()
  let curr
  while(!(curr=iter.next()).done) {
    yield mapper(curr.value)
  }
})

const filter = curry((predi, iter) => {
  const result = []
  each(item=>{if (predi(item)) result.push(item)}, iter)
  return result
})

const filterL = curry(function*(predi, iter) {
  iter = iter[Symbol.iterator]()
  let curr
  while(!(curr=iter.next()).done) {
    if (predi(curr.value)) yield curr.value
  }
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

const take = curry((length, iter) =>{
  const result = []
  for(const item of iter) {
    result.push(item)
    if(result.length===length){
      return result
    }
  }
  return result
})

export {
  identity,
  isObject,
  isIterable,

  curry,

  keys,
  each,
  map,
  mapL,
  filter,
  filterL,

  reduce,
  go,
  pipe,

  range,
  rangeL,
  take,
}