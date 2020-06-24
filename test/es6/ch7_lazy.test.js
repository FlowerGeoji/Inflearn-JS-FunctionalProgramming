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

  test('Preformance test of range&rangeL', ()=>{
    const add = (a, b) => a+b

    const testPerf = (time, func) => {
      const start = Date.now()
      while(time--) {
        func()
      }
      const end = Date.now()

      return end-start
    }
    
    const rangeTime = testPerf(20, ()=>fp.reduce(add, fp.range(1000000)))
    const rangeLTime = testPerf(20, ()=>fp.reduce(add, fp.rangeL(1000000)))
    
    expect(rangeLTime-rangeTime).toBeGreaterThan(0)
  })
})