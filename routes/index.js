const Router = require("express");
const userRouter = require("./userRouter");
const prodactRouter = require("./prodactRouter");
const categoryRouter = require('./categoryRouter');
const subcategoryRouter = require('./subcategoryRouter');
const ratingRouter = require('./ratingRouter');
const basketRouter = require('./basketRouter');
const orderRouter = require('./orderRouter');

const router = new Router();
router.use("/user",  userRouter);
router.use("/prodact", prodactRouter);
router.use("/category", categoryRouter);
router.use("/subcategory", subcategoryRouter);
router.use("/rating", ratingRouter);
router.use("/basket", basketRouter);
router.use("/order", orderRouter);

module.exports = router;
