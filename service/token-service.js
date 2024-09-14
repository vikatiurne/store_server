const jwt = require('jsonwebtoken')
const {Token} = require('../models/models.js')

module.exports = class TokenService {
 static generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    });
    return { accessToken, refreshToken };
  }
  static generateResetToken(payload) {
    const token = jwt.sign(payload, process.env.JWT_RESET_PASSWORD_SECRET, {
      expiresIn: '20m',
    });

    return token;
  }
  static validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }
  static validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }
  static validateResetToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_RESET_PASSWORD_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }
  static async saveToken(userId, refreshToken, accessToken) {
    const tokenData = await Token.findOne({ where: { userId: userId } });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      tokenData.accessToken = accessToken;
      return tokenData.save();
    }
    const token = await Token.create({ userId, refreshToken, accessToken });
    return token;
  }
  static async removeToken(refreshToken) {
    const tokenData = await Token.destroy({ where: { refreshToken } });
    return tokenData;
  }
  static async findToken(refreshToken) {
    const tokenData = await Token.findOne({ where: { refreshToken } });
    return tokenData;
  }
  static async findAccessToken(accessToken) {
    const tokenData = await Token.findOne({ where: { accessToken } });
    return tokenData;
  }
}

