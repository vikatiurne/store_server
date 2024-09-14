const Router = require("express");
const {body} = require("express-validator");

const userController = require("../controllers/userController.js");
const googleAuthController = require("../controllers/googleAuthController.js");
const checkRoleMiddleware = require("../middleware/CheckRoleMiddleware.js");

const router = new Router();

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
  userController.registration
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.get("/refresh", userController.refresh);
router.get("/user", checkRoleMiddleware("user"), userController.getUser);
router.get("/users", checkRoleMiddleware("ADMIN"), userController.getAllUsers);
router.put(
  "/user/:id/update",
  checkRoleMiddleware("user"),
  userController.updateUser
);

router.put("/forgot-password", userController.forgotPassword);
router.put("/reset-password", userController.resetPassword);

router.get("/auth/google/url", (req, res) => {
  return res.send(googleAuthController.getGoogleOAuthUrl());
});
router.get("/auth/google", googleAuthController.getGoogleUser);
router.get("/auth/me", googleAuthController.getCurentGoogleUser);

module.exports = router;
