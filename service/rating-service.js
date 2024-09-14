const { Prodact, Rating }=require('../models/models.js');

module.exports = class RatingService {
  static async create(rating, prodactId, userId) {
    await Rating.create({ rate: rating, prodactId, userId });
    const ratingById = await Rating.findAll({ where: { prodactId } });

    const ratings = ratingById.reduce((acc, item) => acc + item.rate, 0);

    let updatedRating;
    ratingById.length
      ? (updatedRating = ratings / ratingById.length)
      : (updatedRating = rating);

     await Prodact.update(
      {
        rating: updatedRating,
      },
      { where: { id: prodactId } }
    );
    return updatedRating;
  }

  static async checkVote(prodactId, userId) {
    const curentUserRating = await Rating.findOne({
      where: { prodactId, userId },
    });
    if (!!curentUserRating)
      return { message: "Вашу оцінку цього товару вже враховано" };
    return null;
  }

  static async getRating(prodactId) {
    const curentProdact = await Prodact.findOne({ where: { id: prodactId } });
    return curentProdact.rating;
  }
}

