const Router = require("express");
const authMiddleware = require('../middleware/AuthMiddleware.js');
const checkRoleMiddleware = require('../middleware/CheckRoleMiddleware.js');
const orderController  = require('../controllers/orderController.js');

const router = new Router();

router.get(
  '/admin/getAll',
  authMiddleware,
  checkRoleMiddleware('ADMIN'),
  orderController.adminGetAll
);
router.get(
  '/admin/getAll/user/:id',
  authMiddleware,
  checkRoleMiddleware('ADMIN'),
  orderController.adminGetOrderUser
);
router.get(
  '/admin/getOne/:id',
  authMiddleware,
  checkRoleMiddleware('ADMIN'),
  orderController.adminGetOne
);

router.delete(
  '/admin/delete/:id',
  authMiddleware,
  checkRoleMiddleware('ADMIN'),
  orderController.adminDelete
);

router.put(
  '/admin/update/:id',
  authMiddleware,
  checkRoleMiddleware('ADMIN'),
  orderController.changeStatus
);

router.get('/user/getAll', authMiddleware, orderController.userGetAll);
router.get('/user/getOne/:id', authMiddleware, orderController.userGetOne);


router.post('/create', orderController.create);


module.exports = router
