describe('ch1 Functional Programming', () => {
  test('순수 함수1', ()=>{
    // add1은 순수 함수 이다. => 외부로부터 아무 영향을 주거나 받지 않는다.
    function add1(a, b) {
      return a+b;
    }
    expect(add1(2, 6)).toBe(8)

    // add2는 순수 함수가 아니다. - 외부로부터 영향을 받는다.
    // 외부 환경의 변화(c=20)로 인해, 같은 입력이지만 출력이 달라진다.
    var c = 10
    function add2(a, b) {
      return a+b+c;
    }
    expect(add2(2, 6)).toBe(18)
    c=20
    expect(add2(2, 6)).toBe(28)

    // add3는 순수 함수가 아니다. - 외부 환경에 영향을 준다(부수효과)
    // 부수 효과로 인해 외부환경(c)이 영향을 받는다.
    function add3(a, b) {
      c=b;
      return a+b;
    }
    expect(c).toBe(20)
    expect(add3(2, 6)).toBe(8)
    expect(c).toBe(6)
  })

  test('순수 함수2', ()=>{
    var obj1 = {val: 10};

    // add1은 순수 함수 이다. => 외부로부터 아무 영향을 주거나 받지 않는다.
    function add1(obj, b) {
      return {val: obj.val + b};
    }
    expect(add1(obj1, 10)).toMatchObject({val: 20})

    // add2는 순수 함수가 아니다. - 외부 환경에 영향을 준다(부수효과)
    // 부수 효과로 인해 외부환경(obj1)이 영향을 받는다.
    function add2(obj, b) {
      obj.val += b;
      return obj
    }
    expect(obj1.val).toBe(10)
    expect(add2(obj1, 10)).toMatchObject({val: 20})
    expect(obj1.val).toBe(20)
  })

  test('일급 함수1', ()=>{
    // addMaker는 일급함수이고,
    // addMaker와 addMaker가 리턴하는 함수는 순수 함수이다.
    function addMaker(a) {
      return function(b) {
        return a+b;
      }
    }

    var add10 = addMaker(10)
    var add5 = addMaker(5)

    expect(add10).toBeInstanceOf(Function)
    expect(add5).toBeInstanceOf(Function)

    expect(add10(20)).toBe(30)
    expect(add5(20)).toBe(25)
  })

  test('일급함수2', ()=>{
    // 일급합수 개념과, 순수함수 개념의 조합
    function f4(f1, f2, f3) {
      return f3(f1() + f2());
    }

    const test = f4(
      function() { return 2; },
      function() { return 1; },
      function(a, b) { return a*b; },
    )
    expect(test).toBe(2)
  })
})