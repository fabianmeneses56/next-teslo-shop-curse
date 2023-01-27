import { FC, useEffect, useReducer } from 'react'
import Cookie from 'js-cookie'

import { ICartProduct } from '../../interfaces'
import { CartContext, cartReducer } from './'

export interface CartState {
  cart: ICartProduct[]
  numberOfItems: number
  subTotal: number
  tax: number
  total: number
}
const CART_INITIAL_STATE: CartState = {
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0
}
export const CartProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE)

  // Efecto
  useEffect(() => {
    // se implementa try catch porque puede que la cookie de error
    try {
      const cookieProducts = Cookie.get('cart')
        ? JSON.parse(Cookie.get('cart')!)
        : []
      dispatch({
        type: '[Cart] - LoadCart from cookies | storage',
        payload: cookieProducts
      })
    } catch (error) {
      dispatch({
        type: '[Cart] - LoadCart from cookies | storage',
        payload: []
      })
    }
  }, [])

  useEffect(() => {
    state.cart.length > 0 && Cookie.set('cart', JSON.stringify(state.cart))
  }, [state.cart])

  useEffect(() => {
    const numberOfItems = state.cart.reduce(
      (prev, current) => current.quantity + prev,
      0
    )
    const subTotal = state.cart.reduce(
      (prev, current) => current.price * current.quantity + prev,
      0
    )
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0)

    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal * (taxRate + 1)
    }

    dispatch({ type: '[Cart] - Update order summary', payload: orderSummary })
  }, [state.cart])

  const addProductToCart = (product: ICartProduct) => {
    //! Nivel 1
    // dispatch({ type: '[Cart] - Add Product', payload: product });
    //! Nivel 2
    // const productsInCart = state.cart.filter( p => p._id !== product._id && p.size !== product.size );
    // dispatch({ type: '[Cart] - Add Product', payload: [...productsInCart, product] })
    //! Nivel Final
    const productInCart = state.cart.some(p => p._id === product._id) // verificar si existe ya existe el id en el carrito
    if (!productInCart)
      // si no esta lo agrega
      return dispatch({
        type: '[Cart] - Update products in cart',
        payload: [...state.cart, product]
      })
    // esta en el carro con esa talla y id
    const productInCartButDifferentSize = state.cart.some(
      p => p._id === product._id && p.size === product.size
    )
    if (!productInCartButDifferentSize)
      // si no existe se agrega al carrito
      return dispatch({
        type: '[Cart] - Update products in cart',
        payload: [...state.cart, product]
      })
    // Acumular
    const updatedProducts = state.cart.map(p => {
      if (p._id !== product._id) return p // este no es el que tengo que editar
      if (p.size !== product.size) return p // este no es el que tengo que editar porque es una talla diferente
      // Actualizar la cantidad
      p.quantity += product.quantity
      return p
    })
    dispatch({
      type: '[Cart] - Update products in cart',
      payload: updatedProducts
    })
  }

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - Change cart quantity', payload: product })
  }
  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - Remove product in cart', payload: product })
  }
  return (
    <CartContext.Provider
      value={{
        ...state,

        // Methods
        addProductToCart,
        removeCartProduct,
        updateCartQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  )
}