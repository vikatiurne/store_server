const Router = require("express");
const userRouter = require("./userRouter");
const prodactRouter = require("./prodactRouter");
const categoryRouter = require("./categoryRouter");
const subcategoryRouter = require("./subcategoryRouter");
const ratingRouter = require("./ratingRouter");
const basketRouter = require("./basketRouter");
const orderRouter = require("./orderRouter");

const CorsMiddleware = require("../middleware/CorsMiddleware");

const router = new Router();
router.use("/user", CorsMiddleware, userRouter);
router.use("/prodact", CorsMiddleware, prodactRouter);
router.use("/category", CorsMiddleware, categoryRouter);
router.use("/subcategory", CorsMiddleware, subcategoryRouter);
router.use("/rating", CorsMiddleware, ratingRouter);
router.use("/basket", CorsMiddleware, basketRouter);
router.use("/order", CorsMiddleware, orderRouter);

module.exports = router;
