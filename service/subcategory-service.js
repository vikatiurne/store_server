const {Subcategory} =require('../models/models.js');

module.exports = class SubcategoryService {
  static async getSubcategory(id) {
    const subcategory = await Subcategory.findOne({ where: { id } });
    return await subcategory.name;
  }
}

