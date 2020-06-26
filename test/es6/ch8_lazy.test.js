import * as fp from '../../src/es6'
import 'babel-polyfill'

describe('CH8 Lazy Test1', ()=>{
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