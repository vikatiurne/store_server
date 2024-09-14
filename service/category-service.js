const {Category}=require('../models/models.js');

module.exports = class CategoryService {
  static async getCategory(id) {
    const curentCategory = await Category.findOne({ where: { id } });
    return await curentCategory.name;
  }
}

