import * as fp from '../../src/es5/index'

describe('Collection test', ()=>{
  // 1. 수집하기 - map, values, pluck 등
  // 2. 거르기 - filter, reject, compact, without 등
  // 3. 찾아내기 - find, findIndex, some, every 등
  // 4. 접기 - reduce, min, max, groupBy, countBy

  const DATA1 = [
    {id: 10, name: 'flower', age: 31},
    {id: 20, name: 'geoji', age: 13},
    {id: 30, name: 'kim', age: 10},
    {id: 40, name: 'gyu', age: 20},
    {id: 50, name: 'jae', age: 30},
    {id: 60, name: 'gaji', age: 29},
    {id: 70, name: 'jung', age: 10},
    {id: 80, name: 'seon', age: 20},
    {id: 90, name: 'ju', age: 30}
  ]
  const DATA2 = {
    '10': {id: 10, name: 'flower', age: 31},
    '20': {id: 20, name: 'geoji', age: 13},
    '30': {id: 30, name: 'kim', age: 10},
    '40': {id: 40, name: 'gyu', age: 20},
    '50': {id: 50, name: 'jae', age: 30},
    '60': {id: 60, name: 'gaji', age: 29},
    '70': {id: 70, name: 'jung', age: 10},
    '80': {id: 80, name: 'seon', age: 20},
    '90': {id: 90, name: 'ju', age: 30}
  }

  test('수집하기 테스트', ()=>{
    // 1. 수집하기 - map, keys, values, pluck 등
    const map1 = fp._map(DATA1, (item)=>{
      return item.name
    })
    expect(map1).toMatchObject(['flower', 'geoji', 'kim', 'gyu', 'jae', 'gaji', 'jung', 'seon', 'ju'])

    const pairs = fp._pairs(DATA2)
    expect(pairs).toMatchObject([
      ['10', {id: 10, name: 'flower', age: 31}],
      ['20', {id: 20, name: 'geoji', age: 13}],
      ['30', {id: 30, name: 'kim', age: 10}],
      ['40', {id: 40, name: 'gyu', age: 20}],
      ['50', {id: 50, name: 'jae', age: 30}],
      ['60', {id: 60, name: 'gaji', age: 29}],
      ['70', {id: 70, name: 'jung', age: 10}],
      ['80', {id: 80, name: 'seon', age: 20}],
      ['90', {id: 90, name: 'ju', age: 30}]
    ])

    const keys1 = fp._keys(DATA1[0])
    expect(keys1).toMatchObject(['id', 'name', 'age'])
    const keys2 = fp._keys(DATA2)
    expect(keys2).toMatchObject(['10', '20', '30', '40', '50', '60', '70', '80', '90'])

    const values = fp._values(DATA1[0])
    expect(values).toMatchObject([10, 'flower', 31])

    const pluck = fp._pluck(DATA1, 'age')
    expect(pluck).toMatchObject([31, 13, 10, 20, 30, 29, 10, 20, 30])
  })

  test('거르기 테스트', ()=>{
    // 2. 거르기 - filter, reject, compact, without 등
    const filter = fp._filter(DATA1, (item)=>item.age > 30)
    expect(filter).toMatchObject([{id: 10, name: 'flower', age: 31}])

    const reject = fp._reject(DATA1, (item)=>item.age > 30)
    expect(reject).toMatchObject([
      {id: 20, name: 'geoji', age: 13},
      {id: 30, name: 'kim', age: 10},
      {id: 40, name: 'gyu', age: 20},
      {id: 50, name: 'jae', age: 30},
      {id: 60, name: 'gaji', age: 29},
      {id: 70, name: 'jung', age: 10},
      {id: 80, name: 'seon', age: 20},
      {id: 90, name: 'ju', age: 30}
    ])

    const compact = fp._compact([1, 2, 0, false, null, {}])
    expect(compact).toMatchObject([1, 2, {}])
  })

  test('찾아내기 테스트', ()=>{
    // 3. 찾아내기 - find, findIndex, some, every 등
    const find = fp._find(DATA1, (item)=>item.age===10)
    expect(find).toMatchObject({id: 30, name: 'kim', age: 10})

    const findIndex1 = fp._findIndex(DATA1, (item)=>item.age===10)
    expect(findIndex1).toBe(2)
    const findIndex2 = fp._findIndex(DATA1, (item)=>item.age===1111)
    expect(findIndex2).toBe(-1)

    const some1 = fp._some(DATA1, (item)=>item.age>29)
    expect(some1).toBe(true)
    const some2 = fp._some(DATA1, (item)=>item.age>40)
    expect(some2).toBe(false)
    const some3 = fp._some([1, undefined, 2, 0])
    expect(some3).toBe(true)
    const some4 = fp._some([null, undefined, 0, false])
    expect(some4).toBe(false)

    const every1 = fp._every(DATA1, (item)=>item.age>1)
    expect(every1).toBe(true)
    const every2 = fp._every(DATA1, (item)=>item.age>10)
    expect(every2).toBe(false)
    const every3 = fp._every([1, 2, 3, 4])
    expect(every3).toBe(true)
    const every4 = fp._every([1, undefined, 3, 4])
    expect(every4).toBe(false)
  })

  test('접기 테스트', ()=>{
     // 4. 접기 - reduce, min, max, groupBy, countBy
     const reduce = fp._reduce(DATA1, (prev, curr)=>{
      return prev+curr.age
    }, 0)
    expect(reduce).toBe(31+13+10+20+30+29+10+20+30)

    const min1 = fp._min([1, 2, 4, 10, -5, 0])
    expect(min1).toBe(-5)
    const min2 = fp._minBy(DATA1, (item)=>item.age)
    expect(min2).toMatchObject({id: 30, name: 'kim', age: 10})

    const max1 = fp._max([1, 2, 4, 10, -5, 0])
    expect(max1).toBe(10)
    const max2 = fp._maxBy(DATA1, (item)=>item.age)
    expect(max2).toMatchObject({id: 10, name: 'flower', age: 31})

    const groupBy = fp._groupBy(DATA1, (item)=>item.age)
    expect(groupBy).toMatchObject({
      '31': [{id: 10, name: 'flower', age: 31},],
      '13': [{id: 20, name: 'geoji', age: 13},],
      '10': [{id: 30, name: 'kim', age: 10},{id: 70, name: 'jung', age: 10},],
      '20': [{id: 40, name: 'gyu', age: 20},{id: 80, name: 'seon', age: 20},],
      '30': [{id: 50, name: 'jae', age: 30},{id: 90, name: 'ju', age: 30}],
      '29': [{id: 60, name: 'gaji', age: 29},],
    })

    const countBy = fp._countBy(DATA1, item=>item.age)
    expect(countBy).toMatchObject({
      '31': 1,
      '13': 1,
      '10': 2,
      '20': 2,
      '30': 2,
      '29': 1
    })
  })

  test('', ()=>{
    const test1 = fp._pipe(
      fp._filter(item=>item.age>10),
      fp._countBy(item=>{return item.age - item.age%10}),
      fp._map((item, key)=>`${key}대는 ${item}명 입니다.`),
      list => list.join('/')
    )
    expect(test1(DATA1)).toMatch('20대는 3명 입니다./30대는 3명 입니다.')

    const test2 = fp._go(DATA1,
      fp._reject(item=>item.age >= 30),
      test1,
    )
    expect(test2).toMatch('20대는 3명 입니다.')
  })
})