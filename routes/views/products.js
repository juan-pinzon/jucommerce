const express = require("express");

const ProductsService = require("../../services/products");
const cacheResponse = require('../../utils/cacheResponse')
const { FIVE_MINUTES_IN_SECONDS } = require('../../utils/time')

const router = express.Router();
const productService = new ProductsService();

router.get("/", async function(req, res, next) {
	cacheResponse(res, FIVE_MINUTES_IN_SECONDS)
  const { tags } = req.query;
  try {
    const products = await productService.getProducts({ tags });
    res.render("products", { products });
  } catch (err) {
    next(err);
  }
});

module.exports = router;