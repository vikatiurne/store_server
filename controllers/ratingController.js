const ApiError = require("../error/ApiError.js");
// const  Rating = require('../models/models.js');
const ratingService = require("../service/rating-service.js");

class RatingController {
  async create(req, res) {
    const { rating, prodactId, userId } = req.body;
    const ratingData = await ratingService.create(
      rating,
      prodactId,
      userId,
    );
    return res.json(ratingData);
  }

  async check(req, res) {
    const { prodactId, userId } = req.query;
    const data = await ratingService.checkVote(prodactId, userId);
    return res.json(data);
  }

  async getRating(req, res, next) {
    try {
      const { prodactId } = req.query;
      const data = await ratingService.getRating(prodactId);
      return res.json(data);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new RatingController();
