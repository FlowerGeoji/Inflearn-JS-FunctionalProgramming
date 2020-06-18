import * as fp from '../src/es5/index'

describe('Functional Programming', ()=>{
  /**
   * 함수형은 함수가 먼저
   * [1, 2, 3].map()  X
   * map([1, 2, 3])   O
   */
  const USERS = [
    {
      id: 1,
      name: 'flower',
      age: 31
    },
    {
      id: 2,
      name: 'geoji',
      age: 50
    },
    {
      id: 3,
      name: 'kim',
      age: 27
    },
    {
      id: 4,
      name: 'gyujae',
      age: 10
    },
  ]

  test('Test curry', ()=>{
    const curried = fp._each(console.log)
    expect(curried).toBeInstanceOf(Function)
    expect(curried([1, 2, 3, 4])).toBeInstanceOf(Array)

    expect(fp._each([], console.log)).toBeInstanceOf(Array)
  })

  const ARRAY = [1, 2, 3, 4]
  test('Test reduce', ()=>{
    const test = fp._reduce(ARRAY, (prev, curr)=>{
      return prev+curr
    }, 0)

    expect(test).toBe(10)
  })

  test('Test pipe', ()=>{
    const pipe = fp._pipe(
      (a)=>{return a+1},
      (b)=>{return b*2}
    )

    expect(pipe).toBeInstanceOf(Function)
    expect(pipe(1)).toBe(4)
  })

  test('Test go', ()=>{
    const go = fp._go(1,
      (a)=>{return a+1},
      (b)=>{return b*2}
    )

    expect(go).toBe(4)

    const test = fp._go(USERS,
      (users)=>fp._filter(users, user => user.age >= 30),
      (users)=>fp._map(users, fp._get('name'))
    )
  })

  test('순수함수', ()=>{

  })

  test('다형성', ()=>{
    const iter = jest.fn()
    expect(fp._each(undefined, iter)).toBe(undefined)
    expect(iter).toBeCalledTimes(0)
    expect(fp._each([1, 2, 3, 4], iter)).toMatchObject([1, 2, 3, 4])
    expect(iter).toBeCalledTimes(4)
    expect(fp._each({'key1': 'value1', 'key2': 2}, iter)).toMatchObject({'key1': 'value1', 'key2': 2})
    expect(iter).toBeCalledTimes(6)

    const mapper = jest.fn((item)=>item+item)
    expect(fp._map(undefined, mapper)).toHaveLength(0)
    expect(mapper).toBeCalledTimes(0)
    expect(fp._map([1, 2, 3, 4], mapper)).toMatchObject([2, 4, 6, 8])
    expect(mapper).toBeCalledTimes(4)
    expect(fp._map({'key1': 'value1', 'key2': 2}, mapper)).toMatchObject(['value1value1', 4])
    expect(mapper).toBeCalledTimes(6)

    expect(fp._go(undefined,
      fp._filter(item => item % 2),
      fp._map(item => item*item)
    )).toHaveLength(0)

    
  })

  test('입급함수', ()=>{

  })
})