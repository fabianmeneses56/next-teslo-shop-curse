import { ISize } from './'

//esto es como luse el carrito de compras
export interface ICartProduct {
  _id: string
  image: string
  price: number
  size?: ISize
  slug: string
  title: string
  gender: 'men' | 'women' | 'kid' | 'unisex'
  quantity: number
}
