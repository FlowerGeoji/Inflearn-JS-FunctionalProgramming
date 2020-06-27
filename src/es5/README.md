# ES5 함수형 프로그래밍

## 함수형 프로그래밍 요약

1. 함수를 되도록 **작게** 만들기
2. **다형성** 높은 함수 만들기
3. **상태**를 변경하지 않거나, **정확히** 다루어 **부수 효과를 최소화** 하기
4. 동일한 인자를 받으면 항상 동일한 결과를 리턴하는 **순수 함수** 만들기
5. 복잡한 객체 하나를 인자로 사용하기보다 되도록 **일반적인 값** 여러 개를 **인자**로 사용하기
6. 큰 **로직**을 **고차 함수**로 만들고 세부 로직을 **보조 함수**로 완성하기
7. 어느곳에서든 **바로 혹은 미뤄서 실행**할 수 있도록 일반 함수이자 순수 함수로 선언하기
8. 모델이나 컬렉션 등의 커스텀 객체보다는 **기본 객체**를 이용하기
9. 로직의 흐름을 최대한 **단방향으로 흐르게**하기
10. 작음 함수를 **조합**하여 큰 함수 만들기

## 함수형 프로그래밍의 중요성

### Functional paradigm (Clojure, Elixir)

> Clojure

```clojure
(defn -main []
  (prinln
    (map (fn [user] (:name user))
      (filter (fn [user] (< (:age user) 30)) users)))
```

> Elixir

```elixir
Console.log(
  Enum.map(
    Enum.filter(users, fn user -> user.age > 30 end),
    fn user -> user.name end
  )
)

users
  |> Enum.filter(&(&1.age > 30)),
  |> Enum.map(&(&1.name))
  |> Console.log
```

> Javascript

```javscript
console.log(
  _map(user => user.age)
    (_filter(user => user.age < 30)(users))
)
```

### 지연평가 & 병렬성 & 동시성

- 순수함수는 어느 순서 평가되어도 상관없다 => 지연 평가 가능
- 순수함수는 어느 시점에 평가되어도 상관없다 => 병렬처리 가능
- 순수함수는 side effect가 없다 => 동시에 여러 함수 실행 가능

### 비동기 I/O NodeJS

- chapter 7에서 추가
