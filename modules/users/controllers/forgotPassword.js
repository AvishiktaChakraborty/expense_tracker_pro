const mongoose = require("mongoose");
const emailManager = require("../../../managers/emailManager");

const forgotPassword = async (req, res) => {
  const usersModel = mongoose.model("users");
  const { email } = req.body;

  if (!email) throw "Email is required";
  const getUser = await usersModel.findOne({
    email,
  });

  if (!getUser) throw "User dosn't exist";

  const resetCode = Math.floor(10000 + (await Math.random()) * 90000);

  await usersModel.updateOne(
    {
      email: email,
    },
    {
      reset_code: resetCode,
    },
    {
      runValidators: true,
    }
  );

  await emailManager(
    getUser.email,
    "Your password reset code is: " + resetCode,
    "Your password reset code is: " + resetCode,
    "Reset your password - Expense Tracker Pro"
  );

  res.status(200).json({
    status: "Reset code sent successfully",
  });
};

module.exports = forgotPassword;
