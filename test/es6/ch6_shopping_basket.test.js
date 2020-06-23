import * as fp from '../../src/es6'
import 'babel-polyfill'

describe('장바구니 예제', ()=>{
  const PRODUCTS_ARR = [
    {name: '반팔티', price: 15000, quantity: 1, isSelected: true},
    {name: '긴팔티', price: 20000, quantity: 2, isSelected: false},
    {name: '핸드폰케이스', price: 15000, quantity: 3, isSelected: true},
    {name: '후드티', price: 30000, quantity: 4, isSelected: false},
    {name: '바지', price: 25000, quantity: 5, isSelected: false},
  ]
  const PRODUCTS_OBJ = {
    '10': {name: '반팔티', price: 15000, quantity: 1, isSelected: true},
    '20': {name: '긴팔티', price: 20000, quantity: 2, isSelected: false},
    '30': {name: '핸드폰케이스', price: 15000, quantity: 3, isSelected: true},
    '40': {name: '후드티', price: 30000, quantity: 4, isSelected: false},
    '50': {name: '바지', price: 25000, quantity: 5, isSelected: false},
  }

  test('Total quantity, price', ()=>{
    const add = (a, b) => a+b

    // 총 수량 뽑기
    const calTotalQuantity1 = fp.pipe(
      fp.map(product=>product.quantity),
      fp.reduce(add)
    )
    expect(calTotalQuantity1(PRODUCTS_ARR)).toBe(15)

    // 합산 금액
    const calTotalPrice1 = fp.pipe(
      fp.map(product=>product.quantity*product.price),
      fp.reduce(add)
    )
    expect(calTotalPrice1(PRODUCTS_ARR)).toBe(345000)

    // 코드 병합
    const sum = fp.curry((func, iter) => fp.go(iter,
      fp.map(func),
      fp.reduce(add)
    ))
    
    const calTotalQuantity2 = sum(item=>item.quantity)
    expect(calTotalQuantity2(PRODUCTS_OBJ)).toBe(15)
    
    const calTotalPrice2 = sum(item=>item.quantity*item.price)
    expect(calTotalPrice2(PRODUCTS_OBJ)).toBe(345000)

    const mapTableRows = fp.map((product)=>{
      let row = ''

      row+='<tr>'
      row+=`<td>${product.name}</td>`
      row+=`<td>${product.price}</td>`
      row+=`<td>${product.quantity}</td>`
      row+=`<td>${product.price*product.quantity}</td>`
      row+='</tr>'
      
      return row
    })
    expect(mapTableRows(PRODUCTS_ARR)).toMatchObject([
      "<tr><td>반팔티</td><td>15000</td><td>1</td><td>15000</td></tr>",
      "<tr><td>긴팔티</td><td>20000</td><td>2</td><td>40000</td></tr>",
      "<tr><td>핸드폰케이스</td><td>15000</td><td>3</td><td>45000</td></tr>",
      "<tr><td>후드티</td><td>30000</td><td>4</td><td>120000</td></tr>",
      "<tr><td>바지</td><td>25000</td><td>5</td><td>125000</td></tr>"
    ])

    const TABLE_ROWS_STRING = '<tr><td>반팔티</td><td>15000</td><td>1</td><td>15000</td></tr><tr><td>긴팔티</td><td>20000</td><td>2</td><td>40000</td></tr><tr><td>핸드폰케이스</td><td>15000</td><td>3</td><td>45000</td></tr><tr><td>후드티</td><td>30000</td><td>4</td><td>120000</td></tr><tr><td>바지</td><td>25000</td><td>5</td><td>125000</td></tr>'
    
    const makeTableRows = fp.pipe(
      mapTableRows,
      fp.reduce(add)
    )
    expect(makeTableRows(PRODUCTS_ARR)).toMatch(TABLE_ROWS_STRING)

    const makeTableRows2 = sum(product=>{
      let row = ''

      row+='<tr>'
      row+=`<td>${product.name}</td>`
      row+=`<td>${product.price}</td>`
      row+=`<td>${product.quantity}</td>`
      row+=`<td>${product.price*product.quantity}</td>`
      row+='</tr>'
      
      return row
    })
    expect(makeTableRows2(PRODUCTS_OBJ)).toMatch(TABLE_ROWS_STRING)

    const makeTableSum = (products) => {
      let sum = ''
      
      sum+='<tr>'
      sum+='<td colspan="2">합계</td>'
      sum+=`<td>${calTotalQuantity2(fp.filter(p=>p.isSelected, products))}</td>`
      sum+=`<td>${calTotalPrice2(fp.filter(p=>p.isSelected, products))}</td>`
      sum+='</tr>'

      return sum
    }
    expect(makeTableSum(PRODUCTS_OBJ)).toMatch('<tr><td colspan="2">합계</td><td>4</td><td>60000</td></tr>')
    
  })
})