const { Prodact, Subcategory } = require("../models/models.js");
const subcategoryService = require("../service/subcategory-service.js");
const path = require("path");
const fs = require("fs");
const ApiError = require("../error/ApiError.js");

class SubcategoryController {
  async create(req, res) {
    const { name, categoryId } = req.body;
    const subcategory = await Subcategory.create({ name, categoryId });
    return res.json(subcategory);
  }
  async getAll(req, res) {
    const subcategory = await Subcategory.findAll();
    return res.json(subcategory);
  }
  async getOne(req, res, next) {
    try {
      const { id } = req.query;
      const subcaregory = await subcategoryService.getSubcategory(id);
      return res.json(subcaregory);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const prodact = await Prodact.findAll({ where: { subcategoryId: id } });
      if (!!prodact) {
        const images = [];
        prodact.map((item) => images.push(item.img));

        images.map((img) => {
          const __dirname = path.dirname("..");
          const pathFile = `${__dirname}/static/${img}`;
          fs.unlinkSync(pathFile);
        });
      }
      const delSubcategory = await Subcategory.destroy({ where: { id } });
      return res.json(delSubcategory);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { subcategoryName } = req.body;
      const updatedSubcategory = await Subcategory.update(
        { name: subcategoryName },
        { where: { id } }
      );
      return res.json(updatedSubcategory);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new SubcategoryController()