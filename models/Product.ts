import mongoose, { Schema, model, Model } from 'mongoose'
import { IProduct } from '../interfaces'

// unique: true hace que sea mas rapida la consulta por esa columna
//los enum son porque esas columnas ya estan definidad y solo pueden ser esas

const productSchema = new Schema(
  {
    description: { type: String, required: true },
    images: [{ type: String }],
    inStock: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    sizes: [
      {
        type: String,
        enum: {
          values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
          message: '{VALUE} no es un tamaño válido'
        }
      }
    ],
    slug: { type: String, required: true, unique: true },
    tags: [{ type: String }],
    title: { type: String, required: true },
    type: {
      type: String,
      enum: {
        values: ['shirts', 'pants', 'hoodies', 'hats'],
        message: '{VALUE} no es un tipo válido'
      }
    },
    gender: {
      type: String,
      enum: {
        values: ['men', 'women', 'kid', 'unisex'],
        message: '{VALUE} no es un genero válido'
      }
    }
  },
  {
    timestamps: true // esto hace que mongoose cree los create, update, etc automaticamente
  }
)

// esto crea un indice que conecta 2 campos
productSchema.index({ title: 'text', tags: 'text' })

// si ya existe el modelo Product que lo use, si no entonces se crea un nuevo modelo
const Product: Model<IProduct> =
  mongoose.models.Product || model('Product', productSchema)

export default Product
