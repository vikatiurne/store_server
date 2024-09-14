const Router = require("express");
const ratingController = require("../controllers/ratingController.js");

const router = new Router();

router.post("/", ratingController.create);
router.get("/", ratingController.getRating);
router.get("/check", ratingController.check);

module.exports = router
