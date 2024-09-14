const ApiError = require("../error/ApiError.js");
const { Category, Prodact } = require("../models/models.js");
const categoryService = require("../service/category-service.js");
const path = require("path");
const fs = require("fs");

 class CategoryController {
  async create(req, res) {
    const { name } = req.body;
    const category = await Category.create({ name });
    return res.json(category);
  }
  async getAll(req, res) {
    const category = await Category.findAll();
    return res.json(category);
  }
  async getOne(req, res, next) {
    try {
      const { id } = req.query;
      const category = await categoryService.getCategory(id);
      return res.json(category);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const prodact = await Prodact.findAll({ where: { categoryId: id } });
      if (!!prodact) {
        const images = [];
        prodact.map((item) => images.push(item.img));

        images.map((img) => {
          const __dirname = path.dirname("..");
          const pathFile = `${__dirname}/static/${img}`;
          fs.unlinkSync(pathFile);
        });
      }
      const delCategory = await Category.destroy({ where: { id } });
      return res.json(delCategory);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { categoryName } = req.body;
      const updatedCategory = await Category.update(
        { name: categoryName },
        { where: { id } }
      );
      return res.json(updatedCategory);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new CategoryController()