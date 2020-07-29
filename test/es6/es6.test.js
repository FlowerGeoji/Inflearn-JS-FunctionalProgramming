import 'babel-polyfill'

describe('', ()=>{
  test.skip('Iterable/Iterator test', ()=>{
    // - 이터러블 : 
    // - 이터레이터 : {value, done} 객체를 리턴하는 next() 를 가진 값
    // - 이터러블/이터레이터 프로토콜 : 이터러블을 for...of, 전개 연산자 등과 함께 동작하도록한 규약

    // 'Array --------------'
    const arr = [1, 2, 3];
    for (const item of arr) {
      console.log(item)  // 1  2  3
    }
    const arrIterator = arr[Symbol.iterator]();
    console.log(arrIterator.next());  // { value: 1, done: false }
    console.log(arrIterator.next());  // { value: 2, done: false }
    console.log(arrIterator.next());  // { value: 3, done: false }
    console.log(arrIterator.next());  // { value: undefined, done: true }

    // 'Set ----------------'
    const set = new Set([1, 2, 3]);
    const setIterator = set[Symbol.iterator]();
    for (const item of setIterator) { // We can use iterator in [for...of]
      console.log(item)  // 1  2  3
    }

    // 'Map ----------------'
    const map = new Map([[0, 1], [1, 2], [2, 3]])
    const mapIterator = map[Symbol.iterator]();
    mapIterator.next();               // next was already called once, 
    for (const item of mapIterator) { // only rest items called here
      console.log(item)  // [1,2]  [2,3]
    }
    console.log(mapIterator.next());  // {value: undefined, done: true}

    // 'Custom -------------'
    const iterable = {
      [Symbol.iterator]() {
        let i = 3;
        return {
          next() {
            return i===0 ? {done: true} : {value: i--, done: false};
          },
          [Symbol.iterator]() {
            return this;  // well made iterator
          }
        }
      }
    }

    for(const item of iterable){
      console.log(item);          // 3  2  1
    }

    const iterator = iterable[Symbol.iterator]();
    console.log(iterator.next()); // {value: 3, done: false}

    for(const item of iterator){
      // for...of는 'iterable'을 순회한다.
      // 즉, 여기서 iterator는 Iterator이면서 Iterable이다.(well made iterator)
      console.log(item);  // 2  1
    }
  })

  test.skip('Generator Test', ()=>{
    // - 제너레이터 : 이터레이터이자 이터러블을 생성하는 함수

    // 'Generator --------------'
    function *gen() {
      yield 1;
      if(false) yield 2;
      yield 3;
    }

    const iter = gen();
    
    console.log(iter[Symbol.iterator]() === iter);  // true
    
    for(const a of gen()) {
      console.log(a); // 1  3
    }

    // '*Infinity --------------'
    // 무한정 순회하는 iterator
    function *infinity(i = 0) {
      while(true) yield i++;
    }

    // '*Limit -----------------'
    // limit와 같아질 때 까지 순회하는 iterator
    function *limit(l, iter) {
      for (const a of iter) {
        yield a;
        if (a === l) return;
      }
    }

    // '*Odds ------------------'
    // l까지 홀수만 순회하는 iterator
    function *odds(l) {
      for (const a of limit(l, infinity(1))) {
        if (a % 2) yield a;
      }
    }

    for(const a of odds(10)){
      console.log(a); // 1  3  5  7  9
    }

    console.log([...odds(10), ...odds(20)]);  // [1, 3, ... ,9, 1, 3, ..., 17, 19]
    
    const [head, ...others] = odds(5);
    console.log(head);    // 1
    console.log(others);  // [3, 5]

    const [a, b, ...rest] = odds(10);
    console.log(a);       // 1
    console.log(b);       // 3
    console.log({rest});  // [5, 7, 9]
  })

  test('Arrow function TEST', ()=>{
    const func1 = function(){
      this.val = 'this1';
      this.method = function(){
        return this ? this.val : undefined;
      }
    }
    const func2 = function(){
      this.val = 'this2';
    }

    const FUNC1 = new func1();
    const FUNC2 = new func2();

    console.log(FUNC1.method());       // this1

    const method = FUNC1.method;
    console.log(method());             // undefined
    console.log(method.bind(FUNC2)()); // this2

    
    const arrow1 = () => {
      return this ? this.val : undefined;
    }
    console.log(arrow1.bind(FUNC2)());  // undefined

    const func3 = function(){
      this.val = 'this3';
      this.method = ()=>{
        return this ? this.val : undefined;
      }
    }

    const FUNC3 = new func3();
    console.log(FUNC3.method());
  })
})