import 'babel-polyfill'
import _ from 'underscore'

describe('ch7 async', ()=>{
  test('callback, promise', async ()=>{
    const square = (a) => {
      return new Promise((resolve)=>{
        setTimeout(()=>{
          resolve(a*a)
        }, 500)
      })
    }
    
    // then으로 인해 다형성이 부족하가
    const test1 = await square(10)
    .then(square)
    .then(square)
    
    expect(test1).toBe(100000000)
    
    // 함수형으로 처리할 수 있으면,
    // 비동기(Promise) 또는 즉시 평가되는 함수를 pipelining 할 수 있다.

    const squareNow = (a) => a*a

    // TODO: async pipe lining test 추가하기
    
    // const flowAsync = (...fns) => _.flow(
    //   _.map(fn=>(...args) => Promise.resolve(...args).then(fn), fns)
    // )

    // const test2 = await R.pipe(
    //   square,
    //   square,
    //   square,
    // )(10)

    // expect(test2).toBe(100000000)

    // const test3 = await _.flow(
    //   square,
    //   squareNow,
    //   square
    // )(10)

    // expect(test3).toBe(100000000)
  })

  test('async 다형성', async ()=>{
    const square = (a) => {
      return new Promise((resolve)=>{
        setTimeout(()=>{
          resolve(a*a)
        }, 500)
      })
    }

    const squareList = list => new Promise(resolve=>{
      (function recur(res){
        if (res.length === list.length) resolve(res)
        square(list[res.length]).then(result=>{
          res.push(result)
          recur(res)
        })
      })([])
    })

    const test1 = await squareList([2, 3, 4])
    expect(test1).toMatchObject([4, 9, 16])
  })
})