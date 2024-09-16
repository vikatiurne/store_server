const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");

const ApiError = require("../error/ApiError.js");
const { User, Order } = require("../models/models.js");
const mailService = require("./mail-service.js");
const tokenService = require("./token-service.js");
const UserDto = require("../dtos/user-dto.js");

module.exports = class UserService {
  static async registration(email, password, role, name) {
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      throw ApiError.badRequest(`Користувач з e-mail: ${email} вже існує`);
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuidv4();
    const user = await User.create({
      name,
      email,
      password: hashPassword,
      role,
      activationLink,
    });

    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/user/activate/${activationLink}`
    );

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(
      userDto.id,
      tokens.refreshToken,
      tokens.accessToken
    );

    return { ...tokens, user: userDto };
  }

  static async activate(activationLink) {
    const user = await User.findOne({ activationLink });
    if (!user) {
      throw ApiError.badRequest("Некоректне посилання активації");
    }
    user.isActivated = true;
    await user.save();
  }

  static async update(id) {
    const user = await User.findByPk(id);
    const userDto = new UserDto(user);
    return userDto;
  }

  static async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw ApiError.badRequest(`Користувач ${email} не знайден`);
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.badRequest("Невірно вказаний пароль");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(
      userDto.id,
      tokens.refreshToken,
      tokens.accessToken
    );

    return { ...tokens, user: userDto };
  }
  static async logout(refreshToken) {
    return await tokenService.removeToken(refreshToken);
  }

  static async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.unauthorizedError();
    }
    const userData = await tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!tokenFromDb || !userData) {
      throw ApiError.unauthorizedError();
    }
    const user = await User.findOne({ where: { email: userData.email } });
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(
      userDto.id,
      tokens.refreshToken,
      tokens.accessToken
    );

    return { ...tokens, user: userDto };
  }

  static async getUser(token) {
    const tokenData = await tokenService.findAccessToken(token);
    const user = await User.findByPk(tokenData.userId);
    const userDto = new UserDto(user);
    return userDto;
  }
  static async getAllUsers() {
    const user = await User.findAndCountAll({
      where: { role: "USER" },
      attributes: ["name", "email", "phone"],
      include: [{ model: Order, as: "orders", attributes: ["amount"] }],
      distinct: true,
    });
    return user;
  }

  static async forgotPassword(email) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw ApiError.badRequest(`Користувач ${email} не знайден`);
    }
    const token = tokenService.generateResetToken({ id: user.id });
    await mailService.sendResetPasswordMail(
      email,
      `${process.env.CLIENT_URL}/resetpassword/${token}`
    );

    await User.update({ resetLink: token }, { where: { email } });
    return {
      message: `На пошту ${email} був відправлений лист з посиланням на скидання пароля`,
    };
  }

  static async resetPassword(newPass, resetLink) {
    if (!resetLink) {
      throw ApiError.unauthorizedError();
    }
    const userData = tokenService.validateResetToken(resetLink);
    let user = await User.findOne({ where: { resetLink } });
    if (!user || !userData) {
      throw ApiError.badRequest(`Користувач з цим токен не знайден`);
    }
    const hashPassword = await bcrypt.hash(newPass, 3);
    const obj = {
      password: hashPassword,
      resetLink: "",
    };
    user = _.extend(user, obj);
    await user.save();
    return { message: "Пароль змінено" };
  }
};
