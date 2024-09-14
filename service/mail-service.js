const nodemailer = require("nodemailer");

module.exports = class MailService {
   static transporter= nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 2525,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
 

  static async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `Активація акаунту на ${process.env.API_URL}`,
      text: "",
      html: ` <div>
                    <h1>Для активації акаунту YUMMY перейдіть за посиланням</h1>
                    <a href="${link}">${link}</a>
                </div>`,
    });
  }
  static async sendResetPasswordMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `Зміна паролю на ${process.env.API_URL}`,
      text: "",
      html: ` <div>
                    <h1>Натисніть на посилання для збросу пароля</h1>
                    <a href="${link}">${link}</a>
                </div>`,
    });
  }

  static async sendClientOrderMail(to, orderNum, amount) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `Замовлення на ${process.env.API_URL}`,
      text: "",
      html: ` <div>
                    <h1>Дякуємо за Ваше замовлення!!!</h1>
                    <p>№${orderNum} на суму ${amount}грн </p>
                    <p>Деталі замовлення доступні в особистому кабінеті на сайті ${process.env.CLIENT_URL} </p>
                    <p>Наш консультант зателефонує вам в найближчий час для уточнення деталей</p>
                </div>`,
    });
  }
  static async sendAdminOrderMail(data) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: `Нове замовлення на ${process.env.CLIENT_URL}`,
      text: "",
      html: ` <div>
                    <h1>Замовлення №${data.id} від ${data.name} на суму ${data.amount}грн</h1>
                    <h2>Tелефон: ${data.phone}, ${data.name} </h2>
                    <p>Коментарій: ${data.comment}</p>
                </div>`,
    });
  }
};
