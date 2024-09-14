const Router = require("express");
const subcategoryController = require("../controllers/subcategoryController.js");
const checkRoleMiddleware = require("../middleware/CheckRoleMiddleware.js");

const router = new Router();

router.post("/", checkRoleMiddleware("ADMIN"), subcategoryController.create);
router.get("/", subcategoryController.getAll);
router.get("/getOne", subcategoryController.getOne);
router.put(
  "/:id/deleteSubcategory",
  checkRoleMiddleware("ADMIN"),
  subcategoryController.delete
);
router.put(
  "/:id/updateSubcategory",
  checkRoleMiddleware("ADMIN"),
  subcategoryController.update
);

module.exports = router
