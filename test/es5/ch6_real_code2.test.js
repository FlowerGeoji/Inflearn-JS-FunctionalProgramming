import * as _ from 'lodash/fp'

describe('ch6 real code 2', ()=>{
  const PRODUCTS = [
    {
      isSelected: true,
      name: '반팔티',
      price: 10000,
      sizes: [
        {name: 'L', quantity: 2, price: 0},
        {name: 'XL', quantity: 3, price: 0},
        {name: '2XL', quantity: 2, price: 2000},
      ]
    },
    {
      isSelected: true,
      name: '후드티',
      price: 21000,
      sizes: [
        {name: 'L', quantity: 3, price: -1000},
        {name: '2XL', quantity: 1, price: 2000},
      ]
    },
    {
      isSelected: false,
      name: '맨부맨',
      price: 16000,
      sizes: [
        {name: 'L', quantity: 4, price: 0}
      ]
    },
  ]

  test('shopping basket test', ()=>{
    // 1. 모든 수량
    const totalQuantity = _.reduce((total, product)=>{
      return _.reduce((subtotal, size)=>subtotal+size.quantity, total, product.sizes)
    }, 0)
    expect(totalQuantity(PRODUCTS)).toBe(15)

    // 2. 선택된 총 수량
    const selectedQuantity = _.flow(
      _.filter('isSelected'),
      totalQuantity
    )
    expect(selectedQuantity(PRODUCTS)).toBe(11)

    // 3. 모든 가격
    const totalPrice = _.reduce((total, product)=>{
      return _.reduce((subtotal, size)=>{
        return subtotal+(product.price+size.price)*size.quantity
      }, total, product.sizes)
    }, 0)
    expect(totalPrice(PRODUCTS)).toBe(221000)

    // 4. 선택 된 총 가격
    const selectedPrice = _.flow(
      _.filter('isSelected'),
      totalPrice
    )
    expect(selectedPrice(PRODUCTS)).toBe(221000-64000)
  })
})