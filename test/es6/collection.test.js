import * as fp from '../../src/es6'
import 'babel-polyfill'

describe('', ()=>{
  const DATA1 = [
    {name: '반팔티', price: 10000},
    {name: '긴팔티', price: 20000},
    {name: '핸드폰케이스', price: 15000},
    {name: '후드티', price: 30000},
    {name: '바지', price: 25000},
  ]
  const DATA2 = {
    '10': {name: '반팔티', price: 10000},
    '20': {name: '긴팔티', price: 20000},
    '30': {name: '핸드폰케이스', price: 15000},
    '40': {name: '후드티', price: 30000},
    '50': {name: '바지', price: 25000},
  }

  test('', ()=>{
    expect(
      fp.map((item)=>item.price, DATA1)
    ).toMatchObject([10000, 20000, 15000, 30000, 25000])

    expect(
      fp.map((item)=>item.name, DATA1)
    ).toMatchObject(['반팔티','긴팔티','핸드폰케이스','후드티','바지'])

    expect(
      fp.filter((item)=>item.price < 20000, DATA1)
    ).toMatchObject([{name: '반팔티', price: 10000}, {name: '핸드폰케이스', price: 15000}])

    expect(
      fp.filter((item)=>item.price >= 20000, DATA1)
    ).toMatchObject([{name: '긴팔티', price: 20000},{name: '후드티', price: 30000},{name: '바지', price: 25000}])

    expect(
      fp.reduce((prev, curr)=>prev+curr.price, 0, DATA1)
    ).toBe(100000)

    // 다형성
    expect(
      fp.reduce((prev, curr)=>({
        name: prev.name,
        price: prev.price+curr.price
      }), DATA1)
    ).toMatchObject({name: '반팔티', price: 100000})

    // 다형성
    function *gen() {
      yield 2
      yield 3
      yield 4
    }
    expect(
      fp.map(item=>item*item, gen())
    ).toMatchObject([4, 9, 16])

    // 다형성2
    const mapData = new Map()
    mapData.set('a', 10)
    mapData.set('b', 20)
    expect(
      fp.map(([key, val])=>[key, val*2], mapData)
    ).toMatchObject([['a', 20], ['b', 40]])

    expect(
      fp.map(item=>item.price, DATA2)
    ).toMatchObject([10000, 20000, 15000, 30000, 25000])
  })

  test('Evaluation test', ()=>{
    expect(
      fp.reduce(
        (prev, curr)=>prev+curr,
        fp.map(
          item => item.price,
          fp.filter(item => item.price < 20000, DATA1)
        )
      )
    ).toBe(25000)

    expect(
      fp.reduce(
        (prev, curr)=>prev+curr,
        fp.filter(
          item => item < 20000,
          fp.map(item => item.price, DATA1)
        )
      )
    ).toBe(25000)

    expect(
      fp.go(DATA1,
        (datas) => fp.filter((item=>item.price < 20000), datas),
        (datas) => fp.map((item=>item.price), datas),
        (datas) => fp.reduce((prev, curr)=>prev+curr, datas)
      )
    ).toBe(25000)

    expect(
      fp.pipe(
        (datas) => fp.filter((item=>item.price < 20000), datas),
        (datas) => fp.map((item=>item.price), datas),
        (datas) => fp.reduce((prev, curr)=>prev+curr, datas)
      )(DATA1)
    ).toBe(25000)

    expect(
      fp.pipe(
        (arr, obj) => [...fp.map(item=>item.price, arr), ...fp.map(item=>item.price, obj)],
        (datas) => fp.filter((item=>item < 20000), datas),
        (datas) => fp.reduce((prev, curr)=>prev+curr, datas)
      )(DATA1, DATA2)
    ).toBe(50000)

    // curry test
    const mult = fp.curry((a, b)=> a*b)
    expect(mult).toBeInstanceOf(Function)
    expect(mult(1)).toBeInstanceOf(Function)
    expect(mult(2,5)).toBe(10)
    expect(mult(2)(5)).toBe(10)

    expect(
      fp.go(DATA1,
        fp.filter((item=>item.price < 20000)),
        fp.map((item=>item.price)),
        fp.reduce((prev, curr)=>prev+curr)
      )
    ).toBe(25000)

    expect(
      fp.pipe(
        fp.filter((item=>item.price < 20000)),
        fp.map((item=>item.price)),
        fp.reduce((prev, curr)=>prev+curr)
      )(DATA1)
    ).toBe(25000)

    const totalPrice = fp.pipe(
      fp.map((item=>item.price)),
      fp.reduce((prev, curr)=>prev+curr)
    )

    expect(
      fp.go(DATA1,
        fp.filter((item=>item.price < 20000)),
        totalPrice
      )
    ).toBe(25000)

    expect(
      fp.pipe(
        fp.filter((item=>item.price < 20000)),
        totalPrice
      )(DATA1)
    ).toBe(25000)
  })
})