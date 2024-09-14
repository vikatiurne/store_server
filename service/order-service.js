const { Order, OrderItem } = require("../models/models.js");
const mailService = require("./mail-service.js");

module.exports = class OrderService {
  static async getAll(userId, page, limit, status) {
    page = page || 1;
    limit = limit || 8;
    let offset = (page - 1) * limit;

    const queries = {
      offset,
      limit,
      subQuery: false,
    };

    queries.order = [["id", "DESC"]];

    let orders;
    userId
      ? (orders = await Order.findAndCountAll({
          where: { userId },
          ...queries,
          include: [
            {
              model: OrderItem,
              as: "items",
              attributes: ["name", "price", "qty"],
              separate: true,
            },
          ],
          distinct: true,
        }))
      : !!status
      ? (orders = await Order.findAndCountAll({
          where: { status },
          ...queries,
          include: [
            {
              model: OrderItem,
              as: "items",
              attributes: ["name", "price", "qty"],
              separate: true,
            },
          ],
          distinct: true,
        }))
      : (orders = await Order.findAndCountAll({
          ...queries,
          include: [
            {
              model: OrderItem,
              as: "items",
              attributes: ["name", "price", "qty"],
              separate: true,
            },
          ],
          distinct: true,
        }));
    return orders;
  }

  static async getOne(id, userId = null) {
    let order;
    if (userId) {
      order = await Order.findOne({
        where: { id, userId },
        include: [
          {
            model: OrderItem,
            as: "items",
            attributes: ["name", "price", "qty"],
          },
        ],
      });
    } else {
      order = await Order.findByPk(id, {
        include: {
          model: OrderItem,
          as: "items",
          attributes: ["name", "price", "qty"],
        },
      });
    }
    if (!order) throw new Error("Замовлення не знайдене у Базі даних");
    return order;
  }

  static async create(data) {
    const {
      name,
      email,
      phone,
      address,
      comment,
      items,
      userId = null,
      readinessfor,
    } = data;
    const amount = Math.round(
      items
        .map(
          (item) =>
            item.basket_prodact.qty * (item.price / parseInt(item.sizes[0]))
        )
        .reduce((acc, val) => acc + val, 0)
    );

    const order = await Order.create({
      name,
      email,
      phone,
      address,
      comment,
      amount,
      userId,
      readinessfor,
    });
    const date = new Date();
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    const orderNum = `${yyyy}-${mm}-${dd}_${order.id}`;
    await mailService.sendClientOrderMail(email, orderNum, amount);
    await mailService.sendAdminOrderMail(order);

    for (let item of items) {
      await OrderItem.create({
        name: item.name,
        price: item.price / parseInt(item.sizes[0]),
        qty:
          item.basket_prodact.qty + item.sizes[0].replace(/[^a-zа-яё]/gi, ""),
        orderId: order.id,
      });
    }
    const newOrder = await Order.findByPk(order.id, {
      include: [
        { model: OrderItem, as: "items", attributes: ["name", "price", "qty"] },
      ],
    });
    return newOrder;
  }

  static async update(id, status) {
    await Order.update({ status }, { where: { id } });
    const order = await Order.findByPk(id);
    return order;
  }

  static async delete(id) {
    const order = await Order.findByPk(id, {
      include: [{ model: OrderItem, attributes: ["name", "price", "qty"] }],
    });
    if (!order) throw new Error("Замовлення не знайдене у БД");
    await order.destroy();
    return order;
  }
};
