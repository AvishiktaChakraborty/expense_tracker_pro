const nodemailer = require("nodemailer");

const emailManager = async(email, text, html, subject) => {
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "3bf0ef74b65606",
          pass: "552cd85d37d66f",
        },
      });
    
      await transport.sendMail({
        to: email,
        from: "info@expensetracker.com",
        text: text,
        html: html,
        subject: subject,
      });
};

module.exports = emailManager;