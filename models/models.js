const sequelize= require('../bd')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, defaultValue: 'User' },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: 'USER' },
  isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
  activationLink: { type: DataTypes.STRING },
  resetLink: { type: DataTypes.STRING, defaultValue: '' },
  phone: { type: DataTypes.STRING, unique: true },
  address: { type: DataTypes.STRING },
});

const Token = sequelize.define('token', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
  refreshToken: { type: DataTypes.STRING(1254), allowNull: false },
  accessToken: { type: DataTypes.STRING(1254), allowNull: false },
});

const Basket = sequelize.define('basket', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketProdact = sequelize.define('basket_prodact', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  qty: { type: DataTypes.INTEGER },
});

const Prodact = sequelize.define('prodact', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  rating: {
    type: DataTypes.NUMERIC({ precision: 5, decimals: 1, zerofill: false }),
    defaultValue: 0,
  },
  sizes: { type: DataTypes.ARRAY(DataTypes.STRING) },
  img: { type: DataTypes.STRING, allowNull: false },
});

const Category = sequelize.define('category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
});
const Subcategory = sequelize.define('subcategory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
});

const ProdactInfo = sequelize.define('prodact_info', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  discription: { type: DataTypes.STRING },
});

const Rating = sequelize.define('rating', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rate: { type: DataTypes.INTEGER, allowNull: false },
});

const Order = sequelize.define('order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  amount: {
    type: DataTypes.NUMERIC({ precision: 10, decimals: 1, zerofill: false }),
    allowNull: false,
  },
  status: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  comment: { type: DataTypes.STRING },
  readinessfor: { type: DataTypes.DATE, allowNull: false },
});

const OrderItem = sequelize.define('order_item', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  price: {
    type: DataTypes.NUMERIC({ precision: 5, decimals: 1, zerofill: false }),
    allowNull: false,
  },
  qty: { type: DataTypes.STRING, allowNull: false },
});

User.hasOne(Basket);
Basket.belongsTo(User);

User.hasOne(Token);
Token.belongsTo(User);

User.hasMany(Rating);
Rating.belongsTo(User);

Order.hasMany(OrderItem, { as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order);

User.hasMany(Order, { as: 'orders', onDelete: 'SET NULL' });
Order.belongsTo(User);

Basket.belongsToMany(Prodact, { through: BasketProdact, onDelete: 'CASCADE' });
Prodact.belongsToMany(Basket, { through: BasketProdact, onDelete: 'CASCADE' });

Basket.hasMany(BasketProdact);
BasketProdact.belongsTo(Basket);

// BasketProdact.hasOne(Prodact);
// Prodact.belongsTo(BasketProdact);

Prodact.hasMany(Rating, { onDelete: 'CASCADE' });
Rating.belongsTo(Prodact);

Category.hasMany(Prodact, { onDelete: 'CASCADE' });
Prodact.belongsTo(Category);

Subcategory.hasMany(Prodact, { onDelete: 'CASCADE' });
Prodact.belongsTo(Subcategory);

Prodact.hasMany(ProdactInfo, { as: 'info', onDelete: 'CASCADE' });
ProdactInfo.belongsTo(Prodact);

Category.hasMany(Subcategory, { onDelete: 'CASCADE' });
Subcategory.belongsTo(Category);

module.exports= {
  User,
  Basket,
  Order,
  OrderItem,
  Rating,
  BasketProdact,
  Prodact,
  ProdactInfo,
  Category,
  Subcategory,
  Token,
};
