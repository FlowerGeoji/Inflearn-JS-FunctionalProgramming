import * as fp from '../../src/es6'
import 'babel-polyfill'

describe('Lazy Test', ()=>{
  const PRODUCTS_ARR = [
    {name: '반팔티', price: 15000, quantity: 1, isSelected: true},
    {name: '긴팔티', price: 20000, quantity: 2, isSelected: false},
    {name: '핸드폰케이스', price: 15000, quantity: 3, isSelected: true},
    {name: '후드티', price: 30000, quantity: 4, isSelected: false},
    {name: '바지', price: 25000, quantity: 5, isSelected: false},
  ]
  const PRODUCTS_OBJ = {
    '10': {name: '반팔티', price: 15000, quantity: 1, isSelected: true},
    '20': {name: '긴팔티', price: 20000, quantity: 2, isSelected: false},
    '30': {name: '핸드폰케이스', price: 15000, quantity: 3, isSelected: true},
    '40': {name: '후드티', price: 30000, quantity: 4, isSelected: false},
    '50': {name: '바지', price: 25000, quantity: 5, isSelected: false},
  }

  test('range function', ()=>{
    const add = (a, b)=>a+b

    expect(
      fp.range(5)
    ).toMatchObject([0, 1, 2, 3, 4])

    const list = fp.range(4)
    expect(
      fp.reduce(add, list)
    ).toBe(6)
  })

  test('Lazy range', ()=>{
    const add = (a, b)=>a+b

    // range는 reduce가 실행되기 전에 이미 실행(evaluation)되어 배열을 생성함.
    // rangeL은 iterator만을 생성하고, reduce에서 iterator를 통해
    // next호출을 할때마다 하나의 value를 평가(evaluation)한다.

    const list = fp.rangeL(4)
    expect(list).not.toMatchObject([0, 1, 2, 3])

    expect(
      fp.reduce(add, list)
    ).toBe(6)

    const rangeMock = jest.fn((i)=>{
      // console.log(i, 'ragne')
    })
    const t_range = length => {
      let i=-1
      const result = []
      while(++i < length) {
        rangeMock(i)
        result.push(i)
      }
      return result
    }
    
    const rangeLMock = jest.fn((i)=>{
      // console.log(i, 'ragneL')
    })
    const t_rangeL = function*(length) {
      let i=-1
      while(++i < length) {
        rangeLMock(i)
        yield i
      }
    }

    const list1 = t_range(5)
    const list2 = t_rangeL(5)

    // generator 내부는 동작하지 않음
    expect(rangeMock).toBeCalledTimes(5)
    expect(rangeLMock).toBeCalledTimes(0)

    // iterator를 사용할 때마다 값들이 평가됨
    list2.next()
    expect(rangeLMock).toBeCalledTimes(1)
    list2.next()
    expect(rangeLMock).toBeCalledTimes(2)
    fp.reduce(add, list2)
    expect(rangeLMock).toBeCalledTimes(5)
  })

  test('Preformance test', ()=>{
    const add = (a, b) => a+b

    const testPerf = (time, func) => {
      const start = Date.now()
      while(time--) {
        func()
      }
      const end = Date.now()

      return end-start
    }

    // 모든 값의 array를 생성 함
    const rangeFunc = () => fp.go(fp.range(10000),
      fp.take(5),
      fp.reduce(add)
    )

    expect(
      rangeFunc()
    ).toBe(10)

    // 0~4까지만 iterator를 돌고 끝남
    const rangeLFunc = () => fp.go(fp.rangeL(10000),
      fp.take(5),
      fp.reduce(add)
    )

    expect(
      rangeLFunc()
    ).toBe(10)

    expect(
      fp.go(
        fp.rangeL(Infinity),
        fp.take(5),
        fp.reduce(add)
      )
    ).toBe(10)

    const rangeFuncTime = testPerf(1, rangeFunc)
    const rangeLFuncTime = testPerf(1, rangeLFunc)
    
    expect(rangeFuncTime-rangeLFuncTime).toBeGreaterThanOrEqual(0)
  })

  test('Lazy map, filter, take, reduce', ()=>{
    /**
     * ### map, filter 계열 함수들이 가지는 결합 법칙
     * 
     * - 사용하는 데이터가 무엇이든지
     * - 사용하는 보조 함수가 순수 함수라면 무엇이든지
     * - 아래와 같이 결합한다면 둘다 결과가 같다.
     * 
     * 수평평가 : [[mapping, mapping], [filtering, filtering], [mapping, mapping]]
     * =
     * 수직평가 : [[mapping, filtering, mapping], [mapping, filtering, mapping]]
     * 
     */
    const map = fp.mapL(a=>a+10, [1, 2, 3])
    expect(map.next()).toMatchObject({value: 11, done: false})
    expect(map.next()).toMatchObject({value: 12, done: false})
    expect(map.next()).toMatchObject({value: 13, done: false})
    expect(map.next()).toMatchObject({value: undefined, done: true})

    const filter = fp.filterL(a=>a%2, [1, 2, 3, 4])
    expect(filter.next()).toMatchObject({value: 1, done: false})
    expect(filter.next()).toMatchObject({value: 3, done: false})
    expect(filter.next()).toMatchObject({value: undefined, done: true})

    const mapper = jest.fn(n=>n+10)
    const predi = jest.fn(n=>n%10)

    // range -> map -> filter -> take 순으로 실행
    // range(10번) + map(10번) + filter(10번) + take(2번)
    // 비효율
    fp.go(fp.range(100),
      fp.map(mapper),
      fp.filter(predi),
      fp.take(2)
    )

    expect(mapper).toBeCalledTimes(100)
    expect(predi).toBeCalledTimes(100)

    // take -> filterL -> mapL -> rangeL 순으로 실행
    // take(2번) + filterL(3번) + mapL(3번) + rangeL(3번)
    // 효율성이 좋음
    fp.go(fp.rangeL(100),
      fp.mapL(mapper),
      fp.filterL(predi),
      fp.take(2)
    )

    expect(mapper).toBeCalledTimes(100+3)
    expect(predi).toBeCalledTimes(100+3)
  })

  test('End functions - reduce, take', ()=>{
    /**
     * ## 결과를 만드는 함수
     * 
     * ### reduce(join)
     * ### take
     * ### find
     */

     // reduce, join
     const queryStr1 = fp.pipe(
      fp.entries,
      fp.map(([key, value]) => `${key}=${value}`),
      fp.join('&')
    )
    const queryStr2 = fp.pipe(
      fp.entriesL,
      fp.mapL(([key, value]) => `${key}=${value}`),
      fp.join('&')
    )

     expect(
      queryStr1({limit: 10, offset: 10, type: 'notice'})
     ).toBe('limit=10&offset=10&type=notice')

     expect(
      queryStr2({limit: 10, offset: 10, type: 'notice'})
     ).toBe('limit=10&offset=10&type=notice')

     // find - lazy filter, take를 이용
     const USERS = [
       {age: 32},
       {age: 31},
       {age: 37},
       {age: 28},
       {age: 25},
       {age: 32},
       {age: 31},
       {age: 37},
     ]

     expect(
       fp.find(user=>user.age < 30, USERS)
     ).toMatchObject({age: 28})
  })

  test('Make map, filter by mapL, filterL', ()=>{
    // ## mapL, filterL 를 이용하여 map, filter만들기

    const takeAll = fp.take(Infinity)
    
    const map = fp.curry(fp.pipe(
      fp.mapL,
      takeAll
    ))

    expect(
      map(a=>a+10, fp.range(4))
    ).toMatchObject([10, 11, 12, 13])

    const filter = fp.curry(fp.pipe(
      fp.filterL,
      takeAll
    ))

    expect(
      filter(a=>a%2, fp.range(4))
    ).toMatchObject([1, 3])
  })

  test('flatten, flattenL', ()=>{
    // ### yield * 이란?
    // yield * [iterable] 
    // =
    // for (const item of iterfalbe) yield item

    const NESTED = [[1,2], 3, 4, [5, 6], [7, 8, 9]]

    expect(
      fp.flatten(NESTED)
    ).toMatchObject([1, 2, 3, 4, 5, 6, 7, 8, 9])

    const DEEP_NESTED = [1, [2, [3, 4], [[5]]]]

    expect(
      fp.deepFlatten(DEEP_NESTED)
    ).toMatchObject([1, 2, 3, 4, 5])
  })

  test('flatMap, flatMapL', ()=>{
    const NESTED = [[1, 2], [3, 4], [5, 6, 7]]

    expect(
      NESTED.flatMap(a => a)
    ).toMatchObject([1, 2, 3, 4, 5, 6, 7])

    expect(
      NESTED.flatMap(a => a.map(a=>a*a))
    ).toMatchObject([1, 4, 9, 16, 25, 36, 49])
    
    // flat(map()) => 시간 복잡도는 같다(어차피 처음부터 끝까지 도니까),
    // 단지, 중간에 map으로 인해 nested된 어레이들을 생성하는데 메모리를 사용
    expect(
      fp.flatten(NESTED.map(a => a.map(a=>a*a)))
    ).toMatchObject([1, 4, 9, 16, 25, 36, 49])

    ///////////

    expect(
      fp.flatMap(fp.map(a => a*a), NESTED)
    ).toMatchObject([1, 4, 9, 16, 25, 36, 49])
  })

  test('2D array test', ()=>{
    const ARR = [
      [1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [9, 10]
    ]

    const predi1 = jest.fn(a => a%2)

    expect(
      fp.go(ARR,
        fp.flatten,
        fp.filter(predi1),
        fp.take(3)
      )
    ).toMatchObject([1, 3, 5])

    expect(predi1).toBeCalledTimes(10)

    const predi2 = jest.fn(a => a%2)

    expect(
      fp.go(ARR,
        fp.flattenL,
        fp.filterL(predi2),
        fp.take(3)
      )
    ).toMatchObject([1, 3, 5])

    expect(predi2).toBeCalledTimes(5)
  })

  test('실무 코드 Test', ()=>{
    // ## 지연성 / 이터러블 중심 프로그래밍 실무적인 코드
    const USERS = [
      {name: 'a', age: 21, family: [
        { name: 'a1', age: 53}, { name: 'a2', age: 47},
        { name: 'a3', age: 16}, { name: 'a4', age: 15},
      ]},
      {name: 'b', age: 24, family: [
        { name: 'b1', age: 58}, { name: 'b2', age: 51},
        { name: 'b3', age: 19}, { name: 'b4', age: 22},
      ]},
      {name: 'c', age: 31, family: [
        { name: 'c1', age: 64}, { name: 'c2', age: 62},
      ]},
      {name: 'd', age: 20, family: [
        { name: 'd1', age: 42}, { name: 'd2', age: 42},
        { name: 'd3', age: 11}, { name: 'd4', age: 7},
      ]},
    ]

    // 가족들 중에 20살보다 어린 사람들
    expect(
      fp.go(USERS,
        fp.mapL(user=>user.family),
        fp.flattenL,
        fp.filterL(fam => fam.age < 20),
        fp.take(Infinity)
      )
    ).toMatchObject([
      { name: 'a3', age: 16}, { name: 'a4', age: 15},
      { name: 'b3', age: 19},
      { name: 'd3', age: 11}, { name: 'd4', age: 7},
    ])

    // 가족들 중에 20살보다 어린 사람들중 3명까지의 이름
    expect(
      fp.go(USERS,
        fp.mapL(user=>user.family),
        fp.flattenL,
        fp.filterL(fam => fam.age < 20),
        fp.mapL(fam => fam.name),
        fp.take(3)
      )
    ).toMatchObject(['a3', 'a4', 'b3'])

    // 가족들 중에 20살보다 어른인 사람들의 나이의 합
    expect(
      fp.go(USERS,
        fp.flatMapL(user=>user.family),
        fp.filterL(fam => fam.age > 20),
        fp.mapL(fam => fam.age),
        fp.reduce((a,b)=>a+b)
      )
    ).toBe(441)
  })
})