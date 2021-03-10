const express = require('express')
const passport = require('passport')

const router = express.Router()

const ProductService = require('../../services/products')
const { JwtStrategy } = require('../../utils/auth/strategies/jwt')
const {
  validationHandler: validation,
} = require('../../utils/middlewares/validationHandler')
const {
  productIdSchema,
  productTagSchema,
  createProductSchema,
  updateProductSchema,
} = require('../../utils/schemas/products')
const cacheResponse = require('../../utils/cacheResponse')
const {
  FIVE_MINUTES_IN_SECONDS,
  SIXTY_MINUTES_IN_SECONDS,
} = require('../../utils/time')

passport.use(JwtStrategy)

const productService = new ProductService()

router.get(
  '/',
  validation({ tags: productTagSchema }, 'query'),
  async function (req, res, next) {
    cacheResponse(res, FIVE_MINUTES_IN_SECONDS)
    const { tags } = req.query
    try {
      const products = await productService.getProducts({ tags })
      res.status(200).json({
        data: products,
        message: 'products',
      })
    } catch (error) {
      next(error)
    }
  }
)

router.get('/:productId', async function (req, res, next) {
  cacheResponse(res, SIXTY_MINUTES_IN_SECONDS)
  const { productId } = req.params
  try {
    const product = await productService.getProduct({ productId })
    res.status(200).json({
      data: product,
      message: 'product retrivied',
    })
  } catch (error) {
    next(error)
  }
})

router.post(
  '/',
  validation(createProductSchema),
  async function (req, res, next) {
    // Esta ruta debería considerar el cuerpo de la petición, al ser POST se espera data proveniente de un formulario para ingresarla en la base de datos
    try {
      const { body: product } = req
      const createdProduct = await productService.createProduct({ product })
      res.status(201).json({
        data: createdProduct,
        message: 'product created',
      })
    } catch (error) {
      next(error)
    }
  }
)

router.patch(
  '/:productId',
  passport.authenticate('jwt', { session: false }),
  validation({ productId: productIdSchema }, 'params'),
  validation(updateProductSchema),
  async function (req, res, next) {
    // Esta ruta se le ha declarado como PATCH, la intensión es que modifique parte del contenirdo del recurso, y si no lo encuentra mande un error 404. Es decir, no es la intensión mandar toda la data para crearlo si no existe (PUT)
    try {
      const { productId } = req.params
      const { body: product } = req
      const updatedProductId = await productService.updateProduct({
        productId,
        product,
      })

      res.status(200).json({
        data: updatedProductId,
        message: 'product updated',
      })
    } catch (error) {
      next(error)
    }
  }
)

router.delete('/:productId', async function (req, res, next) {
  try {
    const { productId } = req.params
    const deletedProductId = await productService.deleteProduct({ productId })

    res.status(200).json({
      data: deletedProductId,
      message: 'product deleted',
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
