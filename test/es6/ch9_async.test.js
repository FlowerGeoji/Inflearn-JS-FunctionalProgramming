import * as fp from '../../src/es6'

describe('', ()=>{
  // # Promise

  // ## 일급

  test('callback test', done=>{
    const add10 = (a, callback) => {
      setTimeout(()=>{
        callback(a+10)
        done()
      }, 100)
    }

    const value = add10(5, res=>{
      add10(res, res=>{
        add10(res, res=>{
          expect(res).toBe(35)
        })
      })
    })

    // 값이 존재하지 않음
    expect(value).toBe(undefined)
  })

  test('promise test', ()=>{
    // Promise와 callback은 어떻게 꺼내느냐(then)은 큰 차이가 아니다
    // 비동기작업을 일급으로 다룰수 있다는것(return Promise)이 가장 큰 차이다

    // Promise로 비동기 작업을 만들면 Promise(값)를 반환하는 함수를 작성하게 되고
    // => Promise는 값이므로 다른곳에 전달할 수 있다.
    // => Promise는 비동기 작업의 상태를 알 수 있는 값이다.
    // => Promise를 통해 추가적인 작업을 할 수있다.

    const add20 = a => new Promise(resolve=>{
      setTimeout(()=>{
        resolve(a+20)
      }, 100)
    })

    const value1 = add20(5)
    .then(add20)
    .then(add20)
    .then(res=>{
      expect(res).toBe(65)
      return res
    })

    // 값이 존재
    expect(value1).toBeInstanceOf(Promise)

    // Promise값을 통해 추가 작업 가능
    const value2 = value1.then(res=>{
      const end = res+10
      expect(end).toBe(75)
      return end
    })

    return value2
  })

  test('Promise값 활용(일급 활용)', ()=>{
    const delay100 = a => new Promise(resolve=>setTimeout(()=>resolve(a), 100))

    const go1 = (a, func) => a instanceof Promise ? a.then(func) : func(a)
    const add5 = a => a + 5

    const value1 = 10
    expect(
      go1(value1, add5)
    ).toBe(15)

    const value2 = delay100(10)
    return go1(value2, add5).then(res=>{
      expect(res).toBe(15)
    })
  })

  test('함수 합성에서의 Promise', ()=>{
    // 모나드 - 특정 상황에서 함수 합성을 안전하게 하기 위한 도구
    // 예1 - 값을 박스(모나드)로 감싸서 값이 존재하든 존재하지 않든 함수가 잘 동작할 수 있도록 함.
    // 예2 - Promise를 이용해서 비동기 상황에서도 함수들을 안전하게 합성할 수 있도록 함
    //
    // f * g
    // f(g(x))

    const g = a => a + 1
    const f = a => a * a

    // 불안정한 합성
    expect(f(g())).toBe(NaN)

    // Box(여기서는 Array)로 감쌌을때
    const fn1 = jest.fn(console.log)
    
    const a = [1]
    a.map(g).map(f).forEach(fn1)
    expect(fn1).toBeCalledTimes(1) // 값이 존재함으로 함수 호출

    const b = []
    b.map(g).map(f).forEach(fn1)
    expect(fn1).toBeCalledTimes(1) // 값이 존재하지 않아서 함수 호출 안함 => Safe

    // Promise에서 함수 합성
    // 값에의해 안전한 합성이 아니라, 비동기(대기발생)상황에서의 안전한 합성을 위해
    const fn2 = jest.fn(console.log)
    Promise.resolve(1).then(g).then(f).then(fn2)
    
    new Promise(resolve=>setTimeout(()=>resolve(2), 100))
    .then(g).then(f).then(fn2)
  })

  test('Kleisli composition(Kleisli arrow)', async ()=>{
    // 함수 합성 시,
    // x가 같으면 f(g(x)) = f(g(x)), 하지만 외부 요인에 의해서 x가 변하면 성립하지 않아서 안전하지 않음

    // Kleisli composition
    // 오류가 있을 수 있는 상황에서의 함수 합성을 안전하게 하는 규칙
    // g(x)가 오류라면, f(g(x))결과는 g(x)결과와 같아야 한다. (f(g(x)) = g(x))

    const USERS = [
      {id: 1, name: 'aa'},
      {id: 2, name: 'bb'},
      {id: 3, name: 'cc'},
    ]

    const f1 = ({name}) => name
    const g1 = id => fp.find(user=>user.id===id, USERS)
    const fg1 = id => f1(g1(id))

    expect(fg1(2)).toBe('bb')
    expect(fg1(2)===fg1(2)).toBeTruthy()

    // 외부 요인에 의해 상태가 변화
    USERS.pop()
    USERS.pop()

    // 에러 발생
    expect(()=>fg1(2)).toThrowError()
    expect(()=>fg1(2)===fg1(2)).toThrowError()

    ////////////////////////////////
    const f2 = jest.fn(({name}) => name)
    const g2 = jest.fn(id => fp.find(user=>user.id===id, USERS) || Promise.reject('없어요'))

    const fn = jest.fn(fp.identity)
    const fg2 = id => Promise.resolve(id).then(g2).then(f2).catch(fp.identity)

    const result = await fg2(2).then(fn)
    
    expect(result).toBe('없어요')
    expect(g2).toBeCalled()
    expect(f2).not.toBeCalled()
    // catch로 인해 '없어요'로 오류가 통일
    // id가 Promise.reject이면 g,f 실행 안됨
    // g 실패 시, f 실행 안됨
    // => 안전한 합성
  })
})