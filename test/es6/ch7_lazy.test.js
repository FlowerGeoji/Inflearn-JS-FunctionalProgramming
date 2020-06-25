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
     */
  })
})