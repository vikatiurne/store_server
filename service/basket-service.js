
const { Basket, BasketProdact, Prodact } = require("../models/models.js");

class BasketService {
  async getOne(basketId, userId) {
    let basket = await Basket.findOne({
      include: [
        { model: Prodact, attributes: ['id', 'name', 'price', 'img', 'sizes'] },
      ],
      attributes: ['id'],
      where: { id: basketId },
    });
    if (!basket) {
      basket = await Basket.create({ userId });
    }
    return basket;
  }

   async create(userId) {
    return await Basket.create({ userId });
  }

   async append(basketId, prodactId, qty, userId) {
    let basket = await Basket.findByPk(basketId, {
      attributes: ["id"],
      include: [
        { model: Prodact, attributes: ["id", "name", "price", "img", "sizes"] },
      ],
    });
    if (!basket) {
      basket = await Basket.create(userId);
    }
    const basketProdact = await BasketProdact.findOne({
      where: { basketId, prodactId },
    });
    if (basketProdact) {
      await basketProdact.increment("qty", { by: qty });
    } else {
      await BasketProdact.create({
        basketId: basketId,
        prodactId: prodactId,
        qty: qty,
      });
    }
    await basket.reload();
    return basket;
  }

   async increment(basketId, prodactId) {
    let basket = await Basket.findByPk(basketId, {
      include: [{ model: Prodact, as: "prodacts" }],
    });
    const basketProdact = await BasketProdact.findOne({
      where: { basketId, prodactId },
    });
    if (basketProdact) {
      await basketProdact.increment("qty", { by: 1 });
      await basket.reload();
    }
    return basket;
  }

   async decrement(basketId, prodactId, minOrder) {
    let basket = await Basket.findByPk(basketId, {
      include: [{ model: Prodact, as: "prodacts" }],
    });
    const basketProdact = await BasketProdact.findOne({
      where: { basketId, prodactId },
    });

    if (basketProdact.qty == minOrder) {
      await basketProdact.destroy({ where: { prodactId } });
    } else {
      await basketProdact.decrement("qty", { by: 1 });
    }
    await basket.reload();

    return basket;
  }

   async remove(basketId, prodactId, userId) {
    let basket = await Basket.findByPk(basketId, {
      include: [{ model: Prodact, as: "prodacts" }],
    });
    const basketProdact = await BasketProdact.findOne({
      where: { basketId, prodactId },
    });
    if (basketProdact) {
      await basketProdact.destroy();
      await basket.reload();
    }
    return basket;
  }

   async clear(basketId, userId = null) {
    let basket = await Basket.findByPk(basketId, {
      include: [{ model: Prodact, as: "prodacts" }],
    });
    if (!basket) {
      basket = await Basket.create({ userId });
    } else {
      await BasketProdact.destroy({ where: { basketId } });
      await basket.reload();
    }
    return basket;
  }

  // async delete() {
  //   let basket = await Basket.findOne({
  //     include: [{ model: Prodact, as: 'prodacts' }],
  //     where: { userId: null },
  //   });
  //   if (!basket) {
  //     throw new Error('Корзина не знайдена у БД');
  //   }
  //   await basket.destroy();
  //   return basket;
  // }
   async delete(basketId) {
    let basket = await Basket.findByPk(basketId, {
      include: [{ model: Prodact, as: "prodacts" }],
    });
    if (!basket) {
      throw new Error("Корзина не знайдена у БД");
    }
    await basket.destroy();
    return basket;
  }
};

module.exports = new BasketService()