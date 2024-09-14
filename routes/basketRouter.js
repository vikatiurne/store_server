const Router = require("express");
const basketController = require("../controllers/basketController.js");

const router = new Router();

router.get("/getone", basketController.getOne);
router.put(
  "/prodact/:prodactId([0-9]+)/append/:id([0-9]+)",
  basketController.append
);
router.put(
  "/prodact/:prodactId([0-9]+)/increment/",
  basketController.increment
);
router.put(
  "/prodact/:prodactId([0-9]+)/decrement/:minOrder([0-9]+)",
  basketController.decrement
);
router.put("/prodact/:prodactId([0-9]+)/remove", basketController.remove);
router.put("/clear", basketController.clear);

module.exports = router;
