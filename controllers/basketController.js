const ApiError = require("../error/ApiError.js");
const basketService = require("../service/basket-service.js");

const maxAge = 60 * 60 * 1000 * 24 * 365;
const signed = true;

class BasketController {
  async getOne(req, res, next) {
    const { userId } = req.query;
    console.log(req.query)
    try {
      let basket;
      if (req.signedCookies.basketId) {
        basket = await basketService.getOne(
          parseInt(req.signedCookies.basketId),
          userId
        );
      } else {
        basket = await basketService.create(userId);
        res.cookie("basketId", basket.id, {
          maxAge,
          signed,
          secure: true,
          sameSite: "none",
        });
      }
      return res.json(basket);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async append(req, res, next) {
    try {
      let basketId, basket;
      if (!req.signedCookies.basketId) {
        const { userId } = req.body.params;
        basket = await basketService.create(userId);
        basketId = basket.id;
        res.cookie("basketId", basket.id, {
          maxAge,
          signed,
          secure: true,
          sameSite: "none",
        });
      } else {
        basketId = parseInt(req.signedCookies.basketId);
      }
      const { prodactId } = req.params;
      const { qty,userId } = req.body.params;
      basket = await basketService.append(basketId, prodactId, qty, userId);
      return res.json(basket);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async increment(req, res, next) {
    try {
      const { prodactId } = req.params;
      let basketId = parseInt(req.signedCookies.basketId);
      const basket = await basketService.increment(basketId, prodactId);
      res.cookie("basketId", basket.id, {
        maxAge,
        signed,
        secure: true,
        sameSite: "none",
      });
      return res.json(basket);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async decrement(req, res, next) {
    try {
      let basketId = parseInt(req.signedCookies.basketId);
      const { prodactId, minOrder } = req.params;
      const basket = await basketService.decrement(
        basketId,
        prodactId,
        minOrder
      );
      res.cookie("basketId", basket.id, {
        maxAge,
        signed,
        secure: true,
        sameSite: "none",
      });
      return res.json(basket);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async remove(req, res, next) {
    try {
      let basketId, basket;
      if (!req.signedCookies.basketId) {
        const { userId } = req.query;
        basket = await basketService.create(userId);
        basketId = basket.id;
        res.cookie("basketId", basket.id, {
          maxAge,
          signed,
          secure: true,
          sameSite: "none",
        });
      } else {
        basketId = parseInt(req.signedCookies.basketId);
      }
      const { prodactId } = req.params;
      basket = await basketService.remove(basketId, prodactId);

      return res.json(basket);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async clear(req, res, next) {
    try {
      let basketId, basket;
      if (!req.signedCookies.basketId) {
        const { userId } = req.query;
        basket = await basketService.create(userId);
        basketId = basket.id;
        res.cookie("basketId", basketId, {
          maxAge,
          signed,
          secure: true,
          sameSite: "none",
        });
      } else {
        basketId = parseInt(req.signedCookies.basketId);
      }
      basket = await basketService.clear(basketId);

      return res.json(basket);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new BasketController();
