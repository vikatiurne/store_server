const  Router = require('express');
const prodactController= require('../controllers/prodactController.js');
const checkRoleMiddleware = require('../middleware/CheckRoleMiddleware.js');

const router = new Router();

router.post('/', checkRoleMiddleware('ADMIN'), prodactController.create);
router.get('/', prodactController.getAll);
router.get('/:id', prodactController.getOne);
router.put('/:id/delete', prodactController.deleteProdact);
router.put('/:id/update', prodactController.updateProdact);

module.exports = router
