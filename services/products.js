const productMocks = require('../utils/mocks/products')
const MongoLib = require('../lib/mongo')

class ProductsService {
	constructor(){
		this.collection = 'products'
		this.mongoLib = new MongoLib()
	}

	async getProducts({ tags }) {
		const query = tags && { tags: { $in: tags } }
		const products = await this.mongoLib.getAll(this.collection, query)

		return 	products || []
	}

	async getProduct({ productId }) {
    const product = await this.mongoLib.get(this.collection, productId);
    return product || {};
  }

  async createProduct({ product }) {
    const createProductId = await this.mongoLib.create(this.collection, product);

    return createProductId;
  }

  async updateProduct({ productId, product }) {
    const updateProductId = await this.mongoLib.update(
      this.collection,
      productId,
      product
    );

    return updateProductId;
  }

  async deleteProduct({ productId }) {
    const deletedProductId = await this.mongoLib.delete(
      this.collection,
      productId
    );

    return deletedProductId;
  }

}

module.exports = ProductsService