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

// export const apply1 = func => func(1)

// export const times = (func, n) => {
//   let i = 0
//   while (i < n) func(i++)
// }

// export const addMaker = a => b => a+b

const identity = val => val

const isObject = obj => typeof obj === 'object'

const isIterable = iter => iter && iter[Symbol.iterator]

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

const entries = obj => {
  const result = []
  for (const key in obj) result.push([key, obj[key]])
  return result
}

const entriesL = function *(obj){
  for (const key in obj) yield [key, obj[key]]
}

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

const takeAll = take(Infinity)

const go = (...args) => reduce((prev, func)=>func(prev), args)

const pipe = (fn, ...fns) => (...values) => go(fn(...values), ...fns)

const each = curry((fn, iter) => {
  if (!isIterable(iter)) iter = genIter(iter)
  for(const item of iter) fn(item)
  return iter
})

const mapL = curry(function*(mapper, iter) {
  if (!isIterable(iter)) iter = genIter(iter)
  for(const item of iter) {
    yield mapper(item)
  }
})

const map = curry(pipe(
  mapL,
  takeAll
))

const filterL = curry(function*(predi, iter) {
  if (!isIterable(iter)) iter = genIter(iter)
  for (const item of iter) {
    if (predi(item)) yield item
  }
})

const filter = curry(pipe(
  filterL,
  takeAll
))

const find = curry((predi, iter) => go(iter,
  filterL(predi),
  take(1),
  ([a])=>a
))

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

const join = curry((sep=',', iter) => reduce((prev, curr)=>`${prev}${sep}${curr}`, iter))

const flattenL = function *(iter) {
  for(const item of iter) {
    if (isIterable(item)){
      yield* item
    }
    else {
      yield item
    }
  }
}

const flatten = pipe(
  flattenL,
  takeAll
)

const deepFlattenL = function* (iter) {
  for(const item of iter) {
    if (isIterable(item)){
      yield* deepFlattenL(item)
    }
    else {
      yield item
    }
  }
}

const deepFlatten = pipe(
  deepFlattenL,
  takeAll
)

const flatMapL = curry(pipe(
  mapL,
  flattenL
))

const flatMap = curry(pipe(
  mapL,
  flatten
))

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
  join,

  range,
  rangeL,
  entries,
  entriesL,

  take,
  find,

  flattenL,
  flatten,
  deepFlattenL,
  deepFlatten,
  flatMapL,
  flatMap
}