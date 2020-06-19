import 'babel-polyfill'

describe('', ()=>{
  

  test('Iterable/Iterator test', ()=>{
    // - 이터러블 : 이터레이터를 리턴하는 `[Symbol.iterator]()` 를 가진 값
    // - 이터레이터 : {value, done} 객체를 리턴하는 next() 를 가진 값
    // - 이터러블/이터레이터 프로토콜 : 이터러블을 for...of, 전개 연산자 등과 함께 동작하도록한 규약

    // console.log('Arr --------------')
    // const arr = [1, 2, 3]
    // for (const a of arr) console.log(a)

    // console.log('Set --------------')
    // const set = new Set([1, 2, 3])
    // for (const a of set) console.log(a)
    // console.log(set[Symbol.iterator])

    // console.log('Map --------------')
    // const map = new Map([[0, 1], [1, 2], [2, 3]])
    // for (const a of map) console.log(a)
    // console.log(map[Symbol.iterator]())

    // console.log('Custom --------------')
    // const iterable = {
    //   [Symbol.iterator]() {
    //     let i = 3
    //     return {
    //       next() {
    //         return i===0 ? {done: true} : {value: i--, done: false}
    //       },
    //       [Symbol.iterator]() {
    //         return this
    //       }
    //     }
    //   }
    // }
    // for(const a of iterable) console.log(a)
    // const iterator = iterable[Symbol.iterator]()
    // iterator.next()
    // for(const a of iterator) console.log(a)
  })

  test('Generator Test', ()=>{
    // - 제너레이터 : 이터레이터이자 이터러블을 생성하는 함수

    // console.log('Gen --------------')
    // function *gen() {
    //   yield 1
    //   if(false) yield 2
    //   yield 3
    // }
    // const iter = gen()
    // console.log(iter[Symbol.iterator]() === iter)
    // for(const a of gen()) console.log(a)

    // console.log('*Infinity --------------')
    // function *infinity(i = 0) {
    //   while(true) yield i++
    // }

    // console.log('*Limit --------------')
    // function *limit(l, iter) {
    //   for (const a of iter) {
    //     yield a;
    //     if (a === l) return
    //   }
    // }

    // console.log('*Odds --------------')
    // function *odds(l) {
    //   for (const a of limit(l, infinity(1))) {
    //     if (a % 2) yield a
    //   }
    // }
    // for(const a of odds(10)) console.log(a)
    // console.log([...odds(10), ...odds(20)])
    
    // const [head, ...others] = odds(5)
    // console.log(head)
    // console.log({others})

    // const [a, b, ...rest] = odds(10)
    // console.log(a)
    // console.log(b)
    // console.log({rest})
  })
})