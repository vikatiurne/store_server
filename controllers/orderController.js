const ApiError = require('../error/ApiError.js');
const {BasketProdact} = require('../models/models.js');
const basketService = require('../service/basket-service.js');
const orderService = require('../service/order-service.js');

class OrderController {
  async adminGetAll(req, res, next) {
    try {
      const { userId, page, limit, status } = req.query;
      const orders = await orderService.getAll(userId, page, limit, status);
      return res.json(orders);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async adminGetOrderUser(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) next(ApiError.badRequest('Користувач не знайден'));
      const orders = await orderService.getAll(id);
      return res.json(orders);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async adminGetOne(req, res, next) {
    const { id } = req.params;
    try {
      const order = await orderService.getOne(id);
      return res.json(order);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async changeStatus(req, res, next) {
    try {
      const { id } = req.params;
      const {status } = req.body;
      if (!id) next(ApiError.badRequest('Замовлення не знайдене у БД'));
      const updatedOrder = await orderService.update(id, status);
      return res.json(updatedOrder);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async create(req, res, next) {
    try {
      const {
        name,
        email,
        phone,
        address,
        items,
        comment,
        userId,
        readinessfor,
      } = req.body;
      const { basketId } = req.signedCookies;
      if (!basketId) next(ApiError.badRequest('Ваш кошик порожній'));
      const basket = await BasketProdact.findOne({
        where: { basketId: parseInt(basketId) },
      });
      if (basket.length === 0) next(ApiError.badRequest('Ваш кошик порожній'));

      const order = await orderService.create({
        name,
        email,
        phone,
        address,
        comment,
        items,
        userId,
        readinessfor,
      });
      await basketService.clear(basketId, userId);
      res.json(order);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async adminDelete(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) next(ApiError.badRequest('Не вказан id замовлення'));
      const order = await orderService.delete(id);
      return res.json(order);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async userGetAll(req, res, next) {
    try {
      const { id } = req.user;
      const { limit, page } = req.query;
      const orders = await orderService.getAll(id, page, limit);
      return res.json(orders);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async userGetOne(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const order = await orderService.getOne(id, userId);
      return res.json(order);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new OrderController()
