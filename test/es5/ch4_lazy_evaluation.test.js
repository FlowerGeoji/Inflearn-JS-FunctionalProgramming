import * as fp from '../../src/es5/index'
import * as _ from 'lodash/fp'

describe('Lazy-evaluation TEST', ()=>{
  // 지연 평가를 시작 시키고 유지 시키는(이어 가는) 함수
  // 1. map
  // 2. filter, reject
  // 끝을 내는 함수
  // 1. take
  // 2. some, every, find

  test('평가 유지 테스트', ()=>{
    const DATA1 = _.range(0, 100)

    // 지연평가 하지 않았을 때
    const mockFunc1 = jest.fn((val)=>val*val)
    const mockFunc2 = jest.fn((val)=>val%2)

    const go1 = fp._go(DATA1,
      fp._map(mockFunc1),
      fp._filter(mockFunc2),
      _.take(5)
    )

    expect(mockFunc1).toBeCalledTimes(100)
    expect(mockFunc2).toBeCalledTimes(100)

    // 지연평가 했을 때
    const mockFunc3 = jest.fn((val)=>val*val)
    const mockFunc4 = jest.fn((val)=>val%2)

    _.pipe(
      _.map(mockFunc3),
      _.filter(mockFunc4),
      _.take(5)
    )(DATA1)

    expect(mockFunc3).toBeCalledTimes(10)
    expect(mockFunc4).toBeCalledTimes(10)
  })

  test('평가 끝 테스트', ()=>{
    
  })
})